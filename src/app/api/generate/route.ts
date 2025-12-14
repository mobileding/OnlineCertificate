import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.prompt || "Default Award";

    // 1. Initialize Client
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 2. Define System Instruction
    const systemInstruction = `
      You are a professional design assistant. Output ONLY raw JSON.
      Extract fields: certificate_title, organization_name, recipient_name_placeholder, action_text, design_theme, theme_color.
      If the prompt contains explicit, offensive, or inappropriate content, return a JSON with an error field: {"error": "Content violation"}.
    `;

    // 3. Attempt Generation with SAFETY FILTERS
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-lite", 
      contents: [{ parts: [{ text: systemInstruction + "\n\nUser Scenario: " + prompt }] }],
      // NEW: Strict Safety Settings
      config: {
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" },
        ]
      }
    });

    const resultText = response.text; // Fixed from .text()
    
    // Check if the AI itself refused to answer (it might return empty text or a refusal)
    if (!resultText) {
       throw new Error("Safety Block: The AI refused to generate this certificate.");
    }

    const cleanedText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(cleanedText);

    // Double check if our system instruction caught it
    if (parsedData.error) {
       return NextResponse.json({ error: "Policy Violation: Inappropriate content detected." }, { status: 400 });
    }
    
    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("API Error:", error.message);
    
    // Handle Safety Violations specifically
    if (error.message.includes("Safety") || error.message.includes("candidate")) {
        return NextResponse.json({ error: "Your request was blocked by our safety filters." }, { status: 400 });
    }

    return NextResponse.json({
      error: "Service unavailable. Please try again."
    }, { status: 500 });
  }
}