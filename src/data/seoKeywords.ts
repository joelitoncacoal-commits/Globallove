import { COUNTRIES } from './countries';
import { FilterState, Profile, SupportedLang } from '../types';
import { HABIT_MAP } from './lifestyleHabits';

export function normalizeSearchText(input: string): string {
  return String(input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function slugifyCountry(name: string): string {
  return normalizeSearchText(name)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface GlobalSearchIntent {
  id: string;
  label: string;
  langLabels: Record<SupportedLang, string>;
  keywords: string[];
  filterPatch: Partial<FilterState>;
}

export const GLOBAL_SEARCH_INTENTS: GlobalSearchIntent[] = [
  {
    id: 'free_global',
    label: '100% Grátis Global',
    langLabels: {
      pt: 'Namoro Grátis',
      en: 'Free Global Dating',
      es: 'Citas Gratis',
      fr: 'Rencontre Gratuite',
      de: 'Kostenloses Dating',
      it: 'Incontri Gratuiti',
      ja: '無料国際恋愛',
      zh: '免费全球交友',
    },
    keywords: [
      'gratis', 'free', 'gratuit', 'kostenlos', 'gratuiti', '無料', '免费',
      'namoro', 'dating', 'citas', 'rencontre', 'incontri', '出会い', '约会',
      'relacionamento', 'singles', 'solteros', 'celibataires', 'global', 'internacional', 'international',
    ],
    filterPatch: {},
  },
  {
    id: 'verified_safe',
    label: 'Perfis Verificados',
    langLabels: {
      pt: 'Contas Verificadas',
      en: 'Verified Profiles',
      es: 'Perfiles Verificados',
      fr: 'Profils Vérifiés',
      de: 'Verifizierte Profile',
      it: 'Profili Verificati',
      ja: '認証済みプロフィール',
      zh: '实名邮箱认证',
    },
    keywords: [
      'verificado', 'verificados', 'verified', 'safe', 'seguro', 'seguridad',
      'verifie', 'verifiziert', 'verificati', '認証', '认证', 'real', 'reais',
    ],
    filterPatch: { apenasVerificados: true },
  },
  {
    id: 'online_video',
    label: 'Online & Vídeo Chat',
    langLabels: {
      pt: 'Online & Chamada de Vídeo',
      en: 'Online Video Dating',
      es: 'En Línea y Videollamada',
      fr: 'En Ligne & Appel Vidéo',
      de: 'Online & Videochat',
      it: 'Online e Videochiamata',
      ja: 'オンライン・ビデオ通話',
      zh: '在线视频聊天',
    },
    keywords: [
      'online', 'agora', 'now', 'video', 'chamada', 'call', 'cam', 'chat',
      'videollamada', 'appel', 'videochat', 'videochiamata', 'ビデオ', '视频',
    ],
    filterPatch: { apenasOnline: true },
  },
  {
    id: 'serious_love',
    label: 'Relacionamento Sério',
    langLabels: {
      pt: 'Relacionamento Sério',
      en: 'Serious Relationship',
      es: 'Relación Seria',
      fr: 'Relation Sérieuse',
      de: 'Feste Beziehung',
      it: 'Relazione Seria',
      ja: '真剣な交際',
      zh: '认真恋爱结婚',
    },
    keywords: [
      'serio', 'seria', 'serious', 'marriage', 'casamento', 'love', 'amor',
      'relacion', 'mariage', 'beziehung', 'amore', '結婚', '真剣', '恋爱',
    ],
    filterPatch: { habitos: ['family', 'romantic'] },
  },
  {
    id: 'friendship_culture',
    label: 'Amizade & Idiomas',
    langLabels: {
      pt: 'Amizade & Idiomas',
      en: 'Friends & Language Exchange',
      es: 'Amistad e Idiomas',
      fr: 'Amitié & Langues',
      de: 'Freundschaft & Sprachen',
      it: 'Amicizia e Lingue',
      ja: '友達作り・語学交換',
      zh: '交朋友与语言交换',
    },
    keywords: [
      'amizade', 'amigo', 'amigos', 'friend', 'friends', 'friendship', 'language',
      'idiomas', 'amigos', 'amis', 'freunde', 'amici', '友達', '朋友', 'cultura', 'travel', 'viagem',
    ],
    filterPatch: { habitos: ['travel', 'foodie'] },
  },
  {
    id: 'fitness_active',
    label: 'Fitness & Natureza',
    langLabels: {
      pt: 'Fitness & Ar Livre',
      en: 'Fitness & Outdoors',
      es: 'Fitness y Aire Libre',
      fr: 'Sport & Nature',
      de: 'Fitness & Natur',
      it: 'Fitness e Natura',
      ja: 'スポーツ・アウトドア',
      zh: '运动健身与户外',
    },
    keywords: [
      'fitness', 'gym', 'academia', 'sport', 'esporte', 'natureza', 'outdoors',
      'deporte', 'corrida', 'running', 'yoga', '健康', '運動', '运动',
    ],
    filterPatch: { habitos: ['gym', 'outdoors'] },
  },
  {
    id: 'arts_music',
    label: 'Música, Cinema & Café',
    langLabels: {
      pt: 'Música, Arte & Café',
      en: 'Music, Arts & Coffee',
      es: 'Música, Cine y Café',
      fr: 'Musique, Cinéma & Café',
      de: 'Musik, Kultur & Kaffee',
      it: 'Musica, Cinema e Caffè',
      ja: '音楽・映画・カフェ',
      zh: '音乐电影与咖啡',
    },
    keywords: [
      'musica', 'music', 'arte', 'art', 'cinema', 'movie', 'cafe', 'coffee',
      'leitura', 'books', 'anime', 'geek', 'musica', 'コーヒー', '音楽', '音乐',
    ],
    filterPatch: { habitos: ['coffee', 'music', 'books'] },
  },
];

// High-volume multilingual country synonyms so searches in any language map straight to countries in COUNTRIES
export const COUNTRY_MULTILINGUAL_ALIASES: Record<string, string[]> = {
  Brasil: ['brazil', 'bresil', 'brasilien', 'brasile', 'ブラジル', '巴西', 'br', 'sao paulo', 'rio'],
  Portugal: ['portugal', 'lisboa', 'lisbon', 'porto', 'ポルトガル', '葡萄牙', 'pt'],
  'Estados Unidos': ['usa', 'us', 'united states', 'america', 'eeuu', 'etats unis', 'amerika', 'stati uniti', 'アメリカ', '美国', 'new york', 'miami', 'los angeles'],
  Espanha: ['spain', 'espana', 'espagne', 'spanien', 'spagna', 'スペイン', '西班牙', 'madrid', 'barcelona'],
  França: ['france', 'franca', 'frankreich', 'francia', 'フランス', '法国', 'paris', 'lyon'],
  Alemanha: ['germany', 'alemanha', 'alemania', 'allemagne', 'deutschland', 'germania', 'ドイツ', '德国', 'berlin', 'munich'],
  Itália: ['italy', 'italia', 'italie', 'italien', 'イタリア', '意大利', 'rome', 'roma', 'milan', 'milano'],
  Japão: ['japan', 'japao', 'japon', 'giappone', '日本', 'jp', 'tokyo', 'osaka', 'kyoto'],
  'Reino Unido': ['uk', 'united kingdom', 'england', 'inglaterra', 'britain', 'londres', 'london', 'イギリス', '英国'],
  Canadá: ['canada', 'toronto', 'vancouver', 'montreal', 'カナダ', '加拿大'],
  México: ['mexico', 'mejico', 'mexique', 'messico', 'メキシコ', '墨西哥', 'cdmx', 'cancun'],
  Argentina: ['argentina', 'buenos aires', 'アルゼンチン', '阿根廷'],
  Colômbia: ['colombia', 'bogota', 'medellin', 'cartagena', 'コロンビア', '哥伦比亚'],
  'Coreia do Sul': ['south korea', 'korea', 'coreia', 'coree', 'südkorea', '韓国', '韩国', 'seoul'],
  China: ['china', 'chine', 'cina', '中国', 'shanghai', 'beijing'],
  Austrália: ['australia', 'australie', 'australien', 'sydney', 'melbourne', 'オーストラリア', '澳大利亚'],
  'Países Baixos': ['netherlands', 'holland', 'holanda', 'amsterdam', 'オランダ', '荷兰'],
  Suíça: ['switzerland', 'suica', 'suiza', 'suisse', 'schweiz', 'zurich', 'スイス', '瑞士'],
  Irlanda: ['ireland', 'irlanda', 'irlande', 'dublin', 'アイルランド', '爱尔兰'],
  Tailândia: ['thailand', 'tailandia', 'thailande', 'bangkok', 'タイ', '泰国'],
  Filipinas: ['philippines', 'filipinas', 'manila', 'フィリピン', '菲律宾'],
  Turquia: ['turkey', 'turquia', 'turkiye', 'istanbul', 'トルコ', '土耳其'],
};

export function findCountryByMultilingualQuery(queryText: string): string | null {
  const norm = normalizeSearchText(queryText);
  if (!norm) return null;

  for (const c of COUNTRIES) {
    if (normalizeSearchText(c.name) === norm || c.code.toLowerCase() === norm) {
      return c.name;
    }
  }

  for (const [ptName, aliases] of Object.entries(COUNTRY_MULTILINGUAL_ALIASES)) {
    if (aliases.some((alias) => norm.includes(normalizeSearchText(alias)))) {
      return ptName;
    }
  }

  for (const c of COUNTRIES) {
    const cNorm = normalizeSearchText(c.name);
    if (cNorm.length >= 4 && norm.includes(cNorm)) {
      return c.name;
    }
  }
  return null;
}

export function computeGlobalKeywordCombinationsCount(): number {
  const languages = 8;
  const intentsCount = GLOBAL_SEARCH_INTENTS.reduce((acc, item) => acc + item.keywords.length, 0);
  // 249 countries * 8 languages * rich keyword & filter intents matrix
  return COUNTRIES.length * languages * intentsCount;
}

export function getMultilingualCountryKeywords(countryName: string): string[] {
  const aliases = COUNTRY_MULTILINGUAL_ALIASES[countryName] || [];
  const normName = normalizeSearchText(countryName);
  return Array.from(
    new Set([
      countryName,
      normName,
      ...aliases,
      `namoro ${countryName}`,
      `dating ${countryName}`,
      `citas ${countryName}`,
      `rencontre ${countryName}`,
      `free dating ${normName}`,
      `encontros ${countryName}`,
      `amizade ${countryName}`,
    ])
  );
}

export function parseQueryToFilters(queryText: string): Partial<FilterState> {
  const norm = normalizeSearchText(queryText);
  if (!norm) return {};

  const patch: Partial<FilterState> = { busca: queryText.trim() };
  const detectedCountry = findCountryByMultilingualQuery(norm);
  if (detectedCountry) {
    patch.pais = detectedCountry;
  }

  for (const intent of GLOBAL_SEARCH_INTENTS) {
    if (intent.keywords.some((kw) => norm.includes(normalizeSearchText(kw)))) {
      Object.assign(patch, intent.filterPatch);
    }
  }

  return patch;
}

export function matchesMultilingualQuery(profile: Profile, queryText?: string): boolean {
  const normQuery = normalizeSearchText(queryText || '');
  if (!normQuery) return true;

  const tokens = normQuery.split(/\s+/).filter((t) => t.length >= 2);
  if (tokens.length === 0) return true;

  const countryAliases = COUNTRY_MULTILINGUAL_ALIASES[profile.pais] || [];
  const habitText = (profile.habitos || [])
    .map((hid) => HABIT_MAP.get(hid)?.label || hid)
    .join(' ');

  const searchable = normalizeSearchText(
    [
      profile.nome,
      profile.cidade,
      profile.pais,
      ...countryAliases,
      profile.profissao,
      profile.bio,
      profile.buscando,
      profile.generoRotulo || '',
      ...(profile.interesses || []),
      habitText,
      ...(profile.idiomas || []),
    ].join(' ')
  );

  return tokens.every((token) => {
    if (searchable.includes(token)) return true;
    // Allow intent synonyms such as "free", "verified", "dating", "citas" across profiles
    return GLOBAL_SEARCH_INTENTS.some((intent) =>
      intent.keywords.some((kw) => normalizeSearchText(kw) === token)
    );
  });
}

export function getGlobalSEOKeywordsString(lang: SupportedLang): string {
  const intentTerms = GLOBAL_SEARCH_INTENTS.flatMap((i) => [
    i.langLabels[lang],
    ...i.keywords.slice(0, 6),
  ]);
  const topCountries = COUNTRIES.slice(0, 20).map((c) => c.name);
  return Array.from(new Set(['GlobalLove', 'GlobalLove.com', ...intentTerms, ...topCountries])).join(', ');
}
