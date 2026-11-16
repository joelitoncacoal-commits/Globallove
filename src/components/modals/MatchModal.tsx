import React from 'react';
import { Heart, MessageCircle, X, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MatchModal: React.FC = () => {
  const { newMatchModal, closeMatchModal, user, navigate } = useApp();

  if (!newMatchModal) return null;

  const handleStartChat = () => {
    closeMatchModal();
    navigate(`/conversas/match_${newMatchModal.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card border border-primary/30 p-8 text-center shadow-float">
        {/* Close Button */}
        <button
          onClick={closeMatchModal}
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Celebration Title */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <Sparkles className="size-3.5" /> Deu Match!
        </div>

        <h2 className="mt-4 font-display text-3xl font-bold text-foreground">
          Vocês se curtiram!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Você e <strong className="text-foreground">{newMatchModal.nome}</strong> demonstraram interesse mútuo. Que tal puxar assunto agora?
        </p>

        {/* Avatars */}
        <div className="my-8 flex items-center justify-center -space-x-4">
          <div className="relative size-24 overflow-hidden rounded-full border-4 border-card shadow-card">
            <img
              src={user.fotos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={user.nome}
              className="size-full object-cover"
            />
          </div>
          <div className="relative z-10 grid size-12 place-items-center rounded-full bg-coral text-white shadow-soft">
            <Heart className="size-6 fill-current" />
          </div>
          <div className="relative size-24 overflow-hidden rounded-full border-4 border-card shadow-card">
            <img
              src={newMatchModal.fotos[0]}
              alt={newMatchModal.nome}
              className="size-full object-cover"
            />
          </div>
        </div>

        <div className="text-xs text-muted-foreground font-medium mb-6">
          {newMatchModal.cidade}, {newMatchModal.pais} {newMatchModal.bandeira}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleStartChat}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 px-6 font-semibold text-primary-foreground shadow-soft transition-transform active:scale-95"
          >
            <MessageCircle className="size-5" /> Mandar mensagem
          </button>
          <button
            onClick={closeMatchModal}
            className="w-full rounded-full border border-border bg-transparent py-3 px-6 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Continuar descobrindo
          </button>
        </div>
      </div>
    </div>
  );
};
