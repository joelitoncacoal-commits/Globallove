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
  Image as ImageIcon,
  Film
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VideoCallModal } from '../components/chat/VideoCallModal';
import { MediaAttachmentModal } from '../components/chat/MediaAttachmentModal';

export const Conversas: React.FC = () => {
  const {
    matches,
    messages,
    sendMessage,
    sendMediaMessage,
    currentRoute,
    navigate,
    activeVideoCall,
    startVideoCall,
    endVideoCall,
    t
  } = useApp();

  const routeParts = currentRoute.split('/');
  const routeMatchId = routeParts.length > 2 && routeParts[1] === 'conversas' ? routeParts[2] : null;

  const [activeMatchId, setActiveMatchId] = useState<string>(() => {
    if (routeMatchId) return routeMatchId;
    return matches.length > 0 ? matches[0].id : '';
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioElementsRef = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    if (routeMatchId && routeMatchId !== activeMatchId) {
      setActiveMatchId(routeMatchId);
    }
  }, [routeMatchId, activeMatchId]);

  const activeMatch = matches.find(m => m.id === activeMatchId) || matches[0];
  const activeChatMessages = activeMatch ? messages[activeMatch.id] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeMatch) return;

    const text = inputMessage.trim();
    setInputMessage('');
    sendMessage(activeMatch.id, text);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickIcebreaker = (icebreaker: string) => {
    if (!activeMatch) return;
    sendMessage(activeMatch.id, icebreaker);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
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
      audioElementsRef.current[msgId].play();
      setPlayingAudioId(msgId);
    }
  };

  if (matches.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-20 text-center">
        <div className="grid size-16 place-items-center rounded-3xl bg-primary/10 text-primary mb-4">
          <Sparkles className="size-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Nenhuma conversa ativa
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          As conversas são liberadas automaticamente quando ocorre um match mútuo.
        </p>
        <button
          onClick={() => navigate('/descobrir')}
          className="mt-6 rounded-full bg-brand px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft"
        >
          {t.nav.discover}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-5rem)] w-full max-w-6xl overflow-hidden border-x border-border bg-card">
      {/* Sidebar: Matches Conversations List */}
      <div
        className={`w-full sm:w-80 md:w-96 flex-col border-r border-border bg-background shrink-0 ${
          routeMatchId ? 'hidden sm:flex' : 'flex'
        }`}
      >
        <div className="border-b border-border p-4">
          <h2 className="font-display text-xl font-bold text-foreground">
            {t.nav.chats}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {matches.length} matches disponíveis
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/40">
          {matches.map((item) => {
            const isSelected = item.id === activeMatch?.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMatchId(item.id);
                  navigate(`/conversas/${item.id}`);
                }}
                className={`flex w-full items-center gap-3.5 p-4 text-left transition-colors ${
                  isSelected ? 'bg-primary/10' : 'hover:bg-muted/70'
                }`}
              >
                <div className="relative size-12 overflow-hidden rounded-full shrink-0 shadow-soft">
                  <img
                    src={item.profile.fotos[0]}
                    alt={item.profile.nome}
                    className="size-full object-cover"
                  />
                  {item.profile.online && (
                    <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-background" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-foreground truncate text-sm flex items-center gap-1">
                      {item.profile.nome}
                      <span className="text-xs">{item.profile.bandeira}</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {item.createdAt.includes('Hoje') ? 'Hoje' : 'Ontem'}
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
        <div
          className={`flex flex-1 flex-col bg-card ${
            !routeMatchId ? 'hidden sm:flex' : 'flex'
          }`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/conversas')}
                className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted sm:hidden"
              >
                <ArrowLeft className="size-5" />
              </button>

              <div className="relative size-10 overflow-hidden rounded-full shadow-soft ring-1 ring-border">
                <img
                  src={activeMatch.profile.fotos[0]}
                  alt={activeMatch.profile.nome}
                  className="size-full object-cover"
                />
                {activeMatch.profile.online && (
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-foreground text-sm">
                    {activeMatch.profile.nome}, {activeMatch.profile.idade}
                  </span>
                  <CheckCircle2 className="size-3.5 text-coral" />
                  <span className="text-xs">{activeMatch.profile.bandeira}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {activeMatch.profile.cidade}
                    <span className="text-[10px] text-primary font-medium">({activeMatch.profile.distanciaKm} km)</span>
                  </span>
                  <span>•</span>
                  {activeMatch.profile.online ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {t.discovery.onlineNow}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{activeMatch.profile.ultimoVisto || t.discovery.offline}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Video Call & Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => startVideoCall(activeMatch.profile)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-semibold shadow-md shadow-rose-500/20 active:scale-95 transition"
                title={t.chat.startVideoCall}
              >
                <Video className="size-3.5" />
                <span className="hidden sm:inline">{t.chat.startVideoCall}</span>
              </button>

              <button
                onClick={() => navigate('/seguranca')}
                className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Dicas de segurança"
              >
                <ShieldCheck className="size-4 text-primary" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-muted/20">
            {/* Match Notice */}
            <div className="mx-auto my-2 max-w-sm rounded-2xl bg-muted/80 p-3 text-center text-xs text-muted-foreground border border-border/50">
              <Sparkles className="size-4 text-primary inline mr-1" />
              Vocês deram match! Esta conversa é 100% gratuita, protegida e sem limites.
            </div>

            {/* Chat Bubbles */}
            {activeChatMessages.map((msg) => {
              const isMe = msg.autorId === 'eu';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md rounded-2xl p-3 shadow-soft ${
                      isMe
                        ? 'bg-brand text-primary-foreground rounded-br-xs'
                        : 'bg-card text-foreground border border-border rounded-bl-xs'
                    }`}
                  >
                    {/* Photo Message */}
                    {msg.tipo === 'imagem' && msg.midiaUrl && (
                      <div className="mb-2 rounded-xl overflow-hidden cursor-pointer" onClick={() => setZoomedImage(msg.midiaUrl!)}>
                        <img
                          src={msg.midiaUrl}
                          alt="Foto compartilhada"
                          className="w-full max-h-60 object-cover hover:scale-102 transition"
                        />
                      </div>
                    )}

                    {/* Video Message */}
                    {msg.tipo === 'video' && msg.midiaUrl && (
                      <div className="mb-2 rounded-xl overflow-hidden bg-black">
                        <video
                          src={msg.midiaUrl}
                          controls
                          playsInline
                          className="w-full max-h-60 object-cover"
                        />
                      </div>
                    )}

                    {/* Audio Note Message */}
                    {msg.tipo === 'audio' && msg.midiaUrl && (
                      <div className="flex items-center gap-3 py-1">
                        <button
                          type="button"
                          onClick={() => toggleAudio(msg.id, msg.midiaUrl!)}
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
                        <div className="flex-1 flex items-center gap-0.5 h-5">
                          {[30, 60, 40, 85, 70, 50, 90, 45, 80, 65, 30].map((h, i) => (
                            <div
                              key={i}
                              style={{ height: `${h}%` }}
                              className={`flex-1 rounded-full ${
                                isMe ? 'bg-white/80' : 'bg-primary/80'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] opacity-80 font-mono">
                          {msg.duracaoAudio || '0:07'}
                        </span>
                      </div>
                    )}

                    {/* Text Message */}
                    {msg.texto && (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.texto}
                      </p>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground px-1">
                    <span>{msg.hora}</span>
                    {isMe && <CheckCheck className="size-3 text-primary" />}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1 rounded-full bg-card border border-border px-3 py-2">
                  <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-1.5 rounded-full bg-primary animate-bounce" />
                </div>
                <span>{activeMatch.profile.nome} está digitando...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Icebreakers suggestions */}
          <div className="border-t border-border/50 bg-background/50 px-4 py-2 overflow-x-auto flex items-center gap-2 text-xs shrink-0">
            <span className="text-[11px] text-muted-foreground font-semibold shrink-0">
              Puxar assunto:
            </span>
            {[
              "Qual o seu café preferido por aí? ☕",
              "Vi que você ama viajar! Qual o próximo destino? ✈️",
              "Que afinidade maravilhosa temos em comum! ✨",
              "Topa fazer uma rápida vídeo chamada hoje? 🎥"
            ].map((ice, i) => (
              <button
                key={i}
                onClick={() => handleQuickIcebreaker(ice)}
                className="rounded-full border border-border bg-card px-3 py-1 text-muted-foreground hover:text-foreground hover:border-primary/40 whitespace-nowrap transition-colors"
              >
                {ice}
              </button>
            ))}
          </div>

          {/* Input Bar with Media Attachment */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-border bg-background p-3"
          >
            <button
              type="button"
              onClick={() => setMediaModalOpen(true)}
              className="grid size-10 place-items-center rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors shrink-0"
              title="Anexar foto, vídeo ou áudio"
            >
              <Paperclip className="size-5" />
            </button>

            <input
              type="text"
              placeholder={`Escreva uma mensagem para ${activeMatch.profile.nome}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 rounded-full border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="grid size-10 place-items-center rounded-full bg-brand text-primary-foreground shadow-soft transition-transform active:scale-95 disabled:opacity-40 shrink-0"
            >
              <Send className="size-4.5" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-8 text-center text-muted-foreground">
          Selecione uma conversa ao lado para começar.
        </div>
      )}

      {/* Video Call Modal */}
      {activeVideoCall && (
        <VideoCallModal
          profile={activeVideoCall}
          onClose={endVideoCall}
        />
      )}

      {/* Media Attachment Modal */}
      {mediaModalOpen && activeMatch && (
        <MediaAttachmentModal
          onClose={() => setMediaModalOpen(false)}
          onSendMedia={(params) => {
            sendMediaMessage(activeMatch.id, params);
          }}
        />
      )}

      {/* Zoomed Image Lightbox */}
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
    </div>
  );
};
