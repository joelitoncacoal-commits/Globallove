import React from 'react';
import { Loader2 } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { ToastViewport } from './components/layout/ToastViewport';
import { MatchModal } from './components/modals/MatchModal';

// Pages
import { Home } from './pages/Home';
import { Descobrir } from './pages/Descobrir';
import { Mapa } from './pages/Mapa';
import { Mural } from './pages/Mural';
import { Matches } from './pages/Matches';
import { Conversas } from './pages/Conversas';
import { Perfil } from './pages/Perfil';
import { Planos } from './pages/Planos';
import { Entrar } from './pages/Entrar';
import { Guias } from './pages/Guias';
import { GuiaDetalhe } from './pages/GuiaDetalhe';
import { PaisDetalhe } from './pages/PaisDetalhe';
import { CidadeDetalhe } from './pages/CidadeDetalhe';
import { Sobre } from './pages/Sobre';
import { Seguranca } from './pages/Seguranca';
import { Privacidade } from './pages/Privacidade';
import { Termos } from './pages/Termos';
import { Contato } from './pages/Contato';
import { Admin } from './pages/Admin';

const RouterView: React.FC = () => {
  const { currentRoute, isLoggedIn, authReady, needsVerification, needsOnboarding } = useApp();

  // Normalize path
  const path = currentRoute.split('?')[0].replace(/\/+$/, '') || '/';

  // Wait for Firebase Auth bootstrap before rendering protected screens
  const protectedRoutes = ['/descobrir', '/matches', '/perfil'];
  const isProtected = protectedRoutes.includes(path) || path.startsWith('/conversas');

  if (!authReady && (isProtected || path === '/admin' || path === '/entrar')) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Carregando sua sessão segura...</p>
      </div>
    );
  }

  if (isProtected && !isLoggedIn) {
    let notice =
      'Para ver perfis reais, dar likes, conversar no chat e fazer chamadas no GlobalLove.com, entre com sua conta verificada (18+).';
    if (needsVerification) {
      notice = 'Confirme seu endereço de e-mail para liberar seu acesso completo na plataforma.';
    } else if (needsOnboarding) {
      notice = 'Complete seu perfil com foto e localização aproximada para começar a descobrir pessoas.';
    }
    return <Entrar redirectNotice={notice} />;
  }

  // 1. Static and App Routes
  if (path === '/') return <Home />;
  if (path === '/admin') return <Admin />;
  if (path === '/descobrir') return <Descobrir />;
  if (path === '/mapa') return <Mapa />;
  if (path === '/mural') return <Mural />;
  if (path === '/matches') return <Matches />;
  if (path.startsWith('/conversas')) return <Conversas />;
  if (path === '/perfil') return <Perfil />;
  if (path === '/planos' || path === '/planos-retorno') return <Planos />;
  if (path === '/entrar') return <Entrar />;
  if (path === '/guias') return <Guias />;
  if (path === '/sobre') return <Sobre />;
  if (path === '/seguranca') return <Seguranca />;
  if (path === '/privacidade') return <Privacidade />;
  if (path === '/termos') return <Termos />;
  if (path === '/contato') return <Contato />;

  // 2. Dynamic Guide Slug: /guias/:slug
  if (path.startsWith('/guias/')) {
    const slug = path.replace('/guias/', '');
    return <GuiaDetalhe slug={slug} />;
  }

  // 3. Dynamic Country Slug: /pais/:slug or /encontros/:slug
  if (path.startsWith('/pais/') || path.startsWith('/encontros/')) {
    const slug = path.replace(/^\/(pais|encontros)\//, '');
    return <PaisDetalhe slug={slug} />;
  }

  // 4. Dynamic City Slug: /cidade/:slug or /namoro/:slug
  if (path.startsWith('/cidade/') || path.startsWith('/namoro/')) {
    const slug = path.replace(/^\/(cidade|namoro)\//, '');
    return <CidadeDetalhe slug={slug} />;
  }

  // 5. Multi-language international landing routes
  if (['/en/dating', '/es/citas', '/fr/rencontre', '/de/dating', '/it/incontri', '/ja/deai'].includes(path)) {
    return <Home />;
  }

  // Default fallback
  return <Home />;
};

export default function App() {
  return (
    <AppProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-coral/30 selection:text-foreground">
        <Header />
        <main className="flex-1">
          <RouterView />
        </main>
        <Footer />
        <MobileTabBar />
        <ToastViewport />
        <MatchModal />
      </div>
    </AppProvider>
  );
}
