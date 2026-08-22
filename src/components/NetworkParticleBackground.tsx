import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulseOffset: number;
  clusterWeight: number; // 0 (left/floating) to 1 (right cluster)
}

interface PulsePacket {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
}

interface NetworkParticleBackgroundProps {
  interactive?: boolean;
  intensity?: 'subtle' | 'standard' | 'focused';
  className?: string;
}

export const NetworkParticleBackground: React.FC<NetworkParticleBackgroundProps> = ({
  interactive = true,
  intensity = 'standard',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const [mouseParallax, setMouseParallax] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 16;
      const y = (e.clientY / innerHeight - 0.5) * 16;
      setMouseParallax({ x, y });

      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true
        };
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Initialize particles matching the uploaded constellation graph reference
    let particles: Particle[] = [];
    let pulsePackets: PulsePacket[] = [];

    const initParticles = () => {
      particles = [];
      pulsePackets = [];

      // Calculate particle density based on screen width
      const totalCount = Math.floor(Math.min(width, 1920) / 14); // ~80-130 particles
      
      for (let i = 0; i < totalCount; i++) {
        // Bias particles towards the right side (matching user's uploaded reference image)
        // 65% of particles concentrated in the right half / top-right quadrant
        const isRightBiased = Math.random() < 0.68;
        let x: number;
        let y: number;

        if (isRightBiased) {
          // Right cluster distribution: power function pushing towards right edge
          const u = Math.random();
          x = width * (0.42 + 0.58 * Math.pow(u, 0.75));
          y = height * (0.02 + 0.96 * Math.random());
        } else {
          // Dispersed floating dots across left and center
          x = width * Math.random() * 0.65;
          y = height * (0.05 + 0.9 * Math.random());
        }

        // Particle size distribution: mix of bold focal points (3.5 - 5.5px) and micro satellite dots (1 - 2.5px)
        const isFocal = Math.random() < 0.16;
        const isMicro = Math.random() < 0.45;
        const baseRadius = isFocal ? 3.5 + Math.random() * 2.2 : isMicro ? 1.0 + Math.random() * 1.2 : 2.0 + Math.random() * 1.5;

        // Alpha matching black/charcoal nodes on clean white background
        const baseAlpha = isFocal ? 0.75 + Math.random() * 0.22 : 0.35 + Math.random() * 0.45;

        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.28,
          radius: baseRadius,
          baseRadius,
          alpha: baseAlpha,
          baseAlpha,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          pulseOffset: Math.random() * Math.PI * 2,
          clusterWeight: isRightBiased ? 0.9 : 0.2
        });
      }
    };

    initParticles();

    // Spawn occasional electric data pulse packets along active edges
    let lastPacketSpawn = 0;

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Connection threshold distance
      const maxDistance = width < 768 ? 95 : 135;
      const mouseMaxDist = 160;

      // 1. Update positions & handle soft boundary bounce
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Subtle breathing radius and alpha
        p.radius = p.baseRadius + Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset) * 0.4;
        p.alpha = Math.max(0.15, Math.min(1.0, p.baseAlpha + Math.sin(time * p.pulseSpeed * 40 + p.pulseOffset) * 0.12));

        // Soft screen bounce
        if (p.x < 10) {
          p.x = 10;
          p.vx = Math.abs(p.vx);
        } else if (p.x > width - 10) {
          p.x = width - 10;
          p.vx = -Math.abs(p.vx);
        }

        if (p.y < 10) {
          p.y = 10;
          p.vy = Math.abs(p.vy);
        } else if (p.y > height - 10) {
          p.y = height - 10;
          p.vy = -Math.abs(p.vy);
        }

        // Mouse interaction: subtle attraction and push
        if (mouseRef.current.active && interactive) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseMaxDist) {
            const force = (1 - dist / mouseMaxDist) * 0.8;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }
      }

      // 2. Draw Interconnecting Graph Lines (Geometric Network)
      ctx.lineWidth = 0.75;

      const activeNeighbors: { from: number; to: number; dist: number }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Connect with other particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistance * maxDistance) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxDistance) * 0.28 * Math.min(p1.alpha, p2.alpha);

            if (lineAlpha > 0.01) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(15, 23, 42, ${lineAlpha})`; // Charcoal/Slate lines
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();

              activeNeighbors.push({ from: i, to: j, dist });
            }
          }
        }

        // Connect with mouse cursor if close
        if (mouseRef.current.active && interactive) {
          const mdx = mouseRef.current.x - p1.x;
          const mdy = mouseRef.current.y - p1.y;
          const mdistSq = mdx * mdx + mdy * mdy;

          if (mdistSq < mouseMaxDist * mouseMaxDist) {
            const mdist = Math.sqrt(mdistSq);
            const mLineAlpha = (1 - mdist / mouseMaxDist) * 0.4;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${mLineAlpha})`; // Indigo active tether
            ctx.lineWidth = 1;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();
            ctx.lineWidth = 0.75;
          }
        }
      }

      // 3. Update & Draw Data Pulse Sparks along lines
      if (time - lastPacketSpawn > 0.6 && activeNeighbors.length > 0) {
        lastPacketSpawn = time;
        const randomEdge = activeNeighbors[Math.floor(Math.random() * activeNeighbors.length)];
        pulsePackets.push({
          fromIndex: randomEdge.from,
          toIndex: randomEdge.to,
          progress: 0,
          speed: 0.025 + Math.random() * 0.03
        });
      }

      for (let k = pulsePackets.length - 1; k >= 0; k--) {
        const packet = pulsePackets[k];
        packet.progress += packet.speed;

        if (packet.progress >= 1) {
          pulsePackets.splice(k, 1);
          continue;
        }

        const pFrom = particles[packet.fromIndex];
        const pTo = particles[packet.toIndex];
        if (!pFrom || !pTo) continue;

        const curX = pFrom.x + (pTo.x - pFrom.x) * packet.progress;
        const curY = pFrom.y + (pTo.y - pFrom.y) * packet.progress;

        ctx.beginPath();
        ctx.arc(curX, curY, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${0.8 * (1 - Math.abs(packet.progress - 0.5) * 2)})`;
        ctx.fill();
      }

      // 4. Draw Particle Nodes (Charcoal Dots with Subtle Atmospheric Halos)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Soft outer halo for focal points
        if (p.baseRadius > 3.0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(15, 23, 42, ${p.alpha * 0.08})`;
          ctx.fill();
        }

        // Inner solid core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(15, 23, 42, ${p.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [interactive]);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      {/* 1. Luminous Pure White to Soft Slate Alabaster Background Canvas */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#FFFFFF] via-[#F8FAFC] to-[#EFF3F8]"
      />

      {/* 2. Soft Ambient Lighting Gradients (Enhances depth matching the photo) */}
      <div className="absolute top-0 right-0 w-[850px] h-[850px] bg-slate-200/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-100/60 rounded-full blur-[120px] pointer-events-none" />

      {/* 3. Static High-Definition Constellation Backdrop Layer (Matches user's exact image nodes topology) */}
      <div 
        className="absolute inset-0 transition-transform duration-500 ease-out opacity-80"
        style={{
          transform: `translate3d(${mouseParallax.x * 0.5}px, ${mouseParallax.y * 0.5}px, 0)`
        }}
      >
        <svg
          viewBox="0 0 1440 900"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dense Constellation Geometric Lines on Right */}
          <g stroke="#0F172A" strokeWidth="0.8" opacity="0.22" fill="none">
            {/* Upper Right Major Triangles & Meshes */}
            <polygon points="1200,80 1350,120 1280,240" />
            <polygon points="1350,120 1420,200 1370,310" />
            <polygon points="1280,240 1370,310 1240,360" />
            <polygon points="1120,160 1200,80 1280,240" />
            <polygon points="1040,220 1120,160 1180,300" />
            <polygon points="1180,300 1280,240 1240,360" />

            {/* Mid-Right Complex Cluster */}
            <polygon points="1240,360 1370,310 1400,450" />
            <polygon points="1240,360 1400,450 1310,520" />
            <polygon points="1150,420 1240,360 1310,520" />
            <polygon points="1020,380 1150,420 1110,510" />
            <polygon points="910,340 1020,380 970,470" />
            <polygon points="970,470 1020,380 1110,510" />

            {/* Center-Dispersing Strands */}
            <line x1="910" y1="340" x2="780" y2="390" />
            <line x1="780" y1="390" x2="710" y2="480" />
            <line x1="710" y1="480" x2="620" y2="520" />
            <line x1="620" y1="520" x2="520" y2="580" />
            <line x1="780" y1="390" x2="840" y2="510" />
            <line x1="840" y1="510" x2="970" y2="470" />
            <line x1="710" y1="480" x2="840" y2="510" />

            {/* Lower-Right Network */}
            <polygon points="1310,520 1400,450 1440,600" />
            <polygon points="1310,520 1440,600 1350,680" />
            <polygon points="1210,580 1310,520 1350,680" />
            <polygon points="1110,510 1210,580 1180,690" />
            <polygon points="1180,690 1350,680 1270,790" />
            <polygon points="1060,640 1180,690 1120,800" />

            {/* Dispersed Left Satellite Ties */}
            <line x1="520" y1="580" x2="410" y2="610" strokeDasharray="3 3" opacity="0.6" />
            <line x1="620" y1="520" x2="580" y2="410" strokeDasharray="2 2" opacity="0.5" />
            <line x1="780" y1="390" x2="720" y2="280" opacity="0.5" />
            <line x1="1040" y1="220" x2="940" y2="170" opacity="0.5" />
          </g>

          {/* Focal Constellation Nodes (Deep Charcoal Circles matching user photo) */}
          <g fill="#0F172A">
            {/* Major Bold Nodes */}
            <circle cx="1200" cy="80" r="5" opacity="0.9" />
            <circle cx="1350" cy="120" r="6" opacity="0.95" />
            <circle cx="1280" cy="240" r="5.5" opacity="0.9" />
            <circle cx="1420" cy="200" r="4.5" opacity="0.85" />
            <circle cx="1370" cy="310" r="6.5" opacity="0.95" />
            <circle cx="1240" cy="360" r="5" opacity="0.9" />
            <circle cx="1400" cy="450" r="7" opacity="0.95" />
            <circle cx="1310" cy="520" r="6" opacity="0.9" />
            <circle cx="1150" cy="420" r="5.5" opacity="0.85" />
            <circle cx="1020" cy="380" r="5" opacity="0.8" />
            <circle cx="910" cy="340" r="4.5" opacity="0.75" />
            <circle cx="970" cy="470" r="5" opacity="0.8" />
            <circle cx="840" cy="510" r="4.5" opacity="0.75" />
            <circle cx="780" cy="390" r="4" opacity="0.7" />
            <circle cx="710" cy="480" r="4" opacity="0.65" />
            <circle cx="620" cy="520" r="3.5" opacity="0.6" />
            <circle cx="520" cy="580" r="3.5" opacity="0.55" />
            <circle cx="410" cy="610" r="3" opacity="0.45" />

            {/* Micro Satellite Dots (Gradual Dispersal towards Left) */}
            <circle cx="1120" cy="160" r="3" opacity="0.7" />
            <circle cx="1040" cy="220" r="3.5" opacity="0.75" />
            <circle cx="1180" cy="300" r="3" opacity="0.7" />
            <circle cx="1110" cy="510" r="3.5" opacity="0.75" />
            <circle cx="1210" cy="580" r="3.5" opacity="0.8" />
            <circle cx="1350" cy="680" r="5.5" opacity="0.9" />
            <circle cx="1180" cy="690" r="4" opacity="0.8" />
            <circle cx="1270" cy="790" r="4.5" opacity="0.85" />
            <circle cx="1120" cy="800" r="3" opacity="0.7" />
            <circle cx="1060" cy="640" r="3.5" opacity="0.7" />

            {/* Random Floating Ambient Orbiting Dots */}
            <circle cx="880" cy="210" r="2.5" opacity="0.5" />
            <circle cx="790" cy="160" r="2" opacity="0.4" />
            <circle cx="690" cy="240" r="2.5" opacity="0.45" />
            <circle cx="580" cy="310" r="2" opacity="0.35" />
            <circle cx="480" cy="220" r="2.5" opacity="0.3" />
            <circle cx="360" cy="340" r="2" opacity="0.25" />
            <circle cx="280" cy="450" r="2.5" opacity="0.3" />
            <circle cx="340" cy="540" r="2" opacity="0.3" />
            <circle cx="240" cy="620" r="1.8" opacity="0.2" />
            <circle cx="180" cy="380" r="2" opacity="0.2" />
            <circle cx="140" cy="510" r="1.5" opacity="0.18" />
            <circle cx="890" cy="620" r="2.5" opacity="0.5" />
            <circle cx="810" cy="680" r="2" opacity="0.4" />
            <circle cx="680" cy="640" r="2.5" opacity="0.35" />
            <circle cx="560" cy="720" r="2" opacity="0.3" />
            <circle cx="440" cy="780" r="2.2" opacity="0.25" />
          </g>
        </svg>
      </div>

      {/* 4. Interactive Live Dynamic Canvas Particle Simulation Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 5. Minimalist Ambient Depth Vignette */}
      <div 
        className="absolute inset-0 bg-radial from-transparent via-transparent to-slate-900/5 pointer-events-none"
      />
    </div>
  );
};
