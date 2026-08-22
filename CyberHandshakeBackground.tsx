import React, { useEffect, useState } from 'react';

interface CyberHandshakeBackgroundProps {
  interactive?: boolean;
  intensity?: 'subtle' | 'standard' | 'focused';
  className?: string;
}

export const CyberHandshakeBackground: React.FC<CyberHandshakeBackgroundProps> = ({
  interactive = true,
  intensity = 'standard',
  className = ''
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive) return;
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 12;
      const y = (e.clientY / innerHeight - 0.5) * 12;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  const opacityMap = {
    subtle: 'opacity-40',
    standard: 'opacity-70',
    focused: 'opacity-95'
  };

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none select-none bg-[#07090E] z-0 ${className}`}>
      {/* Subtle Matrix / Digital Grid Background */}
      <div 
        className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]"
      />

      {/* Atmospheric Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-950/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-slate-950/60 radial-gradient rounded-full blur-2xl" />

      {/* Futuristic Cyberpunk Handshake SVG & Technical HUD */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out ${opacityMap[intensity]}`}
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`
        }}
      >
        <svg
          viewBox="0 0 1000 1000"
          className="w-full max-w-[1100px] h-full max-h-[1100px] object-contain drop-shadow-[0_0_25px_rgba(0,0,0,0.8)]"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Halftone Dot Pattern for Left Hand */}
            <pattern id="halftone-dense" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="3.2" fill="#E2E8F0" />
            </pattern>
            <pattern id="halftone-medium" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="2.6" fill="#94A3B8" />
            </pattern>
            <pattern id="halftone-sparse" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r="2" fill="#64748B" />
            </pattern>

            {/* Glowing Linear & Radial Gradients */}
            <linearGradient id="wireframeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#CBD5E1" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#64748B" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="hudLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.1" />
            </linearGradient>

            <filter id="neonPulse" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <clipPath id="handshakeClip">
              <rect x="50" y="50" width="900" height="900" rx="16" />
            </clipPath>
          </defs>

          {/* ==================================================== */}
          {/* TECHNICAL HUD OVERLAYS (EXACT REPLICA FROM USER IMAGE) */}
          {/* ==================================================== */}
          <g className="hud-telemetry" stroke="#475569" strokeWidth="1" fill="none">
            {/* Top Border Technical Scale Bar */}
            <line x1="80" y1="65" x2="920" y2="65" stroke="#334155" strokeWidth="1.5" />
            <line x1="80" y1="60" x2="80" y2="70" stroke="#64748B" strokeWidth="1.5" />
            <line x1="920" y1="60" x2="920" y2="70" stroke="#64748B" strokeWidth="1.5" />
            <line x1="500" y1="62" x2="500" y2="68" stroke="#64748B" />

            {/* Top Left: "security*" with circular crosshair reticle */}
            <g transform="translate(90, 50)">
              <circle cx="20" cy="15" r="28" stroke="#E2E8F0" strokeWidth="1.5" />
              <circle cx="20" cy="15" r="4" fill="#FFFFFF" />
              <line x1="-15" y1="15" x2="55" y2="15" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3 3" />
              <text x="56" y="20" fill="#FFFFFF" fontSize="13" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
                security*
              </text>
            </g>

            {/* Top Center: "trust001" Telemetry Badge */}
            <g transform="translate(450, 48)">
              <rect x="0" y="0" width="100" height="24" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
              <circle cx="12" cy="12" r="3" fill="#22C55E" className="animate-ping" style={{ transformOrigin: '12px 12px' }} />
              <circle cx="12" cy="12" r="3" fill="#22C55E" />
              <text x="24" y="16" fill="#E2E8F0" fontSize="12" fontFamily="monospace" fontWeight="600" letterSpacing="1.5">
                trust001
              </text>
            </g>

            {/* Top Right: "+prove" Signature Glyph */}
            <g transform="translate(740, 42)">
              <text x="0" y="24" fill="#FFFFFF" fontSize="22" fontFamily="serif" fontStyle="italic" letterSpacing="1" filter="url(#neonPulse)">
                +prove✓
              </text>
              <line x1="0" y1="30" x2="140" y2="30" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 2" />
            </g>

            {/* Technical HUD Framing Reticles & Grid Box (Center Left) */}
            <g stroke="#334155" strokeWidth="1.2">
              {/* Corner brackets */}
              <path d="M 330,95 L 380,95 M 330,95 L 330,115" stroke="#94A3B8" strokeWidth="2" />
              <path d="M 330,105 L 370,105" stroke="#64748B" strokeWidth="1.5" />
              <path d="M 330,115 L 350,115" stroke="#475569" strokeWidth="1.5" />
              
              {/* Technical Box Framing */}
              <rect x="400" y="95" width="430" height="190" stroke="#334155" strokeWidth="1" fill="none" />
              <circle cx="400" cy="240" r="14" stroke="#94A3B8" strokeWidth="1.5" fill="#07090E" />
              <circle cx="400" cy="240" r="3" fill="#FFFFFF" />
              <line x1="400" y1="95" x2="400" y2="226" stroke="#94A3B8" strokeWidth="1" />
            </g>

            {/* Concentric Radar Rings & Spherical Coordinates (Bottom Center) */}
            <g transform="translate(480, 800)">
              {/* Animated Radar Sweep Ray */}
              <g className="animate-spin" style={{ transformOrigin: '0px 0px', animationDuration: '14s' }}>
                <line x1="0" y1="0" x2="0" y2="-380" stroke="url(#hudLineGrad)" strokeWidth="2" />
              </g>

              {/* Concentric Arcs */}
              <circle cx="0" cy="0" r="100" stroke="#1E293B" strokeWidth="1" />
              <circle cx="0" cy="0" r="180" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="0" cy="0" r="260" stroke="#1E293B" strokeWidth="1" />
              <circle cx="0" cy="0" r="340" stroke="#334155" strokeWidth="1" strokeDasharray="6 6" />
              <circle cx="0" cy="0" r="420" stroke="#1E293B" strokeWidth="1" />

              {/* Radial cross grid */}
              <line x1="-420" y1="0" x2="420" y2="0" stroke="#1E293B" strokeWidth="1" />
              <line x1="0" y1="-420" x2="0" y2="100" stroke="#1E293B" strokeWidth="1" />

              {/* Glowing Amber Connection Dot & Signal Line */}
              <g transform="translate(-80, -100)">
                <circle cx="0" cy="0" r="8" fill="#EA580C" opacity="0.4" className="animate-ping" />
                <circle cx="0" cy="0" r="7" fill="#F97316" stroke="#FFFFFF" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="-280" y2="40" stroke="#F97316" strokeWidth="1.5" strokeDasharray="2 2" />
                <line x1="0" y1="0" x2="80" y2="100" stroke="#F97316" strokeWidth="1" opacity="0.6" />
              </g>

              {/* Coordinate Labels */}
              <text x="280" y="-10" fill="#64748B" fontSize="10" fontFamily="monospace">
                (1000^-1)
              </text>
              <text x="370" y="-10" fill="#64748B" fontSize="10" fontFamily="monospace">
                (10000)
              </text>
              <text x="350" y="-190" fill="#94A3B8" fontSize="14" fontFamily="serif" fontStyle="italic">
                no.
              </text>
            </g>

            {/* Bottom Left Digital Noise Bar & Telemetry Matrix */}
            <g transform="translate(60, 890)">
              <rect x="0" y="0" width="280" height="70" fill="#0B0F19" stroke="#334155" strokeWidth="1" />
              {/* Noise scanlines */}
              {Array.from({ length: 14 }).map((_, i) => (
                <line 
                  key={i} 
                  x1="6" 
                  y1={6 + i * 4.5} 
                  x2={30 + (i % 5) * 45} 
                  y2={6 + i * 4.5} 
                  stroke={i % 2 === 0 ? '#E2E8F0' : '#64748B'} 
                  strokeWidth={1.5}
                  strokeDasharray={`${(i % 3) + 2} ${(i % 2) + 1}`}
                />
              ))}
              <rect x="290" y="5" width="10" height="60" fill="#F59E0B" />
              <text x="8" y="60" fill="#64748B" fontSize="9" fontFamily="monospace">
                SEC_PROTOCOL//SYNAPSE_HRMS_AUTH
              </text>
            </g>
          </g>

          {/* ==================================================== */}
          {/* THE HANDSHAKE ILLUSTRATION (ANIMATED KINETIC CLASP) */}
          {/* ==================================================== */}
          <g 
            className="handshake-interactive-group"
            style={{
              transformOrigin: '500px 480px',
              animation: 'cyberHandshakeAnim 5s ease-in-out infinite'
            }}
          >
            {/* ---------------------------------------------------- */}
            {/* LEFT HAND: HALFTONE DOT MATRIX & ANATOMICAL SHADING */}
            {/* ---------------------------------------------------- */}
            <g className="left-halftone-hand">
              {/* Arm Wrist Silhouette */}
              <path
                d="M -10,180 L 260,340 Q 320,380 370,410 L 480,480 Q 420,530 330,590 L 120,700 L -10,750 Z"
                fill="#0F172A"
                stroke="#334155"
                strokeWidth="1.5"
              />

              {/* Halftone Gradient Layers for Palm & Fingers */}
              <path
                d="M -10,180 L 260,340 Q 320,380 370,410 L 480,480 Q 420,530 330,590 L 120,700 L -10,750 Z"
                fill="url(#halftone-dense)"
              />

              {/* Left Thumb & Index Contours in Halftone */}
              <path
                d="M 320,380 C 370,390 440,380 490,340 C 530,305 525,275 480,290 C 430,305 380,335 340,360 Z"
                fill="url(#halftone-medium)"
                stroke="#64748B"
                strokeWidth="1"
              />

              {/* Left Hand Fingers wrapping around */}
              {/* Index Finger */}
              <path
                d="M 370,410 C 420,440 500,490 540,510 C 565,522 555,545 520,545 C 480,545 420,500 370,460 Z"
                fill="url(#halftone-dense)"
                stroke="#E2E8F0"
                strokeWidth="1.2"
              />
              {/* Middle Finger */}
              <path
                d="M 345,460 C 395,500 480,560 525,585 C 545,595 535,620 500,618 C 455,615 390,560 340,510 Z"
                fill="url(#halftone-dense)"
                stroke="#CBD5E1"
                strokeWidth="1.2"
              />
              {/* Ring Finger */}
              <path
                d="M 320,510 C 365,555 450,630 485,655 C 505,670 490,690 460,685 C 415,678 355,615 310,560 Z"
                fill="url(#halftone-dense)"
                stroke="#94A3B8"
                strokeWidth="1.2"
              />
              {/* Little Finger */}
              <path
                d="M 290,560 C 330,605 405,685 435,715 C 450,730 435,750 410,745 C 370,735 315,665 275,610 Z"
                fill="url(#halftone-sparse)"
                stroke="#64748B"
                strokeWidth="1"
              />
            </g>

            {/* ---------------------------------------------------- */}
            {/* RIGHT HAND: 3D WIREFRAME MESH & GEOMETRIC TOPOLOGY   */}
            {/* ---------------------------------------------------- */}
            <g 
              className="right-wireframe-hand" 
              stroke="url(#wireframeGlow)" 
              strokeWidth="2" 
              fill="none" 
              strokeLinejoin="round" 
              strokeLinecap="round"
            >
              {/* Outer Wrist Arm & Isometric Grid Lines */}
              <path d="M 1010,210 L 800,280 L 670,350 L 530,390" stroke="#FFFFFF" strokeWidth="2.2" />
              <path d="M 1010,340 L 840,410 L 710,480 L 580,540" stroke="#CBD5E1" strokeWidth="2" />
              <path d="M 1010,470 L 870,550 L 740,640 L 610,710" stroke="#94A3B8" strokeWidth="1.8" />

              {/* Wireframe Longitudinal Ribs (Arm to Wrist) */}
              <path d="M 980,220 L 970,450" strokeDasharray="1 1" strokeWidth="1.5" />
              <path d="M 920,240 L 910,480" strokeWidth="1.5" />
              <path d="M 860,260 L 845,510" strokeWidth="1.8" />
              <path d="M 800,280 L 780,540" strokeWidth="2" />
              <path d="M 740,310 L 720,580" strokeWidth="2" />
              <path d="M 680,345 L 660,620" strokeWidth="2.2" />

              {/* Wireframe Cross-Hatch Grid Lattice over Right Wrist & Hand */}
              <g opacity="0.95">
                {/* Ring Cross 1 */}
                <polygon points="800,280 860,260 845,510 780,540" stroke="#E2E8F0" strokeWidth="1.8" fill="rgba(99,102,241,0.03)" />
                <polygon points="740,310 800,280 780,540 720,580" stroke="#FFFFFF" strokeWidth="2" fill="rgba(255,255,255,0.04)" />
                <polygon points="680,345 740,310 720,580 660,620" stroke="#FFFFFF" strokeWidth="2.2" fill="rgba(255,255,255,0.06)" />
                <polygon points="620,380 680,345 660,620 600,660" stroke="#FFFFFF" strokeWidth="2.4" fill="rgba(255,255,255,0.08)" />
              </g>

              {/* Right Hand Thumb Wireframe wrapping OVER Left Hand */}
              <g className="right-thumb-wireframe">
                {/* Thumb Top Contour */}
                <path d="M 530,390 C 470,360 410,345 365,370 C 335,390 350,420 395,430 C 440,440 500,430 550,450" stroke="#FFFFFF" strokeWidth="2.4" />
                {/* Thumb 3D Ring Cross Sections */}
                <path d="M 370,375 L 390,420" stroke="#FFFFFF" strokeWidth="2" />
                <path d="M 400,365 L 420,425" stroke="#FFFFFF" strokeWidth="2.2" />
                <path d="M 440,360 L 460,430" stroke="#FFFFFF" strokeWidth="2.2" />
                <path d="M 480,365 L 500,435" stroke="#FFFFFF" strokeWidth="2.2" />
                <path d="M 520,380 L 535,445" stroke="#FFFFFF" strokeWidth="2.2" />
                {/* Center thumb axial spine line */}
                <path d="M 365,370 Q 440,400 550,450" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />
              </g>

              {/* Right Hand Palm Mesh Over Left Fingers (The Clasp Core) */}
              <g className="right-fingers-wireframe">
                {/* Knuckle arches and interlocking wireframe grids */}
                <path d="M 550,450 L 480,480 L 440,540 L 430,600" stroke="#FFFFFF" strokeWidth="2.5" />
                <path d="M 600,480 L 530,515 L 490,580 L 470,640" stroke="#FFFFFF" strokeWidth="2.5" />
                <path d="M 640,520 L 570,560 L 530,630 L 505,690" stroke="#FFFFFF" strokeWidth="2.2" />
                <path d="M 670,570 L 600,610 L 560,680 L 535,740" stroke="#CBD5E1" strokeWidth="2" />

                {/* Finger Interlocking Wireframe Segments */}
                <polygon points="480,480 530,515 490,580 440,540" stroke="#FFFFFF" strokeWidth="2" fill="rgba(255,255,255,0.05)" />
                <polygon points="440,540 490,580 470,640 430,600" stroke="#FFFFFF" strokeWidth="2" fill="rgba(255,255,255,0.05)" />
                <polygon points="530,515 570,560 530,630 490,580" stroke="#FFFFFF" strokeWidth="2" fill="rgba(255,255,255,0.05)" />
                <polygon points="490,580 530,630 505,690 470,640" stroke="#FFFFFF" strokeWidth="2" fill="rgba(255,255,255,0.05)" />
                <polygon points="570,560 600,610 560,680 530,630" stroke="#FFFFFF" strokeWidth="2" fill="rgba(255,255,255,0.05)" />

                {/* Fingertips wireframe caps */}
                <path d="M 430,600 Q 420,630 445,635 Q 470,640 470,640" stroke="#FFFFFF" strokeWidth="2.2" />
                <path d="M 470,640 Q 460,680 485,685 Q 505,690 505,690" stroke="#FFFFFF" strokeWidth="2.2" />
                <path d="M 505,690 Q 495,730 520,735 Q 535,740 535,740" stroke="#CBD5E1" strokeWidth="2" />
              </g>

              {/* Glowing Wireframe Intersection Vertices (Nodes) */}
              <g fill="#FFFFFF" filter="url(#neonPulse)">
                <circle cx="365" cy="370" r="3.5" />
                <circle cx="395" cy="430" r="3" />
                <circle cx="440" cy="360" r="3" />
                <circle cx="480" cy="480" r="3.5" />
                <circle cx="530" cy="515" r="3.5" />
                <circle cx="490" cy="580" r="3.5" />
                <circle cx="440" cy="540" r="3" />
                <circle cx="570" cy="560" r="3.5" />
                <circle cx="530" cy="630" r="3.5" />
                <circle cx="505" cy="690" r="3" />
                <circle cx="680" cy="345" r="3.5" />
                <circle cx="740" cy="310" r="3.5" />
                <circle cx="800" cy="280" r="3.5" />
              </g>

              {/* Interactive Synaptic Arc Pulses across the Clasp */}
              <g stroke="#6366F1" strokeWidth="1.5" opacity="0.8">
                <line x1="480" y1="480" x2="490" y2="340" strokeDasharray="3 3" />
                <line x1="530" y1="515" x2="520" y2="545" strokeDasharray="2 2" />
                <line x1="490" y1="580" x2="525" y2="585" strokeDasharray="3 3" />
                <line x1="440" y1="540" x2="370" y2="460" strokeDasharray="2 2" />
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* Cyberpunk Scanline Scan Beam */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent h-24 w-full pointer-events-none"
        style={{
          animation: 'scanlineSweep 7s linear infinite'
        }}
      />
    </div>
  );
};
