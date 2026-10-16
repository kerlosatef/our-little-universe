import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Trash2 } from 'lucide-react';

interface AudioVoicePlayerProps {
  voiceData: string;
  accentColor?: string;
  onDelete?: () => void;
}

export const AudioVoicePlayer: React.FC<AudioVoicePlayerProps> = ({
  voiceData,
  accentColor = '#e91e63',
  onDelete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // When voiceData changes (e.g. re-recording), fully reload the audio element
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.load();
    } catch (e) {
      console.warn('Audio load error:', e);
    }

    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('canplay', updateDuration);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('canplay', updateDuration);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [voiceData]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Playback error:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/85 dark:bg-slate-800/90 backdrop-blur-md border border-current/15 shadow-sm max-w-full overflow-hidden">
      <audio
        ref={audioRef}
        key={voiceData}
        src={voiceData}
        preload="auto"
        playsInline
      />

      <button
        type="button"
        onClick={togglePlay}
        className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition transform active:scale-95 shrink-0"
        style={{ backgroundColor: accentColor }}
        aria-label={isPlaying ? 'Pause voice note' : 'Play voice note'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-white" />
        ) : (
          <Play className="w-4 h-4 fill-white ml-0.5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-[11px] font-mono opacity-80 mb-1">
          <span className="flex items-center gap-1 font-sans font-semibold text-rose-600 dark:text-rose-400">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Voice Note</span>
          </span>
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-current/20 rounded-lg appearance-none cursor-pointer accent-pink-600"
          style={{ accentColor }}
        />
      </div>

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition shrink-0"
          title="Remove recording"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
