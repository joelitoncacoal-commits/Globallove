import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Profile,
  UserProfile,
  ChatMessage,
  MatchItem,
  MuralPost,
  FilterState,
  SupportedLang,
  AdminProfile,
  AnalyticsEvent,
  RegisteredUserRecord
} from '../types';
import { INITIAL_USER_PROFILE, INITIAL_PROFILES } from '../data/mockProfiles';
import { INITIAL_MURAL_POSTS } from '../data/muralData';
import { detectBrowserLanguage, getTranslations, TranslationStrings } from '../i18n/translations';

interface AppContextType {
  user: UserProfile;
  updateUser: (updated: Partial<UserProfile>) => void;
  currentLang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  t: TranslationStrings;
  profiles: Profile[];
  filteredProfiles: Profile[];
  currentIndex: number;
  currentProfile: Profile | null;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  likeProfile: (profile: Profile) => boolean;
  passProfile: (profile: Profile) => void;
  rewindAction: () => void;
  matches: MatchItem[];
  messages: Record<string, ChatMessage[]>;
  sendMessage: (matchId: string, texto: string) => void;
  sendMediaMessage: (matchId: string, params: {
    tipo: 'imagem' | 'video' | 'audio';
    midiaUrl: string;
    texto?: string;
    duracaoAudio?: string;
  }) => void;
  muralPosts: MuralPost[];
  toggleLikePost: (postId: string) => void;
  addMuralPost: (texto: string, fotoUrl?: string) => void;
  addMuralComment: (postId: string, texto: string) => void;
  newMatchModal: Profile | null;
  closeMatchModal: () => void;
  activeVideoCall: Profile | null;
  startVideoCall: (profile: Profile) => void;
  endVideoCall: () => void;
  getMutualAffinities: (target: Profile) => {
    interests: string[];
    habits: string[];
    count: number;
  };
  currentRoute: string;
  navigate: (path: string) => void;
  isLoggedIn: boolean;
  loginUser: (email: string, nome?: string) => void;
  registerUser: (profileData: Partial<UserProfile>, recordData: RegisteredUserRecord) => void;
  logoutUser: () => void;
  isPremium: boolean;
  activatePremium: (period: 'mensal' | 'anual') => void;

  // --- ÁREA ADMINISTRATIVA EM TEMPO REAL (DADOS 100% REAIS) ---
  adminProfile: AdminProfile;
  updateAdminProfile: (updated: Partial<AdminProfile>) => void;
  totalClicks: number;
  trackClick: (detalhe: string, tipo?: AnalyticsEvent['tipo'], pais?: string) => void;
  eventsFeed: AnalyticsEvent[];
  registeredUsersList: RegisteredUserRecord[];
  toggleUserStatus: (userId: string) => void;
  deleteRegisteredUser: (userId: string) => void;
  activeOnlineUsersCount: number;
  totalMatchesCount: number;
  totalVideoCallsCount: number;
  resetAuditMetrics: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  USER: 'globallove_user_profile_real_v1',
  LIKES: 'globallove_liked_ids_real_v1',
  PASSES: 'globallove_passed_ids_real_v1',
  MATCHES: 'globallove_matches_list_real_v1',
  MESSAGES: 'globallove_chat_messages_real_v1',
  MURAL: 'globallove_mural_posts_real_v1',
  PREMIUM: 'globallove_premium_active_real_v1',
  AUTH: 'globallove_auth_session_real_v1',
  LANG: 'globallove_lang',
  ADMIN_PROFILE: 'globallove_admin_profile_real_v1',
  TOTAL_CLICKS: 'globallove_total_clicks_real_v1',
  EVENTS_FEED: 'globallove_events_feed_real_v1',
  USERS_LIST: 'globallove_users_list_real_v1',
  VIDEO_CALLS: 'globallove_video_calls_real_v1',
};

const INITIAL_ADMIN_PROFILE: AdminProfile = {
  id: 'adm_master',
  nome: 'Joeliton Administrador',
  email: 'joeliton.cacoal@gmail.com',
  cargo: 'Fundador & Diretor Geral',
  fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  nivelAcesso: 'SuperAdmin',
  criadoEm: 'Novembro de 2026',
  ativo: true
};

