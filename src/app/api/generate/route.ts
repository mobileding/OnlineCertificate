import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.prompt || "Default Award";

    // 1. Initialize Client (New SDK)
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 2. Define System Instruction
    // UPDATED: Added 'signature_text' to extracted fields and specific logic to handle "from X"
    const systemInstruction = `
      You are a specific JSON generator for novelty and appreciation awards. 
      You are NOT a medical or legal professional. This is for fun/recognition only.
      
      Output ONLY raw JSON. No markdown. No pre-text.
      Extract fields: certificate_title, organization_name, recipient_name_placeholder, action_text, signature_text, design_theme, theme_color.
      
      CRITICAL RULES:
      1. If the user says "signed by X", "from X", or "with gratitude from X", extract "X" into 'signature_text'.
      2. REMOVE the "from X" phrase from 'action_text'. Keep the action text focused on the accomplishment.
      3. If the prompt implies a medical diagnosis or legal judgement, generalize it to "Service Award" or "Participation" to stay safe.
      
      Example JSON Structure:
      {
        "certificate_title": "Employee of the Month",
        "organization_name": "Company Inc",
        "recipient_name_placeholder": "John Doe",
        "action_text": "For outstanding work and dedication.",
        "signature_text": "Tim Ding",
        "design_theme": "Modern",
        "theme_color": "blue"
      }
    `;

    // 3. Attempt Generation (Gemini 2.0)
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-lite", 
      contents: [{ parts: [{ text: systemInstruction + "\n\nUser Scenario: " + prompt }] }],
      // FIX: We cast 'config' to 'any' to stop the "HARM_CATEGORY" type error
      config: {
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
        ]
      } as any
    });

    // 4. Extract Text
    // IMPORTANT: In the new SDK, .text is a PROPERTY, not a function.
    // We cast response to 'any' to stop TypeScript from complaining about it.
    const resultText = (response as any).text; 
    
    console.log("AI Response:", resultText);

    if (!resultText) {
       throw new Error("Empty response from AI.");
    }

    // 5. Clean & Parse
    const cleanedText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let parsedData;
    try {
        parsedData = JSON.parse(cleanedText);
    } catch (e) {
        console.error("JSON Parse Error:", cleanedText);
        return NextResponse.json({ 
            error: "The AI refused to generate this request." 
        }, { status: 400 });
    }

    if (parsedData.error) {
       return NextResponse.json({ error: "Policy Violation." }, { status: 400 });
    }
    
    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json({
      error: error.message || "Service unavailable."
    }, { status: 500 });
  }
}