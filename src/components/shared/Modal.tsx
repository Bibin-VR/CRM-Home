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
      <div className="absolute inset-0 bg-[#0B0B0B]/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#FBFAF7] border-2 border-[#0B0B0B] shadow-[8px_8px_0px_0px_#0B0B0B] max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between px-5 py-4 border-b-2 border-[#0B0B0B] bg-[#EAE8E3]">
          <div>
            <h3 className="text-lg font-bold text-[#0B0B0B] uppercase tracking-wide">{title}</h3>
            {subtitle && (
              <p className="text-[10px] text-[#6B6A63] font-mono-data uppercase tracking-widest mt-0.5">{subtitle}</p>
            )}
          </div>
          <button type="button" onClick={onClose} title="Close" className="text-[#6B6A63] hover:text-[#E61919] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto brutalist-scroll space-y-4">{children}</div>
        {footer && (
          <div className="px-5 py-4 border-t-2 border-[#0B0B0B] bg-[#EAE8E3] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

const labelCls =
  "block text-[10px] uppercase tracking-[0.2em] text-[#6B6A63] font-mono-data mb-1.5";
const fieldCls =
  "w-full bg-[#FBFAF7] border-2 border-[#0B0B0B] text-[#0B0B0B] px-3 py-2 text-sm font-mono-data outline-none focus:border-[#E61919] transition-colors";

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
        style={{ borderRadius: 0 }}
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
        style={{ borderRadius: 0 }}
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
        style={{ borderRadius: 0 }}
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
