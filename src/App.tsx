import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
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
  const { currentRoute, isLoggedIn } = useApp();

  // Normalize path
  const path = currentRoute.split('?')[0].replace(/\/+$/, '') || '/';

  useEffect(() => {
    const canonical = document.getElementById('dynamic-canonical');
    if (canonical) {
      canonical.setAttribute('href', `${window.location.origin}${path}`);
    }
  }, [path]);

  // Rotas restritas que exigem cadastro obrigatório
  const protectedRoutes = ['/descobrir', '/matches', '/perfil'];
  const isProtectedChat = path.startsWith('/conversas');
  if ((protectedRoutes.includes(path) || isProtectedChat) && !isLoggedIn) {
    return (
      <Entrar
        redirectNotice="Cadastro Obrigatório: Para ver perfis reais, dar likes, conversar no chat e fazer chamadas de vídeo no GlobalLove.com, é obrigatório cadastrar seus dados reais."
      />
    );
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
        <MatchModal />
      </div>
    </AppProvider>
  );
}
