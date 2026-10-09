import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  Volume1,
  VolumeX,
  Repeat,
  Repeat1,
  Sparkles,
  BarChart2,
  Activity,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { resolveAudioSource, RAW_AUDIO_FALLBACK } from '../data/songData';

interface AudioPlayerProps {
  audioUrl: string;
  songTitle: string;
  artist: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  songTitle,
  artist,
  onTimeUpdate,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [bufferedPercent, setBufferedPercent] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [previousVolume, setPreviousVolume] = useState<number>(0.85);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [visualizerMode, setVisualizerMode] = useState<'bars' | 'wave' | 'particles'>('bars');
  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);
  const [hoverSeekPos, setHoverSeekPos] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeUrl, setActiveUrl] = useState<string>(resolveAudioSource(audioUrl));

  useEffect(() => {
    setActiveUrl(resolveAudioSource(audioUrl));
  }, [audioUrl]);

  // Audio setup and listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setLoadError(null);
    };

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
      if (onTimeUpdate) {
        onTimeUpdate(audio.currentTime, audio.duration || 0);
      }

      // Check buffer progress
      if (audio.buffered.length > 0 && audio.duration) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        setBufferedPercent(Math.min(100, (bufferedEnd / audio.duration) * 100));
      }
    };

    const handleEnded = () => {
      if (!isLooping) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    const handleError = () => {
      console.warn('Audio loading error with URL:', activeUrl);
      setLoadError('音源の読み込みに失敗しました。');
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [isDragging, isLooping, onTimeUpdate, activeUrl]);

  // Handle play/pause
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        setLoadError(null);
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Playback initiation error:', err);
        // Fallback retry with RAW url if not already using it
        if (activeUrl !== RAW_AUDIO_FALLBACK) {
          setActiveUrl(RAW_AUDIO_FALLBACK);
          setTimeout(() => {
            audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {
              setLoadError('ブラウザ設定またはネットワーク接続を確認してください。');
            });
          }, 300);
        } else {
          setLoadError('再生できませんでした。画面をクリックしてから再生をお試しください。');
        }
      }
    }
  };

  // Skip back & forward 10s
  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const target = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds));
    audio.currentTime = target;
    setCurrentTime(target);
  };

  // Change volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      const restored = previousVolume || 0.85;
      audio.volume = restored;
      setVolume(restored);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      audio.volume = 0;
      setVolume(0);
      setIsMuted(true);
    }
  };

  // Change playback rate
  const cyclePlaybackRate = () => {
    const rates = [1.0, 1.25, 1.5, 0.75];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  // Toggle looping
  const toggleLoop = () => {
    const newLoop = !isLooping;
    setIsLooping(newLoop);
    if (audioRef.current) {
      audioRef.current.loop = newLoop;
    }
  };

  // Seek bar interactions
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = ratio * duration;

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, moveX / rect.width));
    setHoverSeekTime(ratio * duration);
    setHoverSeekPos(moveX);
  };

  const handleMouseLeave = () => {
    setHoverSeekTime(null);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return '00:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-300">
      {/* Background ambient sunset warmth */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hidden HTML5 audio element */}
      <audio
        ref={audioRef}
        src={activeUrl}
        preload="metadata"
      />

      {/* Load error message if any */}
      {loadError && (
        <div className="mb-4 p-3 bg-amber-950/60 border border-amber-800/60 rounded-xl text-amber-200 text-xs sm:text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{loadError}</span>
          </div>
          <button
            onClick={() => {
              setActiveUrl(RAW_AUDIO_FALLBACK);
              setLoadError(null);
            }}
            className="px-2.5 py-1 bg-amber-600/40 hover:bg-amber-600/70 border border-amber-500/50 rounded-lg text-xs font-medium text-amber-100 flex items-center gap-1 transition-colors shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            再試行
          </button>
        </div>
      )}

      {/* Track Title & Visualizer Style Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-800/60">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-amber-400/90 uppercase block">
            Now Playing Single
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-stone-100 tracking-tight flex items-center gap-2">
            {songTitle}
            <span className="text-xs font-normal text-stone-400">/ {artist}</span>
          </h2>
        </div>

        {/* Visualizer Mode Switcher */}
        <div className="flex items-center gap-1 bg-stone-950/80 p-1 rounded-lg border border-stone-800 text-xs">
          <button
            onClick={() => setVisualizerMode('bars')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              visualizerMode === 'bars'
                ? 'bg-amber-500/20 text-amber-300 font-medium shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="イコライザー表示"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">EQ</span>
          </button>
          <button
            onClick={() => setVisualizerMode('wave')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              visualizerMode === 'wave'
                ? 'bg-amber-500/20 text-amber-300 font-medium shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="波形表示"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[11px]">Wave</span>
          </button>
          <button
            onClick={() => setVisualizerMode('particles')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              visualizerMode === 'particles'
                ? 'bg-amber-500/20 text-amber-300 font-medium shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="星屑パーティクル"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px]">Stars</span>
          </button>
        </div>
      </div>

      {/* Dynamic Animated Visualizer Canvas */}
      <div className="mb-5">
        <AudioVisualizer
          isPlaying={isPlaying}
          audioRef={audioRef}
          mode={visualizerMode}
        />
      </div>

      {/* Interactive Seek Bar */}
      <div className="space-y-1.5 mb-5">
        <div
          ref={progressBarRef}
          onClick={handleProgressClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full h-3 group cursor-pointer flex items-center select-none"
        >
          {/* Base track */}
          <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden relative group-hover:h-2 transition-all">
            {/* Buffer progress bar */}
            <div
              className="absolute left-0 top-0 h-full bg-stone-700/60 rounded-full transition-all duration-300"
              style={{ width: `${bufferedPercent}%` }}
            />
            {/* Active played progress bar with warm gradient */}
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Interactive Thumb */}
          <div
            className="absolute -top-1 w-3.5 h-3.5 bg-white border-2 border-amber-500 rounded-full shadow-md pointer-events-none transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all"
            style={{ left: `${progressPercent}%` }}
          />

          {/* Hover Seek Tooltip */}
          {hoverSeekTime !== null && (
            <div
              className="absolute -top-7 transform -translate-x-1/2 px-1.5 py-0.5 bg-stone-800 text-stone-200 text-[10px] font-mono rounded shadow pointer-events-none border border-stone-700 whitespace-nowrap z-20"
              style={{ left: `${hoverSeekPos}px` }}
            >
              {formatTime(hoverSeekTime)}
            </div>
          )}
        </div>

        {/* Time stamps */}
        <div className="flex justify-between items-center text-xs text-stone-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span className="text-stone-500">
            {duration > 0 ? formatTime(duration) : '03:45'}
          </span>
        </div>
      </div>

      {/* Main Playback Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Secondary options: Loop & Speed */}
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <button
            onClick={toggleLoop}
            className={`p-2 rounded-xl transition-all ${
              isLooping
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
            title={isLooping ? 'リピート中 (ON)' : 'リピートオフ'}
          >
            {isLooping ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
          </button>

          <button
            onClick={cyclePlaybackRate}
            className="px-2.5 py-1.5 rounded-xl text-stone-300 hover:text-amber-300 hover:bg-stone-800/60 text-xs font-mono border border-stone-800 transition-colors"
            title="再生速度変更"
          >
            {playbackRate}x
          </button>
        </div>

        {/* Primary playback buttons */}
        <div className="flex items-center gap-3 order-1 sm:order-2">
          {/* -10s Seek */}
          <button
            onClick={() => skipTime(-10)}
            className="p-2.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800/60 rounded-full transition-all active:scale-95"
            title="10秒戻る"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* PLAY / PAUSE Main tactile button */}
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-stone-950 flex items-center justify-center shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-amber-500/20"
            title={isPlaying ? '一時停止' : '再生'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-stone-950 text-stone-950" />
            ) : (
              <Play className="w-6 h-6 fill-stone-950 text-stone-950 ml-0.5" />
            )}
          </button>

          {/* +10s Seek */}
          <button
            onClick={() => skipTime(10)}
            className="p-2.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800/60 rounded-full transition-all active:scale-95"
            title="10秒進む"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Volume controls */}
        <div className="flex items-center gap-2 order-3 w-full sm:w-auto justify-end">
          <button
            onClick={toggleMute}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800/60 rounded-xl transition-colors"
            title={isMuted ? 'ミュート解除' : 'ミュート'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 sm:w-24 h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
            title={`音量: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          />
          <span className="text-[11px] font-mono text-stone-400 w-8 text-right">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
