import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  MousePointerClick,
  Activity,
  Heart,
  Video,
  UserCheck,
  ShieldCheck,
  Search,
  Save,
  Download,
  Trash2,
  Lock,
  Globe2,
  Sparkles,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Admin: React.FC = () => {
  const {
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
  } = useApp();

  // Admin Profile form states
  const [adminNome, setAdminNome] = useState(adminProfile.nome);
  const [adminEmail, setAdminEmail] = useState(adminProfile.email);
  const [adminCargo, setAdminCargo] = useState(adminProfile.cargo);
  const [adminFotoUrl, setAdminFotoUrl] = useState(adminProfile.fotoUrl);
  const [adminNivelAcesso, setAdminNivelAcesso] = useState(adminProfile.nivelAcesso);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // User list search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'suspenso'>('todos');

  // Active tab in Admin panel
  const [activeTab, setActiveTab] = useState<'analytics' | 'usuarios' | 'perfil_adm'>('analytics');

  const filteredUsers = registeredUsersList.filter(u => {
    const matchesQuery =
      u.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.cidade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.pais.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || u.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleSaveAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile({
      nome: adminNome,
      email: adminEmail,
      cargo: adminCargo,
      fotoUrl: adminFotoUrl,
      nivelAcesso: adminNivelAcesso
    });
    setSaveSuccess(true);
    trackClick(`Perfil de Administrador atualizado por ${adminNome}`, 'clique');
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetMetrics = () => {
    if (window.confirm('Deseja zerar os contadores de cliques e eventos da auditoria real?')) {
      resetAuditMetrics();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const handleExportData = () => {
    const data = {
      metricasReais: {
        totalCliquesAuditados: totalClicks,
        totalCadastrosReais: registeredUsersList.length,
        usuariosOnlineReais: activeOnlineUsersCount,
        totalMatchesReais: totalMatchesCount,
        totalVideoChamadasReais: totalVideoCallsCount,
      },
      administrador: adminProfile,
      usuariosCadastrados: registeredUsersList,
      eventosRecentesAuditados: eventsFeed,
      dataAuditoria: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria-real-globallove-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 text-xs font-bold text-emerald-700 mb-2">
            <ShieldAlert className="size-4 text-emerald-600" />
            <span>Área de Administração Master</span>
            <span className="size-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[11px] font-bold text-emerald-600">Apenas Dados 100% Reais</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
            Painel do Administrador
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Acompanhe cliques reais e cadastros verdadeiros do GlobalLove.com sem dados fictícios ou simulações.
          </p>
        </div>

        {/* Admin Quick Profile Badge */}
        <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-2xl shadow-soft">
          <div className="relative size-12 rounded-xl overflow-hidden border-2 border-primary shrink-0">
            <img src={adminProfile.fotoUrl} alt={adminProfile.nome} className="size-full object-cover" />
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-foreground">{adminProfile.nome}</span>
              <span className="text-[10px] font-extrabold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                {adminProfile.nivelAcesso}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{adminProfile.cargo}</p>
          </div>
        </div>
      </div>

      {/* Real-time KPI Metric Cards (Only Real Verified Data) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Real Clicks */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-soft relative overflow-hidden group hover:border-primary/40 transition">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cliques Reais</span>
            <MousePointerClick className="size-5 text-primary group-hover:scale-110 transition" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {totalClicks.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Auditado
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Cliques reais dados em botões, perfis e links
          </p>
        </div>

        {/* Total Real Registered Users */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-soft relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cadastros Reais</span>
            <Users className="size-5 text-emerald-600 group-hover:scale-110 transition" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {registeredUsersList.length}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              No Banco
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Usuários reais cadastrados com foto e endereço
          </p>
        </div>

        {/* Real Active Online Sessions */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-soft relative overflow-hidden group hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Online Agora</span>
            <Activity className="size-5 text-rose-500 group-hover:scale-110 transition animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {activeOnlineUsersCount}
            </span>
            <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
              <span className="size-2 rounded-full bg-rose-500 animate-ping"></span>
              Ao Vivo
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Sessões ativas no momento
          </p>
        </div>

        {/* Real Matches */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-soft relative overflow-hidden group hover:border-pink-500/40 transition">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Matches Reais</span>
            <Heart className="size-5 text-pink-500 group-hover:scale-110 transition fill-pink-500/20" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {totalMatchesCount}
            </span>
            <span className="text-xs font-bold text-pink-600">
              Afinidades
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Conexões mútuas confirmadas
          </p>
        </div>

        {/* Real Video Calls */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-soft relative overflow-hidden group hover:border-amber-500/40 transition col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Vídeo Chamadas</span>
            <Video className="size-5 text-amber-500 group-hover:scale-110 transition" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {totalVideoCallsCount}
            </span>
            <span className="text-xs font-bold text-amber-600">
              Iniciadas
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Chamadas reais realizadas na plataforma
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-border pb-1">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'analytics'
                ? 'bg-brand text-primary-foreground shadow-soft'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Activity className="size-4" />
            Cliques & Transmissão Real
          </button>

          <button
            onClick={() => setActiveTab('usuarios')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'usuarios'
                ? 'bg-brand text-primary-foreground shadow-soft'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Users className="size-4" />
            Usuários Cadastrados ({registeredUsersList.length})
          </button>

          <button
            onClick={() => setActiveTab('perfil_adm')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'perfil_adm'
                ? 'bg-brand text-primary-foreground shadow-soft'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <UserCheck className="size-4" />
            Meu Perfil de Administrador
          </button>
        </div>

        <button
          onClick={handleExportData}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted shadow-soft transition"
          title="Baixar relatório auditado em JSON"
        >
          <Download className="size-3.5 text-primary" />
          Exportar Dados Reais
        </button>
      </div>

      {/* TAB 1: Real-time Live Stream & Click Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Live Activity Event Stream */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Transmissão ao Vivo de Ações Reais
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                Auditado em Tempo Real
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Cada clique de usuário, novo cadastro verdadeiro, mensagem enviada ou chamada de vídeo é capturado instantaneamente abaixo:
            </p>

            {eventsFeed.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground space-y-3 rounded-2xl border border-dashed border-border p-6">
                <div className="size-12 rounded-2xl bg-muted/60 grid place-items-center mx-auto text-muted-foreground">
                  <Activity className="size-6 text-primary/60" />
                </div>
                <h4 className="text-sm font-bold text-foreground">
                  Nenhum evento registrado ainda
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Este painel exibe estritamente <strong>dados reais</strong>. Conforme os visitantes navegarem, clicarem em botões e se cadastrarem no GlobalLove.com, os registros aparecerão aqui instantaneamente.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-2">
                {eventsFeed.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border/50 hover:bg-muted/70 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-xl bg-card border border-border text-sm shrink-0">
                        {ev.tipo === 'cadastro' && '📝'}
                        {ev.tipo === 'clique' && '👆'}
                        {ev.tipo === 'match' && '💖'}
                        {ev.tipo === 'video_chamada' && '📹'}
                        {ev.tipo === 'mensagem' && '💬'}
                        {ev.tipo === 'visita_pagina' && '🌐'}
                      </span>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-foreground">
                          {ev.detalhe}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" /> {ev.timestamp}
                          </span>
                          {ev.pais && (
                            <>
                              <span>•</span>
                              <span>{ev.bandeira} {ev.pais}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                      {ev.tipo}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Real-time Click Insights & Platform Status */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
              <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600" />
                Auditoria e Integridade dos Dados
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40">
                  <span className="text-muted-foreground">Regra de Exibição:</span>
                  <span className="font-bold text-emerald-600">Apenas Dados 100% Reais</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40">
                  <span className="text-muted-foreground">Simulações Automáticas:</span>
                  <span className="font-bold text-rose-600">Desativadas</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40">
                  <span className="text-muted-foreground">Acesso Demo 1-Clique:</span>
                  <span className="font-bold text-rose-600">Removido (Cadastro Obrigatório)</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40">
                  <span className="text-muted-foreground">Domínio Principal:</span>
                  <span className="font-bold text-foreground">globallove.com</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40">
                  <span className="text-muted-foreground">Países com Cobertura SEO:</span>
                  <span className="font-bold text-foreground">92 países globais</span>
                </div>
              </div>
            </div>

            {/* Reset / Fresh Audit Option */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <RotateCcw className="size-3.5 text-primary" />
                Gerenciar Registros de Auditoria
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Você pode reiniciar o contador de cliques e a lista de eventos reais a qualquer momento para iniciar uma nova medição limpa.
              </p>
              {resetSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 text-xs font-bold text-center">
                  Contadores reiniciados com sucesso!
                </div>
              )}
              <button
                type="button"
                onClick={handleResetMetrics}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-border bg-muted/50 hover:bg-muted text-xs font-bold text-foreground transition active:scale-95"
              >
                <RotateCcw className="size-4 text-muted-foreground" />
                Zerar Contadores para Nova Medição
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Registered Users Management */}
      {activeTab === 'usuarios' && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">
                Gestão de Usuários Cadastrados
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {registeredUsersList.length} perfis reais registrados no banco com verificação obrigatória.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar nome, e-mail ou país..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-full border border-border bg-background pl-9 pr-4 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-48 sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="todos">Todos Status</option>
                <option value="ativo">Apenas Ativos</option>
                <option value="suspenso">Apenas Suspensos</option>
              </select>
            </div>
          </div>

          {/* Users Table / Grid */}
          {filteredUsers.length === 0 ? (
            <div className="py-14 text-center rounded-2xl border border-dashed border-border p-6 space-y-3">
              <div className="size-12 rounded-2xl bg-muted/60 grid place-items-center mx-auto text-muted-foreground">
                <Users className="size-6 text-primary/60" />
              </div>
              <h4 className="text-sm font-bold text-foreground">
                Nenhum usuário cadastrado até o momento
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                O acesso demo foi desativado e o <strong>cadastro com dados reais tornou-se obrigatório</strong>. Conforme os visitantes preencherem o formulário, eles aparecerão aqui com dados completos, fotos e cliques recebidos.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/60 gap-4 hover:bg-muted/50 transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="relative size-12 rounded-2xl overflow-hidden border border-border shrink-0">
                      <img src={u.fotoUrl} alt={u.nome} className="size-full object-cover" />
                      {u.verificado && (
                        <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-background"></span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{u.nome}, {u.idade}</span>
                        <span className="text-xs">{u.bandeira}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.status === 'ativo' ? 'bg-emerald-500/15 text-emerald-700' : 'bg-rose-500/15 text-rose-700'
                        }`}>
                          {u.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {u.email} • {u.generoRotulo} • {u.cidade}, {u.pais}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Cadastrado: {u.dataCadastro} • {u.totalCliquesRecebidos} cliques recebidos
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        u.status === 'ativo'
                          ? 'bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border border-emerald-500/30'
                      }`}
                    >
                      {u.status === 'ativo' ? 'Suspender' : 'Reativar'}
                    </button>

                    <button
                      onClick={() => deleteRegisteredUser(u.id)}
                      className="p-2 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Excluir cadastro"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Admin Profile Management */}
      {activeTab === 'perfil_adm' && (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft max-w-2xl mx-auto space-y-6">
          <div className="border-b border-border pb-4">
            <h3 className="font-display text-xl font-bold text-foreground">
              Configuração do Perfil de Administrador
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Personalize o seu perfil administrativo com nome, foto, e-mail e nível de controle master.
            </p>
          </div>

          <form onSubmit={handleSaveAdminProfile} className="space-y-5">
            {/* Admin Photo */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Foto do Administrador
              </label>
              <div className="flex items-center gap-4">
                <div className="size-20 rounded-2xl overflow-hidden border-2 border-primary shadow-soft shrink-0">
                  <img src={adminFotoUrl} alt={adminNome} className="size-full object-cover" />
                </div>
                <div className="flex-1">
                  <input
                    type="url"
                    value={adminFotoUrl}
                    onChange={(e) => setAdminFotoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Insira a URL de uma foto profissional para seu crachá de Administrador.
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Name */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Nome do Administrador
              </label>
              <input
                type="text"
                required
                value={adminNome}
                onChange={(e) => setAdminNome(e.target.value)}
                placeholder="Ex: Joeliton Administrador"
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Admin Email */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                E-mail de Acesso Administrador
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="joeliton.cacoal@gmail.com"
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Admin Cargo / Title */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Cargo / Função
              </label>
              <input
                type="text"
                required
                value={adminCargo}
                onChange={(e) => setAdminCargo(e.target.value)}
                placeholder="Ex: Fundador & Diretor Geral do GlobalLove.com"
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Admin Access Level */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Nível de Acesso
              </label>
              <select
                value={adminNivelAcesso}
                onChange={(e) => setAdminNivelAcesso(e.target.value as any)}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="SuperAdmin">👑 Super Administrador (Acesso Total & Ilimitado)</option>
                <option value="Moderador">🛡️ Moderador de Conteúdo</option>
              </select>
            </div>

            {saveSuccess && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl animate-in fade-in">
                <CheckCircle2 className="size-4 text-emerald-600" />
                Perfil de Administrador salvo com sucesso!
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-bold text-primary-foreground shadow-soft transition-transform active:scale-95"
            >
              <Save className="size-4" />
              Salvar Perfil de Administrador
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
