import Link from 'next/link';
import { ShieldAlert, Search, ArrowLeft, Home } from 'lucide-react';

export default function CertificateNotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-center">
        
        {/* Header Color Bar */}
        <div className="h-2 bg-red-500 w-full"></div>

        <div className="p-8">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} />
          </div>

          {/* Text */}
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Certificate Not Found
          </h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            We couldn't locate a valid record for this ID. It may have been entered incorrectly or the certificate does not exist in our registry.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link 
              href="/verify"
              className="flex items-center justify-center gap-2 w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-all"
            >
              <Search size={16} /> Verify Another Code
            </Link>
            
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 w-full h-11 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-all"
            >
              <Home size={16} /> Return Home
            </Link>
          </div>
        </div>

        {/* Footer Help */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-xs text-slate-400">
          Need help? Contact support at <a href="#" className="underline hover:text-slate-600">support@onlinecertificate.org</a>
        </div>
      </div>
    </main>
  );
}