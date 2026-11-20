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
  Layers,
  AlertCircle,
  SkipBack,
  SkipForward,
  Gauge,
  Check,
} from 'lucide-react';

export const WATCHMAKING_ASSEMBLY_STEPS = [
  {
    step: 1,
    startSec: 0,
    endSec: 18,
    timeSec: 0,
    title: 'Arranging Individual Components',
    desc: 'Watchmaker organizes plates, balance bridge, and pinions on the bench.',
    tag: 'STAGE 01',
  },
  {
    step: 2,
    startSec: 18,
    endSec: 36,
    timeSec: 18,
    title: 'Movement & Gear Assembly',
    desc: 'Calibrating the mainspring barrel and high-precision gear train.',
    tag: 'STAGE 02',
  },
  {
    step: 3,
    startSec: 36,
    endSec: 54,
    timeSec: 36,
    title: 'Installing Tiny Gears & Screws',
    desc: 'Securing microscopic blued-steel screws with precision tweezers.',
    tag: 'STAGE 03',
  },
  {
    step: 4,
    startSec: 54,
    endSec: 74,
    timeSec: 54,
    title: 'Balance Wheel & Escapement',
    desc: 'Installing the hairspring and anchor escapement to achieve resonance.',
    tag: 'STAGE 04',
  },
  {
    step: 5,
    startSec: 74,
    endSec: 92,
    timeSec: 74,
    title: 'Attaching Dial & Hands',
    desc: 'Pressing faceted hands accurately above the handcrafted dial.',
    tag: 'STAGE 05',
  },
  {
    step: 6,
    startSec: 92,
    endSec: 110,
    timeSec: 92,
    title: 'Casing the Movement',
    desc: 'Mounting the movement safely into the polished watch case.',
    tag: 'STAGE 06',
  },
  {
    step: 7,
    startSec: 110,
    endSec: 128,
    timeSec: 110,
    title: 'Bezel, Crown & Strap',
    desc: 'Installing the bezel, screw-down crown, and alligator leather strap.',
    tag: 'STAGE 07',
  },
  {
    step: 8,
    startSec: 128,
    endSec: 146,
    timeSec: 128,
    title: 'Polishing & Quality Inspection',
    desc: 'Multi-axis timing verification, pressure test, and mirror chamfering.',
    tag: 'STAGE 08',
  },
  {
    step: 9,
    startSec: 146,
    endSec: 170,
    timeSec: 146,
    title: 'Masterpiece Reveal',
    desc: 'Completed luxury mechanical wristwatch ticking in full operating glory.',
    tag: 'STAGE 09',
  },
];

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const WatchmakingVideoModal = ({ isOpen, onClose }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const stageListRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(170);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen?.().catch(() => {});
        } else {
          onClose();
        }
      } else if (e.key === ' ' && isOpen) {
        e.preventDefault();
        togglePlay();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, isPlaying, onClose]);

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
      if (currentTime >= WATCHMAKING_ASSEMBLY_STEPS[i].startSec) {
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
      setShowSpeedMenu(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStep = WATCHMAKING_ASSEMBLY_STEPS[activeStepIndex] || WATCHMAKING_ASSEMBLY_STEPS[0];

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

  const handlePrevStage = () => {
    const targetIdx = Math.max(0, activeStepIndex - 1);
    handleSeekToStep(WATCHMAKING_ASSEMBLY_STEPS[targetIdx].startSec);
  };

  const handleNextStage = () => {
    const targetIdx = Math.min(WATCHMAKING_ASSEMBLY_STEPS.length - 1, activeStepIndex + 1);
    handleSeekToStep(WATCHMAKING_ASSEMBLY_STEPS[targetIdx].startSec);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
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

  const totalDuration = duration || 170;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-fade-in font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={containerRef}
        className="bg-gradient-to-b from-[#081224] via-[#050D1A] to-[#020712] rounded-3xl max-w-5xl w-full border border-[#00CFFF]/40 shadow-[0_0_60px_rgba(0,207,255,0.25)] relative overflow-hidden flex flex-col text-white max-h-[94vh]"
      >
        {/* ── HEADER STRIP ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#040A15]/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-[#00CFFF]/15 text-[#00CFFF] border border-[#00CFFF]/40 shadow-sm">
              <Sparkles className="w-3 h-3 text-[#00CFFF]" /> HOROLOGY FILM
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide leading-tight">
                Inside Watchmaking: The Art of Assembly
              </h3>
              <p className="text-[11px] text-[#A6B1C8] font-light hidden sm:block">
                From Tiny Components to a Masterpiece • 9-Stage Luxury Mechanical Watch Creation
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
                    setDuration(videoRef.current.duration || 170);
                  }
                }}
                onError={() => setHasError(true)}
              >
                <source src="/videos/watchmaking_assembly.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Live Active Stage Badge (Top-Left overlay) */}
              <div className="absolute top-3 left-3 pointer-events-none z-10 transition-opacity duration-300">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#00CFFF] animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-[#00CFFF]">
                    {currentStep.tag}
                  </span>
                  <span className="text-white/40 text-xs">•</span>
                  <span className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-[340px]">
                    {currentStep.title}
                  </span>
                </div>
              </div>

              {/* Big Center Play Button when Paused */}
              {!isPlaying && !hasError && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-opacity z-10"
                >
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#00CFFF] text-black flex items-center justify-center shadow-[0_0_40px_rgba(0,207,255,0.7)] transform transition-transform hover:scale-110 active:scale-95 group/btn">
                    <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-current ml-1" />
                  </div>
                </div>
              )}

              {/* Video Floating Controls Bar */}
              <div
                className={`absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/75 to-transparent transition-opacity duration-300 z-20 ${
                  controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Progress Bar Container with Chapter Ticks */}
                <div className="relative flex flex-col mb-2.5 group/seek">
                  {/* Chapter tick markers */}
                  <div className="relative w-full h-1.5 bg-white/20 rounded-full overflow-visible mb-1 cursor-pointer">
                    {/* Fill track */}
                    <div
                      className="absolute top-0 left-0 bottom-0 bg-[#00CFFF] rounded-full shadow-[0_0_8px_rgba(0,207,255,0.8)]"
                      style={{ width: `${Math.min(100, (currentTime / totalDuration) * 100)}%` }}
                    />

                    {/* Chapter tick dots */}
                    {WATCHMAKING_ASSEMBLY_STEPS.map((step, idx) => {
                      const posPercent = (step.startSec / totalDuration) * 100;
                      const isPassed = currentTime >= step.startSec;
                      return (
                        <div
                          key={step.step}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSeekToStep(step.startSec);
                          }}
                          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all cursor-pointer z-10 ${
                            isPassed
                              ? 'bg-[#00CFFF] ring-2 ring-black'
                              : 'bg-white/60 hover:bg-white hover:scale-125'
                          }`}
                          style={{ left: `${posPercent}%` }}
                          title={`Stage ${step.step}: ${step.title}`}
                        />
                      );
                    })}

                    {/* Native range input overlay for smooth scrub */}
                    <input
                      type="range"
                      min="0"
                      max={totalDuration}
                      step="0.1"
                      value={currentTime}
                      onChange={handleSeek}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                  </div>
                </div>

                {/* Bottom Row Controls */}
                <div className="flex items-center justify-between text-xs">
                  {/* Left Controls: Play/Pause, Prev, Next, Replay, Time */}
                  <div className="flex items-center gap-2 sm:gap-3">
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

                    {/* Prev Stage */}
                    <button
                      type="button"
                      onClick={handlePrevStage}
                      disabled={activeStepIndex === 0}
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                      title="Previous Stage"
                    >
                      <SkipBack className="w-3.5 h-3.5" />
                    </button>

                    {/* Next Stage */}
                    <button
                      type="button"
                      onClick={handleNextStage}
                      disabled={activeStepIndex === WATCHMAKING_ASSEMBLY_STEPS.length - 1}
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                      title="Next Stage"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                    </button>

                    {/* Replay */}
                    <button
                      type="button"
                      onClick={() => handleSeekToStep(0)}
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                      title="Replay from beginning"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    {/* Time display */}
                    <div className="text-[11px] font-mono text-gray-300 ml-1">
                      <span className="text-white font-bold">{formatTime(currentTime)}</span>
                      <span className="text-gray-500 mx-1">/</span>
                      <span>{formatTime(totalDuration)}</span>
                    </div>
                  </div>

                  {/* Right Controls: Speed, Volume, Fullscreen */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Playback Speed selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 flex items-center gap-1 text-[11px] font-mono text-gray-200 transition-colors cursor-pointer"
                        title="Playback Speed"
                      >
                        <Gauge className="w-3 h-3 text-[#00CFFF]" />
                        <span>{playbackSpeed}x</span>
                      </button>

                      {showSpeedMenu && (
                        <div className="absolute bottom-full right-0 mb-2 py-1 bg-[#0A1428] border border-white/15 rounded-xl shadow-xl flex flex-col min-w-[70px] z-30">
                          {PLAYBACK_SPEEDS.map((sp) => (
                            <button
                              key={sp}
                              type="button"
                              onClick={() => handleSpeedChange(sp)}
                              className={`px-3 py-1 text-[11px] font-mono text-left hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between ${
                                playbackSpeed === sp ? 'text-[#00CFFF] font-bold' : 'text-gray-300'
                              }`}
                            >
                              <span>{sp}x</span>
                              {playbackSpeed === sp && <Check className="w-3 h-3 text-[#00CFFF]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Volume */}
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
                        className="w-14 sm:w-18 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00CFFF]"
                        title="Volume"
                      />
                    </div>

                    {/* Fullscreen */}
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
        <div
          ref={stageListRef}
          className="p-4 sm:p-5 bg-[#030814] overflow-y-auto max-h-56 sm:max-h-64 border-t border-white/10"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00CFFF]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#A6B1C8]">
                Mechanical Watch Assembly Process (9 Stages)
              </h4>
            </div>
            <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
              Click any stage to jump directly to footage
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {WATCHMAKING_ASSEMBLY_STEPS.map((st, idx) => {
              const isActive = activeStepIndex === idx;
              const isPast = activeStepIndex > idx;

              return (
                <div
                  key={st.step}
                  onClick={() => handleSeekToStep(st.startSec)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 group ${
                    isActive
                      ? 'bg-[#00CFFF]/15 border-[#00CFFF] shadow-[0_0_18px_rgba(0,207,255,0.25)] ring-1 ring-[#00CFFF]/40'
                      : isPast
                      ? 'bg-white/[0.03] border-white/5 opacity-80 hover:opacity-100 hover:border-white/25 hover:bg-white/[0.05]'
                      : 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100 hover:border-white/25 hover:bg-white/[0.04]'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 transition-all ${
                      isActive
                        ? 'bg-[#00CFFF] text-black shadow-md scale-105'
                        : isPast
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-white/10 text-gray-400 group-hover:bg-white/20'
                    }`}
                  >
                    {isPast ? '✓' : st.step}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`text-xs font-bold leading-tight truncate ${
                          isActive ? 'text-[#00CFFF]' : 'text-gray-200'
                        }`}
                      >
                        {st.title}
                      </p>
                      <span className="text-[9px] font-mono text-gray-500 flex-shrink-0">
                        {formatTime(st.startSec)}
                      </span>
                    </div>
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
