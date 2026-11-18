import React from 'react';
import { Lock } from 'lucide-react';
import { PRIVACIDADE_CONTEUDO } from '../data/institutional';

export const Privacidade: React.FC = () => {

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-12">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3 self-start">
        <Lock className="size-3.5" /> Transparência
      </div>

      <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        {PRIVACIDADE_CONTEUDO.titulo}
      </h1>

      <p className="mt-4 text-sm text-muted-foreground bg-muted/60 p-4 rounded-2xl border border-border">
        {PRIVACIDADE_CONTEUDO.descricao}
      </p>

      <div className="mt-8 space-y-6">
        {PRIVACIDADE_CONTEUDO.itens.map((item, idx) => (
          <div key={idx} className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-2">
            <h3 className="font-display text-xl font-bold text-foreground">
              {item.titulo}
            </h3>
            {item.paragrafos.map((p, pIdx) => (
              <p key={pIdx} className="text-sm text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
