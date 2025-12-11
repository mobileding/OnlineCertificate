import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Brand */}
          <div className="text-center md:text-left">
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              OnlineCertificate<span className="text-blue-600">.org</span>
            </span>
            <p className="text-xs text-slate-400 mt-1">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <Link href="/dashboard" className="hover:text-slate-900">Dashboard</Link>
            <Link href="/contact" className="hover:text-slate-900">Contact</Link>
            <Link href="/profile" className="hover:text-slate-900">Profile</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}