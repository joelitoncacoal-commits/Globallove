import React, { useState } from 'react';
import { Mail, MessageCircle, Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Contato: React.FC = () => {
  const { navigate } = useApp();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [assunto, setAssunto] = useState('Dúvida sobre o app');
  const [mensagem, setMensagem] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim()) return;
    setEnviado(true);
    setTimeout(() => {
      setMensagem('');
    }, 2000);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-12">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3 self-start">
        <Mail className="size-3.5" /> Suporte & Atendimento
      </div>

      <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        Fale com a Equipe GlobalLove.com
      </h1>

      <p className="mt-4 text-base text-muted-foreground leading-relaxed">
        Dentro da plataforma existe o perfil oficial <strong className="text-foreground">Equipe GlobalLove.com</strong>. Você também pode nos enviar uma mensagem diretamente pelo formulário abaixo para tirar dúvidas, sugerir melhorias ou avisar sobre perfis suspeitos.
      </p>

      {/* Official Channel Card */}
      <div className="mt-8 rounded-3xl border border-primary/30 bg-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-brand text-primary-foreground shadow-soft">
            <Sparkles className="size-6" />
          </span>
          <div>
            <h3 className="font-display font-bold text-foreground">
              Canal Oficial Equipe GlobalLove.com
            </h3>
            <p className="text-xs text-muted-foreground">
              Atendimento disponível todos os dias para suporte ao usuário.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/descobrir')}
          className="rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-soft active:scale-95 shrink-0"
        >
          Conversar pelo App
        </button>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-4">
        <h3 className="font-display text-xl font-bold text-foreground">
          Envie sua mensagem
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Seu Nome
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Como podemos te chamar"
              className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Seu E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@globallove.com"
              className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
            className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="Dúvida sobre o app">Dúvida sobre como funciona o app</option>
            <option value="Denúncia de perfil">Denunciar perfil suspeito ou fraudulento</option>
            <option value="Sugestão de melhoria">Sugestão de funcionalidade ou melhoria</option>
            <option value="Plano Premium">Dúvida sobre pagamento ou Plano Premium</option>
            <option value="Outro">Outro assunto</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Mensagem
          </label>
          <textarea
            required
            rows={4}
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Descreva detalhadamente como podemos te ajudar..."
            className="mt-1.5 w-full rounded-2xl border border-border bg-background p-4 text-sm text-foreground leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {enviado && (
          <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-center text-xs font-bold text-emerald-700 animate-in fade-in">
            ✓ Mensagem enviada com sucesso! Nossa equipe responderá em até 24 horas úteis.
          </div>
        )}

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-soft transition-transform active:scale-95"
        >
          <Send className="size-4" /> Enviar Mensagem
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Em situações de perigo imediato ou emergência presencial, procure os serviços de segurança pública do seu país.
      </p>
    </div>
  );
};
