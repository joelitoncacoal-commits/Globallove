import { SupportedLang } from '../types';
import { PAISES_DETALHES, CIDADES } from '../data/paises';
import { GUIAS } from '../data/guias';
import { COUNTRIES } from '../data/countries';
import {
  slugifyCountry,
  getMultilingualCountryKeywords,
  getGlobalSEOKeywordsString,
} from '../data/seoKeywords';

export interface RouteSEOPayload {
  title: string;
  description: string;
  keywords?: string;
  path: string;
  canonicalUrl: string;
  lang: SupportedLang;
  noindex?: boolean;
  nofollow?: boolean;
  jsonLd?: Record<string, unknown>;
}

const DEFAULT_SITE_URL = 'https://globallove.vercel.app';

export function getSiteUrl(): string {
  const envUrl =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) ||
    DEFAULT_SITE_URL;
  return String(envUrl).trim().replace(/\/+$/, '') || DEFAULT_SITE_URL;
}

export function normalizeRoutePath(path: string): string {
  const withoutQuery = (path || '/').split('?')[0].split('#')[0];
  const cleaned = withoutQuery.replace(/\/+$/, '') || '/';
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
}

export const STATIC_ROUTE_META: Record<
  string,
  { title: string; description: string; noindex?: boolean; nofollow?: boolean }
> = {
  '/': {
    title: 'GlobalLove.com — Namoro e Encontros Grátis Global | 92+ Países',
    description:
      'Plataforma internacional de namoro e amizades 100% gratuita. Conexões verificadas em 92+ países com chat privado, vídeo chamadas e afinidades diárias.',
  },
  '/descobrir': {
    title: 'Descobrir Pessoas — GlobalLove.com',
    description:
      'Descubra membros reais no Brasil e em mais 91 países com filtros avançados e afinidades em comum.',
    noindex: true,
    nofollow: false,
  },
  '/mapa': {
    title: 'Mapa Global de Países e Cidades — GlobalLove.com',
    description:
      'Explore 92+ países e cidades conectadas na comunidade GlobalLove.com com privacidade geográfica.',
  },
  '/mural': {
    title: 'Mural Global da Comunidade — GlobalLove.com',
    description:
      'Publicações, experiências e conexões interculturais de membros do GlobalLove.com.',
  },
  '/matches': {
    title: 'Meus Matches e Curtidas — GlobalLove.com',
    description:
      'Veja quem demonstrou interesse mútuo e acompanhe seus matches confirmados gratuitamente.',
    noindex: true,
    nofollow: false,
  },
  '/conversas': {
    title: 'Conversas Privadas — GlobalLove.com',
    description:
      'Troque mensagens seguras, fotos, notas de voz e realize vídeo chamadas com seus matches.',
    noindex: true,
    nofollow: false,
  },
  '/planos': {
    title: 'Plataforma 100% Gratuita — Sem Assinaturas | GlobalLove.com',
    description:
      'No GlobalLove.com todos os recursos são gratuitos para sempre: curtidas ilimitadas, ver quem curtiu você e vídeo chamadas sem paywall.',
  },
  '/planos-retorno': {
    title: 'Acesso Total Gratuito Liberado — GlobalLove.com',
    description:
      'Todos os recursos do GlobalLove.com já estão liberados gratuitamente para a sua conta.',
    noindex: true,
    nofollow: false,
  },
  '/guias': {
    title: 'Guias de Relacionamento, Segurança e Cultura — GlobalLove.com',
    description:
      'Artigos práticos sobre namoro internacional, etiqueta cultural e encontros presenciais seguros.',
  },
  '/sobre': {
    title: 'Sobre o GlobalLove.com — Nossa Missão Global',
    description:
      'Conheça os valores, propósito gratuito e compromisso de privacidade do GlobalLove.com.',
  },
  '/seguranca': {
    title: 'Central de Segurança e Prevenção — GlobalLove.com',
    description:
      'Recomendações essenciais de segurança online, prevenção a golpes e moderação ativa.',
  },
  '/privacidade': {
    title: 'Política de Privacidade (LGPD & GDPR) — GlobalLove.com',
    description:
      'Entenda como protegemos seus dados pessoais, localização aproximada e direito à exclusão de conta.',
  },
  '/termos': {
    title: 'Termos de Uso (18+) — GlobalLove.com',
    description:
      'Regras da comunidade 18+, diretrizes de conduta e funcionamento 100% gratuito.',
  },
  '/contato': {
    title: 'Contato, Suporte e Denúncias — GlobalLove.com',
    description:
      'Envie dúvidas, solicitações LGPD ou denúncias diretamente para nossa equipe de moderação.',
  },
  '/entrar': {
    title: 'Entrar ou Criar Conta Grátis — GlobalLove.com',
    description:
      'Acesse sua conta ou crie seu perfil verificado gratuitamente em menos de dois minutos.',
    noindex: true,
    nofollow: false,
  },
  '/perfil': {
    title: 'Meu Perfil e Configurações de Privacidade — GlobalLove.com',
    description:
      'Edite suas fotos, hábitos, preferências de privacidade e gerencie usuários bloqueados.',
    noindex: true,
    nofollow: false,
  },
  '/admin': {
    title: 'Administração & Moderação — GlobalLove.com',
    description:
      'Painel restrito de moderação, suporte, auditoria e governança da comunidade.',
    noindex: true,
    nofollow: true,
  },
  '/en/dating': {
    title: 'GlobalLove.com — Free International Dating Across 92+ Countries',
    description:
      'Meet verified people worldwide for friendships, cultural exchange, and meaningful relationships — 100% free.',
  },
  '/es/citas': {
    title: 'GlobalLove.com — Citas Internacionales Gratis en Más de 92 Países',
    description:
      'Conoce personas verificadas de todo el mundo con chat seguro, afinidades reales y privacidad protegida.',
  },
  '/fr/rencontre': {
    title: 'GlobalLove.com — Rencontres Internationales Gratuites (92+ Pays)',
    description:
      'Découvrez des membres vérifiés à travers le monde pour des échanges culturels et des rencontres sincères.',
  },
  '/de/dating': {
    title: 'GlobalLove.com — Kostenloses Internationales Dating in 92+ Ländern',
    description:
      'Lernen Sie verifizierte Menschen weltweit kennen — sicher, kostenlos und datenschutzfreundlich.',
  },
  '/it/incontri': {
    title: 'GlobalLove.com — Incontri Internazionali Gratuiti in 92+ Paesi',
    description:
      'Conosci persone verificate nel mondo con chat sicura e controllo completo della privacy.',
  },
  '/ja/deai': {
    title: 'GlobalLove.com — 世界92カ国以上の無料国際マッチングプラットフォーム',
    description:
      '世界中の認証済みメンバーと安全に出会い、チャットや文化交流を楽しめる完全無料プラットフォーム。',
  },
};

