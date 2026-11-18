import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, MapPin, Compass, Heart, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileTabBar: React.FC = () => {
  const { isLoggedIn, currentRoute, matches, incomingLikes, t } = useApp();

  if (!isLoggedIn) return null;

  const totalUnread = matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0);
  const path = currentRoute.split('?')[0];

  const items = [
    { path: '/descobrir', label: t.nav.discover, icon: Flame, badge: 0 },
    { path: '/mapa', label: t.nav.map, icon: MapPin, badge: 0 },
    { path: '/mural', label: t.nav.mural, icon: Compass, badge: 0 },
    { path: '/matches', label: t.nav.matches, icon: Heart, badge: incomingLikes.length },
    { path: '/conversas', label: t.nav.chats, icon: MessageCircle, badge: totalUnread },
  ];

  return (
    <nav
      aria-label="Navegação rápida mobile"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-border/80 bg-card/95 backdrop-blur-md md:hidden pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            path === item.path || (item.path === '/conversas' && path.startsWith('/conversas'));
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-label={item.label}
              className={`relative flex min-h-[52px] flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[10px] font-semibold transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="relative">
                <Icon className={`size-5 ${active ? 'fill-primary/15' : ''}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex min-w-[16px] h-4 items-center justify-center rounded-full bg-coral px-1 text-[9px] font-bold text-white">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="truncate max-w-[64px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
