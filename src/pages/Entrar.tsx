import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Mail,
  Lock,
  User,
  Heart,
  MapPin,
  Check,
  Calendar,
  Camera,
  AlertCircle,
  Loader2,
  RefreshCw,
  LogOut,
  KeyRound,
} from 'lucide-react';
import { useApp, OnboardingDraft } from '../context/AppContext';
import { LIFESTYLE_HABITS } from '../data/lifestyleHabits';
import { COUNTRIES } from '../data/countries';
import { compressImageUpload } from '../utils/security';
import { findCountryMeta } from '../utils/localization';
import { Genero, InteresseEm } from '../types';

interface EntrarProps {
  redirectNotice?: string;
}

function mapFirebaseAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code || '';
  if (code.includes('email-already-in-use')) {
    return 'Este e-mail já está cadastrado. Clique em "Entrar" para acessar sua conta.';
  }
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
    return 'E-mail ou senha incorretos. Verifique seus dados ou redefina sua senha.';
  }
  if (code.includes('weak-password')) {
    return 'A senha precisa ter no mínimo 6 caracteres.';
  }
  if (code.includes('invalid-email')) {
    return 'O endereço de e-mail informado é inválido.';
  }
  if (code.includes('operation-not-allowed')) {
    return 'Login por e-mail/senha ainda não ativado no Firebase Auth. Use "Continuar com Google" ou ative o provedor Email/Password no Console Firebase.';
  }
  if (code.includes('unauthorized-domain')) {
    return 'Domínio atual não autorizado no Firebase Authentication. Adicione este domínio em Authentication > Settings > Authorized domains no Console Firebase.';
  }
  if (code.includes('popup-closed-by-user')) {
    return 'Janela de login fechada antes da conclusão.';
  }
  if (code.includes('too-many-requests')) {
    return 'Muitas tentativas seguidas. Aguarde alguns instantes e tente novamente.';
  }
  return err instanceof Error ? err.message : 'Ocorreu um erro ao autenticar. Tente novamente.';
}

