import React from 'react';
import { CheckCircle, Download, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  count: number;
}

export const SuccessModal = ({ isOpen, onClose, count }: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm text-center p-8 transform transition-all scale-100 animate-in zoom-in-95">
        
        {/* Animated Checkmark */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Batch Complete!</h2>
        
        <p className="text-slate-500 mb-6">
          Successfully generated <strong className="text-slate-800">{count} certificates</strong>.<br/>
          Your ZIP file has started downloading.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <div className="bg-white p-2 rounded shadow-sm">
             <Download className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-400 uppercase">File Status</p>
            <p className="text-sm font-semibold text-slate-700">Download Started...</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
        >
          Awesome, Thanks!
        </button>

      </div>
    </div>
  );
};