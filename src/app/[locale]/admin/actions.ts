"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Helper to get the God Mode Client (Service Role)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    {
      auth: {
        autoRefreshToken: false, // Don't try to refresh tokens
        persistSession: false    // Don't save sessions
      }
    }
  );
}

// 1. UPDATE ANY PROFILE FIELD (Generic)
// This handles is_org_verified, is_website_verified, organization_name, etc.
export async function updateProfileField(userId: string, updates: any) {
  const supabase = getAdminClient();

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error("Update failed:", error);
    throw new Error(error.message);
  }

  // Revalidate the admin page so the UI updates immediately
  revalidatePath('/[locale]/admin', 'page'); 
  return { success: true };
}

// 2. DELETE USER
export async function deleteUser(profileId: string) {
  const supabase = getAdminClient();

  // Delete from Auth (This usually cascades to delete the profile too)
  const { error } = await supabase.auth.admin.deleteUser(profileId);
  
  if (error) {
     console.error("Delete Error:", error);
     return { success: false, error: error.message };
  }

  revalidatePath('/[locale]/admin', 'page');
  return { success: true };
}