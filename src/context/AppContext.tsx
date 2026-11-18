import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  deleteUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
  BOOTSTRAPPED_SUPERADMIN_EMAIL,
} from '../lib/firebase';
import {
  Profile,
  UserProfile,
  ChatMessage,
  MatchItem,
  MuralPost,
  MuralComment,
  FilterState,
  SupportedLang,
  AdminProfile,
  AnalyticsEvent,
  RegisteredUserRecord,
  AppNotification,
  BlockRecord,
  ReportCategory,
  ReportRecord,
  SupportTicket,
  AdminAuditLog,
  IncomingLikeItem,
  ToastMessage,
  Genero,
  InteresseEm,
} from '../types';
import {
  createCompleteUserProfile,
  updateUserAndPrivacyProfile,
  recordSwipeAndCheckMutualMatch,
  undoSwipeDecision,
  sendMatchMessageRecord,
  markConversationAsRead,
  blockTargetUser,
  unblockTargetUser,
  submitModerationReport,
  submitSupportTicketRecord,
  createMuralPostRecord,
  toggleMuralPostLikeRecord,
  addMuralCommentRecord,
  fetchMuralComments,
  deleteMuralPostRecord,
  markNotificationReadRecord,
  markAllNotificationsReadRecord,
  recordProfileViewNotification,
  recordVideoCallEvent,
  deleteUserFirestoreData,
  fetchAdminDashboardData,
  adminToggleUserStatus,
  adminDeleteUserRecord,
  adminUpdateReportStatus,
  adminResolveSupportTicket,
  adminSaveAdminProfile,
  mapDocToProfile,
  timestampToIso,
} from '../services/firestoreService';
import { doesInterestMatchGender, formatLocalizedDateTime, formatLocalizedTime } from '../utils/localization';
import { detectBrowserLanguage, getTranslations, TranslationStrings } from '../i18n/translations';
import { matchesMultilingualQuery, parseQueryToFilters } from '../data/seoKeywords';
import {
  BrowserNotifPermission,
  getBrowserNotificationPermission,
  isBrowserNotificationEnabled,
  requestBrowserNotificationPermission,
  setBrowserNotificationEnabledPref,
  showNativeBrowserNotification,
} from '../utils/browserNotifications';

export interface OnboardingDraft {
  nome: string;
  idade: number;
  email: string;
  genero: Genero;
  generoRotulo: string;
  interesseEm: InteresseEm;
  profissao: string;
  bio: string;
  buscando: string;
  endereco: string;
  cidade: string;
  pais: string;
  bandeira: string;
  fotos: string[];
  habitos: string[];
  interesses: string[];
  idiomas: string[];
}

interface AppContextType {
  // Auth & Boot State
  authReady: boolean;
  firebaseUser: User | null;
  emailVerified: boolean;
  needsVerification: boolean;
  needsOnboarding: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isOwnerAdmin: boolean;
  user: UserProfile;
  updateUser: (updated: Partial<UserProfile>) => Promise<void>;

  // Auth Actions
  signInWithGoogle: () => Promise<'signed_in' | 'needs_onboarding'>;
  signUpWithEmailPassword: (email: string, password: string, draft: OnboardingDraft) => Promise<'needs_verification' | 'completed'>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshVerificationStatus: () => Promise<boolean>;
  completeOnboardingProfile: (draft: OnboardingDraft) => Promise<void>;
  logoutUser: () => Promise<void>;
  deleteMyAccount: () => Promise<void>;

  // Localization
  currentLang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  t: TranslationStrings;

  // Discovery & Matching
  profiles: Profile[];
  filteredProfiles: Profile[];
  profilesLoading: boolean;
  currentIndex: number;
  currentProfile: Profile | null;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  likeProfile: (profile: Profile, superlike?: boolean) => Promise<boolean>;
  passProfile: (profile: Profile) => Promise<void>;
  rewindAction: () => Promise<void>;
  incomingLikes: IncomingLikeItem[];
  matches: MatchItem[];
  messages: Record<string, ChatMessage[]>;
  activeChatMatchId: string | null;
  setActiveChatMatchId: (matchId: string | null) => void;
  sendMessage: (matchId: string, texto: string) => Promise<void>;
  sendMediaMessage: (matchId: string, params: {
    tipo: 'imagem' | 'video' | 'audio';
    midiaUrl: string;
    texto?: string;
    duracaoAudio?: string;
  }) => Promise<void>;
  markMatchAsRead: (matchId: string) => Promise<void>;

  // Mural
  muralPosts: MuralPost[];
  muralComments: Record<string, MuralComment[]>;
  loadMuralComments: (postId: string) => Promise<void>;
  toggleLikePost: (postId: string) => Promise<void>;
  addMuralPost: (texto: string, fotoUrl?: string) => Promise<void>;
  addMuralComment: (postId: string, texto: string) => Promise<void>;
  deleteMuralPost: (postId: string) => Promise<void>;

