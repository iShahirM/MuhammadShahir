'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Copy, Check, ExternalLink, Mail, MapPin, Linkedin, Sparkles, 
  Award, GraduationCap, Briefcase, Cpu, Flame, ChevronDown, ChevronRight,
  BookOpen, Zap, Target, Layers, ArrowRight
} from 'lucide-react';
import { SHAHIR_CV, CertificationItem } from '@/lib/cv-data';
import { audioEngine } from '@/lib/audio';

interface ChapterOverlayProps {
  currentChapter: number;
  scrollProgress: number;
  selectedObject: { type: string; id: string; data?: unknown } | null;
  onCloseSelectedObject: () => void;
  onNavigateChapter: (idx: number) => void;
  onNavigateScrollProgress?: (progress: number) => void;
}

const TERMINAL_TEXTS = [
  "Initializing Interactive Portfolio...",
  "Loading Professional Timeline...",
  "Synchronizing Creative Intelligence...",
  "Preparing Cinematic Experience..."
];

export const ChapterOverlay: React.FC<ChapterOverlayProps> = ({
  currentChapter,
  scrollProgress,
  selectedObject,
  onCloseSelectedObject,
  onNavigateChapter,
  onNavigateScrollProgress
}) => {
  // Loading terminal typing state
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isBigBangTriggered, setIsBigBangTriggered] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const certContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [isAtCardBottom, setIsAtCardBottom] = useState(false);

  // Deriving Chapter 3 active certification exhibit index directly from scrollProgress
  let activeCertIndex = 0;
  if (currentChapter === 3) {
    if (scrollProgress < 0.57) activeCertIndex = 0; // Vault entrance overview
    else if (scrollProgress < 0.65) activeCertIndex = 1; // Cert 1
    else if (scrollProgress < 0.73) activeCertIndex = 2; // Cert 2
    else if (scrollProgress < 0.81) activeCertIndex = 3; // Cert 3
    else activeCertIndex = 4; // Cert 4
  }

  // Auto scroll card container to top whenever active cert changes
  useEffect(() => {
    if (certContainerRef.current) {
      certContainerRef.current.scrollTop = 0;
      setIsAtCardBottom(false);
    }
  }, [activeCertIndex]);

  const handleCardScroll = () => {
    if (certContainerRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = certContainerRef.current;
      const reached = scrollHeight <= clientHeight + 10 || scrollTop + clientHeight >= scrollHeight - 20;
      setIsAtCardBottom(reached);
    }
  };

  const isTypingComplete = currentLineIndex >= TERMINAL_TEXTS.length;

  useEffect(() => {
    if (currentLineIndex < TERMINAL_TEXTS.length) {
      const fullText = TERMINAL_TEXTS[currentLineIndex];
      if (currentCharIndex < fullText.length) {
        const timeout = setTimeout(() => {
          setTypedLines((prev) => {
            const next = [...prev];
            next[currentLineIndex] = fullText.slice(0, currentCharIndex + 1);
            return next;
          });
          setCurrentCharIndex((prev) => prev + 1);
          audioEngine.playTypingChar();
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentLineIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }, 400);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentLineIndex, currentCharIndex]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SHAHIR_CV.email);
    setCopiedEmail(true);
    audioEngine.playSelectSound();
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleTriggerBigBang = () => {
    setIsBigBangTriggered(true);
    audioEngine.playBigBangExplosion();
  };

  const handleSelectExhibitStation = (stationIdx: number) => {
    audioEngine.playSelectSound();
    
    // Calculate target scrollProgress for the exhibit and trigger smooth camera move
    const progressMap = [0.52, 0.61, 0.69, 0.77, 0.85];
    if (onNavigateScrollProgress) {
      onNavigateScrollProgress(progressMap[stationIdx]);
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      
      {/* CHAPTER 0: INITIALIZATION TERMINAL & BIG BANG REVEAL */}
      {currentChapter === 0 && (
        <div className="absolute inset-0 bg-slate-100/90 backdrop-blur-xl flex flex-col items-center justify-center pointer-events-auto p-4 sm:p-6 pt-16 sm:pt-20 z-50 transition-opacity duration-1000 overflow-y-auto">
          {!isBigBangTriggered ? (
            <div className="max-w-xl w-full glass-panel-glow p-5 sm:p-8 rounded-2xl border border-sky-400/40 text-left font-mono space-y-4 shadow-2xl shadow-sky-900/10 bg-white/90 my-auto">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] sm:text-xs text-slate-500 ml-2 font-mono">SYSTEM_BOOT_SEQUENCE.sh</span>
              </div>

              <div className="space-y-2 min-h-[120px]">
                {typedLines.map((line, idx) => (
                  <p key={idx} className="text-xs sm:text-sm text-sky-700 font-semibold flex items-center gap-2">
                    <span className="text-slate-400">&gt;</span> {line}
                  </p>
                ))}
                {!isTypingComplete && (
                  <span className="inline-block w-2 h-4 bg-sky-500 animate-pulse ml-1" />
                )}
              </div>

              {isTypingComplete && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4 border-t border-slate-200 text-center"
                >
                  <p className="text-xs text-slate-600 mb-4 font-sans">
                    Neural Memory Core Synced. Ready to assemble the experience.
                  </p>
                  <button
                    onClick={handleTriggerBigBang}
                    onMouseEnter={() => audioEngine.playHoverSound()}
                    className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-sky-900 bg-sky-100 hover:bg-sky-200 border border-sky-300 transition-all shadow-md flex items-center justify-center gap-2 mx-auto"
                  >
                    <Sparkles className="w-4 h-4 text-sky-600 animate-spin-slow" />
                    <span>Initiate Experience</span>
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="text-center space-y-4 sm:space-y-6 max-w-3xl pointer-events-auto my-auto px-2"
            >
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-sky-100 text-[10px] sm:text-xs font-mono text-sky-800 border border-sky-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INTELLIGENCE & MARKETING PORTFOLIO</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold font-display tracking-tight text-slate-900 uppercase">
                MUHAMMAD SHAHIR
              </h1>

              <p className="text-base sm:text-xl md:text-2xl font-light text-slate-700 tracking-wide font-sans max-w-xl mx-auto">
                Bridging Human Creativity with AI
              </p>

              <div className="pt-4 sm:pt-8 space-y-2 text-xs sm:text-sm text-slate-500 font-mono italic max-w-md mx-auto border-t border-slate-300">
                <p>&ldquo;Every professional has a résumé.&rdquo;</p>
                <p>&ldquo;Few have a story worth experiencing.&rdquo;</p>
                <p className="text-sky-700 font-semibold uppercase not-italic tracking-wider pt-2">
                  Welcome to mine.
                </p>
              </div>

              <div className="pt-4 sm:pt-6">
                <button
                  onClick={() => {
                    audioEngine.playPortalSwoosh();
                    onNavigateChapter(1);
                  }}
                  onMouseEnter={() => audioEngine.playHoverSound()}
                  className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 transition-all shadow-xl flex items-center gap-2 sm:gap-3 group mx-auto"
                >
                  <span>Begin Celestial Journey</span>
                  <ChevronDown className="w-4 h-4 text-white group-hover:translate-y-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* CHAPTER 1 OVERLAY: OBSERVATORY & ACADEMIC LAB */}
      {currentChapter === 1 && (
        <div className="absolute bottom-4 sm:bottom-8 left-3 right-3 sm:left-6 md:left-10 max-w-xl pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel-hud p-4 sm:p-6 rounded-2xl border border-sky-300/60 bg-white/90 space-y-2 sm:space-y-3 backdrop-blur-xl shadow-xl relative"
          >
            <div className="flex items-center gap-2 text-sky-700 text-[10px] sm:text-xs font-mono uppercase tracking-widest font-semibold">
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600" />
              <span>SECTOR_02 // ACADEMIC OBSERVATORY</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900">
              The Spirit School (Rizwan Garden Campus)
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Matriculation Grade A+ (May 2026). Recipient of the prestigious <strong className="text-amber-700 font-semibold">Pride of Institution Award</strong> for outstanding leadership, academic excellence, and active leadership in Green Club climate initiatives.
            </p>
            <div className="pt-1 text-[10px] text-sky-700 font-mono tracking-wider flex items-center gap-1 font-semibold">
              <Sparkles className="w-3 h-3 text-sky-600 animate-pulse" />
              <span>TOUCH HOLOGRAPHIC CRYSTALS & PILLARS IN 3D SPACE</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* CHAPTER 2 OVERLAY: DIGITAL METROPOLIS & SKILL GALAXY */}
      {currentChapter === 2 && (
        <div className="absolute bottom-4 sm:bottom-8 left-3 right-3 sm:left-6 md:left-10 max-w-xl pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel-hud p-4 sm:p-6 rounded-2xl border border-sky-300/60 bg-white/90 space-y-2 sm:space-y-3 backdrop-blur-xl shadow-xl relative"
          >
            <div className="flex items-center gap-2 text-sky-700 text-[10px] sm:text-xs font-mono uppercase tracking-widest font-semibold">
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600" />
              <span>SECTOR_03 // GLOMORE PAKISTAN COMMAND CORE</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900">
              Sales & Marketing Specialist (July 2026 – Present)
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Managing B2B/B2C sales pipelines, executing advanced SEO strategies, leveraging generative AI models and prompt engineering frameworks, and optimizing internal data workflows across Google Workspace & Microsoft ecosystems.
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5">
              <span className="text-[10px] px-2.5 py-0.5 sm:py-1 rounded-full bg-sky-100 text-sky-800 font-mono border border-sky-300/60 font-medium">SEO Strategy</span>
              <span className="text-[10px] px-2.5 py-0.5 sm:py-1 rounded-full bg-sky-100 text-sky-800 font-mono border border-sky-300/60 font-medium">Generative AI</span>
              <span className="text-[10px] px-2.5 py-0.5 sm:py-1 rounded-full bg-sky-100 text-sky-800 font-mono border border-sky-300/60 font-medium">B2B Pipelines</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* CHAPTER 3 OVERLAY: SANCTUARY OF CERTIFICATIONS (INDIVIDUAL SEQUENTIAL EXHIBITS) */}
      {currentChapter === 3 && (
        <div className="absolute inset-0 pointer-events-none flex flex-col z-30 pt-14 sm:pt-16 md:pt-20 pb-4 px-3 sm:px-6 md:px-8 overflow-hidden">
          
          {/* Top Station Selector Tabs */}
          <div className="w-full flex justify-center pb-2 shrink-0 pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel-hud px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-sky-300/80 bg-white/95 backdrop-blur-2xl shadow-lg flex items-center gap-1.5 md:gap-3 max-w-full overflow-x-auto no-scrollbar"
            >
              <span className="text-[10px] font-mono font-bold text-sky-800 uppercase tracking-wider hidden md:inline border-r border-slate-200 pr-3 shrink-0">
                ARCHIVE EXHIBITS:
              </span>
              
              {[
                { label: 'Vault Overview', icon: Award },
                { label: '01 AI Marketing', icon: Sparkles },
                { label: '02 ChatGPT Prompting', icon: Cpu },
                { label: '03 Canva Creative', icon: Layers },
                { label: '04 Climate Action', icon: Flame }
              ].map((station, idx) => {
                const IconComp = station.icon;
                const isActive = activeCertIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectExhibitStation(idx)}
                    onMouseEnter={() => audioEngine.playHoverSound()}
                    className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold font-mono transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0 ${
                      isActive 
                        ? 'bg-sky-600 text-white shadow-md border border-sky-400' 
                        : 'bg-slate-100 text-slate-700 hover:bg-sky-100 hover:text-sky-800 border border-slate-200'
                    }`}
                  >
                    <IconComp className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? 'text-white' : 'text-sky-600'}`} />
                    <span>{station.label}</span>
                  </button>
                );
              })}
            </motion.div>
          </div>

          {/* Scrollable / Content Area Below Selector Tabs */}
          <div 
            id="cert-card-container"
            ref={certContainerRef}
            onScroll={handleCardScroll}
            className="flex-1 w-full overflow-y-auto pointer-events-auto pr-1 pb-16 pt-1 flex flex-col justify-start items-center"
          >
            {/* EXHIBIT 0: Vault Overview Entrance */}
            {activeCertIndex === 0 && (
              <div className="w-full max-w-xl my-auto pointer-events-auto">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel-hud p-5 sm:p-6 rounded-2xl border border-sky-300/80 bg-white/95 space-y-3 backdrop-blur-xl shadow-2xl relative"
                >
                  <div className="flex items-center gap-2 text-sky-700 text-xs font-mono uppercase tracking-widest font-semibold">
                    <Award className="w-4 h-4 text-sky-600" />
                    <span>SECTOR_04 // SANCTUARY OF CERTIFICATIONS</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">
                    Interactive Architectural Archive
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Each certification capsule in this vault represents an independent milestone in artificial intelligence, digital growth, visual communications, and environmental leadership. Scroll down to travel through each dedicated exhibit sequentially.
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => handleSelectExhibitStation(1)}
                      onMouseEnter={() => audioEngine.playHoverSound()}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                    >
                      <span>Begin Exhibit Tour</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">Scroll to travel naturally</span>
                  </div>
                </motion.div>
              </div>
            )}

            {/* EXHIBITS 1 to 4: INDIVIDUAL SEQUENTIAL CERTIFICATION EXHIBIT PANELS */}
            {activeCertIndex > 0 && activeCertIndex <= SHAHIR_CV.certifications.length && (
              <AnimatePresence mode="wait">
                {(() => {
                  const cert: CertificationItem = SHAHIR_CV.certifications[activeCertIndex - 1];
                  if (!cert) return null;

                  return (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="w-full max-w-4xl mx-auto space-y-3 sm:space-y-4 my-auto"
                    >
                      {/* PANEL 1: Holographic Capsule Header & Core Overview */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05, duration: 0.4 }}
                        className="glass-panel-glow p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-sky-300/80 bg-white/95 backdrop-blur-2xl shadow-xl space-y-3 sm:space-y-4 relative overflow-hidden"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] sm:text-[11px] font-mono font-bold border border-sky-300">
                              EXHIBIT {activeCertIndex} OF 4
                            </span>
                            <span className="text-[11px] sm:text-xs font-mono text-slate-500 uppercase font-semibold">
                              {cert.issuer}
                            </span>
                          </div>
                          <span className="text-[10px] sm:text-xs font-mono text-slate-500 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                            Completed: {cert.date}
                          </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
                          {cert.title}
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                          {cert.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-1">
                          {/* Core Learning Objectives */}
                          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-sky-50/60 border border-sky-200/80 space-y-2">
                            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold text-sky-800 uppercase">
                              <Target className="w-3.5 h-3.5 text-sky-600" />
                              <span>Core Learning Objectives</span>
                            </div>
                            <ul className="space-y-1 text-xs text-slate-700 font-sans">
                              {cert.objectives.map((obj, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <ChevronRight className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                                  <span>{obj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Practical Skills & Tech Stack */}
                          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold text-slate-800 uppercase">
                              <Zap className="w-3.5 h-3.5 text-sky-600" />
                              <span>Practical Skills Acquired</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {cert.skillsAcquired.map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-full bg-white text-slate-800 text-[10px] sm:text-[11px] font-medium border border-slate-200 shadow-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>

                            <div className="pt-2 border-t border-slate-200">
                              <span className="text-[10px] font-mono text-slate-500 font-semibold block mb-1 uppercase">Technologies Involved:</span>
                              <div className="flex flex-wrap gap-1">
                                {cert.technologiesInvolved.map((tech, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 text-[10px] font-mono font-semibold border border-sky-300">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* PANEL 2: FLOATING CARD - PROFESSIONAL IMPACT */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="glass-panel-hud p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-sky-300/80 bg-white/95 backdrop-blur-2xl shadow-lg space-y-1.5 relative"
                      >
                        <div className="flex items-center gap-2 text-sky-800 text-[11px] sm:text-xs font-mono uppercase font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                          <span>Professional Impact</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 font-sans leading-relaxed">
                          {cert.professionalImpact}
                        </p>
                        <div className="pt-1">
                          <span className="text-[10px] sm:text-[11px] font-mono text-sky-700 font-semibold">
                            Capability Upgrade: <span className="text-slate-700 font-normal">{cert.capabilityImprovement}</span>
                          </span>
                        </div>
                      </motion.div>

                      {/* PANEL 3: FLOATING CARD - EXPERIENCE GAINED */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.4 }}
                        className="glass-panel-hud p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-emerald-300/80 bg-white/95 backdrop-blur-2xl shadow-lg space-y-1.5 relative"
                      >
                        <div className="flex items-center gap-2 text-emerald-800 text-[11px] sm:text-xs font-mono uppercase font-bold">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Experience Gained & Real-World Application</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 font-sans leading-relaxed">
                          {cert.experienceGained}
                        </p>
                        <div className="pt-1">
                          <span className="text-[10px] sm:text-[11px] font-mono text-emerald-700 font-semibold">
                            Commercial Application: <span className="text-slate-700 font-normal">{cert.realWorldApplications}</span>
                          </span>
                        </div>
                      </motion.div>

                      {/* Bottom Exhibit Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <button
                          onClick={() => handleSelectExhibitStation(Math.max(0, activeCertIndex - 1))}
                          onMouseEnter={() => audioEngine.playHoverSound()}
                          className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] sm:text-xs font-semibold font-mono border border-slate-300 transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <span>&larr; Prev Exhibit</span>
                        </button>

                        <div className="flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-full bg-sky-50 border border-sky-300/80 text-[10px] sm:text-xs font-mono font-semibold text-sky-900 shadow-sm">
                          {isAtCardBottom ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="text-emerald-800 font-bold">Explanation Complete ✓ Scroll down for Next Card</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3.5 h-3.5 text-sky-600 animate-bounce shrink-0" />
                              <span>Scroll down to read complete card details (Impact & Experience)</span>
                            </>
                          )}
                        </div>

                        {activeCertIndex < 4 && (
                          <button
                            onClick={() => handleSelectExhibitStation(activeCertIndex + 1)}
                            onMouseEnter={() => audioEngine.playHoverSound()}
                            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-[10px] sm:text-xs font-semibold font-mono shadow-md transition-all flex items-center gap-1.5"
                          >
                            <span>Next Exhibit &rarr;</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            )}
          </div>

        </div>
      )}

      {/* CHAPTER 4 OVERLAY: CLOUD SUNRISE PLATFORM & CONTACT */}
      {currentChapter === 4 && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md pointer-events-auto flex flex-col items-center justify-center p-3 sm:p-6 pt-16 sm:pt-20 z-40 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-sky-300/60 bg-white/95 text-center space-y-4 sm:space-y-6 shadow-2xl my-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-amber-100 border border-amber-300 text-[10px] sm:text-xs font-mono text-amber-900 font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>FUTURE COLLABORATION & CONTACT</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-slate-900">
              Let&apos;s Build Something Extraordinary Together
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-sans leading-relaxed">
              Every great collaboration begins with a conversation. Explore my direct contact details below to connect on sales, digital marketing, AI automation, or strategic growth opportunities.
            </p>

            {/* Direct CV Contact Panels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left pt-1">
              {/* Email Card */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-400 transition-all group flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 mb-2 sm:mb-3">
                    <Mail className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  </div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Direct Email</p>
                  <p className="text-xs font-semibold text-slate-900 break-all">{SHAHIR_CV.email}</p>
                </div>
                <div className="pt-3 flex items-center gap-2">
                  <button
                    onClick={handleCopyEmail}
                    onMouseEnter={() => audioEngine.playHoverSound()}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-900 text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5 border border-sky-300"
                  >
                    {copiedEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <a
                    href={`mailto:${SHAHIR_CV.email}`}
                    onMouseEnter={() => audioEngine.playHoverSound()}
                    className="py-1.5 px-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-medium transition-colors"
                    title="Send Email"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* LinkedIn Card */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-all group flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-2 sm:mb-3">
                    <Linkedin className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  </div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase font-semibold">LinkedIn Profile</p>
                  <p className="text-xs font-semibold text-slate-900 truncate">{SHAHIR_CV.linkedin}</p>
                </div>
                <div className="pt-3">
                  <a
                    href={SHAHIR_CV.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => audioEngine.playHoverSound()}
                    className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Visit Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Location Card */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-all flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-2 sm:mb-3">
                    <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  </div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Location</p>
                  <p className="text-xs font-semibold text-slate-900">{SHAHIR_CV.location}</p>
                </div>
                <div className="pt-3">
                  <span className="inline-block w-full py-1.5 px-3 rounded-lg bg-slate-200/80 text-slate-700 text-[10px] font-mono text-center border border-slate-300">
                    Open to Remote & On-Site
                  </span>
                </div>
              </div>
            </div>

            {/* Closing Message */}
            <div className="pt-4 sm:pt-6 border-t border-slate-200 space-y-1">
              <p className="text-xs sm:text-sm font-display font-medium text-amber-700 italic">
                &ldquo;The Journey Continues...&rdquo;
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-sans">
                Thank you for experiencing the professional story of Muhammad Shahir.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* SELECTED 3D OBJECT MODAL DRAWER */}
      <AnimatePresence>
        {selectedObject && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 pointer-events-auto flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="max-w-lg w-full max-h-[85vh] overflow-y-auto bg-white/95 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-sky-300/80 space-y-4 shadow-2xl relative my-auto"
            >
              <button
                onClick={onCloseSelectedObject}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-sky-700 text-xs font-mono uppercase tracking-widest font-semibold">
                <Cpu className="w-4 h-4 text-sky-600" />
                <span>3D Artifact Inspected</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                {selectedObject.id.replace(/-/g, ' ').toUpperCase()}
              </h3>

              {/* Dynamic Modal Content based on Object Type */}
              {selectedObject.type === 'certification' && (
                <div className="space-y-3 text-left">
                  {SHAHIR_CV.certifications
                    .filter((c) => c.id === selectedObject.id)
                    .map((c) => (
                      <div key={c.id} className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-sky-700 font-mono font-semibold">
                          <span>{c.issuer}</span>
                          <span>{c.date}</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed font-sans">{c.description}</p>
                      </div>
                    ))}
                </div>
              )}

              {selectedObject.type === 'command-orb' && (
                <div className="space-y-3 text-left text-sm text-slate-700">
                  <p className="text-xs text-sky-700 font-mono font-semibold">Sales & Marketing Command Node</p>
                  <p className="leading-relaxed font-sans">
                    Core operational focus at Glomore Pakistan: Managing direct sales pipelines, executing keyword-driven SEO strategies, leveraging generative AI for workflow efficiency, and optimizing Google & Microsoft ecosystems.
                  </p>
                </div>
              )}

              {selectedObject.type === 'pillar' && (
                <div className="space-y-3 text-left text-sm text-slate-700">
                  <p className="text-xs text-sky-700 font-mono font-semibold">Innovation Pillar: {selectedObject.id.toUpperCase()}</p>
                  <p className="leading-relaxed font-sans">
                    Exploring the intersection of human imagination, generative AI automation, search visibility, and strategic leadership to build high-converting digital presence.
                  </p>
                </div>
              )}

              {selectedObject.type === 'skill-star' && (
                <div className="space-y-3 text-left">
                  <p className="text-xs text-sky-700 font-mono font-semibold">Skill Node in Galaxy</p>
                  <p className="text-sm text-slate-900 font-bold">
                    {(selectedObject.data as { name?: string })?.name || selectedObject.id}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Verified core competence documented in Muhammad Shahir&apos;s professional CV.
                  </p>
                </div>
              )}

              {selectedObject.type === 'workspace-item' && (
                <div className="space-y-3 text-left text-sm text-slate-700">
                  <p className="text-xs text-amber-700 font-mono font-semibold">Creative Studio Desk Item</p>
                  <p className="text-sm font-bold text-slate-900">
                    {(selectedObject.data as { name?: string })?.name || 'Studio Workstation'}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Where strategic planning, prompt engineering, content workflows, and climate advocacy come together into execution.
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 text-right">
                <button
                  onClick={onCloseSelectedObject}
                  className="px-5 py-2 rounded-full bg-sky-600 hover:bg-sky-700 text-xs font-semibold text-white transition-all shadow-md"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
