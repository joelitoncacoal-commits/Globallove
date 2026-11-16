import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Globe2,
  ShieldCheck,
  ArrowRight,
  Flame,
  CheckCircle2,
  ChevronDown,
  Video,
  MessageCircle,
  MapPin,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COUNTRIES } from '../data/countries';
import { GUIAS } from '../data/guias';
import { PAISES_DETALHES } from '../data/paises';
import { FAQ_HOME } from '../data/institutional';

export const Home: React.FC = () => {
  const { navigate, isLoggedIn, profiles, setFilters, t } = useApp();
  const [countrySearch, setCountrySearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  ).slice(0, 24);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleCountryClick = (countryName: string) => {
    const matchedDetail = PAISES_DETALHES.find(
      (p) => p.nome.toLowerCase() === countryName.toLowerCase()
    );
    if (matchedDetail) {
      navigate(`/pais/${matchedDetail.slug}`);
      return;
    }
    setFilters((prev) => ({ ...prev, pais: countryName }));
    navigate(isLoggedIn ? '/descobrir' : '/mapa');
  };

  return (
    <div className="flex flex-col pb-16 md:pb-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-warm py-12 md:py-20 border-b border-border/50">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left Column */}
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5 text-coral" /> {t.hero.badge}
            </div>

            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.12]">
              {t.hero.titleStart}{' '}
              <span className="text-coral underline decoration-primary/30 underline-offset-8">
                {t.hero.titleHighlight}
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground">
              {t.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => navigate(isLoggedIn ? '/descobrir' : '/entrar')}
                className="flex min-h-[48px] items-center gap-2.5 rounded-full bg-brand px-7 sm:px-8 py-3.5 text-sm sm:text-base font-bold text-primary-foreground shadow-card transition-all hover:opacity-95 active:scale-95"
              >
                <Flame className="size-5" /> {isLoggedIn ? t.hero.ctaPrimary : 'Criar Conta Grátis (18+)'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/mapa')}
                className="flex min-h-[48px] items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm sm:text-base font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <Globe2 className="size-4 text-primary" /> {t.hero.ctaSecondary}
              </button>
            </div>

            {/* Trust Metrics (Truthful Platform Capabilities) */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border/60 pt-6 w-full max-w-lg">
              <div>
                <span className="font-display text-2xl font-bold text-primary sm:text-3xl">92+</span>
                <p className="text-xs text-muted-foreground mt-0.5">{t.hero.statsCountries}</p>
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-foreground sm:text-3xl">100%</span>
                <p className="text-xs text-muted-foreground mt-0.5">{t.hero.statsFree}</p>
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-emerald-600 sm:text-3xl">18+</span>
                <p className="text-xs text-muted-foreground mt-0.5">E-mail Verificado & LGPD</p>
              </div>
            </div>
          </div>

          {/* Right Column: Honest Platform Preview Card */}
          <div className="relative mx-auto w-full max-w-sm sm:max-w-md">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border shadow-float p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700">
                  <ShieldCheck className="size-4" /> Match Mútuo Real
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {isLoggedIn ? `${profiles.length} perfis ativos` : '8 idiomas'}
                </span>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-rose-500/10 via-amber-500/10 to-primary/10 border border-border p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-2xl bg-brand text-white shadow-soft shrink-0">
                    <Heart className="size-6 fill-current" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-foreground">
                      Conexões Sem Barreiras
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Conversas liberadas apenas após curtida mútua.
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>Contas verificadas por e-mail e confirmação 18+</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="size-4 text-rose-500 shrink-0" />
                    <span>Localização aproximada por cidade (privacidade LGPD)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircle className="size-4 text-primary shrink-0" />
                    <span>Chat em tempo real com fotos, vídeos e áudio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="size-4 text-amber-600 shrink-0" />
                    <span>Bloqueio instantâneo e moderação ativa contra abusos</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate(isLoggedIn ? '/descobrir' : '/entrar')}
                  className="min-h-[46px] w-full rounded-full bg-brand py-3 text-sm font-bold text-primary-foreground shadow-soft transition hover:opacity-95"
                >
                  {isLoggedIn ? 'Ir para Descobrir' : 'Começar Agora Gratuitamente'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/seguranca')}
                  className="min-h-[44px] w-full rounded-full border border-border bg-background py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition"
                >
                  Conhecer nossos padrões de segurança
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Highlights */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Diferenciais Globais
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-foreground">
            Feito para aproximar pessoas com respeito e verdade
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            Cadastro inclusivo por identidade de gênero, verificação por e-mail, hábitos do dia a dia e controle total sobre sua privacidade.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="grid size-12 place-items-center rounded-2xl bg-rose-500/15 text-rose-600 mb-4">
              <Heart className="size-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">Afinidades Mútuas</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Compare hábitos reais da rotina (café, esportes, leitura, culinária, viagens) para iniciar conversas com mais naturalidade.
            </p>
          </div>

          <div className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary mb-4">
              <Video className="size-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">Sala de Prévia em Vídeo</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Teste câmera e microfone com segurança dentro da plataforma e registre convites para conversas ao vivo.
            </p>
          </div>

          <div className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="grid size-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600 mb-4">
              <MessageCircle className="size-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">Chat Seguro com Mídias</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Troque mensagens de texto, fotos otimizadas, vídeos curtos e recados de voz gratuitamente após o match mútuo.
            </p>
          </div>

          <div className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="grid size-12 place-items-center rounded-2xl bg-amber-500/15 text-amber-600 mb-4">
              <Globe2 className="size-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">Cobertura em 92+ Países</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Interface localizada em 8 idiomas (PT, EN, ES, FR, DE, IT, JA, ZH) e busca direta por país ou cidade.
            </p>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="bg-sand/40 border-y border-border py-16">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Presença Global
              </span>
              <h2 className="mt-1 font-display text-3xl font-extrabold text-foreground">
                Descubra pessoas pelo mundo
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-lg">
                Explore países e cidades. Clique em qualquer destino para filtrar ou conhecer os guias culturais locais.
              </p>
            </div>
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Buscar país..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="w-full min-h-[44px] rounded-full border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleCountryClick(country.name)}
                className="flex min-h-[48px] items-center gap-2 rounded-2xl border border-border bg-card p-3 text-left transition-all hover:border-primary/40 hover:shadow-soft"
              >
                <span className="text-xl shrink-0">{country.flag}</span>
                <span className="text-xs font-semibold text-foreground truncate">
                  {country.name}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 justify-center text-xs text-muted-foreground">
            <span>Destinos em destaque:</span>
            <button type="button" onClick={() => navigate('/pais/brasil')} className="text-primary font-bold hover:underline">
              Brasil 🇧🇷
            </button>
            <span>•</span>
            <button type="button" onClick={() => navigate('/pais/portugal')} className="text-primary font-bold hover:underline">
              Portugal 🇵🇹
            </button>
            <span>•</span>
            <button type="button" onClick={() => navigate('/pais/espanha')} className="text-primary font-bold hover:underline">
              Espanha 🇪🇸
            </button>
            <span>•</span>
            <button type="button" onClick={() => navigate('/pais/estados-unidos')} className="text-primary font-bold hover:underline">
              Estados Unidos 🇺🇸
            </button>
            <span>•</span>
            <button type="button" onClick={() => navigate('/pais/japao')} className="text-primary font-bold hover:underline">
              Japão 🇯🇵
            </button>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Conteúdo e Dicas
            </span>
            <h2 className="mt-1 font-display text-3xl font-extrabold text-foreground">
              Guias para conhecer pessoas
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Recomendações práticas sobre segurança digital, etiqueta cultural e comunicação à distância.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/guias')}
            className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
          >
            Ver todos os {GUIAS.length} guias <ArrowRight className="size-4" />
          </button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GUIAS.slice(0, 6).map((guia) => (
            <button
              key={guia.slug}
              type="button"
              onClick={() => navigate(`/guias/${guia.slug}`)}
              className="group flex flex-col justify-between text-left rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:border-primary/40 hover:shadow-card"
            >
              <div>
                <span className="text-[11px] font-bold text-coral uppercase tracking-wider">
                  Guia Oficial
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {guia.h1}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {guia.resumo}
                </p>
              </div>
              <div className="mt-6 flex w-full items-center justify-between border-t border-border/50 pt-4 text-xs font-semibold text-primary">
                <span>Ler artigo completo</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto w-full max-w-3xl px-5 py-16">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Dúvidas Comuns
          </span>
          <h2 className="mt-1 font-display text-3xl font-extrabold text-foreground">
            Perguntas frequentes
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQ_HOME.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.pergunta}
                className="overflow-hidden rounded-2xl border border-border bg-card transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex min-h-[56px] w-full items-center justify-between p-5 text-left font-semibold text-foreground transition-colors hover:text-primary"
                >
                  <span className="text-base pr-4">{faq.pergunta}</span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                    {faq.resposta}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-20">
        <div className="flex flex-col items-start gap-6 rounded-[2.5rem] bg-brand p-8 sm:p-10 text-primary-foreground shadow-card md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-primary-foreground">
              Pronto para encontrar conexões reais?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-primary-foreground/90 leading-relaxed">
              Junte-se à comunidade GlobalLove.com agora mesmo. 100% gratuito para maiores de 18 anos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(isLoggedIn ? '/descobrir' : '/entrar')}
            className="min-h-[48px] rounded-full bg-background px-8 py-4 text-sm sm:text-base font-bold text-foreground shadow-soft transition-transform active:scale-95 hover:opacity-95 shrink-0"
          >
            {isLoggedIn ? 'Explorar Perfis' : 'Cadastre-se Grátis'}
          </button>
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" />
          Respeito, privacidade e conexões por interesse mútuo.
        </p>
      </section>
    </div>
  );
};
