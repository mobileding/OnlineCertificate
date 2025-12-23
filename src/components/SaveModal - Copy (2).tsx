import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useState, useRef } from "react";
import { Save, Upload, FileText, X, Check, AlertCircle, Trash2, Crown } from "lucide-react";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSaveSingle: (name: string) => void;
  onSaveBulk: (names: string[]) => void;
  userTier: 'guest' | 'free' | 'pro' | 'elite';
}

export function SaveModal({ isOpen, onClose, currentName, onSaveSingle, onSaveBulk, userTier }: SaveModalProps) {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [singleName, setSingleName] = useState(currentName);
  
  // Bulk State
  const [bulkNames, setBulkNames] = useState<string[]>([]);
  const [bulkInput, setBulkInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // === HANDLERS ===
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Simple CSV parser: split by newline, clean up commas/quotes
      const names = text.split('\n')
        .map(line => line.replace(/["',]/g, '').trim()) // Remove quotes/commas
        .filter(line => line.length > 0 && line.toLowerCase() !== 'name'); // Remove empty lines & header
      
      setBulkNames(prev => [...prev, ...names]);
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };


// Add this near the other useState hooks
  const [manualInput, setManualInput] = useState("");

const handleAddManual = () => {
    if (!manualInput.trim()) return;
    setBulkNames(prev => [...prev, manualInput.trim()]);
    setManualInput(""); // Clear the box
  };

  const removeName = (index: number) => {
    setBulkNames(prev => prev.filter((_, i) => i !== index));
  };


  // === RENDER ===
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white p-0 overflow-hidden gap-0 rounded-2xl border-0 shadow-2xl">
        
        {/* Header with Tabs */}
        <div className="bg-slate-50 border-b border-slate-100 p-2 flex gap-2">
          <button 
            onClick={() => setActiveTab('single')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'single' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Single Certificate
          </button>
          <button 
            onClick={() => setActiveTab('bulk')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'bulk' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Bulk Create {userTier === 'elite' && <Crown size={12} className="text-purple-600"/>}
          </button>
        </div>

        <div className="p-8">
            {/* === SINGLE TAB === */}
            {activeTab === 'single' && (
                <div className="space-y-6">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Save className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Save to Dashboard</h2>
                        <p className="text-slate-500 text-sm mt-1">This certificate will be stored securely in your account.</p>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Recipient Name</label>
                        <input 
                            value={singleName}
                            onChange={(e) => setSingleName(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-lg font-medium text-slate-900 focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                    </div>

                    <button onClick={() => onSaveSingle(singleName)} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all">
                        Save Certificate
                    </button>
                </div>
            )}

            {/* === BULK TAB === */}
            {activeTab === 'bulk' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    
                    {/* PRO INTERFACE (SIMPLE) */}
                    {userTier === 'pro' && (
                        <>
                            <div className="text-center mb-4">
                                <h2 className="text-lg font-bold text-slate-900">Quick Batch Upload</h2>
                                <p className="text-slate-500 text-xs">Enter one name per line.</p>
                            </div>
                            
                            <textarea 
                                value={bulkInput}
                                onChange={(e) => setBulkInput(e.target.value)}
                                placeholder="John Doe&#10;Jane Smith&#10;Robert Johnson"
                                className="w-full h-40 p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                            />

                            <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                                <div className="text-xs text-blue-800">
                                    <strong>Want to upload CSV files?</strong><br/>
                                    Upgrade to Elite for advanced file handling and previews.
                                </div>
                            </div>

                            <button 
                                onClick={() => {
                                    const names = bulkInput.split('\n').filter(n => n.trim().length > 0);
                                    if(names.length > 0) onSaveBulk(names);
                                }}
                                disabled={!bulkInput.trim()} 
                                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all disabled:opacity-50"
                            >
                                Generate Batch
                            </button>
                        </>
                    )}

                    {/* ELITE INTERFACE (ADVANCED) */}
                    {userTier === 'elite' && (
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Crown size={16} className="text-purple-600" /> 
                                    Advanced Import
                                </h2>
                                <span className="text-xs font-bold text-slate-400">{bulkNames.length} names ready</span>
                            </div>

                            {/* CSV Dropzone */}
                            {bulkNames.length === 0 ? (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer group"
                                >
                                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white group-hover:text-purple-600 transition-colors">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">Click to upload CSV</p>
                                    <p className="text-xs text-slate-400 mt-1">or drag and drop file here</p>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        accept=".csv,.txt"
                                        className="hidden" 
                                        onChange={handleFileUpload}
                                    />
                                </div>
                            ) : (
                                // Data Preview Table
                                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[240px] flex flex-col">
                                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Preview Data</span>
                                        <button onClick={() => setBulkNames([])} className="text-xs text-red-500 font-bold hover:underline">Clear All</button>
                                    </div>
                                    <div className="overflow-y-auto p-0">
                                        {bulkNames.map((name, i) => (
                                            <div key={i} className="flex items-center justify-between px-4 py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-[10px] font-bold">
                                                        {i + 1}
                                                    </div>
                                                    <span className="text-sm text-slate-700 font-medium">{name}</span>
                                                </div>
                                                <button onClick={() => removeName(i)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

{/* Manual Add Line */}
                            <div className="flex gap-2 mt-4">
                                <input 
                                    value={manualInput}
                                    onChange={(e) => setManualInput(e.target.value)}
                                    placeholder="Or type a name manually..." 
                                    className="flex-1 p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault(); // Stop form submission if any
                                            handleAddManual();
                                        }
                                    }}
                                />
                                <button 
                                    onClick={handleAddManual}
                                    className="bg-purple-100 text-purple-700 px-4 rounded-lg font-bold text-lg hover:bg-purple-200 transition-all shadow-sm active:scale-95"
                                >
                                    +
                                </button>
                            </div>

                            <button 
                                onClick={() => onSaveBulk(bulkNames)}
                                disabled={bulkNames.length === 0} 
                                className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Sparkles size={16} /> Generate {bulkNames.length} Certificates
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper icon import (Sparkles was missing from top import)
import { Sparkles } from "lucide-react";