import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1F1F22]/30 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-strong relative w-full max-w-lg rounded-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-start justify-between px-6 py-5 border-b border-black/5">
          <div>
            <h3 className="text-lg font-semibold text-[#1F1F22] tracking-tight font-display">{title}</h3>
            {subtitle && (
              <p className="text-xs text-[#6B6B72] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button type="button" onClick={onClose} title="Close" className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B6B72] hover:text-[#1F1F22] hover:bg-white/60 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto brutalist-scroll space-y-4">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-black/5 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

const labelCls =
  "block text-xs font-medium tracking-wide text-[#6B6B72] mb-1.5";
const fieldCls =
  "w-full bg-white/70 border border-black/10 rounded-xl text-[#1F1F22] px-3.5 py-2.5 text-sm outline-none focus:border-[#EAB308] focus:ring-2 focus:ring-[#EAB308]/20 transition-all";

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={fieldCls}
      />
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  options: { value: string | number; label: string }[];
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={fieldCls}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className={fieldCls}
      />
    </div>
  );
}

export function ModalButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={variant === "primary" ? "brutalist-btn-primary text-xs" : "brutalist-btn text-xs"}
    >
      {children}
    </button>
  );
}
