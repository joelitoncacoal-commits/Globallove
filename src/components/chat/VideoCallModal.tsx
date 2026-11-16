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
  Volume2,
  ShieldCheck,
  Sparkles
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
  const [callStatus, setCallStatus] = useState<'calling' | 'connected'>('calling');
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number }[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  // Connect after 2.5 seconds
  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 2200);

    return () => clearTimeout(connectTimer);
  }, []);

  // Duration timer
  useEffect(() => {
    if (callStatus !== 'connected') return;
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  // Attempt user webcam for PIP if available
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((s) => {
          stream = s;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = s;
            localVideoRef.current.play().catch(() => {});
          }
          setWebcamActive(true);
        })
        .catch(() => {
          setWebcamActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendHeart = () => {
    const newHeart = {
      id: Date.now() + Math.random(),
      left: 30 + Math.random() * 40,
    };
    setFloatingHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4 animate-fade-in">
      <div className={`relative w-full ${isFullscreen ? 'h-full max-w-none' : 'max-w-4xl h-[90vh] max-h-[720px]'} bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10 transition-all`}>
        
        {/* Top Header Overlay */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={profile.fotos[0]}
                alt={profile.nome}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-black"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold text-lg flex items-center gap-1.5">
                  {profile.nome}, {profile.idade}
                  <span>{profile.bandeira}</span>
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  HD 1080p
                </span>
              </div>
              <p className="text-xs text-neutral-300 flex items-center gap-1.5">
                {callStatus === 'calling' ? (
                  <span className="text-amber-400 animate-pulse">{t.chat.calling}</span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    {t.chat.connected} • {formatTime(seconds)}
                  </span>
                )}
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-400">{profile.cidade}, {profile.pais}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2.5 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition"
              title="Tela cheia"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Floating Reaction Hearts */}
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {floatingHearts.map(h => (
            <div
              key={h.id}
              style={{ left: `${h.left}%` }}
              className="absolute bottom-24 text-rose-500 animate-float-heart drop-shadow-lg"
            >
              <Heart className="w-10 h-10 fill-rose-500" />
            </div>
          ))}
        </div>

        {/* Main Video View (Remote Participant) */}
        <div className="relative flex-1 bg-neutral-950 flex items-center justify-center overflow-hidden">
          {callStatus === 'calling' ? (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="relative">
                <img
                  src={profile.fotos[0]}
                  alt={profile.nome}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover ring-4 ring-rose-500/50 shadow-2xl animate-pulse"
                />
                <div className="absolute inset-0 rounded-full border-2 border-rose-400 animate-ping opacity-75"></div>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-white">{profile.nome}</h4>
                <p className="text-sm text-neutral-400">{profile.cidade}, {profile.pais}</p>
                <p className="text-rose-400 text-sm font-medium tracking-wide animate-pulse">
                  Conectando chamada de vídeo segura...
                </p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {/* High-res Simulated Live Video of Match */}
              <img
                src={profile.fotos[0]}
                alt={profile.nome}
                className="w-full h-full object-cover object-center filter contrast-105"
              />
              <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50"></div>
              
              {/* Subtle Live Audio Activity Indicator */}
              <div className="absolute bottom-28 left-6 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white text-xs">
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <div className="flex items-end gap-0.5 h-3.5">
                  <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_100ms] h-2"></span>
                  <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_300ms] h-3.5"></span>
                  <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_200ms] h-2.5"></span>
                  <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_400ms] h-3"></span>
                </div>
                <span className="font-medium">{profile.nome} está ao vivo</span>
              </div>
            </div>
          )}

          {/* Local User PIP (Picture-In-Picture) */}
          <div className="absolute bottom-24 right-4 sm:bottom-24 sm:right-6 z-20 w-32 h-44 sm:w-40 sm:h-56 bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
            {isVideoOff ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-400 p-2 text-center">
                <VideoOff className="w-8 h-8 mb-1 opacity-50" />
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
                  src={user.fotos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt="Você"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-2 left-2 text-[10px] text-white/90 bg-black/60 px-1.5 py-0.5 rounded">
                  Você
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="relative z-20 bg-gradient-to-t from-black via-black/90 to-transparent p-4 sm:p-6 flex items-center justify-center gap-3 sm:gap-6">
          {/* Reaction Button */}
          <button
            onClick={handleSendHeart}
            className="p-3.5 sm:p-4 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 hover:scale-110 active:scale-95 transition"
            title="Enviar carinho"
          >
            <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
          </button>

          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 sm:p-4 rounded-full transition active:scale-95 ${
              isMuted
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isMuted ? t.chat.unmute : t.chat.mute}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={onClose}
            className="p-4 sm:p-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition"
            title={t.chat.endCall}
          >
            <PhoneOff className="w-7 h-7" />
          </button>

          {/* Video Toggle Button */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3.5 sm:p-4 rounded-full transition active:scale-95 ${
              isVideoOff
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isVideoOff ? t.chat.cameraOn : t.chat.cameraOff}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>

          {/* Quick Compliment */}
          <button
            onClick={handleSendHeart}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Elogiar
          </button>
        </div>

      </div>
    </div>
  );
};
