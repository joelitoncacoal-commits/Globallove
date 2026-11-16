import React from 'react';
import { ArrowLeft, Globe2, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PAISES_DETALHES, CIDADES } from '../data/paises';
import { COUNTRIES } from '../data/countries';
import { slugifyCountry, getMultilingualCountryKeywords } from '../data/seoKeywords';

export const PaisDetalhe: React.FC<{ slug: string }> = ({ slug }) => {
  const { navigate, isLoggedIn, setFilters } = useApp();

  const detailedCountry = PAISES_DETALHES.find((p) => p.slug === slug);
  const dynamicCountryMeta =
    COUNTRIES.find(
      (c) => slugifyCountry(c.name) === slug || c.code.toLowerCase() === slug.toLowerCase()
    ) || COUNTRIES.find((c) => c.name === detailedCountry?.nome);

  const paisItem = detailedCountry || {
    slug: dynamicCountryMeta ? slugifyCountry(dynamicCountryMeta.name) : slug,
    nome: dynamicCountryMeta?.name || 'Comunidade Global',
    codigo: dynamicCountryMeta?.code || 'GLOBAL',
    titulo: dynamicCountryMeta
      ? `Namoro e Conexões em ${dynamicCountryMeta.name} ${dynamicCountryMeta.flag} — GlobalLove.com`
      : 'Namoro e Conexões Internacionais — GlobalLove.com',
    descricao: dynamicCountryMeta
      ? `Conheça pessoas verificadas em ${dynamicCountryMeta.name} gratuitamente. Chat em tempo real, chamadas de vídeo, amizades e relacionamentos sérios com privacidade LGPD/GDPR.`
      : 'Conheça pessoas verificadas no mundo todo gratuitamente no GlobalLove.com.',
    intro: '',
    secoes: [
      {
        titulo: `Como conhecer pessoas em ${dynamicCountryMeta?.name || 'outro país'}`,
        paragrafos: [
          `No GlobalLove.com você pode filtrar diretamente por ${dynamicCountryMeta?.name || 'qualquer país'}, idioma, interesses e hábitos diários — 100% grátis e sem barreiras.`,
        ],
      },
      {
        titulo: 'Segurança, Verificação e Privacidade',
        paragrafos: [
          'Todas as contas exigem confirmação de e-mail, declaração de maioridade (18+) e só liberam o chat privado após match mútuo.',
        ],
      },
    ],
    faq: [
      {
        pergunta: `O GlobalLove.com é gratuito em ${dynamicCountryMeta?.name || 'todos os países'}?`,
        resposta: 'Sim! 100% gratuito para descobrir perfis, curtir, conversar e fazer vídeo chamadas.',
      },
    ],
  };

  const keywordsPreview = getMultilingualCountryKeywords(paisItem.nome).slice(0, 8);

  const handleExploreCountry = () => {
    setFilters((prev) => ({
      ...prev,
      pais: dynamicCountryMeta?.name || paisItem.nome,
      cidade: '',
      busca: '',
    }));
    navigate(isLoggedIn ? '/descobrir' : '/entrar');
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-10 pb-24 md:pb-12">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex min-h-[40px] items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground mb-8 self-start transition-colors"
      >
        <ArrowLeft className="size-4" /> Voltar à Página Inicial
      </button>

      <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-3 self-start">
        <Globe2 className="size-3.5" /> Namoro Internacional {dynamicCountryMeta?.flag || '🌍'}
      </div>

      <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
        {paisItem.titulo}
      </h1>

      <p className="mt-4 text-base text-muted-foreground font-medium leading-relaxed bg-card border border-border p-5 rounded-3xl shadow-soft">
        {paisItem.descricao}
      </p>

      {/* Multilingual Quick Discovery Chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        {keywordsPreview.map((kw) => (
          <button
            key={kw}
            type="button"
            onClick={handleExploreCountry}
            className="rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition"
          >
            {kw}
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="mt-10 space-y-8">
        {paisItem.secoes.map((secao, i) => (
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

        {paisItem.faq && paisItem.faq.length > 0 && (
          <div className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" /> Dúvidas frequentes sobre conexões em {paisItem.nome}
            </h3>
            {paisItem.faq.map((f, idx) => (
              <div key={idx} className="border-t border-border/50 pt-3">
                <h4 className="text-sm font-bold text-foreground">{f.pergunta}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.resposta}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Internal City Links */}
      {CIDADES.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 items-center text-xs">
          <span className="font-bold text-muted-foreground mr-1">Cidades populares:</span>
          {CIDADES.slice(0, 6).map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => navigate(`/cidade/${c.slug}`)}
              className="rounded-xl border border-border bg-card px-3 py-1.5 font-semibold text-foreground hover:border-primary/40"
            >
              {c.nome}
            </button>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 rounded-3xl bg-brand p-8 text-center text-primary-foreground shadow-card">
        <h3 className="font-display text-2xl font-bold">
          Conheça pessoas em {paisItem.nome}
        </h3>
        <p className="mt-2 text-xs text-primary-foreground/90 max-w-md mx-auto">
          Filtre perfis verificados em {paisItem.nome} e inicie conversas respeitosas gratuitamente.
        </p>
        <button
          type="button"
          onClick={handleExploreCountry}
          className="mt-5 min-h-[44px] rounded-full bg-background px-8 py-3 text-sm font-bold text-foreground shadow-soft hover:opacity-95"
        >
          Explorar Perfis em {paisItem.nome}
        </button>
      </div>
    </div>
  );
};
