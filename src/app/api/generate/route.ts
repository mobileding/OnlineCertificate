import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.prompt || "Default Award";

    console.log("Attempting to generate for:", prompt);

    // 1. Try to initialize the client
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 2. Define System Instruction
    const systemInstruction = `
      You are a creative design assistant. Output ONLY raw JSON.
      Extract fields: certificate_title, organization_name, recipient_name_placeholder, action_text, design_theme, theme_color.
    `;

    // 3. Attempt Generation
    // We use a timeout so it doesn't hang if the API is slow
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-lite", 
      contents: [{ parts: [{ text: systemInstruction + "\n\nUser Scenario: " + prompt }] }]
    });

    const resultText = response.text(); 
    const cleanedText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanedText));

  } catch (error: any) {
    console.warn("⚠️ API Failed (Likely Quota Limit). Using MOCK data instead.");
    console.error("Actual Error:", error.message);

    // 4. FALLBACK: Return Mock Data if API fails
    // This allows you to work on the UI even without a working API key!
    return NextResponse.json({
      certificate_title: "Certificate of Patience",
      organization_name: "Dev Mode Systems",
      recipient_name_placeholder: "Future Developer",
      action_text: "For successfully testing the application UI while waiting for the API quota to refresh.",
      design_theme: "Modern",
      theme_color: "#4F46E5" // Indigo
    });
  }
}