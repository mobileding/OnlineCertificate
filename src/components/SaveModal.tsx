"use client";

import { X, Upload, FileSpreadsheet, Loader2, Save, Trash2, Crown, Lock } from "lucide-react";
import { useState, useEffect } from "react"; 
import { getUserLimits } from "../app/actions/user"; 
import { PricingModal } from "./PricingModal";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSingle: (name: string) => void;
  onSaveBulk: (names: string[]) => void;
  currentName: string;
}

export function SaveModal({ isOpen, onClose, onSaveSingle, onSaveBulk, currentName }: SaveModalProps) {
  const [mode, setMode] = useState<'manual' | 'csv'>('manual');
  
  const [manualText, setManualText] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [previewNames, setPreviewNames] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Default is null (Loading)
  const [userRules, setUserRules] = useState<any>(null);
  
  const [pricingState, setPricingState] = useState<{isOpen: boolean, reason: "guest_limit" | "free_limit"}>({
      isOpen: false,
      reason: "guest_limit"
  });

  useEffect(() => {
    if (isOpen) {
        setManualText(currentName);
        setCsvFile(null);
        setPreviewNames([]);
        setMode('manual');
        setUserRules(null); // Force loading state

        // Fetch limits
        getUserLimits().then((data) => {
            setUserRules(data);
        });
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  // Defaults
  const limit = userRules?.batchLimit ?? 5;
  const canUploadCsv = userRules?.canUploadCsv ?? false;
  const isPro = userRules?.tier === 'pro';
  const currentTier = userRules?.tier ? userRules.tier.charAt(0).toUpperCase() + userRules.tier.slice(1) : 'Loading...';

  const parseNames = (text: string) => {
      return text.split(/[\n,]/).map(n => n.trim()).filter(n => n.length > 0);
  };

  const checkLimits = (count: number) => {
      if (count > limit) {
          setPricingState({ 
            isOpen: true, 
            reason: userRules?.tier === 'guest' ? "guest_limit" : "free_limit" 
          });
          return false;
      }
      return true;
  };

  const handleManualProcess = async () => {
      const names = parseNames(manualText);
      if (names.length === 0) return;
      if (!checkLimits(names.length)) return;

      setIsProcessing(true);
      if (names.length === 1) onSaveSingle(names[0]); 
      else onSaveBulk(names); 
      setIsProcessing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const names = text.split(/\r?\n/).map(n => n.trim()).filter(n => n.length > 0 && n !== "Name");
        setPreviewNames(names);
      };
      reader.readAsText(file);
  };

  const clearFile = () => { setCsvFile(null); setPreviewNames([]); };

  const handleStandardProcess = async () => {
    if (!previewNames.length) return;
    setIsProcessing(true);
    onSaveBulk(previewNames);
    setIsProcessing(false);
  };

  const manualCount = parseNames(manualText).length;

  return (
    <>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header: Title + Tier Info */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0 bg-slate-50">
              <div className="flex flex-col">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    Save Certificate
                    {isPro && <span className="bg-amber-100 text-amber-600 text-[10px] px-2 py-0.5 rounded-full uppercase flex items-center gap-1"><Crown size={10} /> Pro</span>}
                  </h3>
                  {/* === CLEAN STATUS LINE === */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium mt-1">
                     <span className="uppercase tracking-wide text-slate-400">Current Plan:</span>
                     <span className={isPro ? "text-amber-600 font-bold" : "text-slate-700"}>{currentTier}</span>
                     <span className="text-slate-300">|</span>
                     <span className="uppercase tracking-wide text-slate-400">Batch Limit:</span>
                     <span className="text-slate-700">{isPro ? "Unlimited" : limit}</span>
                  </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 shrink-0">
              <button onClick={() => setMode('manual')} className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'manual' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}>Manual Entry</button>
              <button 
                onClick={() => canUploadCsv ? setMode('csv') : setPricingState({ isOpen: true, reason: 'free_limit' })} 
                className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${mode === 'csv' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'} ${!canUploadCsv ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
              >
                 {!canUploadCsv && <Lock size={12} />} Upload CSV
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {mode === 'manual' ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Recipient Names</label>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${manualCount > limit ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                            {manualCount} / {isPro ? '∞' : limit}
                        </span>
                    </div>
                    <textarea 
                        autoFocus
                        value={manualText}
                        onChange={(e) => setManualText(e.target.value)}
                        className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-40 resize-none"
                        placeholder={`John Doe\nJane Smith`}
                    />
                  </div>

                  <button 
                    onClick={handleManualProcess}
                    disabled={manualCount === 0 || isProcessing}
                    className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
                    {manualCount > 1 ? `Generate ${manualCount} Certificates` : "Save Certificate"}
                  </button>
                  
                  {manualCount > limit && (
                      <p className="text-xs text-red-500 text-center cursor-pointer hover:underline" onClick={() => setPricingState({isOpen: true, reason: 'free_limit'})}>
                          Limit Reached. Click to Upgrade.
                      </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {!csvFile ? (
                      <label className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer block group">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <FileSpreadsheet className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-sm font-bold text-slate-700 mb-1">Click to Upload CSV</p>
                        <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                      </label>
                  ) : (
                      <div className="space-y-3">
                          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                              <p className="text-xs font-bold text-slate-900 truncate">{csvFile.name}</p>
                              <button onClick={clearFile} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"><Trash2 size={16} /></button>
                          </div>
                          <button onClick={handleStandardProcess} disabled={!csvFile || isProcessing} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                            {isProcessing ? <Loader2 className="animate-spin" /> : <Upload size={18} />} Process Bulk CSV
                          </button>
                      </div>
                  )}
                </div>
              )}
            </div>
            
          </div>
        </div>

        <PricingModal 
            isOpen={pricingState.isOpen} 
            onClose={() => setPricingState({ ...pricingState, isOpen: false })} 
            reason={pricingState.reason} 
        />
    </>
  );
}