import React, { useState, useRef, useEffect } from 'react';
import { Image, Video, Mic, X, Upload, Play, Pause, Square, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { compressImageUpload, validateAndReadMedia } from '../../utils/security';

interface MediaAttachmentModalProps {
  onClose: () => void;
  onSendMedia: (params: {
    tipo: 'imagem' | 'video' | 'audio';
    midiaUrl: string;
    texto?: string;
    duracaoAudio?: string;
  }) => Promise<void> | void;
}

export const MediaAttachmentModal: React.FC<MediaAttachmentModalProps> = ({
  onClose,
  onSendMedia,
}) => {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<'imagem' | 'video' | 'audio'>('imagem');
  const [caption, setCaption] = useState('');
  const [selectedUrl, setSelectedUrl] = useState('');
  const [processing, setProcessing] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    setProcessing(true);
    try {
      const compressed = await compressImageUpload(file, 720, 180000);
      setSelectedUrl(compressed);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao processar imagem.');
    } finally {
      setProcessing(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    setProcessing(true);
    try {
      const dataUrl = await validateAndReadMedia(file, 'video');
      setSelectedUrl(dataUrl);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao processar vídeo.');
    } finally {
      setProcessing(false);
    }
  };

  const startRecording = async () => {
    setErrorMsg('');
    setAudioDataUrl(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg('Seu navegador não suporta gravação de áudio.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 32000,
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size > 240 * 1024) {
          setErrorMsg('O áudio ficou muito longo (máximo ~30s / 240 KB). Grave uma mensagem mais curta.');
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          setAudioDataUrl(String(reader.result || ''));
        };
        reader.onerror = () => {
          setErrorMsg('Falha ao preparar arquivo de áudio.');
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);
      recordIntervalRef.current = setInterval(() => {
        setRecordSeconds((s) => {
          if (s >= 28) {
            stopRecording();
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      setErrorMsg('Permissão de microfone negada ou indisponível neste dispositivo.');
    }
  };

  const stopRecording = () => {
    if (recordIntervalRef.current) {
      clearInterval(recordIntervalRef.current);
      recordIntervalRef.current = null;
    }
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    if (activeTab === 'audio') {
      if (!audioDataUrl) {
        setErrorMsg('Grave uma mensagem de voz antes de enviar.');
        return;
      }
      setSending(true);
      try {
        await onSendMedia({
          tipo: 'audio',
          midiaUrl: audioDataUrl,
          texto: caption.trim() || 'Mensagem de voz',
          duracaoAudio: formatDuration(recordSeconds || 1),
        });
        onClose();
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Erro ao enviar áudio.');
      } finally {
        setSending(false);
      }
      return;
    }

    if (!selectedUrl) {
      setErrorMsg('Selecione um arquivo válido primeiro.');
      return;
    }

    setSending(true);
    try {
      await onSendMedia({
        tipo: activeTab,
        midiaUrl: selectedUrl,
        texto: caption.trim(),
      });
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao enviar mídia.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Compartilhar mídia no chat"
    >
      <div className="bg-card border border-border rounded-3xl w-full max-w-lg overflow-hidden shadow-float">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-foreground font-display font-bold text-base sm:text-lg">
            Compartilhar no Chat
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid min-h-[44px] min-w-[44px] place-items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-3 p-2 bg-muted/40 border-b border-border gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('imagem');
              setSelectedUrl('');
              setErrorMsg('');
            }}
            className={`flex min-h-[44px] items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'imagem'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Image className="w-4 h-4" />
            Foto
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('video');
              setSelectedUrl('');
              setErrorMsg('');
            }}
            className={`flex min-h-[44px] items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'video'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Video className="w-4 h-4" />
            Vídeo
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('audio');
              setErrorMsg('');
            }}
            className={`flex min-h-[44px] items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'audio'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Mic className="w-4 h-4" />
            Áudio
          </button>
        </div>

        <div className="p-5 space-y-4">
          {errorMsg && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-600">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* PHOTO TAB */}
          {activeTab === 'imagem' && (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary/60 rounded-2xl p-6 cursor-pointer bg-muted/20 transition">
                {processing ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin mb-1" />
                ) : (
                  <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                )}
                <span className="text-xs text-foreground font-semibold">
                  {processing ? 'Comprimindo imagem...' : 'Selecionar foto do dispositivo'}
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5">
                  PNG, JPG ou WebP (otimização automática)
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {selectedUrl && (
                <div className="relative overflow-hidden rounded-2xl border border-border max-h-56">
                  <img src={selectedUrl} alt="Prévia da imagem" className="w-full max-h-56 object-contain bg-black/20" />
                </div>
              )}
            </div>
          )}

          {/* VIDEO TAB */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary/60 rounded-2xl p-6 cursor-pointer bg-muted/20 transition">
                {processing ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin mb-1" />
                ) : (
                  <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                )}
                <span className="text-xs text-foreground font-semibold">
                  {processing ? 'Validando vídeo...' : 'Selecionar vídeo curto'}
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5">
                  MP4 ou WebM até 240 KB
                </span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>

              {selectedUrl && (
                <div className="overflow-hidden rounded-2xl border border-border bg-black">
                  <video src={selectedUrl} controls playsInline className="w-full max-h-52 object-contain" />
                </div>
              )}
            </div>
          )}

          {/* AUDIO TAB */}
          {activeTab === 'audio' && (
            <div className="flex flex-col items-center justify-center py-6 px-4 bg-muted/30 rounded-2xl border border-border space-y-4">
              {isRecording ? (
                <div className="flex flex-col items-center space-y-3">
                  <button
                    type="button"
                    onClick={stopRecording}
                    aria-label="Parar gravação"
                    className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg"
                  >
                    <Square className="w-6 h-6 fill-white" />
                  </button>
                  <div className="text-center">
                    <p className="text-rose-600 text-sm font-semibold">{t.chat.recording}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {formatDuration(recordSeconds)} / 00:30
                    </p>
                  </div>
                </div>
              ) : audioDataUrl ? (
                <div className="w-full space-y-3 flex flex-col items-center">
                  <div className="flex items-center gap-3 w-full max-w-xs bg-card border border-border px-4 py-2.5 rounded-full">
                    <button
                      type="button"
                      onClick={() => {
                        if (!audioPlayerRef.current) return;
                        if (isPlayingAudio) {
                          audioPlayerRef.current.pause();
                          setIsPlayingAudio(false);
                        } else {
                          void audioPlayerRef.current.play();
                          setIsPlayingAudio(true);
                        }
                      }}
                      className="p-2 rounded-full bg-primary text-primary-foreground"
                    >
                      {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                    <audio
                      ref={audioPlayerRef}
                      src={audioDataUrl}
                      onEnded={() => setIsPlayingAudio(false)}
                      className="hidden"
                    />
                    <span className="flex-1 text-xs font-medium text-foreground">Áudio pronto para envio</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatDuration(recordSeconds || 1)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAudioDataUrl(null);
                      void startRecording();
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Gravar novamente
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <button
                    type="button"
                    onClick={() => void startRecording()}
                    aria-label="Iniciar gravação de áudio"
                    className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg active:scale-95 transition"
                  >
                    <Mic className="w-7 h-7" />
                  </button>
                  <p className="text-xs text-muted-foreground text-center">
                    Toque no microfone para gravar uma mensagem de voz (até 30 segundos).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Caption Input */}
          <div>
            <input
              type="text"
              value={caption}
              maxLength={300}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Adicionar legenda ou mensagem..."
              className="w-full min-h-[44px] bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={
                processing ||
                sending ||
                (activeTab === 'audio' ? !audioDataUrl : !selectedUrl)
              }
              onClick={() => void handleSubmit()}
              className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-primary-foreground text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-soft transition"
            >
              {sending && <Loader2 className="size-4 animate-spin" />}
              Enviar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
