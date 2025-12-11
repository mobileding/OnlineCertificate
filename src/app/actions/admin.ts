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