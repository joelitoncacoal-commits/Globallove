// Security, sanitization, upload validation, privacy rounding & rate limiting utilities
// Volumetric constraints strictly mirror firebase-blueprint.json & firestore.rules.

export const LIMITS = {
  NAME_MAX: 60,
  CITY_MAX: 80,
  COUNTRY_MAX: 80,
  PROFESSION_MAX: 100,
  BIO_MAX: 600,
  BUSCANDO_MAX: 160,
  ADDRESS_MAX: 160,
  MESSAGE_MAX: 2000,
  POST_MAX: 1500,
  COMMENT_MAX: 600,
  REPORT_DESC_MAX: 1000,
  BLOCK_REASON_MAX: 200,
  TICKET_SUBJECT_MAX: 120,
  TICKET_MSG_MAX: 2000,
  PHOTO_MAX_BYTES: 220000,
  MEDIA_MAX_BYTES: 320000,
} as const;

export function sanitizeText(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .replace(/\u200B|\u200C|\u200D|\uFEFF/g, '')
    .trim()
    .slice(0, maxLen);
}

export function sanitizeUrl(url: unknown, maxLen = 250000): string {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed || trimmed.length > maxLen) return '';
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('https://') ||
    lower.startsWith('http://') ||
    /^data:image\/(jpeg|jpg|png|webp);base64,[a-z0-9+/=]+$/i.test(trimmed) ||
    /^data:(audio|video)\/(webm|mp4|mpeg|ogg);base64,[a-z0-9+/=]+$/i.test(trimmed)
  ) {
    return trimmed;
  }
  return '';
}

export function buildMatchId(uid1: string, uid2: string): string {
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}

export function buildOrderedPair(uid1: string, uid2: string): [string, string] {
  return uid1 < uid2 ? [uid1, uid2] : [uid2, uid1];
}

export function buildLikeId(fromUid: string, toUid: string): string {
  return `${fromUid}_${toUid}`;
}

export function buildBlockId(blockerUid: string, blockedUid: string): string {
  return `${blockerUid}_${blockedUid}`;
}

export function roundPrivacyCoord(coord: number): number {
  if (!Number.isFinite(coord)) return 0;
  // ~11 km grid rounding prevents residential geolocation exposure
  return Math.round(coord * 10) / 10;
}

export function computeHaversineKm(
  lat1?: number,
  lng1?: number,
  lat2?: number,
  lng2?: number
): { km: number; known: boolean } {
  if (
    typeof lat1 !== 'number' ||
    typeof lng1 !== 'number' ||
    typeof lat2 !== 'number' ||
    typeof lng2 !== 'number' ||
    !Number.isFinite(lat1) ||
    !Number.isFinite(lng1) ||
    !Number.isFinite(lat2) ||
    !Number.isFinite(lng2)
  ) {
    return { km: 0, known: false };
  }
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return { km: Math.max(1, Math.round(R * c)), known: true };
}

// Image validation and client-side compression for safe Firestore persistence
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function compressImageUpload(
  file: File,
  maxDimension = 720,
  maxStringLen = 180000
): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    throw new Error('Formato inválido. Envie apenas imagens JPG, PNG ou WebP.');
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('A imagem selecionada ultrapassa o limite máximo de 8 MB.');
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Falha ao ler arquivo de imagem.'));
    reader.readAsDataURL(file);
  });

  if (typeof document === 'undefined') {
    return dataUrl.slice(0, maxStringLen);
  }

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Arquivo de imagem corrompido ou ilegível.'));
    el.src = dataUrl;
  });

  const scale = Math.min(1, maxDimension / Math.max(img.width || 1, img.height || 1));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Navegador sem suporte a processamento de imagem.');
  }
  ctx.drawImage(img, 0, 0, width, height);

  let quality = 0.82;
  let output = canvas.toDataURL('image/jpeg', quality);
  while (output.length > maxStringLen && quality > 0.35) {
    quality -= 0.1;
    output = canvas.toDataURL('image/jpeg', quality);
  }

  if (output.length > LIMITS.PHOTO_MAX_BYTES) {
    // Downscale further if needed
    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = Math.max(1, Math.round(width * 0.65));
    smallCanvas.height = Math.max(1, Math.round(height * 0.65));
    const smallCtx = smallCanvas.getContext('2d');
    if (smallCtx) {
      smallCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
      output = smallCanvas.toDataURL('image/jpeg', 0.68);
    }
  }

  if (output.length > LIMITS.PHOTO_MAX_BYTES) {
    throw new Error('Não foi possível comprimir a imagem abaixo do limite seguro (220 KB). Tente outra foto.');
  }

  return output;
}

const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_AUDIO_TYPES = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/ogg'];

export async function validateAndReadMedia(
  file: File,
  kind: 'video' | 'audio'
): Promise<string> {
  const allowed = kind === 'video' ? ALLOWED_VIDEO_TYPES : ALLOWED_AUDIO_TYPES;
  if (!allowed.includes(file.type.toLowerCase())) {
    throw new Error(
      kind === 'video'
        ? 'Formato de vídeo inválido. Use MP4 ou WebM.'
        : 'Formato de áudio inválido.'
    );
  }
  // Base64 overhead is ~1.37x raw size; cap raw file at 240 KB (~328 KB base64)
  if (file.size > 240 * 1024) {
    throw new Error(
      kind === 'video'
        ? 'O vídeo deve ter no máximo 240 KB para envio direto seguro no chat.'
        : 'O áudio excedeu o limite seguro de tamanho.'
    );
  }
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Falha ao processar arquivo de mídia.'));
    reader.readAsDataURL(file);
  });
}

// Sliding-window rate limiter to protect Firestore write quotas and prevent spam
const actionTimestamps: Record<string, number[]> = {};

export function checkRateLimit(
  actionKey: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const list = (actionTimestamps[actionKey] || []).filter((ts) => now - ts < windowMs);
  if (list.length >= maxRequests) {
    actionTimestamps[actionKey] = list;
    return false;
  }
  list.push(now);
  actionTimestamps[actionKey] = list;
  return true;
}

export function resetRateLimiterForTests(): void {
  Object.keys(actionTimestamps).forEach((k) => {
    delete actionTimestamps[k];
  });
}
