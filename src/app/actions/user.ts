"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const FREE_LIMIT = parseInt(process.env.NEXT_PUBLIC_FREE_CERT_LIMIT || '50');

export async function getUserLimits() {
  const cookieStore = await cookies(); // Added await for Next.js 15 support

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

  if (!user) {
    return { 
      isLoggedIn: false, 
      count: 0, 
      limit: FREE_LIMIT,
      canSave: false, // Cannot save if not logged in
      reason: "Please log in to save certificates."
    };
  }
  
  // 1. Count the user's saved certificates
  const { count } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true }) 
    .eq('user_id', user.id);

  const currentCount = count || 0;
  const canSave = currentCount < FREE_LIMIT;
  
  let reason = "";
  if (!canSave) {
    reason = `You have reached the free tier limit of ${FREE_LIMIT} certificates. Upgrade to save more!`;
  } else if (currentCount > FREE_LIMIT - 5) {
     reason = `You have ${FREE_LIMIT - currentCount} saves remaining in the free tier.`;
  }
  
  return {
    isLoggedIn: true,
    count: currentCount,
    limit: FREE_LIMIT,
    canSave,
    reason
  };
}