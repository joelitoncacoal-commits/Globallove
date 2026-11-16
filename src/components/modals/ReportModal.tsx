import React, { useState } from 'react';
import { Flag, ShieldBan, X, Loader2 } from 'lucide-react';
import { ReportCategory } from '../../types';
import { useApp } from '../../context/AppContext';

interface ReportModalProps {
  open: boolean;
  targetUid: string;
  targetName: string;
  onClose: () => void;
}

const CATEGORIES: { value: ReportCategory; label: string }[] = [
  { value: 'fake_profile', label: 'Perfil falso ou fotos de terceiros' },
  { value: 'scam', label: 'Pedido de dinheiro ou golpe financeiro' },
  { value: 'harassment', label: 'Assédio, ofensas ou ameaças' },
  { value: 'spam', label: 'Spam ou propaganda não solicitada' },
  { value: 'underage', label: 'Suspeita de menor de 18 anos' },
  { value: 'other', label: 'Outro motivo' },
];

export const ReportModal: React.FC<ReportModalProps> = ({ open, targetUid, targetName, onClose }) => {
  const { reportUser, blockUser, showToast } = useApp();
  const [category, setCategory] = useState<ReportCategory>('harassment');
  const [description, setDescription] = useState('');
  const [alsoBlock, setAlsoBlock] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 5) {
      showToast('Descreva o ocorrido com pelo menos 5 caracteres.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await reportUser(targetUid, category, description.trim());
      if (alsoBlock) {
        await blockUser(targetUid, `Denúncia: ${category}`);
      }
      setDescription('');
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao enviar denúncia.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-float">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar denúncia"
          className="absolute top-4 right-4 grid min-h-[44px] min-w-[44px] place-items-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3 pr-10">
          <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-rose-500/15 text-rose-600">
            <Flag className="size-5" />
          </div>
          <div>
            <h2 id="report-modal-title" className="font-display text-lg font-bold text-foreground">
              Denunciar {targetName}
            </h2>
            <p className="text-xs text-muted-foreground">
              Sua denúncia é confidencial e vai direto para a fila da moderação.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Motivo da denúncia</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ReportCategory)}
              className="w-full min-h-[44px] rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Detalhes do ocorrido</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              minLength={5}
              maxLength={1000}
              placeholder="Explique brevemente o que aconteceu para ajudar nossa moderação..."
              className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <label className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/40 p-3 cursor-pointer">
            <input
              type="checkbox"
              checked={alsoBlock}
              onChange={(e) => setAlsoBlock(e.target.checked)}
              className="size-4 accent-rose-600"
            />
            <span className="text-xs text-foreground font-medium flex items-center gap-1.5">
              <ShieldBan className="size-4 text-rose-600" />
              Também bloquear {targetName} imediatamente
            </span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Enviar denúncia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
