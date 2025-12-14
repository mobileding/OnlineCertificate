"use client";

import { X, Upload, FileSpreadsheet, Loader2, Save, User, Trash2, FileText, CheckCircle2, Crown, List } from "lucide-react";
import { useState, useEffect } from "react"; 
import { getUserLimits } from "../app/actions/user"; 
import { useRouter } from "next/navigation"; 
import { PricingModal } from "./PricingModal";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSingle: (name: string) => void;
  onSaveBulk: (names: string[]) => void;
  currentName: string;
}

const FREE_BULK_ROWS = 10; 

export function SaveModal({ isOpen, onClose, onSaveSingle, onSaveBulk, currentName }: SaveModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'manual' | 'csv'>('manual');
  
  const [manualText, setManualText] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [previewNames, setPreviewNames] = useState<string[]>([]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [userLimitStatus, setUserLimitStatus] = useState<any>(null);
  
  const [pricingState, setPricingState] = useState<{isOpen: boolean, reason: "guest_limit" | "free_limit"}>({
      isOpen: false,
      reason: "guest_limit"
  });

  useEffect(() => {
    if (isOpen) {
        getUserLimits().then(setUserLimitStatus);
        setManualText(currentName);
        setCsvFile(null);
        setPreviewNames([]);
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  // HELPER: Split by Newline OR Comma
  const parseNames = (text: string) => {
      return text
        .split(/[\n,]/) 
        .map(n => n.trim())
        .filter(n => n.length > 0);
  };

  const checkLimits = (count: number) => {
      if (userLimitStatus?.isLoggedIn && !userLimitStatus.canSave) {
          setPricingState({ isOpen: true, reason: "free_limit" });
          return false;
      }
      const limit = !userLimitStatus?.isLoggedIn ? 5 : FREE_BULK_ROWS;
      if (count > limit) {
          setPricingState({ isOpen: true, reason: !userLimitStatus?.isLoggedIn ? "guest_limit" : "free_limit" });
          return false;
      }
      return true;
  };

  const handleManualProcess = async () => {
      const names = parseNames(manualText);
      if (names.length === 0) return;
      if (!checkLimits(names.length)) return;

      setIsProcessing(true);
      if (names.length === 1) {
          onSaveSingle(names[0]); 
      } else {
          onSaveBulk(names); 
      }
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

  const clearFile = () => {
      setCsvFile(null);
      setPreviewNames([]);
  };

  const handleStandardProcess = async () => {
    if (!previewNames.length) return;
    if (!checkLimits(previewNames.length)) return;
    setIsProcessing(true);
    onSaveBulk(previewNames);
    setIsProcessing(false);
  };

  const handlePartialProcess = async () => {
    setIsProcessing(true);
    const limit = !userLimitStatus?.isLoggedIn ? 5 : FREE_BULK_ROWS;
    const limitedBatch = previewNames.slice(0, limit);
    
    if (userLimitStatus?.isLoggedIn && !userLimitStatus.canSave) {
        setPricingState({ isOpen: true, reason: "free_limit" });
        setIsProcessing(false);
        return;
    }

    await onSaveBulk(limitedBatch);
    setIsProcessing(false);
  };

  const limit = !userLimitStatus?.isLoggedIn ? 5 : FREE_BULK_ROWS;
  const isOverLimit = previewNames.length > limit;
  const manualCount = parseNames(manualText).length;

  return (
    <>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-slate-900">Save Certificate</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="flex border-b border-slate-100 shrink-0">
              <button onClick={() => setMode('manual')} className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'manual' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}>Manual Entry</button>
              <button onClick={() => setMode('csv')} className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'csv' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}>Upload CSV</button>
            </div>

            <div className="p-6 overflow-y-auto">
              {mode === 'manual' ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Recipient Names</label>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${manualCount > limit ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                            {manualCount} / {limit}
                        </span>
                    </div>
                    <textarea 
                        autoFocus
                        value={manualText}
                        onChange={(e) => setManualText(e.target.value)}
                        className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-40 resize-none"
                        placeholder={`John Doe, Jane Smith\nBob Jones`}
                    />
                    <p className="text-[10px] text-slate-400">Enter names separated by commas or new lines.</p>
                  </div>

                  <button 
                    onClick={handleManualProcess}
                    disabled={manualCount === 0 || isProcessing}
                    className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
                    {manualCount > 1 ? `Generate ${manualCount} Certificates` : "Save Certificate"}
                  </button>
                  
                  {/* Link Free Users to Pricing Page if limits hit */}
                  {userLimitStatus?.isLoggedIn && !userLimitStatus.canSave && (
                      <p className="text-xs text-red-500 text-center cursor-pointer hover:underline" onClick={() => router.push('/pricing')}>
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
                        <p className="text-xs text-slate-400">or drag and drop file here</p>
                        <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                      </label>
                  ) : (
                      <div className="space-y-3">
                          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                              <div className="flex items-center gap-3 overflow-hidden">
                                  <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                                  <div className="truncate">
                                      <p className="text-xs font-bold text-slate-900 truncate">{csvFile.name}</p>
                                      <p className="text-[10px] text-slate-500">{previewNames.length} names found</p>
                                  </div>
                              </div>
                              <button onClick={clearFile} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"><Trash2 size={16} /></button>
                          </div>

                          <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-lg bg-white scrollbar-thin scrollbar-thumb-slate-200">
                              {previewNames.map((name, i) => (
                                  <div key={i} className={`px-3 py-2 text-xs flex justify-between items-center ${i >= limit ? 'opacity-50 bg-slate-50' : ''}`}>
                                      <span className="flex items-center gap-2">
                                          <span className="font-mono text-slate-300 w-4">{i + 1}</span>
                                          <span className="text-slate-700 font-medium truncate max-w-[180px]">{name}</span>
                                      </span>
                                      {i < limit && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                                      {i >= limit && <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">SKIP</span>}
                                  </div>
                              ))}
                          </div>

                          {isOverLimit && (
                              <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-100 rounded text-[10px] text-amber-800">
                                  <span className="font-bold">Heads up:</span> Only the first {limit} names will be processed.
                              </div>
                          )}
                      </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {isOverLimit ? (
                        <>
                            {/* === UPDATED UPGRADE BUTTON (LINKS TO /pricing) === */}
                            <button 
                                onClick={() => router.push('/pricing')} 
                                className="w-full bg-amber-400 text-amber-950 py-3 rounded-lg font-bold hover:bg-amber-500 transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Crown size={18} />
                                {!userLimitStatus?.isLoggedIn ? "Sign Up to Process All" : "Upgrade to Process All"}
                            </button>
                            
                            <button 
                                onClick={handlePartialProcess}
                                disabled={isProcessing}
                                className="w-full bg-slate-100 text-slate-600 py-2 rounded-lg font-bold hover:bg-slate-200 transition-all text-xs"
                            >
                                {isProcessing ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : `Process first ${limit} only`}
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={handleStandardProcess}
                            disabled={!csvFile || isProcessing || previewNames.length === 0}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : <Upload size={18} />} 
                            Process Bulk CSV
                        </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Keeping PricingModal active for automatic limit checks (triggered by helpers) */}
        <PricingModal 
            isOpen={pricingState.isOpen} 
            onClose={() => setPricingState({ ...pricingState, isOpen: false })} 
            reason={pricingState.reason} 
        />
    </>
  );
}