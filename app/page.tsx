'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Scene3D } from '@/components/Scene3D';
import { InteractiveUI } from '@/components/InteractiveUI';
import { ChapterOverlay } from '@/components/ChapterOverlay';
import { audioEngine } from '@/lib/audio';

export default function Home() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 1
  const [selectedObject, setSelectedObject] = useState<{ type: string; id: string; data?: unknown } | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const currentChapterRef = useRef(0);

  // Initialize Web Audio API on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      audioEngine.init();
      audioEngine.startAmbientDrone();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('wheel', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('wheel', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('wheel', handleFirstInteraction);
    };
  }, []);

  // Smooth lerp loop for scrollProgress (slow, elegant ~3-second transition effect)
  useEffect(() => {
    let animationFrameId: number;

    const updateScroll = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.00005) {
        // Slow lerp factor (0.025) creates a smooth, deliberate ~3s glide across chapters and cards
        const lerpFactor = 0.025;
        const nextProgress = current + diff * lerpFactor;
        currentProgressRef.current = nextProgress;
        setScrollProgress(nextProgress);

        // Determine active chapter based on scroll progress bracket
        let nextChapter = 0;
        if (nextProgress >= 0.88) nextChapter = 4;
        else if (nextProgress >= 0.50) nextChapter = 3;
        else if (nextProgress >= 0.28) nextChapter = 2;
        else if (nextProgress >= 0.10) nextChapter = 1;
        else nextChapter = 0;

        if (nextChapter !== currentChapterRef.current) {
          currentChapterRef.current = nextChapter;
          setCurrentChapter(nextChapter);
          audioEngine.playPortalSwoosh();
        }
      }

      animationFrameId = requestAnimationFrame(updateScroll);
    };

    animationFrameId = requestAnimationFrame(updateScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Handle wheel scrolling to drive smooth cinematic progress
  const handleWheel = useCallback((e: WheelEvent) => {
    if (selectedObject) return; // Freeze background scroll when inspecting modal

    // If an active scrollable card container exists (e.g., in Chapter 3 Sanctuary of Certifications),
    // ensure the user completes scrolling down through the full card explanation before advancing to the next card!
    const certCardContainer = document.getElementById('cert-card-container');
    if (certCardContainer) {
      const isScrollable = certCardContainer.scrollHeight > certCardContainer.clientHeight + 4;
      if (isScrollable) {
        const isScrollingDown = e.deltaY > 0;
        const isAtBottom = certCardContainer.scrollTop + certCardContainer.clientHeight >= certCardContainer.scrollHeight - 10;
        const isAtTop = certCardContainer.scrollTop <= 8;

        if (isScrollingDown && !isAtBottom) {
          certCardContainer.scrollTop += e.deltaY;
          e.preventDefault();
          return;
        }

        if (!isScrollingDown && !isAtTop) {
          certCardContainer.scrollTop += e.deltaY;
          e.preventDefault();
          return;
        }
      }
    }

    e.preventDefault();
    // In Chapter 3 (Sanctuary of Certifications), apply a weighted delta requiring sustained scrolling per card (~3s)
    const inChapter3 = targetProgressRef.current >= 0.50 && targetProgressRef.current < 0.88;
    const deltaMultiplier = inChapter3 ? 0.000035 : 0.00006;
    const delta = e.deltaY * deltaMultiplier;

    targetProgressRef.current = Math.min(Math.max(targetProgressRef.current + delta, 0), 1);
  }, [selectedObject]);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Touch swipe support for mobile devices
  const touchStartYRef = useRef(0);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (selectedObject) return;
    const touchY = e.touches[0].clientY;
    const deltaYRaw = touchStartYRef.current - touchY;
    touchStartYRef.current = touchY;

    // Check if an active scrollable card container exists
    const certCardContainer = document.getElementById('cert-card-container');
    if (certCardContainer) {
      const isScrollable = certCardContainer.scrollHeight > certCardContainer.clientHeight + 4;
      if (isScrollable) {
        const isScrollingDown = deltaYRaw > 0;
        const isAtBottom = certCardContainer.scrollTop + certCardContainer.clientHeight >= certCardContainer.scrollHeight - 10;
        const isAtTop = certCardContainer.scrollTop <= 8;

        if (isScrollingDown && !isAtBottom) {
          certCardContainer.scrollTop += deltaYRaw;
          return;
        }

        if (!isScrollingDown && !isAtTop) {
          certCardContainer.scrollTop += deltaYRaw;
          return;
        }
      }
    }

    const inChapter3 = targetProgressRef.current >= 0.50 && targetProgressRef.current < 0.88;
    const deltaMultiplier = inChapter3 ? 0.00007 : 0.00012;
    const deltaY = deltaYRaw * deltaMultiplier;

    targetProgressRef.current = Math.min(Math.max(targetProgressRef.current + deltaY, 0), 1);
  }, [selectedObject]);

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleTouchMove]);

  // Handle direct navigation to a specific chapter index
  const handleNavigateChapter = (chapterIdx: number) => {
    audioEngine.playPortalSwoosh();
    const progressMap = [0.0, 0.18, 0.38, 0.61, 0.92];
    const targetProgress = progressMap[chapterIdx] ?? 0;
    targetProgressRef.current = targetProgress;
  };

  // Handle direct navigation to a specific scroll progress
  const handleNavigateScrollProgress = (progress: number) => {
    audioEngine.playPortalSwoosh();
    targetProgressRef.current = progress;
  };

  const handleSelectObject = (type: string, id: string, data?: unknown) => {
    setSelectedObject({ type, id, data });
  };

  const handleCloseSelectedObject = () => {
    setSelectedObject(null);
  };

  const handleToggleSound = () => {
    const isMuted = audioEngine.toggleMute();
    setSoundMuted(isMuted);
  };

  const handleToggleReducedMotion = () => {
    setReducedMotion((prev) => !prev);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans selection:bg-cyan-500 selection:text-black">
      {/* 3D WebGL Canvas Layer */}
      <Scene3D
        currentChapter={currentChapter}
        scrollProgress={scrollProgress}
        onSelectObject={handleSelectObject}
        reducedMotion={reducedMotion}
      />

      {/* Top Floating HUD Control Bar */}
      <InteractiveUI
        currentChapter={currentChapter}
        onNavigateChapter={handleNavigateChapter}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Synchronized Chapter Overlays & Selected Modals */}
      <ChapterOverlay
        currentChapter={currentChapter}
        scrollProgress={scrollProgress}
        selectedObject={selectedObject}
        onCloseSelectedObject={handleCloseSelectedObject}
        onNavigateChapter={handleNavigateChapter}
        onNavigateScrollProgress={handleNavigateScrollProgress}
      />
    </main>
  );
}
