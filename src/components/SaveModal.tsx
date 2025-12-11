import { useState } from "react";
import { Upload, FileDown, Check, Loader2, User } from "lucide-react";
import Papa from "papaparse";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string; // The name currently on the certificate
  onSaveSingle: (name: string) => void;
  onSaveBulk: (names: string[]) => void;
}

export function SaveModal({ isOpen, onClose, currentName, onSaveSingle, onSaveBulk }: SaveModalProps) {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedNames, setParsedNames] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    
    Papa.parse(file, {
      complete: (results) => {
        // Flatten array and remove empties
        const names = results.data.flat().filter((n: any) => n && typeof n === 'string' && n.trim().length > 0) as string[];
        setParsedNames(names);
      },
      header: false
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="border-b border-gray-100 p-2 flex">
          <button 
            onClick={() => setActiveTab('single')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'single' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Single Certificate
          </button>
          <button 
            onClick={() => setActiveTab('bulk')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'bulk' ? 'bg-blue-50 text-blue-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Bulk Create (CSV)
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'single' ? (
            <div className="text-center space-y-6">
              <div className="bg-slate-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                <User className="w-10 h-10 text-slate-400" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-slate-900">Save to Database</h3>
                <p className="text-slate-500 text-sm mt-2">
                  We will create a permanent verification record for:
                </p>
                {/* JUST SHOW THE NAME, DON'T ASK FOR IT */}
                <div className="mt-4 bg-blue-50 border border-blue-100 p-3 rounded-lg inline-block px-6">
                  <span className="text-lg font-bold text-blue-800">{currentName}</span>
                </div>
              </div>

              <button 
                onClick={() => onSaveSingle(currentName)} 
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                Confirm & Save
              </button>
            </div>
          ) : (
            /* BULK TAB (Unchanged) */
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors relative">
                 <input 
                   type="file" 
                   accept=".csv" 
                   onChange={handleCsvUpload} 
                   className="absolute inset-0 opacity-0 cursor-pointer"
                 />
                 <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                 {csvFile ? (
                   <div>
                     <p className="font-bold text-slate-800">{csvFile.name}</p>
                     <p className="text-sm text-green-600 mt-1">{parsedNames.length} names found</p>
                   </div>
                 ) : (
                   <div>
                     <p className="font-bold text-slate-700">Upload CSV List</p>
                     <p className="text-xs text-slate-400 mt-1">Drag & drop or click to browse</p>
                   </div>
                 )}
              </div>

              <button 
                disabled={!parsedNames.length || isProcessing}
                onClick={() => {
                  setIsProcessing(true);
                  onSaveBulk(parsedNames);
                }}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <FileDown size={20} />}
                Generate {parsedNames.length > 0 ? parsedNames.length : ''} Certificates
              </button>
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
          <button onClick={onClose} className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase">
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}