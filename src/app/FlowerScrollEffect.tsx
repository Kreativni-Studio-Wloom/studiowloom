"use client";
import { useEffect, useRef } from "react";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function FlowerScrollEffect() {
  const flowerRef = useRef<HTMLImageElement>(null);
  const animationFrame = useRef<number | null>(null);
  // Uložíme aktuální hodnoty, které budou animované
  const current = useRef({ scale: 1, rotate: -10 });

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      // Cílové hodnoty
      const targetScale = 1 + progress * 1.0;
      const targetRotate = -10 + progress * 30;
      // Plynulý přechod (lerp)
      current.current.scale = lerp(current.current.scale, targetScale, 0.15);
      current.current.rotate = lerp(current.current.rotate, targetRotate, 0.15);
      if (flowerRef.current) {
        flowerRef.current.style.transform = `scale(${current.current.scale}) rotate(${current.current.rotate}deg)`;
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
        transition: "none",
      }}
    />
  );
} 