import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Globe2,
  ShieldCheck,
  Compass,
  ArrowRight,
  Flame,
  CheckCircle2,
  ChevronDown,
  Video,
  Radio,
  Coffee,
  MessageCircle,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COUNTRIES } from '../data/countries';
import { GUIAS } from '../data/guias';
import { FAQ_HOME } from '../data/institutional';
import { INITIAL_PROFILES } from '../data/mockProfiles';

export const Home: React.FC = () => {
  const { navigate, likeProfile, startVideoCall, t } = useApp();
  const [countrySearch, setCountrySearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const featuredProfile = INITIAL_PROFILES[0]; // Camila Santos
  const [likedHero, setLikedHero] = useState(false);

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  ).slice(0, 16);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleHeroLike = () => {
    setLikedHero(true);
    likeProfile(featuredProfile);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-warm py-12 md:py-20 border-b border-border/50">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column: Copy & Actions */}
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

            <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {t.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/descobrir')}
                className="flex items-center gap-2.5 rounded-full bg-brand px-8 py-4 text-base font-bold text-primary-foreground shadow-card transition-all hover:opacity-95 active:scale-95"
              >
                <Flame className="size-5" /> {t.hero.ctaPrimary}
              </button>
              <button
                onClick={() => navigate('/mapa')}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-6 py-4 text-base font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <Globe2 className="size-4 text-primary" /> {t.hero.ctaSecondary}
              </button>
            </div>

            {/* Global Key Trust Metrics */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border/60 pt-6">
              <div>
                <span className="font-display text-2xl font-bold text-primary sm:text-3xl">92+</span>
                <p className="text-xs text-muted-foreground mt-0.5">{t.hero.statsCountries}</p>
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-foreground sm:text-3xl">100%</span>
                <p className="text-xs text-muted-foreground mt-0.5">{t.hero.statsFree}</p>
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-emerald-600 sm:text-3xl">Vídeo HD</span>
                <p className="text-xs text-muted-foreground mt-0.5">Chamadas & Chat Grátis</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Card Preview with Video Call Launch */}
          <div className="relative mx-auto w-full max-w-sm sm:max-w-md">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border shadow-float p-3">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem]">
                <img
                  src={featuredProfile.fotos[0]}
                  alt={featuredProfile.nome}
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Country Pill & Live Status */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white">
                  <span>{featuredProfile.bandeira}</span>
                  <span>{featuredProfile.cidade}, {featuredProfile.pais}</span>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                    <span className="size-1.5 rounded-full bg-white animate-pulse" />
                    Online
                  </span>
                </div>

                {/* Mutual Affinities Teaser */}
                <div className="absolute top-16 left-4 right-4 rounded-xl bg-rose-500/40 border border-rose-300/40 backdrop-blur-md px-3 py-1.5 text-xs text-white">
                  <span className="font-bold">✨ Ambos amam:</span> Café Matinal & Livros
                </div>

                {/* Profile Details in Hero */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-display text-2xl font-bold">{featuredProfile.nome}</h3>
                    <span className="text-xl font-normal opacity-90">{featuredProfile.idade}</span>
                    <CheckCircle2 className="size-5 text-coral fill-coral/30" />
                  </div>
                  <div className="flex items-center gap-2 text-xs opacity-85 mt-0.5">
                    <span>{featuredProfile.generoRotulo || 'Mulher Cis'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><MapPin className="size-3 text-rose-300" /> {featuredProfile.distanciaKm} km</span>
                  </div>

                  <p className="text-xs line-clamp-2 mt-2 opacity-90 leading-relaxed font-light">
                    {featuredProfile.bio}
                  </p>

                  {/* Action triggers */}
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => navigate('/descobrir')}
                      className="flex-1 rounded-full bg-white/20 backdrop-blur-md py-2.5 text-xs font-bold text-white hover:bg-white/30 transition-colors"
                    >
                      Ver mais perfis
                    </button>
                    <button
                      onClick={() => startVideoCall(featuredProfile)}
                      className="p-2.5 rounded-full bg-rose-600 text-white shadow-soft hover:bg-rose-700 transition"
                      title="Vídeo chamada"
                    >
                      <Video className="size-4" />
                    </button>
                    <button
                      onClick={handleHeroLike}
                      className={`grid size-11 place-items-center rounded-full shadow-soft transition-transform active:scale-90 ${
                        likedHero ? 'bg-coral text-white scale-105' : 'bg-brand text-white hover:opacity-95'
                      }`}
                      title="Curtir perfil"
                    >
                      <Heart className={`size-5 ${likedHero ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Badges */}
            <div className="absolute -top-4 -right-4 rounded-2xl bg-card border border-border px-3.5 py-2 shadow-card flex items-center gap-2">
              <span className="flex size-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-foreground">Novo Match em Lisboa!</span>
            </div>
            <div className="absolute -bottom-4 -left-4 rounded-2xl bg-card border border-border px-3.5 py-2 shadow-card flex items-center gap-2">
              <Video className="size-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Vídeo Chamada HD Ativa</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Highlights */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Diferenciais Globais</span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-foreground">
            Feito para aproximar pessoas com respeito e verdade
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            Cadastro completo com opção para cada gênero, idade verdadeira, foto real, endereço e hábitos do dia a dia.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft hover:-translate-y-1 transition">
            <div className="grid size-12 place-items-center rounded-2xl bg-rose-500/15 text-rose-600 mb-4">
              <Heart className="size-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">
              Afinidades Mútuas
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Se você e a outra pessoa gostam da mesma coisa na rotina (café, treino, pets, culinária), destacamos para ambos!
            </p>
          </div>

          <div className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft hover:-translate-y-1 transition">
            <div className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary mb-4">
              <Video className="size-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">
              Vídeo Chamadas HD
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Converse cara a cara antes de marcar um encontro. Chamadas de vídeo integradas com máxima privacidade.
            </p>
          </div>

          <div className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft hover:-translate-y-1 transition">
            <div className="grid size-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600 mb-4">
              <MessageCircle className="size-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">
              Chat com Mídias
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Envie fotos do seu dia, vídeos curtos e notas de voz para quebrar o gelo de forma natural e sem custo.
            </p>
          </div>

          <div className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft hover:-translate-y-1 transition">
            <div className="grid size-12 place-items-center rounded-2xl bg-amber-500/15 text-amber-600 mb-4">
              <Globe2 className="size-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">
              Presença em 92 Países
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Localização automática e tradução em tempo real para inglês, espanhol, francês, alemão, italiano, japonês e mandarim.
            </p>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="bg-sand/40 border-y border-border py-16">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Presença Global</span>
              <h2 className="mt-1 font-display text-3xl font-extrabold text-foreground">
                Descubra pessoas em 92 países
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-lg">
                Explore cidades e países ao redor do mundo. Conecte-se com pessoas locais para amizades, namoro e intercâmbio cultural.
              </p>
            </div>
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Buscar país..."
                value={countrySearch}
                onChange={e => setCountrySearch(e.target.value)}
                className="w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {filteredCountries.map(country => (
              <button
                key={country.code}
                onClick={() => navigate('/descobrir')}
                className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 text-left transition-all hover:border-primary/40 hover:shadow-soft"
              >
                <span className="text-xl">{country.flag}</span>
                <span className="text-xs font-semibold text-foreground truncate">
                  {country.name}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 justify-center text-xs text-muted-foreground">
            <span>Destinos em destaque:</span>
            <button onClick={() => navigate('/pais/brasil')} className="text-primary font-bold hover:underline">
              Brasil 🇧🇷
            </button>
            <span>•</span>
            <button onClick={() => navigate('/pais/portugal')} className="text-primary font-bold hover:underline">
              Portugal 🇵🇹
            </button>
            <span>•</span>
            <button onClick={() => navigate('/pais/espanha')} className="text-primary font-bold hover:underline">
              Espanha 🇪🇸
            </button>
            <span>•</span>
            <button onClick={() => navigate('/pais/estados-unidos')} className="text-primary font-bold hover:underline">
              Estados Unidos 🇺🇸
            </button>
            <span>•</span>
            <button onClick={() => navigate('/pais/japao')} className="text-primary font-bold hover:underline">
              Japão 🇯🇵
            </button>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Conteúdo e Dicas</span>
            <h2 className="mt-1 font-display text-3xl font-extrabold text-foreground">
              Guias para conhecer pessoas
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Dicas de especialistas sobre segurança, puxar assunto e construir conexões reais.
            </p>
          </div>
          <button
            onClick={() => navigate('/guias')}
            className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
          >
            Ver todos os {GUIAS.length} guias →
          </button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GUIAS.slice(0, 6).map(guia => (
            <div
              key={guia.slug}
              onClick={() => navigate(`/guias/${guia.slug}`)}
              className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-soft cursor-pointer transition-all hover:border-primary/40 hover:shadow-card"
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
              <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4 text-xs font-semibold text-primary">
                <span>Ler artigo completo</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto w-full max-w-3xl px-5 py-16">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Dúvidas Comuns</span>
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
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-5 text-left font-semibold text-foreground transition-colors hover:text-primary"
                >
                  <span className="text-base">{faq.pergunta}</span>
                  <ChevronDown
                    className={`size-5 text-muted-foreground transition-transform duration-200 ${
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
        <div className="flex flex-col items-start gap-6 rounded-[2.5rem] bg-brand p-10 text-primary-foreground shadow-card md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
              Pronto para encontrar conexões reais?
            </h2>
            <p className="mt-3 text-base text-primary-foreground/90 leading-relaxed">
              Junte-se à comunidade GlobalLove.com agora mesmo. 100% gratuito e sem custos ocultos.
            </p>
          </div>
          <button
            onClick={() => navigate('/entrar')}
            className="rounded-full bg-background px-8 py-4 text-base font-bold text-foreground shadow-soft transition-transform active:scale-95 hover:opacity-95 shrink-0"
          >
            Cadastre-se Grátis
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
