"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// --- HELPER: Create a Server Client Manually ---
async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Context: setAll was called from a Server Component.
          }
        },
      },
    }
  );
}
// ------------------------------------------------

// 1. Fetch All (For Admin List)
export async function getTemplates() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
  return { success: !error, data: data || [] };
}

// 2. Fetch Single (For Public Landing Page)
export async function getTemplateBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('templates').select('*').eq('slug', slug).single();
  return data;
}

// 3. Save (Create or Update)
export async function saveTemplate(formData: any) {
  const supabase = await createClient();
  
  const payload = {
    slug: formData.slug.toLowerCase().replace(/ /g, '-'), // Auto-format slug
    title: formData.title,
    description: formData.description,
    prompt: formData.prompt,
    color: formData.color,
    design: formData.design
  };

  let error;
  if (formData.id) {
    // Update existing
    const { error: e } = await supabase.from('templates').update(payload).eq('id', formData.id);
    error = e;
  } else {
    // Insert new
    const { error: e } = await supabase.from('templates').insert([payload]);
    error = e;
  }

  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin');
  revalidatePath(`/create/${payload.slug}`);
  return { success: true };
}

// 4. Delete
export async function deleteTemplate(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('templates').delete().eq('id', id);
  revalidatePath('/admin');
  return { success: !error };
}