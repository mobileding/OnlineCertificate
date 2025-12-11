import { Metadata } from "next";
import { notFound } from "next/navigation";
// Go up 3 levels to find 'src', then into 'components'
import { Generator } from "../../../components/Generator";
// Go up 3 levels to find 'src', then into 'lib'
import { getTemplate } from "../../../lib/templates";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplate(slug);
  
  if (!template) return { title: "Certificate Not Found" };

  return {
    title: template.title,
    description: template.description,
  };
}

export default async function TemplatePage({ params }: Props) {
  const { slug } = await params;
  const template = getTemplate(slug);

  if (!template) {
    notFound();
  }

  const initialData = {
    certificate_title: template.title.replace(" Generator", "").replace(" Maker", ""),
    organization_name: "Organization Name",
    recipient_name_placeholder: "Recipient Name",
    action_text: "This placeholder text will be replaced by AI when you click Generate.",
    design_theme: template.design,
    theme_color: template.color
  };

  return (
    <main>
      {/* Hidden SEO Header */}
      <div className="bg-slate-900 text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">{template.title}</h1>
        <p className="text-slate-300 max-w-2xl mx-auto">{template.description}</p>
      </div>

      <Generator 
        initialPrompt={template.prompt} 
        initialData={initialData}
      />
    </main>
  );
}