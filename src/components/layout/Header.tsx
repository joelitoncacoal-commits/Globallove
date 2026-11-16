import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  MapPin,
  MessageCircle,
  Heart,
  User,
  Menu,
  X,
  Flame,
  Globe,
  ChevronDown,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LANGUAGE_OPTIONS } from '../../i18n/translations';
import { SupportedLang } from '../../types';

export const Header: React.FC = () => {
  const { currentRoute, navigate, isLoggedIn, matches, t, currentLang, setLang } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const totalUnread = matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const currentLangObj = LANGUAGE_OPTIONS.find(l => l.code === currentLang) || LANGUAGE_OPTIONS[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 sm:h-20 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo - Compact GlobalLove.com */}
        <button
          onClick={() => handleNav('/')}
          className="flex items-center gap-2 text-left transition-transform active:scale-95 group"
        >
          <span className="grid size-8 sm:size-9 place-items-center rounded-xl bg-brand text-primary-foreground shadow-soft group-hover:scale-105 transition-transform">
            <Heart className="size-4 sm:size-4.5 fill-current" />
          </span>
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-foreground flex items-baseline">
              <span>Global</span>
              <span className="text-coral">Love</span>
              <span className="text-xs font-semibold text-muted-foreground ml-0.5">.com</span>
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground -mt-0.5 hidden sm:inline">
              Global Dating • 92+ Countries
            </span>
          </div>
        </button>

        {/* Desktop Nav - Authenticated */}
        {isLoggedIn ? (
          <nav className="hidden items-center gap-1 md:flex">
            <button
              onClick={() => handleNav('/descobrir')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                currentRoute === '/descobrir'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Flame className="size-4" />
              {t.nav.discover}
            </button>
            <button
              onClick={() => handleNav('/mapa')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                currentRoute === '/mapa'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <MapPin className="size-4" />
              {t.nav.map}
            </button>
            <button
              onClick={() => handleNav('/mural')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                currentRoute === '/mural'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Compass className="size-4" />
              {t.nav.mural}
            </button>
            <button
              onClick={() => handleNav('/matches')}
              className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                currentRoute === '/matches'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Heart className="size-4" />
              {t.nav.matches}
              {matches.length > 0 && (
                <span className="flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {matches.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNav('/conversas')}
              className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                currentRoute.startsWith('/conversas')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <MessageCircle className="size-4" />
              {t.nav.chats}
              {totalUnread > 0 && (
                <span className="flex size-4.5 items-center justify-center rounded-full bg-coral text-[10px] font-bold text-white">
                  {totalUnread}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNav('/perfil')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                currentRoute === '/perfil'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <User className="size-4" />
              {t.nav.profile}
            </button>
            <button
              onClick={() => handleNav('/admin')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ml-1 ${
                currentRoute === '/admin'
                  ? 'bg-rose-600 text-white shadow-soft'
                  : 'border border-rose-500/30 text-rose-600 bg-rose-500/10 hover:bg-rose-500/20'
              }`}
              title="Painel Administrativo em Tempo Real"
            >
              <ShieldAlert className="size-3.5" />
              <span>Área ADM</span>
            </button>
          </nav>
        ) : (
          /* Desktop Nav - Public */
          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => handleNav('/admin')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                currentRoute === '/admin'
                  ? 'bg-rose-600 text-white shadow-soft'
                  : 'border border-rose-500/30 text-rose-600 bg-rose-500/10 hover:bg-rose-500/20'
              }`}
            >
              <ShieldAlert className="size-3.5" />
              <span>Área ADM</span>
            </button>
            <button
              onClick={() => handleNav('/descobrir')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                currentRoute === '/descobrir' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.nav.discover}
            </button>
            <button
              onClick={() => handleNav('/guias')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                currentRoute === '/guias' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.nav.guides}
            </button>
            <button
              onClick={() => handleNav('/mural')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                currentRoute === '/mural' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.nav.mural}
            </button>
            <button
              onClick={() => handleNav('/entrar')}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.nav.login}
            </button>
            <button
              onClick={() => handleNav('/entrar')}
              className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-soft transition-transform active:scale-95"
            >
              {t.nav.register}
            </button>
          </div>
        )}

        {/* Right side items: Language switcher & Free badge */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-card border border-border text-xs font-semibold text-foreground hover:bg-muted transition"
              title="Mudar idioma / Change language"
            >
              <Globe className="size-3.5 text-muted-foreground" />
              <span>{currentLangObj.flag}</span>
              <span className="hidden sm:inline uppercase">{currentLangObj.code}</span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-card border border-border shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Idioma / Language
                </div>
                {LANGUAGE_OPTIONS.map(opt => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      setLang(opt.code as SupportedLang);
                      setLangDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-2.5 py-2 rounded-xl text-xs font-medium transition ${
                      currentLang === opt.code
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{opt.flag}</span>
                      <span>{opt.label}</span>
                    </span>
                    {currentLang === opt.code && (
                      <span className="size-1.5 rounded-full bg-primary"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 100% Free badge */}
          <button
            onClick={() => handleNav('/planos')}
            className="hidden lg:flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 shadow-soft transition-all hover:bg-emerald-500/25"
          >
            <Sparkles className="size-3 text-emerald-600" />
            100% Free
          </button>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-1.5 md:hidden">
            {isLoggedIn && (
              <button
                onClick={() => handleNav('/conversas')}
                className="relative p-2 text-muted-foreground"
              >
                <MessageCircle className="size-5" />
                {totalUnread > 0 && (
                  <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-coral text-[9px] font-bold text-white">
                    {totalUnread}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid size-9 place-items-center rounded-xl bg-card border border-border text-foreground"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-card px-5 py-5 md:hidden animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2.5">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => handleNav('/descobrir')}
                  className="flex items-center gap-3 rounded-xl p-2.5 text-left font-semibold text-foreground hover:bg-muted"
                >
                  <Flame className="size-5 text-primary" /> {t.nav.discover}
                </button>
                <button
                  onClick={() => handleNav('/mapa')}
                  className="flex items-center gap-3 rounded-xl p-2.5 text-left font-semibold text-foreground hover:bg-muted"
                >
                  <MapPin className="size-5 text-primary" /> {t.nav.map}
                </button>
                <button
                  onClick={() => handleNav('/mural')}
                  className="flex items-center gap-3 rounded-xl p-2.5 text-left font-semibold text-foreground hover:bg-muted"
                >
                  <Compass className="size-5 text-primary" /> {t.nav.mural}
                </button>
                <button
                  onClick={() => handleNav('/matches')}
                  className="flex items-center justify-between rounded-xl p-2.5 text-left font-semibold text-foreground hover:bg-muted"
                >
                  <span className="flex items-center gap-3">
                    <Heart className="size-5 text-coral" /> {t.nav.matches}
                  </span>
                  {matches.length > 0 && (
                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary font-bold">
                      {matches.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleNav('/conversas')}
                  className="flex items-center justify-between rounded-xl p-2.5 text-left font-semibold text-foreground hover:bg-muted"
                >
                  <span className="flex items-center gap-3">
                    <MessageCircle className="size-5 text-primary" /> {t.nav.chats}
                  </span>
                  {totalUnread > 0 && (
                    <span className="rounded-full bg-coral px-2 py-0.5 text-xs text-white font-bold">
                      {totalUnread}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleNav('/perfil')}
                  className="flex items-center gap-3 rounded-xl p-2.5 text-left font-semibold text-foreground hover:bg-muted"
                >
                  <User className="size-5 text-primary" /> {t.nav.profile}
                </button>
                <button
                  onClick={() => handleNav('/admin')}
                  className="flex items-center gap-3 rounded-xl p-2.5 text-left font-bold text-rose-600 bg-rose-500/10 border border-rose-500/20"
                >
                  <ShieldAlert className="size-5 text-rose-600" /> Área ADM (Tempo Real)
                </button>
                <button
                  onClick={() => handleNav('/planos')}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 p-2.5 font-semibold text-white shadow-soft"
                >
                  <Sparkles className="size-4" /> 100% Gratuito (Tudo Liberado)
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNav('/admin')}
                  className="flex items-center gap-3 rounded-xl p-2.5 text-left font-bold text-rose-600 bg-rose-500/10 border border-rose-500/20"
                >
                  <ShieldAlert className="size-5 text-rose-600" /> Área ADM (Tempo Real)
                </button>
                <button
                  onClick={() => handleNav('/descobrir')}
                  className="rounded-xl p-2.5 text-left font-semibold text-foreground hover:bg-muted"
                >
                  {t.nav.discover}
                </button>
                <button
                  onClick={() => handleNav('/guias')}
                  className="rounded-xl p-2.5 text-left font-semibold text-foreground hover:bg-muted"
                >
                  {t.nav.guides}
                </button>
                <button
                  onClick={() => handleNav('/mural')}
                  className="rounded-xl p-2.5 text-left font-semibold text-foreground hover:bg-muted"
                >
                  {t.nav.mural}
                </button>
                <button
                  onClick={() => handleNav('/entrar')}
                  className="rounded-xl p-2.5 text-left font-semibold text-foreground hover:bg-muted"
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => handleNav('/entrar')}
                  className="mt-2 rounded-xl bg-brand p-2.5 text-center font-semibold text-primary-foreground"
                >
                  {t.nav.register}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
