"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const TIER_LIMITS = {
  GUEST: { BATCH_LIMIT: 5, CAN_UPLOAD_CSV: false },
  VERIFIED: { BATCH_LIMIT: 10, CAN_UPLOAD_CSV: false },
  PRO: { BATCH_LIMIT: 10000, CAN_UPLOAD_CSV: true }
};

export async function getUserLimits() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch { } },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // === SCENARIO 1: GUEST ===
  if (!user) {
    return { 
      tier: 'guest',
      isLoggedIn: false, 
      canSave: true, // <--- ADDED THIS BACK
      batchLimit: TIER_LIMITS.GUEST.BATCH_LIMIT,
      canUploadCsv: TIER_LIMITS.GUEST.CAN_UPLOAD_CSV,
    };
  }

  // === SCENARIO 2: CHECK PROFILE ===
  const { data: profile } = await supabase
    .from('profiles')
    .select('account_status, is_email_verified, subscription_tier') 
    .eq('id', user.id)
    .single();

  const isPro = profile?.subscription_tier === 'pro' && profile?.account_status === 'active';
  
  if (isPro) {
      return {
        tier: 'pro',
        isLoggedIn: true,
        canSave: true, // <--- ADDED THIS BACK (Crucial for the button)
        batchLimit: TIER_LIMITS.PRO.BATCH_LIMIT, 
        canUploadCsv: TIER_LIMITS.PRO.CAN_UPLOAD_CSV,
      };
  }

  // === SCENARIO 3: VERIFIED ===
  return {
    tier: 'verified',
    isLoggedIn: true,
    canSave: true, // <--- ADDED THIS BACK
    batchLimit: TIER_LIMITS.VERIFIED.BATCH_LIMIT,
    canUploadCsv: TIER_LIMITS.VERIFIED.CAN_UPLOAD_CSV,
  };
}