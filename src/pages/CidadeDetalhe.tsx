import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CIDADES } from '../data/paises';
import { Seo } from '../components/Seo';

export const CidadeDetalhe: React.FC<{ slug: string }> = ({ slug }) => {
  const { isLoggedIn, setFilters, currentLang } = useApp();
  const cidadeItem = CIDADES.find((c) => c.slug === slug) || CIDADES[0];
  const targetRoute = isLoggedIn
    ? `/descobrir?cidade=${encodeURIComponent(cidadeItem.nome)}`
    : '/entrar';

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-10 pb-24 md:pb-12">
      <Seo
        path={`/cidade/${slug}`}
        lang={currentLang}
        title={`${cidadeItem.titulo} | GlobalLove.com`}
        description={cidadeItem.descricao}
      />

      <Link
        to="/"
        className="flex min-h-[40px] items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground mb-8 self-start transition-colors"
      >
        <ArrowLeft className="size-4" /> Voltar à Página Inicial
      </Link>

      <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-3 self-start">
        <MapPin className="size-3.5" /> Encontros Locais
      </div>

      <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
        {cidadeItem.titulo}
      </h1>

      <p className="mt-4 text-base text-muted-foreground font-medium leading-relaxed bg-card border border-border p-5 rounded-3xl shadow-soft">
        {cidadeItem.descricao}
      </p>

      <div className="mt-10 space-y-8">
        {cidadeItem.secoes.map((secao, i) => (
          <section key={i} className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {secao.titulo}
            </h2>
            {secao.paragrafos.map((p, pIdx) => (
              <p key={pIdx} className="text-muted-foreground text-sm leading-relaxed">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-2 items-center text-xs">
        <span className="font-bold text-muted-foreground mr-1">Outras cidades:</span>
        {CIDADES.filter((c) => c.slug !== cidadeItem.slug).map((c) => (
          <Link
            key={c.slug}
            to={`/cidade/${c.slug}`}
            className="rounded-xl border border-border bg-card px-3 py-1.5 font-semibold text-foreground hover:border-primary/40"
          >
            {c.nome}
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-3xl bg-brand p-8 text-center text-primary-foreground shadow-card">
        <h3 className="font-display text-2xl font-bold">
          Encontre pessoas em {cidadeItem.nome}
        </h3>
        <p className="mt-2 text-xs text-primary-foreground/90 max-w-md mx-auto">
          Filtre por cidade e distância aproximada para descobrir pessoas com interesses em comum.
        </p>
        <Link
          to={targetRoute}
          onClick={() => setFilters((prev) => ({ ...prev, pais: 'Todos', cidade: cidadeItem.nome }))}
          className="mt-5 inline-flex items-center justify-center min-h-[44px] rounded-full bg-background px-8 py-3 text-sm font-bold text-foreground shadow-soft hover:opacity-95"
        >
          Ver perfis em {cidadeItem.nome}
        </Link>
      </div>
    </div>
  );
};
