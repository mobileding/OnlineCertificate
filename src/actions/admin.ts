"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// ⚠️ SECURITY: We use the SERVICE_ROLE_KEY to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

// --- FUNCTION 1: USER MANAGEMENT ---
export async function updateVerification(userId: string, newStatus: boolean, orgName: string) {
  try {
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ 
        is_org_verified: newStatus,
        organization_name: orgName 
      })
      .eq("id", userId);

    if (error) throw error;

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    // eslint-disable-next-line no-console
    return { success: false, error: error.message };
  }
}

// --- FUNCTION 2: BLOG MANAGEMENT ---
// (Note: You mentioned you have blog.ts, but we keep this here just in case specific old code needs it)
export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  
  // Auto-generate slug (e.g. "My Title" -> "my-title")
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    const { error } = await supabaseAdmin
      .from("posts")
      .insert([{ 
        title, 
        content, 
        excerpt, 
        slug, 
        is_published: true 
      }]);

    if (error) throw error;
    revalidatePath("/blog");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- FUNCTION 3: SEO TEMPLATE MANAGEMENT ---
export async function createSeoTemplate(formData: FormData) {
  // 1. Extract Data from the Form
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const prompt = formData.get("prompt") as string;
  const color = (formData.get("color") as string) || "blue";
  const design = (formData.get("design") as string) || "modern";

  // 2. Generate Base Slug
  let slug = title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') 
    .replace(/(^-|-$)/g, '');    

  try {
    // 3. CHECK FOR DUPLICATES
    const { data: existing } = await supabaseAdmin
      .from("templates")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle(); 

    // If it exists, append a random number
    if (existing) {
      slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
    }

    // 4. Insert the new record
    const { error } = await supabaseAdmin
      .from("templates")
      .insert([{ 
        slug,
        title, 
        description, 
        prompt, 
        color, 
        design
      }]);

    if (error) throw error;

    revalidatePath("/admin/seotemplate");
    return { success: true };

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- UPDATE: FETCH SEO TEMPLATES (WITH PAGINATION) ---
export async function getSeoTemplates(page = 1, pageSize = 10) {
  // 1. Calculate the database range
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // 2. Fetch data + count
  const { data, count, error } = await supabaseAdmin
    .from('templates')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);
    
  if (error) {
    // Return empty structure on error so the page doesn't crash
    return { data: [], total: 0 }; 
  }
  
  // 3. Return the exact object structure your page.tsx expects
  return { data: data || [], total: count || 0 };
}
// --- NEW: DELETE TEMPLATE ---
export async function deleteSeoTemplate(formData: FormData) {
  const id = formData.get('id') as string;
  
  if (!id) return { success: false, error: 'No ID provided' };

  try {
    const { error } = await supabaseAdmin
      .from('templates')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/seotemplate');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}