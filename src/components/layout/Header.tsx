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
  ShieldAlert,
  Bell,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LANGUAGE_OPTIONS } from '../../i18n/translations';
import { SupportedLang } from '../../types';

export const Header: React.FC = () => {
  const {
    currentRoute,
    navigate,
    isLoggedIn,
    isAdmin,
    matches,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    t,
    currentLang,
    setLang,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const totalUnread = matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setNotifOpen(false);
  };

  const currentLangObj = LANGUAGE_OPTIONS.find((l) => l.code === currentLang) || LANGUAGE_OPTIONS[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 sm:h-20 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => handleNav('/')}
          className="flex min-h-[44px] items-center gap-2 text-left transition-transform active:scale-95 group"
        >
          <span className="grid size-8 sm:size-9 place-items-center rounded-xl bg-brand text-primary-foreground shadow-soft group-hover:scale-105 transition-transform">
            <Heart className="size-4 fill-current" />
          </span>
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-foreground flex items-baseline">
              <span>Global</span>
              <span className="text-coral">Love</span>
              <span className="text-xs font-semibold text-muted-foreground ml-0.5">.com</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground -mt-0.5 hidden sm:inline">
              Global Dating • 92+ Countries
            </span>
          </div>
        </button>

        {/* Desktop Nav - Authenticated */}
        {isLoggedIn ? (
          <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              onClick={() => handleNav('/descobrir')}
              className={`flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                currentRoute === '/descobrir'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Flame className="size-4" />
              {t.nav.discover}
            </button>
            <button
              type="button"
              onClick={() => handleNav('/mapa')}
              className={`flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                currentRoute === '/mapa'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <MapPin className="size-4" />
              {t.nav.map}
            </button>
            <button
              type="button"
              onClick={() => handleNav('/mural')}
              className={`flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                currentRoute === '/mural'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Compass className="size-4" />
              {t.nav.mural}
            </button>
            <button
              type="button"
              onClick={() => handleNav('/matches')}
              className={`relative flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
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
              type="button"
              onClick={() => handleNav('/conversas')}
              className={`relative flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
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
              type="button"
              onClick={() => handleNav('/perfil')}
              className={`flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                currentRoute === '/perfil'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <User className="size-4" />
              {t.nav.profile}
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => handleNav('/admin')}
                className={`flex min-h-[38px] items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ml-1 ${
                  currentRoute === '/admin'
                    ? 'bg-rose-600 text-white shadow-soft'
                    : 'border border-rose-500/30 text-rose-700 bg-rose-500/10 hover:bg-rose-500/20'
                }`}
                title="Painel Administrativo"
              >
                <ShieldAlert className="size-3.5" />
                <span>Admin</span>
              </button>
            )}
          </nav>
        ) : (
          /* Desktop Nav - Public (Clean, strictly zero Admin link exposure to unauthenticated guests) */
          <nav aria-label="Navegação pública" className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => handleNav('/descobrir')}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                currentRoute === '/descobrir' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.nav.discover}
            </button>
            <button
              type="button"
              onClick={() => handleNav('/mapa')}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                currentRoute === '/mapa' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.nav.map}
            </button>
            <button
              type="button"
              onClick={() => handleNav('/guias')}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                currentRoute === '/guias' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.nav.guides}
            </button>
            <button
              type="button"
              onClick={() => handleNav('/entrar')}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.nav.login}
            </button>
            <button
              type="button"
              onClick={() => handleNav('/entrar')}
              className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-soft transition-transform active:scale-95"
            >
              {t.nav.register}
            </button>
          </nav>
        )}

        {/* Right controls: Notifications + Language + Free badge */}
        <div className="flex items-center gap-2">
          {/* Notifications Popover (Authenticated only) */}
          {isLoggedIn && (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setLangDropdownOpen(false);
                }}
                aria-label="Notificações"
                className="relative grid min-h-[44px] min-w-[44px] place-items-center rounded-full bg-card border border-border text-foreground hover:bg-muted transition"
              >
                <Bell className="size-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-coral text-[9px] font-bold text-white">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-card border border-border shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/60">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Notificações
                    </span>
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Fechar
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-border/50">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted-foreground">
                        Nenhuma notificação recente.
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={async () => {
                            if (!n.read) await markNotificationRead(n.id);
                            setNotifOpen(false);
                            if (n.link) handleNav(n.link);
                          }}
                          className={`w-full text-left p-3 hover:bg-muted/70 transition rounded-xl ${
                            n.read ? 'opacity-70' : 'bg-primary/5'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-foreground line-clamp-1">{n.title}</span>
                            {!n.read && <span className="size-2 shrink-0 rounded-full bg-coral" />}
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{n.body}</p>
                          <span className="text-[10px] text-muted-foreground/80 mt-1 block">{n.createdAt}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Language Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setLangDropdownOpen(!langDropdownOpen);
                setNotifOpen(false);
              }}
              className="flex min-h-[44px] items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-card border border-border text-xs font-semibold text-foreground hover:bg-muted transition"
              title="Mudar idioma / Change language"
              aria-label="Selecionar idioma"
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
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => {
                      setLang(opt.code as SupportedLang);
                      setLangDropdownOpen(false);
                    }}
                    className={`flex min-h-[38px] items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                      currentLang === opt.code
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{opt.flag}</span>
                      <span>{opt.label}</span>
                    </span>
                    {currentLang === opt.code && <span className="size-1.5 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 100% Free Badge */}
          <button
            type="button"
            onClick={() => handleNav('/planos')}
            className="hidden lg:flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 shadow-soft transition-all hover:bg-emerald-500/25"
          >
            <Sparkles className="size-3 text-emerald-700" />
            100% Free
          </button>

          {/* Mobile Drawer Trigger */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid min-h-[44px] min-w-[44px] place-items-center rounded-xl bg-card border border-border text-foreground"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-card px-5 py-5 md:hidden animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNav('/perfil')}
                  className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-left font-semibold text-foreground hover:bg-muted"
                >
                  <User className="size-5 text-primary" /> {t.nav.profile}
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/guias')}
                  className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-left font-semibold text-foreground hover:bg-muted"
                >
                  <Compass className="size-5 text-primary" /> {t.nav.guides}
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/seguranca')}
                  className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-left font-semibold text-foreground hover:bg-muted"
                >
                  <ShieldAlert className="size-5 text-emerald-600" /> Segurança & Privacidade
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleNav('/admin')}
                    className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-left font-bold text-rose-700 bg-rose-500/10 border border-rose-500/20"
                  >
                    <ShieldAlert className="size-5 text-rose-600" /> Painel Admin
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNav('/descobrir')}
                  className="min-h-[44px] rounded-xl px-3 py-2 text-left font-semibold text-foreground hover:bg-muted"
                >
                  {t.nav.discover}
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/mapa')}
                  className="min-h-[44px] rounded-xl px-3 py-2 text-left font-semibold text-foreground hover:bg-muted"
                >
                  {t.nav.map}
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/guias')}
                  className="min-h-[44px] rounded-xl px-3 py-2 text-left font-semibold text-foreground hover:bg-muted"
                >
                  {t.nav.guides}
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/entrar')}
                  className="min-h-[44px] rounded-xl px-3 py-2 text-left font-semibold text-foreground hover:bg-muted"
                >
                  {t.nav.login}
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/entrar')}
                  className="mt-1 min-h-[44px] rounded-xl bg-brand px-3 py-2.5 text-center font-semibold text-primary-foreground"
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
