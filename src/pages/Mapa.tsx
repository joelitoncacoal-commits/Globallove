import React, { useState } from 'react';
import { Globe2, MapPin, Heart, Sparkles, X, CheckCircle2, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Profile } from '../types';

export const Mapa: React.FC = () => {
  const { profiles, likeProfile, navigate } = useApp();
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('todos');

  // Convert lat/lng to percentage on a Mercator/Equirectangular projection
  // Lat: -90 to +90 -> Y: 100% to 0%
  // Lng: -180 to +180 -> X: 0% to 100%
  const getCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: `${Math.max(5, Math.min(95, x))}%`, y: `${Math.max(10, Math.min(90, y))}%` };
  };

  const filteredMapProfiles = profiles.filter(p => {
    if (activeFilter === 'brasil') return p.pais === 'Brasil';
    if (activeFilter === 'europa') return ['Portugal', 'França', 'Espanha'].includes(p.pais);
    if (activeFilter === 'asia') return p.pais === 'Japão';
    return true;
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
            <Globe2 className="size-3.5" /> Mapa Global de Membros
          </div>
          <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Conexões pelo Mundo
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore perfis ativos conectados em 92 países. Toque em um ponto para ver detalhes.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'todos', label: 'Todos os Países' },
            { id: 'brasil', label: '🇧🇷 Brasil' },
            { id: 'europa', label: '🇪🇺 Europa' },
            { id: 'asia', label: '🇯🇵 Ásia' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                activeFilter === f.id
                  ? 'bg-brand text-primary-foreground shadow-soft'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas Card */}
      <div className="relative w-full aspect-[16/10] min-h-[460px] rounded-[2.5rem] border border-border bg-[#1a1c2e] overflow-hidden shadow-float">
        {/* World Map SVG / Grid Graphic */}
        <div className="absolute inset-0 opacity-25">
          <svg className="size-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Equator & Meridians decorative lines */}
        <div className="absolute top-1/2 inset-x-0 border-t border-white/10" />
        <div className="absolute inset-y-0 left-1/2 border-l border-white/10" />

        {/* Continents silhouette background visual */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <Globe2 className="size-96 text-white" />
        </div>

        {/* Interactive Member Pins */}
        {filteredMapProfiles.map((p) => {
          const coords = getCoordinates(p.latitude, p.longitude);
          const isSelected = selectedProfile?.id === p.id;

          return (
            <div
              key={p.id}
              style={{ left: coords.x, top: coords.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
            >
              {/* Pulsing ring */}
              <span className="absolute -inset-2 rounded-full bg-coral/30 animate-ping" />

              {/* Pin Button */}
              <button
                onClick={() => setSelectedProfile(p)}
                className={`relative flex items-center gap-1.5 rounded-full p-1.5 shadow-float transition-all duration-200 group-hover:scale-125 ${
                  isSelected
                    ? 'bg-coral ring-4 ring-white scale-125'
                    : 'bg-card border-2 border-white'
                }`}
              >
                <div className="relative size-8 overflow-hidden rounded-full">
                  <img src={p.fotos[0]} alt={p.nome} className="size-full object-cover" />
                </div>
                <span className="text-xs pr-1">{p.bandeira}</span>
              </button>

              {/* Hover Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                <div className="rounded-xl bg-black/80 backdrop-blur-md px-3 py-1.5 text-center text-white shadow-card text-[11px] whitespace-nowrap">
                  <span className="font-bold">{p.nome}, {p.idade}</span>
                  <div className="text-[10px] text-white/70">{p.cidade}, {p.pais}</div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Selected Profile Float Card Overlay */}
        {selectedProfile && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-80 z-30 animate-in slide-in-from-bottom-3 duration-200">
            <div className="rounded-3xl bg-card border border-border p-5 shadow-float text-foreground">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative size-14 overflow-hidden rounded-2xl shadow-soft">
                    <img
                      src={selectedProfile.fotos[0]}
                      alt={selectedProfile.nome}
                      className="size-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-display text-lg font-bold">
                        {selectedProfile.nome}, {selectedProfile.idade}
                      </h4>
                      <CheckCircle2 className="size-4 text-coral" />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <span>{selectedProfile.bandeira}</span>
                      <span>{selectedProfile.cidade}, {selectedProfile.pais}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProfile(null)}
                  className="grid size-7 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                {selectedProfile.bio}
              </p>

              <div className="mt-3 flex flex-wrap gap-1">
                {selectedProfile.interesses.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    likeProfile(selectedProfile);
                    setSelectedProfile(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-brand py-2.5 text-xs font-bold text-primary-foreground shadow-soft transition-transform active:scale-95"
                >
                  <Heart className="size-3.5 fill-current" /> Curtir
                </button>
                <button
                  onClick={() => navigate('/descobrir')}
                  className="rounded-full border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Ver no card
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
