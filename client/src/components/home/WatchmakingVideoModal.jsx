import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  X,
  Sparkles,
  Clock,
  CheckCircle2,
  Layers,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const WATCHMAKING_ASSEMBLY_STEPS = [
  {
    step: 1,
    timeSec: 0,
    title: 'Arranging Individual Components',
    desc: 'Watchmaker arranges plates, balance bridge, and pinions on the bench.',
  },
  {
    step: 2,
    timeSec: 18,
    title: 'Movement & Gear Assembly',
    desc: 'Calibrating the mainspring barrel and high-precision gear train.',
  },
  {
    step: 3,
    timeSec: 35,
    title: 'Installing Tiny Gears & Screws',
    desc: 'Securing microscopic blued-steel screws with precision tweezers.',
  },
  {
    step: 4,
    timeSec: 55,
    title: 'Balance Wheel & Escapement',
    desc: 'Installing the hairspring and anchor escapement to achieve resonance.',
  },
  {
    step: 5,
    timeSec: 75,
    title: 'Attaching Dial & Hands',
    desc: 'Pressing faceted hands accurately above the handcrafted dial.',
  },
  {
    step: 6,
    timeSec: 95,
    title: 'Casing the Movement',
    desc: 'Mounting the movement safely into the polished watch case.',
  },
  {
    step: 7,
    timeSec: 115,
    title: 'Bezel, Crown & Strap',
    desc: 'Installing the bezel, screw-down crown, and alligator leather strap.',
  },
  {
    step: 8,
    timeSec: 135,
    title: 'Polishing & Quality Inspection',
    desc: 'Multi-axis timing verification, pressure test, and mirror chamfering.',
  },
  {
    step: 9,
    timeSec: 155,
    title: 'Masterpiece Reveal',
    desc: 'Completed luxury mechanical wristwatch ticking in full operating glory.',
  },
];

export const WatchmakingVideoModal = ({ isOpen, onClose }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen?.().catch(() => {});
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, onClose]);

  // Handle Fullscreen change
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Update active step based on currentTime
  useEffect(() => {
    let currentIdx = 0;
    for (let i = 0; i < WATCHMAKING_ASSEMBLY_STEPS.length; i++) {
      if (currentTime >= WATCHMAKING_ASSEMBLY_STEPS[i].timeSec) {
        currentIdx = i;
      }
    }
    setActiveStepIndex(currentIdx);
  }, [currentTime]);

  // Reset state when opening/closing
  useEffect(() => {
    if (!isOpen) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
      setHasError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setHasError(true));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted && volume === 0) {
      setVolume(0.8);
      videoRef.current.volume = 0.8;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSeekToStep = (timeSec) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeSec;
      if (!isPlaying) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-fade-in font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={containerRef}
        className="bg-gradient-to-b from-[#081224] via-[#050D1A] to-[#020712] rounded-3xl max-w-4xl w-full border border-[#00CFFF]/40 shadow-[0_0_60px_rgba(0,207,255,0.25)] relative overflow-hidden flex flex-col text-white max-h-[92vh]"
      >
        {/* ── HEADER STRIP ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#040A15]/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-[#00CFFF]/15 text-[#00CFFF] border border-[#00CFFF]/40 shadow-sm">
              <Sparkles className="w-3 h-3 text-[#00CFFF]" /> HOROLOGY FILM
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide leading-tight">
                Inside Watchmaking: The Art of Assembly
              </h3>
              <p className="text-[11px] text-[#A6B1C8] font-light hidden sm:block">
                From Tiny Components to a Masterpiece • Mechanical Wristwatch Creation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer hover:rotate-90"
            title="Close Video"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── VIDEO PLAYER CANVAS ── */}
        <div
          className="relative aspect-video bg-black overflow-hidden flex items-center justify-center group"
          onMouseEnter={() => setControlsVisible(true)}
          onMouseMove={() => setControlsVisible(true)}
        >
          {hasError ? (
            /* Clear Video Unavailable State */
            <div className="p-8 text-center flex flex-col items-center justify-center space-y-3 bg-[#030914] w-full h-full border border-white/5">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">Video Temporarily Unavailable</h4>
              <p className="text-xs text-[#A6B1C8] max-w-md">
                The watchmaking assembly film could not be loaded at this moment. You can retry playback or explore our atelier story below.
              </p>
              <button
                type="button"
                onClick={() => {
                  setHasError(false);
                  if (videoRef.current) {
                    videoRef.current.load();
                    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setHasError(true));
                  }
                }}
                className="mt-2 px-4 py-1.5 rounded-full bg-[#00CFFF] text-black text-xs font-bold hover:bg-[#00E5FF] transition-colors cursor-pointer"
              >
                Retry Playback
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                poster="/images/watchmaking_poster.jpg"
                playsInline
                preload="metadata"
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setDuration(videoRef.current.duration);
                  }
                }}
                onError={() => setHasError(true)}
              >
                <source src="/videos/watchmaking_assembly.mp4" type="video/mp4" />
                <source src="/videos/tourbillon_movement.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>

              {/* Big Center Play Button when Paused */}
              {!isPlaying && !hasError && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-opacity"
                >
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#00CFFF] text-black flex items-center justify-center shadow-[0_0_40px_rgba(0,207,255,0.7)] transform transition-transform hover:scale-110 active:scale-95 group/btn">
                    <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-current ml-1" />
                  </div>
                </div>
              )}

              {/* Video Floating Controls Bar */}
              <div
                className={`absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${
                  controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Progress Bar */}
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00CFFF] hover:h-1.5 transition-all"
                  />
                </div>

                {/* Bottom Row Controls */}
                <div className="flex items-center justify-between text-xs">
                  {/* Left Controls: Play/Pause, Replay, Time */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSeekToStep(0)}
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                      title="Replay from start"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <div className="text-[11px] font-mono text-gray-300">
                      <span className="text-white font-bold">{formatTime(currentTime)}</span>
                      <span className="text-gray-500 mx-1">/</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Right Controls: Volume & Fullscreen */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 group/vol">
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-4 h-4 text-red-400" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-14 sm:w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00CFFF]"
                        title="Volume"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                      title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    >
                      {isFullscreen ? (
                        <Minimize2 className="w-4 h-4" />
                      ) : (
                        <Maximize2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── 9-STEP AUTHENTIC WATCHMAKING ASSEMBLY CHAPTER GUIDE ── */}
        <div className="p-4 sm:p-5 bg-[#030814] overflow-y-auto max-h-56 sm:max-h-64 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00CFFF]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#A6B1C8]">
                Mechanical Watch Assembly Process (9 Stages)
              </h4>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">
              Click any stage to jump
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {WATCHMAKING_ASSEMBLY_STEPS.map((st, idx) => {
              const isActive = activeStepIndex === idx;
              const isPast = activeStepIndex > idx;

              return (
                <div
                  key={st.step}
                  onClick={() => handleSeekToStep(st.timeSec)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    isActive
                      ? 'bg-[#00CFFF]/15 border-[#00CFFF] shadow-[0_0_15px_rgba(0,207,255,0.2)]'
                      : isPast
                      ? 'bg-white/[0.03] border-white/5 opacity-75 hover:opacity-100 hover:border-white/20'
                      : 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                      isActive
                        ? 'bg-[#00CFFF] text-black'
                        : isPast
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {isPast ? '✓' : st.step}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-bold leading-tight truncate ${
                        isActive ? 'text-[#00CFFF]' : 'text-gray-200'
                      }`}
                    >
                      {st.title}
                    </p>
                    <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchmakingVideoModal;