export const Entrar: React.FC<EntrarProps> = ({ redirectNotice }) => {
  const {
    firebaseUser,
    needsVerification,
    needsOnboarding,
    user,
    signInWithGoogle,
    signUpWithEmailPassword,
    signInWithEmail,
    sendPasswordReset,
    resendVerificationEmail,
    refreshVerificationStatus,
    completeOnboardingProfile,
    logoutUser,
    showToast,
    t,
  } = useApp();

  const [mode, setMode] = useState<'signup' | 'signin' | 'forgot'>('signup');
  const [step, setStep] = useState(1);
  const [formError, setFormError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [busy, setBusy] = useState(false);

  // Sign In & Forgot Password state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  // Registration / Onboarding Form State
  const [nome, setNome] = useState(user.nome || '');
  const [idade, setIdade] = useState('24');
  const [email, setEmail] = useState(user.email || '');
  const [senha, setSenha] = useState('');
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const [genero, setGenero] = useState<Genero>('mulher_cis');
  const [generoRotulo, setGeneroRotulo] = useState('Mulher Cisgênero');
  const [interesseEm, setInteresseEm] = useState<InteresseEm>('todos');
  const [profissao, setProfissao] = useState('');
  const [bio, setBio] = useState('');
  const [buscando, setBuscando] = useState('Conexões verdadeiras e amizade');
  const [cidade, setCidade] = useState('');
  const [pais, setPais] = useState('Brasil');
  const [endereco, setEndereco] = useState('');
  const [fotoUrl, setFotoUrl] = useState<string>(user.fotos[0] || '/icons/icon-192.webp');
  const [hasCustomPhoto, setHasCustomPhoto] = useState(Boolean(user.fotos[0]));
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedHabits, setSelectedHabits] = useState<string[]>(['cafe_matinal', 'cinema_series']);
  const [idiomas, setIdiomas] = useState<string[]>(['Português']);

  useEffect(() => {
    if (needsOnboarding && firebaseUser) {
      if (firebaseUser.displayName && !nome) setNome(firebaseUser.displayName);
      if (firebaseUser.email && !email) setEmail(firebaseUser.email);
      if (firebaseUser.photoURL && !hasCustomPhoto) {
        setFotoUrl(firebaseUser.photoURL);
      }
    }
  }, [needsOnboarding, firebaseUser, nome, email, hasCustomPhoto]);

  const genderOptions: { id: Genero; label: string; icon: string }[] = [
    { id: 'mulher_cis', label: 'Mulher Cisgênero', icon: '👩' },
    { id: 'homem_cis', label: 'Homem Cisgênero', icon: '👨' },
    { id: 'mulher_trans', label: 'Mulher Trans', icon: '🏳️‍⚧️' },
    { id: 'homem_trans', label: 'Homem Trans', icon: '🏳️‍⚧️' },
    { id: 'nao_binario', label: 'Não-Binário', icon: '✨' },
    { id: 'outro', label: 'Outro Gênero', icon: '💫' },
  ];

  const seekingOptions: { id: InteresseEm; label: string }[] = [
    { id: 'todos', label: 'Todos os gêneros' },
    { id: 'mulheres_cis', label: 'Mulheres Cisgênero' },
    { id: 'homens_cis', label: 'Homens Cisgênero' },
    { id: 'mulheres_trans', label: 'Mulheres Trans' },
    { id: 'homens_trans', label: 'Homens Trans' },
    { id: 'nao_binarios', label: 'Pessoas Não-Binárias' },
    { id: 'mulheres', label: 'Todas as Mulheres' },
    { id: 'homens', label: 'Todos os Homens' },
  ];

  const languageChoices = ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano', 'Japonês', 'Mandarim'];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormError('');
    setUploadingPhoto(true);
    try {
      const compressed = await compressImageUpload(file, 720, 180000);
      setFotoUrl(compressed);
      setHasCustomPhoto(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Não foi possível processar a imagem.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleToggleHabit = (id: string) => {
    setSelectedHabits((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  const handleToggleLanguage = (lang: string) => {
    setIdiomas((prev) => {
      if (prev.includes(lang)) {
        return prev.length > 1 ? prev.filter((l) => l !== lang) : prev;
      }
      return [...prev, lang];
    });
  };

  const handleNextStep1 = () => {
    if (!nome.trim() || nome.trim().length < 2) {
      setFormError('Por favor, informe seu nome verdadeiro (mínimo 2 caracteres).');
      return;
    }
    const parsedAge = parseInt(idade, 10);
    if (!parsedAge || parsedAge < 18 || parsedAge > 110) {
      setFormError('A plataforma é exclusiva para adultos com idade entre 18 e 110 anos.');
      return;
    }
    if (!adultConfirmed) {
      setFormError('Confirme que você tem 18 anos ou mais e concorda com os Termos de Uso.');
      return;
    }
    if (!needsOnboarding) {
      if (!email.trim() || !email.includes('@')) {
        setFormError('Por favor, informe um endereço de e-mail válido.');
        return;
      }
      if (!senha.trim() || senha.length < 6) {
        setFormError('Crie uma senha de acesso com no mínimo 6 dígitos.');
        return;
      }
    }
    setFormError('');
    setStep(2);
  };

  const handleNextStep2 = () => {
    setFormError('');
    setStep(3);
  };

  const handleNextStep3 = () => {
    if (!cidade.trim() || cidade.trim().length < 2) {
      setFormError('Por favor, informe a cidade onde você reside.');
      return;
    }
    if (!pais.trim()) {
      setFormError('Por favor, selecione o país onde você reside.');
      return;
    }
    setFormError('');
    setStep(4);
  };

  const buildDraftPayload = (): OnboardingDraft => {
    const meta = findCountryMeta(pais);
    return {
      nome: nome.trim(),
      idade: parseInt(idade, 10) || 24,
      email: (needsOnboarding && firebaseUser?.email ? firebaseUser.email : email).trim(),
      genero,
      generoRotulo,
      interesseEm,
      profissao: profissao.trim() || 'Membro GlobalLove',
      bio: bio.trim() || 'Aberto(a) a novas amizades e conexões culturais.',
      buscando: buscando.trim() || 'Conexões verdadeiras',
      endereco: endereco.trim(),
      cidade: cidade.trim(),
      pais: meta.name,
      bandeira: meta.flag,
      fotos: [fotoUrl || '/icons/icon-192.webp'],
      habitos: selectedHabits,
      interesses: ['Cultura', 'Viagens'],
      idiomas,
    };
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedHabits.length === 0) {
      setFormError('Selecione pelo menos um hábito diário para calcular suas afinidades.');
      return;
    }

    setBusy(true);
    setFormError('');
    setInfoMessage('');
    try {
      const draft = buildDraftPayload();
      if (needsOnboarding) {
        await completeOnboardingProfile(draft);
      } else {
        const result = await signUpWithEmailPassword(email, senha, draft);
        if (result === 'needs_verification') {
          setInfoMessage(
            'Cadastro criado! Enviamos um link de confirmação para o seu e-mail. Verifique sua caixa de entrada ou spam para ativar sua conta.'
          );
        }
      }
    } catch (err) {
      setFormError(mapFirebaseAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setFormError('Preencha seu e-mail e senha para entrar.');
      return;
    }
    setBusy(true);
    setFormError('');
    try {
      await signInWithEmail(loginEmail, loginPassword);
    } catch (err) {
      setFormError(mapFirebaseAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleAuth = async () => {
    setBusy(true);
    setFormError('');
    try {
      const res = await signInWithGoogle();
      if (res === 'needs_onboarding') {
        setStep(1);
        setInfoMessage('Conta Google conectada! Complete seu perfil abaixo para liberar a plataforma.');
      }
    } catch (err) {
      setFormError(mapFirebaseAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setFormError('Informe um e-mail válido para recuperação.');
      return;
    }
    setBusy(true);
    setFormError('');
    try {
      await sendPasswordReset(resetEmail);
      setInfoMessage('Enviamos um link de redefinição de senha para o seu e-mail.');
    } catch (err) {
      setFormError(mapFirebaseAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  // GATE 1: Email Verification Required Screen
  if (needsVerification && firebaseUser) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-lg flex-col justify-center px-4 py-10">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card text-center space-y-5">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-amber-500/15 text-amber-600">
            <Mail className="size-7" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-foreground">
              Confirme seu E-mail
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Enviamos um link de confirmação para <strong className="text-foreground">{firebaseUser.email}</strong>.
              Por segurança (18+ e proteção contra contas falsas), confirme seu e-mail antes de acessar perfis e mensagens.
            </p>
          </div>

          {formError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600">
              {formError}
            </div>
          )}
          {infoMessage && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700">
              {infoMessage}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setFormError('');
                try {
                  const ok = await refreshVerificationStatus();
                  if (!ok) {
                    setFormError('Ainda não detectamos a confirmação do e-mail. Verifique sua caixa de entrada/spam e clique no link recebido.');
                  } else {
                    showToast('E-mail verificado com sucesso!', 'success');
                  }
                } catch (err) {
                  setFormError(mapFirebaseAuthError(err));
                } finally {
                  setBusy(false);
                }
              }}
              className="min-h-[46px] flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-primary-foreground shadow-soft disabled:opacity-50"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              Já confirmei meu e-mail
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setFormError('');
                try {
                  await resendVerificationEmail();
                  setInfoMessage('Novo link de confirmação reenviado com sucesso!');
                } catch (err) {
                  setFormError(mapFirebaseAuthError(err));
                } finally {
                  setBusy(false);
                }
              }}
              className="min-h-[44px] rounded-full border border-border bg-card px-5 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition"
            >
              Reenviar link de verificação
            </button>

            <button
              type="button"
              onClick={() => void logoutUser()}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground pt-2"
            >
              <LogOut className="size-3.5" /> Entrar com outra conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-xl flex-col justify-center px-4 py-8 sm:py-12">
      <div className="overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-border bg-card p-6 sm:p-10 shadow-card">
        {/* Mandatory Notice */}
        <div className="mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/25 p-4 text-xs text-amber-800">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="size-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-900 block text-xs">
                Plataforma Exclusiva para Maiores de 18 Anos
              </strong>
              <p className="mt-0.5 text-[11px] leading-relaxed text-amber-800/90">
                {redirectNotice ||
                  'Para ver perfis de 92+ países, dar likes mútuos, conversar com segurança e proteger sua privacidade (LGPD), cadastre seus dados reais.'}
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand text-primary-foreground shadow-soft mb-3">
            <Heart className="size-6 fill-current" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            {needsOnboarding
              ? 'Completar Seu Perfil'
              : mode === 'signup'
              ? 'Criar Conta Gratuita'
              : mode === 'forgot'
              ? 'Recuperar Senha'
              : 'Acessar Minha Conta'}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            {needsOnboarding
              ? `Conectado como ${firebaseUser?.email}. Preencha seus dados públicos para concluir.`
              : mode === 'signup'
              ? '100% gratuito para sempre. Conexões reais no mundo todo.'
              : mode === 'forgot'
              ? 'Informe o e-mail cadastrado para receber instruções de recuperação.'
              : 'Entre com sua conta verificada para acessar seus matches e mensagens.'}
          </p>
        </div>

        {/* Google One-Tap / OAuth Option */}
        {!needsOnboarding && mode !== 'forgot' && (
          <div className="mt-6">
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleGoogleAuth()}
              className="flex min-h-[46px] w-full items-center justify-center gap-2.5 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-bold text-foreground shadow-xs hover:bg-muted transition disabled:opacity-50"
            >
              <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z" />
                <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z" />
              </svg>
              <span>Continuar com Google</span>
            </button>

            <div className="my-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>ou com e-mail</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </div>
        )}

        {/* Messages */}
        {formError && (
          <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-700 font-semibold text-center animate-in fade-in">
            {formError}
          </div>
        )}
        {infoMessage && (
          <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-700 font-semibold text-center animate-in fade-in">
            {infoMessage}
          </div>
        )}

        {/* SIGNUP / ONBOARDING WIZARD */}
        {(mode === 'signup' || needsOnboarding) && (
          <form onSubmit={handleCompleteRegistration} className="mt-4 space-y-6">
            {/* Step Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                <span className={step >= 1 ? 'text-primary font-bold' : ''}>1. Pessoal</span>
                <span className={step >= 2 ? 'text-primary font-bold' : ''}>2. Identidade</span>
                <span className={step >= 3 ? 'text-primary font-bold' : ''}>3. Foto & Local</span>
                <span className={step >= 4 ? 'text-primary font-bold' : ''}>4. Hábitos</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Nome Completo *
                  </label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      maxLength={60}
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value);
                        setFormError('');
                      }}
                      placeholder="Ex: Gabriela Souza"
                      className="w-full min-h-[44px] rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                    <span>Idade (18+) *</span>
                    <span className="text-primary font-bold">{idade} anos</span>
                  </label>
                  <div className="relative mt-1.5">
                    <Calendar className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                    <input
                      type="number"
                      min="18"
                      max="110"
                      required
                      value={idade}
                      onChange={(e) => {
                        setIdade(e.target.value);
                        setFormError('');
                      }}
                      className="w-full min-h-[44px] rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {!needsOnboarding && (
                  <>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        E-mail Pessoal *
                      </label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setFormError('');
                          }}
                          placeholder="seu.email@dominio.com"
                          className="w-full min-h-[44px] rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Senha de Acesso *
                      </label>
                      <div className="relative mt-1.5">
                        <Lock className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={senha}
                          onChange={(e) => {
                            setSenha(e.target.value);
                            setFormError('');
                          }}
                          placeholder="Mínimo 6 caracteres"
                          className="w-full min-h-[44px] rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </>
                )}

                <label className="flex items-start gap-2.5 rounded-2xl border border-border bg-muted/30 p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adultConfirmed}
                    onChange={(e) => {
                      setAdultConfirmed(e.target.checked);
                      setFormError('');
                    }}
                    className="mt-0.5 size-4 accent-primary"
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    Declaro ter <strong className="text-foreground">18 anos ou mais</strong> e concordo com os Termos de Uso e Política de Privacidade (LGPD/GDPR).
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="mt-2 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-bold text-primary-foreground shadow-soft transition-transform active:scale-95"
                >
                  Continuar <ArrowRight className="size-4" />
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                    Gênero com o qual você se identifica *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {genderOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setGenero(opt.id);
                          setGeneroRotulo(opt.label);
                        }}
                        className={`flex min-h-[46px] items-center gap-2 p-3 rounded-2xl border text-xs font-semibold text-left transition ${
                          genero === opt.id
                            ? 'bg-rose-500/15 border-rose-500 text-rose-700 font-bold'
                            : 'border-border bg-background text-foreground hover:bg-muted'
                        }`}
                      >
                        <span className="text-lg">{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                    Quem você tem interesse em encontrar? *
                  </label>
                  <select
                    value={interesseEm}
                    onChange={(e) => setInteresseEm(e.target.value as InteresseEm)}
                    className="w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {seekingOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Profissão ou Atividade
                  </label>
                  <input
                    type="text"
                    maxLength={80}
                    value={profissao}
                    onChange={(e) => setProfissao(e.target.value)}
                    placeholder="Ex: Designer, Engenheiro, Professor..."
                    className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Sobre Você (Bio curta)
                  </label>
                  <textarea
                    rows={2}
                    maxLength={400}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Conte um pouco sobre seus gostos e o que busca aqui..."
                    className="mt-1.5 w-full rounded-2xl border border-border bg-background p-3 text-sm text-foreground"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 min-h-[44px] rounded-full border border-border bg-card py-3 text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep2}
                    className="w-2/3 min-h-[44px] rounded-full bg-brand py-3 text-sm font-bold text-primary-foreground shadow-soft"
                  >
                    {t.auth.next} <ArrowRight className="size-4 inline" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                    Foto de Perfil *
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative size-20 rounded-2xl overflow-hidden border-2 border-primary shadow-soft shrink-0 bg-muted">
                      <img src={fotoUrl} alt="Prévia" className="size-full object-cover" />
                      {hasCustomPhoto && (
                        <span className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5">
                          <Check className="size-3" />
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="flex min-h-[44px] items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-muted border border-border cursor-pointer hover:bg-muted/80 text-xs font-semibold text-foreground transition">
                        {uploadingPhoto ? (
                          <Loader2 className="size-4 animate-spin text-primary" />
                        ) : (
                          <Camera className="size-4 text-primary" />
                        )}
                        {uploadingPhoto ? 'Processando foto...' : 'Carregar Foto do Aparelho'}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => void handlePhotoUpload(e)}
                          className="hidden"
                        />
                      </label>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        JPG, PNG ou WebP — comprimida automaticamente no seu navegador.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      País *
                    </label>
                    <select
                      value={pais}
                      onChange={(e) => {
                        setPais(e.target.value);
                        setFormError('');
                      }}
                      className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-3 py-2.5 text-sm font-semibold text-foreground"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={80}
                      value={cidade}
                      onChange={(e) => {
                        setCidade(e.target.value);
                        setFormError('');
                      }}
                      placeholder="Ex: São Paulo"
                      className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Bairro / Referência Privada (Opcional)
                  </label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      maxLength={120}
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      placeholder="Nunca será exibido publicamente no perfil"
                      className="w-full min-h-[44px] rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Privacidade LGPD: apenas sua cidade e distância aproximada (km) ficam visíveis.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 min-h-[44px] rounded-full border border-border bg-card py-3 text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep3}
                    className="w-2/3 min-h-[44px] rounded-full bg-brand py-3 text-sm font-bold text-primary-foreground shadow-soft"
                  >
                    {t.auth.next} <ArrowRight className="size-4 inline" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                    Idiomas que você fala
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {languageChoices.map((lang) => {
                      const active = idiomas.includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => handleToggleLanguage(lang)}
                          className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                            active
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-background text-muted-foreground'
                          }`}
                        >
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Seus Hábitos Diários & Rotina *
                  </label>
                  <p className="text-[11px] text-muted-foreground mb-2.5 leading-relaxed">
                    Selecione o que você faz no dia a dia para destacar afinidades mútuas.
                  </p>

                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {LIFESTYLE_HABITS.map((habit) => {
                      const isSelected = selectedHabits.includes(habit.id);
                      return (
                        <button
                          key={habit.id}
                          type="button"
                          onClick={() => handleToggleHabit(habit.id)}
                          className={`flex min-h-[44px] items-center gap-2 p-2.5 rounded-2xl border text-xs text-left transition ${
                            isSelected
                              ? 'bg-rose-500/15 border-rose-500 text-rose-700 font-bold'
                              : 'border-border bg-background text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          <span className="text-base">{habit.icon}</span>
                          <span className="truncate flex-1">{habit.label}</span>
                          {isSelected && <Check className="size-3.5 text-rose-600 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-1/3 min-h-[46px] rounded-full border border-border bg-card py-3 text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-2/3 min-h-[46px] inline-flex items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-bold text-primary-foreground shadow-soft disabled:opacity-50"
                  >
                    {busy && <Loader2 className="size-4 animate-spin" />}
                    {needsOnboarding ? 'Salvar Perfil & Entrar' : 'Finalizar Cadastro'}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* SIGN IN FORM */}
        {!needsOnboarding && mode === 'signin' && (
          <form onSubmit={(e) => void handleSignIn(e)} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                E-mail Cadastrado
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setFormError('');
                  }}
                  placeholder="seu.email@dominio.com"
                  className="w-full min-h-[44px] rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(loginEmail);
                    setMode('forgot');
                    setFormError('');
                    setInfoMessage('');
                  }}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setFormError('');
                  }}
                  placeholder="••••••••"
                  className="w-full min-h-[44px] rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-2 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-bold text-primary-foreground shadow-soft transition-transform active:scale-95 disabled:opacity-50"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <span>Entrar na minha conta</span>}
              {!busy && <ArrowRight className="size-4" />}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {!needsOnboarding && mode === 'forgot' && (
          <form onSubmit={(e) => void handleForgotPassword(e)} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                E-mail da conta
              </label>
              <div className="relative mt-1.5">
                <KeyRound className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => {
                    setResetEmail(e.target.value);
                    setFormError('');
                  }}
                  placeholder="seu.email@dominio.com"
                  className="w-full min-h-[44px] rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-bold text-primary-foreground shadow-soft disabled:opacity-50"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              Enviar link de redefinição
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setFormError('');
                setInfoMessage('');
              }}
              className="w-full text-center text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Voltar para o login
            </button>
          </form>
        )}

        {/* Mode Switch */}
        {!needsOnboarding && mode !== 'forgot' && (
          <div className="mt-6 text-center text-xs text-muted-foreground">
            {mode === 'signup' ? (
              <span>
                Já possui conta no GlobalLove.com?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setFormError('');
                    setInfoMessage('');
                  }}
                  className="font-bold text-primary hover:underline"
                >
                  Entrar
                </button>
              </span>
            ) : (
              <span>
                Ainda não possui cadastro?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setStep(1);
                    setFormError('');
                    setInfoMessage('');
                  }}
                  className="font-bold text-primary hover:underline"
                >
                  Criar conta gratuita
                </button>
              </span>
            )}
          </div>
        )}

        {needsOnboarding && (
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => void logoutUser()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-3.5" /> Sair e trocar de conta
            </button>
          </div>
        )}

        <div className="mt-8 border-t border-border/60 pt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground text-center">
          <ShieldCheck className="size-3.5 text-primary shrink-0" />
          <span>Plataforma 100% gratuita para sempre. Dados protegidos por Firebase Auth & Firestore.</span>
        </div>
      </div>
    </div>
  );
};
