"use client";

import { useState, useEffect } from "react";
//import Link from "next/link";
import { Link } from "@/i18n/routing"; 
// 1. Added 'Mail' to imports
import { Search, Copy, Check, ExternalLink, ChevronLeft, ChevronRight, Mail } from "lucide-react";

interface Certificate {
  id: string;
  recipient_name: string;
  course_title: string;
  verification_code: string;
  created_at: string;
  issue_date: string;
}

export function DashboardTable({ certificates }: { certificates: Certificate[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. Filter Logic
  const filtered = certificates.filter(cert => 
    cert.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.verification_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Pagination Logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 if user types in search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(`https://onlinecertificate.org/verify/${code}`);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 3. NEW: Handle Email Click
  const handleEmail = (cert: Certificate) => {
    const link = `https://onlinecertificate.org/verify/${cert.verification_code}`;
    
    // Construct the email content
    const subject = encodeURIComponent(`Certificate: ${cert.course_title}`);
    const body = encodeURIComponent(
`Hi ${cert.recipient_name},

Congratulations on completing ${cert.course_title}!

Here is your official digital certificate. You can view, verify, and download it at the link below:

${link}

Best regards,`
    );

    // Open default mail client
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search recipients, titles, or IDs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="text-xs text-slate-400">
           Total: {filtered.length} records
        </div>
      </div>

      {/* Dense Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Recipient</th>
              <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Title</th>
              <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Issued</th>
              <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">ID</th>
              <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  {searchTerm ? `No results for "${searchTerm}"` : "No records found."}
                </td>
              </tr>
            ) : (
              paginatedData.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-3 font-medium text-slate-900">
                    {cert.recipient_name}
                  </td>
                  <td className="px-6 py-3 text-slate-500">
                    {cert.course_title}
                  </td>
                  <td className="px-6 py-3 text-slate-500 whitespace-nowrap">
                    {new Date(cert.issue_date || cert.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    <button 
                      onClick={() => copyToClipboard(cert.verification_code)}
                      className="font-mono text-xs bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-600 hover:border-blue-300 hover:text-blue-600 flex items-center gap-2 transition-all"
                      title="Click to Copy Link"
                    >
                      {cert.verification_code}
                      {copiedId === cert.verification_code ? <Check size={12} className="text-green-600"/> : <Copy size={12}/>}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                        {/* 4. NEW: Email Button */}
                        <button 
                            onClick={() => handleEmail(cert)}
                            className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                            title="Draft Email to Recipient"
                        >
                            <Mail size={16} />
                        </button>

                        <Link 
                        href={`/verify/${cert.verification_code}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 hover:underline"
                        >
                        View <ExternalLink size={12} />
                        </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION CONTROLS */}
        {filtered.length > itemsPerPage && (
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-sm font-medium"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            
            <span className="text-xs text-slate-400 font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-sm font-medium"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}