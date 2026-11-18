import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Flame,
  X,
  Flag,
  ShieldBan,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ReportModal } from '../components/modals/ReportModal';
import { ConfirmModal } from '../components/modals/ConfirmModal';

export const Matches: React.FC = () => {
  const {
    matches,
    incomingLikes,
    likeProfile,
    passProfile,
    blockUser,
  } = useApp();

  const [reportTarget, setReportTarget] = useState<{ id: string; name: string } | null>(null);
  const [blockTarget, setBlockTarget] = useState<{ id: string; name: string } | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-8 pb-24 md:pb-12">
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

        <Link
          to="/descobrir"
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-soft active:scale-95 self-start sm:self-auto"
        >
          <Flame className="size-4" /> Continuar Descobrindo
        </Link>
      </div>

      {/* Real Incoming Likes Section */}
      <div className="mb-10 overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-plum/10 via-coral/10 to-amber-soft/20 p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-emerald-500/20 text-emerald-700 font-bold">
                <Sparkles className="size-4" />
              </span>
              <h2 className="font-display text-xl font-bold text-foreground">
                Quem Curtiu Você ({incomingLikes.length})
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground max-w-md">
              No GlobalLove.com, você vê todas as curtidas recebidas gratuitamente — sem assinaturas ocultas.
            </p>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 px-4 py-1.5 text-xs font-bold text-emerald-700">
            100% Gratuito
          </span>
        </div>

        {incomingLikes.length > 0 ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {incomingLikes.map((item) => {
              const p = item.profile;
              if (!p) return null;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xs"
                >
                  <img
                    src={p.fotos[0] || '/icons/icon-192.webp'}
                    alt={p.nome}
                    className="size-14 rounded-2xl object-cover shrink-0 border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-display text-sm font-bold text-foreground truncate">
                        {p.nome}, {p.idade}
                      </p>
                      {item.type === 'superlike' && (
                        <Star className="size-3.5 text-amber-500 fill-amber-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {p.bandeira} {p.cidade}, {p.pais}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => void likeProfile(p)}
                        className="flex-1 min-h-[36px] inline-flex items-center justify-center gap-1 rounded-xl bg-brand px-2.5 py-1 text-[11px] font-bold text-white"
                      >
                        <Heart className="size-3 fill-current" /> Match!
                      </button>
                      <button
                        type="button"
                        onClick={() => void passProfile(p)}
                        aria-label={`Recusar ${p.nome}`}
                        className="grid min-h-[36px] min-w-[36px] place-items-center rounded-xl border border-border text-muted-foreground hover:text-rose-600"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-xs text-muted-foreground">
            Nenhuma nova curtida pendente no momento. Continue explorando perfis em Descobrir!
          </p>
        )}
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
                  src={item.profile.fotos[0] || '/icons/icon-192.webp'}
                  alt={item.profile.nome}
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/55 backdrop-blur-md px-2.5 py-0.5 text-xs text-white">
                  <span>{item.profile.bandeira}</span>
                  <span>{item.profile.cidade || item.profile.pais}</span>
                </div>

                {item.unreadCount && item.unreadCount > 0 ? (
                  <span className="absolute top-3 right-3 rounded-full bg-coral px-2.5 py-0.5 text-[11px] font-bold text-white shadow-md">
                    {item.unreadCount} nova{item.unreadCount > 1 ? 's' : ''}
                  </span>
                ) : null}

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-lg font-bold truncate">
                      {item.profile.nome}, {item.profile.idade}
                    </span>
                    {item.profile.emailVerified && (
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-white/80 truncate">{item.profile.profissao}</p>
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.lastMessage || 'Nenhuma mensagem enviada ainda. Diga oi!'}
                </p>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/50 pt-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setReportTarget({ id: item.profile.id, name: item.profile.nome })}
                      aria-label={`Denunciar ${item.profile.nome}`}
                      title="Denunciar"
                      className="grid min-h-[38px] min-w-[38px] place-items-center rounded-xl text-muted-foreground hover:bg-muted hover:text-rose-600"
                    >
                      <Flag className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setBlockTarget({ id: item.profile.id, name: item.profile.nome })}
                      aria-label={`Bloquear ${item.profile.nome}`}
                      title="Bloquear"
                      className="grid min-h-[38px] min-w-[38px] place-items-center rounded-xl text-muted-foreground hover:bg-muted hover:text-rose-600"
                    >
                      <ShieldBan className="size-3.5" />
                    </button>
                  </div>

                  <Link
                    to={`/conversas/${item.id}`}
                    className="flex min-h-[40px] items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold text-primary-foreground shadow-soft transition-transform active:scale-95"
                  >
                    <MessageCircle className="size-3.5" /> Conversar
                  </Link>
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
          <h3 className="font-display text-xl font-bold text-foreground">Ainda nenhum match</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Continue explorando perfis e curtindo pessoas que você gostaria de conhecer. Assim que o interesse for mútuo, o match aparecerá aqui!
          </p>
          <Link
            to="/descobrir"
            className="mt-6 inline-flex items-center justify-center min-h-[44px] rounded-full bg-brand px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft"
          >
            Começar a Curtir
          </Link>
        </div>
      )}

      {reportTarget && (
        <ReportModal
          open={Boolean(reportTarget)}
          targetUid={reportTarget.id}
          targetName={reportTarget.name}
          onClose={() => setReportTarget(null)}
        />
      )}

      <ConfirmModal
        open={Boolean(blockTarget)}
        title={`Bloquear ${blockTarget?.name || ''}?`}
        description="Este match será encerrado e nenhuma das partes poderá enviar mensagens ou visualizar o perfil."
        confirmLabel="Bloquear"
        destructive
        onCancel={() => setBlockTarget(null)}
        onConfirm={async () => {
          if (!blockTarget) return;
          await blockUser(blockTarget.id, 'Bloqueado na lista de matches');
          setBlockTarget(null);
        }}
      />
    </div>
  );
};
