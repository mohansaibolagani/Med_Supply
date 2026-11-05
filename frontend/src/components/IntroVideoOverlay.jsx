import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, SkipForward, Sparkles, HeartHandshake } from 'lucide-react';

export const IntroVideoOverlay = ({ onComplete }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [needsUserGesture, setNeedsUserGesture] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = 1.0;
    video.muted = false;

    // Attempt to play unmuted
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setNeedsUserGesture(false);
        })
        .catch((err) => {
          console.warn('Browser autoplay with audio blocked by policy:', err.message);
          // Browser requires user interaction before playing audio
          setNeedsUserGesture(true);
        });
    }
  }, []);

  const handleStartWithAudio = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 1.0;
    setIsMuted(false);
    video.play()
      .then(() => {
        setIsPlaying(true);
        setNeedsUserGesture(false);
      })
      .catch((err) => {
        console.error('Play error on click:', err);
      });
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleFinish = () => {
    setIsVisible(false);
    if (onComplete) {
      setTimeout(() => onComplete(), 300);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-black overflow-hidden flex items-center justify-center select-none animate-in fade-in duration-300">
      
      {/* Fullscreen Video Element */}
      <video
        ref={videoRef}
        src="/intro_video.mp4"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleFinish}
        className="w-full h-full object-cover sm:object-contain bg-black cursor-pointer"
        onClick={() => {
          if (needsUserGesture) {
            handleStartWithAudio();
          }
        }}
      />

      {/* Top Controls Overlay */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-auto z-20">
        {/* Brand pill */}
        <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white shadow-xl">
          <div className="w-7 h-7 rounded-xl bg-red-600 flex items-center justify-center shadow-md shadow-red-600/30">
            <HeartHandshake className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight">Med<span className="text-red-500">Supply</span></span>
              <span className="bg-red-600/30 text-red-400 font-bold text-[9px] px-1.5 py-0.5 rounded uppercase">Emergency</span>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          {/* Sound toggle button */}
          <button
            onClick={toggleMute}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition-all shadow-lg hover:scale-105 active:scale-95"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-400" />
                <span>Audio Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Audio ON</span>
              </>
            )}
          </button>

          {/* Skip Intro button */}
          <button
            onClick={handleFinish}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-slate-900 text-xs font-extrabold shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <span>Skip to Platform</span>
            <SkipForward className="w-3.5 h-3.5 text-red-600" />
          </button>
        </div>
      </div>

      {/* Browser Autoplay Sound Prompt (If blocked by browser policy) */}
      {needsUserGesture && (
        <div 
          onClick={handleStartWithAudio}
          className="absolute inset-0 z-30 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6 cursor-pointer"
        >
          <div className="max-w-md w-full bg-slate-900/90 border border-white/20 rounded-3xl p-8 text-center text-white shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center mx-auto shadow-2xl shadow-red-600/50 hover:scale-110 transition-transform">
              <Play className="w-10 h-10 text-white fill-white ml-1" />
            </div>

            <div className="space-y-2">
              <span className="inline-block text-[11px] font-black uppercase tracking-widest text-rose-300 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30">
                Experience With Full Audio
              </span>
              <h2 className="text-2xl font-black tracking-tight">
                Click to Start Video Intro
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Modern browsers require a single tap to play video with sound enabled. Tap anywhere to begin.
              </p>
            </div>

            <button
              onClick={handleStartWithAudio}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-xl shadow-red-600/40 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Volume2 className="w-5 h-5" />
              <span>Play Intro Video with Sound</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-20">
        <div 
          className="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
