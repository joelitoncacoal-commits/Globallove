import { Genero, InteresseEm, SupportedLang } from '../types';
import { COUNTRIES } from '../data/countries';

export const LOCALE_MAP: Record<SupportedLang, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  ja: 'ja-JP',
  zh: 'zh-CN',
};

export function formatLocalizedTime(input: string | Date, lang: SupportedLang): string {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return typeof input === 'string' ? input : '';
  return new Intl.DateTimeFormat(LOCALE_MAP[lang] || 'pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatLocalizedDateTime(input: string | Date, lang: SupportedLang): string {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return typeof input === 'string' ? input : '';
  return new Intl.DateTimeFormat(LOCALE_MAP[lang] || 'pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatLocalizedRelativeTime(input: string | Date, lang: SupportedLang): string {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return typeof input === 'string' ? input : '';
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
  const absSec = Math.abs(diffSec);
  const rtf = new Intl.RelativeTimeFormat(LOCALE_MAP[lang] || 'pt-BR', { numeric: 'auto' });

  if (absSec < 60) return rtf.format(diffSec, 'second');
  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
  const diffHour = Math.round(diffMin / 60);
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour');
  const diffDay = Math.round(diffHour / 24);
  if (Math.abs(diffDay) < 30) return rtf.format(diffDay, 'day');
  return new Intl.DateTimeFormat(LOCALE_MAP[lang] || 'pt-BR', { dateStyle: 'short' }).format(date);
}

export function findCountryMeta(countryName: string): { code: string; name: string; flag: string } {
  const lower = (countryName || '').trim().toLowerCase();
  const match = COUNTRIES.find(
    (c) => c.name.toLowerCase() === lower || c.code.toLowerCase() === lower
  );
  return match || { code: 'UN', name: countryName || 'Global', flag: '🌍' };
}

// Approximate regional centers for distance calculation without storing precise residential GPS
const REGION_COORDS: Record<string, [number, number]> = {
  'brasil': [-14.2, -51.9],
  'são paulo': [-23.5, -46.6],
  'rio de janeiro': [-22.9, -43.2],
  'cacoal': [-11.4, -61.4],
  'manaus': [-3.1, -60.0],
  'boa vista': [2.8, -60.7],
  'portugal': [38.7, -9.1],
  'lisboa': [38.7, -9.1],
  'porto': [41.1, -8.6],
  'estados unidos': [39.8, -98.5],
  'new york': [40.7, -74.0],
  'miami': [25.8, -80.2],
  'espanha': [40.4, -3.7],
  'madrid': [40.4, -3.7],
  'barcelona': [41.4, 2.2],
  'frança': [48.9, 2.3],
  'paris': [48.9, 2.3],
  'alemanha': [52.5, 13.4],
  'berlim': [52.5, 13.4],
  'itália': [41.9, 12.5],
  'roma': [41.9, 12.5],
  'japão': [35.7, 139.7],
  'tóquio': [35.7, 139.7],
  'canadá': [43.7, -79.4],
  'toronto': [43.7, -79.4],
  'méxico': [19.4, -99.1],
  'argentina': [-34.6, -58.4],
  'buenos aires': [-34.6, -58.4],
  'chile': [-33.4, -70.6],
  'reino unido': [51.5, -0.1],
  'londres': [51.5, -0.1],
  'china': [39.9, 116.4],
  'coreia do sul': [37.6, 127.0],
  'austrália': [-33.9, 151.2],
};

export function getApproximateRegionCoords(city: string, country: string): { lat: number; lng: number } {
  const cityKey = (city || '').trim().toLowerCase();
  if (REGION_COORDS[cityKey]) {
    return { lat: REGION_COORDS[cityKey][0], lng: REGION_COORDS[cityKey][1] };
  }
  const countryKey = (country || '').trim().toLowerCase();
  if (REGION_COORDS[countryKey]) {
    return { lat: REGION_COORDS[countryKey][0], lng: REGION_COORDS[countryKey][1] };
  }
  // Deterministic fallback within valid lat/lng based on country code hash (0.1° rounded)
  const meta = findCountryMeta(country);
  const hash = (meta.code || 'GL').split('').reduce((acc, ch) => acc + ch.charCodeAt(0) * 17, 0);
  const lat = Math.round((((hash % 110) - 55) + 0.1) * 10) / 10;
  const lng = Math.round(((((hash * 7) % 300) - 150) + 0.1) * 10) / 10;
  return { lat, lng };
}

export function doesInterestMatchGender(interesseEm: InteresseEm, targetGenero: Genero): boolean {
  if (!interesseEm || interesseEm === 'todos') return true;
  if (interesseEm === 'mulheres') {
    return targetGenero === 'mulher' || targetGenero === 'mulher_cis' || targetGenero === 'mulher_trans';
  }
  if (interesseEm === 'homens') {
    return targetGenero === 'homem' || targetGenero === 'homem_cis' || targetGenero === 'homem_trans';
  }
  if (interesseEm === 'mulheres_cis') return targetGenero === 'mulher_cis' || targetGenero === 'mulher';
  if (interesseEm === 'mulheres_trans') return targetGenero === 'mulher_trans';
  if (interesseEm === 'homens_cis') return targetGenero === 'homem_cis' || targetGenero === 'homem';
  if (interesseEm === 'homens_trans') return targetGenero === 'homem_trans';
  if (interesseEm === 'nao_binarios') return targetGenero === 'nao_binario' || targetGenero === 'outro';
  return true;
}

export const GENDER_LABELS: Record<Genero, string> = {
  mulher: 'Mulher',
  homem: 'Homem',
  mulher_cis: 'Mulher Cisgênero',
  mulher_trans: 'Mulher Transgênero',
  homem_cis: 'Homem Cisgênero',
  homem_trans: 'Homem Transgênero',
  nao_binario: 'Pessoa Não-Binária',
  outro: 'Outro / Fluido',
};

export const INTEREST_OPTIONS: { value: InteresseEm; label: string }[] = [
  { value: 'todos', label: 'Todos os gêneros' },
  { value: 'mulheres', label: 'Mulheres (Cis & Trans)' },
  { value: 'homens', label: 'Homens (Cis & Trans)' },
  { value: 'mulheres_cis', label: 'Mulheres Cisgênero' },
  { value: 'mulheres_trans', label: 'Mulheres Transgênero' },
  { value: 'homens_cis', label: 'Homens Cisgênero' },
  { value: 'homens_trans', label: 'Homens Transgênero' },
  { value: 'nao_binarios', label: 'Pessoas Não-Binárias' },
];
