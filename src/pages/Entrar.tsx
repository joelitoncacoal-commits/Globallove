import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LIFESTYLE_HABITS } from '../data/lifestyleHabits';
import { Genero, InteresseEm, RegisteredUserRecord, UserProfile } from '../types';

interface EntrarProps {
  redirectNotice?: string;
}

export const Entrar: React.FC<EntrarProps> = ({ redirectNotice }) => {
  const { registerUser, loginUser, t } = useApp();

  // Always default to Sign Up (Mandatory Registration)
  const [isSignUp, setIsSignUp] = useState(true);
  const [step, setStep] = useState(1);
  const [formError, setFormError] = useState('');

  // Sign In state (for existing registered accounts)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration Form State (Strict Real Data Required)
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('24');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [genero, setGenero] = useState<Genero>('mulher_cis');
  const [generoRotulo, setGeneroRotulo] = useState('Mulher Cis');
  const [interesseEm, setInteresseEm] = useState<InteresseEm>('todos');
  const [cidade, setCidade] = useState('');
  const [pais, setPais] = useState('Brasil');
  const [endereco, setEndereco] = useState('');
  const [fotoUrl, setFotoUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80');
  const [hasCustomPhoto, setHasCustomPhoto] = useState(false);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([
    'cafe_matinal',
    'cinema_series'
  ]);

  const genderOptions: { id: Genero; label: string; icon: string }[] = [
    { id: 'mulher_cis', label: 'Mulher Cis', icon: '👩' },
    { id: 'homem_cis', label: 'Homem Cis', icon: '👨' },
    { id: 'mulher_trans', label: 'Mulher Trans', icon: '🏳️‍⚧️' },
    { id: 'homem_trans', label: 'Homem Trans', icon: '🏳️‍⚧️' },
    { id: 'nao_binario', label: 'Não-Binário', icon: '✨' },
    { id: 'outro', label: 'Outro Gênero', icon: '💫' },
  ];

  const seekingOptions: { id: InteresseEm; label: string }[] = [
    { id: 'todos', label: 'Todos os gêneros' },
    { id: 'mulheres_cis', label: 'Mulheres Cis' },
    { id: 'homens_cis', label: 'Homens Cis' },
    { id: 'mulheres_trans', label: 'Mulheres Trans' },
    { id: 'homens_trans', label: 'Homens Trans' },
    { id: 'nao_binarios', label: 'Não-Binários' },
    { id: 'mulheres', label: 'Todas as Mulheres' },
    { id: 'homens', label: 'Todos os Homens' },
  ];

  const samplePhotoPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFotoUrl(reader.result as string);
        setHasCustomPhoto(true);
        setFormError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleHabit = (id: string) => {
    setSelectedHabits(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const handleNextStep1 = () => {
    if (!nome.trim() || nome.trim().length < 2) {
      setFormError('Por favor, informe seu nome verdadeiro.');
      return;
    }
    const parsedAge = parseInt(idade, 10);
    if (!parsedAge || parsedAge < 18 || parsedAge > 99) {
      setFormError('A plataforma é exclusiva para maiores de 18 anos.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Por favor, informe um endereço de e-mail válido.');
      return;
    }
    if (!senha.trim() || senha.length < 6) {
      setFormError('Crie uma senha de acesso com no mínimo 6 dígitos.');
      return;
    }
    setFormError('');
    setStep(2);
  };

  const handleNextStep2 = () => {
    setFormError('');
    setStep(3);
  };

  const handleNextStep3 = () => {
    if (!endereco.trim()) {
      setFormError('Por favor, informe seu bairro ou endereço residencial.');
      return;
    }
    if (!cidade.trim()) {
      setFormError('Por favor, informe a cidade onde você reside.');
      return;
    }
    setFormError('');
    setStep(4);
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedHabits.length === 0) {
      setFormError('Selecione pelo menos um hábito diário para calcular suas afinidades.');
      return;
    }

    const finalAge = parseInt(idade, 10) || 24;
    const finalCity = cidade.trim() || 'São Paulo';
    const finalCountry = pais.trim() || 'Brasil';
    const flag = finalCountry.toLowerCase().includes('brasil') ? '🇧🇷' : '🌍';

    const userProfileData: Partial<UserProfile> = {
      nome: nome.trim(),
      email: email.trim(),
      idade: finalAge,
      genero,
      generoRotulo,
      interesseEm,
      cidade: finalCity,
      pais: finalCountry,
      bandeira: flag,
      endereco: endereco.trim(),
      fotos: [fotoUrl],
      habitos: selectedHabits,
      verificado: true,
      onboardingConcluido: true,
      isPremium: true
    };

    const registeredUserRecord: RegisteredUserRecord = {
      id: `u_${Date.now()}`,
      nome: nome.trim(),
      email: email.trim(),
      idade: finalAge,
      generoRotulo,
      cidade: finalCity,
      pais: finalCountry,
      bandeira: flag,
      fotoUrl,
      dataCadastro: `Hoje às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      status: 'ativo',
      verificado: true,
      totalCliquesRecebidos: 1
    };

    registerUser(userProfileData, registeredUserRecord);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setFormError('Preencha seu e-mail e senha para entrar.');
      return;
    }
    loginUser(loginEmail.trim());
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-xl flex-col justify-center px-4 py-8 sm:py-12">
      <div className="overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-border bg-card p-6 sm:p-10 shadow-card">
        
        {/* Mandatory Registration / Redirect Notice */}
        <div className="mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/25 p-4 text-xs text-amber-700">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="size-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-800 block text-xs">
                Cadastro Obrigatório com Dados Verdadeiros
              </strong>
              <p className="mt-0.5 text-[11px] leading-relaxed text-amber-700">
                {redirectNotice || 'Para interagir, ver perfis de 92+ países, enviar mensagens e realizar chamadas de vídeo gratuitas no GlobalLove.com, é obrigatório cadastrar seus dados reais.'}
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
            {isSignUp ? 'Criar Cadastro Obrigatório' : 'Acessar Minha Conta'}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            {isSignUp
              ? 'Preencha seus dados reais para começar a conhecer pessoas verdadeiras no mundo todo.'
              : 'Digite suas credenciais cadastradas para continuar.'}
          </p>
        </div>

        {/* Error notification banner */}
        {formError && (
          <div className="mt-4 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-semibold text-center animate-in fade-in">
            {formError}
          </div>
        )}

        {/* Multi-step Registration Flow */}
        {isSignUp ? (
          <form onSubmit={handleCompleteRegistration} className="mt-6 space-y-6">
            {/* Step Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span className={step >= 1 ? 'text-primary font-bold' : ''}>1. Pessoal</span>
                <span className={step >= 2 ? 'text-primary font-bold' : ''}>2. Identidade</span>
                <span className={step >= 3 ? 'text-primary font-bold' : ''}>3. Foto & Endereço</span>
                <span className={step >= 4 ? 'text-primary font-bold' : ''}>4. Rotina & Hábitos</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* STEP 1: Personal info */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Nome Completo Verdadeiro *
                  </label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value);
                        setFormError('');
                      }}
                      placeholder="Ex: Gabriela Souza"
                      className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Seu nome real garante segurança e autenticidade para toda a comunidade.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                    <span>Idade Verdadeira (18+) *</span>
                    <span className="text-primary font-bold">{idade} anos</span>
                  </label>
                  <div className="relative mt-1.5">
                    <Calendar className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                    <input
                      type="number"
                      min="18"
                      max="99"
                      required
                      value={idade}
                      onChange={(e) => {
                        setIdade(e.target.value);
                        setFormError('');
                      }}
                      className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Apenas maiores de 18 anos são permitidos na plataforma.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    E-mail Pessoal Verdadeiro *
                  </label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setFormError('');
                      }}
                      placeholder="seu.email@dominio.com"
                      className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Criar Senha de Acesso *
                  </label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                    <input
                      type="password"
                      required
                      value={senha}
                      onChange={(e) => {
                        setSenha(e.target.value);
                        setFormError('');
                      }}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-bold text-primary-foreground shadow-soft transition-transform active:scale-95"
                >
                  Continuar Cadastro <ArrowRight className="size-4" />
                </button>
              </div>
            )}

            {/* STEP 2: Gender & Seeking */}
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
                        className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-semibold text-left transition ${
                          genero === opt.id
                            ? 'bg-rose-500/15 border-rose-500 text-rose-700 font-bold shadow-xs'
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
                    className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {seekingOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 rounded-full border border-border bg-card py-3 text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep2}
                    className="w-2/3 rounded-full bg-brand py-3 text-sm font-bold text-primary-foreground shadow-soft"
                  >
                    {t.auth.next} <ArrowRight className="size-4 inline" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Photo & Residential Address */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in">
                {/* Photo Upload & Preview */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    Foto de Perfil Real (Obrigatória) *
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative size-20 rounded-2xl overflow-hidden border-2 border-primary shadow-soft shrink-0">
                      <img src={fotoUrl} alt="Preview" className="size-full object-cover" />
                      {hasCustomPhoto && (
                        <span className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5">
                          <Check className="size-3" />
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-muted border border-border cursor-pointer hover:bg-muted/80 text-xs font-semibold text-foreground transition">
                        <Camera className="size-4 text-primary" />
                        Carregar Foto Real do Aparelho
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Uma foto nítida e real é necessária para validar seu perfil.
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-[11px] text-muted-foreground mb-1.5 font-medium">Ou selecione uma foto de exemplo:</p>
                    <div className="flex gap-2">
                      {samplePhotoPresets.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setFotoUrl(url);
                            setFormError('');
                          }}
                          className={`size-12 rounded-xl overflow-hidden border-2 transition ${
                            fotoUrl === url ? 'border-primary ring-2 ring-primary/40' : 'border-border'
                          }`}
                        >
                          <img src={url} alt="preset" className="size-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Residential Address / City */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Endereço Residencial ou Bairro *
                  </label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={endereco}
                      onChange={(e) => {
                        setEndereco(e.target.value);
                        setFormError('');
                      }}
                      placeholder="Ex: Pinheiros / Jardins"
                      className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Utilizado para calcular distâncias exatas em km para outras pessoas no mundo.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Cidade Real *
                    </label>
                    <input
                      type="text"
                      required
                      value={cidade}
                      onChange={(e) => {
                        setCidade(e.target.value);
                        setFormError('');
                      }}
                      placeholder="Ex: São Paulo"
                      className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      País Real *
                    </label>
                    <input
                      type="text"
                      required
                      value={pais}
                      onChange={(e) => {
                        setPais(e.target.value);
                        setFormError('');
                      }}
                      placeholder="Ex: Brasil"
                      className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 rounded-full border border-border bg-card py-3 text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep3}
                    className="w-2/3 rounded-full bg-brand py-3 text-sm font-bold text-primary-foreground shadow-soft"
                  >
                    {t.auth.next} <ArrowRight className="size-4 inline" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Lifestyle Habits & Routine */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Seus Hábitos Diários & Rotina *
                  </label>
                  <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                    Selecione o que você faz no dia a dia. Se outra pessoa tiver o mesmo hábito, mostramos o destaque "Ambos gostam disso!" no perfil.
                  </p>

                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                    {LIFESTYLE_HABITS.map((habit) => {
                      const isSelected = selectedHabits.includes(habit.id);
                      return (
                        <button
                          key={habit.id}
                          type="button"
                          onClick={() => handleToggleHabit(habit.id)}
                          className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs text-left transition ${
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

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-1/3 rounded-full border border-border bg-card py-3.5 text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/30 hover:from-rose-600 hover:to-pink-600 transition-transform active:scale-95"
                  >
                    Finalizar Cadastro & Entrar
                  </button>
                </div>
              </div>
            )}
          </form>
        ) : (
          /* Standard Sign In Form (Only real accounts) */
          <form onSubmit={handleSignIn} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                E-mail Cadastrado
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="seu.email@dominio.com"
                  className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Senha
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-bold text-primary-foreground shadow-soft transition-transform active:scale-95"
            >
              <span>Acessar com meus dados</span>
              <ArrowRight className="size-4" />
            </button>
          </form>
        )}

        {/* Toggle Sign Up / Sign In */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          {isSignUp ? (
            <span>
              Já possui conta cadastrada no GlobalLove.com?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setFormError('');
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
                  setIsSignUp(true);
                  setStep(1);
                  setFormError('');
                }}
                className="font-bold text-primary hover:underline"
              >
                Criar cadastro obrigatório
              </button>
            </span>
          )}
        </div>

        <div className="mt-8 border-t border-border/60 pt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground text-center">
          <ShieldCheck className="size-3.5 text-primary shrink-0" />
          <span>Plataforma 100% gratuita para sempre. Dados reais protegidos com criptografia.</span>
        </div>

      </div>
    </div>
  );
};
