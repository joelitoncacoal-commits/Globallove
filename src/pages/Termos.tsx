import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { TERMOS_CONTEUDO } from '../data/institutional';

export const Termos: React.FC = () => {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-12">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3 self-start">
        <FileText className="size-3.5" /> Diretrizes da Comunidade
      </div>

      <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        {TERMOS_CONTEUDO.titulo}
      </h1>

      <p className="mt-4 text-sm text-muted-foreground bg-muted/60 p-4 rounded-2xl border border-border">
        {TERMOS_CONTEUDO.descricao}
      </p>

      <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-4">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Regras de Convivência no GlobalLove.com
        </h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          {TERMOS_CONTEUDO.regras.map((regra, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4.5 text-primary shrink-0 mt-0.5" />
              <span>{regra}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-border pt-4">
          <h3 className="font-display text-lg font-bold text-foreground mb-1">
            Planos e Pagamentos
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {TERMOS_CONTEUDO.planos}
          </p>
        </div>
      </div>
    </div>
  );
};
