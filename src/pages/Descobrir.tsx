import React, { useState } from 'react';
import {
  Heart,
  X,
  RotateCcw,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  MapPin,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Video,
  Radio,
  Flame,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COUNTRIES } from '../data/countries';
import { LIFESTYLE_HABITS, HABIT_MAP } from '../data/lifestyleHabits';
import { VideoCallModal } from '../components/chat/VideoCallModal';

export const Descobrir: React.FC = () => {
  const {
    filteredProfiles,
    currentProfile,
    likeProfile,
    passProfile,
    rewindAction,
    filters,
    setFilters,
    navigate,
    getMutualAffinities,
    activeVideoCall,
    startVideoCall,
    endVideoCall,
    t
  } = useApp();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [swipeAnimation, setSwipeAnimation] = useState<'like' | 'pass' | 'superlike' | null>(null);

  const profile = currentProfile || filteredProfiles[0] || null;
  const mutual = profile ? getMutualAffinities(profile) : { interests: [], habits: [], count: 0 };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile) return;
    setActivePhotoIndex((prev) => (prev + 1) % profile.fotos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile) return;
    setActivePhotoIndex((prev) => (prev - 1 + profile.fotos.length) % profile.fotos.length);
  };

  const handlePass = () => {
    if (!profile) return;
    setSwipeAnimation('pass');
    setTimeout(() => {
      passProfile(profile);
      setSwipeAnimation(null);
      setActivePhotoIndex(0);
    }, 250);
  };

  const handleLike = () => {
    if (!profile) return;
    setSwipeAnimation('like');
    setTimeout(() => {
      likeProfile(profile);
      setSwipeAnimation(null);
      setActivePhotoIndex(0);
    }, 250);
  };

  const handleSuperlike = () => {
    if (!profile) return;
    setSwipeAnimation('superlike');
    setTimeout(() => {
      likeProfile(profile);
      setSwipeAnimation(null);
      setActivePhotoIndex(0);
    }, 250);
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-4 md:py-8">
      {/* Top Controls Bar */}
      <div className="flex w-full max-w-md items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl sm:text-2xl font-bold text-foreground">
            {t.nav.discover}
          </span>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
            {filteredProfiles.length} online e disponíveis
          </span>
        </div>

        <button
          onClick={() => setFilterModalOpen(true)}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-bold text-foreground shadow-soft hover:bg-muted transition-colors"
        >
          <SlidersHorizontal className="size-3.5 text-primary" />
          Filtros
          {(filters.pais !== 'Todos' || filters.apenasOnline || (filters.habitos && filters.habitos.length > 0)) && (
            <span className="size-2 rounded-full bg-primary animate-pulse" />
          )}
        </button>
      </div>

      {/* Card Stack Container */}
      <div className="relative w-full max-w-md aspect-[3/4.4] min-h-[560px]">
        {profile ? (
          <div
            className={`relative size-full overflow-hidden rounded-[2.5rem] bg-card border border-border shadow-float transition-all duration-300 ${
              swipeAnimation === 'like'
                ? 'translate-x-32 rotate-12 opacity-0'
                : swipeAnimation === 'pass'
                ? '-translate-x-32 -rotate-12 opacity-0'
                : swipeAnimation === 'superlike'
                ? '-translate-y-32 opacity-0 scale-95'
                : 'translate-x-0 rotate-0 opacity-100'
            }`}
          >
            {/* Photo Background */}
            <img
              src={profile.fotos[activePhotoIndex] || profile.fotos[0]}
              alt={profile.nome}
              className="size-full object-cover select-none"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 pointer-events-none" />

            {/* Photo Navigation Touch Areas */}
            {profile.fotos.length > 1 && (
              <>
                <button
                  onClick={handlePrevPhoto}
                  className="absolute top-0 left-0 bottom-40 w-1/3 z-10 flex items-center justify-start pl-3 opacity-0 hover:opacity-100 transition-opacity"
                  aria-label="Foto anterior"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md">
                    <ChevronLeft className="size-5" />
                  </span>
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute top-0 right-0 bottom-40 w-1/3 z-10 flex items-center justify-end pr-3 opacity-0 hover:opacity-100 transition-opacity"
                  aria-label="Próxima foto"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md">
                    <ChevronRight className="size-5" />
                  </span>
                </button>

                {/* Photo Indicator Bars */}
                <div className="absolute top-4 inset-x-4 flex gap-1.5 z-20">
                  {profile.fotos.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        i === activePhotoIndex ? 'bg-white shadow-soft' : 'bg-white/35'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Status / Location / Verified Badge */}
            <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white">
                <span className="text-base">{profile.bandeira}</span>
                <span>{profile.cidade}, {profile.pais}</span>
              </div>

              <div className="flex items-center gap-2">
                {profile.online ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                    <span className="size-2 rounded-full bg-white animate-pulse" />
                    Online
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-medium text-white/80">
                    {profile.ultimoVisto || 'Visto hoje'}
                  </span>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startVideoCall(profile);
                  }}
                  className="p-2 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white shadow-md active:scale-95 transition"
                  title="Chamar em vídeo"
                >
                  <Video className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Profile Info Card at Bottom */}
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white z-20 space-y-2.5">
              
              {/* Mutual Affinities Callout - "Ambos gostam disso!" */}
              {mutual.count > 0 && (
                <div className="rounded-2xl bg-gradient-to-r from-rose-500/40 to-pink-500/40 border border-rose-300/40 backdrop-blur-md p-2.5 shadow-lg animate-in fade-in">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-200">
                    <Sparkles className="size-3.5 text-amber-300" />
                    <span>✨ {mutual.count} Afinidades Mútuas! Ambos gostam de:</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {mutual.habits.map((hid) => {
                      const h = HABIT_MAP.get(hid);
                      return (
                        <span
                          key={hid}
                          className="inline-flex items-center gap-1 rounded-full bg-rose-600/80 px-2 py-0.5 text-[10px] font-semibold text-white shadow-xs"
                        >
                          <span>{h?.icon || '⭐'}</span>
                          <span>{h?.label || hid}</span>
                        </span>
                      );
                    })}
                    {mutual.interests.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-pink-600/80 px-2 py-0.5 text-[10px] font-semibold text-white shadow-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Name, Verified Age & Detailed Gender */}
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {profile.nome}
                  </h2>
                  <span className="text-xl sm:text-2xl font-light opacity-90">{profile.idade} anos</span>
                  <span className="inline-flex items-center gap-1 bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full" title="Idade e identidade verificadas">
                    <UserCheck className="size-3 text-emerald-300" />
                    Verificada
                  </span>
                </div>

                {/* Detailed Gender label */}
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold text-rose-300">
                    {profile.generoRotulo || (profile.genero === 'mulher_cis' ? 'Mulher Cis' : profile.genero === 'homem_cis' ? 'Homem Cis' : 'Pessoa Autêntica')}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-xs text-white/80">{profile.buscando}</span>
                </div>
              </div>

              {/* Address & Distance */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-white/90">
                <span className="flex items-center gap-1">
                  <Briefcase className="size-3 text-white/70" /> {profile.profissao}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-rose-400" />
                  <span>{profile.endereco ? `${profile.endereco} • ` : ''}</span>
                  <span className="font-bold text-amber-300">{profile.distanciaKm < 1 ? 'Menos de 1 km' : `${profile.distanciaKm} km`}</span>
                </span>
              </div>

              {/* Bio */}
              <p className="text-xs leading-relaxed text-white/95 line-clamp-2 font-light">
                {profile.bio}
              </p>

              {/* Day-to-day Lifestyle Habits */}
              {profile.habitos && profile.habitos.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {profile.habitos.slice(0, 4).map((hid) => {
                    const h = HABIT_MAP.get(hid);
                    if (!h) return null;
                    return (
                      <span
                        key={hid}
                        className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-white/95"
                      >
                        <span>{h.icon}</span>
                        <span>{h.label}</span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex size-full flex-col items-center justify-center rounded-[2.5rem] border border-border bg-card p-8 text-center shadow-card">
            <div className="grid size-16 place-items-center rounded-3xl bg-primary/10 text-primary mb-4">
              <Sparkles className="size-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground">
              Você viu todos os perfis!
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Tente ampliar seus filtros de distância ou país para descobrir novas pessoas ao redor do mundo.
            </p>
            <div className="mt-6 flex flex-col gap-3 w-full max-w-xs">
              <button
                onClick={() => {
                  setFilters({
                    pais: 'Todos',
                    idadeMin: 18,
                    idadeMax: 65,
                    distanciaMax: 20000,
                    interesses: [],
                    habitos: [],
                    apenasVerificados: false,
                    genero: 'todos',
                    apenasOnline: false
                  });
                }}
                className="w-full rounded-full bg-brand py-3 text-sm font-bold text-primary-foreground shadow-soft"
              >
                Redefinir filtros globais
              </button>
              <button
                onClick={rewindAction}
                className="w-full rounded-full border border-border bg-card py-3 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Desfazer última ação
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Bar */}
      {profile && (
        <div className="mt-4 sm:mt-6 flex items-center justify-center gap-4 sm:gap-6">
          {/* Rewind */}
          <button
            onClick={rewindAction}
            className="grid size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-soft transition-transform hover:scale-105 active:scale-90"
            title="Desfazer"
          >
            <RotateCcw className="size-4.5" />
          </button>

          {/* Pass */}
          <button
            onClick={handlePass}
            className="grid size-14 sm:size-16 place-items-center rounded-full border border-rose-200 bg-card text-rose-500 shadow-card transition-transform hover:scale-110 active:scale-90"
            title="Passar"
          >
            <X className="size-7 sm:size-8 stroke-[2.5]" />
          </button>

          {/* Video Call Quick Launch */}
          <button
            onClick={() => startVideoCall(profile)}
            className="grid size-11 place-items-center rounded-full border border-pink-200 bg-card text-pink-500 shadow-soft transition-transform hover:scale-105 active:scale-90"
            title="Iniciar Vídeo Chamada"
          >
            <Video className="size-5" />
          </button>

          {/* Superlike */}
          <button
            onClick={handleSuperlike}
            className="grid size-11 place-items-center rounded-full border border-amber-200 bg-card text-amber-500 shadow-soft transition-transform hover:scale-105 active:scale-90"
            title="Super Like"
          >
            <Star className="size-5 fill-amber-400 stroke-none" />
          </button>

          {/* Like */}
          <button
            onClick={handleLike}
            className="grid size-14 sm:size-16 place-items-center rounded-full bg-brand text-white shadow-float transition-transform hover:scale-110 active:scale-90"
            title="Curtir"
          >
            <Heart className="size-7 sm:size-8 fill-current" />
          </button>
        </div>
      )}

      {/* Advanced Filters Modal / Drawer */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-float max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-5 text-primary" />
                <h3 className="font-display text-xl font-bold text-foreground">
                  Filtros de Descoberta Global
                </h3>
              </div>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {/* Online Only Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/50 border border-border">
                <div className="flex items-center gap-2.5">
                  <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <div>
                    <p className="text-xs font-bold text-foreground">Apenas Online Agora</p>
                    <p className="text-[11px] text-muted-foreground">Mostrar apenas pessoas ativas neste momento</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={filters.apenasOnline || false}
                  onChange={(e) => setFilters(prev => ({ ...prev, apenasOnline: e.target.checked }))}
                  className="size-4 accent-primary rounded"
                />
              </div>

              {/* Detailed Gender Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Gênero e Identidade
                </label>
                <select
                  value={filters.genero || 'todos'}
                  onChange={(e) => setFilters(prev => ({ ...prev, genero: e.target.value }))}
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="todos">✨ Todos os gêneros</option>
                  <option value="mulher_cis">Mulher Cis</option>
                  <option value="homem_cis">Homem Cis</option>
                  <option value="mulher_trans">Mulher Trans</option>
                  <option value="homem_trans">Homem Trans</option>
                  <option value="nao_binario">Não-Binário</option>
                  <option value="outro">Outros gêneros</option>
                </select>
              </div>

              {/* Country Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  País
                </label>
                <select
                  value={filters.pais}
                  onChange={(e) => setFilters(prev => ({ ...prev, pais: e.target.value }))}
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Todos">🌍 Todos os países (Global)</option>
                  <option value="Brasil">🇧🇷 Brasil</option>
                  <option value="Portugal">🇵🇹 Portugal</option>
                  <option value="Argentina">🇦🇷 Argentina</option>
                  <option value="Espanha">🇪🇸 Espanha</option>
                  <option value="França">🇫🇷 França</option>
                  <option value="Japão">🇯🇵 Japão</option>
                  <option value="Estados Unidos">🇺🇸 Estados Unidos</option>
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Age Range */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Faixa Etária</span>
                  <span className="text-primary font-bold">
                    {filters.idadeMin} — {filters.idadeMax} anos
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <input
                    type="range"
                    min="18"
                    max="50"
                    value={filters.idadeMin}
                    onChange={(e) =>
                      setFilters(prev => ({ ...prev, idadeMin: Number(e.target.value) }))
                    }
                    className="w-full accent-primary"
                  />
                  <input
                    type="range"
                    min="25"
                    max="75"
                    value={filters.idadeMax}
                    onChange={(e) =>
                      setFilters(prev => ({ ...prev, idadeMax: Number(e.target.value) }))
                    }
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              {/* Lifestyle Habits Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Hábitos Diários & Rotina Desejada
                </label>
                <div className="mt-2 grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {LIFESTYLE_HABITS.map(h => {
                    const isSelected = filters.habitos?.includes(h.id);
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => {
                          const currentHabits = filters.habitos || [];
                          const updated = isSelected
                            ? currentHabits.filter(id => id !== h.id)
                            : [...currentHabits, h.id];
                          setFilters(prev => ({ ...prev, habitos: updated }));
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-left border transition ${
                          isSelected
                            ? 'bg-rose-500/15 border-rose-500 text-rose-700 font-bold'
                            : 'border-border bg-background text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        <span>{h.icon}</span>
                        <span className="truncate">{h.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setFilters({
                    pais: 'Todos',
                    idadeMin: 18,
                    idadeMax: 65,
                    distanciaMax: 20000,
                    interesses: [],
                    habitos: [],
                    apenasVerificados: false,
                    genero: 'todos',
                    apenasOnline: false
                  });
                }}
                className="w-1/3 rounded-full border border-border bg-card py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Limpar
              </button>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="w-2/3 rounded-full bg-brand py-2.5 text-sm font-bold text-primary-foreground shadow-soft"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Modal if launched from discovery */}
      {activeVideoCall && (
        <VideoCallModal
          profile={activeVideoCall}
          onClose={endVideoCall}
        />
      )}
    </div>
  );
};
