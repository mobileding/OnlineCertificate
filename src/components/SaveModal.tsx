import React, { useState } from 'react';
import { User, Users, Upload, FileText, Check, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSingle: (name: string) => void;
  onSaveBulk: (names: string[]) => void;
  currentName: string;
}

export const SaveModal = ({ isOpen, onClose, onSaveSingle, onSaveBulk, currentName }: SaveModalProps) => {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [nameInput, setNameInput] = useState(currentName);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedNames, setParsedNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle CSV Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    setError(null);

    Papa.parse(file, {
      complete: (results) => {
        // Simple logic: Assume the first column contains names
        // Filter out empty rows
        const names = results.data
          .map((row: any) => Array.isArray(row) ? row[0] : row.name || Object.values(row)[0])
          .filter((n: any) => typeof n === 'string' && n.trim().length > 0);

        if (names.length === 0) {
          setError("No names found in CSV. Please ensure the first column contains names.");
        } else {
          setParsedNames(names);
        }
      },
      header: false // Set to true if you want to look for specific "Name" column
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Save & Distribute</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setMode('single')}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${mode === 'single' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <User size={18} /> Single Certificate
          </button>
          <button 
            onClick={() => setMode('bulk')}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${mode === 'bulk' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Users size={18} /> Bulk Issue (CSV)
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === 'single' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Recipient Name</label>
                <input 
                  autoFocus
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. John Doe"
                />
              </div>
              <button 
                onClick={() => onSaveSingle(nameInput)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <Check size={18} /> Save Certificate
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              
              {!csvFile ? (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 font-medium">Click to upload CSV</p>
                  <p className="text-xs text-slate-400 mt-1">First column should contain names</p>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="text-green-600" size={20} />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-slate-700 truncate">{csvFile.name}</p>
                      <p className="text-xs text-slate-500">{parsedNames.length} names found</p>
                    </div>
                    <button onClick={() => { setCsvFile(null); setParsedNames([]); }} className="text-xs text-red-500 hover:underline">Remove</button>
                  </div>
                  
                  {/* Name Preview */}
                  {parsedNames.length > 0 && (
                    <div className="text-xs text-slate-400 mt-2 border-t border-slate-200 pt-2">
                      Preview: {parsedNames.slice(0, 3).join(', ')} {parsedNames.length > 3 && `+ ${parsedNames.length - 3} more`}
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button 
                disabled={parsedNames.length === 0}
                onClick={() => onSaveBulk(parsedNames)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <Users size={18} /> Generate {parsedNames.length > 0 ? parsedNames.length : ''} Certificates
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};