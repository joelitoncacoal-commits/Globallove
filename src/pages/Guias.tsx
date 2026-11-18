import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Search } from 'lucide-react';
import { GUIAS } from '../data/guias';

export const Guias: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = GUIAS.filter(
    (g) =>
      g.titulo.toLowerCase().includes(search.toLowerCase()) ||
      g.descricao.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-4 py-12">
      {/* Header */}
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-3">
          <BookOpen className="size-3.5" /> Conhecimento & Dicas
        </div>
        <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">
          Guias Oficiais GlobalLove.com
        </h1>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          Tudo o que você precisa saber sobre namoro online, fazer amizades internacionais, puxar assunto e manter conversas estimulantes com respeito e segurança.
        </p>
      </div>

      {/* Search Input */}
      <div className="my-8 max-w-md">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por assunto, palavra-chave ou tema..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-border bg-card pl-11 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-soft"
          />
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((guia) => (
          <Link
            key={guia.slug}
            to={`/guias/${guia.slug}`}
            className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:border-primary/40 hover:shadow-card hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-3">
                <span className="text-coral uppercase font-bold tracking-wider">
                  Artigo Oficial
                </span>
                <span>{guia.publicado || 'Outubro 2026'}</span>
              </div>

              <h2 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                {guia.h1}
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                {guia.resumo}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4 text-xs font-bold text-primary">
              <span>Ler guia completo</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