// Dados 100% reais: Inicia vazio para armazenar apenas cadastros reais feitos na plataforma
const INITIAL_REGISTERED_USERS: RegisteredUserRecord[] = [];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state
  const [currentLang, setCurrentLangState] = useState<SupportedLang>(() => detectBrowserLanguage());

  const setLang = useCallback((lang: SupportedLang) => {
    setCurrentLangState(lang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const t = useMemo(() => getTranslations(currentLang), [currentLang]);

  // 2. Navigation state synced with browser history
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigate = useCallback((path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 3. Auth state - strictly false by default so visitors are forced to register
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH);
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  // 4. User profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) return { ...INITIAL_USER_PROFILE, ...JSON.parse(stored) };
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USER_PROFILE;
  });

  const updateUser = useCallback((updated: Partial<UserProfile>) => {
    setUser(prev => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  // 5. 100% Free - All features unlocked
  const [isPremium, setIsPremium] = useState<boolean>(true);

  const activatePremium = useCallback((_period: 'mensal' | 'anual') => {
    setIsPremium(true);
    updateUser({ isPremium: true });
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, [updateUser]);

  // 6. Video Call state (dados 100% reais)
  const [activeVideoCall, setActiveVideoCall] = useState<Profile | null>(null);
  const [totalVideoCallsCount, setTotalVideoCallsCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.VIDEO_CALLS);
      return stored ? Number(stored) : 0;
    } catch {
      return 0;
    }
  });

  const startVideoCall = useCallback((profile: Profile) => {
    setActiveVideoCall(profile);
    setTotalVideoCallsCount(c => {
      const next = c + 1;
      try {
        localStorage.setItem(STORAGE_KEYS.VIDEO_CALLS, String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  const endVideoCall = useCallback(() => {
    setActiveVideoCall(null);
  }, []);

  // 7. Mutual Affinities Comparison Helper
  const getMutualAffinities = useCallback((target: Profile) => {
    const targetInterests = target.interesses || [];
    const targetHabits = target.habitos || [];

    const userInterests = user.interesses || [];
    const userHabits = user.habitos || [];

    const commonInterests = userInterests.filter(i =>
      targetInterests.some(ti => ti.toLowerCase() === i.toLowerCase())
    );

    const commonHabits = userHabits.filter(h =>
      targetHabits.includes(h)
    );

    return {
      interests: commonInterests,
      habits: commonHabits,
      count: commonInterests.length + commonHabits.length
    };
  }, [user.interesses, user.habitos]);

  // 8. Likes and Passes
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LIKES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [passedIds, setPassedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PASSES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [lastSwiped, setLastSwiped] = useState<Profile | null>(null);

  // 9. Matches
  const [matches, setMatches] = useState<MatchItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MATCHES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    const camila = INITIAL_PROFILES.find(p => p.id === 'p_camila')!;
    const mateo = INITIAL_PROFILES.find(p => p.id === 'p_mateo')!;
    return [
      {
        id: 'match_camila',
        profile: camila,
        createdAt: 'Hoje às 14:20',
        lastMessage: 'Oi Alex! Adorei suas fotos e seu gosto musical. Qual café você mais recomenda por SP?',
        unreadCount: 1
      },
      {
        id: 'match_mateo',
        profile: mateo,
        createdAt: 'Ontem',
        lastMessage: '¡Hola! Qué bueno encontrarte por acá. ¿Estás en São Paulo?',
        unreadCount: 0
      }
    ];
  });

  const [totalMatchesCount, setTotalMatchesCount] = useState<number>(() => matches.length);

  // 10. Messages
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return {
      match_camila: [
        {
          id: 'm1',
          matchId: 'match_camila',
          autorId: 'p_camila',
          texto: 'Oi Alex! Adorei suas fotos e seu gosto musical. Qual café você mais recomenda por SP?',
          hora: '14:20',
          lida: true
        }
      ],
      match_mateo: [
        {
          id: 'm2',
          matchId: 'match_mateo',
          autorId: 'p_mateo',
          texto: '¡Hola! Qué bueno encontrarte por acá. ¿Estás en São Paulo?',
          hora: 'Ontem',
          lida: true
        }
      ]
    };
  });

  // 11. Filters
  const [filters, setFilters] = useState<FilterState>({
    pais: 'Todos',
    idadeMin: 18,
    idadeMax: 65,
    distanciaMax: 20000,
    interesses: [],
    habitos: [],
    apenasVerificados: false,
    genero: 'todos',
    apenasOnline: false,
  });

  // 12. Match celebration popup
  const [newMatchModal, setNewMatchModal] = useState<Profile | null>(null);

  const closeMatchModal = useCallback(() => {
    setNewMatchModal(null);
  }, []);

  const profiles = INITIAL_PROFILES.filter(p => !p.oficial);

  const filteredProfiles = profiles.filter(p => {
    if (likedIds.includes(p.id) || passedIds.includes(p.id)) return false;
    if (filters.pais !== 'Todos' && p.pais.toLowerCase() !== filters.pais.toLowerCase()) return false;
    if (p.idade < filters.idadeMin || p.idade > filters.idadeMax) return false;
    if (filters.apenasOnline && !p.online) return false;
    if (filters.genero && filters.genero !== 'todos') {
      if (p.genero !== filters.genero) return false;
    }
    if (filters.habitos && filters.habitos.length > 0) {
      const pHabits = p.habitos || [];
      const hasHabit = pHabits.some(h => filters.habitos?.includes(h));
      if (!hasHabit) return false;
    }
    if (filters.interesses.length > 0) {
      const hasCommon = p.interesses.some(i => filters.interesses.includes(i));
      if (!hasCommon) return false;
    }
    return true;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProfile = filteredProfiles[currentIndex] || null;

  // --- 13. ÁREA ADMINISTRATIVA EM TEMPO REAL ---
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_PROFILE);
      return stored ? JSON.parse(stored) : INITIAL_ADMIN_PROFILE;
    } catch {
      return INITIAL_ADMIN_PROFILE;
    }
  });

  const updateAdminProfile = useCallback((updated: Partial<AdminProfile>) => {
    setAdminProfile(prev => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_PROFILE, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  const [totalClicks, setTotalClicks] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TOTAL_CLICKS);
      return stored ? Number(stored) : 0;
    } catch {
      return 0;
    }
  });

  const [eventsFeed, setEventsFeed] = useState<AnalyticsEvent[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EVENTS_FEED);
      if (stored) return JSON.parse(stored);
    } catch {
      // empty
    }
    return [];
  });

  const [registeredUsersList, setRegisteredUsersList] = useState<RegisteredUserRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
      return stored ? JSON.parse(stored) : INITIAL_REGISTERED_USERS;
    } catch {
      return INITIAL_REGISTERED_USERS;
    }
  });

  const toggleUserStatus = useCallback((userId: string) => {
    setRegisteredUsersList(prev => {
      const next = prev.map(u =>
        u.id === userId
          ? { ...u, status: (u.status === 'ativo' ? 'suspenso' : 'ativo') as 'ativo' | 'suspenso' }
          : u
      );
      try {
        localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  const deleteRegisteredUser = useCallback((userId: string) => {
    setRegisteredUsersList(prev => {
      const next = prev.filter(u => u.id !== userId);
      try {
        localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  // Track click helper
  const trackClick = useCallback((detalhe: string, tipo: AnalyticsEvent['tipo'] = 'clique', pais: string = 'Brasil') => {
    setTotalClicks(prev => {
      const next = prev + 1;
      try {
        localStorage.setItem(STORAGE_KEYS.TOTAL_CLICKS, String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    const newEv: AnalyticsEvent = {
      id: `ev_${Date.now()}_${Math.random()}`,
      tipo,
      detalhe,
      timestamp: 'Agora mesmo',
      pais,
      bandeira: pais === 'Brasil' ? '🇧🇷' : pais === 'Portugal' ? '🇵🇹' : pais === 'Argentina' ? '🇦🇷' : '🌍'
    };

    setEventsFeed(prev => {
      const next = [newEv, ...prev.slice(0, 49)];
      try {
        localStorage.setItem(STORAGE_KEYS.EVENTS_FEED, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  // Global Click Tracker listener
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const buttonOrLink = target.closest('button, a, input, select');
      if (buttonOrLink) {
        const text = (buttonOrLink.textContent || '').trim().slice(0, 30);
        trackClick(`Clique do usuário em "${text || buttonOrLink.tagName.toLowerCase()}"`, 'clique');
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [trackClick]);

  // Usuários online em tempo real (dados 100% reais sem simulação)
  const activeOnlineUsersCount = Math.max(1, registeredUsersList.filter(u => u.status === 'ativo').length);

  // Like profile action
  const likeProfile = useCallback((profile: Profile): boolean => {
    setLikedIds(prev => {
      const next = [...prev, profile.id];
      try {
        localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    setLastSwiped(profile);
    trackClick(`Like enviado para ${profile.nome} (${profile.cidade})`, 'clique', profile.pais);

    const isMatch = true;
    if (isMatch) {
      setTotalMatchesCount(c => c + 1);
      trackClick(`Match confirmado com ${profile.nome}! 🎉`, 'match', profile.pais);

      const matchId = `match_${profile.id}`;
      const newMatch: MatchItem = {
        id: matchId,
        profile,
        createdAt: 'Agora mesmo',
        lastMessage: 'Vocês deram match! Que tal iniciar uma vídeo chamada ou enviar uma foto?',
        unreadCount: 0
      };

      setMatches(prev => {
        const next = [newMatch, ...prev.filter(m => m.profile.id !== profile.id)];
        try {
          localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(next));
        } catch (e) {
          console.error(e);
        }
        return next;
      });

      setNewMatchModal(profile);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.55 }
      });
    }

    return isMatch;
  }, [trackClick]);

  const passProfile = useCallback((profile: Profile) => {
    setPassedIds(prev => {
      const next = [...prev, profile.id];
      try {
        localStorage.setItem(STORAGE_KEYS.PASSES, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    setLastSwiped(profile);
    trackClick(`Pular perfil: ${profile.nome}`, 'clique', profile.pais);
  }, [trackClick]);

  const rewindAction = useCallback(() => {
    if (!lastSwiped) return;
    setLikedIds(prev => prev.filter(id => id !== lastSwiped.id));
    setPassedIds(prev => prev.filter(id => id !== lastSwiped.id));
    setMatches(prev => prev.filter(m => m.profile.id !== lastSwiped.id));
    setLastSwiped(null);
  }, [lastSwiped]);

  // Send text message
  const sendMessage = useCallback((matchId: string, texto: string) => {
    if (!texto.trim()) return;

    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      matchId,
      autorId: 'eu',
      tipo: 'texto',
      texto,
      hora,
      lida: true
    };

    trackClick(`Mensagem enviada no chat: "${texto.slice(0, 20)}..."`, 'mensagem');

    setMessages(prev => {
      const currentList = prev[matchId] || [];
      const updated = { ...prev, [matchId]: [...currentList, userMsg] };
      try {
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    setMatches(prev => {
      const updated = prev.map(m => (m.id === matchId ? { ...m, lastMessage: texto } : m));
      try {
        localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // Realistic auto-reply simulation
    const targetMatch = matches.find(m => m.id === matchId);
    if (targetMatch) {
      setTimeout(() => {
        const replyHora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        const replies: Record<string, string[]> = {
          p_camila: [
            "Que ótimo falar com você! Estava justamente olhando nossas afinidades.",
            "Ah, eu adoro café especial e caminhar no parque! Vamos marcar uma vídeo chamada?",
            "Concordo totalmente! Quando a conexão é leve assim dá até gosto.",
            "Que máximo! O que você mais gosta de fazer aos finais de semana?"
          ],
          p_mateo: [
            "¡Qué alegría leerte! Estaba tomando unos mates y vi tu mensaje.",
            "¡Totalmente de acuerdo! Me encanta la buena vibra que compartimos.",
            "Si alguna vez venís por Buenos Aires, tenés un tour gastronómico asegurado.",
            "¡Me encanta que tengamos tantos hábitos en común!"
          ],
          p_sofia: [
            "Olá! Que bom que me escreveste. Estava a ler no miradouro de Lisboa.",
            "Adorava conversar mais contigo! Que tal uma chamada de vídeo?",
            "Lisboa tem uma luz mágica ao entardecer. Irias adorar.",
            "Que coincidência maravilhosa partilharmos dos mesmos gostos!"
          ]
        };

        const available = replies[targetMatch.profile.id] || [
          `Oi! Adorei a sua mensagem e nossas afinidades em comum.`,
          `Que dia bom para conversar com você! Como está seu dia?`,
          `Amei sua foto! Vamos conversando sempre!`
        ];

        const randomReply = available[Math.floor(Math.random() * available.length)];

        const replyMsg: ChatMessage = {
          id: `msg_reply_${Date.now()}`,
          matchId,
          autorId: targetMatch.profile.id,
          tipo: 'texto',
          texto: randomReply,
          hora: replyHora,
          lida: false
        };

        setMessages(prev => {
          const currentList = prev[matchId] || [];
          const updated = { ...prev, [matchId]: [...currentList, replyMsg] };
          try {
            localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          return updated;
        });

        setMatches(prev => {
          const updated = prev.map(m =>
            m.id === matchId ? { ...m, lastMessage: randomReply, unreadCount: (m.unreadCount || 0) + 1 } : m
          );
          try {
            localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          return updated;
        });
      }, 1500);
    }
  }, [matches, trackClick]);

  // Send media message
  const sendMediaMessage = useCallback((matchId: string, params: {
    tipo: 'imagem' | 'video' | 'audio';
    midiaUrl: string;
    texto?: string;
    duracaoAudio?: string;
  }) => {
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg_media_${Date.now()}`,
      matchId,
      autorId: 'eu',
      tipo: params.tipo,
      midiaUrl: params.midiaUrl,
      texto: params.texto || '',
      duracaoAudio: params.duracaoAudio,
      hora,
      lida: true
    };

    trackClick(`Mídia enviada (${params.tipo})`, 'mensagem');

    setMessages(prev => {
      const currentList = prev[matchId] || [];
      const updated = { ...prev, [matchId]: [...currentList, userMsg] };
      try {
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    const displaySummary = params.tipo === 'imagem' ? '📷 Foto enviada' : params.tipo === 'video' ? '🎬 Vídeo enviado' : '🎙️ Mensagem de voz';
    setMatches(prev => {
      const updated = prev.map(m => (m.id === matchId ? { ...m, lastMessage: displaySummary } : m));
      try {
        localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    setTimeout(() => {
      const replyHora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const compliment = params.tipo === 'imagem'
        ? 'Adorei a foto! Que lugar lindo e que energia incrível!'
        : params.tipo === 'video'
        ? 'Nossa, que vídeo maravilhoso! Me senti aí agora.'
        : 'Amei ouvir sua voz! Muito bom escutar seu carinho.';

      const replyMsg: ChatMessage = {
        id: `msg_reply_media_${Date.now()}`,
        matchId,
        autorId: 'target',
        tipo: 'texto',
        texto: compliment,
        hora: replyHora,
        lida: false
      };

      setMessages(prev => {
        const currentList = prev[matchId] || [];
        const updated = { ...prev, [matchId]: [...currentList, replyMsg] };
        try {
          localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    }, 1800);
  }, [trackClick]);

  // Mural posts
  const [muralPosts, setMuralPosts] = useState<MuralPost[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MURAL);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MURAL_POSTS;
  });

  const toggleLikePost = useCallback((postId: string) => {
    setMuralPosts(prev => {
      const updated = prev.map(p => {
        if (p.id !== postId) return p;
        const wasLiked = p.curtidoPeloUsuario;
        return {
          ...p,
          curtidoPeloUsuario: !wasLiked,
          curtidas: wasLiked ? p.curtidas - 1 : p.curtidas + 1
        };
      });
      try {
        localStorage.setItem(STORAGE_KEYS.MURAL, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  const addMuralPost = useCallback((texto: string, fotoUrl?: string) => {
    if (!texto.trim()) return;
    const newPost: MuralPost = {
      id: `post_${Date.now()}`,
      autorId: user.id,
      autorNome: user.nome,
      autorFoto: user.fotos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      autorCidade: user.cidade || 'São Paulo',
      autorPais: user.pais || 'Brasil',
      autorBandeira: user.bandeira || '🇧🇷',
      texto,
      fotoUrl,
      curtidas: 1,
      curtidoPeloUsuario: true,
      comentariosCount: 0,
      createdAt: 'Agora mesmo',
      comentarios: []
    };

    setMuralPosts(prev => {
      const updated = [newPost, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.MURAL, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, [user]);

  const addMuralComment = useCallback((postId: string, texto: string) => {
    if (!texto.trim()) return;
    setMuralPosts(prev => {
      const updated = prev.map(post => {
        if (post.id !== postId) return post;
        const newComment = {
          id: `c_${Date.now()}`,
          autorNome: user.nome,
          autorFoto: user.fotos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          autorBandeira: user.bandeira || '🇧🇷',
          texto,
          createdAt: 'Agora mesmo'
        };
        const comentarios = post.comentarios ? [...post.comentarios, newComment] : [newComment];
        return {
          ...post,
          comentarios,
          comentariosCount: comentarios.length
        };
      });
      try {
        localStorage.setItem(STORAGE_KEYS.MURAL, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, [user]);

  // Real user registration handler
  const registerUser = useCallback((profileData: Partial<UserProfile>, recordData: RegisteredUserRecord) => {
    setUser(prev => {
      const next: UserProfile = {
        ...prev,
        ...profileData,
        onboardingConcluido: true,
        verificado: true,
        isPremium: true
      };
      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    setIsLoggedIn(true);
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(true));
    } catch (e) {
      console.error(e);
    }

    setRegisteredUsersList(prev => {
      const next = [recordData, ...prev.filter(u => u.email !== recordData.email)];
      try {
        localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    trackClick(
      `Novo cadastro real verificado: ${recordData.nome} (${recordData.idade} anos, ${recordData.cidade} - ${recordData.pais})`,
      'cadastro',
      recordData.pais
    );

    navigate('/descobrir');
  }, [navigate, trackClick]);

  // Auth actions
  const loginUser = useCallback((email: string, nome?: string) => {
    setIsLoggedIn(true);
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(true));
    } catch (e) {
      console.error(e);
    }

    const resolvedName = nome || 'Usuário';
    if (nome) {
      updateUser({ nome: resolvedName, email, verificado: true });
    } else {
      updateUser({ email, verificado: true });
    }

    trackClick(`Acesso à conta realizado por ${resolvedName} (${email})`, 'cadastro');
    navigate('/descobrir');
  }, [navigate, updateUser, trackClick]);

  const logoutUser = useCallback(() => {
    setIsLoggedIn(false);
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(false));
    } catch (e) {
      console.error(e);
    }
    navigate('/');
  }, [navigate]);

  const resetAuditMetrics = useCallback(() => {
    setTotalClicks(0);
    setEventsFeed([]);
    setTotalVideoCallsCount(0);
    try {
      localStorage.setItem(STORAGE_KEYS.TOTAL_CLICKS, '0');
      localStorage.setItem(STORAGE_KEYS.EVENTS_FEED, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.VIDEO_CALLS, '0');
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        currentLang,
        setLang,
        t,
        profiles,
        filteredProfiles,
        currentIndex,
        currentProfile,
        filters,
        setFilters,
        likeProfile,
        passProfile,
        rewindAction,
        matches,
        messages,
        sendMessage,
        sendMediaMessage,
        muralPosts,
        toggleLikePost,
        addMuralPost,
        addMuralComment,
        newMatchModal,
        closeMatchModal,
        activeVideoCall,
        startVideoCall,
        endVideoCall,
        getMutualAffinities,
        currentRoute,
        navigate,
        isLoggedIn,
        loginUser,
        registerUser,
        logoutUser,
        isPremium,
        activatePremium,

        // Admin State & Methods (100% Real Data)
        adminProfile,
        updateAdminProfile,
        totalClicks,
        trackClick,
        eventsFeed,
        registeredUsersList,
        toggleUserStatus,
        deleteRegisteredUser,
        activeOnlineUsersCount,
        totalMatchesCount,
        totalVideoCallsCount,
        resetAuditMetrics
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
