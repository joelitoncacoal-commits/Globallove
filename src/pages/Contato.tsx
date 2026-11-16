import React, { useState } from 'react';
import { Mail, Send, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Contato: React.FC = () => {
  const { navigate, isLoggedIn, user, submitSupportTicket } = useApp();

  const [nome, setNome] = useState(user.nome || '');
  const [email, setEmail] = useState(user.email || '');
  const [assunto, setAssunto] = useState('Dúvida sobre o app');
  const [mensagem, setMensagem] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || mensagem.trim().length < 10) {
      setErrorMsg('Preencha nome, e-mail válido e uma mensagem com pelo menos 10 caracteres.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      const id = await submitSupportTicket({
        nome: nome.trim(),
        email: email.trim(),
        assunto,
        mensagem: mensagem.trim(),
      });
      setTicketId(id);
      setMensagem('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao enviar solicitação de suporte.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-12 pb-24 md:pb-12">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3 self-start">
        <Mail className="size-3.5" /> Suporte & Atendimento
      </div>

      <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        Fale com a Equipe GlobalLove.com
      </h1>

      <p className="mt-4 text-base text-muted-foreground leading-relaxed">
        Precisa de ajuda, quer relatar comportamento suspeito, exercer direitos da LGPD ou sugerir melhorias? Envie seu chamado diretamente para nossa equipe de moderação e suporte.
      </p>

      {/* Official Channel Card */}
      <div className="mt-8 rounded-3xl border border-primary/30 bg-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-brand text-primary-foreground shadow-soft shrink-0">
            <Sparkles className="size-6" />
          </span>
          <div>
            <h2 className="font-display font-bold text-foreground">
              Central de Segurança & Suporte GlobalLove.com
            </h2>
            <p className="text-xs text-muted-foreground">
              Chamados persistidos e analisados pela moderação administrativa.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(isLoggedIn ? '/descobrir' : '/entrar')}
          className="min-h-[44px] rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-soft active:scale-95 shrink-0"
        >
          {isLoggedIn ? 'Voltar ao Descobrir' : 'Acessar Conta'}
        </button>
      </div>

      {/* Contact Form */}
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-4"
      >
        <h3 className="font-display text-xl font-bold text-foreground">Envie sua mensagem</h3>

        {errorMsg && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-700">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Seu Nome *
            </label>
            <input
              type="text"
              required
              maxLength={80}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Como podemos te chamar"
              className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Seu E-mail *
            </label>
            <input
              type="email"
              required
              maxLength={120}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@dominio.com"
              className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Motivo do Contato
          </label>
          <select
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
            className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="Dúvida sobre o app">Dúvida sobre como funciona a plataforma</option>
            <option value="Denúncia de perfil">Denunciar perfil suspeito ou fraudulento</option>
            <option value="Privacidade LGPD">Solicitação de privacidade / dados LGPD</option>
            <option value="Sugestão de melhoria">Sugestão de funcionalidade ou melhoria</option>
            <option value="Outro">Outro assunto</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Mensagem *
          </label>
          <textarea
            required
            minLength={10}
            maxLength={2000}
            rows={4}
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Descreva detalhadamente como podemos ajudar..."
            className="mt-1.5 w-full rounded-2xl border border-border bg-background p-4 text-sm text-foreground leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {ticketId && (
          <div className="flex items-start gap-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
            <span>
              Chamado registrado com sucesso! Protocolo: <span className="font-mono">{ticketId}</span>. Nossa equipe responderá por e-mail em até 24 horas úteis.
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="min-h-[46px] flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-soft transition-transform active:scale-95 disabled:opacity-50"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          Enviar Solicitação
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Em situações de risco imediato ou emergência presencial, procure os serviços de segurança pública do seu país.
      </p>
    </div>
  );
};
