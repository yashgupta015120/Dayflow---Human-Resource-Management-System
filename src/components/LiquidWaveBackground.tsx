import React, { useEffect, useRef } from 'react';

export const LiquidWaveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 256);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 0.008; // Gentle, smooth wave speed
      ctx.clearRect(0, 0, width, height);

      // 1. Deep Obsidian Base Gradient
      const baseGrad = ctx.createLinearGradient(0, 0, width, height);
      baseGrad.addColorStop(0, '#0a0c10');
      baseGrad.addColorStop(0.4, '#050608');
      baseGrad.addColorStop(0.7, '#08090d');
      baseGrad.addColorStop(1, '#020304');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // Helper function to draw smooth fluid wave ribbon curves
      const drawWaveLayer = (
        yBaseRatio: number,
        amplitude: number,
        freq: number,
        speed: number,
        fillGrad: CanvasGradient,
        alpha: number
      ) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();

        const baseY = height * yBaseRatio;
        ctx.moveTo(0, height);
        ctx.lineTo(0, baseY);

        // Compute smooth wave points across width
        const steps = 30;
        for (let i = 0; i <= steps; i++) {
          const x = (width / steps) * i;
          const nx = x / width;
          // Organic multi-harmonic wave displacement
          const wave1 = Math.sin(time * speed + nx * freq * Math.PI * 2) * amplitude;
          const wave2 = Math.cos(time * speed * 0.7 + nx * (freq * 1.5) * Math.PI) * (amplitude * 0.4);
          const wave3 = Math.sin(time * speed * 0.3 + (1 - nx) * 3) * (amplitude * 0.25);
          const y = baseY + wave1 + wave2 + wave3;

          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = fillGrad;
        ctx.fill();
        ctx.restore();
      };

      // 2. Layer 1: Dark Slate-Charcoal Underlying Wave
      const wave1Grad = ctx.createLinearGradient(0, height * 0.3, width, height);
      wave1Grad.addColorStop(0, 'rgba(35, 42, 54, 0.9)');
      wave1Grad.addColorStop(0.5, 'rgba(18, 22, 30, 0.95)');
      wave1Grad.addColorStop(1, 'rgba(6, 8, 11, 1)');
      drawWaveLayer(0.48, 24, 1.2, 1.2, wave1Grad, 0.85);

      // 3. Layer 2: Middle Charcoal Metallic Fold
      const wave2Grad = ctx.createLinearGradient(0, height * 0.4, width, height);
      wave2Grad.addColorStop(0, 'rgba(60, 70, 88, 0.7)');
      wave2Grad.addColorStop(0.3, 'rgba(30, 36, 48, 0.85)');
      wave2Grad.addColorStop(1, 'rgba(8, 10, 14, 0.95)');
      drawWaveLayer(0.58, 28, 1.4, -0.9, wave2Grad, 0.75);

      // 4. Layer 3: Luminous Liquid Silver/White Crest (Matching uploaded image's focal crest)
      const crestGrad = ctx.createRadialGradient(
        width * (0.35 + Math.sin(time * 0.8) * 0.08),
        height * (0.55 + Math.cos(time * 0.6) * 0.04),
        10,
        width * 0.4,
        height * 0.6,
        width * 0.9
      );
      crestGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      crestGrad.addColorStop(0.2, 'rgba(215, 225, 240, 0.65)');
      crestGrad.addColorStop(0.45, 'rgba(130, 145, 170, 0.35)');
      crestGrad.addColorStop(0.8, 'rgba(35, 42, 55, 0.1)');
      crestGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.beginPath();
      // Organic crest curve
      const crestBaseY = height * 0.46;
      ctx.moveTo(0, height * 0.9);
      for (let i = 0; i <= 30; i++) {
        const x = (width / 30) * i;
        const nx = x / width;
        const crestY =
          crestBaseY +
          Math.sin(time * 1.1 + nx * 2.2 * Math.PI) * 32 +
          Math.cos(time * 0.8 + nx * 1.5) * 16 +
          (1 - nx) * 50;
        ctx.lineTo(x, crestY);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = crestGrad;
      ctx.fill();
      ctx.restore();

      // 5. Layer 4: Foreground Fluid Silk Highlight Streaks
      const silkGrad = ctx.createLinearGradient(
        width * 0.15,
        height * 0.45,
        width * 0.65,
        height * 0.85
      );
      silkGrad.addColorStop(0, 'rgba(240, 245, 255, 0.7)');
      silkGrad.addColorStop(0.25, 'rgba(180, 195, 215, 0.4)');
      silkGrad.addColorStop(0.6, 'rgba(50, 60, 75, 0.15)');
      silkGrad.addColorStop(1, 'rgba(5, 7, 10, 0)');

      ctx.save();
      ctx.lineWidth = 42;
      ctx.strokeStyle = silkGrad;
      ctx.lineCap = 'round';
      ctx.filter = 'blur(16px)';
      ctx.beginPath();
      const startX = width * (0.2 + Math.sin(time * 0.7) * 0.05);
      const startY = height * (0.75 + Math.cos(time * 0.9) * 0.03);
      const cp1X = width * (0.15 + Math.cos(time * 1.1) * 0.06);
      const cp1Y = height * (0.58 + Math.sin(time * 0.8) * 0.04);
      const cp2X = width * (0.45 + Math.sin(time * 0.9) * 0.05);
      const cp2Y = height * (0.48 + Math.cos(time * 0.7) * 0.04);
      const endX = width * 0.85;
      const endY = height * 0.42;

      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
      ctx.stroke();
      ctx.restore();

      // 6. Layer 5: Secondary Lower Ambient Silk Veil
      const veilGrad = ctx.createLinearGradient(0, height * 0.65, width, height);
      veilGrad.addColorStop(0, 'rgba(20, 24, 32, 0.9)');
      veilGrad.addColorStop(0.5, 'rgba(10, 12, 16, 0.95)');
      veilGrad.addColorStop(1, 'rgba(3, 4, 6, 1)');
      drawWaveLayer(0.72, 18, 1.8, 0.8, veilGrad, 0.9);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Base Dark Canvas */}
      <div className="absolute inset-0 bg-[#06080C]" />

      {/* 2. Fluid Wave Animation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-95"
      />

      {/* 3. Sleek Translucent Dark Glass Overlay for Optimal Contrast & Button Pop */}
      <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[1px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/60 pointer-events-none" />
      <div className="absolute inset-0 border-r border-white/10 pointer-events-none" />
    </div>
  );
};
