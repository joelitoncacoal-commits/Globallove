import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  requireTypedWord?: string;
  loading?: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  requireTypedWord,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (!open) setTyped('');
  }, [open]);

  if (!open) return null;

  const canConfirm = !requireTypedWord || typed.trim().toUpperCase() === requireTypedWord.toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-float">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Fechar janela"
          className="absolute top-4 right-4 grid min-h-[44px] min-w-[44px] place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-start gap-3 pr-10">
          <div
            className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
              destructive ? 'bg-rose-500/15 text-rose-600' : 'bg-amber-500/15 text-amber-600'
            }`}
          >
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h2 id="confirm-modal-title" className="font-display text-lg font-bold text-foreground">
              {title}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>

        {requireTypedWord && (
          <div className="mt-4">
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Digite <span className="font-mono text-rose-600">{requireTypedWord}</span> para confirmar:
            </label>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={requireTypedWord}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-rose-500"
            />
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="min-h-[44px] rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={loading || !canConfirm}
            className={`min-h-[44px] rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
              destructive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {loading ? 'Processando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
