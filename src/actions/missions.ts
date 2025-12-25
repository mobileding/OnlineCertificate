"use server";

import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSeoMissions(formData: FormData) {
  try {
    const strategy = formData.get("strategy") as string || "mixed";
    const customTopic = formData.get("custom_topic") as string || "General";
    
    // Base Rules
    const baseRules = `
      CRITICAL EXCLUSIONS:
      1. No Location terms ("near me", "local").
      2. No Specific years ("2019").
      3. No Illegal/Negative terms.
      4. No Nonsensical grammar.
      Output ONLY a raw JSON array of strings.
    `;

    let promptContext = "";

    // SWITCH LOGIC
    switch (strategy) {
      case "manual":
        promptContext = `
          Generate 10 keywords for the niche: "${customTopic}".
          Focus strictly on "${customTopic}" certificates, awards, and forms.
          Think about what a user would type to find a template for this specific topic.
        `;
        break;
      case "corporate":
        promptContext = `
          Generate 10 keywords for "Corporate & HR Recognition". 
          Focus on: Employee retention, years of service, leadership awards.
        `;
        break;
      case "education":
        promptContext = `
          Generate 10 keywords for "School & Education Certificates". 
          Focus on: Diplomas, attendance, honor roll, teacher appreciation.
        `;
        break;
      case "sports":
        promptContext = `
          Generate 10 keywords for "Sports & Coaching Awards". 
          Focus on: MVP, Most Improved, specific sports (Soccer, Basketball).
        `;
        break;
      case "holidays":
        promptContext = `
          Generate 10 keywords for "Seasonal & Holiday Certificates". 
          Focus on: Santa letters, Tooth Fairy, Birthday certificates.
        `;
        break;
      case "funny":
        promptContext = `
          Generate 10 keywords for "Funny & Novelty Awards". 
          Focus on: Lighthearted pranks, "World's Best Dad", positive humor.
        `;
        break;
      default:
        promptContext = `
          Generate 10 unique, long-tail keyword phrases related to printable certificates.
          Mix specific niches.
        `;
    }

    const finalPrompt = `
      You are an SEO expert. ${promptContext}
      ${baseRules}
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: [{ parts: [{ text: finalPrompt }] }],
      config: { responseMimeType: "application/json" } as any
    });

    const text = (response as any).text;
    const keywords = JSON.parse(text);

    if (!Array.isArray(keywords)) throw new Error("AI returned invalid format");

    // Correct Category Naming
    const categoryName = strategy === 'manual' 
        ? (customTopic.charAt(0).toUpperCase() + customTopic.slice(1)) 
        : (strategy.charAt(0).toUpperCase() + strategy.slice(1));

    const rows = keywords.map(kw => ({
        keyword: kw,
        status: 'pending',
        category: categoryName, 
        content_type: 'mixed'
    }));

    // FIX: Using Upsert to handle duplicates safely
    const { error } = await supabase
      .from('seo_missions')
      .upsert(rows, { onConflict: 'keyword', ignoreDuplicates: true });

    if (error) throw new Error(error.message);

    revalidatePath('/admin/tasks');
    return { success: true, count: keywords.length };

  } catch (error: any) {
    console.error("Mission Generation Error:", error);
    return { success: false, error: error.message };
  }
}