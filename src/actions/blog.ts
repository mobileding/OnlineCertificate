"use server";

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from 'next/cache';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --- CONFIG ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// --- HELPER 1: ADMIN CLIENT (For DB Writes & Uploads) ---
// Uses Service Role Key to bypass RLS and ensure the write always succeeds
function getAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// --- HELPER 2: USER CLIENT (To get the Author ID) ---
// Uses Cookies to identify who is currently logged in
async function getCurrentUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: { getAll() { return cookieStore.getAll() } }
  });
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ==========================================
// 1. FETCH POSTS (With Pagination)
// ==========================================
export async function getBlogPosts(page = 1, pageSize = 10) {
  const supabase = getAdminClient();
  
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);
    
  if (error) {
    // Return empty data on error to prevent crash
    return { data: [], total: 0 };
  }
  
  return { data: data || [], total: count || 0 };
}

// ==========================================
// 2. CREATE POST (With Image Upload)
// ==========================================
export async function createBlogPost(formData: FormData) {
  const supabase = getAdminClient();
  const user = await getCurrentUser(); // Get the logged-in user for author_id
  
  // A. HANDLE IMAGE UPLOAD
  const imageFile = formData.get('cover_image') as File;
  let cover_image_url = ""; 

  if (imageFile && imageFile.size > 0) {
    const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    
    // Upload to 'blog-images' bucket
    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filename, imageFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: imageFile.type
      });

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      throw new Error('Failed to upload image');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filename);
      
    cover_image_url = publicUrl;
  }

  // B. PREPARE DATA
  const rawData = {
    slug: formData.get('slug') as string,
    title: formData.get('title') as string,
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string, 
    cover_image: cover_image_url, 
    author_id: user?.id, 
    is_published: formData.get('is_published') === 'on',
  };

  // C. INSERT INTO DB
  const { error } = await supabase
    .from('posts')
    .insert([rawData]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/blog');
  return { success: true };
}

// ==========================================
// 3. UPDATE POST
// ==========================================
export async function updateBlogPost(formData: FormData) {
  const supabase = getAdminClient();
  
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const slug = formData.get('slug') as string;
  const is_published = formData.get('is_published') === 'on';
  
  // Handle new image upload OR keep old one
  const imageFile = formData.get('cover_image') as File;
  let cover_image_url = formData.get('existing_cover_image') as string; // You need to pass this hidden input if no new file

  if (imageFile && imageFile.size > 0) {
     const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
     await supabase.storage.from('blog-images').upload(filename, imageFile);
     const { data } = supabase.storage.from('blog-images').getPublicUrl(filename);
     cover_image_url = data.publicUrl;
  }

  // Generate Slug if empty
  const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const { error } = await supabase
    .from('posts') 
    .update({
      title,
      slug: finalSlug,
      excerpt,
      content,
      cover_image: cover_image_url,
      is_published
    })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/blog'); 
  revalidatePath(`/blog/${finalSlug}`);
  revalidatePath(`/admin/blog/${id}`);
  
  redirect('/admin/blog');
}

// ==========================================
// 4. DELETE POST
// ==========================================
export async function deleteBlogPost(formData: FormData) {
  const supabase = getAdminClient();
  const id = formData.get("id") as string;
  
  const { error } = await supabase.from("posts").delete().eq("id", id);
  
  if (!error) {
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
  }
  return { success: !error };
}

// ==========================================
// 5. TOGGLE STATUS
// ==========================================
export async function togglePostStatus(formData: FormData) {
  const supabase = getAdminClient();
  const id = formData.get("id") as string;
  const currentStatus = formData.get("current_status") === "true"; 
  
  const { error } = await supabase
    .from("posts")
    .update({ is_published: !currentStatus })
    .eq("id", id);
  
  if (!error) {
    revalidatePath("/admin/blog");
    revalidatePath("/blog"); 
  }
  
  return { success: !error };
}