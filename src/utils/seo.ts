import { SupportedLang } from '../types';
import { PAISES_DETALHES, CIDADES } from '../data/paises';
import { GUIAS } from '../data/guias';

export interface RouteSEOPayload {
  title: string;
  description: string;
  path: string;
  canonicalUrl: string;
  lang: SupportedLang;
  jsonLd?: Record<string, unknown>;
}

const ORIGIN_FALLBACK = 'https://globallove.vercel.app';

export function resolveRouteSEO(path: string, lang: SupportedLang): RouteSEOPayload {
  const cleanPath = path.split('?')[0].replace(/\/+$/, '') || '/';

  if (cleanPath.startsWith('/pais/') || cleanPath.startsWith('/encontros/')) {
    const slug = cleanPath.replace(/^\/(pais|encontros)\//, '');
    const pais = PAISES_DETALHES.find((p) => p.slug === slug);
    if (pais) {
      return {
        title: `${pais.titulo} | GlobalLove.com`,
        description: pais.descricao,
        path: cleanPath,
        canonicalUrl: `${ORIGIN_FALLBACK}${cleanPath}`,
        lang,
        jsonLd: pais.faq?.length
          ? {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: pais.faq.map((f) => ({
                '@type': 'Question',
                name: f.pergunta,
                acceptedAnswer: { '@type': 'Answer', text: f.resposta },
              })),
            }
          : undefined,
      };
    }
  }

  if (cleanPath.startsWith('/cidade/') || cleanPath.startsWith('/namoro/')) {
    const slug = cleanPath.replace(/^\/(cidade|namoro)\//, '');
    const cidade = CIDADES.find((c) => c.slug === slug);
    if (cidade) {
      return {
        title: `${cidade.titulo} | GlobalLove.com`,
        description: cidade.descricao,
        path: cleanPath,
        canonicalUrl: `${ORIGIN_FALLBACK}${cleanPath}`,
        lang,
      };
    }
  }

  if (cleanPath.startsWith('/guias/')) {
    const slug = cleanPath.replace('/guias/', '');
    const guia = GUIAS.find((g) => g.slug === slug);
    if (guia) {
      return {
        title: `${guia.titulo} — GlobalLove.com`,
        description: guia.descricao,
        path: cleanPath,
        canonicalUrl: `${ORIGIN_FALLBACK}${cleanPath}`,
        lang,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: guia.titulo,
          description: guia.descricao,
          publisher: { '@type': 'Organization', name: 'GlobalLove.com' },
        },
      };
    }
  }

  const staticMeta: Record<string, { title: string; description: string }> = {
    '/': {
      title: 'GlobalLove.com — Namoro e Encontros Grátis Global | 92+ Países',
      description:
        'Plataforma internacional de namoro e amizades 100% gratuita. Conexões verificadas em 92 países com chat privado, vídeo chamadas e afinidades diárias.',
    },
    '/descobrir': {
      title: 'Descobrir Pessoas — GlobalLove.com',
      description: 'Descubra membros reais no Brasil e em mais 91 países com filtros avançados e afinidades em comum.',
    },
    '/mapa': {
      title: 'Mapa Global de Países e Cidades — GlobalLove.com',
      description: 'Explore 92+ países e cidades conectadas na comunidade GlobalLove.com com privacidade geográfica.',
    },
    '/mural': {
      title: 'Mural Global da Comunidade — GlobalLove.com',
      description: 'Publicações, experiências e conexões interculturais de membros do GlobalLove.com.',
    },
    '/matches': {
      title: 'Meus Matches e Curtidas — GlobalLove.com',
      description: 'Veja quem demonstrou interesse mútuo e acompanhe seus matches confirmados.',
    },
    '/conversas': {
      title: 'Conversas Privadas — GlobalLove.com',
      description: 'Troque mensagens seguras, fotos, notas de voz e realize vídeo chamadas com seus matches.',
    },
    '/guias': {
      title: 'Guias de Relacionamento, Segurança e Cultura — GlobalLove.com',
      description: 'Artigos práticos sobre namoro internacional, etiqueta cultural e encontros presenciais seguros.',
    },
    '/sobre': {
      title: 'Sobre o GlobalLove.com — Nossa Missão Global',
      description: 'Conheça os valores, propósito gratuito e compromisso de privacidade do GlobalLove.com.',
    },
    '/seguranca': {
      title: 'Central de Segurança e Prevenção — GlobalLove.com',
      description: 'Recomendações essenciais de segurança online, prevenção a golpes e moderação ativa.',
    },
    '/privacidade': {
      title: 'Política de Privacidade (LGPD & GDPR) — GlobalLove.com',
      description: 'Entenda como protegemos seus dados pessoais, localização aproximada e direito à exclusão de conta.',
    },
    '/termos': {
      title: 'Termos de Uso (18+) — GlobalLove.com',
      description: 'Regras da comunidade 18+, diretrizes de conduta e funcionamento 100% gratuito.',
    },
    '/contato': {
      title: 'Contato, Suporte e Denúncias — GlobalLove.com',
      description: 'Envie dúvidas, solicitações LGPD ou denúncias diretamente para nossa equipe de moderação.',
    },
    '/entrar': {
      title: 'Entrar ou Criar Conta Grátis — GlobalLove.com',
      description: 'Acesse sua conta ou crie seu perfil verificado gratuitamente em menos de dois minutos.',
    },
    '/perfil': {
      title: 'Meu Perfil e Configurações de Privacidade — GlobalLove.com',
      description: 'Edite suas fotos, hábitos, preferências de privacidade e gerencie usuários bloqueados.',
    },
    '/admin': {
      title: 'Administração & Moderação — GlobalLove.com',
      description: 'Painel restrito de moderação, suporte, auditoria e governança da comunidade.',
    },
    '/en/dating': {
      title: 'GlobalLove.com — Free International Dating Across 92+ Countries',
      description: 'Meet verified people worldwide for friendships, cultural exchange, and meaningful relationships — 100% free.',
    },
    '/es/citas': {
      title: 'GlobalLove.com — Citas Internacionales Gratis en Más de 92 Países',
      description: 'Conoce personas verificadas de todo el mundo con chat seguro, afinidades reales y privacidad protegida.',
    },
    '/fr/rencontre': {
      title: 'GlobalLove.com — Rencontres Internationales Gratuites (92+ Pays)',
      description: 'Découvrez des membres vérifiés à travers le monde pour des échanges culturels et des rencontres sincères.',
    },
    '/de/dating': {
      title: 'GlobalLove.com — Kostenloses Internationales Dating in 92+ Ländern',
      description: 'Lernen Sie verifizierte Menschen weltweit kennen — sicher, kostenlos und datenschutzfreundlich.',
    },
    '/it/incontri': {
      title: 'GlobalLove.com — Incontri Internazionali Gratuiti in 92+ Paesi',
      description: 'Conosci persone verificate nel mondo con chat sicura e controllo completo della privacy.',
    },
    '/ja/deai': {
      title: 'GlobalLove.com — 世界92カ国以上の無料国際マッチングプラットフォーム',
      description: '世界中の認証済みメンバーと安全に出会い、チャットや文化交流を楽しめる完全無料プラットフォーム。',
    },
  };

  const entry = staticMeta[cleanPath] || staticMeta['/'];
  return {
    title: entry.title,
    description: entry.description,
    path: cleanPath,
    canonicalUrl: `${ORIGIN_FALLBACK}${cleanPath}`,
    lang,
  };
}

export function applyDocumentSEO(payload: RouteSEOPayload): void {
  if (typeof document === 'undefined') return;
  document.title = payload.title;
  document.documentElement.lang = payload.lang;

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : ORIGIN_FALLBACK;
  const fullUrl = `${origin}${payload.path}`;

  const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
    let el = document.querySelector<HTMLMetaElement>(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('meta[name="description"]', 'name', 'description', payload.description);
  setMeta('meta[property="og:title"]', 'property', 'og:title', payload.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', payload.description);
  setMeta('meta[property="og:url"]', 'property', 'og:url', fullUrl);
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', payload.title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', payload.description);

  const canonical = document.getElementById('dynamic-canonical');
  if (canonical) {
    canonical.setAttribute('href', fullUrl);
  }

  let jsonLdScript = document.getElementById('dynamic-route-jsonld') as HTMLScriptElement | null;
  if (payload.jsonLd) {
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'dynamic-route-jsonld';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(payload.jsonLd);
  } else if (jsonLdScript) {
    jsonLdScript.remove();
  }
}
