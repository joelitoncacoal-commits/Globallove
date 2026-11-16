import React from 'react';
import { Heart, MessageCircle, Crown, Sparkles, CheckCircle2, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Matches: React.FC = () => {
  const { matches, navigate, isPremium, activatePremium } = useApp();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
            <Heart className="size-3.5 fill-primary" /> Meus Matches
          </div>
          <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Pessoas Conectadas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quando duas pessoas demonstram interesse mútuo, a conversa é liberada aqui.
          </p>
        </div>

        <button
          onClick={() => navigate('/descobrir')}
          className="flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-soft active:scale-95 self-start sm:self-auto"
        >
          <Flame className="size-4" /> Continuar Descobrindo
        </button>
      </div>

      {/* "Quem te curtiu" Premium Banner / Grid */}
      <div className="mb-10 overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-plum/10 via-coral/10 to-amber-soft/20 p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-emerald-500/20 text-emerald-700 font-bold">
                <Sparkles className="size-4" />
              </span>
              <h3 className="font-display text-xl font-bold text-foreground">
                12 pessoas curtiram você • 100% Grátis
              </h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground max-w-md">
              No GlobalLove.com, você pode ver todos os perfis que demonstraram interesse em você sem nenhum custo ou assinatura.
            </p>
          </div>

          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-4 py-1.5 text-xs font-bold text-emerald-700">
            ✓ Tudo Liberado Grátis
          </span>
        </div>

        {/* Blurred or Unlocked Preview Avatars */}
        <div className="mt-5 flex items-center gap-4 overflow-x-auto pb-2">
          {[
            { name: 'Elena M.', flag: '🇪🇸', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
            { name: 'Emma L.', flag: '🇫🇷', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
            { name: 'Isabella F.', flag: '🇧🇷', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
            { name: 'Kenji T.', flag: '🇯🇵', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
            { name: 'Clara S.', flag: '🇵🇹', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80' }
          ].map((item, idx) => (
            <div key={idx} className="relative flex flex-col items-center shrink-0">
              <div
                className="relative size-16 overflow-hidden rounded-full border-2 border-primary/40 shadow-soft"
              >
                <img src={item.img} alt={item.name} className="size-full object-cover" />
              </div>
              <span className="mt-1 text-[11px] font-bold text-foreground flex items-center gap-1">
                <span>{item.flag}</span>
                <span>{item.name}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Matches Grid */}
      <h2 className="font-display text-2xl font-bold text-foreground mb-4">
        Seus Matches Ativos ({matches.length})
      </h2>

      {matches.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {matches.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all hover:border-primary/40 hover:shadow-card"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={item.profile.fotos[0]}
                  alt={item.profile.nome}
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-md px-2.5 py-0.5 text-xs text-white">
                  <span>{item.profile.bandeira}</span>
                  <span>{item.profile.cidade}</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-lg font-bold">
                      {item.profile.nome}, {item.profile.idade}
                    </span>
                    <CheckCircle2 className="size-4 text-coral" />
                  </div>
                  <p className="text-[11px] text-white/80 truncate">
                    {item.profile.profissao}
                  </p>
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.lastMessage || 'Nenhuma mensagem enviada ainda. Diga oi!'}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                  <span className="text-[10px] text-muted-foreground">
                    {item.createdAt}
                  </span>

                  <button
                    onClick={() => navigate(`/conversas/${item.id}`)}
                    className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold text-primary-foreground shadow-soft transition-transform active:scale-95"
                  >
                    <MessageCircle className="size-3.5" /> Conversar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-soft">
          <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-primary/10 text-primary mb-4">
            <Heart className="size-8" />
          </div>
          <h3 className="font-display text-xl font-bold text-foreground">
            Ainda nenhum match
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Continue explorando perfis e curtindo pessoas que você gostaria de conhecer. Assim que o interesse for mútuo, o match aparecerá aqui!
          </p>
          <button
            onClick={() => navigate('/descobrir')}
            className="mt-6 rounded-full bg-brand px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft"
          >
            Começar a Curtir
          </button>
        </div>
      )}
    </div>
  );
};
