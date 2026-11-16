import React from 'react';
import { ArrowLeft, BookOpen, Clock, Calendar, Share2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getGuiaBySlug, GUIAS } from '../data/guias';

export const GuiaDetalhe: React.FC<{ slug: string }> = ({ slug }) => {
  const { navigate } = useApp();
  const guia = getGuiaBySlug(slug) || GUIAS[0];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-10">
      {/* Back button */}
      <button
        onClick={() => navigate('/guias')}
        className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground mb-8 self-start transition-colors"
      >
        <ArrowLeft className="size-4" /> Voltar aos Guias
      </button>

      {/* Meta Bar */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium mb-3">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-primary font-bold">
          Guia Oficial
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="size-3.5" /> {guia.publicado || 'Outubro 2026'}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" /> 5 min de leitura
        </span>
      </div>

      {/* Title */}
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
        {guia.h1}
      </h1>

      {/* Summary Lead */}
      <p className="mt-4 text-base text-muted-foreground font-medium leading-relaxed border-l-4 border-coral pl-4 bg-muted/30 py-3 rounded-r-2xl">
        {guia.resumo}
      </p>

      {/* Article Sections */}
      <div className="mt-10 space-y-10 text-foreground leading-relaxed">
        {guia.secoes.map((secao, idx) => (
          <section key={idx} className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {secao.titulo}
            </h2>

            {secao.paragrafos.map((p, pIdx) => (
              <p key={pIdx} className="text-muted-foreground leading-relaxed text-base">
                {p}
              </p>
            ))}

            {secao.lista && secao.lista.length > 0 && (
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                {secao.lista.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {/* Guide FAQ if present */}
        {guia.faq && guia.faq.length > 0 && (
          <div className="mt-12 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft">
            <h3 className="font-display text-xl font-bold text-foreground mb-4">
              Perguntas frequentes sobre este tema
            </h3>
            <div className="space-y-4 divide-y divide-border/50">
              {guia.faq.map((f, fIdx) => (
                <div key={fIdx} className="pt-4 first:pt-0">
                  <h4 className="font-display font-bold text-sm text-foreground">
                    {f.pergunta}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {f.resposta}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Box */}
      <div className="mt-14 rounded-3xl bg-brand p-8 text-center text-primary-foreground shadow-card">
        <h3 className="font-display text-2xl font-bold">
          Pronto para colocar em prática?
        </h3>
        <p className="mt-2 text-sm text-primary-foreground/90 max-w-md mx-auto">
          Crie seu perfil no GlobalLove.com e comece a descobrir pessoas hoje mesmo em mais de 92 países.
        </p>
        <button
          onClick={() => navigate('/descobrir')}
          className="mt-6 rounded-full bg-background px-8 py-3 text-sm font-bold text-foreground shadow-soft hover:opacity-95 transition-transform active:scale-95"
        >
          Criar meu perfil grátis
        </button>
      </div>
    </div>
  );
};
