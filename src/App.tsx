import React from 'react';
import { Routes, Route, useLocation, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { ToastViewport } from './components/layout/ToastViewport';
import { MatchModal } from './components/modals/MatchModal';
import { Seo } from './components/Seo';

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

const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({
  children,
  requireAdmin = false,
}) => {
  const { isLoggedIn, authReady, needsVerification, needsOnboarding } = useApp();

  if (!authReady) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Carregando sua sessão segura...</p>
      </div>
    );
  }

  if (requireAdmin) {
    return <>{children}</>;
  }

  if (!isLoggedIn) {
    let notice =
      'Para ver perfis reais, dar likes, conversar no chat e fazer chamadas no GlobalLove.com, entre com sua conta verificada (18+).';
    if (needsVerification) {
      notice = 'Confirme seu endereço de e-mail para liberar seu acesso completo na plataforma.';
    } else if (needsOnboarding) {
      notice = 'Complete seu perfil com foto e localização aproximada para começar a descobrir pessoas.';
    }
    return <Entrar redirectNotice={notice} />;
  }

  return <>{children}</>;
};

const GuiaRoute: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  return <GuiaDetalhe slug={slug || ''} />;
};

const PaisRoute: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  return <PaisDetalhe slug={slug || ''} />;
};

const CidadeRoute: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  return <CidadeDetalhe slug={slug || ''} />;
};

const EntrarRoute: React.FC = () => {
  const { authReady } = useApp();
  if (!authReady) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Carregando sua sessão segura...</p>
      </div>
    );
  }
  return <Entrar />;
};

const RouterView: React.FC = () => {
  const { currentLang } = useApp();
  const location = useLocation();

  return (
    <>
      <Seo path={location.pathname} lang={currentLang} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/mural" element={<Mural />} />
        <Route path="/planos" element={<Planos />} />
        <Route path="/planos-retorno" element={<Planos />} />
        <Route path="/entrar" element={<EntrarRoute />} />
        <Route path="/guias" element={<Guias />} />
        <Route path="/guias/:slug" element={<GuiaRoute />} />
        <Route path="/pais/:slug" element={<PaisRoute />} />
        <Route path="/encontros/:slug" element={<PaisRoute />} />
        <Route path="/cidade/:slug" element={<CidadeRoute />} />
        <Route path="/namoro/:slug" element={<CidadeRoute />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/seguranca" element={<Seguranca />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/contato" element={<Contato />} />

        {/* International Landing Routes */}
        <Route path="/en/dating" element={<Home />} />
        <Route path="/es/citas" element={<Home />} />
        <Route path="/fr/rencontre" element={<Home />} />
        <Route path="/de/dating" element={<Home />} />
        <Route path="/it/incontri" element={<Home />} />
        <Route path="/ja/deai" element={<Home />} />

        {/* Protected Authenticated Routes */}
        <Route
          path="/descobrir"
          element={
            <ProtectedRoute>
              <Descobrir />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />
        <Route
          path="/conversas"
          element={
            <ProtectedRoute>
              <Conversas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/conversas/:matchId"
          element={
            <ProtectedRoute>
              <Conversas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
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
