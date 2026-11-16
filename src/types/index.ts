export type Genero =
  | 'mulher'
  | 'homem'
  | 'mulher_cis'
  | 'mulher_trans'
  | 'homem_cis'
  | 'homem_trans'
  | 'nao_binario'
  | 'outro';

export type InteresseEm =
  | 'todos'
  | 'mulheres'
  | 'homens'
  | 'mulheres_cis'
  | 'mulheres_trans'
  | 'homens_cis'
  | 'homens_trans'
  | 'nao_binarios';

export type SupportedLang = 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'zh';

export interface LifestyleHabit {
  id: string;
  label: string;
  icon: string;
  categoria: 'estilo' | 'social' | 'rotina' | 'lazer';
}

export interface PrivacySettings {
  hideAddress: boolean;
  showOnlineStatus: boolean;
  showLocationOnMap: boolean;
}

export interface Profile {
  id: string;
  nome: string;
  idade: number;
  cidade: string;
  pais: string;
  bandeira: string;
  distanciaKm: number;
  profissao: string;
  bio: string;
  interesses: string[];
  habitos?: string[];
  fotos: string[];
  idiomas: string[];
  genero: Genero;
  generoRotulo?: string;
  interesseEm: InteresseEm;
  latitude: number;
  longitude: number;
  distanciaConhecida?: boolean;
  showLocation?: boolean;
  buscando: string;
  online?: boolean;
  ultimoVisto?: string;
  verificado?: boolean;
  emailVerified?: boolean;
  ageConfirmed18?: boolean;
  status?: 'ativo' | 'suspenso';
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile extends Profile {
  email: string;
  endereco?: string;
  onboardingConcluido: boolean;
  isPremium?: boolean;
  verificado?: boolean;
  privacy?: PrivacySettings;
}

export interface ChatMessage {
  id: string;
  matchId: string;
  autorId: string; // sender uid ('eu' alias supported in legacy components via uid comparison)
  senderId?: string;
  recipientId?: string;
  texto: string;
  hora: string;
  createdAtIso?: string;
  tipo?: 'texto' | 'audio' | 'imagem' | 'video';
  midiaUrl?: string;
  duracaoAudio?: string;
  lida?: boolean;
}

export interface MatchItem {
  id: string;
  userA?: string;
  userB?: string;
  profile: Profile;
  createdAt: string;
  lastMessage?: string;
  lastMessageAtIso?: string;
  lastSenderId?: string;
  unreadCount?: number;
  status?: 'active' | 'blocked';
  blockedBy?: string;
}

export interface MuralComment {
  id: string;
  postId?: string;
  autorId?: string;
  autorNome: string;
  autorFoto: string;
  autorBandeira: string;
  texto: string;
  createdAt: string;
}

export interface MuralPost {
  id: string;
  autorId: string;
  autorNome: string;
  autorFoto: string;
  autorCidade: string;
  autorPais: string;
  autorBandeira: string;
  texto: string;
  fotoUrl?: string;
  curtidas: number;
  curtidoPeloUsuario?: boolean;
  comentariosCount: number;
  visibilidade?: 'public' | 'hidden';
  createdAt: string;
  comentarios?: MuralComment[];
}

export interface FilterState {
  pais: string;
  cidade?: string;
  busca?: string;
  idadeMin: number;
  idadeMax: number;
  distanciaMax: number;
  interesses: string[];
  habitos?: string[];
  apenasVerificados?: boolean;
  genero?: string;
  apenasOnline?: boolean;
}

export interface AdminProfile {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  fotoUrl: string;
  nivelAcesso: 'SuperAdmin' | 'Moderador';
  criadoEm: string;
  ativo: boolean;
}

export interface AnalyticsEvent {
  id: string;
  uid?: string;
  tipo: 'cadastro' | 'match' | 'video_chamada' | 'mensagem' | 'report' | 'block';
  detalhe: string;
  timestamp: string;
  pais?: string;
  bandeira?: string;
}

export interface RegisteredUserRecord {
  id: string;
  nome: string;
  email: string;
  idade: number;
  generoRotulo: string;
  cidade: string;
  pais: string;
  bandeira: string;
  fotoUrl: string;
  dataCadastro: string;
  status: 'ativo' | 'suspenso';
  verificado: boolean;
  totalCliquesRecebidos?: number;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  senderId: string;
  type: 'like' | 'match' | 'message' | 'profile_view' | 'mural' | 'moderation' | 'system';
  title: string;
  body: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export interface BlockRecord {
  id: string;
  blockerUid: string;
  blockedUid: string;
  reason: string;
  createdAt: string;
  blockedName?: string;
  blockedPhoto?: string;
  blockedCountry?: string;
}

export type ReportCategory = 'spam' | 'harassment' | 'fake_profile' | 'underage' | 'scam' | 'other';

export interface ReportRecord {
  id: string;
  reporterUid: string;
  reportedUid: string;
  category: ReportCategory;
  description: string;
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
  reviewedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  id: string;
  uid: string;
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
  status: 'open' | 'resolved';
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  actorUid: string;
  actorEmail: string;
  action: string;
  targetId: string;
  details: string;
  createdAt: string;
}

export interface IncomingLikeItem {
  id: string;
  fromUid: string;
  type: 'like' | 'superlike';
  createdAt: string;
  profile: Profile | null;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
