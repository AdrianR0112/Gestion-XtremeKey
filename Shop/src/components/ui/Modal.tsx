"use client";

type ModalProps = {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
};

export function Modal({ title, children, open, onClose }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div aria-label={title} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4" role="dialog">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          <button className="text-sm text-slate-500" onClick={onClose} type="button">
            Cerrar
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
