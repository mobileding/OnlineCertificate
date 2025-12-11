import { CheckCircle, X, Copy, ExternalLink, Download } from "lucide-react";
import Link from "next/link";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  count: number; // 1 for single, >1 for bulk
  code?: string; // NEW: The verification code (optional)
}

export function SuccessModal({ isOpen, onClose, count, code }: SuccessModalProps) {
  if (!isOpen) return null;

  const isBulk = count > 1;
  const verifyUrl = code ? `https://onlinecertificate.org/verify/${code}` : "#";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-green-600 p-6 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-md">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isBulk ? "Batch Processing Complete!" : "Certificate Saved!"}
          </h2>
          <p className="text-green-100 mt-1 text-sm">
            {isBulk 
              ? `${count} certificates have been generated and zipped.` 
              : "Your certificate is now verifiable on the blockchain."}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* SHOW THE CODE (Single Mode Only) */}
          {!isBulk && code && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Verification ID</p>
              <div className="flex items-center justify-center gap-3">
                <code className="text-2xl font-mono font-bold text-slate-800 tracking-wider">
                  {code}
                </code>
                <button 
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                  title="Copy Code"
                >
                  <Copy size={16} />
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200">
                 <Link 
                   href={`/verify/${code}`} 
                   target="_blank"
                   className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
                 >
                   Test Link <ExternalLink size={12} />
                 </Link>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-3">
             <button 
               onClick={onClose}
               className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
             >
               {isBulk ? "Download & Close" : "Done"}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}