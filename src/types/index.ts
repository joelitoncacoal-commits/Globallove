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

export interface Profile {
  id: string;
  nome: string;
  idade: number;
  cidade: string;
  pais: string;
  bandeira: string;
  endereco?: string;
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
  oficial?: boolean;
  latitude: number;
  longitude: number;
  distanciaConhecida?: boolean;
  buscando: string;
  companhiaAtivo?: boolean;
  companhiaPara?: string[];
  companhiaOcasioes?: string[];
  companhiaNota?: string;
  online?: boolean;
  ultimoVisto?: string;
}

export interface UserProfile extends Profile {
  email: string;
  onboardingConcluido: boolean;
  isPremium?: boolean;
  premiumExpiresAt?: string;
  verificado?: boolean;
}

export interface ChatMessage {
  id: string;
  matchId: string;
  autorId: string; // 'eu' or target profile id
  texto: string;
  hora: string;
  tipo?: 'texto' | 'audio' | 'imagem' | 'video';
  midiaUrl?: string;
  duracaoAudio?: string;
  lida?: boolean;
}

export interface MatchItem {
  id: string;
  profile: Profile;
  createdAt: string;
  lastMessage?: string;
  unreadCount?: number;
}

export interface MuralPost {
  id: string;
  autorId: string;
  autorNome: string;
  autorFoto: string;
  autorCidade: string;
  autorPais: string;
  autorBandeira: string;
  isOficial?: boolean;
  texto: string;
  textoOriginal?: string;
  idiomaOriginal?: string;
  fotoUrl?: string;
  curtidas: number;
  curtidoPeloUsuario?: boolean;
  comentariosCount: number;
  createdAt: string;
  comentarios?: MuralComment[];
}

export interface MuralComment {
  id: string;
  autorNome: string;
  autorFoto: string;
  autorBandeira: string;
  texto: string;
  createdAt: string;
}

export interface FilterState {
  pais: string;
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
  tipo: 'clique' | 'cadastro' | 'match' | 'video_chamada' | 'mensagem' | 'visita_pagina';
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
  totalCliquesRecebidos: number;
}
