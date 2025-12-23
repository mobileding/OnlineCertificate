// savemodal in generator uses this massupload gui

"use client";

import * as React from "react";
import { X } from "lucide-react";

const Dialog = ({ 
  open, 
  onOpenChange, 
  children 
}: { 
  open?: boolean; 
  onOpenChange?: (open: boolean) => void; 
  children: React.ReactNode 
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={() => onOpenChange?.(false)}
      />
      {/* Dialog Positioner */}
      <div className="relative z-50 w-full max-w-lg mx-4">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ 
  className, 
  children, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`relative w-full bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden duration-200 animate-in fade-in zoom-in-95 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}
    {...props}
  />
);

const DialogTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
);

export { Dialog, DialogContent, DialogHeader, DialogTitle };