export function resolveRouteSEO(path: string, lang: SupportedLang): RouteSEOPayload {
  const siteUrl = getSiteUrl();
  const cleanPath = normalizeRoutePath(path);
  const canonicalUrl = cleanPath === '/' ? `${siteUrl}/` : `${siteUrl}${cleanPath}`;

  if (cleanPath.startsWith('/pais/') || cleanPath.startsWith('/encontros/')) {
    const slug = cleanPath.replace(/^\/(pais|encontros)\//, '');
    const pais = PAISES_DETALHES.find((p) => p.slug === slug);
    if (pais) {
      return {
        title: `${pais.titulo} | GlobalLove.com`,
        description: pais.descricao,
        keywords: getMultilingualCountryKeywords(pais.nome).join(', '),
        path: cleanPath,
        canonicalUrl,
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

    const dynamicCountry = COUNTRIES.find(
      (c) => slugifyCountry(c.name) === slug || c.code.toLowerCase() === slug.toLowerCase()
    );
    if (dynamicCountry) {
      return {
        title: `Namoro e Encontros em ${dynamicCountry.name} ${dynamicCountry.flag} | GlobalLove.com`,
        description: `Conheça pessoas verificadas em ${dynamicCountry.name} (${dynamicCountry.code}) gratuitamente. Chat seguro, vídeo chamadas, amizades e relacionamentos globais no GlobalLove.com.`,
        keywords: getMultilingualCountryKeywords(dynamicCountry.name).join(', '),
        path: cleanPath,
        canonicalUrl,
        lang,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: `Namoro e Encontros em ${dynamicCountry.name}`,
          description: `Conexões verificadas e gratuitas em ${dynamicCountry.name} no GlobalLove.com`,
          url: canonicalUrl,
        },
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
        canonicalUrl,
        lang,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: cidade.titulo,
          description: cidade.descricao,
          url: canonicalUrl,
        },
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
        canonicalUrl,
        lang,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: guia.titulo,
          description: guia.descricao,
          datePublished: guia.publicado || '2026-10-13',
          publisher: { '@type': 'Organization', name: 'GlobalLove.com' },
        },
      };
    }
  }

  if (cleanPath.startsWith('/conversas/')) {
    const entry = STATIC_ROUTE_META['/conversas'];
    return {
      title: entry.title,
      description: entry.description,
      path: cleanPath,
      canonicalUrl,
      lang,
      noindex: true,
      nofollow: false,
    };
  }

  const entry = STATIC_ROUTE_META[cleanPath] || STATIC_ROUTE_META['/'];
  return {
    title: entry.title,
    description: entry.description,
    keywords: getGlobalSEOKeywordsString(lang),
    path: cleanPath,
    canonicalUrl,
    lang,
    noindex: entry.noindex,
    nofollow: entry.nofollow,
  };
}

export function applyDocumentSEO(payload: RouteSEOPayload): void {
  if (typeof document === 'undefined') return;
  document.title = payload.title;
  document.documentElement.lang = payload.lang;

  const fullUrl = payload.canonicalUrl;

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
  if (payload.keywords) {
    setMeta('meta[name="keywords"]', 'name', 'keywords', payload.keywords);
  }

  const robotsContent = payload.noindex
    ? payload.nofollow
      ? 'noindex, nofollow'
      : 'noindex, follow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  setMeta('meta[name="robots"]', 'name', 'robots', robotsContent);
  setMeta('meta[property="og:title"]', 'property', 'og:title', payload.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', payload.description);
  setMeta('meta[property="og:url"]', 'property', 'og:url', fullUrl);
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', payload.title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', payload.description);

  const bingCode =
    typeof import.meta !== 'undefined' ? import.meta.env?.VITE_BING_VERIFICATION : '';
  if (bingCode && String(bingCode).trim()) {
    setMeta('meta[name="msvalidate.01"]', 'name', 'msvalidate.01', String(bingCode).trim());
  }

  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', fullUrl);

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
