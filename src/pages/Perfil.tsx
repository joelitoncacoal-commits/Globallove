import React, { useState } from 'react';
import {
  User,
  Camera,
  CheckCircle2,
  Save,
  LogOut,
  Sparkles,
  Eye,
  Check,
  Shield,
  Lock,
  Trash2,
  KeyRound,
  Loader2,
  UserX,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COUNTRIES } from '../data/countries';
import { LIFESTYLE_HABITS } from '../data/lifestyleHabits';
import { compressImageUpload } from '../utils/security';
import { findCountryMeta } from '../utils/localization';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { Genero, InteresseEm } from '../types';

export const Perfil: React.FC = () => {
  const {
    user,
    emailVerified,
    updateUser,
    logoutUser,
    sendPasswordReset,
    blockedUsers,
    unblockUser,
    deleteMyAccount,
    showToast,
    navigate,
    t,
  } = useApp();

  const [nome, setNome] = useState(user.nome);
  const [idade, setIdade] = useState(user.idade);
  const [cidade, setCidade] = useState(user.cidade);
  const [pais, setPais] = useState(user.pais || 'Brasil');
  const [endereco, setEndereco] = useState(user.endereco || '');
  const [genero, setGenero] = useState<Genero>(user.genero || 'mulher_cis');
  const [generoRotulo, setGeneroRotulo] = useState(user.generoRotulo || 'Mulher Cisgênero');
  const [interesseEm, setInteresseEm] = useState<InteresseEm>(user.interesseEm || 'todos');
  const [profissao, setProfissao] = useState(user.profissao);
  const [bio, setBio] = useState(user.bio);
  const [buscando, setBuscando] = useState(user.buscando);
  const [fotoUrl, setFotoUrl] = useState(user.fotos[0] || '/icons/icon-192.webp');
  const [habitos, setHabitos] = useState<string[]>(user.habitos || ['cafe_matinal']);
  const [privacy, setPrivacy] = useState({
    hideAddress: user.privacy?.hideAddress !== false,
    showOnlineStatus: user.privacy?.showOnlineStatus !== false,
    showLocationOnMap: user.privacy?.showLocationOnMap !== false,
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const genderOptions: { id: Genero; label: string; icon: string }[] = [
    { id: 'mulher_cis', label: 'Mulher Cisgênero', icon: '👩' },
    { id: 'homem_cis', label: 'Homem Cisgênero', icon: '👨' },
    { id: 'mulher_trans', label: 'Mulher Trans', icon: '🏳️‍⚧️' },
    { id: 'homem_trans', label: 'Homem Trans', icon: '🏳️‍⚧️' },
    { id: 'nao_binario', label: 'Não-Binário', icon: '✨' },
    { id: 'outro', label: 'Outro Gênero', icon: '💫' },
  ];

  const handleToggleHabit = (id: string) => {
    setHabitos((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const compressed = await compressImageUpload(file, 720, 180000);
      setFotoUrl(compressed);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao processar imagem.', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const meta = findCountryMeta(pais);
      await updateUser({
        nome: nome.trim(),
        idade: Math.max(18, Math.min(110, Number(idade) || 18)),
        cidade: cidade.trim(),
        pais: meta.name,
        bandeira: meta.flag,
        endereco: endereco.trim(),
        genero,
        generoRotulo,
        interesseEm,
        profissao: profissao.trim(),
        bio: bio.trim(),
        buscando: buscando.trim(),
        habitos,
        fotos: fotoUrl ? [fotoUrl, ...user.fotos.slice(1)] : user.fotos,
        privacy,
      });
      setSavedSuccess(true);
      showToast('Perfil e configurações de privacidade salvos!', 'success');
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao salvar alterações.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-8 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
            <User className="size-3.5" /> {t.nav.profile}
          </div>
          <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Meu Perfil & Privacidade
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Gerencie suas informações públicas, localização aproximada, bloqueios e configurações LGPD.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/descobrir')}
            className="flex min-h-[42px] items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-muted"
          >
            <Eye className="size-3.5" /> Descobrir
          </button>
          <button
            type="button"
            onClick={() => void logoutUser()}
            className="flex min-h-[42px] items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
          >
            <LogOut className="size-3.5" /> Sair
          </button>
        </div>
      </div>

      {/* 100% Free Banner */}
      <div className="mb-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 shadow-soft flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-800 shrink-0">
          <Sparkles className="size-5" />
        </span>
        <div>
          <h2 className="font-display text-base font-bold text-foreground">
            Conta 100% Gratuita & Verificada
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Curtidas, matches, chat com mídia e busca global liberados gratuitamente para sempre.
          </p>
        </div>
      </div>

      <form onSubmit={(e) => void handleSave(e)} className="space-y-6">
        {/* Photo Upload */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-display text-base sm:text-lg font-bold text-foreground mb-4">
            Foto Principal do Perfil
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative size-28 rounded-3xl overflow-hidden border-2 border-primary/40 shadow-card shrink-0 bg-muted">
              <img src={fotoUrl} alt={nome} className="size-full object-cover" />
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl border border-border bg-muted px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted/80 transition">
                {uploadingPhoto ? (
                  <Loader2 className="size-4 animate-spin text-primary" />
                ) : (
                  <Camera className="size-4 text-primary" />
                )}
                <span>{uploadingPhoto ? 'Processando...' : 'Enviar Nova Foto do Dispositivo'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => void handlePhotoUpload(e)}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-muted-foreground">
                Imagens JPG, PNG ou WebP são comprimidas automaticamente com segurança.
              </p>
            </div>
          </div>
        </div>

        {/* Gender */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
            Gênero e Preferências
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {genderOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setGenero(opt.id);
                  setGeneroRotulo(opt.label);
                }}
                className={`flex min-h-[44px] items-center gap-2 p-2.5 rounded-2xl border text-xs font-semibold text-left transition ${
                  genero === opt.id
                    ? 'bg-rose-500/15 border-rose-500 text-rose-700 font-bold'
                    : 'border-border bg-background text-foreground hover:bg-muted'
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tenho interesse em conhecer
            </label>
            <select
              value={interesseEm}
              onChange={(e) => setInteresseEm(e.target.value as InteresseEm)}
              className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground"
            >
              <option value="todos">Todos os gêneros</option>
              <option value="mulheres_cis">Mulheres Cisgênero</option>
              <option value="homens_cis">Homens Cisgênero</option>
              <option value="mulheres_trans">Mulheres Trans</option>
              <option value="homens_trans">Homens Trans</option>
              <option value="nao_binarios">Pessoas Não-Binárias</option>
              <option value="mulheres">Todas as Mulheres</option>
              <option value="homens">Todos os Homens</option>
            </select>
          </div>
        </div>

        {/* Basic Info */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
            Dados Pessoais & Localização
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Nome *
              </label>
              <input
                type="text"
                maxLength={60}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Idade (18+) *</span>
                {emailVerified && (
                  <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> E-mail Verificado
                  </span>
                )}
              </label>
              <input
                type="number"
                min="18"
                max="110"
                value={idade}
                onChange={(e) => setIdade(Number(e.target.value))}
                required
                className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                País *
              </label>
              <select
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground"
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
                maxLength={80}
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                required
                className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Lock className="size-3.5 text-primary" /> Bairro / Endereço (Armazenado apenas em área privada LGPD)
              </label>
              <input
                type="text"
                maxLength={140}
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Nunca será exibido publicamente para outros usuários"
                className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2 text-sm text-foreground"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Profissão
              </label>
              <input
                type="text"
                maxLength={100}
                value={profissao}
                onChange={(e) => setProfissao(e.target.value)}
                className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2 text-sm text-foreground"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                O que você busca
              </label>
              <input
                type="text"
                maxLength={160}
                value={buscando}
                onChange={(e) => setBuscando(e.target.value)}
                className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2 text-sm text-foreground"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Biografia
              </label>
              <textarea
                value={bio}
                maxLength={600}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Lifestyle Habits */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
            Hábitos do Dia a Dia
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LIFESTYLE_HABITS.map((habit) => {
              const isSelected = habitos.includes(habit.id);
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
                  {isSelected && <Check className="size-3 text-rose-600 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Privacy Settings (LGPD / GDPR) */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
              Controles de Privacidade (LGPD)
            </h3>
          </div>

          <label className="flex items-center justify-between p-3 rounded-2xl border border-border bg-muted/30 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-foreground">Ocultar Endereço Privado</p>
              <p className="text-[11px] text-muted-foreground">
                Garante que apenas cidade, país e distância aproximada sejam exibidos.
              </p>
            </div>
            <input
              type="checkbox"
              checked={privacy.hideAddress}
              onChange={(e) => setPrivacy((p) => ({ ...p, hideAddress: e.target.checked }))}
              className="size-5 accent-primary"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl border border-border bg-muted/30 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-foreground">Exibir Status Online</p>
              <p className="text-[11px] text-muted-foreground">
                Permite que outros membros vejam quando você está ativo(a) agora.
              </p>
            </div>
            <input
              type="checkbox"
              checked={privacy.showOnlineStatus}
              onChange={(e) => setPrivacy((p) => ({ ...p, showOnlineStatus: e.target.checked }))}
              className="size-5 accent-primary"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl border border-border bg-muted/30 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-foreground">Aparecer no Mapa Global Aproximado</p>
              <p className="text-[11px] text-muted-foreground">
                Usa apenas a região da sua cidade (grade de ~11 km), nunca seu endereço exato.
              </p>
            </div>
            <input
              type="checkbox"
              checked={privacy.showLocationOnMap}
              onChange={(e) => setPrivacy((p) => ({ ...p, showLocationOnMap: e.target.checked }))}
              className="size-5 accent-primary"
            />
          </label>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="size-4" /> Alterações salvas!
            </span>
          )}
          <button
            type="submit"
            disabled={saving || uploadingPhoto}
            className="ml-auto min-h-[46px] flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-soft transition-transform active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Salvar Perfil
          </button>
        </div>
      </form>

      {/* Blocked Users Management */}
      <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
        <div className="flex items-center gap-2">
          <UserX className="size-5 text-rose-600" />
          <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
            Contas Bloqueadas ({blockedUsers.length})
          </h3>
        </div>
        {blockedUsers.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Você não bloqueou nenhuma conta no momento.
          </p>
        ) : (
          <div className="space-y-2">
            {blockedUsers.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={b.blockedPhoto || '/icons/icon-192.webp'}
                    alt={b.blockedName || 'Usuário'}
                    className="size-10 rounded-full object-cover shrink-0 bg-muted"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {b.blockedName || b.blockedUid}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      Bloqueado em {b.createdAt}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void unblockUser(b.blockedUid)}
                  className="min-h-[38px] rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted shrink-0"
                >
                  Desbloquear
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Account Security & LGPD Deletion */}
      <section className="mt-6 rounded-3xl border border-rose-500/25 bg-rose-500/5 p-6 space-y-4">
        <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
          Segurança da Conta & Dados (LGPD)
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          {user.email && (
            <button
              type="button"
              onClick={async () => {
                try {
                  await sendPasswordReset(user.email);
                  showToast('Link de redefinição de senha enviado para seu e-mail.', 'success');
                } catch (err) {
                  showToast(err instanceof Error ? err.message : 'Erro ao enviar e-mail.', 'error');
                }
              }}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-2.5 text-xs font-bold text-foreground hover:bg-muted"
            >
              <KeyRound className="size-4 text-primary" /> Redefinir Senha por E-mail
            </button>
          )}

          <button
            type="button"
            onClick={() => setDeleteAccountOpen(true)}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-700"
          >
            <Trash2 className="size-4" /> Excluir Minha Conta e Dados (LGPD)
          </button>
        </div>
      </section>

      <ConfirmModal
        open={deleteAccountOpen}
        title="Excluir sua conta permanentemente?"
        description="Conforme a LGPD, seu perfil público, endereço privado e dados pessoais serão removidos permanentemente. Esta ação não pode ser desfeita."
        confirmLabel="Excluir Permanentemente"
        destructive
        requireTypedWord="EXCLUIR"
        onCancel={() => setDeleteAccountOpen(false)}
        onConfirm={async () => {
          await deleteMyAccount();
          setDeleteAccountOpen(false);
        }}
      />
    </div>
  );
};
