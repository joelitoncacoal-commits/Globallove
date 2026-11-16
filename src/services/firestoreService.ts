import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  setDoc,
  increment,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  AdminAuditLog,
  AdminProfile,
  AnalyticsEvent,
  AppNotification,
  BlockRecord,
  ChatMessage,
  Genero,
  InteresseEm,
  MatchItem,
  MuralComment,
  MuralPost,
  PrivacySettings,
  Profile,
  RegisteredUserRecord,
  ReportCategory,
  ReportRecord,
  SupportTicket,
  SupportedLang,
  UserProfile,
} from '../types';
import {
  LIMITS,
  buildBlockId,
  buildLikeId,
  buildMatchId,
  buildOrderedPair,
  checkRateLimit,
  computeHaversineKm,
  roundPrivacyCoord,
  sanitizeText,
  sanitizeUrl,
} from '../utils/security';
import {
  findCountryMeta,
  formatLocalizedDateTime,
  formatLocalizedTime,
  getApproximateRegionCoords,
} from '../utils/localization';

export function timestampToIso(ts: unknown): string {
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  if (ts && typeof ts === 'object' && 'toDate' in ts && typeof (ts as { toDate: () => Date }).toDate === 'function') {
    return (ts as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof ts === 'string') return ts;
  return new Date().toISOString();
}

export function mapDocToProfile(
  id: string,
  data: Record<string, unknown>,
  viewerLat?: number,
  viewerLng?: number,
  lang: SupportedLang = 'pt'
): Profile {
  const showLocation = data.showLocation !== false;
  const approxLat = typeof data.approxLat === 'number' ? data.approxLat : 0;
  const approxLng = typeof data.approxLng === 'number' ? data.approxLng : 0;
  const dist =
    showLocation && typeof viewerLat === 'number' && typeof viewerLng === 'number'
      ? computeHaversineKm(viewerLat, viewerLng, approxLat, approxLng)
      : { km: 0, known: false };

  const fotos = Array.isArray(data.fotos)
    ? data.fotos.filter((f): f is string => typeof f === 'string' && f.length > 0)
    : [];

  return {
    id,
    nome: String(data.nome || 'Membro'),
    idade: typeof data.idade === 'number' ? data.idade : 18,
    cidade: String(data.cidade || ''),
    pais: String(data.pais || 'Brasil'),
    bandeira: String(data.bandeira || findCountryMeta(String(data.pais || '')).flag),
    profissao: String(data.profissao || ''),
    bio: String(data.bio || ''),
    interesses: Array.isArray(data.interesses) ? data.interesses.map(String) : [],
    habitos: Array.isArray(data.habitos) ? data.habitos.map(String) : [],
    fotos: fotos.length > 0 ? fotos : ['/icons/icon-192.webp'],
    idiomas: Array.isArray(data.idiomas) ? data.idiomas.map(String) : ['Português'],
    genero: (data.genero as Genero) || 'outro',
    generoRotulo: String(data.generoRotulo || ''),
    interesseEm: (data.interesseEm as InteresseEm) || 'todos',
    latitude: showLocation ? approxLat : 0,
    longitude: showLocation ? approxLng : 0,
    distanciaKm: dist.km,
    distanciaConhecida: dist.known,
    showLocation,
    buscando: String(data.buscando || ''),
    online: Boolean(data.online),
    emailVerified: Boolean(data.emailVerified),
    verificado: Boolean(data.emailVerified),
    ageConfirmed18: Boolean(data.ageConfirmed18),
    status: data.status === 'suspenso' ? 'suspenso' : 'ativo',
    ultimoVisto: data.lastSeenAt ? formatLocalizedDateTime(timestampToIso(data.lastSeenAt), lang) : undefined,
    createdAt: data.createdAt ? timestampToIso(data.createdAt) : undefined,
    updatedAt: data.updatedAt ? timestampToIso(data.updatedAt) : undefined,
  };
}

export async function createCompleteUserProfile(params: {
  uid: string;
  email: string;
  emailVerified: boolean;
  nome: string;
  idade: number;
  cidade: string;
  pais: string;
  bandeira: string;
  genero: Genero;
  generoRotulo: string;
  interesseEm: InteresseEm;
  profissao: string;
  bio: string;
  buscando: string;
  fotos: string[];
  habitos: string[];
  interesses: string[];
  idiomas: string[];
  endereco: string;
  privacy?: Partial<PrivacySettings>;
}): Promise<void> {
  const { uid } = params;
  const cleanFotos = params.fotos.map((f) => sanitizeUrl(f, LIMITS.PHOTO_MAX_BYTES)).filter(Boolean).slice(0, 6);
  if (cleanFotos.length === 0) {
    throw new Error('Adicione pelo menos 1 foto real válida.');
  }
  const idade = Math.min(99, Math.max(18, Math.floor(params.idade)));
  const countryMeta = findCountryMeta(params.pais);
  const cidadeClean = sanitizeText(params.cidade, LIMITS.CITY_MAX) || 'São Paulo';
  const paisClean = sanitizeText(params.pais, LIMITS.COUNTRY_MAX) || countryMeta.name;
  const coords = getApproximateRegionCoords(cidadeClean, paisClean);
  const showLocation = params.privacy?.showLocationOnMap ?? true;
  const hideAddress = params.privacy?.hideAddress ?? true;
  const showOnlineStatus = params.privacy?.showOnlineStatus ?? true;

  const batch = writeBatch(db);
  const profileRef = doc(db, 'profiles', uid);
  const privateRef = doc(db, 'users_private', uid);
  const eventRef = doc(collection(db, 'platform_events'));

  batch.set(profileRef, {
    uid,
    nome: sanitizeText(params.nome, LIMITS.NAME_MAX) || 'Membro',
    idade,
    cidade: cidadeClean,
    pais: paisClean,
    bandeira: (params.bandeira || countryMeta.flag || '🌍').slice(0, 16),
    profissao: sanitizeText(params.profissao, LIMITS.PROFESSION_MAX) || 'Membro GlobalLove',
    bio: sanitizeText(params.bio, LIMITS.BIO_MAX),
    interesses: (params.interesses || []).slice(0, 12).map((i) => sanitizeText(i, 40)).filter(Boolean),
    habitos: (params.habitos || []).slice(0, 18).map((h) => sanitizeText(h, 40)).filter(Boolean),
    fotos: cleanFotos,
    idiomas: (params.idiomas?.length ? params.idiomas : ['Português']).slice(0, 10).map((l) => sanitizeText(l, 40)),
    genero: params.genero,
    generoRotulo: sanitizeText(params.generoRotulo, 40) || 'Pessoa',
    interesseEm: params.interesseEm,
    buscando: sanitizeText(params.buscando, LIMITS.BUSCANDO_MAX) || 'Conexões reais e duradouras',
    showLocation,
    approxLat: roundPrivacyCoord(coords.lat),
    approxLng: roundPrivacyCoord(coords.lng),
    online: showOnlineStatus,
    emailVerified: params.emailVerified,
    ageConfirmed18: true,
    status: 'ativo',
    lastSeenAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  batch.set(privateRef, {
    uid,
    email: sanitizeText(params.email, 160),
    endereco: sanitizeText(params.endereco, LIMITS.ADDRESS_MAX),
    privacyHideAddress: hideAddress,
    privacyShowOnlineStatus: showOnlineStatus,
    privacyShowLocationOnMap: showLocation,
    emailVerified: params.emailVerified,
    status: 'ativo',
    lgpdConsentAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  batch.set(eventRef, {
    uid,
    tipo: 'cadastro',
    detalhe: sanitizeText(`Novo membro cadastrado: ${params.nome} (${cidadeClean}, ${paisClean})`, 240),
    pais: paisClean,
    bandeira: (params.bandeira || countryMeta.flag || '🌍').slice(0, 16),
    createdAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `profiles/${uid}`);
  }
}

export async function updateUserAndPrivacyProfile(
  uid: string,
  currentProfile: UserProfile,
  updates: Partial<UserProfile>
): Promise<void> {
  const merged = { ...currentProfile, ...updates };
  const privacy: PrivacySettings = {
    hideAddress: updates.privacy?.hideAddress ?? currentProfile.privacy?.hideAddress ?? true,
    showOnlineStatus: updates.privacy?.showOnlineStatus ?? currentProfile.privacy?.showOnlineStatus ?? true,
    showLocationOnMap: updates.privacy?.showLocationOnMap ?? currentProfile.privacy?.showLocationOnMap ?? true,
  };
  const countryMeta = findCountryMeta(merged.pais);
  const cidadeClean = sanitizeText(merged.cidade, LIMITS.CITY_MAX) || 'São Paulo';
  const paisClean = sanitizeText(merged.pais, LIMITS.COUNTRY_MAX) || countryMeta.name;
  const coords = getApproximateRegionCoords(cidadeClean, paisClean);
  const cleanFotos = (merged.fotos || [])
    .map((f) => sanitizeUrl(f, LIMITS.PHOTO_MAX_BYTES))
    .filter(Boolean)
    .slice(0, 6);

  const batch = writeBatch(db);
  batch.update(doc(db, 'profiles', uid), {
    nome: sanitizeText(merged.nome, LIMITS.NAME_MAX) || currentProfile.nome,
    idade: Math.min(99, Math.max(18, Math.floor(merged.idade || 18))),
    cidade: cidadeClean,
    pais: paisClean,
    bandeira: (merged.bandeira || countryMeta.flag || '🌍').slice(0, 16),
    profissao: sanitizeText(merged.profissao, LIMITS.PROFESSION_MAX),
    bio: sanitizeText(merged.bio, LIMITS.BIO_MAX),
    interesses: (merged.interesses || []).slice(0, 12).map((i) => sanitizeText(i, 40)).filter(Boolean),
    habitos: (merged.habitos || []).slice(0, 18).map((h) => sanitizeText(h, 40)).filter(Boolean),
    fotos: cleanFotos.length > 0 ? cleanFotos : ['/icons/icon-192.webp'],
    idiomas: (merged.idiomas?.length ? merged.idiomas : ['Português']).slice(0, 10),
    genero: merged.genero,
    generoRotulo: sanitizeText(merged.generoRotulo || 'Pessoa', 40),
    interesseEm: merged.interesseEm,
    buscando: sanitizeText(merged.buscando, LIMITS.BUSCANDO_MAX),
    showLocation: privacy.showLocationOnMap,
    approxLat: roundPrivacyCoord(coords.lat),
    approxLng: roundPrivacyCoord(coords.lng),
    online: privacy.showOnlineStatus,
    emailVerified: Boolean(merged.emailVerified ?? true),
    ageConfirmed18: true,
    lastSeenAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  batch.update(doc(db, 'users_private', uid), {
    endereco: sanitizeText(merged.endereco || '', LIMITS.ADDRESS_MAX),
    privacyHideAddress: privacy.hideAddress,
    privacyShowOnlineStatus: privacy.showOnlineStatus,
    privacyShowLocationOnMap: privacy.showLocationOnMap,
    emailVerified: Boolean(merged.emailVerified ?? true),
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `profiles/${uid}`);
  }
}

export async function recordSwipeAndCheckMutualMatch(
  fromUser: UserProfile,
  target: Profile,
  decision: 'like' | 'superlike' | 'pass'
): Promise<{ isMutualMatch: boolean; matchId: string | null }> {
  if (!checkRateLimit(`swipe_${fromUser.id}`, 60, 60_000)) {
    throw new Error('Limite temporário de ações atingido. Aguarde alguns segundos.');
  }

  const likeId = buildLikeId(fromUser.id, target.id);
  const reverseLikeId = buildLikeId(target.id, fromUser.id);
  const likeRef = doc(db, 'likes', likeId);
  const reverseLikeRef = doc(db, 'likes', reverseLikeId);
  const matchId = buildMatchId(fromUser.id, target.id);
  const matchRef = doc(db, 'matches', matchId);

  let existingLikeCreatedAt: unknown = null;
  try {
    const existingSnap = await getDoc(likeRef);
    if (existingSnap.exists()) {
      existingLikeCreatedAt = existingSnap.data().createdAt;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `likes/${likeId}`);
  }

  let hasReverseLike = false;
  let alreadyMatched = false;
  if (decision !== 'pass') {
    try {
      const [revSnap, matchSnap] = await Promise.all([getDoc(reverseLikeRef), getDoc(matchRef)]);
      hasReverseLike =
        revSnap.exists() && (revSnap.data().type === 'like' || revSnap.data().type === 'superlike');
      alreadyMatched = matchSnap.exists();
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `likes/${reverseLikeId}`);
    }
  }

  const batch = writeBatch(db);
  if (existingLikeCreatedAt) {
    batch.update(likeRef, {
      type: decision,
      updatedAt: serverTimestamp(),
    });
  } else {
    batch.set(likeRef, {
      fromUid: fromUser.id,
      toUid: target.id,
      type: decision,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  let createdNewMatch = false;
  if (decision !== 'pass' && hasReverseLike && !alreadyMatched) {
    const [userA, userB] = buildOrderedPair(fromUser.id, target.id);
    batch.set(matchRef, {
      id: matchId,
      userA,
      userB,
      participants: [userA, userB],
      lastMessage: 'Match confirmado! Inicie a conversa ou vídeo chamada.',
      lastMessageAt: serverTimestamp(),
      lastSenderId: '',
      unreadA: 0,
      unreadB: 0,
      status: 'active',
      blockedBy: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const notifTargetRef = doc(collection(db, 'notifications'));
    batch.set(notifTargetRef, {
      recipientId: target.id,
      senderId: fromUser.id,
      type: 'match',
      title: `Novo Match com ${fromUser.nome}!`,
      body: `Vocês se curtiram mutuamente no GlobalLove.com. Envie a primeira mensagem!`,
      link: `/conversas/${matchId}`,
      read: false,
      createdAt: serverTimestamp(),
    });

    const eventRef = doc(collection(db, 'platform_events'));
    batch.set(eventRef, {
      uid: fromUser.id,
      tipo: 'match',
      detalhe: sanitizeText(`Match mútuo confirmado entre ${fromUser.nome} e ${target.nome}`, 240),
      pais: target.pais || 'Global',
      bandeira: (target.bandeira || '🌍').slice(0, 16),
      createdAt: serverTimestamp(),
    });

    createdNewMatch = true;
  } else if (decision !== 'pass' && !hasReverseLike) {
    const notifLikeRef = doc(collection(db, 'notifications'));
    batch.set(notifLikeRef, {
      recipientId: target.id,
      senderId: fromUser.id,
      type: 'like',
      title: decision === 'superlike' ? `${fromUser.nome} enviou um Super Like!` : `${fromUser.nome} curtiu você`,
      body: `Veja quem demonstrou interesse em ${fromUser.cidade}, ${fromUser.pais}.`,
      link: '/matches',
      read: false,
      createdAt: serverTimestamp(),
    });
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `likes/${likeId}`);
  }

  return { isMutualMatch: createdNewMatch || alreadyMatched, matchId: createdNewMatch || alreadyMatched ? matchId : null };
}

export async function undoSwipeDecision(fromUid: string, targetUid: string): Promise<void> {
  const likeId = buildLikeId(fromUid, targetUid);
  try {
    await deleteDoc(doc(db, 'likes', likeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `likes/${likeId}`);
  }
}

export async function sendMatchMessageRecord(params: {
  match: MatchItem;
  senderUid: string;
  senderNome: string;
  tipo: 'texto' | 'imagem' | 'video' | 'audio';
  texto: string;
  midiaUrl?: string;
  duracaoAudio?: string;
}): Promise<void> {
  if (!checkRateLimit(`msg_${params.senderUid}`, 40, 60_000)) {
    throw new Error('Envio muito rápido. Aguarde alguns instantes.');
  }
  const { match, senderUid } = params;
  const recipientId = match.profile.id;
  if (!recipientId || recipientId === senderUid) return;
  if (match.status === 'blocked') {
    throw new Error('Esta conversa está bloqueada.');
  }

  const textoClean = sanitizeText(params.texto, LIMITS.MESSAGE_MAX);
  const mediaClean = params.midiaUrl ? sanitizeUrl(params.midiaUrl, LIMITS.MEDIA_MAX_BYTES) : undefined;
  if (params.tipo === 'texto' && !textoClean) return;
  if (params.tipo !== 'texto' && !mediaClean) {
    throw new Error('Arquivo de mídia inválido ou acima do tamanho permitido.');
  }

  const msgRef = doc(collection(db, 'matches', match.id, 'messages'));
  const matchRef = doc(db, 'matches', match.id);
  const notifRef = doc(collection(db, 'notifications'));
  const eventRef = doc(collection(db, 'platform_events'));

  const [userA] = buildOrderedPair(senderUid, recipientId);
  const isRecipientA = userA === recipientId;

  const summary =
    params.tipo === 'imagem'
      ? '📷 Foto enviada'
      : params.tipo === 'video'
      ? '🎬 Vídeo enviado'
      : params.tipo === 'audio'
      ? '🎙️ Mensagem de voz'
      : textoClean.slice(0, 120);

  const batch = writeBatch(db);
  const msgPayload: Record<string, unknown> = {
    matchId: match.id,
    senderId: senderUid,
    recipientId,
    tipo: params.tipo,
    texto: textoClean,
    lida: false,
    createdAt: serverTimestamp(),
  };
  if (mediaClean) msgPayload.midiaUrl = mediaClean;
  if (params.duracaoAudio) msgPayload.duracaoAudio = sanitizeText(params.duracaoAudio, 16);

  batch.set(msgRef, msgPayload);
  batch.update(matchRef, {
    lastMessage: sanitizeText(summary, 400),
    lastMessageAt: serverTimestamp(),
    lastSenderId: senderUid,
    ...(isRecipientA ? { unreadA: increment(1) } : { unreadB: increment(1) }),
    updatedAt: serverTimestamp(),
  });
  batch.set(notifRef, {
    recipientId,
    senderId: senderUid,
    type: 'message',
    title: `Nova mensagem de ${params.senderNome}`,
    body: sanitizeText(summary, 280),
    link: `/conversas/${match.id}`,
    read: false,
    createdAt: serverTimestamp(),
  });
  batch.set(eventRef, {
    uid: senderUid,
    tipo: 'mensagem',
    detalhe: sanitizeText(`Mensagem (${params.tipo}) enviada no chat`, 240),
    pais: match.profile.pais || 'Global',
    bandeira: (match.profile.bandeira || '🌍').slice(0, 16),
    createdAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `matches/${match.id}/messages`);
  }
}

export async function markConversationAsRead(
  match: MatchItem,
  viewerUid: string,
  messagesList: ChatMessage[]
): Promise<void> {
  const [userA] = buildOrderedPair(match.profile.id, viewerUid);
  const isViewerA = userA === viewerUid;
  const unreadMsgs = messagesList.filter((m) => m.recipientId === viewerUid && !m.lida);
  if ((match.unreadCount || 0) === 0 && unreadMsgs.length === 0) return;

  const batch = writeBatch(db);
  batch.update(doc(db, 'matches', match.id), {
    ...(isViewerA ? { unreadA: 0 } : { unreadB: 0 }),
    updatedAt: serverTimestamp(),
  });
  unreadMsgs.slice(0, 25).forEach((m) => {
    batch.update(doc(db, 'matches', match.id, 'messages', m.id), { lida: true });
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `matches/${match.id}`);
  }
}

export async function blockTargetUser(
  blockerUid: string,
  targetUid: string,
  reason: string
): Promise<void> {
  const blockId = buildBlockId(blockerUid, targetUid);
  const matchId = buildMatchId(blockerUid, targetUid);
  const blockRef = doc(db, 'blocks', blockId);
  const matchRef = doc(db, 'matches', matchId);
  const eventRef = doc(collection(db, 'platform_events'));

  let matchActive = false;
  try {
    const matchSnap = await getDoc(matchRef);
    matchActive = matchSnap.exists() && matchSnap.data().status === 'active';
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `matches/${matchId}`);
  }

  const batch = writeBatch(db);
  batch.set(blockRef, {
    blockerUid,
    blockedUid: targetUid,
    reason: sanitizeText(reason, LIMITS.BLOCK_REASON_MAX),
    createdAt: serverTimestamp(),
  });
  if (matchActive) {
    batch.update(matchRef, {
      status: 'blocked',
      blockedBy: blockerUid,
      updatedAt: serverTimestamp(),
    });
  }
  batch.set(eventRef, {
    uid: blockerUid,
    tipo: 'block',
    detalhe: sanitizeText(`Usuário bloqueou perfil ${targetUid}`, 240),
    pais: 'Global',
    bandeira: '🛡️',
    createdAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `blocks/${blockId}`);
  }
}

export async function unblockTargetUser(blockerUid: string, targetUid: string): Promise<void> {
  const blockId = buildBlockId(blockerUid, targetUid);
  const reverseBlockId = buildBlockId(targetUid, blockerUid);
  const matchId = buildMatchId(blockerUid, targetUid);

  let canUnblockMatch = false;
  try {
    const [revBlockSnap, matchSnap] = await Promise.all([
      getDoc(doc(db, 'blocks', reverseBlockId)),
      getDoc(doc(db, 'matches', matchId)),
    ]);
    canUnblockMatch =
      !revBlockSnap.exists() &&
      matchSnap.exists() &&
      matchSnap.data().status === 'blocked' &&
      matchSnap.data().blockedBy === blockerUid;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `blocks/${blockId}`);
  }

  const batch = writeBatch(db);
  batch.delete(doc(db, 'blocks', blockId));
  if (canUnblockMatch) {
    batch.update(doc(db, 'matches', matchId), {
      status: 'active',
      blockedBy: '',
      updatedAt: serverTimestamp(),
    });
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `blocks/${blockId}`);
  }
}

export async function submitModerationReport(params: {
  reporterUid: string;
  reportedUid: string;
  category: ReportCategory;
  description: string;
}): Promise<void> {
  if (!checkRateLimit(`report_${params.reporterUid}`, 5, 300_000)) {
    throw new Error('Muitas denúncias em sequência. Aguarde alguns minutos.');
  }
  const desc = sanitizeText(params.description, LIMITS.REPORT_DESC_MAX);
  if (desc.length < 5) {
    throw new Error('Descreva o motivo com pelo menos 5 caracteres.');
  }
  const reportRef = doc(collection(db, 'reports'));
  const eventRef = doc(collection(db, 'platform_events'));
  const batch = writeBatch(db);
  batch.set(reportRef, {
    reporterUid: params.reporterUid,
    reportedUid: params.reportedUid,
    category: params.category,
    description: desc,
    status: 'open',
    reviewedBy: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.set(eventRef, {
    uid: params.reporterUid,
    tipo: 'report',
    detalhe: sanitizeText(`Nova denúncia (${params.category}) contra usuário ${params.reportedUid}`, 240),
    pais: 'Global',
    bandeira: '⚠️',
    createdAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'reports');
  }
}

export async function submitSupportTicketRecord(params: {
  uid: string | null;
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}): Promise<string> {
  if (!checkRateLimit(`ticket_${params.uid || 'anon'}`, 3, 300_000)) {
    throw new Error('Aguarde alguns minutos antes de enviar outro chamado.');
  }
  const ticketRef = doc(collection(db, 'support_tickets'));
  const payload = {
    uid: params.uid || 'anonymous',
    nome: sanitizeText(params.nome, 80),
    email: sanitizeText(params.email, 160),
    assunto: sanitizeText(params.assunto, LIMITS.TICKET_SUBJECT_MAX),
    mensagem: sanitizeText(params.mensagem, LIMITS.TICKET_MSG_MAX),
    status: 'open',
    createdAt: serverTimestamp(),
  };
  if (payload.nome.length < 2 || payload.email.length < 5 || payload.assunto.length < 2 || payload.mensagem.length < 5) {
    throw new Error('Preencha todos os campos obrigatórios corretamente.');
  }
  try {
    await setDoc(ticketRef, payload);
    return ticketRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `support_tickets/${ticketRef.id}`);
  }
}

export async function createMuralPostRecord(
  user: UserProfile,
  texto: string,
  fotoUrl?: string
): Promise<void> {
  if (!checkRateLimit(`post_${user.id}`, 10, 300_000)) {
    throw new Error('Limite temporário de publicações atingido. Aguarde alguns minutos.');
  }
  const cleanText = sanitizeText(texto, LIMITS.POST_MAX);
  if (!cleanText) throw new Error('Escreva uma mensagem para publicar no Mural.');
  const cleanFoto = fotoUrl ? sanitizeUrl(fotoUrl, LIMITS.PHOTO_MAX_BYTES) : undefined;
  const postRef = doc(collection(db, 'mural_posts'));

  const payload: Record<string, unknown> = {
    autorId: user.id,
    autorNome: sanitizeText(user.nome, 80) || 'Membro',
    autorFoto: sanitizeUrl(user.fotos[0] || '', 200000),
    autorCidade: sanitizeText(user.cidade, 80),
    autorPais: sanitizeText(user.pais, 80),
    autorBandeira: (user.bandeira || '🌍').slice(0, 16),
    texto: cleanText,
    curtidasCount: 0,
    comentariosCount: 0,
    visibilidade: 'public',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (cleanFoto) payload.fotoUrl = cleanFoto;

  try {
    await setDoc(postRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `mural_posts/${postRef.id}`);
  }
}

export async function toggleMuralPostLikeRecord(
  postId: string,
  uid: string,
  currentlyLiked: boolean,
  currentCount: number
): Promise<void> {
  const postRef = doc(db, 'mural_posts', postId);
  const likeRef = doc(db, 'mural_posts', postId, 'post_likes', uid);
  const batch = writeBatch(db);

  if (currentlyLiked) {
    batch.delete(likeRef);
    batch.update(postRef, {
      curtidasCount: Math.max(0, currentCount - 1),
      updatedAt: serverTimestamp(),
    });
  } else {
    batch.set(likeRef, { uid, createdAt: serverTimestamp() });
    batch.update(postRef, {
      curtidasCount: currentCount + 1,
      updatedAt: serverTimestamp(),
    });
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `mural_posts/${postId}/post_likes/${uid}`);
  }
}

export async function addMuralCommentRecord(
  postId: string,
  user: UserProfile,
  texto: string,
  currentCommentsCount: number
): Promise<void> {
  if (!checkRateLimit(`comment_${user.id}`, 20, 60_000)) {
    throw new Error('Aguarde alguns segundos entre comentários.');
  }
  const cleanText = sanitizeText(texto, LIMITS.COMMENT_MAX);
  if (!cleanText) return;
  const postRef = doc(db, 'mural_posts', postId);
  const commentRef = doc(collection(db, 'mural_posts', postId, 'comments'));
  const batch = writeBatch(db);

  batch.set(commentRef, {
    postId,
    autorId: user.id,
    autorNome: sanitizeText(user.nome, 80) || 'Membro',
    autorFoto: sanitizeUrl(user.fotos[0] || '', 200000),
    autorBandeira: (user.bandeira || '🌍').slice(0, 16),
    texto: cleanText,
    createdAt: serverTimestamp(),
  });
  batch.update(postRef, {
    comentariosCount: currentCommentsCount + 1,
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `mural_posts/${postId}/comments`);
  }
}

export async function fetchMuralComments(postId: string, lang: SupportedLang): Promise<MuralComment[]> {
  try {
    const q = query(
      collection(db, 'mural_posts', postId, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'asc'),
      limit(30)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        postId,
        autorId: String(data.autorId || ''),
        autorNome: String(data.autorNome || 'Membro'),
        autorFoto: String(data.autorFoto || '/icons/icon-192.webp'),
        autorBandeira: String(data.autorBandeira || '🌍'),
        texto: String(data.texto || ''),
        createdAt: formatLocalizedDateTime(timestampToIso(data.createdAt), lang),
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `mural_posts/${postId}/comments`);
  }
}

export async function deleteMuralPostRecord(postId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'mural_posts', postId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `mural_posts/${postId}`);
  }
}

export async function markNotificationReadRecord(notifId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'notifications', notifId), { read: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `notifications/${notifId}`);
  }
}

export async function recordVideoCallEvent(caller: UserProfile, target: Profile): Promise<void> {
  try {
    const evRef = doc(collection(db, 'platform_events'));
    await setDoc(evRef, {
      uid: caller.id,
      tipo: 'video_chamada',
      detalhe: sanitizeText(`Chamada de vídeo iniciada por ${caller.nome} com ${target.nome}`, 240),
      pais: target.pais || 'Global',
      bandeira: (target.bandeira || '📹').slice(0, 16),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'platform_events');
  }
}

// LGPD self-service account cleanup of user-owned Firestore documents
export async function deleteUserFirestoreData(uid: string): Promise<void> {
  const batch = writeBatch(db);
  batch.delete(doc(db, 'profiles', uid));
  batch.delete(doc(db, 'users_private', uid));

  try {
    const [likesSnap, blocksSnap, notifsSnap, postsSnap] = await Promise.all([
      getDocs(query(collection(db, 'likes'), where('fromUid', '==', uid), limit(50))),
      getDocs(query(collection(db, 'blocks'), where('blockerUid', '==', uid), limit(50))),
      getDocs(query(collection(db, 'notifications'), where('recipientId', '==', uid), limit(50))),
      getDocs(query(collection(db, 'mural_posts'), where('autorId', '==', uid), limit(30))),
    ]);

    likesSnap.docs.forEach((d) => batch.delete(d.ref));
    blocksSnap.docs.forEach((d) => batch.delete(d.ref));
    notifsSnap.docs.forEach((d) => batch.delete(d.ref));
    postsSnap.docs.forEach((d) => batch.delete(d.ref));

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `profiles/${uid}`);
  }
}

// ============================================================================
// ADMIN & MODERATION OPERATIONS (Strict RBAC + Immutable Audit Logs)
// ============================================================================

export async function writeAdminAuditLog(params: {
  actorUid: string;
  actorEmail: string;
  action: string;
  targetId: string;
  details: string;
}): Promise<void> {
  const logRef = doc(collection(db, 'admin_audit_logs'));
  try {
    await setDoc(logRef, {
      actorUid: params.actorUid,
      actorEmail: sanitizeText(params.actorEmail, 160),
      action: sanitizeText(params.action, 80),
      targetId: sanitizeText(params.targetId, 128),
      details: sanitizeText(params.details, 500),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'admin_audit_logs');
  }
}

export async function fetchAdminDashboardData(lang: SupportedLang): Promise<{
  users: RegisteredUserRecord[];
  reports: ReportRecord[];
  tickets: SupportTicket[];
  events: AnalyticsEvent[];
  auditLogs: AdminAuditLog[];
  totalMatches: number;
}> {
  try {
    const [profilesSnap, privateSnap, reportsSnap, ticketsSnap, eventsSnap, auditSnap, matchesSnap] =
      await Promise.all([
        getDocs(query(collection(db, 'profiles'), limit(100))),
        getDocs(query(collection(db, 'users_private'), limit(100))),
        getDocs(query(collection(db, 'reports'), orderBy('createdAt', 'desc'), limit(50))),
        getDocs(query(collection(db, 'support_tickets'), orderBy('createdAt', 'desc'), limit(50))),
        getDocs(query(collection(db, 'platform_events'), orderBy('createdAt', 'desc'), limit(60))),
        getDocs(query(collection(db, 'admin_audit_logs'), orderBy('createdAt', 'desc'), limit(60))),
        getDocs(query(collection(db, 'matches'), limit(200))),
      ]);

    const privateByUid = new Map<string, Record<string, unknown>>();
    privateSnap.docs.forEach((d) => privateByUid.set(d.id, d.data()));

    const users: RegisteredUserRecord[] = profilesSnap.docs.map((d) => {
      const p = d.data();
      const priv = privateByUid.get(d.id);
      return {
        id: d.id,
        nome: String(p.nome || 'Membro'),
        email: String(priv?.email || 'Protegido'),
        idade: typeof p.idade === 'number' ? p.idade : 18,
        generoRotulo: String(p.generoRotulo || ''),
        cidade: String(p.cidade || ''),
        pais: String(p.pais || ''),
        bandeira: String(p.bandeira || '🌍'),
        fotoUrl: Array.isArray(p.fotos) && p.fotos[0] ? String(p.fotos[0]) : '/icons/icon-192.webp',
        dataCadastro: formatLocalizedDateTime(timestampToIso(p.createdAt), lang),
        status: p.status === 'suspenso' ? 'suspenso' : 'ativo',
        verificado: Boolean(p.emailVerified),
      };
    });

    const reports: ReportRecord[] = reportsSnap.docs.map((d) => {
      const r = d.data();
      return {
        id: d.id,
        reporterUid: String(r.reporterUid || ''),
        reportedUid: String(r.reportedUid || ''),
        category: (r.category as ReportCategory) || 'other',
        description: String(r.description || ''),
        status: (r.status as ReportRecord['status']) || 'open',
        reviewedBy: String(r.reviewedBy || ''),
        createdAt: formatLocalizedDateTime(timestampToIso(r.createdAt), lang),
        updatedAt: formatLocalizedDateTime(timestampToIso(r.updatedAt), lang),
      };
    });

    const tickets: SupportTicket[] = ticketsSnap.docs.map((d) => {
      const t = d.data();
      return {
        id: d.id,
        uid: String(t.uid || 'anonymous'),
        nome: String(t.nome || ''),
        email: String(t.email || ''),
        assunto: String(t.assunto || ''),
        mensagem: String(t.mensagem || ''),
        status: t.status === 'resolved' ? 'resolved' : 'open',
        createdAt: formatLocalizedDateTime(timestampToIso(t.createdAt), lang),
      };
    });

    const events: AnalyticsEvent[] = eventsSnap.docs.map((d) => {
      const e = d.data();
      return {
        id: d.id,
        uid: String(e.uid || ''),
        tipo: (e.tipo as AnalyticsEvent['tipo']) || 'cadastro',
        detalhe: String(e.detalhe || ''),
        timestamp: formatLocalizedTime(timestampToIso(e.createdAt), lang),
        pais: String(e.pais || 'Global'),
        bandeira: String(e.bandeira || '🌍'),
      };
    });

    const auditLogs: AdminAuditLog[] = auditSnap.docs.map((d) => {
      const a = d.data();
      return {
        id: d.id,
        actorUid: String(a.actorUid || ''),
        actorEmail: String(a.actorEmail || ''),
        action: String(a.action || ''),
        targetId: String(a.targetId || ''),
        details: String(a.details || ''),
        createdAt: formatLocalizedDateTime(timestampToIso(a.createdAt), lang),
      };
    });

    return {
      users,
      reports,
      tickets,
      events,
      auditLogs,
      totalMatches: matchesSnap.size,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'admin_dashboard');
  }
}

export async function adminToggleUserStatus(
  actor: { uid: string; email: string },
  targetUid: string,
  newStatus: 'ativo' | 'suspenso'
): Promise<void> {
  const batch = writeBatch(db);
  batch.update(doc(db, 'profiles', targetUid), {
    status: newStatus,
    updatedAt: serverTimestamp(),
  });
  batch.update(doc(db, 'users_private', targetUid), {
    status: newStatus,
    updatedAt: serverTimestamp(),
  });
  batch.set(doc(collection(db, 'admin_audit_logs')), {
    actorUid: actor.uid,
    actorEmail: sanitizeText(actor.email, 160),
    action: newStatus === 'suspenso' ? 'SUSPEND_USER' : 'ACTIVATE_USER',
    targetId: targetUid,
    details: `Status alterado para ${newStatus}`,
    createdAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `profiles/${targetUid}`);
  }
}

export async function adminDeleteUserRecord(
  actor: { uid: string; email: string },
  targetUid: string
): Promise<void> {
  const batch = writeBatch(db);
  batch.delete(doc(db, 'profiles', targetUid));
  batch.delete(doc(db, 'users_private', targetUid));
  batch.set(doc(collection(db, 'admin_audit_logs')), {
    actorUid: actor.uid,
    actorEmail: sanitizeText(actor.email, 160),
    action: 'DELETE_USER',
    targetId: targetUid,
    details: `Registro público e privado excluído pela administração`,
    createdAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `profiles/${targetUid}`);
  }
}

export async function adminUpdateReportStatus(
  actor: { uid: string; email: string },
  reportId: string,
  status: 'reviewing' | 'resolved' | 'dismissed'
): Promise<void> {
  const batch = writeBatch(db);
  batch.update(doc(db, 'reports', reportId), {
    status,
    reviewedBy: actor.uid,
    updatedAt: serverTimestamp(),
  });
  batch.set(doc(collection(db, 'admin_audit_logs')), {
    actorUid: actor.uid,
    actorEmail: sanitizeText(actor.email, 160),
    action: `REPORT_${status.toUpperCase()}`,
    targetId: reportId,
    details: `Denúncia marcada como ${status}`,
    createdAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `reports/${reportId}`);
  }
}

export async function adminResolveSupportTicket(
  actor: { uid: string; email: string },
  ticketId: string
): Promise<void> {
  const batch = writeBatch(db);
  batch.update(doc(db, 'support_tickets', ticketId), { status: 'resolved' });
  batch.set(doc(collection(db, 'admin_audit_logs')), {
    actorUid: actor.uid,
    actorEmail: sanitizeText(actor.email, 160),
    action: 'RESOLVE_TICKET',
    targetId: ticketId,
    details: 'Ticket de suporte marcado como resolvido',
    createdAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `support_tickets/${ticketId}`);
  }
}

export async function adminSaveAdminProfile(
  actor: { uid: string; email: string },
  admin: AdminProfile
): Promise<void> {
  const ref = doc(db, 'admins', actor.uid);
  const existingSnap = await getDoc(ref);
  const payload = {
    uid: actor.uid,
    nome: sanitizeText(admin.nome, 80),
    email: sanitizeText(admin.email, 160),
    cargo: sanitizeText(admin.cargo, 100),
    fotoUrl: sanitizeUrl(admin.fotoUrl, 200000),
    nivelAcesso: admin.nivelAcesso,
    ativo: admin.ativo,
    updatedAt: serverTimestamp(),
  };

  try {
    if (existingSnap.exists()) {
      await updateDoc(ref, payload);
    } else {
      await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
    }
    await writeAdminAuditLog({
      actorUid: actor.uid,
      actorEmail: actor.email,
      action: 'UPDATE_ADMIN_PROFILE',
      targetId: actor.uid,
      details: `Perfil administrativo atualizado (${payload.nome})`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `admins/${actor.uid}`);
  }
}
