"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- HELPER: Database Connection ---
async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
           try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  );
}

// 1. FETCH POSTS (With Pagination)
export async function getBlogPosts(page = 1, pageSize = 10) {
  const supabase = await createClient();
  
  // Calculate range
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // We fetch ALL posts (drafts and published) for the admin
  const { data, count, error } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);
    
  if (error) {
    console.error('Error fetching posts:', error);
    return { data: [], total: 0 };
  }
  
  return { data: data || [], total: count || 0 };
}

// 2. CREATE POST (Updated for new Schema)
// ... existing imports
// Make sure you import this if not already there:
// import { createClient } from '@supabase/supabase-js';

export async function createBlogPost(formData: FormData) {
  const supabase = getAdminClient();
  
  // 1. HANDLE IMAGE UPLOAD
  const imageFile = formData.get('cover_image') as File;
  let cover_image_url = ""; // Default empty

  if (imageFile && imageFile.size > 0) {
    // Generate unique filename (e.g., 17099232-my-image.png)
    const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    
    // Upload to 'blog-images' bucket
    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filename, imageFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      throw new Error('Failed to upload image');
    }

    // Get the Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filename);
      
    cover_image_url = publicUrl;
  } else {
    // Fallback: Check if user pasted a string URL (optional, if you want to support both)
    // cover_image_url = formData.get('cover_image_url') as string || "";
  }

  // 2. PREPARE DATA
  const rawData = {
    slug: formData.get('slug') as string,
    title: formData.get('title') as string,
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string, // Note: 'content' matches your textarea name
    cover_image: cover_image_url, // <--- USE THE NEW URL
    author_id: user?.id, // <--- MATCHES YOUR SCHEMA 'author_id'
    is_published: formData.get('is_published') === 'on', // Checkbox sends 'on'
  };

  // 3. INSERT INTO DB
  const { error } = await supabase
    .from('posts') // Ensure this matches your table name (posts vs blog_posts)
    .insert([rawData]);

  if (error) {
    console.error('DB Error:', error); // Helpful for debugging
    throw new Error(error.message);
  }

  revalidatePath('/admin/blog');
  return { success: true };
}



// src/app/actions/blog.ts

export async function updateBlogPost(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const cover_image = formData.get('cover_image') as string;
  const slug = formData.get('slug') as string;
  const is_published = formData.get('is_published') === 'on';

  // 1. GENERATE SLUG (if empty)
  const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const { error } = await supabase
    .from('posts') // <--- FIXED: Table name is 'posts'
    .update({
      title,
      slug: finalSlug,
      excerpt,
      content,
      cover_image,
      is_published
      // removed 'updated_at' because your table doesn't have it
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating post:', error);
    return { error: error.message };
  }

  // Revalidate paths
  revalidatePath('/admin/blog'); 
  revalidatePath(`/blog/${finalSlug}`);
  revalidatePath(`/admin/blog/${id}`);
  
  redirect('/admin/blog');
}





// 3. DELETE POST
export async function deleteBlogPost(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  
  const { error } = await supabase.from("posts").delete().eq("id", id);
  
  if (!error) {
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
  }
  return { success: !error };
}

// src/app/actions/blog.ts
// 4. toggle status

export async function togglePostStatus(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const currentStatus = formData.get("current_status") === "true"; // Convert string to boolean
  
  // Flip the boolean (True -> False, False -> True)
  const { error } = await supabase
    .from("posts")
    .update({ is_published: !currentStatus })
    .eq("id", id);
  
  if (!error) {
    revalidatePath("/admin/blog");
    revalidatePath("/blog"); // Refresh public page
    revalidatePath(`/blog`); // Refresh specific pages might need individual revalidation but this covers the list
  }
  
  return { success: !error };
}