"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border-2 border-black animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between p-6 border-b-2 border-black bg-lime-50 rounded-t-xl">
          <h2 className="text-2xl font-black tracking-tight">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-red-100 hover:text-red-900 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
