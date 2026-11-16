import React, { useState, useRef } from 'react';
import { Image, Video, Mic, X, Upload, Check, Play, Pause, Square } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MediaAttachmentModalProps {
  onClose: () => void;
  onSendMedia: (params: {
    tipo: 'imagem' | 'video' | 'audio';
    midiaUrl: string;
    texto?: string;
    duracaoAudio?: string;
  }) => void;
}

export const MediaAttachmentModal: React.FC<MediaAttachmentModalProps> = ({
  onClose,
  onSendMedia,
}) => {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<'imagem' | 'video' | 'audio'>('imagem');
  const [caption, setCaption] = useState('');
  const [selectedUrl, setSelectedUrl] = useState('');
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordIntervalRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const samplePhotos = [
    { label: 'Café da Tarde', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80' },
    { label: 'Pôr do Sol Mágico', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Sorriso & Vibe Boa', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
    { label: 'Meu Pet Amigo', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80' },
  ];

  const sampleVideos = [
    { label: 'Ondas & Brisa do Mar', url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4', thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' },
    { label: 'Passeio pela Cidade', url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4', thumb: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=400&q=80' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);
      recordIntervalRef.current = setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);
    } catch {
      // Fallback simulated recording
      setIsRecording(true);
      setRecordSeconds(0);
      recordIntervalRef.current = setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Fallback audio URL
      setAudioUrl('https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg');
    }
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (activeTab === 'audio') {
      const finalUrl = audioUrl || 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg';
      onSendMedia({
        tipo: 'audio',
        midiaUrl: finalUrl,
        texto: caption || 'Mensagem de voz',
        duracaoAudio: formatDuration(recordSeconds || 7),
      });
      onClose();
      return;
    }

    if (!selectedUrl) return;

    onSendMedia({
      tipo: activeTab,
      midiaUrl: selectedUrl,
      texto: caption,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <h3 className="text-white font-semibold text-base sm:text-lg">
            Compartilhar no Chat
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-3 p-2 bg-neutral-950/60 border-b border-neutral-800 gap-1">
          <button
            onClick={() => { setActiveTab('imagem'); setSelectedUrl(''); }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
              activeTab === 'imagem'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Image className="w-4 h-4" />
            Foto
          </button>

          <button
            onClick={() => { setActiveTab('video'); setSelectedUrl(''); }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
              activeTab === 'video'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Video className="w-4 h-4" />
            Vídeo
          </button>

          <button
            onClick={() => { setActiveTab('audio'); }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
              activeTab === 'audio'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Mic className="w-4 h-4" />
            Áudio de Voz
          </button>
        </div>

        {/* Tab contents */}
        <div className="p-5 space-y-4">
          
          {/* PHOTO TAB */}
          {activeTab === 'imagem' && (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-700 hover:border-rose-500/60 rounded-2xl p-4 cursor-pointer bg-neutral-950/40 transition">
                <Upload className="w-6 h-6 text-neutral-400 mb-1" />
                <span className="text-xs text-neutral-300 font-medium">Carregar foto do dispositivo</span>
                <span className="text-[11px] text-neutral-500">PNG, JPG ou WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div>
                <p className="text-xs font-medium text-neutral-400 mb-2">Ou escolha uma foto rápida:</p>
                <div className="grid grid-cols-2 gap-2">
                  {samplePhotos.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedUrl(p.url)}
                      className={`relative rounded-xl overflow-hidden aspect-video border-2 transition group text-left ${
                        selectedUrl === p.url ? 'border-rose-500 ring-2 ring-rose-500/40' : 'border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[11px] text-white font-medium truncate">{p.label}</span>
                      </div>
                      {selectedUrl === p.url && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIDEO TAB */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-700 hover:border-rose-500/60 rounded-2xl p-4 cursor-pointer bg-neutral-950/40 transition">
                <Upload className="w-6 h-6 text-neutral-400 mb-1" />
                <span className="text-xs text-neutral-300 font-medium">Carregar vídeo curto</span>
                <span className="text-[11px] text-neutral-500">MP4 ou WebM até 30s</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div>
                <p className="text-xs font-medium text-neutral-400 mb-2">Ou escolha um clipe sugerido:</p>
                <div className="grid grid-cols-2 gap-2">
                  {sampleVideos.map((v, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedUrl(v.url)}
                      className={`relative rounded-xl overflow-hidden aspect-video border-2 transition group text-left ${
                        selectedUrl === v.url ? 'border-rose-500 ring-2 ring-rose-500/40' : 'border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <img src={v.thumb} alt={v.label} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[11px] text-white font-medium truncate">{v.label}</span>
                      </div>
                      {selectedUrl === v.url && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AUDIO TAB */}
          {activeTab === 'audio' && (
            <div className="flex flex-col items-center justify-center py-6 px-4 bg-neutral-950/60 rounded-2xl border border-neutral-800 space-y-4">
              {isRecording ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xl shadow-rose-600/50 animate-pulse"
                    >
                      <Square className="w-6 h-6 fill-white" />
                    </button>
                    <div className="absolute inset-0 rounded-full border-2 border-rose-500 animate-ping opacity-60"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-rose-400 text-sm font-semibold">{t.chat.recording}</p>
                    <p className="text-xs text-neutral-400 font-mono">{formatDuration(recordSeconds)}</p>
                  </div>
                </div>
              ) : audioUrl ? (
                <div className="w-full space-y-3 flex flex-col items-center">
                  <div className="flex items-center gap-3 w-full max-w-xs bg-neutral-900 border border-neutral-700 px-4 py-2.5 rounded-full">
                    <button
                      type="button"
                      onClick={() => {
                        if (!audioPlayerRef.current) return;
                        if (isPlayingAudio) {
                          audioPlayerRef.current.pause();
                          setIsPlayingAudio(false);
                        } else {
                          audioPlayerRef.current.play();
                          setIsPlayingAudio(true);
                        }
                      }}
                      className="p-2 rounded-full bg-rose-500 text-white"
                    >
                      {isPlayingAudio ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                    </button>
                    <audio
                      ref={audioPlayerRef}
                      src={audioUrl}
                      onEnded={() => setIsPlayingAudio(false)}
                      className="hidden"
                    />
                    <div className="flex-1 flex items-center gap-1">
                      <div className="h-6 flex-1 flex items-center gap-0.5">
                        {[40, 70, 30, 90, 60, 80, 50, 95, 45, 60].map((h, i) => (
                          <div
                            key={i}
                            style={{ height: `${h}%` }}
                            className="flex-1 bg-rose-400 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">
                      {formatDuration(recordSeconds || 7)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={startRecording}
                    className="text-xs text-neutral-400 hover:text-white underline"
                  >
                    Gravar novamente
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <button
                    type="button"
                    onClick={startRecording}
                    className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition"
                  >
                    <Mic className="w-7 h-7" />
                  </button>
                  <p className="text-xs text-neutral-400 text-center">
                    Toque no microfone para gravar uma mensagem de voz carinhosa.
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
              onChange={e => setCaption(e.target.value)}
              placeholder="Adicionar legenda ou mensagem..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={activeTab !== 'audio' && !selectedUrl}
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-semibold hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-500/25 transition"
            >
              Enviar Agora
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
