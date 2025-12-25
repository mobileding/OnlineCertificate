import { Dialog, DialogContent } from "../components/ui/dialog";
import { useState, useRef } from "react";
import { Save, Upload, X, AlertCircle, Trash2, Crown, Sparkles } from "lucide-react";
import { useTranslations } from 'next-intl';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSaveSingle: (name: string) => void;
  onSaveBulk: (names: string[]) => void;
  userTier: 'guest' | 'free' | 'pro' | 'elite';
}

export function SaveModal({ isOpen, onClose, currentName, onSaveSingle, onSaveBulk, userTier }: SaveModalProps) {
  const t = useTranslations('SaveModal');
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [singleName, setSingleName] = useState(currentName);
  
  // Bulk State
  const [bulkNames, setBulkNames] = useState<string[]>([]);
  const [bulkInput, setBulkInput] = useState("");
  const [manualInput, setManualInput] = useState(""); // For Elite manual entry
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
            {t('tab_single')}
          </button>
          <button 
            onClick={() => setActiveTab('bulk')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'bulk' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t('tab_bulk')} {userTier === 'elite' && <Crown size={12} className="text-purple-600"/>}
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
                        <h2 className="text-xl font-bold text-slate-900">{t('single_title')}</h2>
                        <p className="text-slate-500 text-sm mt-1">{t('single_desc')}</p>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">{t('label_recipient')}</label>
                        <input 
                            value={singleName}
                            onChange={(e) => setSingleName(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-lg font-medium text-slate-900 focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                    </div>

                    <button onClick={() => onSaveSingle(singleName)} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all">
                        {t('btn_save_single')}
                    </button>
                </div>
            )}

            {/* === BULK TAB === */}
            {activeTab === 'bulk' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    
                    {/* PRO INTERFACE (SIMPLE + LINE COUNTER) */}
                    {userTier === 'pro' && (
                        <>
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">{t('pro_title')}</h2>
                                    <p className="text-slate-500 text-xs">
                                        {t.rich('pro_helper', {
                                            strong_tag: (chunks) => <strong>{chunks}</strong>
                                        })}
                                    </p>
                                </div>
                                <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                                    {t('pro_detected', { count: bulkInput.split(/[\n,]+/).filter(n => n.trim().length > 0).length })}
                                </div>
                            </div>
                            
                            {/* EDITOR WITH LINE NUMBERS */}
                            <div className="relative border border-slate-200 rounded-lg overflow-hidden flex h-48 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                {/* Left: The Counter Gutter */}
                                <div className="bg-slate-50 text-slate-400 text-right text-sm font-mono p-3 pt-3.5 select-none border-r border-slate-100 w-12 overflow-hidden leading-6">
                                    {Array.from({ length: Math.max(1, bulkInput.split('\n').length) }).map((_, i) => (
                                        <div key={i}>{i + 1}</div>
                                    ))}
                                </div>

                                {/* Right: The Input Area */}
                                <textarea 
                                    value={bulkInput}
                                    onChange={(e) => setBulkInput(e.target.value)}
                                    placeholder={t('pro_placeholder')}
                                    className="flex-1 h-full p-3 text-sm outline-none resize-none leading-6 whitespace-pre"
                                    spellCheck={false}
                                />
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg flex items-start gap-2 mt-4">
                                <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div className="text-xs text-slate-500">
                                    <strong>{t('pro_tip_title')}</strong> {t('pro_tip_text')}
                                </div>
                            </div>

                            <button 
                                onClick={() => {
                                    // Split by Newline (\n) OR Comma (,)
                                    const names = bulkInput
                                        .split(/[\n,]+/)              
                                        .map(n => n.trim())           
                                        .filter(n => n.length > 0);   
                                    
                                    if(names.length > 0) onSaveBulk(names);
                                }}
                                disabled={!bulkInput.trim()} 
                                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all disabled:opacity-50 mt-4"
                            >
                                {t('btn_generate_batch')}
                            </button>
                        </>
                    )}

                    {/* ELITE INTERFACE (ADVANCED) */}
                    {userTier === 'elite' && (
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Crown size={16} className="text-purple-600" /> 
                                    {t('elite_title')}
                                </h2>
                                <span className="text-xs font-bold text-slate-400">
                                    {t('elite_ready', { count: bulkNames.length })}
                                </span>
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
                                    <p className="text-sm font-bold text-slate-700">{t('drop_title')}</p>
                                    <p className="text-xs text-slate-400 mt-1">{t('drop_subtitle')}</p>
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
                                        <span className="text-xs font-bold text-slate-500 uppercase">{t('preview_title')}</span>
                                        <button onClick={() => setBulkNames([])} className="text-xs text-red-500 font-bold hover:underline">{t('btn_clear')}</button>
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
                                    placeholder={t('manual_placeholder')} 
                                    className="flex-1 p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault(); 
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
                                <Sparkles size={16} /> {t('btn_generate_count', { count: bulkNames.length })}
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