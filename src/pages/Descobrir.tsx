import React, { useState, useEffect } from 'react';
import {
  Heart,
  X,
  RotateCcw,
  SlidersHorizontal,
  Star,
  MapPin,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Video,
  UserCheck,
  Flag,
  ShieldBan,
  Loader2,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COUNTRIES } from '../data/countries';
import { LIFESTYLE_HABITS, HABIT_MAP } from '../data/lifestyleHabits';
import { GLOBAL_SEARCH_INTENTS, parseQueryToFilters } from '../data/seoKeywords';
import { VideoCallModal } from '../components/chat/VideoCallModal';
import { ReportModal } from '../components/modals/ReportModal';
import { ConfirmModal } from '../components/modals/ConfirmModal';

export const Descobrir: React.FC = () => {
  const {
    filteredProfiles,
    profilesLoading,
    currentProfile,
    likeProfile,
    passProfile,
    rewindAction,
    filters,
    setFilters,
    getMutualAffinities,
    activeVideoCall,
    startVideoCall,
    endVideoCall,
    blockUser,
    recordProfileView,
    t,
  } = useApp();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [swipeAnimation, setSwipeAnimation] = useState<'like' | 'pass' | 'superlike' | null>(null);
  const [busyAction, setBusyAction] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string; name: string } | null>(null);
  const [blockTarget, setBlockTarget] = useState<{ id: string; name: string } | null>(null);

  const profile = currentProfile || filteredProfiles[0] || null;
  const mutual = profile ? getMutualAffinities(profile) : { interests: [], habits: [], count: 0 };

  useEffect(() => {
    if (!profile?.id) return;
    const timer = window.setTimeout(() => {
      void recordProfileView(profile);
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [profile, recordProfileView]);

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile || profile.fotos.length <= 1) return;
    setActivePhotoIndex((prev) => (prev + 1) % profile.fotos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile || profile.fotos.length <= 1) return;
    setActivePhotoIndex((prev) => (prev - 1 + profile.fotos.length) % profile.fotos.length);
  };

  const handlePass = async () => {
    if (!profile || busyAction) return;
    setBusyAction(true);
    setSwipeAnimation('pass');
    try {
      await new Promise((r) => setTimeout(r, 200));
      await passProfile(profile);
      setActivePhotoIndex(0);
    } finally {
      setSwipeAnimation(null);
      setBusyAction(false);
    }
  };

  const handleLike = async (isSuperlike = false) => {
    if (!profile || busyAction) return;
    setBusyAction(true);
    setSwipeAnimation(isSuperlike ? 'superlike' : 'like');
    try {
      await new Promise((r) => setTimeout(r, 200));
      await likeProfile(profile, isSuperlike);
      setActivePhotoIndex(0);
    } finally {
      setSwipeAnimation(null);
      setBusyAction(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      pais: 'Todos',
      cidade: '',
      busca: '',
      idadeMin: 18,
      idadeMax: 75,
      distanciaMax: 20000,
      interesses: [],
      habitos: [],
      apenasVerificados: false,
      genero: 'todos',
      apenasOnline: false,
    });
  };

  const hasActiveFilters =
    filters.pais !== 'Todos' ||
    Boolean(filters.cidade && filters.cidade.trim()) ||
    Boolean(filters.busca && filters.busca.trim()) ||
    Boolean(filters.apenasOnline) ||
    Boolean(filters.apenasVerificados) ||
    (filters.genero && filters.genero !== 'todos') ||
    filters.distanciaMax < 20000 ||
    (filters.habitos && filters.habitos.length > 0);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-4 pb-24 md:py-8 md:pb-8">
      {/* Top Controls Bar */}
      <div className="flex w-full max-w-md items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">
            {t.nav.discover}
          </h1>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
            {filteredProfiles.length} disponíveis
          </span>
        </div>

        <button
          type="button"
          onClick={() => setFilterModalOpen(true)}
          className="flex min-h-[44px] items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-foreground shadow-soft hover:bg-muted transition-colors"
        >
          <SlidersHorizontal className="size-3.5 text-primary" />
          Filtros
          {hasActiveFilters && <span className="size-2 rounded-full bg-primary animate-pulse" />}
        </button>
      </div>

      {/* Multilingual Semantic Keyword Search */}
      <div className="w-full max-w-md mb-3 space-y-2">
        <div className="relative">
          <Search className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.busca || ''}
            onChange={(e) => {
              const val = e.target.value;
              const smart = val.trim() ? parseQueryToFilters(val) : {};
              setFilters((prev) => ({
                ...prev,
                busca: val,
                ...(smart.pais ? { pais: smart.pais } : {}),
              }));
            }}
            placeholder="Filtrar em qualquer idioma (ex: Japan, Lisboa, café, video...)"
            aria-label="Buscar perfis por palavra-chave multilíngue"
            className="w-full min-h-[42px] rounded-full border border-border bg-card pl-10 pr-9 py-2 text-xs font-medium text-foreground shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {filters.busca && (
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, busca: '' }))}
              aria-label="Limpar busca por palavra-chave"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {GLOBAL_SEARCH_INTENTS.map((intent) => (
            <button
              key={intent.id}
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  ...intent.filterPatch,
                  busca: intent.label,
                }))
              }
              className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                filters.busca === intent.label
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {intent.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card Stack Container */}
      <div className="relative w-full max-w-md aspect-[3/4.3] min-h-[520px] sm:min-h-[560px]">
        {profilesLoading ? (
          <div className="flex size-full flex-col items-center justify-center rounded-[2.5rem] border border-border bg-card p-8 text-center shadow-card">
            <Loader2 className="size-10 animate-spin text-primary mb-3" />
            <p className="text-sm font-semibold text-foreground">Buscando perfis verificados...</p>
            <p className="text-xs text-muted-foreground mt-1">Sincronizando comunidade global.</p>
          </div>
        ) : profile ? (
          <div
            className={`relative size-full overflow-hidden rounded-[2.5rem] bg-card border border-border shadow-float transition-all duration-300 ${
              swipeAnimation === 'like'
                ? 'translate-x-28 rotate-12 opacity-0'
                : swipeAnimation === 'pass'
                ? '-translate-x-28 -rotate-12 opacity-0'
                : swipeAnimation === 'superlike'
                ? '-translate-y-24 opacity-0 scale-95'
                : 'translate-x-0 rotate-0 opacity-100'
            }`}
          >
            {/* Photo Background */}
            <img
              src={profile.fotos[activePhotoIndex] || profile.fotos[0] || '/icons/icon-192.webp'}
              alt={profile.nome}
              className="size-full object-cover select-none"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/30 pointer-events-none" />

            {/* Photo Navigation Touch Areas */}
            {profile.fotos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className="absolute top-0 left-0 bottom-40 w-1/3 z-10 flex items-center justify-start pl-3 opacity-0 hover:opacity-100 transition-opacity"
                  aria-label="Foto anterior"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md">
                    <ChevronLeft className="size-5" />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="absolute top-0 right-0 bottom-40 w-1/3 z-10 flex items-center justify-end pr-3 opacity-0 hover:opacity-100 transition-opacity"
                  aria-label="Próxima foto"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md">
                    <ChevronRight className="size-5" />
                  </span>
                </button>

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

            {/* Status / Location / Safety Controls */}
            <div className="absolute top-8 left-4 right-4 flex items-center justify-between gap-2 z-20">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-black/65 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white max-w-[55%] truncate">
                <span className="text-base shrink-0">{profile.bandeira}</span>
                <span className="truncate">
                  {profile.cidade}, {profile.pais}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {profile.online ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                    <span className="size-2 rounded-full bg-white animate-pulse" />
                    Online
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-medium text-white/85">
                    {profile.ultimoVisto || 'Ativo'}
                  </span>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReportTarget({ id: profile.id, name: profile.nome });
                  }}
                  aria-label={`Denunciar ${profile.nome}`}
                  title="Denunciar perfil"
                  className="grid size-9 place-items-center rounded-full bg-black/60 text-white hover:bg-rose-600 transition"
                >
                  <Flag className="size-4" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBlockTarget({ id: profile.id, name: profile.nome });
                  }}
                  aria-label={`Bloquear ${profile.nome}`}
                  title="Bloquear perfil"
                  className="grid size-9 place-items-center rounded-full bg-black/60 text-white hover:bg-neutral-900 transition"
                >
                  <ShieldBan className="size-4" />
                </button>
              </div>
            </div>

            {/* Profile Info Card at Bottom */}
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white z-20 space-y-2.5">
              {mutual.count > 0 && (
                <div className="rounded-2xl bg-gradient-to-r from-rose-500/40 to-pink-500/40 border border-rose-300/40 backdrop-blur-md p-2.5 shadow-lg">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-100">
                    <Sparkles className="size-3.5 text-amber-300" />
                    <span>{mutual.count} afinidades mútuas em comum</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {mutual.habits.map((hid) => {
                      const h = HABIT_MAP.get(hid);
                      return (
                        <span
                          key={hid}
                          className="inline-flex items-center gap-1 rounded-full bg-rose-600/85 px-2 py-0.5 text-[10px] font-semibold text-white"
                        >
                          <span>{h?.icon || '⭐'}</span>
                          <span>{h?.label || hid}</span>
                        </span>
                      );
                    })}
                    {mutual.interests.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-pink-600/85 px-2 py-0.5 text-[10px] font-semibold text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {profile.nome}
                  </h2>
                  <span className="text-xl sm:text-2xl font-light opacity-90">{profile.idade}</span>
                  {profile.emailVerified && (
                    <span
                      className="inline-flex items-center gap-1 bg-emerald-500/30 border border-emerald-400/50 text-emerald-100 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      title="E-mail verificado"
                    >
                      <UserCheck className="size-3 text-emerald-300" />
                      Verificado
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold text-rose-300">
                    {profile.generoRotulo || 'Membro GlobalLove'}
                  </span>
                  {profile.buscando && (
                    <>
                      <span className="text-white/40">•</span>
                      <span className="text-xs text-white/85 truncate">{profile.buscando}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Approximate Distance & Profession (NEVER street address) */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-white/90">
                {profile.profissao && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="size-3 text-white/70" /> {profile.profissao}
                  </span>
                )}
                {profile.showLocation !== false && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3 text-rose-400" />
                    <span className="font-bold text-amber-300">
                      {profile.distanciaConhecida
                        ? profile.distanciaKm <= 1
                          ? 'Menos de 2 km'
                          : `~${profile.distanciaKm} km`
                        : `${profile.cidade}, ${profile.pais}`}
                    </span>
                  </span>
                )}
              </div>

              {profile.bio && (
                <p className="text-xs leading-relaxed text-white/95 line-clamp-2 font-light">
                  {profile.bio}
                </p>
              )}

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
              Nenhum perfil encontrado
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Amplie os filtros de país, cidade ou idade, ou aguarde novos membros verificados na plataforma.
            </p>
            <div className="mt-6 flex flex-col gap-3 w-full max-w-xs">
              <button
                type="button"
                onClick={resetFilters}
                className="min-h-[44px] w-full rounded-full bg-brand py-3 text-sm font-bold text-primary-foreground shadow-soft"
              >
                Redefinir filtros globais
              </button>
              <button
                type="button"
                onClick={() => void rewindAction()}
                className="min-h-[44px] w-full rounded-full border border-border bg-card py-3 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Desfazer última ação
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Bar */}
      {profile && (
        <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3 sm:gap-5">
          <button
            type="button"
            disabled={busyAction}
            onClick={() => void rewindAction()}
            aria-label="Desfazer última ação"
            className="grid size-12 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-soft transition-transform hover:scale-105 active:scale-90 disabled:opacity-40"
            title="Desfazer"
          >
            <RotateCcw className="size-5" />
          </button>

          <button
            type="button"
            disabled={busyAction}
            onClick={() => void handlePass()}
            aria-label="Passar perfil"
            className="grid size-15 sm:size-16 place-items-center rounded-full border border-rose-200 bg-card text-rose-500 shadow-card transition-transform hover:scale-110 active:scale-90 disabled:opacity-40"
            title="Passar"
          >
            <X className="size-7 sm:size-8 stroke-[2.5]" />
          </button>

          <button
            type="button"
            disabled={busyAction}
            onClick={() => void startVideoCall(profile)}
            aria-label="Testar chamada de vídeo"
            className="grid size-12 place-items-center rounded-full border border-pink-200 bg-card text-pink-500 shadow-soft transition-transform hover:scale-105 active:scale-90 disabled:opacity-40"
            title="Sala de Vídeo"
          >
            <Video className="size-5" />
          </button>

          <button
            type="button"
            disabled={busyAction}
            onClick={() => void handleLike(true)}
            aria-label="Enviar Super Like"
            className="grid size-12 place-items-center rounded-full border border-amber-200 bg-card text-amber-500 shadow-soft transition-transform hover:scale-105 active:scale-90 disabled:opacity-40"
            title="Super Like"
          >
            <Star className="size-5 fill-amber-400 stroke-none" />
          </button>

          <button
            type="button"
            disabled={busyAction}
            onClick={() => void handleLike(false)}
            aria-label="Curtir perfil"
            className="grid size-15 sm:size-16 place-items-center rounded-full bg-brand text-white shadow-float transition-transform hover:scale-110 active:scale-90 disabled:opacity-40"
            title="Curtir"
          >
            <Heart className="size-7 sm:size-8 fill-current" />
          </button>
        </div>
      )}

      {/* Advanced Filters Modal */}
      {filterModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Filtros de Descoberta"
        >
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-float max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-5 text-primary" />
                <h3 className="font-display text-xl font-bold text-foreground">
                  Filtros de Descoberta Global
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFilterModalOpen(false)}
                aria-label="Fechar filtros"
                className="grid min-h-[44px] min-w-[44px] place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {/* Online Only Toggle */}
              <label className="flex items-center justify-between p-3 rounded-2xl bg-muted/50 border border-border cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Apenas Online Agora</p>
                    <p className="text-[11px] text-muted-foreground">Mostrar membros ativos neste momento</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={filters.apenasOnline || false}
                  onChange={(e) => setFilters((prev) => ({ ...prev, apenasOnline: e.target.checked }))}
                  className="size-5 accent-primary rounded"
                />
              </label>

              {/* Verified Only Toggle */}
              <label className="flex items-center justify-between p-3 rounded-2xl bg-muted/50 border border-border cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-foreground">Apenas Contas Verificadas</p>
                  <p className="text-[11px] text-muted-foreground">E-mail confirmado</p>
                </div>
                <input
                  type="checkbox"
                  checked={filters.apenasVerificados || false}
                  onChange={(e) => setFilters((prev) => ({ ...prev, apenasVerificados: e.target.checked }))}
                  className="size-5 accent-primary rounded"
                />
              </label>

              {/* Gender */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Gênero e Identidade
                </label>
                <select
                  value={filters.genero || 'todos'}
                  onChange={(e) => setFilters((prev) => ({ ...prev, genero: e.target.value }))}
                  className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="todos">Todos os gêneros</option>
                  <option value="mulher_cis">Mulher Cisgênero</option>
                  <option value="homem_cis">Homem Cisgênero</option>
                  <option value="mulher_trans">Mulher Trans</option>
                  <option value="homem_trans">Homem Trans</option>
                  <option value="nao_binario">Não-Binário</option>
                  <option value="outro">Outros gêneros</option>
                </select>
              </div>

              {/* Country & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    País
                  </label>
                  <select
                    value={filters.pais}
                    onChange={(e) => setFilters((prev) => ({ ...prev, pais: e.target.value }))}
                    className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-3 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Todos">🌍 Todos os países</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={filters.cidade || ''}
                    onChange={(e) => setFilters((prev) => ({ ...prev, cidade: e.target.value }))}
                    placeholder="Ex: Lisboa, Madrid..."
                    className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Distance Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Distância Máxima</span>
                  <span className="text-primary font-bold">
                    {filters.distanciaMax >= 20000 ? 'Mundo todo' : `${filters.distanciaMax} km`}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="20000"
                  step="50"
                  value={filters.distanciaMax}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, distanciaMax: Number(e.target.value) }))
                  }
                  className="mt-2 w-full accent-primary"
                />
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
                    max="60"
                    value={filters.idadeMin}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFilters((prev) => ({
                        ...prev,
                        idadeMin: val,
                        idadeMax: Math.max(val, prev.idadeMax),
                      }));
                    }}
                    className="w-full accent-primary"
                  />
                  <input
                    type="range"
                    min="18"
                    max="90"
                    value={filters.idadeMax}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFilters((prev) => ({
                        ...prev,
                        idadeMax: val,
                        idadeMin: Math.min(val, prev.idadeMin),
                      }));
                    }}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              {/* Lifestyle Habits Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Hábitos Diários & Rotina
                </label>
                <div className="mt-2 grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {LIFESTYLE_HABITS.map((h) => {
                    const isSelected = filters.habitos?.includes(h.id);
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => {
                          const currentHabits = filters.habitos || [];
                          const updated = isSelected
                            ? currentHabits.filter((id) => id !== h.id)
                            : [...currentHabits, h.id];
                          setFilters((prev) => ({ ...prev, habitos: updated }));
                        }}
                        className={`flex min-h-[40px] items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-left border transition ${
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
                type="button"
                onClick={resetFilters}
                className="w-1/3 min-h-[44px] rounded-full border border-border bg-card py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={() => setFilterModalOpen(false)}
                className="w-2/3 min-h-[44px] rounded-full bg-brand py-2.5 text-sm font-bold text-primary-foreground shadow-soft"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {activeVideoCall && <VideoCallModal profile={activeVideoCall} onClose={endVideoCall} />}

      {reportTarget && (
        <ReportModal
          open={Boolean(reportTarget)}
          targetUid={reportTarget.id}
          targetName={reportTarget.name}
          onClose={() => setReportTarget(null)}
        />
      )}

      <ConfirmModal
        open={Boolean(blockTarget)}
        title={`Bloquear ${blockTarget?.name || ''}?`}
        description="Vocês deixarão de aparecer um para o outro e qualquer conversa existente será bloqueada imediatamente."
        confirmLabel="Bloquear agora"
        destructive
        onCancel={() => setBlockTarget(null)}
        onConfirm={async () => {
          if (!blockTarget) return;
          await blockUser(blockTarget.id, 'Bloqueado na descoberta');
          setBlockTarget(null);
        }}
      />
    </div>
  );
};
