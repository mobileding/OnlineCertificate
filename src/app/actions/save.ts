"use server";

import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// 1. DEFINE RULES
const TIER_LIMITS = {
  GUEST: 5,
  VERIFIED: 10,
  PRO: 10000
};

// Admin Client (Bypasses RLS for Guest saves)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function saveCertificate(data: any, isBulk = false) {
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

  // 2. Identify User
  const { data: { user } } = await supabase.auth.getUser();

  // 3. DETERMINE LIMIT (The Security Check)
  let allowedLimit = TIER_LIMITS.GUEST; // Default to 5

  if (user) {
      // Fetch profile to see if Pro or Verified
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, account_status, is_email_verified')
        .eq('id', user.id)
        .single();

      const isPro = profile?.subscription_tier === 'pro' && profile?.account_status === 'active';
      // User is verified if Profile says so OR Supabase Auth says so
      const isVerified = profile?.is_email_verified || user.email_confirmed_at;

      if (isPro) {
          allowedLimit = TIER_LIMITS.PRO;
      } else if (isVerified) {
          allowedLimit = TIER_LIMITS.VERIFIED;
      }
  }

  // 4. CHECK THE COUNT
  const itemsToSave = isBulk && Array.isArray(data) ? data : [data];
  
  if (itemsToSave.length > allowedLimit) {
      return { 
          success: false, 
          error: "LimitExceeded", 
          message: `Limit exceeded. You are trying to save ${itemsToSave.length}, but your limit is ${allowedLimit}.` 
      };
  }

  // === 5. GUEST PATH (Use Admin Client) ===
  if (!user) {
    let query: any = supabaseAdmin.from('certificates').insert(data).select('id, verification_code');
    
    if (!isBulk) {
        query = query.single();
    }

    const { data: savedData, error } = await query;

    if (error) return { success: false, error: error.message };
    
    if (isBulk) {
        return { success: true, guest: true, count: Array.isArray(savedData) ? savedData.length : 0 };
    } else {
        return { success: true, guest: true, id: savedData.id, code: savedData.verification_code };
    }
  }

  // === 6. USER PATH (Use Auth Client) ===
  
  // FIX: Change 'issuer_id' to 'user_id' so it matches your database!
  let finalData;
  if (isBulk && Array.isArray(data)) {
      finalData = data.map(item => ({ ...item, user_id: user.id }));
  } else {
      finalData = { ...data, user_id: user.id };
  }

  let query: any = supabase.from('certificates').insert(finalData).select('id, verification_code');

  if (!isBulk) {
      query = query.single();
  }

  const { data: savedData, error } = await query;

  if (error) return { success: false, error: error.message };
  
  return { success: true, guest: false, code: isBulk ? null : savedData.verification_code };
}