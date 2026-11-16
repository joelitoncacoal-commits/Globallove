import React from 'react';
import { Sparkles, Globe2, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SOBRE_CONTEUDO } from '../data/institutional';

export const Sobre: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-12">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3 self-start">
        <Sparkles className="size-3.5" /> Nossa Proposta
      </div>

      <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        {SOBRE_CONTEUDO.titulo}
      </h1>

      <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
        {SOBRE_CONTEUDO.paragrafos.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft">
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">
          Como funciona a plataforma
        </h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          {SOBRE_CONTEUDO.pontos.map((ponto, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <span>{ponto}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap gap-4 text-sm font-semibold text-primary">
        <button onClick={() => navigate('/guias')} className="hover:underline">
          Ler os guias →
        </button>
        <button onClick={() => navigate('/seguranca')} className="hover:underline">
          Dicas de segurança →
        </button>
        <button onClick={() => navigate('/contato')} className="hover:underline">
          Falar com a equipe →
        </button>
      </div>

      <div className="mt-12 rounded-3xl bg-brand p-8 text-center text-primary-foreground shadow-card">
        <h3 className="font-display text-2xl font-bold">Faça parte da nossa órbita</h3>
        <p className="mt-2 text-xs text-primary-foreground/90 max-w-sm mx-auto">
          Crie seu perfil e descubra novas conexões hoje mesmo.
        </p>
        <button
          onClick={() => navigate('/descobrir')}
          className="mt-5 rounded-full bg-background px-8 py-3 text-sm font-bold text-foreground shadow-soft hover:opacity-95"
        >
          Criar meu perfil grátis
        </button>
      </div>
    </div>
  );
};
