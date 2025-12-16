import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Generator } from "../../../components/Generator";

// 1. ENABLE THE DATABASE IMPORT (and disable the static one)
import { getTemplateBySlug } from "../../../app/actions/templates"; 
// import { getTemplate } from "../../../lib/templates"; 

interface Props {
  params: Promise<{ slug: string }>;
}

// 2. Fix Metadata to use DB
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // Fetch from DB
  const template = await getTemplateBySlug(slug);
  
  if (!template) return { title: "Certificate Not Found" };

  return {
title: `${template.title} (Free & Verifiable)`, // slightly optimized title
    description: template.description,
  };
}

// 3. Fix Main Page to use DB
export default async function TemplatePage({ params }: Props) {
  const { slug } = await params;
  
  // Fetch from DB
  const template = await getTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  // 4. Map DB fields to the format Generator expects
  const initialData = {
    // Remove "Generator" from title to keep the certificate clean
    certificate_title: template.title.replace(" Generator", "").replace(" Maker", ""),
    organization_name: "Organization Name",
    recipient_name_placeholder: "Recipient Name",
    action_text: "This placeholder text will be replaced by AI when you click Generate.",
    // Ensure we use the fields from the DB
    design_theme: template.design || "modern", 
    theme_color: template.color || "blue"
  };

  return (
<main className="min-h-screen bg-slate-50">
    
    {/* 1. THE HEADER (Great for SEO) */}
    <div className="bg-slate-900 text-white py-12 px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{template.title}</h1>
      <p className="text-slate-300 max-w-2xl mx-auto text-lg">{template.description}</p>
    </div>

    {/* 2. THE TOOL (The "Input Box" area) */}
    <div className="py-8">
      <Generator 
        initialPrompt={template.prompt} 
        initialData={initialData}
      />
    </div>

    {/* 3. NEW: THE SEO CONTENT BLOCK (Visible Text for Google) */}
    <section className="max-w-4xl mx-auto px-6 py-12 prose prose-slate">
      <h3>About this {template.title} Template</h3>
      <p>
        Use our free <strong>{template.title}</strong> to recognize achievements instantly. 
        Whether you need a {template.design} style or a professional layout, this tool 
        helps you generate the perfect document in seconds.
      </p>
      
      <h4>When to use this certificate?</h4>
      <p>
        This <strong>{template.title}</strong> is perfect for:
      </p>
      <ul>
        <li>Recognizing outstanding performance.</li>
        <li>Creating a memorable keepsake.</li>
        <li>Saving time with our AI-powered formatting.</li>
      </ul>

      <p className="text-sm text-slate-500 italic">
        *Tip: You can customize the AI prompt above to change the tone from 
        "{template.color}" to anything you like!
      </p>
    </section>

  </main>
  );
}