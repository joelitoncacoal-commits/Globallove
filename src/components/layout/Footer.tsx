import React from 'react';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between">
        {/* Brand Column */}
        <div className="max-w-sm">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 text-left transition-transform active:scale-95"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-brand text-primary-foreground shadow-soft">
              <Heart className="size-4 fill-current" />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-foreground flex items-baseline">
              <span>Global</span>
              <span className="text-coral">Love</span>
              <span className="text-xs font-semibold text-muted-foreground ml-0.5">.com</span>
            </span>
          </button>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Namoro, amizade e novas conexões em 92 países. Plataforma 100% gratuita para toda a comunidade.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <ShieldCheck className="size-4 text-primary" />
            <span>Respeito, privacidade e conexões por interesse mútuo.</span>
          </div>
        </div>

        {/* Links Navigation */}
        <nav aria-label="Rodapé" className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
          <button
            onClick={() => navigate('/guias')}
            className="text-left text-muted-foreground hover:text-foreground transition-colors"
          >
            Guias
          </button>
          <button
            onClick={() => navigate('/sobre')}
            className="text-left text-muted-foreground hover:text-foreground transition-colors"
          >
            Sobre o GlobalLove.com
          </button>
          <button
            onClick={() => navigate('/seguranca')}
            className="text-left text-muted-foreground hover:text-foreground transition-colors"
          >
            Segurança
          </button>
          <button
            onClick={() => navigate('/privacidade')}
            className="text-left text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacidade
          </button>
          <button
            onClick={() => navigate('/termos')}
            className="text-left text-muted-foreground hover:text-foreground transition-colors"
          >
            Termos de uso
          </button>
          <button
            onClick={() => navigate('/contato')}
            className="text-left text-muted-foreground hover:text-foreground transition-colors"
          >
            Contato
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="text-left font-bold text-rose-600 hover:text-rose-700 transition-colors"
          >
            Área ADM
          </button>
          <button
            onClick={() => navigate('/mural')}
            className="text-left text-muted-foreground hover:text-foreground transition-colors"
          >
            Mural
          </button>
          <button
            onClick={() => navigate('/planos')}
            className="text-left text-muted-foreground hover:text-foreground transition-colors"
          >
            Planos Premium
          </button>
          <button
            onClick={() => navigate('/pais/brasil')}
            className="text-left text-muted-foreground hover:text-foreground transition-colors"
          >
            Namoro no Brasil
          </button>
          <button
            onClick={() => navigate('/pais/portugal')}
            className="text-left text-muted-foreground hover:text-foreground transition-colors"
          >
            Namoro em Portugal
          </button>
          <button
            onClick={() => navigate('/cidade/sao-paulo')}
            className="text-left text-muted-foreground hover:text-foreground transition-colors"
          >
            São Paulo
          </button>
          <button
            onClick={() => navigate('/cidade/rio-de-janeiro')}
            className="text-left text-muted-foreground hover:text-foreground transition-colors"
          >
            Rio de Janeiro
          </button>
        </nav>
      </div>

      <div className="border-t border-border/50 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GlobalLove.com. Todos os direitos reservados. Conectando pessoas no mundo todo.
      </div>
    </footer>
  );
};
