"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// 1. ADD ELITE DEFINITION HERE
const TIER_LIMITS = {
  GUEST:    { BATCH_LIMIT: 5,     CAN_UPLOAD_CSV: false },
  VERIFIED: { BATCH_LIMIT: 10,    CAN_UPLOAD_CSV: false },
  PRO:      { BATCH_LIMIT: 50,    CAN_UPLOAD_CSV: false }, // Pro gets simple list only
  ELITE:    { BATCH_LIMIT: 10000, CAN_UPLOAD_CSV: true  }  // Elite gets CSV upload
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
      canSave: true, 
      batchLimit: TIER_LIMITS.GUEST.BATCH_LIMIT,
      canUploadCsv: TIER_LIMITS.GUEST.CAN_UPLOAD_CSV,
    };
  }

  // === SCENARIO 2: CHECK PROFILE ===
  const { data: profile } = await supabase
    .from('profiles')
    .select('account_status, subscription_tier') 
    .eq('id', user.id)
    .single();

  const tier = profile?.subscription_tier || 'free';
  const isActive = profile?.account_status === 'active';

  // === CHECK ELITE ===
  if (tier === 'elite' && isActive) {
      return {
        tier: 'elite',
        isLoggedIn: true,
        canSave: true,
        batchLimit: TIER_LIMITS.ELITE.BATCH_LIMIT, 
        canUploadCsv: TIER_LIMITS.ELITE.CAN_UPLOAD_CSV,
      };
  }

  // === CHECK PRO ===
  if (tier === 'pro' && isActive) {
      return {
        tier: 'pro',
        isLoggedIn: true,
        canSave: true,
        batchLimit: TIER_LIMITS.PRO.BATCH_LIMIT, 
        canUploadCsv: TIER_LIMITS.PRO.CAN_UPLOAD_CSV,
      };
  }

  // === SCENARIO 3: FREE / VERIFIED ===
  return {
    tier: 'free', // Changed from 'verified' to match standard naming
    isLoggedIn: true,
    canSave: true,
    batchLimit: TIER_LIMITS.VERIFIED.BATCH_LIMIT,
    canUploadCsv: TIER_LIMITS.VERIFIED.CAN_UPLOAD_CSV,
  };
}