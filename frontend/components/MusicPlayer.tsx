import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { TRACKS } from '../constants.ts';
import { GlitchText } from './GlitchText.tsx';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIdx];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(err => {
        console.error("Audio playback failed:", err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIdx]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
  }, [isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIdx((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="border-2 border-magenta-500 bg-dark p-4 relative overflow-hidden shadow-[0_0_15px_rgba(255,0,255,0.3)]">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-400 opacity-50"></div>

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex justify-between items-start border-b border-cyan-500/30 pb-2">
          <div>
            <div className="text-xs text-cyan-500 mb-1">[SYS.AUDIO.MODULE]</div>
            <GlitchText text={currentTrack.title} className="text-xl text-magenta-400 font-bold tracking-widest" />
          </div>
          <div className="text-right">
            <div className="text-xs text-cyan-500 mb-1">STATUS</div>
            <div className={`text-sm ${isPlaying ? 'text-cyan-400 animate-pulse' : 'text-gray-500'}`}>
              {isPlaying ? 'STREAMING' : 'IDLE'}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-900 border border-cyan-500/50 relative w-full">
          <div 
            className="absolute top-0 left-0 h-full bg-magenta-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button 
              onClick={handlePrev}
              className="p-2 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-dark transition-colors focus:outline-none"
            >
              <SkipBack size={18} />
            </button>
            <button 
              onClick={togglePlay}
              className="p-2 border border-magenta-500 text-magenta-400 hover:bg-magenta-500 hover:text-dark transition-colors focus:outline-none w-12 flex justify-center"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
            </button>
            <button 
              onClick={handleNext}
              className="p-2 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-dark transition-colors focus:outline-none"
            >
              <SkipForward size={18} />
            </button>
          </div>

          <button 
            onClick={toggleMute}
            className="p-2 text-cyan-500 hover:text-cyan-300 focus:outline-none"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        {/* Track List */}
        <div className="mt-2 text-xs border-t border-cyan-500/30 pt-2">
          <div className="text-gray-500 mb-1">QUEUE:</div>
          {TRACKS.map((track, idx) => (
            <div 
              key={track.id} 
              className={`flex justify-between py-1 ${idx === currentTrackIdx ? 'text-magenta-400' : 'text-cyan-700'}`}
            >
              <span>{idx === currentTrackIdx ? '> ' : '  '}{track.title}</span>
              <span>{track.duration}</span>
            </div>
          ))}
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
        preload="auto"
      />
    </div>
  );
};