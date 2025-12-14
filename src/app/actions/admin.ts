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
    console.error("Admin Update Error:", error);
    return { success: false, error: error.message };
  }
}

// --- FUNCTION 2: BLOG MANAGEMENT ---
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

  // 2. Generate Base Slug (e.g., "World's Best Mom" -> "worlds-best-mom")
  let slug = title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/(^-|-$)/g, '');    // Remove leading/trailing hyphens

  try {
    // 3. CHECK FOR DUPLICATES (The Fix)
    // We use .maybeSingle() so it returns null (instead of crashing) if the slug is free
    const { data: existing } = await supabaseAdmin
      .from("templates")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle(); 

    // If it exists, append a random number (e.g., "best-dad" -> "best-dad-4291")
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

    // 5. Refresh the Admin List
    revalidatePath("/admin/seotemplate");
    return { success: true };

  } catch (error: any) {
    console.error("Template Create Error:", error);
    return { success: false, error: error.message };
  }
}

// ... (keep your existing imports and createSeoTemplate function)
// --- UPDATE: FETCH WITH PAGINATION ---
// (Replaces the old "Fetch All" function)
export async function getSeoTemplates(page = 1, pageSize = 10) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabaseAdmin
    .from('templates')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);
    
  if (error) {
    console.error('Error fetching templates:', error);
    return { data: [], total: 0 };
  }
  
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

    revalidatePath('/admin/seotemplate'); // Refresh the page
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}