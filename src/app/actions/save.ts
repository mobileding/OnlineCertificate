"use server";

import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Admin Client (for Guest saves)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function saveCertificate(data: any, isBulk = false) {
  const cookieStore = await cookies();
  
  // 1. Try to get the current user
  const supabase = createServerClient(
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
            )
          } catch {
            // Ignored for read-only actions
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // === 2. GUEST LOGIC (Not Logged In) ===
  if (!user) {
    // Growth Hook: Limit Check
    if (isBulk && Array.isArray(data) && data.length > 5) {
        return { success: false, error: "GuestLimit", message: "Guests can only bulk upload 5 names. Please sign up for more!" };
    }

    // Insert Data
    // FIX 1: Added ': any' type definition here
    let query: any = supabaseAdmin.from('certificates').insert(data).select('id, verification_code');
    
    // IMPORTANT: Only use .single() if it is NOT a bulk operation
    if (!isBulk) {
        query = query.single();
    }

    const { data: savedData, error } = await query;

    if (error) return { success: false, error: error.message };
    
    // Return appropriate format
    if (isBulk) {
        return { success: true, guest: true, count: Array.isArray(savedData) ? savedData.length : 0 };
    } else {
        return { success: true, guest: true, id: savedData.id, code: savedData.verification_code };
    }
  }

  // === 3. USER LOGIC (Logged In) ===
  
  // Prepare Data: We must inject 'issuer_id' into the payload
  let finalData;
  if (isBulk && Array.isArray(data)) {
      // Map over array to add ID to every item
      finalData = data.map(item => ({ ...item, issuer_id: user.id }));
  } else {
      // Add ID to single object
      finalData = { ...data, issuer_id: user.id };
  }

  // Insert Data
  // FIX 2: Added ': any' type definition here as well
  let query: any = supabase.from('certificates').insert(finalData).select('id, verification_code');

  // IMPORTANT: Only use .single() if it is NOT a bulk operation
  if (!isBulk) {
      query = query.single();
  }

  const { data: savedData, error } = await query;

  if (error) return { success: false, error: error.message };
  
  return { success: true, guest: false };
}