'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Compass, Mail, ChevronRight, Activity } from 'lucide-react';
import { audioEngine } from '@/lib/audio';

interface InteractiveUIProps {
  currentChapter: number;
  onNavigateChapter: (chapterIndex: number) => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
}

const CHAPTER_NAMES = [
  '0. PROLOGUE // ARCHITECTURAL CORE',
  '1. OBSERVATORY // ACADEMIC LAB',
  '2. COMMAND CORE // CAREER & SKILLS',
  '3. SANCTUARY // CERTIFICATIONS',
  '4. SUNRISE // CONNECT PLATFORM'
];

export const InteractiveUI: React.FC<InteractiveUIProps> = ({
  currentChapter,
  onNavigateChapter,
  reducedMotion,
  onToggleReducedMotion,
  soundMuted,
  onToggleSound
}) => {
  const [showChapterMenu, setShowChapterMenu] = useState(false);
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(`${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')}:${now.getUTCSeconds().toString().padStart(2, '0')}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Main Top Floating Apple Vision Pro Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none p-2 sm:p-4 md:p-6 flex flex-row items-center justify-between gap-2">
        {/* Left Name Badge */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-3 glass-panel px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-white/80 shadow-sm backdrop-blur-xl">
            <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] animate-pulse shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] sm:text-[12px] font-bold text-slate-900 tracking-wide font-display whitespace-nowrap">
                MUHAMMAD SHAHIR
              </span>
              <span className="text-[9px] sm:text-[10px] text-cyan-600 font-mono tracking-wider hidden sm:inline">
                EXECUTIVE // SALES & AI MARKETING
              </span>
            </div>
          </div>
        </div>

        {/* Center Chapter Navigation Pill */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 glass-panel px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-slate-200/80 shadow-sm backdrop-blur-2xl">
          <button
            onClick={() => {
              audioEngine.playSelectSound();
              setShowChapterMenu(!showChapterMenu);
            }}
            onMouseEnter={() => audioEngine.playHoverSound()}
            className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-slate-800 hover:text-cyan-600 transition-colors px-2 sm:px-3 py-0.5 sm:py-1 rounded-full hover:bg-slate-100/80"
            title="Explore Chapters"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-500 animate-spin-slow shrink-0" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-wide text-slate-800 uppercase whitespace-nowrap">
              <span className="hidden md:inline">{CHAPTER_NAMES[currentChapter]}</span>
              <span className="md:hidden">SECTOR {currentChapter}</span>
            </span>
          </button>

          {/* Quick Chapter Dots */}
          <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-2 border-l border-slate-300/60">
            {CHAPTER_NAMES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  audioEngine.playSelectSound();
                  onNavigateChapter(idx);
                }}
                onMouseEnter={() => audioEngine.playHoverSound()}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentChapter === idx
                    ? 'bg-cyan-500 scale-125 shadow-[0_0_8px_#06b6d4]'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Jump to Sector ${idx}`}
              />
            ))}
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-2">
          <div className="hidden lg:flex flex-col text-right font-mono text-[10px] tracking-wider text-slate-500 px-2">
            <span className="text-cyan-600 font-bold flex items-center gap-1 justify-end">
              <Activity className="w-3 h-3 text-cyan-500" /> LIVE_LAB_SYNC
            </span>
            <span>{timestamp || '12:00:00'} UTC</span>
          </div>

          <button
            onClick={onToggleSound}
            onMouseEnter={() => audioEngine.playHoverSound()}
            className="glass-panel p-2 sm:p-2.5 rounded-full text-slate-700 hover:text-cyan-600 hover:border-cyan-400/50 transition-all border border-slate-200/80 shadow-sm"
            title={soundMuted ? 'Unmute Audio Engine' : 'Mute Audio'}
          >
            {soundMuted ? <VolumeX className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-400" /> : <Volume2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-cyan-600" />}
          </button>

          <button
            onClick={() => {
              audioEngine.playSelectSound();
              onToggleReducedMotion();
            }}
            onMouseEnter={() => audioEngine.playHoverSound()}
            className={`glass-panel p-2 sm:p-2.5 rounded-full transition-all border border-slate-200/80 shadow-sm hidden sm:flex ${
              reducedMotion ? 'text-amber-500 border-amber-400' : 'text-slate-600 hover:text-cyan-600'
            }`}
            title={reducedMotion ? 'Disable Reduced Motion' : 'Enable Reduced Motion'}
          >
            <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>

          <button
            onClick={() => {
              audioEngine.playSelectSound();
              onNavigateChapter(4);
            }}
            onMouseEnter={() => audioEngine.playHoverSound()}
            className="glass-panel px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold text-slate-900 hover:text-cyan-600 flex items-center gap-1.5 sm:gap-2 border border-slate-300/80 hover:bg-white transition-all font-mono tracking-wider uppercase shadow-sm"
          >
            <Mail className="w-3.5 h-3.5 text-cyan-500" />
            <span className="hidden sm:inline">CONNECT</span>
          </button>
        </div>

        {/* Chapter Selection Dropdown */}
        {showChapterMenu && (
          <div className="pointer-events-auto absolute top-20 left-1/2 -translate-x-1/2 z-50 glass-panel p-3 rounded-2xl border border-white/80 w-80 shadow-2xl flex flex-col gap-1 animate-in fade-in zoom-in-95 backdrop-blur-2xl">
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-200/80 mb-1">
              <span className="text-[10px] font-mono font-bold text-cyan-600 uppercase tracking-widest">
                ARCHITECTURAL SECTOR DIRECTORY
              </span>
              <span className="text-[9px] font-mono text-slate-400">5 SECTORS</span>
            </div>
            {CHAPTER_NAMES.map((name, idx) => (
              <button
                key={idx}
                onClick={() => {
                  audioEngine.playSelectSound();
                  onNavigateChapter(idx);
                  setShowChapterMenu(false);
                }}
                onMouseEnter={() => audioEngine.playHoverSound()}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-mono tracking-wide transition-all flex items-center justify-between ${
                  currentChapter === idx
                    ? 'bg-cyan-500/10 text-cyan-700 font-bold border border-cyan-500/30'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{name}</span>
                {currentChapter === idx ? (
                  <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  );
};


