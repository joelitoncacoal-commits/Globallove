import React, { useState } from 'react';
import {
  User,
  Camera,
  MapPin,
  Briefcase,
  Heart,
  Coffee,
  CheckCircle2,
  Save,
  LogOut,
  Sparkles,
  ShieldCheck,
  Eye,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COUNTRIES } from '../data/countries';
import { LIFESTYLE_HABITS } from '../data/lifestyleHabits';
import { Genero, InteresseEm } from '../types';

export const Perfil: React.FC = () => {
  const { user, updateUser, logoutUser, navigate, t } = useApp();

  const [nome, setNome] = useState(user.nome);
  const [idade, setIdade] = useState(user.idade);
  const [cidade, setCidade] = useState(user.cidade);
  const [pais, setPais] = useState(user.pais);
  const [endereco, setEndereco] = useState(user.endereco || 'Pinheiros / Jardins');
  const [genero, setGenero] = useState<Genero>(user.genero || 'mulher_cis');
  const [generoRotulo, setGeneroRotulo] = useState(user.generoRotulo || 'Mulher Cis');
  const [interesseEm, setInteresseEm] = useState<InteresseEm>(user.interesseEm || 'todos');
  const [profissao, setProfissao] = useState(user.profissao);
  const [bio, setBio] = useState(user.bio);
  const [buscando, setBuscando] = useState(user.buscando);
  const [fotoUrl, setFotoUrl] = useState(user.fotos[0] || '');
  const [habitos, setHabitos] = useState<string[]>(user.habitos || ['cafe_matinal', 'academia_fitness']);
  const [companhiaAtivo, setCompanhiaAtivo] = useState(!!user.companhiaAtivo);
  const [companhiaNota, setCompanhiaNota] = useState(user.companhiaNota || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const genderOptions: { id: Genero; label: string; icon: string }[] = [
    { id: 'mulher_cis', label: 'Mulher Cis', icon: '👩' },
    { id: 'homem_cis', label: 'Homem Cis', icon: '👨' },
    { id: 'mulher_trans', label: 'Mulher Trans', icon: '🏳️‍⚧️' },
    { id: 'homem_trans', label: 'Homem Trans', icon: '🏳️‍⚧️' },
    { id: 'nao_binario', label: 'Não-Binário', icon: '✨' },
    { id: 'outro', label: 'Outro', icon: '💫' },
  ];

  const handleToggleHabit = (id: string) => {
    setHabitos(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      nome,
      idade: Number(idade),
      cidade,
      pais,
      endereco,
      genero,
      generoRotulo,
      interesseEm,
      profissao,
      bio,
      buscando,
      habitos,
      fotos: fotoUrl ? [fotoUrl, ...user.fotos.slice(1)] : user.fotos,
      companhiaAtivo,
      companhiaNota
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
            <User className="size-3.5" /> {t.nav.profile}
          </div>
          <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Editar Meu Perfil Completo
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Mantenha sua identidade, gênero, hábitos diários e localização atualizados para afinidades mútuas precisas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/descobrir')}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted"
          >
            <Eye className="size-3.5" /> Ver no Descobrir
          </button>
          <button
            onClick={logoutUser}
            className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
          >
            <LogOut className="size-3.5" /> Sair
          </button>
        </div>
      </div>

      {/* 100% Free Plan Banner */}
      <div className="mb-6 overflow-hidden rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 shadow-soft flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-800 font-bold shadow-soft shrink-0">
            <Sparkles className="size-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-bold text-foreground">
                Plataforma 100% Gratuita & Global
              </h3>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                Livre para Sempre
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Curtidas ilimitadas, chat com fotos, vídeos, áudio e vídeo chamadas em alta definição sem nenhum custo.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Photo Section */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-display text-base sm:text-lg font-bold text-foreground mb-4">
            Foto do Perfil Real
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative size-28 rounded-3xl overflow-hidden border-2 border-primary/40 shadow-card shrink-0">
              <img
                src={fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={nome}
                className="size-full object-cover"
              />
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                URL da Foto
              </label>
              <input
                type="url"
                value={fotoUrl}
                onChange={(e) => setFotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                Fotos reais de rosto com boa iluminação recebem até 5x mais curtidas e afinidades mútuas.
              </p>
            </div>
          </div>
        </div>

        {/* Identity & Detailed Gender */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h3 className="font-display text-base sm:text-lg font-bold text-foreground mb-1">
            Gênero e Identidade Detalhada
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Escolha sua identidade específica para que os filtros encontrem exatamente o que você procura.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {genderOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setGenero(opt.id);
                  setGeneroRotulo(opt.label);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-semibold text-left transition ${
                  genero === opt.id
                    ? 'bg-rose-500/15 border-rose-500 text-rose-700 font-bold shadow-xs'
                    : 'border-border bg-background text-foreground hover:bg-muted'
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Basic Information & Verified Age */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h3 className="font-display text-base sm:text-lg font-bold text-foreground mb-2">
            Dados Pessoais & Localização Exata
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Nome Verdadeiro
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Idade Real (18+)</span>
                <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> Verificada
                </span>
              </label>
              <input
                type="number"
                min="18"
                max="99"
                value={idade}
                onChange={(e) => setIdade(Number(e.target.value))}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Endereço / Bairro
              </label>
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Ex: Pinheiros / Vila Madalena"
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Cidade & País
              </label>
              <div className="flex gap-2 mt-1.5">
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-1/2 rounded-2xl border border-border bg-background px-3 py-2.5 text-sm font-semibold text-foreground"
                />
                <select
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  className="w-1/2 rounded-2xl border border-border bg-background px-3 py-2.5 text-xs font-semibold text-foreground"
                >
                  <option value="Brasil">Brasil 🇧🇷</option>
                  <option value="Portugal">Portugal 🇵🇹</option>
                  <option value="Argentina">Argentina 🇦🇷</option>
                  <option value="Espanha">Espanha 🇪🇸</option>
                  <option value="França">França 🇫🇷</option>
                  <option value="Japão">Japão 🇯🇵</option>
                  <option value="Estados Unidos">Estados Unidos 🇺🇸</option>
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.name}>{c.name} {c.flag}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Profissão / Ocupação
              </label>
              <input
                type="text"
                value={profissao}
                onChange={(e) => setProfissao(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                O que você busca
              </label>
              <input
                type="text"
                value={buscando}
                onChange={(e) => setBuscando(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Biografia
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Daily Lifestyle Habits Selection */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
              Seus Hábitos do Dia a Dia
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Selecione o que você faz e gosta. Quando outro perfil curtir o mesmo, destacaremos em ambas as telas!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LIFESTYLE_HABITS.map((habit) => {
              const isSelected = habitos.includes(habit.id);
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
                  {isSelected && <Check className="size-3 text-rose-600 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 animate-in fade-in">
              <CheckCircle2 className="size-4" /> Alterações salvas com sucesso!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-soft transition-transform active:scale-95"
          >
            <Save className="size-4" /> Salvar Perfil
          </button>
        </div>
      </form>
    </div>
  );
};
