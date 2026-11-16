import React, { useState, useMemo } from 'react';
import { Globe2, Heart, X, CheckCircle2, Search, ShieldCheck, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COUNTRIES } from '../data/countries';
import { PAISES_DETALHES, CIDADES } from '../data/paises';
import { Profile } from '../types';

export const Mapa: React.FC = () => {
  const { profiles, isLoggedIn, likeProfile, recordProfileView, setFilters, navigate } = useApp();
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [activeRegion, setActiveRegion] = useState<string>('todos');
  const [countrySearch, setCountrySearch] = useState('');

  // Project rounded regional coordinates (0.1 deg grid — ~11km privacy radius)
  const getCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: `${Math.max(5, Math.min(95, x))}%`, y: `${Math.max(10, Math.min(90, y))}%` };
  };

  const mapVisibleProfiles = useMemo(() => {
    return profiles
      .filter((p) => p.showLocation !== false && Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
      .filter((p) => {
        if (activeRegion === 'brasil') return p.pais === 'Brasil';
        if (activeRegion === 'europa') {
          return ['Portugal', 'França', 'Espanha', 'Alemanha', 'Itália', 'Reino Unido'].includes(p.pais);
        }
        if (activeRegion === 'asia') return ['Japão', 'Coreia do Sul', 'Tailândia', 'China'].includes(p.pais);
        if (activeRegion === 'americas') {
          return ['Estados Unidos', 'Canadá', 'México', 'Argentina', 'Colômbia', 'Chile'].includes(p.pais);
        }
        return true;
      });
  }, [profiles, activeRegion]);

  const matchingCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    const list = q ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(q)) : COUNTRIES.slice(0, 36);
    return list;
  }, [countrySearch]);

  const exploreCountry = (countryName: string) => {
    setFilters((prev) => ({ ...prev, pais: countryName }));
    navigate(isLoggedIn ? '/descobrir' : '/entrar');
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-8 pb-24 md:pb-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
            <Globe2 className="size-3.5" /> Mapa & Destinos Globais
          </div>
          <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Conexões pelo Mundo
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            Cobertura internacional em 92+ mercados e privacidade garantida: nenhuma coordenada residencial exata é exposta.
          </p>
        </div>

        {/* Region Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'brasil', label: '🇧🇷 Brasil' },
            { id: 'americas', label: '🌎 Américas' },
            { id: 'europa', label: '🇪🇺 Europa' },
            { id: 'asia', label: '🌏 Ásia' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveRegion(f.id)}
              className={`min-h-[40px] rounded-full px-4 py-2 text-xs font-bold transition-all ${
                activeRegion === f.id
                  ? 'bg-brand text-primary-foreground shadow-soft'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Privacy-Safe Member Map */}
      <div className="relative w-full aspect-[16/10] min-h-[380px] sm:min-h-[460px] rounded-[2.5rem] border border-border bg-[#1a1c2e] overflow-hidden shadow-float">
        <div className="absolute inset-0 opacity-25">
          <svg className="size-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="0.8"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="absolute top-1/2 inset-x-0 border-t border-white/10" />
        <div className="absolute inset-y-0 left-1/2 border-l border-white/10" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <Globe2 className="size-80 text-white" />
        </div>

        {/* If visitor is not logged in, invite them to sign in to view live member pins */}
        {!isLoggedIn && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-xs p-6 text-center text-white">
            <ShieldCheck className="size-10 text-emerald-400 mb-3" />
            <h2 className="font-display text-xl sm:text-2xl font-bold">
              Privacidade de Membros Protegida
            </h2>
            <p className="mt-2 max-w-md text-xs sm:text-sm text-white/85 leading-relaxed">
              Por segurança (LGPD), os marcadores aproximados de membros ativos no mapa ficam visíveis apenas para contas cadastradas e verificadas.
            </p>
            <button
              type="button"
              onClick={() => navigate('/entrar')}
              className="mt-5 min-h-[44px] rounded-full bg-brand px-7 py-3 text-xs font-bold text-white shadow-soft"
            >
              Entrar para Ver Membros no Mapa
            </button>
          </div>
        )}

        {/* Member Pins (Signed-in & opted-in showLocation) */}
        {isLoggedIn &&
          mapVisibleProfiles.map((p) => {
            const coords = getCoordinates(p.latitude, p.longitude);
            const isSelected = selectedProfile?.id === p.id;
            return (
              <div
                key={p.id}
                style={{ left: coords.x, top: coords.y }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProfile(p);
                    void recordProfileView(p);
                  }}
                  aria-label={`Ver ${p.nome} em ${p.cidade}, ${p.pais}`}
                  className={`relative flex items-center gap-1.5 rounded-full p-1.5 shadow-float transition-all duration-200 hover:scale-110 ${
                    isSelected ? 'bg-coral ring-4 ring-white scale-110' : 'bg-card border-2 border-white'
                  }`}
                >
                  <div className="relative size-8 overflow-hidden rounded-full bg-muted">
                    <img
                      src={p.fotos[0] || '/icons/icon-192.webp'}
                      alt={p.nome}
                      className="size-full object-cover"
                    />
                  </div>
                  <span className="text-xs pr-1">{p.bandeira}</span>
                </button>
              </div>
            );
          })}

        {isLoggedIn && mapVisibleProfiles.length === 0 && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center text-white/90">
            <Compass className="size-10 text-amber-300 mb-2" />
            <p className="text-sm font-semibold">
              Nenhum membro com localização pública nesta região ainda.
            </p>
            <button
              type="button"
              onClick={() => setActiveRegion('todos')}
              className="mt-3 rounded-full bg-white/15 px-4 py-2 text-xs font-bold hover:bg-white/25"
            >
              Ver todas as regiões
            </button>
          </div>
        )}

        {/* Selected Profile Overlay */}
        {selectedProfile && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-80 z-30 animate-in slide-in-from-bottom-3 duration-200">
            <div className="rounded-3xl bg-card border border-border p-5 shadow-float text-foreground">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative size-14 overflow-hidden rounded-2xl shadow-soft bg-muted">
                    <img
                      src={selectedProfile.fotos[0] || '/icons/icon-192.webp'}
                      alt={selectedProfile.nome}
                      className="size-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display text-lg font-bold">
                        {selectedProfile.nome}, {selectedProfile.idade}
                      </h3>
                      {selectedProfile.emailVerified && (
                        <CheckCircle2 className="size-4 text-emerald-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <span>{selectedProfile.bandeira}</span>
                      <span>
                        {selectedProfile.cidade}, {selectedProfile.pais}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  aria-label="Fechar prévia"
                  className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                {selectedProfile.bio}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    void likeProfile(selectedProfile);
                    setSelectedProfile(null);
                  }}
                  className="flex-1 min-h-[42px] flex items-center justify-center gap-1.5 rounded-full bg-brand py-2 text-xs font-bold text-primary-foreground shadow-soft active:scale-95"
                >
                  <Heart className="size-3.5 fill-current" /> Curtir
                </button>
                <button
                  type="button"
                  onClick={() => exploreCountry(selectedProfile.pais)}
                  className="min-h-[42px] rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Ver país
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Country & City Explorer (All 249 entries preserved from countries.ts) */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Explorar por País ou Cidade
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Escolha um país da lista completa ({COUNTRIES.length} territórios) para filtrar sua busca em Descobrir.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
            <input
              type="text"
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              placeholder="Pesquisar país..."
              className="w-full min-h-[44px] rounded-full border border-border bg-background pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          {matchingCountries.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => exploreCountry(c.name)}
              className="flex min-h-[44px] items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 text-left text-xs font-semibold text-foreground hover:border-primary/40 hover:bg-muted/40 transition"
            >
              <span className="text-lg shrink-0">{c.flag}</span>
              <span className="truncate">{c.name}</span>
            </button>
          ))}
        </div>

        {/* Highlighted Cities & Country Guides */}
        <div className="border-t border-border pt-5 flex flex-wrap gap-2 items-center text-xs">
          <span className="font-bold text-muted-foreground mr-1">Guias de cidades e países:</span>
          {PAISES_DETALHES.slice(0, 6).map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => navigate(`/pais/${p.slug}`)}
              className="rounded-xl bg-primary/10 px-3 py-1.5 font-semibold text-primary hover:bg-primary/20 transition"
            >
              {p.nome}
            </button>
          ))}
          {CIDADES.slice(0, 6).map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => navigate(`/cidade/${c.slug}`)}
              className="rounded-xl border border-border bg-background px-3 py-1.5 font-semibold text-foreground hover:bg-muted transition"
            >
              {c.nome}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
