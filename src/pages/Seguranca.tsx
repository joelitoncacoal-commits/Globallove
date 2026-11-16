import React from 'react';
import { ShieldCheck, AlertTriangle, Lock, EyeOff, UserX, PhoneCall } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEGURANCA_CONTEUDO } from '../data/institutional';

export const Seguranca: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-12">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3 self-start">
        <ShieldCheck className="size-3.5" /> Segurança & Respeito
      </div>

      <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        {SEGURANCA_CONTEUDO.titulo}
      </h1>
      <p className="mt-3 text-base text-muted-foreground leading-relaxed">
        {SEGURANCA_CONTEUDO.descricao}
      </p>

      <div className="mt-10 space-y-6">
        {SEGURANCA_CONTEUDO.dicas.map((dica, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-3"
          >
            <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-xl bg-coral/15 text-coral text-xs font-bold">
                {idx + 1}
              </span>
              {dica.titulo}
            </h3>

            {dica.paragrafos.map((p, pIdx) => (
              <p key={pIdx} className="text-sm text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}

            {dica.lista && (
              <ul className="mt-3 list-disc pl-5 space-y-1.5 text-xs text-muted-foreground leading-relaxed">
                {dica.lista.map((item, lIdx) => (
                  <li key={lIdx}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-border bg-card p-6 text-center text-xs text-muted-foreground">
        Identificou algum comportamento suspeito? Entre em contato diretamente com nossa moderação na página de{' '}
        <button
          onClick={() => navigate('/contato')}
          className="font-bold text-primary hover:underline"
        >
          Contato
        </button>
        .
      </div>
    </div>
  );
};
