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
  Eye,
  CheckCheck,
  BellRing,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LANGUAGE_OPTIONS } from '../../i18n/translations';
import { SupportedLang } from '../../types';

export const Header: React.FC = () => {
  const {
    currentRoute,
    navigate,
    isLoggedIn,
    isOwnerAdmin,
    matches,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    browserNotifPermission,
    browserNotifEnabled,
    enableBrowserNotifications,
    toggleBrowserNotifications,
    t,
    currentLang,
    setLang,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('all');

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
        <Link
          to="/"
          onClick={() => {
            setMobileMenuOpen(false);
            setNotifOpen(false);
          }}
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
        </Link>

        {/* Desktop Nav - Authenticated */}
        {isLoggedIn ? (
          <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
            <Link
              to="/descobrir"
              onClick={() => {
                setMobileMenuOpen(false);
                setNotifOpen(false);
              }}
              className={`flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                currentRoute === '/descobrir'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Flame className="size-4" />
              {t.nav.discover}
            </Link>
            <Link
              to="/mapa"
              onClick={() => {
                setMobileMenuOpen(false);
                setNotifOpen(false);
              }}
              className={`flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                currentRoute === '/mapa'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <MapPin className="size-4" />
              {t.nav.map}
            </Link>
            <Link
              to="/mural"
              onClick={() => {
                setMobileMenuOpen(false);
                setNotifOpen(false);
              }}
              className={`flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                currentRoute === '/mural'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Compass className="size-4" />
              {t.nav.mural}
            </Link>
            <Link
              to="/matches"
              onClick={() => {
                setMobileMenuOpen(false);
                setNotifOpen(false);
              }}
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
            </Link>
            <Link
              to="/conversas"
              onClick={() => {
                setMobileMenuOpen(false);
                setNotifOpen(false);
              }}
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
            </Link>
            <Link
              to="/perfil"
              onClick={() => {
                setMobileMenuOpen(false);
                setNotifOpen(false);
              }}
              className={`flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                currentRoute === '/perfil'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <User className="size-4" />
              {t.nav.profile}
            </Link>
            {isOwnerAdmin && (
              <Link
                to="/admin"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setNotifOpen(false);
                }}
                className={`flex min-h-[38px] items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ml-1 ${
                  currentRoute === '/admin'
                    ? 'bg-rose-600 text-white shadow-soft'
                    : 'border border-rose-500/30 text-rose-700 bg-rose-500/10 hover:bg-rose-500/20'
                }`}
                title="Painel Administrativo"
              >
                <ShieldAlert className="size-3.5" />
                <span>ADM</span>
              </Link>
            )}
          </nav>
        ) : (
          /* Desktop Nav - Public (Clean, strictly zero Admin link exposure to unauthenticated guests) */
          <nav aria-label="Navegação pública" className="hidden items-center gap-2 md:flex">
            <Link
              to="/descobrir"
              onClick={() => {
                setMobileMenuOpen(false);
                setNotifOpen(false);
              }}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                currentRoute === '/descobrir' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.nav.discover}
            </Link>
            <Link
              to="/mapa"
              onClick={() => {
                setMobileMenuOpen(false);
                setNotifOpen(false);
              }}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                currentRoute === '/mapa' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.nav.map}
            </Link>
            <Link
              to="/guias"
              onClick={() => {
                setMobileMenuOpen(false);
                setNotifOpen(false);
              }}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                currentRoute === '/guias' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.nav.guides}
            </Link>
            <Link
              to="/entrar"
              onClick={() => {
                setMobileMenuOpen(false);
                setNotifOpen(false);
              }}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.nav.login}
            </Link>
            <Link
              to="/entrar"
              onClick={() => {
                setMobileMenuOpen(false);
                setNotifOpen(false);
              }}
              className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-soft transition-transform active:scale-95"
            >
              {t.nav.register}
            </Link>
          </nav>
        )}

        {/* Right controls: Notifications + Language + Free badge */}
        <div className="flex items-center gap-2">
          {/* Bell / Sino Notification Center (Authenticated & Guest Preview) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotifOpen(!notifOpen);
                setLangDropdownOpen(false);
              }}
              aria-label="Notificações"
              title="Central de Notificações e Alertas no Navegador"
              className="relative grid min-h-[44px] min-w-[44px] place-items-center rounded-full bg-card border border-border text-foreground hover:bg-muted transition"
            >
              <Bell className={`size-4 ${unreadNotificationsCount > 0 ? 'text-primary' : ''}`} />
              {isLoggedIn && unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-coral text-[9px] font-bold text-white">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
              {!isLoggedIn && (
                <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-coral animate-pulse" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-card border border-border shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 space-y-2.5">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60">
                      <div className="flex items-center gap-1.5">
                        <BellRing className="size-4 text-primary" />
                        <span className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                          Notificações
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadNotificationsCount > 0 && (
                          <button
                            type="button"
                            onClick={() => void markAllNotificationsRead()}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                          >
                            <CheckCheck className="size-3.5" /> Marcar lidas
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setNotifOpen(false)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                          aria-label="Fechar notificações"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Google Chrome / Browser Push Opt-In Banner */}
                    <div className="rounded-xl border border-border bg-muted/40 p-2.5 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-foreground truncate">
                          Alertas no Google Chrome / Celular
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {browserNotifEnabled
                            ? 'Ativo para visualizações, mensagens e matches.'
                            : browserNotifPermission === 'denied'
                            ? 'Bloqueado no navegador — libere no cadeado da URL.'
                            : 'Receba avisos instantâneos fora da aba.'}
                        </p>
                      </div>
                      {browserNotifEnabled ? (
                        <button
                          type="button"
                          onClick={() => void toggleBrowserNotifications(false)}
                          className="shrink-0 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-bold text-emerald-700 hover:bg-emerald-500/25"
                        >
                          Ativo ✓
                        </button>
                      ) : browserNotifPermission === 'denied' ? (
                        <span className="shrink-0 rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-bold text-amber-800">
                          Bloqueado
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void enableBrowserNotifications()}
                          className="shrink-0 rounded-full bg-brand px-3 py-1.5 text-[10px] font-bold text-primary-foreground shadow-soft hover:opacity-95"
                        >
                          Ativar
                        </button>
                      )}
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setNotifFilter('all')}
                        className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
                          notifFilter === 'all'
                            ? 'bg-primary/15 text-primary'
                            : 'text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        Todas ({notifications.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotifFilter('unread')}
                        className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
                          notifFilter === 'unread'
                            ? 'bg-coral/15 text-coral'
                            : 'text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        Não lidas ({unreadNotificationsCount})
                      </button>
                    </div>

                    {/* Activity Feed */}
                    <div className="max-h-72 overflow-y-auto divide-y divide-border/50">
                      {(notifFilter === 'unread'
                        ? notifications.filter((n) => !n.read)
                        : notifications
                      ).length === 0 ? (
                        <div className="p-5 text-center text-xs text-muted-foreground">
                          {notifFilter === 'unread'
                            ? 'Você leu todas as notificações.'
                            : 'Nenhuma atividade recente ainda (curtidas, mensagens, visualizações de perfil e mural aparecem aqui).'}
                        </div>
                      ) : (
                        (notifFilter === 'unread'
                          ? notifications.filter((n) => !n.read)
                          : notifications
                        )
                          .slice(0, 15)
                          .map((n) => {
                            const IconComp =
                              n.type === 'profile_view'
                                ? Eye
                                : n.type === 'message'
                                ? MessageCircle
                                : n.type === 'like'
                                ? Heart
                                : n.type === 'match'
                                ? Sparkles
                                : n.type === 'mural'
                                ? Compass
                                : ShieldAlert;
                            const iconTone =
                              n.type === 'profile_view'
                                ? 'bg-indigo-500/15 text-indigo-600'
                                : n.type === 'message'
                                ? 'bg-sky-500/15 text-sky-600'
                                : n.type === 'like'
                                ? 'bg-rose-500/15 text-rose-600'
                                : n.type === 'match'
                                ? 'bg-amber-500/15 text-amber-600'
                                : n.type === 'mural'
                                ? 'bg-emerald-500/15 text-emerald-600'
                                : 'bg-muted text-foreground';
                            return (
                              <Link
                                key={n.id}
                                to={n.link || '/descobrir'}
                                onClick={() => {
                                  if (!n.read) void markNotificationRead(n.id);
                                  setNotifOpen(false);
                                }}
                                className={`w-full text-left p-2.5 hover:bg-muted/70 transition rounded-xl flex items-start gap-2.5 ${
                                  n.read ? 'opacity-70' : 'bg-primary/5'
                                }`}
                              >
                                <span
                                  className={`grid size-8 shrink-0 place-items-center rounded-xl ${iconTone}`}
                                >
                                  <IconComp className="size-4" />
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-foreground line-clamp-1">
                                      {n.title}
                                    </span>
                                    {!n.read && (
                                      <span className="size-2 shrink-0 rounded-full bg-coral" />
                                    )}
                                  </div>
                                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                                    {n.body}
                                  </p>
                                  <span className="text-[10px] text-muted-foreground/80 mt-1 block">
                                    {n.createdAt}
                                  </span>
                                </div>
                              </Link>
                            );
                          })
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-3 p-1">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <div className="flex items-center gap-1.5">
                        <BellRing className="size-4 text-primary" />
                        <span className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                          Alertas em Tempo Real
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotifOpen(false)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                        aria-label="Fechar"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Entre na sua conta para acompanhar tudo no sino e receber notificações no Google Chrome / celular:
                    </p>
                    <ul className="space-y-1.5 text-[11px] font-medium text-foreground">
                      <li className="flex items-center gap-2">
                        <Eye className="size-3.5 text-indigo-600 shrink-0" /> Quem visualizou seu perfil
                      </li>
                      <li className="flex items-center gap-2">
                        <MessageCircle className="size-3.5 text-sky-600 shrink-0" /> Novas mensagens no chat
                      </li>
                      <li className="flex items-center gap-2">
                        <Heart className="size-3.5 text-rose-600 shrink-0" /> Curtidas, Super Likes e Matches
                      </li>
                      <li className="flex items-center gap-2">
                        <Compass className="size-3.5 text-emerald-600 shrink-0" /> Comentários e curtidas no Mural
                      </li>
                    </ul>
                    <Link
                      to="/entrar"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setNotifOpen(false);
                      }}
                      className="flex w-full min-h-[42px] items-center justify-center rounded-full bg-brand px-4 py-2 text-xs font-bold text-primary-foreground shadow-soft"
                    >
                      Entrar ou Criar Conta para Ativar
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

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
          <Link
            to="/planos"
            onClick={() => {
              setMobileMenuOpen(false);
              setNotifOpen(false);
            }}
            className="hidden lg:flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 shadow-soft transition-all hover:bg-emerald-500/25"
          >
            <Sparkles className="size-3 text-emerald-700" />
            100% Free
          </Link>

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
                <Link
                  to="/perfil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-left font-semibold text-foreground hover:bg-muted"
                >
                  <User className="size-5 text-primary" /> {t.nav.profile}
                </Link>
                <Link
                  to="/guias"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-left font-semibold text-foreground hover:bg-muted"
                >
                  <Compass className="size-5 text-primary" /> {t.nav.guides}
                </Link>
                <Link
                  to="/seguranca"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-left font-semibold text-foreground hover:bg-muted"
                >
                  <ShieldAlert className="size-5 text-emerald-600" /> Segurança & Privacidade
                </Link>
                {isOwnerAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-left font-bold text-rose-700 bg-rose-500/10 border border-rose-500/20"
                  >
                    <ShieldAlert className="size-5 text-rose-600" /> Painel ADM
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/descobrir"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center min-h-[44px] rounded-xl px-3 py-2 text-left font-semibold text-foreground hover:bg-muted"
                >
                  {t.nav.discover}
                </Link>
                <Link
                  to="/mapa"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center min-h-[44px] rounded-xl px-3 py-2 text-left font-semibold text-foreground hover:bg-muted"
                >
                  {t.nav.map}
                </Link>
                <Link
                  to="/guias"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center min-h-[44px] rounded-xl px-3 py-2 text-left font-semibold text-foreground hover:bg-muted"
                >
                  {t.nav.guides}
                </Link>
                <Link
                  to="/entrar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center min-h-[44px] rounded-xl px-3 py-2 text-left font-semibold text-foreground hover:bg-muted"
                >
                  {t.nav.login}
                </Link>
                <Link
                  to="/entrar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-1 flex items-center justify-center min-h-[44px] rounded-xl bg-brand px-3 py-2.5 text-center font-semibold text-primary-foreground"
                >
                  {t.nav.register}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
