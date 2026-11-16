import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Maximize2,
  Minimize2,
  Heart,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { Profile } from '../../types';
import { useApp } from '../../context/AppContext';

interface VideoCallModalProps {
  profile: Profile;
  onClose: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({ profile, onClose }) => {
  const { user, t } = useApp();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let active = true;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((s) => {
          if (!active) {
            s.getTracks().forEach((track) => track.stop());
            return;
          }
          streamRef.current = s;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = s;
            localVideoRef.current.play().catch(() => {});
          }
          setWebcamActive(true);
        })
        .catch(() => {
          if (active) {
            setWebcamActive(false);
            setCameraError('Permita acesso à câmera e ao microfone no navegador para visualizar seu vídeo.');
          }
        });
    } else {
      setCameraError('Navegador sem suporte a captura de mídia.');
    }

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !next;
    });
  };

  const toggleVideo = () => {
    const next = !isVideoOff;
    setIsVideoOff(next);
    streamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = !next;
    });
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`Chamada de vídeo com ${profile.nome}`}
    >
      <div
        className={`relative w-full ${
          isFullscreen ? 'h-full max-w-none' : 'max-w-4xl h-[90vh] max-h-[720px]'
        } bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10 transition-all`}
      >
        {/* Top Header */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-3">
            <img
              src={profile.fotos[0] || '/icons/icon-192.webp'}
              alt={profile.nome}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold text-base sm:text-lg flex items-center gap-1.5">
                  {profile.nome}, {profile.idade} <span>{profile.bandeira}</span>
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> Sala Segura
                </span>
              </div>
              <p className="text-xs text-neutral-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Aguardando {profile.nome} entrar na sala • {formatTime(seconds)}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
            className="min-h-[44px] min-w-[44px] grid place-items-center rounded-full bg-black/50 text-white/90 hover:bg-black/70 transition"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Main Room Stage */}
        <div className="relative flex-1 bg-neutral-950 flex items-center justify-center overflow-hidden">
          <div className="flex flex-col items-center justify-center text-center p-6 max-w-md space-y-4">
            <div className="relative">
              <img
                src={profile.fotos[0] || '/icons/icon-192.webp'}
                alt={profile.nome}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover ring-4 ring-rose-500/40 shadow-2xl"
              />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-white">{profile.nome}</h4>
              <p className="text-sm text-neutral-300">
                {profile.cidade}, {profile.pais}
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Chamada registrada. Sua câmera e microfone locais estão configurados enquanto {profile.nome} recebe o convite pelo chat.
              </p>
              {cameraError && (
                <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                  {cameraError}
                </p>
              )}
            </div>
          </div>

          {/* Local User PIP */}
          <div className="absolute bottom-24 right-4 sm:bottom-24 sm:right-6 z-20 w-28 h-40 sm:w-40 sm:h-52 bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
            {isVideoOff ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-400 p-2 text-center">
                <VideoOff className="w-7 h-7 mb-1 opacity-60" />
                <span className="text-[11px]">{t.chat.cameraOff}</span>
              </div>
            ) : webcamActive ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={user.fotos?.[0] || '/icons/icon-192.webp'}
                  alt="Você"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 text-[10px] text-white bg-black/70 px-1.5 py-0.5 rounded">
                  Você
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="relative z-20 bg-gradient-to-t from-black via-black/90 to-transparent p-4 sm:p-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? t.chat.unmute : t.chat.mute}
            className={`min-h-[48px] min-w-[48px] grid place-items-center rounded-full transition active:scale-95 ${
              isMuted
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.chat.endCall}
            className="min-h-[56px] min-w-[56px] grid place-items-center rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/40 active:scale-95 transition"
          >
            <PhoneOff className="w-7 h-7" />
          </button>

          <button
            type="button"
            onClick={toggleVideo}
            aria-label={isVideoOff ? t.chat.cameraOn : t.chat.cameraOff}
            className={`min-h-[48px] min-w-[48px] grid place-items-center rounded-full transition active:scale-95 ${
              isVideoOff
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Voltar ao chat"
            className="hidden sm:inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-4 text-xs font-semibold text-white"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            Voltar ao Chat
          </button>
        </div>
      </div>
    </div>
  );
};
