import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getTemplates } from "@/app/actions/templates";
import { getTranslations } from "next-intl/server";
import { LayoutTemplate, ArrowRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Templates" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
  };
}

// Simple deterministic accent color per template, so cards feel distinct
// without needing a color field to be set on every row.
const ACCENTS = ["#2563eb", "#d97706", "#dc2626", "#10b981", "#4f46e5", "#ec4899"];

export default async function TemplatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Templates" });

  const { data: templates } = await getTemplates();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t("title")}</h1>
        <p className="text-slate-300 max-w-2xl mx-auto text-lg">{t("subtitle")}</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {templates.length === 0 ? (
          <div className="text-center py-24">
            <LayoutTemplate className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500">{t("empty_state")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template: any, i: number) => {
              const accent = template.color || ACCENTS[i % ACCENTS.length];
              return (
                <Link
                  key={template.id}
                  href={`/create/${template.slug}`}
                  className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
                >
                  <div
                    className="h-2 w-full"
                    style={{ backgroundColor: accent }}
                  />
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-serif font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-grow">
                      {template.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-blue-600">
                      {t("cta_use")} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
