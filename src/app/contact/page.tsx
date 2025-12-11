import { Mail, MessageSquare, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Get in Touch</h1>
          <p className="text-slate-500 mt-2 text-lg">
            Have questions about your certificates? We're here to help.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Email Support */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center hover:shadow-md transition-shadow">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Email Support</h3>
            <p className="text-slate-500 text-sm mb-6">
              For general inquiries, account issues, or partnership opportunities.
            </p>
            <a 
              href="mailto:support@onlinecertificate.org" 
              className="text-blue-600 font-bold hover:underline"
            >
              support@onlinecertificate.org
            </a>
          </div>

          {/* Quick FAQ / Help */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center hover:shadow-md transition-shadow">
            <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="text-green-600 w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Live Chat</h3>
            <p className="text-slate-500 text-sm mb-6">
              Available Mon-Fri, 9am - 5pm EST. Look for the chat bubble in the corner.
            </p>
            <span className="inline-block bg-slate-100 text-slate-500 px-4 py-2 rounded-lg text-sm font-medium">
              Coming Soon
            </span>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <details className="group bg-white p-4 rounded-xl border border-slate-200 cursor-pointer">
              <summary className="font-medium text-slate-800 list-none flex justify-between items-center">
                <span>Are the certificates free?</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                Yes! You can generate and download unlimited PDF certificates for free. Verification features require a free account.
              </p>
            </details>

            <details className="group bg-white p-4 rounded-xl border border-slate-200 cursor-pointer">
              <summary className="font-medium text-slate-800 list-none flex justify-between items-center">
                <span>How long do verification links last?</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                Verification links are permanent as long as your account remains active and in good standing.
              </p>
            </details>

             <details className="group bg-white p-4 rounded-xl border border-slate-200 cursor-pointer">
              <summary className="font-medium text-slate-800 list-none flex justify-between items-center">
                <span>How can I get a "Verified Business" badge?</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                Currently, we automatically verify accounts that sign up with a custom business domain (e.g., name@company.com).
              </p>
            </details>
          </div>
        </div>

      </div>
    </main>
  );
}