import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card mt-auto pb-20 md:pb-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between">
        {/* Brand Column */}
        <div className="max-w-sm">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 text-left transition-transform active:scale-95"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-brand text-primary-foreground shadow-soft">
              <Heart className="size-4 fill-current" />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-foreground flex items-baseline">
              <span>Global</span>
              <span className="text-coral">Love</span>
              <span className="text-xs font-semibold text-muted-foreground ml-0.5">.com</span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Namoro, amizade e conexões reais em 92+ países (maiores de 18 anos). Plataforma 100% gratuita para toda a comunidade.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <ShieldCheck className="size-4 text-primary shrink-0" />
            <span>Privacidade, respeito, conformidade LGPD e conexões por interesse mútuo.</span>
          </div>
        </div>

        {/* Rich Semantic <a href> Crawl Grid (24+ links for global crawl hierarchy on every route) */}
        <nav aria-label="Rodapé" className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3 lg:grid-cols-4">
          <Link to="/guias" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Guias
          </Link>
          <Link to="/sobre" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Sobre o GlobalLove.com
          </Link>
          <Link to="/seguranca" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Segurança
          </Link>
          <Link to="/privacidade" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Privacidade (LGPD)
          </Link>
          <Link to="/termos" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Termos de uso (18+)
          </Link>
          <Link to="/contato" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Contato e Suporte
          </Link>
          <Link to="/mural" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Mural Global
          </Link>
          <Link to="/mapa" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Mapa de Países
          </Link>
          <Link to="/planos" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Plataforma 100% Gratuita
          </Link>
          <Link to="/pais/brasil" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Namoro no Brasil
          </Link>
          <Link to="/pais/portugal" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Namoro em Portugal
          </Link>
          <Link to="/pais/espanha" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Namoro na Espanha
          </Link>
          <Link to="/pais/estados-unidos" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Namoro nos EUA
          </Link>
          <Link to="/pais/franca" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Namoro na França
          </Link>
          <Link to="/pais/alemanha" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Namoro na Alemanha
          </Link>
          <Link to="/pais/italia" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Namoro na Itália
          </Link>
          <Link to="/pais/japao" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Namoro no Japão
          </Link>
          <Link to="/pais/canada" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Namoro no Canadá
          </Link>
          <Link to="/pais/reino-unido" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Reino Unido
          </Link>
          <Link to="/cidade/sao-paulo" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            São Paulo
          </Link>
          <Link to="/cidade/rio-de-janeiro" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Rio de Janeiro
          </Link>
          <Link to="/cidade/lisboa" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Lisboa
          </Link>
          <Link to="/en/dating" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Free Dating (EN)
          </Link>
          <Link to="/es/citas" className="text-left text-muted-foreground hover:text-foreground transition-colors">
            Citas Gratis (ES)
          </Link>
        </nav>
      </div>

      <div className="border-t border-border/50 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GlobalLove.com. Todos os direitos reservados. Serviço exclusivo para maiores de 18 anos.
      </div>
    </footer>
  );
};
