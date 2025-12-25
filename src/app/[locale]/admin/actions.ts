"use server";

// FIX 1: Use the standard client, NOT the SSR client
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Helper to get the God Mode Client
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

// 1. UPDATE VERIFICATION & NAME
export async function updateVerification(profileId: string, isVerified: boolean, orgName: string) {
  const supabase = getAdminClient();

  const { error } = await supabase
    .from('profiles')
    .update({ 
        is_org_verified: isVerified,
        organization_name: orgName 
    })
    .eq('id', profileId);

  if (error) {
    console.error("Update failed:", error);
    throw new Error(error.message);
  }

  revalidatePath('/admin');
}

// 2. DELETE USER
export async function deleteUser(profileId: string) {
  const supabase = getAdminClient();

  // 1. Delete from Auth (This cascades to profile usually)
  const { error } = await supabase.auth.admin.deleteUser(profileId);
  
  if (error) {
     console.error("Delete Error:", error);
     return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}