  // Safety, Blocking, Reporting, Notifications, Support
  blockedUsers: BlockRecord[];
  blockedUidSet: Set<string>;
  blockUser: (targetUid: string, reason?: string) => Promise<void>;
  unblockUser: (targetUid: string) => Promise<void>;
  reportUser: (targetUid: string, category: ReportCategory, description: string) => Promise<void>;
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationRead: (notifId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  recordProfileView: (target: Profile) => Promise<void>;
  browserNotifPermission: BrowserNotifPermission;
  browserNotifEnabled: boolean;
  enableBrowserNotifications: () => Promise<BrowserNotifPermission>;
  toggleBrowserNotifications: (enabled: boolean) => Promise<void>;
  submitSupportTicket: (params: { nome: string; email: string; assunto: string; mensagem: string }) => Promise<string>;

  // Modals, Video, Routing & Toasts
  newMatchModal: Profile | null;
  closeMatchModal: () => void;
  activeVideoCall: Profile | null;
  startVideoCall: (profile: Profile) => Promise<void>;
  endVideoCall: () => void;
  getMutualAffinities: (target: Profile) => {
    interests: string[];
    habits: string[];
    count: number;
  };
  currentRoute: string;
  navigate: (path: string) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  // Compatibility flag (GlobalLove.com is 100% Free)
  isPremium: boolean;

  // Admin & Moderation State
  adminProfile: AdminProfile;
  updateAdminProfile: (updated: Partial<AdminProfile>) => Promise<void>;
  adminLoading: boolean;
  refreshAdminData: () => Promise<void>;
  eventsFeed: AnalyticsEvent[];
  registeredUsersList: RegisteredUserRecord[];
  adminReports: ReportRecord[];
  adminTickets: SupportTicket[];
  adminAuditLogs: AdminAuditLog[];
  toggleUserStatus: (userId: string) => Promise<void>;
  deleteRegisteredUser: (userId: string) => Promise<void>;
  updateReportStatus: (reportId: string, status: 'reviewing' | 'resolved' | 'dismissed') => Promise<void>;
  resolveSupportTicket: (ticketId: string) => Promise<void>;
  activeOnlineUsersCount: number;
  totalMatchesCount: number;
  totalVideoCallsCount: number;
}

const DEFAULT_EMPTY_USER: UserProfile = {
  id: '',
  nome: '',
  idade: 18,
  email: '',
  cidade: '',
  pais: 'Brasil',
  bandeira: '🇧🇷',
  endereco: '',
  distanciaKm: 0,
  profissao: '',
  bio: '',
  interesses: [],
  habitos: [],
  fotos: [],
  idiomas: ['Português'],
  genero: 'mulher_cis',
  generoRotulo: 'Mulher Cisgênero',
  interesseEm: 'todos',
  latitude: -23.5,
  longitude: -46.6,
  buscando: '',
  online: true,
  onboardingConcluido: false,
  isPremium: true,
  verificado: false,
  emailVerified: false,
  privacy: {
    hideAddress: true,
    showOnlineStatus: true,
    showLocationOnMap: true,
  },
};

const INITIAL_ADMIN_PROFILE: AdminProfile = {
  id: 'adm_master',
  nome: 'Joeliton Administrador',
  email: BOOTSTRAPPED_SUPERADMIN_EMAIL,
  cargo: 'Fundador & Diretor Geral',
  fotoUrl: '/icons/icon-192.webp',
  nivelAcesso: 'SuperAdmin',
  criadoEm: '2026',
  ativo: true,
};

const AppContext = createContext<AppContextType | null>(null);

const PENDING_DRAFT_PREFIX = 'globallove_pending_draft_';

function savePendingDraft(uid: string, draft: OnboardingDraft) {
  try {
    sessionStorage.setItem(`${PENDING_DRAFT_PREFIX}${uid}`, JSON.stringify(draft));
  } catch {
    // ignore storage quota errors
  }
}

function loadPendingDraft(uid: string): OnboardingDraft | null {
  try {
    const raw = sessionStorage.getItem(`${PENDING_DRAFT_PREFIX}${uid}`);
    return raw ? (JSON.parse(raw) as OnboardingDraft) : null;
  } catch {
    return null;
  }
}

function clearPendingDraft(uid: string) {
  try {
    sessionStorage.removeItem(`${PENDING_DRAFT_PREFIX}${uid}`);
  } catch {
    // ignore
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state & route language sync
  const [currentLang, setCurrentLangState] = useState<SupportedLang>(() => detectBrowserLanguage());

  const setLang = useCallback((lang: SupportedLang) => {
    setCurrentLangState(lang);
    try {
      localStorage.setItem('globallove_lang', lang);
    } catch {
      // ignore
    }
  }, []);

  const t = useMemo(() => getTranslations(currentLang), [currentLang]);

  // 2. React Router navigation & route location sync
  const routerNavigate = useNavigate();
  const location = useLocation();
  const currentRoute = useMemo(
    () => (location.pathname || '/') + (location.search || ''),
    [location.pathname, location.search]
  );

  const navigate = useCallback(
    (path: string) => {
      const clean = path.startsWith('/') ? path : `/${path}`;
      const fullNow = (location.pathname || '/') + (location.search || '');
      if (fullNow !== clean) {
        routerNavigate(clean);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [location.pathname, location.search, routerNavigate]
  );

  // Auto-sync language & URL filter parameters from React Router location
  useEffect(() => {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    const params = new URLSearchParams(location.search || '');

    const queryLang = params.get('lang') as SupportedLang | null;
    const validLangs: SupportedLang[] = ['pt', 'en', 'es', 'fr', 'de', 'it', 'ja', 'zh'];
    const routeLangMap: Record<string, SupportedLang> = {
      '/en/dating': 'en',
      '/es/citas': 'es',
      '/fr/rencontre': 'fr',
      '/de/dating': 'de',
      '/it/incontri': 'it',
      '/ja/deai': 'ja',
    };
    const mappedLang =
      (queryLang && validLangs.includes(queryLang) ? queryLang : undefined) || routeLangMap[path];
    if (mappedLang && mappedLang !== currentLang) {
      setCurrentLangState(mappedLang);
    }

    const qText = params.get('q') || '';
    const qCountry = params.get('pais') || '';
    const qCity = params.get('cidade') || '';
    if (qText || qCountry || qCity) {
      const parsed = qText ? parseQueryToFilters(qText) : {};
      setFilters((prev) => ({
        ...prev,
        ...parsed,
        ...(qCountry ? { pais: qCountry } : {}),
        ...(qCity ? { cidade: qCity } : {}),
      }));
    }
  }, [location.pathname, location.search, currentLang]);

  // 3. Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'info') => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-3), { id, type, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 4500);
    },
    []
  );

  // 4. Firebase Auth state
  const [authReady, setAuthReady] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [user, setUser] = useState<UserProfile>(DEFAULT_EMPTY_USER);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadAuthenticatedUserDocs = useCallback(async (fbUser: User) => {
    if (!fbUser.emailVerified) {
      setUser({
        ...DEFAULT_EMPTY_USER,
        id: fbUser.uid,
        email: fbUser.email || '',
        nome: fbUser.displayName || '',
        emailVerified: false,
      });
      setNeedsOnboarding(false);
      setIsAdmin(false);
      return;
    }

    const uid = fbUser.uid;
    try {
      const [profileSnap, privateSnap, adminSnap] = await Promise.all([
        getDoc(doc(db, 'profiles', uid)),
        getDoc(doc(db, 'users_private', uid)),
        getDoc(doc(db, 'admins', uid)),
      ]);

      const isBootstrappedAdmin =
        (fbUser.email || '').toLowerCase() === BOOTSTRAPPED_SUPERADMIN_EMAIL.toLowerCase();
      const hasActiveAdminDoc = adminSnap.exists() && adminSnap.data().ativo === true;
      setIsAdmin(fbUser.emailVerified && (isBootstrappedAdmin || hasActiveAdminDoc));

      if (adminSnap.exists()) {
        const aData = adminSnap.data();
        setAdminProfile({
          id: uid,
          nome: String(aData.nome || INITIAL_ADMIN_PROFILE.nome),
          email: String(aData.email || fbUser.email || BOOTSTRAPPED_SUPERADMIN_EMAIL),
          cargo: String(aData.cargo || INITIAL_ADMIN_PROFILE.cargo),
          fotoUrl: String(aData.fotoUrl || INITIAL_ADMIN_PROFILE.fotoUrl),
          nivelAcesso: aData.nivelAcesso === 'Moderador' ? 'Moderador' : 'SuperAdmin',
          criadoEm: formatLocalizedDateTime(timestampToIso(aData.createdAt), currentLang),
          ativo: Boolean(aData.ativo),
        });
      }

      if (profileSnap.exists()) {
        const pData = profileSnap.data();
        const privData = privateSnap.exists() ? privateSnap.data() : {};
        const mapped = mapDocToProfile(uid, pData, undefined, undefined, currentLang);
        setUser({
          ...mapped,
          email: String(privData.email || fbUser.email || ''),
          endereco: String(privData.endereco || ''),
          onboardingConcluido: true,
          isPremium: true,
          verificado: fbUser.emailVerified,
          emailVerified: fbUser.emailVerified,
          privacy: {
            hideAddress: privData.privacyHideAddress !== false,
            showOnlineStatus: privData.privacyShowOnlineStatus !== false,
            showLocationOnMap: privData.privacyShowLocationOnMap !== false,
          },
        });
        setNeedsOnboarding(false);
        clearPendingDraft(uid);
      } else {
        // Check if there's an unsubmitted pending onboarding draft from email verification flow
        const pending = loadPendingDraft(uid);
        if (pending && fbUser.emailVerified) {
          await createCompleteUserProfile({
            ...pending,
            uid,
            email: fbUser.email || pending.email,
            emailVerified: true,
          });
          clearPendingDraft(uid);
          const createdSnap = await getDoc(doc(db, 'profiles', uid));
          if (createdSnap.exists()) {
            const mapped = mapDocToProfile(uid, createdSnap.data(), undefined, undefined, currentLang);
            setUser({
              ...mapped,
              email: fbUser.email || pending.email,
              endereco: pending.endereco,
              onboardingConcluido: true,
              isPremium: true,
              verificado: true,
              emailVerified: true,
              privacy: { hideAddress: true, showOnlineStatus: true, showLocationOnMap: true },
            });
            setNeedsOnboarding(false);
            return;
          }
        }

        setUser({
          ...DEFAULT_EMPTY_USER,
          id: uid,
          email: fbUser.email || '',
          nome: fbUser.displayName || '',
          fotos: fbUser.photoURL ? [fbUser.photoURL] : [],
          emailVerified: fbUser.emailVerified,
          onboardingConcluido: false,
        });
        setNeedsOnboarding(true);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `profiles/${uid}`);
    }
  }, [currentLang]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      setEmailVerified(Boolean(fbUser?.emailVerified));
      if (fbUser) {
        try {
          await loadAuthenticatedUserDocs(fbUser);
        } catch {
          // handleFirestoreError already logs structured context
        }
      } else {
        setUser(DEFAULT_EMPTY_USER);
        setNeedsOnboarding(false);
        setIsAdmin(false);
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, [loadAuthenticatedUserDocs]);

  const needsVerification = Boolean(firebaseUser && !emailVerified);
  const isLoggedIn = Boolean(firebaseUser && emailVerified && user.onboardingConcluido);
  const isOwnerAdmin = Boolean(
    isAdmin &&
      firebaseUser?.emailVerified &&
      (firebaseUser.email || '').toLowerCase() === BOOTSTRAPPED_SUPERADMIN_EMAIL.toLowerCase()
  );

  // 5. Real-time data state (Firestore-backed)
  const [rawProfiles, setRawProfiles] = useState<Profile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [passedIds, setPassedIds] = useState<string[]>([]);
  const [lastSwiped, setLastSwiped] = useState<{ profile: Profile; decision: 'like' | 'superlike' | 'pass' } | null>(null);
  const [incomingRawLikes, setIncomingRawLikes] = useState<{ id: string; fromUid: string; type: 'like' | 'superlike'; createdAt: string }[]>([]);
  const [outgoingBlocks, setOutgoingBlocks] = useState<BlockRecord[]>([]);
  const [incomingBlockUids, setIncomingBlockUids] = useState<string[]>([]);
  const [rawMatches, setRawMatches] = useState<{
    id: string;
    userA: string;
    userB: string;
    otherUid: string;
    createdAt: string;
    lastMessage: string;
    lastMessageAtIso: string;
    lastSenderId: string;
    unreadCount: number;
    status: 'active' | 'blocked';
    blockedBy: string;
  }[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [activeChatMatchId, setActiveChatMatchId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [browserNotifPermission, setBrowserNotifPermission] = useState<BrowserNotifPermission>(() =>
    getBrowserNotificationPermission()
  );
  const [browserNotifEnabled, setBrowserNotifEnabled] = useState<boolean>(() =>
    isBrowserNotificationEnabled()
  );
  const seenNotifIdsRef = useRef<Set<string>>(new Set());
  const notifBootstrappedRef = useRef<boolean>(false);
  const [muralPosts, setMuralPosts] = useState<MuralPost[]>([]);
  const [muralComments, setMuralComments] = useState<Record<string, MuralComment[]>>({});

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'GL_NAVIGATE' && typeof event.data.link === 'string') {
        navigate(event.data.link);
      }
    };
    navigator.serviceWorker.addEventListener('message', handler);
    return () => navigator.serviceWorker.removeEventListener('message', handler);
  }, [navigate]);

  // Auth Actions
  const signInWithGoogle = useCallback(async (): Promise<'signed_in' | 'needs_onboarding'> => {
    const cred = await signInWithPopup(auth, googleProvider);
    setEmailVerified(cred.user.emailVerified);
    await loadAuthenticatedUserDocs(cred.user);
    const snap = await getDoc(doc(db, 'profiles', cred.user.uid));
    if (snap.exists()) {
      navigate('/descobrir');
      return 'signed_in';
    }
    return 'needs_onboarding';
  }, [loadAuthenticatedUserDocs, navigate]);

  const signUpWithEmailPassword = useCallback(
    async (
      email: string,
      password: string,
      draft: OnboardingDraft
    ): Promise<'needs_verification' | 'completed'> => {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      savePendingDraft(cred.user.uid, draft);
      await sendEmailVerification(cred.user);
      setFirebaseUser(cred.user);
      setEmailVerified(cred.user.emailVerified);
      if (cred.user.emailVerified) {
        await createCompleteUserProfile({
          ...draft,
          uid: cred.user.uid,
          email: cred.user.email || email.trim(),
          emailVerified: true,
        });
        clearPendingDraft(cred.user.uid);
        await loadAuthenticatedUserDocs(cred.user);
        navigate('/descobrir');
        return 'completed';
      }
      return 'needs_verification';
    },
    [loadAuthenticatedUserDocs, navigate]
  );

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      await cred.user.reload();
      setEmailVerified(cred.user.emailVerified);
      await loadAuthenticatedUserDocs(cred.user);
      if (cred.user.emailVerified) {
        const snap = await getDoc(doc(db, 'profiles', cred.user.uid));
        if (snap.exists()) {
          navigate('/descobrir');
        }
      }
    },
    [loadAuthenticatedUserDocs, navigate]
  );

  const sendPasswordReset = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  }, []);

  const resendVerificationEmail = useCallback(async () => {
    if (!auth.currentUser) throw new Error('Faça login primeiro.');
    await sendEmailVerification(auth.currentUser);
  }, []);

  const refreshVerificationStatus = useCallback(async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    await auth.currentUser.reload();
    await auth.currentUser.getIdToken(true);
    const verified = auth.currentUser.emailVerified;
    setEmailVerified(verified);
    setFirebaseUser(auth.currentUser);
    if (verified) {
      await loadAuthenticatedUserDocs(auth.currentUser);
    }
    return verified;
  }, [loadAuthenticatedUserDocs]);

  const completeOnboardingProfile = useCallback(
    async (draft: OnboardingDraft) => {
      const current = auth.currentUser;
      if (!current) throw new Error('Sessão expirada. Entre novamente.');
      if (!current.emailVerified) {
        savePendingDraft(current.uid, draft);
        throw new Error('Verifique seu e-mail antes de ativar o perfil.');
      }
      await createCompleteUserProfile({
        ...draft,
        uid: current.uid,
        email: current.email || draft.email,
        emailVerified: true,
      });
      clearPendingDraft(current.uid);
      await loadAuthenticatedUserDocs(current);
      showToast(t.auth.success, 'success');
      navigate('/descobrir');
    },
    [loadAuthenticatedUserDocs, navigate, showToast, t.auth.success]
  );

  const logoutUser = useCallback(async () => {
    await signOut(auth);
    setRawProfiles([]);
    setLikedIds([]);
    setPassedIds([]);
    setRawMatches([]);
    setMessages({});
    setNotifications([]);
    setMuralPosts([]);
    setOutgoingBlocks([]);
    setIncomingBlockUids([]);
    navigate('/');
  }, [navigate]);

  const deleteMyAccount = useCallback(async () => {
    const current = auth.currentUser;
    if (!current) return;
    await deleteUserFirestoreData(current.uid);
    try {
      await deleteUser(current);
    } catch {
      // If Firebase requires recent login, sign out cleanly after wiping Firestore PII & profile
      await signOut(auth);
    }
    showToast('Sua conta e dados pessoais foram removidos conforme a LGPD.', 'success');
    navigate('/');
  }, [navigate, showToast]);

  const updateUser = useCallback(
    async (updated: Partial<UserProfile>) => {
      if (!firebaseUser || !emailVerified) return;
      await updateUserAndPrivacyProfile(firebaseUser.uid, user, updated);
      setUser((prev) => ({
        ...prev,
        ...updated,
        privacy: updated.privacy ? { ...prev.privacy, ...updated.privacy } as UserProfile['privacy'] : prev.privacy,
      }));
    },
    [firebaseUser, emailVerified, user]
  );

  // Attach authenticated real-time listeners strictly after authReady + emailVerified
  useEffect(() => {
    if (!authReady || !firebaseUser || !emailVerified) {
      setRawProfiles([]);
      setLikedIds([]);
      setPassedIds([]);
      setIncomingRawLikes([]);
      setOutgoingBlocks([]);
      setIncomingBlockUids([]);
      setRawMatches([]);
      setNotifications([]);
      setMuralPosts([]);
      return;
    }

    const uid = firebaseUser.uid;
    setProfilesLoading(true);

    // 1. Discovery Profiles
    const profilesQ = query(collection(db, 'profiles'), where('status', '==', 'ativo'), limit(80));
    const unsubProfiles = onSnapshot(
      profilesQ,
      (snap) => {
        const list = snap.docs
          .filter((d) => d.id !== uid)
          .map((d) =>
            mapDocToProfile(
              d.id,
              d.data(),
              user.latitude || undefined,
              user.longitude || undefined,
              currentLang
            )
          );
        setRawProfiles(list);
        setProfilesLoading(false);
      },
      (err) => {
        setProfilesLoading(false);
        handleFirestoreError(err, OperationType.LIST, 'profiles');
      }
    );

    // 2. My Outgoing Likes & Passes
    const likesSentQ = query(collection(db, 'likes'), where('fromUid', '==', uid), limit(150));
    const unsubLikesSent = onSnapshot(
      likesSentQ,
      (snap) => {
        const likes: string[] = [];
        const passes: string[] = [];
        snap.docs.forEach((d) => {
          const data = d.data();
          const toUid = String(data.toUid || '');
          if (data.type === 'pass') passes.push(toUid);
          else if (data.type === 'like' || data.type === 'superlike') likes.push(toUid);
        });
        setLikedIds(likes);
        setPassedIds(passes);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'likes')
    );

    // 3. Incoming Likes
    const likesRecvQ = query(
      collection(db, 'likes'),
      where('toUid', '==', uid),
      where('type', 'in', ['like', 'superlike']),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const unsubLikesRecv = onSnapshot(
      likesRecvQ,
      (snap) => {
        setIncomingRawLikes(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              fromUid: String(data.fromUid || ''),
              type: data.type === 'superlike' ? 'superlike' : 'like',
              createdAt: formatLocalizedDateTime(timestampToIso(data.createdAt), currentLang),
            };
          })
        );
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'likes')
    );

    // 4. Blocks (both directions)
    const blocksOutQ = query(collection(db, 'blocks'), where('blockerUid', '==', uid), limit(100));
    const unsubBlocksOut = onSnapshot(
      blocksOutQ,
      (snap) => {
        setOutgoingBlocks(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              blockerUid: String(data.blockerUid || ''),
              blockedUid: String(data.blockedUid || ''),
              reason: String(data.reason || ''),
              createdAt: formatLocalizedDateTime(timestampToIso(data.createdAt), currentLang),
            };
          })
        );
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'blocks')
    );

    const blocksInQ = query(collection(db, 'blocks'), where('blockedUid', '==', uid), limit(100));
    const unsubBlocksIn = onSnapshot(
      blocksInQ,
      (snap) => {
        setIncomingBlockUids(snap.docs.map((d) => String(d.data().blockerUid || '')));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'blocks')
    );

    // 5. Mutual Matches
    const matchesQ = query(
      collection(db, 'matches'),
      where('participants', 'array-contains', uid),
      orderBy('lastMessageAt', 'desc'),
      limit(50)
    );
    const unsubMatches = onSnapshot(
      matchesQ,
      (snap) => {
        setRawMatches(
          snap.docs.map((d) => {
            const data = d.data();
            const userA = String(data.userA || '');
            const userB = String(data.userB || '');
            const isA = userA === uid;
            const otherUid = isA ? userB : userA;
            const iso = timestampToIso(data.lastMessageAt || data.createdAt);
            return {
              id: d.id,
              userA,
              userB,
              otherUid,
              createdAt: formatLocalizedDateTime(iso, currentLang),
              lastMessage: String(data.lastMessage || ''),
              lastMessageAtIso: iso,
              lastSenderId: String(data.lastSenderId || ''),
              unreadCount: isA ? Number(data.unreadA || 0) : Number(data.unreadB || 0),
              status: data.status === 'blocked' ? 'blocked' : 'active',
              blockedBy: String(data.blockedBy || ''),
            };
          })
        );
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'matches')
    );

    // 6. Notifications (in-app real-time stream + native Chrome/Android browser notifications)
    seenNotifIdsRef.current.clear();
    notifBootstrappedRef.current = false;
    const notifsQ = query(
      collection(db, 'notifications'),
      where('recipientId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(30)
    );
    const unsubNotifs = onSnapshot(
      notifsQ,
      (snap) => {
        const mapped = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            recipientId: String(data.recipientId || ''),
            senderId: String(data.senderId || ''),
            type: (data.type as AppNotification['type']) || 'system',
            title: String(data.title || ''),
            body: String(data.body || ''),
            link: String(data.link || '/'),
            read: Boolean(data.read),
            createdAt: formatLocalizedDateTime(timestampToIso(data.createdAt), currentLang),
          };
        });

        if (!notifBootstrappedRef.current) {
          mapped.forEach((n) => seenNotifIdsRef.current.add(n.id));
          notifBootstrappedRef.current = true;
        } else {
          mapped.forEach((n) => {
            if (!seenNotifIdsRef.current.has(n.id)) {
              seenNotifIdsRef.current.add(n.id);
              if (!n.read) {
                showToast(`${n.title}`, 'info');
                void showNativeBrowserNotification({
                  title: n.title,
                  body: n.body,
                  link: n.link,
                  tag: `gl_notif_${n.id}`,
                  onNavigate: navigate,
                });
              }
            }
          });
        }

        setNotifications(mapped);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'notifications')
    );

    // 7. Mural Posts
    const muralQ = query(
      collection(db, 'mural_posts'),
      where('visibilidade', '==', 'public'),
      orderBy('createdAt', 'desc'),
      limit(30)
    );
    const unsubMural = onSnapshot(
      muralQ,
      async (snap) => {
        const posts = await Promise.all(
          snap.docs.map(async (d) => {
            const data = d.data();
            let liked = false;
            try {
              const likeSnap = await getDoc(doc(db, 'mural_posts', d.id, 'post_likes', uid));
              liked = likeSnap.exists();
            } catch {
              liked = false;
            }
            return {
              id: d.id,
              autorId: String(data.autorId || ''),
              autorNome: String(data.autorNome || 'Membro'),
              autorFoto: String(data.autorFoto || '/icons/icon-192.webp'),
              autorCidade: String(data.autorCidade || ''),
              autorPais: String(data.autorPais || ''),
              autorBandeira: String(data.autorBandeira || '🌍'),
              texto: String(data.texto || ''),
              fotoUrl: data.fotoUrl ? String(data.fotoUrl) : undefined,
              curtidas: Number(data.curtidasCount || 0),
              curtidoPeloUsuario: liked,
              comentariosCount: Number(data.comentariosCount || 0),
              visibilidade: (data.visibilidade as 'public' | 'hidden') || 'public',
              createdAt: formatLocalizedDateTime(timestampToIso(data.createdAt), currentLang),
            };
          })
        );
        setMuralPosts(posts);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'mural_posts')
    );

    return () => {
      unsubProfiles();
      unsubLikesSent();
      unsubLikesRecv();
      unsubBlocksOut();
      unsubBlocksIn();
      unsubMatches();
      unsubNotifs();
      unsubMural();
    };
  }, [authReady, firebaseUser, emailVerified, user.latitude, user.longitude, currentLang]);

  // Real-time chat messages stream for active match
  useEffect(() => {
    if (!authReady || !firebaseUser || !emailVerified || !activeChatMatchId) return;
    const msgQ = query(
      collection(db, 'matches', activeChatMatchId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(120)
    );
    const unsub = onSnapshot(
      msgQ,
      (snap) => {
        const list: ChatMessage[] = snap.docs.map((d) => {
          const data = d.data();
          const iso = timestampToIso(data.createdAt);
          return {
            id: d.id,
            matchId: activeChatMatchId,
            autorId: String(data.senderId || ''),
            senderId: String(data.senderId || ''),
            recipientId: String(data.recipientId || ''),
            tipo: (data.tipo as ChatMessage['tipo']) || 'texto',
            texto: String(data.texto || ''),
            midiaUrl: data.midiaUrl ? String(data.midiaUrl) : undefined,
            duracaoAudio: data.duracaoAudio ? String(data.duracaoAudio) : undefined,
            hora: formatLocalizedTime(iso, currentLang),
            createdAtIso: iso,
            lida: Boolean(data.lida),
          };
        });
        setMessages((prev) => ({ ...prev, [activeChatMatchId]: list }));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, `matches/${activeChatMatchId}/messages`)
    );
    return () => unsub();
  }, [authReady, firebaseUser, emailVerified, activeChatMatchId, currentLang]);

  // Blocked UID set (both directions)
  const blockedUidSet = useMemo(() => {
    const s = new Set<string>();
    outgoingBlocks.forEach((b) => s.add(b.blockedUid));
    incomingBlockUids.forEach((uid) => s.add(uid));
    return s;
  }, [outgoingBlocks, incomingBlockUids]);

  const profilesById = useMemo(() => {
    const m = new Map<string, Profile>();
    rawProfiles.forEach((p) => m.set(p.id, p));
    return m;
  }, [rawProfiles]);

  const hydratedBlockedUsers = useMemo<BlockRecord[]>(() => {
    return outgoingBlocks.map((b) => {
      const p = profilesById.get(b.blockedUid);
      return {
        ...b,
        blockedName: p?.nome || b.blockedUid.slice(0, 10),
        blockedPhoto: p?.fotos[0] || '/icons/icon-192.webp',
        blockedCountry: p ? `${p.cidade}, ${p.pais}` : undefined,
      };
    });
  }, [outgoingBlocks, profilesById]);

  const matches = useMemo<MatchItem[]>(() => {
    return rawMatches
      .filter((rm) => !blockedUidSet.has(rm.otherUid) && rm.status !== 'blocked')
      .map((rm) => {
        const other = profilesById.get(rm.otherUid) || {
          id: rm.otherUid,
          nome: 'Membro GlobalLove',
          idade: 18,
          cidade: '',
          pais: '',
          bandeira: '🌍',
          distanciaKm: 0,
          profissao: '',
          bio: '',
          interesses: [],
          habitos: [],
          fotos: ['/icons/icon-192.webp'],
          idiomas: [],
          genero: 'outro' as Genero,
          interesseEm: 'todos' as InteresseEm,
          latitude: 0,
          longitude: 0,
          buscando: '',
        };
        return {
          id: rm.id,
          userA: rm.userA,
          userB: rm.userB,
          profile: other,
          createdAt: rm.createdAt,
          lastMessage: rm.lastMessage,
          lastMessageAtIso: rm.lastMessageAtIso,
          lastSenderId: rm.lastSenderId,
          unreadCount: rm.unreadCount,
          status: rm.status,
          blockedBy: rm.blockedBy,
        };
      });
  }, [rawMatches, profilesById, blockedUidSet]);

  const incomingLikes = useMemo<IncomingLikeItem[]>(() => {
    const matchedUids = new Set(rawMatches.map((m) => m.otherUid));
    return incomingRawLikes
      .filter((item) => !blockedUidSet.has(item.fromUid) && !matchedUids.has(item.fromUid))
      .map((item) => ({
        ...item,
        profile: profilesById.get(item.fromUid) || null,
      }))
      .filter((item) => item.profile !== null);
  }, [incomingRawLikes, rawMatches, profilesById, blockedUidSet]);

  const visibleMuralPosts = useMemo(
    () => muralPosts.filter((p) => !blockedUidSet.has(p.autorId)),
    [muralPosts, blockedUidSet]
  );

  // Profiles visible across Discovery & Map (excludes blocked & suspended)
  const profiles = useMemo(
    () => rawProfiles.filter((p) => !blockedUidSet.has(p.id) && p.status !== 'suspenso'),
    [rawProfiles, blockedUidSet]
  );

  // Discovery Filters (now enforces ALL active filters: country, city, age, distance, verified, gender, interestEm, habits, interests, online)
  const [filters, setFilters] = useState<FilterState>({
    pais: 'Todos',
    cidade: '',
    busca: '',
    idadeMin: 18,
    idadeMax: 75,
    distanciaMax: 20000,
    interesses: [],
    habitos: [],
    apenasVerificados: false,
    genero: 'todos',
    apenasOnline: false,
  });

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      if (likedIds.includes(p.id) || passedIds.includes(p.id)) return false;
      if (filters.pais !== 'Todos' && p.pais.toLowerCase() !== filters.pais.toLowerCase()) return false;
      if (filters.cidade && filters.cidade.trim()) {
        if (!p.cidade.toLowerCase().includes(filters.cidade.trim().toLowerCase())) return false;
      }
      if (filters.busca && filters.busca.trim() && !matchesMultilingualQuery(p, filters.busca)) {
        return false;
      }
      if (p.idade < filters.idadeMin || p.idade > filters.idadeMax) return false;
      if (filters.apenasOnline && !p.online) return false;
      if (filters.apenasVerificados && !p.emailVerified) return false;
      if (filters.distanciaMax < 20000 && p.distanciaConhecida && p.distanciaKm > filters.distanciaMax) {
        return false;
      }
      if (filters.genero && filters.genero !== 'todos') {
        if (p.genero !== filters.genero) return false;
      } else if (user.interesseEm && user.interesseEm !== 'todos') {
        if (!doesInterestMatchGender(user.interesseEm, p.genero)) return false;
      }
      if (filters.habitos && filters.habitos.length > 0) {
        const pHabits = p.habitos || [];
        if (!pHabits.some((h) => filters.habitos?.includes(h))) return false;
      }
      if (filters.interesses.length > 0) {
        if (!p.interesses.some((i) => filters.interesses.includes(i))) return false;
      }
      return true;
    });
  }, [profiles, likedIds, passedIds, filters, user.interesseEm]);

  const currentIndex = 0;
  const currentProfile = filteredProfiles[0] || null;

  // Mutual Affinities helper
  const getMutualAffinities = useCallback(
    (target: Profile) => {
      const targetInterests = target.interesses || [];
      const targetHabits = target.habitos || [];
      const commonInterests = (user.interesses || []).filter((i) =>
        targetInterests.some((ti) => ti.toLowerCase() === i.toLowerCase())
      );
      const commonHabits = (user.habitos || []).filter((h) => targetHabits.includes(h));
      return {
        interests: commonInterests,
        habits: commonHabits,
        count: commonInterests.length + commonHabits.length,
      };
    },
    [user.interesses, user.habitos]
  );

  // Celebrations & Video Call
  const [newMatchModal, setNewMatchModal] = useState<Profile | null>(null);
  const closeMatchModal = useCallback(() => setNewMatchModal(null), []);
  const [activeVideoCall, setActiveVideoCall] = useState<Profile | null>(null);
  const [sessionVideoCalls, setSessionVideoCalls] = useState(0);

  const startVideoCall = useCallback(
    async (profile: Profile) => {
      setActiveVideoCall(profile);
      setSessionVideoCalls((c) => c + 1);
      if (user.id) {
        await recordVideoCallEvent(user, profile);
      }
    },
    [user]
  );

  const endVideoCall = useCallback(() => {
    setActiveVideoCall(null);
  }, []);

  // Discovery Actions
  const likeProfile = useCallback(
    async (profile: Profile, superlike = false): Promise<boolean> => {
      if (!user.id) return false;
      const decision = superlike ? 'superlike' : 'like';
      setLastSwiped({ profile, decision });
      try {
        const { isMutualMatch } = await recordSwipeAndCheckMutualMatch(user, profile, decision);
        if (isMutualMatch) {
          setNewMatchModal(profile);
          confetti({ particleCount: 110, spread: 85, origin: { y: 0.55 } });
        }
        return isMutualMatch;
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Erro ao registrar curtida.', 'error');
        return false;
      }
    },
    [user, showToast]
  );

  const passProfile = useCallback(
    async (profile: Profile) => {
      if (!user.id) return;
      setLastSwiped({ profile, decision: 'pass' });
      try {
        await recordSwipeAndCheckMutualMatch(user, profile, 'pass');
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Erro ao pular perfil.', 'error');
      }
    },
    [user, showToast]
  );

  const rewindAction = useCallback(async () => {
    if (!lastSwiped || !user.id) return;
    try {
      await undoSwipeDecision(user.id, lastSwiped.profile.id);
      setLastSwiped(null);
      showToast('Última ação desfeita.', 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Não foi possível desfazer.', 'error');
    }
  }, [lastSwiped, user.id, showToast]);

  // Messaging Actions
  const sendMessage = useCallback(
    async (matchId: string, texto: string) => {
      const targetMatch = matches.find((m) => m.id === matchId);
      if (!targetMatch || !user.id) return;
      await sendMatchMessageRecord({
        match: targetMatch,
        senderUid: user.id,
        senderNome: user.nome,
        tipo: 'texto',
        texto,
      });
    },
    [matches, user.id, user.nome]
  );

  const sendMediaMessage = useCallback(
    async (
      matchId: string,
      params: { tipo: 'imagem' | 'video' | 'audio'; midiaUrl: string; texto?: string; duracaoAudio?: string }
    ) => {
      const targetMatch = matches.find((m) => m.id === matchId);
      if (!targetMatch || !user.id) return;
      await sendMatchMessageRecord({
        match: targetMatch,
        senderUid: user.id,
        senderNome: user.nome,
        tipo: params.tipo,
        texto: params.texto || '',
        midiaUrl: params.midiaUrl,
        duracaoAudio: params.duracaoAudio,
      });
    },
    [matches, user.id, user.nome]
  );

  const markMatchAsRead = useCallback(
    async (matchId: string) => {
      const targetMatch = matches.find((m) => m.id === matchId);
      if (!targetMatch || !user.id) return;
      const list = messages[matchId] || [];
      await markConversationAsRead(targetMatch, user.id, list);
    },
    [matches, user.id, messages]
  );

  // Mural Actions
  const loadMuralComments = useCallback(
    async (postId: string) => {
      const list = await fetchMuralComments(postId, currentLang);
      setMuralComments((prev) => ({ ...prev, [postId]: list }));
    },
    [currentLang]
  );

  const toggleLikePost = useCallback(
    async (postId: string) => {
      if (!user.id) return;
      const target = muralPosts.find((p) => p.id === postId);
      if (!target) return;
      await toggleMuralPostLikeRecord(
        postId,
        user.id,
        Boolean(target.curtidoPeloUsuario),
        target.curtidas,
        user.nome,
        target.autorId
      );
    },
    [user.id, user.nome, muralPosts]
  );

  const addMuralPost = useCallback(
    async (texto: string, fotoUrl?: string) => {
      if (!user.id) return;
      await createMuralPostRecord(user, texto, fotoUrl);
      showToast('Publicação enviada no Mural Global!', 'success');
    },
    [user, showToast]
  );

  const addMuralComment = useCallback(
    async (postId: string, texto: string) => {
      if (!user.id) return;
      const target = muralPosts.find((p) => p.id === postId);
      await addMuralCommentRecord(
        postId,
        user,
        texto,
        target?.comentariosCount || 0,
        target?.autorId
      );
      await loadMuralComments(postId);
    },
    [user, muralPosts, loadMuralComments]
  );

  const deleteMuralPost = useCallback(
    async (postId: string) => {
      await deleteMuralPostRecord(postId);
      showToast('Publicação excluída.', 'success');
    },
    [showToast]
  );

  // Safety, Blocking, Reporting, Notifications & Support
  const blockUser = useCallback(
    async (targetUid: string, reason = 'Solicitado pelo usuário') => {
      if (!user.id) return;
      await blockTargetUser(user.id, targetUid, reason);
      showToast('Usuário bloqueado com segurança.', 'info');
    },
    [user.id, showToast]
  );

  const unblockUser = useCallback(
    async (targetUid: string) => {
      if (!user.id) return;
      await unblockTargetUser(user.id, targetUid);
      showToast('Usuário desbloqueado.', 'success');
    },
    [user.id, showToast]
  );

  const reportUser = useCallback(
    async (targetUid: string, category: ReportCategory, description: string) => {
      if (!user.id) return;
      await submitModerationReport({
        reporterUid: user.id,
        reportedUid: targetUid,
        category,
        description,
      });
      showToast('Denúncia registrada para análise da moderação.', 'success');
    },
    [user.id, showToast]
  );

  const markNotificationRead = useCallback(async (notifId: string) => {
    await markNotificationReadRecord(notifId);
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    await markAllNotificationsReadRecord(unreadIds);
  }, [notifications]);

  const recordProfileView = useCallback(
    async (target: Profile) => {
      if (!isLoggedIn || !user.id || !target.id || target.id === user.id) return;
      await recordProfileViewNotification(user, target);
    },
    [isLoggedIn, user]
  );

  const enableBrowserNotifications = useCallback(async (): Promise<BrowserNotifPermission> => {
    const perm = await requestBrowserNotificationPermission();
    setBrowserNotifPermission(perm);
    const enabled = perm === 'granted' && isBrowserNotificationEnabled();
    setBrowserNotifEnabled(enabled);
    if (perm === 'granted') {
      showToast('Notificações do navegador/Google ativadas!', 'success');
      void showNativeBrowserNotification({
        title: 'GlobalLove.com — Notificações Ativas 🔔',
        body: 'Você receberá alertas em tempo real sobre visualizações, mensagens, curtidas e matches.',
        link: '/descobrir',
        tag: 'gl_welcome_notif',
        onNavigate: navigate,
      });
    } else if (perm === 'denied') {
      showToast(
        'As notificações estão bloqueadas no navegador. Libere nas permissões do site (cadeado da URL).',
        'error'
      );
    } else if (perm === 'unsupported') {
      showToast('Este navegador não suporta notificações push locais.', 'info');
    }
    return perm;
  }, [navigate, showToast]);

  const toggleBrowserNotifications = useCallback(
    async (enabled: boolean) => {
      if (enabled) {
        if (getBrowserNotificationPermission() !== 'granted') {
          await enableBrowserNotifications();
          return;
        }
        setBrowserNotificationEnabledPref(true);
        setBrowserNotifEnabled(true);
        showToast('Notificações do navegador ativadas.', 'success');
      } else {
        setBrowserNotificationEnabledPref(false);
        setBrowserNotifEnabled(false);
        showToast('Notificações pop-up do navegador pausadas (alertas no sino continuam ativos).', 'info');
      }
    },
    [enableBrowserNotifications, showToast]
  );

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const submitSupportTicket = useCallback(
    async (params: { nome: string; email: string; assunto: string; mensagem: string }) => {
      return await submitSupportTicketRecord({
        uid: firebaseUser?.uid || null,
        ...params,
      });
    },
    [firebaseUser?.uid]
  );

  // Admin & Moderation state
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(INITIAL_ADMIN_PROFILE);
  const [adminLoading, setAdminLoading] = useState(false);
  const [eventsFeed, setEventsFeed] = useState<AnalyticsEvent[]>([]);
  const [registeredUsersList, setRegisteredUsersList] = useState<RegisteredUserRecord[]>([]);
  const [adminReports, setAdminReports] = useState<ReportRecord[]>([]);
  const [adminTickets, setAdminTickets] = useState<SupportTicket[]>([]);
  const [adminAuditLogs, setAdminAuditLogs] = useState<AdminAuditLog[]>([]);
  const [totalMatchesFromAdmin, setTotalMatchesFromAdmin] = useState<number>(0);

  const refreshAdminData = useCallback(async () => {
    if (!isAdmin) return;
    setAdminLoading(true);
    try {
      const data = await fetchAdminDashboardData(currentLang);
      setRegisteredUsersList(data.users);
      setAdminReports(data.reports);
      setAdminTickets(data.tickets);
      setEventsFeed(data.events);
      setAdminAuditLogs(data.auditLogs);
      setTotalMatchesFromAdmin(data.totalMatches);
    } finally {
      setAdminLoading(false);
    }
  }, [isAdmin, currentLang]);

  const updateAdminProfile = useCallback(
    async (updated: Partial<AdminProfile>) => {
      if (!isAdmin || !firebaseUser) return;
      const next = { ...adminProfile, ...updated };
      await adminSaveAdminProfile(
        { uid: firebaseUser.uid, email: firebaseUser.email || BOOTSTRAPPED_SUPERADMIN_EMAIL },
        next
      );
      setAdminProfile(next);
      showToast('Perfil administrativo atualizado e registrado em auditoria.', 'success');
    },
    [isAdmin, firebaseUser, adminProfile, showToast]
  );

  const toggleUserStatus = useCallback(
    async (userId: string) => {
      if (!isAdmin || !firebaseUser) return;
      const target = registeredUsersList.find((u) => u.id === userId);
      if (!target) return;
      const nextStatus: 'ativo' | 'suspenso' = target.status === 'ativo' ? 'suspenso' : 'ativo';
      await adminToggleUserStatus(
        { uid: firebaseUser.uid, email: firebaseUser.email || BOOTSTRAPPED_SUPERADMIN_EMAIL },
        userId,
        nextStatus
      );
      await refreshAdminData();
      showToast(`Usuário ${nextStatus === 'suspenso' ? 'suspenso' : 'reativado'}.`, 'info');
    },
    [isAdmin, firebaseUser, registeredUsersList, refreshAdminData, showToast]
  );

  const deleteRegisteredUser = useCallback(
    async (userId: string) => {
      if (!isAdmin || !firebaseUser) return;
      await adminDeleteUserRecord(
        { uid: firebaseUser.uid, email: firebaseUser.email || BOOTSTRAPPED_SUPERADMIN_EMAIL },
        userId
      );
      await refreshAdminData();
      showToast('Usuário removido da plataforma.', 'success');
    },
    [isAdmin, firebaseUser, refreshAdminData, showToast]
  );

  const updateReportStatus = useCallback(
    async (reportId: string, status: 'reviewing' | 'resolved' | 'dismissed') => {
      if (!isAdmin || !firebaseUser) return;
      await adminUpdateReportStatus(
        { uid: firebaseUser.uid, email: firebaseUser.email || BOOTSTRAPPED_SUPERADMIN_EMAIL },
        reportId,
        status
      );
      await refreshAdminData();
      showToast('Denúncia atualizada com registro de auditoria.', 'success');
    },
    [isAdmin, firebaseUser, refreshAdminData, showToast]
  );

  const resolveSupportTicket = useCallback(
    async (ticketId: string) => {
      if (!isAdmin || !firebaseUser) return;
      await adminResolveSupportTicket(
        { uid: firebaseUser.uid, email: firebaseUser.email || BOOTSTRAPPED_SUPERADMIN_EMAIL },
        ticketId
      );
      await refreshAdminData();
      showToast('Chamado de suporte marcado como resolvido.', 'success');
    },
    [isAdmin, firebaseUser, refreshAdminData, showToast]
  );

  const activeOnlineUsersCount = useMemo(
    () => profiles.filter((p) => p.online).length + (isLoggedIn ? 1 : 0),
    [profiles, isLoggedIn]
  );

  const totalMatchesCount = useMemo(
    () => Math.max(matches.length, totalMatchesFromAdmin),
    [matches.length, totalMatchesFromAdmin]
  );

  const totalVideoCallsCount = useMemo(() => {
    const loggedCalls = eventsFeed.filter((e) => e.tipo === 'video_chamada').length;
    return Math.max(loggedCalls, sessionVideoCalls);
  }, [eventsFeed, sessionVideoCalls]);

  return (
    <AppContext.Provider
      value={{
        authReady,
        firebaseUser,
        emailVerified,
        needsVerification,
        needsOnboarding,
        isLoggedIn,
        isAdmin,
        isOwnerAdmin,
        user,
        updateUser,
        signInWithGoogle,
        signUpWithEmailPassword,
        signInWithEmail,
        sendPasswordReset,
        resendVerificationEmail,
        refreshVerificationStatus,
        completeOnboardingProfile,
        logoutUser,
        deleteMyAccount,
        currentLang,
        setLang,
        t,
        profiles,
        filteredProfiles,
        profilesLoading,
        currentIndex,
        currentProfile,
        filters,
        setFilters,
        likeProfile,
        passProfile,
        rewindAction,
        incomingLikes,
        matches,
        messages,
        activeChatMatchId,
        setActiveChatMatchId,
        sendMessage,
        sendMediaMessage,
        markMatchAsRead,
        muralPosts: visibleMuralPosts,
        muralComments,
        loadMuralComments,
        toggleLikePost,
        addMuralPost,
        addMuralComment,
        deleteMuralPost,
        blockedUsers: hydratedBlockedUsers,
        blockedUidSet,
        blockUser,
        unblockUser,
        reportUser,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        recordProfileView,
        browserNotifPermission,
        browserNotifEnabled,
        enableBrowserNotifications,
        toggleBrowserNotifications,
        submitSupportTicket,
        newMatchModal,
        closeMatchModal,
        activeVideoCall,
        startVideoCall,
        endVideoCall,
        getMutualAffinities,
        currentRoute,
        navigate,
        toasts,
        showToast,
        dismissToast,
        isPremium: true,
        adminProfile,
        updateAdminProfile,
        adminLoading,
        refreshAdminData,
        eventsFeed,
        registeredUsersList,
        adminReports,
        adminTickets,
        adminAuditLogs,
        toggleUserStatus,
        deleteRegisteredUser,
        updateReportStatus,
        resolveSupportTicket,
        activeOnlineUsersCount,
        totalMatchesCount,
        totalVideoCallsCount,
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
