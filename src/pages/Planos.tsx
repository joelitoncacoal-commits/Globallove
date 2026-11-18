import React from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  Check,
  Sparkles,
  ShieldCheck,
  Heart,
  Eye,
  RotateCcw,
  Globe2,
  Flame,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Planos: React.FC = () => {
  const { isLoggedIn } = useApp();

  const recursosLiberados = [
    {
      titulo: 'Veja quem curtiu você',
      descricao:
        'Descubra todos os perfis que demonstraram interesse em você sem nenhum tipo de borrão ou bloqueio.',
      icone: Eye,
    },
    {
      titulo: 'Curtidas ilimitadas todos os dias',
      descricao:
        'Curta quantos perfis quiser na sua cidade ou em outros países, sem limites diários.',
      icone: Heart,
    },
    {
      titulo: 'Desfazer e Voltar perfis (Rewind)',
      descricao: 'Passou alguém sem querer? Volte atrás a qualquer momento sem restrições.',
      icone: RotateCcw,
    },
    {
      titulo: 'Filtro Global em 92 Países',
      descricao:
        'Navegue e conheça pessoas por país, idade, afinidade e distância sem pagar nada por isso.',
      icone: Globe2,
    },
    {
      titulo: 'Conversas e Matches Liberados',
      descricao: 'Troque mensagens em tempo real imediatamente após o match, com privacidade total.',
      icone: Sparkles,
    },
    {
      titulo: 'Destaque no Mural da Comunidade',
      descricao:
        'Compartilhe seus pensamentos, viagens e fotos com visibilidade especial para todos os membros.',
      icone: Flame,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-4 py-1.5 text-xs font-bold text-emerald-700 mb-4">
          <Sparkles className="size-4 text-emerald-600" /> 100% Gratuito Para Toda a Comunidade
        </div>
        <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">
          Tudo liberado, de graça!
        </h1>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          No GlobalLove.com, acreditamos que conexões reais não devem ter barreiras financeiras. Todos os recursos Premium estão totalmente gratuitos e liberados para todos os membros. Não há nada para pagar.
        </p>
      </div>

      {/* Main Free Card */}
      <div className="mt-10 overflow-hidden rounded-[2.5rem] border border-primary/30 bg-card p-8 sm:p-12 shadow-card text-center relative">
        <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-brand text-primary-foreground shadow-soft mb-4">
          <Crown className="size-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-coral">
          Acesso Total Imediato
        </span>

        <h2 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-foreground">
          R$ 0,00 <span className="text-lg font-normal text-muted-foreground">/ para sempre</span>
        </h2>

        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Sua conta já possui status VIP ativo com todos os recursos liberados automaticamente.
        </p>

        {/* Benefits Grid */}
        <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
          {recursosLiberados.map((rec, i) => {
            const Icon = rec.icone;
            return (
              <div
                key={i}
                className="flex items-start gap-3.5 rounded-2xl border border-border/80 bg-background/80 p-4 transition-all hover:border-primary/40 hover:shadow-soft"
              >
                <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-1.5">
                    {rec.titulo}
                    <Check className="size-3.5 text-emerald-600" />
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    {rec.descricao}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Links */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={isLoggedIn ? '/descobrir' : '/entrar'}
            className="flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-bold text-primary-foreground shadow-soft hover:opacity-95 transition-transform active:scale-95 w-full sm:w-auto"
          >
            <Flame className="size-4.5" /> Começar a Descobrir Pessoas
          </Link>
          <Link
            to={isLoggedIn ? '/matches' : '/entrar'}
            className="flex items-center justify-center gap-2 rounded-full border border-border bg-card px-8 py-4 text-sm font-semibold text-foreground hover:bg-muted transition-colors w-full sm:w-auto"
          >
            <Eye className="size-4.5 text-primary" /> Ver Quem Me Curtiu
          </Link>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground text-center">
        <ShieldCheck className="size-4 text-primary" />
        Zero cobranças, sem necessidade de dados de pagamento ou cartão de crédito.
      </div>
    </div>
  );
};
