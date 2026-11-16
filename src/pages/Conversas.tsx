import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  ArrowLeft,
  CheckCheck,
  Sparkles,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Video,
  Paperclip,
  Play,
  Pause,
  Flag,
  ShieldBan,
  Loader2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VideoCallModal } from '../components/chat/VideoCallModal';
import { MediaAttachmentModal } from '../components/chat/MediaAttachmentModal';
import { ReportModal } from '../components/modals/ReportModal';
import { ConfirmModal } from '../components/modals/ConfirmModal';

export const Conversas: React.FC = () => {
  const {
    user,
    matches,
    messages,
    setActiveChatMatchId,
    markMatchAsRead,
    sendMessage,
    sendMediaMessage,
    blockUser,
    showToast,
    currentRoute,
    navigate,
    activeVideoCall,
    startVideoCall,
    endVideoCall,
    t,
  } = useApp();

  const routeParts = currentRoute.split('/');
  const routeMatchId = routeParts.length > 2 && routeParts[1] === 'conversas' ? routeParts[2] : null;

  const [selectedMatchId, setSelectedMatchId] = useState<string>(() => {
    if (routeMatchId) return routeMatchId;
    return matches.length > 0 ? matches[0].id : '';
  });

  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioElementsRef = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    if (routeMatchId && routeMatchId !== selectedMatchId) {
      setSelectedMatchId(routeMatchId);
    } else if (!routeMatchId && !selectedMatchId && matches.length > 0) {
      setSelectedMatchId(matches[0].id);
    }
  }, [routeMatchId, selectedMatchId, matches]);

  const activeMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];
  const activeChatMessages = activeMatch ? messages[activeMatch.id] || [] : [];

  // Bind Firestore message listener & mark conversation read
  useEffect(() => {
    const id = activeMatch?.id || null;
    setActiveChatMatchId(id);
    return () => {
      setActiveChatMatchId(null);
    };
  }, [activeMatch?.id, setActiveChatMatchId]);

  useEffect(() => {
    if (!activeMatch) return;
    if ((activeMatch.unreadCount || 0) > 0 || activeChatMessages.some((m) => (m.senderId || m.autorId) !== user.id && !m.lida)) {
      void markMatchAsRead(activeMatch.id);
    }
  }, [activeMatch, activeChatMessages, user.id, markMatchAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatMessages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeMatch || sending) return;

    const text = inputMessage.trim();
    setSending(true);
    try {
      await sendMessage(activeMatch.id, text);
      setInputMessage('');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao enviar mensagem.', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleQuickIcebreaker = async (icebreaker: string) => {
    if (!activeMatch || sending) return;
    setSending(true);
    try {
      await sendMessage(activeMatch.id, icebreaker);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao enviar mensagem.', 'error');
    } finally {
      setSending(false);
    }
  };

  const toggleAudio = (msgId: string, url: string) => {
    if (playingAudioId === msgId) {
      audioElementsRef.current[msgId]?.pause();
      setPlayingAudioId(null);
    } else {
      if (playingAudioId && audioElementsRef.current[playingAudioId]) {
        audioElementsRef.current[playingAudioId].pause();
      }
      if (!audioElementsRef.current[msgId]) {
        audioElementsRef.current[msgId] = new Audio(url);
        audioElementsRef.current[msgId].onended = () => setPlayingAudioId(null);
      }
      void audioElementsRef.current[msgId].play();
      setPlayingAudioId(msgId);
    }
  };

  if (matches.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-20 text-center">
        <div className="grid size-16 place-items-center rounded-3xl bg-primary/10 text-primary mb-4">
          <Sparkles className="size-8" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Nenhuma conversa ativa
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          As conversas são liberadas automaticamente quando ocorre um match mútuo.
        </p>
        <button
          type="button"
          onClick={() => navigate('/descobrir')}
          className="mt-6 min-h-[44px] rounded-full bg-brand px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft"
        >
          {t.nav.discover}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-8.5rem)] md:h-[calc(100vh-5rem)] w-full max-w-6xl overflow-hidden border-x border-border bg-card">
      {/* Sidebar: Matches Conversations List */}
      <div
        className={`w-full sm:w-80 md:w-96 flex-col border-r border-border bg-background shrink-0 ${
          routeMatchId ? 'hidden sm:flex' : 'flex'
        }`}
      >
        <div className="border-b border-border p-4">
          <h1 className="font-display text-xl font-bold text-foreground">{t.nav.chats}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {matches.length} conversas ativas
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/40">
          {matches.map((item) => {
            const isSelected = item.id === activeMatch?.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedMatchId(item.id);
                  navigate(`/conversas/${item.id}`);
                }}
                className={`flex min-h-[68px] w-full items-center gap-3.5 p-4 text-left transition-colors ${
                  isSelected ? 'bg-primary/10' : 'hover:bg-muted/70'
                }`}
              >
                <div className="relative size-12 overflow-hidden rounded-full shrink-0 shadow-soft bg-muted">
                  <img
                    src={item.profile.fotos[0] || '/icons/icon-192.webp'}
                    alt={item.profile.nome}
                    className="size-full object-cover"
                  />
                  {item.profile.online && (
                    <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-background" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-foreground truncate text-sm flex items-center gap-1">
                      {item.profile.nome}
                      <span className="text-xs">{item.profile.bandeira}</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {item.createdAt}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground truncate">
                    {item.lastMessage || 'Vocês deram match! Diga oi.'}
                  </p>
                </div>

                {item.unreadCount && item.unreadCount > 0 ? (
                  <span className="grid size-5 place-items-center rounded-full bg-coral text-[10px] font-bold text-white shrink-0">
                    {item.unreadCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Box */}
      {activeMatch ? (
        <div className={`flex flex-1 flex-col bg-card ${!routeMatchId ? 'hidden sm:flex' : 'flex'}`}>
          {/* Chat Header */}
          <div className="flex items-center justify-between gap-2 border-b border-border bg-background/80 px-3 sm:px-4 py-2.5 backdrop-blur-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => navigate('/conversas')}
                aria-label="Voltar para conversas"
                className="grid min-h-[44px] min-w-[44px] place-items-center rounded-full text-muted-foreground hover:bg-muted sm:hidden shrink-0"
              >
                <ArrowLeft className="size-5" />
              </button>

              <div className="relative size-10 overflow-hidden rounded-full shadow-soft ring-1 ring-border shrink-0 bg-muted">
                <img
                  src={activeMatch.profile.fotos[0] || '/icons/icon-192.webp'}
                  alt={activeMatch.profile.nome}
                  className="size-full object-cover"
                />
                {activeMatch.profile.online && (
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-foreground text-sm truncate">
                    {activeMatch.profile.nome}, {activeMatch.profile.idade}
                  </span>
                  {activeMatch.profile.emailVerified && (
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  )}
                  <span className="text-xs shrink-0">{activeMatch.profile.bandeira}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="size-3 shrink-0" />
                    {activeMatch.profile.cidade || activeMatch.profile.pais}
                    {activeMatch.profile.distanciaConhecida && (
                      <span className="text-[10px] text-primary font-medium">
                        (~{activeMatch.profile.distanciaKm} km)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Video Call, Report & Block Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => void startVideoCall(activeMatch.profile)}
                className="flex min-h-[40px] items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-semibold shadow-sm active:scale-95 transition"
                title={t.chat.startVideoCall}
              >
                <Video className="size-3.5" />
                <span className="hidden md:inline">{t.chat.startVideoCall}</span>
              </button>

              <button
                type="button"
                onClick={() => setReportOpen(true)}
                aria-label="Denunciar usuário"
                title="Denunciar"
                className="grid min-h-[40px] min-w-[40px] place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-rose-600 transition-colors"
              >
                <Flag className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => setBlockOpen(true)}
                aria-label="Bloquear usuário"
                title="Bloquear"
                className="grid min-h-[40px] min-w-[40px] place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-rose-600 transition-colors"
              >
                <ShieldBan className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/seguranca')}
                aria-label="Dicas de segurança"
                title="Dicas de segurança"
                className="hidden sm:grid min-h-[40px] min-w-[40px] place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <ShieldCheck className="size-4 text-primary" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-muted/20">
            <div className="mx-auto my-2 max-w-sm rounded-2xl bg-muted/80 p-3 text-center text-xs text-muted-foreground border border-border/50">
              <Sparkles className="size-4 text-primary inline mr-1" />
              Conversa privada 100% gratuita e protegida. Nunca compartilhe senhas ou dados bancários.
            </div>

            {activeChatMessages.map((msg) => {
              const isMe = (msg.senderId || msg.autorId) === user.id;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] sm:max-w-md rounded-2xl p-3 shadow-soft ${
                      isMe
                        ? 'bg-brand text-primary-foreground rounded-br-xs'
                        : 'bg-card text-foreground border border-border rounded-bl-xs'
                    }`}
                  >
                    {msg.tipo === 'imagem' && msg.midiaUrl && (
                      <div
                        className="mb-2 rounded-xl overflow-hidden cursor-pointer"
                        onClick={() => setZoomedImage(msg.midiaUrl!)}
                      >
                        <img
                          src={msg.midiaUrl}
                          alt="Foto compartilhada"
                          className="w-full max-h-60 object-cover"
                        />
                      </div>
                    )}

                    {msg.tipo === 'video' && msg.midiaUrl && (
                      <div className="mb-2 rounded-xl overflow-hidden bg-black">
                        <video src={msg.midiaUrl} controls playsInline className="w-full max-h-60 object-cover" />
                      </div>
                    )}

                    {msg.tipo === 'audio' && msg.midiaUrl && (
                      <div className="flex items-center gap-3 py-1">
                        <button
                          type="button"
                          onClick={() => toggleAudio(msg.id, msg.midiaUrl!)}
                          aria-label={playingAudioId === msg.id ? 'Pausar áudio' : 'Tocar áudio'}
                          className={`p-2.5 rounded-full transition ${
                            isMe ? 'bg-white/20 text-white' : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          {playingAudioId === msg.id ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>
                        <span className="text-xs font-medium">Mensagem de voz</span>
                        <span className="text-[11px] opacity-80 font-mono">
                          {msg.duracaoAudio || '0:05'}
                        </span>
                      </div>
                    )}

                    {msg.texto && (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.texto}
                      </p>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground px-1">
                    <span>{msg.hora}</span>
                    {isMe && <CheckCheck className={`size-3 ${msg.lida ? 'text-primary' : 'text-muted-foreground'}`} />}
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Icebreakers */}
          <div className="border-t border-border/50 bg-background/50 px-4 py-2 overflow-x-auto flex items-center gap-2 text-xs shrink-0">
            <span className="text-[11px] text-muted-foreground font-semibold shrink-0">
              Puxar assunto:
            </span>
            {[
              'Qual o seu café preferido por aí? ☕',
              'Qual lugar do mundo você sonha conhecer? ✈️',
              'Que afinidade legal temos em comum! ✨',
            ].map((ice, i) => (
              <button
                key={i}
                type="button"
                disabled={sending}
                onClick={() => void handleQuickIcebreaker(ice)}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary/40 whitespace-nowrap transition-colors"
              >
                {ice}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={(e) => void handleSend(e)} className="flex items-center gap-2 border-t border-border bg-background p-3">
            <button
              type="button"
              onClick={() => setMediaModalOpen(true)}
              aria-label="Anexar foto, vídeo ou áudio"
              className="grid size-11 place-items-center rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors shrink-0"
              title="Anexar foto, vídeo ou áudio"
            >
              <Paperclip className="size-5" />
            </button>

            <input
              type="text"
              maxLength={2000}
              placeholder={`Escreva para ${activeMatch.profile.nome}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 min-h-[44px] rounded-full border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || sending}
              aria-label="Enviar mensagem"
              className="grid size-11 place-items-center rounded-full bg-brand text-primary-foreground shadow-soft transition-transform active:scale-95 disabled:opacity-40 shrink-0"
            >
              {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4.5" />}
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-8 text-center text-muted-foreground">
          Selecione uma conversa ao lado para começar.
        </div>
      )}

      {activeVideoCall && <VideoCallModal profile={activeVideoCall} onClose={endVideoCall} />}

      {mediaModalOpen && activeMatch && (
        <MediaAttachmentModal
          onClose={() => setMediaModalOpen(false)}
          onSendMedia={async (params) => {
            await sendMediaMessage(activeMatch.id, params);
          }}
        />
      )}

      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomedImage(null)}
        >
          <img
            src={zoomedImage}
            alt="Foto em tamanho grande"
            className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}

      {activeMatch && (
        <>
          <ReportModal
            open={reportOpen}
            targetUid={activeMatch.profile.id}
            targetName={activeMatch.profile.nome}
            onClose={() => setReportOpen(false)}
          />
          <ConfirmModal
            open={blockOpen}
            title={`Bloquear ${activeMatch.profile.nome}?`}
            description="Ao bloquear, esta conversa é encerrada imediatamente e a pessoa não poderá mais enviar mensagens ou visualizar seu perfil."
            confirmLabel="Bloquear agora"
            destructive
            onCancel={() => setBlockOpen(false)}
            onConfirm={async () => {
              await blockUser(activeMatch.profile.id, 'Bloqueado no chat');
              setBlockOpen(false);
              navigate('/conversas');
            }}
          />
        </>
      )}
    </div>
  );
};
