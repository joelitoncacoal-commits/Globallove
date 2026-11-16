import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Activity,
  Heart,
  Video,
  UserCheck,
  Search,
  Save,
  Download,
  Trash2,
  Lock,
  CheckCircle2,
  Clock,
  Flag,
  Mail,
  FileText,
  RefreshCw,
  Loader2,
  Camera,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { compressImageUpload } from '../utils/security';

export const Admin: React.FC = () => {
  const {
    isAdmin,
    isLoggedIn,
    adminProfile,
    adminLoading,
    refreshAdminData,
    updateAdminProfile,
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
    navigate,
    showToast,
  } = useApp();

  const [adminNome, setAdminNome] = useState(adminProfile.nome);
  const [adminEmail, setAdminEmail] = useState(adminProfile.email);
  const [adminCargo, setAdminCargo] = useState(adminProfile.cargo);
  const [adminFotoUrl, setAdminFotoUrl] = useState(adminProfile.fotoUrl);
  const [adminNivelAcesso, setAdminNivelAcesso] = useState(adminProfile.nivelAcesso);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'suspenso'>('todos');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'usuarios' | 'denuncias' | 'suporte' | 'auditoria' | 'perfil_adm'
  >('overview');

  const [confirmDeleteUser, setConfirmDeleteUser] = useState<{ id: string; nome: string } | null>(
    null
  );

  useEffect(() => {
    if (isAdmin) {
      void refreshAdminData();
    }
  }, [isAdmin, refreshAdminData]);

  useEffect(() => {
    setAdminNome(adminProfile.nome);
    setAdminEmail(adminProfile.email);
    setAdminCargo(adminProfile.cargo);
    setAdminFotoUrl(adminProfile.fotoUrl);
    setAdminNivelAcesso(adminProfile.nivelAcesso);
  }, [adminProfile]);

  // Strict RBAC Gate
  if (!isAdmin) {
    return (
      <div className="mx-auto flex min-h-[65vh] w-full max-w-lg flex-col items-center justify-center px-4 text-center">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-card space-y-4">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-600">
            <Lock className="size-7" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">
            Acesso Restrito à Administração
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Esta área é protegida por controle RBAC no servidor (Firestore Rules). Apenas contas autorizadas com e-mail verificado podem acessar dados de moderação.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {!isLoggedIn && (
              <button
                type="button"
                onClick={() => navigate('/entrar')}
                className="min-h-[44px] rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-soft"
              >
                Fazer Login Administrativo
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="min-h-[44px] rounded-full border border-border bg-background px-6 py-2.5 text-xs font-bold text-foreground hover:bg-muted"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredUsers = registeredUsersList.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      u.nome.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.cidade.toLowerCase().includes(q) ||
      u.pais.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'todos' || u.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleSaveAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAdminProfile({
        nome: adminNome.trim(),
        email: adminEmail.trim(),
        cargo: adminCargo.trim(),
        fotoUrl: adminFotoUrl,
        nivelAcesso: adminNivelAcesso,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao atualizar perfil adm.', 'error');
    }
  };

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      totals: {
        users: registeredUsersList.length,
        online: activeOnlineUsersCount,
        matches: totalMatchesCount,
        videoCalls: totalVideoCallsCount,
        openReports: adminReports.filter((r) => r.status === 'open').length,
        openTickets: adminTickets.filter((t) => t.status === 'open').length,
      },
      reports: adminReports,
      tickets: adminTickets,
      auditLogs: adminAuditLogs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria-globallove-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openReportsCount = adminReports.filter((r) => r.status === 'open').length;
  const openTicketsCount = adminTickets.filter((t) => t.status === 'open').length;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-8 pb-24 md:pb-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 text-xs font-bold text-emerald-700 mb-2">
            <ShieldAlert className="size-4 text-emerald-600" />
            <span>Painel RBAC Protegido</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
            Administração & Moderação
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Gestão de usuários, fila de denúncias, suporte LGPD e trilha imutável de auditoria no Firestore.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            disabled={adminLoading}
            onClick={() => void refreshAdminData()}
            className="min-h-[42px] inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-muted"
          >
            {adminLoading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            Atualizar
          </button>

          <button
            type="button"
            onClick={handleExportData}
            className="min-h-[42px] inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-muted"
          >
            <Download className="size-4 text-primary" />
            Exportar JSON
          </button>

          <div className="flex items-center gap-2.5 bg-card border border-border px-3 py-2 rounded-2xl">
            <img
              src={adminProfile.fotoUrl || '/icons/icon-192.webp'}
              alt={adminProfile.nome}
              className="size-9 rounded-xl object-cover"
            />
            <div>
              <p className="text-xs font-bold text-foreground">{adminProfile.nome}</p>
              <p className="text-[10px] font-semibold text-primary">{adminProfile.nivelAcesso}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-3xl bg-card border border-border shadow-soft">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Perfis Ativos</span>
            <Users className="size-5 text-emerald-600" />
          </div>
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            {registeredUsersList.length}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-soft">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Online</span>
            <Activity className="size-5 text-rose-500" />
          </div>
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            {activeOnlineUsersCount}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-soft">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Matches</span>
            <Heart className="size-5 text-pink-500" />
          </div>
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            {totalMatchesCount}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-soft">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Denúncias</span>
            <Flag className="size-5 text-amber-500" />
          </div>
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            {openReportsCount}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-soft col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Vídeo Salas</span>
            <Video className="size-5 text-primary" />
          </div>
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            {totalVideoCallsCount}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto border-b border-border pb-2">
        {[
          { id: 'overview', label: 'Eventos', icon: Activity },
          { id: 'usuarios', label: `Usuários (${registeredUsersList.length})`, icon: Users },
          { id: 'denuncias', label: `Denúncias (${openReportsCount})`, icon: Flag },
          { id: 'suporte', label: `Suporte (${openTicketsCount})`, icon: Mail },
          { id: 'auditoria', label: `Auditoria (${adminAuditLogs.length})`, icon: FileText },
          { id: 'perfil_adm', label: 'Perfil Adm', icon: UserCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex min-h-[42px] items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
                active
                  ? 'bg-brand text-primary-foreground shadow-soft'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Overview / Platform Events */}
      {activeTab === 'overview' && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h2 className="font-display text-lg font-bold text-foreground">
            Registro de Eventos da Plataforma
          </h2>
          {eventsFeed.length === 0 ? (
            <p className="text-xs text-muted-foreground py-8 text-center">
              Nenhum evento registrado ainda no Firestore.
            </p>
          ) : (
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {eventsFeed.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border/60"
                >
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground">{ev.detalhe}</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Clock className="size-3" /> {ev.timestamp}
                      {ev.pais && ` • ${ev.bandeira || ''} ${ev.pais}`}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">
                    {ev.tipo}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Users Management */}
      {activeTab === 'usuarios' && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-foreground">
              Usuários Registrados ({registeredUsersList.length})
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar nome, e-mail, país..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="min-h-[42px] rounded-full border border-border bg-background pl-9 pr-4 py-2 text-xs text-foreground w-56"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="min-h-[42px] rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground"
              >
                <option value="todos">Todos Status</option>
                <option value="ativo">Ativos</option>
                <option value="suspenso">Suspensos</option>
              </select>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <p className="py-10 text-center text-xs text-muted-foreground">
              Nenhum usuário encontrado para o filtro selecionado.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/60 gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={u.fotoUrl || '/icons/icon-192.webp'}
                      alt={u.nome}
                      className="size-12 rounded-2xl object-cover border border-border shrink-0 bg-muted"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-foreground truncate">
                          {u.nome}, {u.idade}
                        </span>
                        <span className="text-xs">{u.bandeira}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            u.status === 'ativo'
                              ? 'bg-emerald-500/15 text-emerald-700'
                              : 'bg-rose-500/15 text-rose-700'
                          }`}
                        >
                          {u.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {u.email ? `${u.email} • ` : ''}
                        {u.cidade}, {u.pais}
                      </p>
                      <p className="text-[11px] text-muted-foreground">Cadastro: {u.dataCadastro}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => void toggleUserStatus(u.id)}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        u.status === 'ativo'
                          ? 'bg-amber-500/15 text-amber-700 border-amber-500/30 hover:bg-amber-500/25'
                          : 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/25'
                      }`}
                    >
                      {u.status === 'ativo' ? 'Suspender' : 'Reativar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteUser({ id: u.id, nome: u.nome })}
                      aria-label={`Excluir ${u.nome}`}
                      className="grid min-h-[38px] min-w-[38px] place-items-center rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
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

      {/* TAB 3: Moderation Reports */}
      {activeTab === 'denuncias' && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h2 className="font-display text-lg font-bold text-foreground">
            Fila de Denúncias ({adminReports.length})
          </h2>
          {adminReports.length === 0 ? (
            <p className="text-xs text-muted-foreground py-8 text-center">
              Nenhuma denúncia registrada até o momento.
            </p>
          ) : (
            <div className="space-y-3">
              {adminReports.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase text-rose-600 bg-rose-500/10 px-2.5 py-1 rounded-full">
                      {r.category}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Status: <strong className="text-foreground">{r.status}</strong> • {r.createdAt}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{r.description}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Alvo: {r.reportedUid} • Denunciante: {r.reporterUid}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => void updateReportStatus(r.id, 'reviewing')}
                      className="min-h-[36px] rounded-xl border border-border bg-card px-3 py-1 text-xs font-semibold hover:bg-muted"
                    >
                      Em análise
                    </button>
                    <button
                      type="button"
                      onClick={() => void updateReportStatus(r.id, 'resolved')}
                      className="min-h-[36px] rounded-xl bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      Marcar Resolvida
                    </button>
                    <button
                      type="button"
                      onClick={() => void updateReportStatus(r.id, 'dismissed')}
                      className="min-h-[36px] rounded-xl border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted"
                    >
                      Arquivar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Support Tickets */}
      {activeTab === 'suporte' && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h2 className="font-display text-lg font-bold text-foreground">
            Chamados de Suporte ({adminTickets.length})
          </h2>
          {adminTickets.length === 0 ? (
            <p className="text-xs text-muted-foreground py-8 text-center">
              Nenhum chamado de contato aberto.
            </p>
          ) : (
            <div className="space-y-3">
              {adminTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-foreground">{ticket.assunto}</h3>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        ticket.status === 'resolved'
                          ? 'bg-emerald-500/15 text-emerald-700'
                          : 'bg-amber-500/15 text-amber-700'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {ticket.nome} ({ticket.email}) • {ticket.createdAt}
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">{ticket.mensagem}</p>
                  {ticket.status !== 'resolved' && (
                    <button
                      type="button"
                      onClick={() => void resolveSupportTicket(ticket.id)}
                      className="mt-2 min-h-[36px] rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground"
                    >
                      Marcar como Resolvido
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Immutable Admin Audit Logs */}
      {activeTab === 'auditoria' && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h2 className="font-display text-lg font-bold text-foreground">
            Trilha Imutável de Auditoria Administrativa
          </h2>
          {adminAuditLogs.length === 0 ? (
            <p className="text-xs text-muted-foreground py-8 text-center">
              Nenhuma ação administrativa registrada ainda.
            </p>
          ) : (
            <div className="space-y-2.5">
              {adminAuditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-border bg-muted/30 p-3.5 text-xs"
                >
                  <div>
                    <span className="font-bold text-primary mr-2">{log.action}</span>
                    <span className="text-foreground">{log.details}</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Admin: {log.actorEmail} • Alvo: {log.targetId}
                    </p>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0">{log.createdAt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: Admin Profile */}
      {activeTab === 'perfil_adm' && (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft max-w-2xl mx-auto space-y-6">
          <h2 className="font-display text-xl font-bold text-foreground border-b border-border pb-3">
            Configuração do Perfil de Administrador
          </h2>
          <form onSubmit={(e) => void handleSaveAdminProfile(e)} className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={adminFotoUrl || '/icons/icon-192.webp'}
                alt={adminNome}
                className="size-16 rounded-2xl object-cover border border-border shrink-0 bg-muted"
              />
              <label className="min-h-[42px] inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-muted px-4 py-2 text-xs font-bold text-foreground">
                <Camera className="size-4 text-primary" />
                Alterar foto do perfil
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    try {
                      const compressed = await compressImageUpload(f, 512, 160000);
                      setAdminFotoUrl(compressed);
                    } catch (err) {
                      showToast(err instanceof Error ? err.message : 'Erro na foto.', 'error');
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Nome</label>
              <input
                type="text"
                required
                value={adminNome}
                onChange={(e) => setAdminNome(e.target.value)}
                className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">E-mail</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Cargo</label>
              <input
                type="text"
                required
                value={adminCargo}
                onChange={(e) => setAdminCargo(e.target.value)}
                className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Nível</label>
              <select
                value={adminNivelAcesso}
                onChange={(e) =>
                  setAdminNivelAcesso(e.target.value === 'Moderador' ? 'Moderador' : 'SuperAdmin')
                }
                className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2 text-sm font-semibold"
              >
                <option value="SuperAdmin">SuperAdmin</option>
                <option value="Moderador">Moderador</option>
              </select>
            </div>

            {saveSuccess && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl">
                <CheckCircle2 className="size-4" /> Perfil administrativo salvo e auditado!
              </div>
            )}

            <button
              type="submit"
              className="w-full min-h-[46px] flex items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-bold text-primary-foreground shadow-soft"
            >
              <Save className="size-4" /> Salvar Perfil de Administrador
            </button>
          </form>
        </div>
      )}

      <ConfirmModal
        open={Boolean(confirmDeleteUser)}
        title={`Remover conta de ${confirmDeleteUser?.nome || ''}?`}
        description="Esta ação removerá o perfil público, dados privados e registrará a exclusão nos logs imutáveis de auditoria."
        confirmLabel="Remover Usuário"
        destructive
        requireTypedWord="REMOVER"
        onCancel={() => setConfirmDeleteUser(null)}
        onConfirm={async () => {
          if (!confirmDeleteUser) return;
          await deleteRegisteredUser(confirmDeleteUser.id);
          setConfirmDeleteUser(null);
        }}
      />
    </div>
  );
};
