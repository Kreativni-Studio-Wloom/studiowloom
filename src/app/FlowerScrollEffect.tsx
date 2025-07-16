"use client";
import { useEffect, useRef } from "react";

export default function FlowerScrollEffect() {
  const flowerRef = useRef<HTMLImageElement>(null);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    let lastProgress = -1;
    const update = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      // Pokud se progress změnil, aktualizuj transformaci
      if (progress !== lastProgress) {
        const scale = 1 + progress * 1.0;
        const rotate = -10 + progress * 30;
        if (flowerRef.current) {
          flowerRef.current.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
        }
        lastProgress = progress;
      }
      animationFrame.current = requestAnimationFrame(update);
    };
    animationFrame.current = requestAnimationFrame(update);
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return (
    <img
      ref={flowerRef}
      src="/flower.svg"
      alt="květ dekorace"
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        width: 80,
        height: 80,
        opacity: 0.7,
        zIndex: 50,
        pointerEvents: "none",
        transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
      }}
    />
  );
} 