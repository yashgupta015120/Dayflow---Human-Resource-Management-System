import React, { useEffect, useState } from 'react';

interface WorkplaceHexBackgroundProps {
  interactive?: boolean;
  intensity?: 'subtle' | 'standard' | 'focused';
  className?: string;
}

export const WorkplaceHexBackground: React.FC<WorkplaceHexBackgroundProps> = ({
  interactive = true,
  intensity = 'standard',
  className = ''
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive) return;
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 16;
      const y = (e.clientY / innerHeight - 0.5) * 16;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  const opacityMap = {
    subtle: 'opacity-50',
    standard: 'opacity-85',
    focused: 'opacity-95'
  };

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}>
      {/* 1. Base Gradient Atmosphere - Deep Sapphire to Executive Slate Blue */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#0A192F] via-[#122842] to-[#1E3752]"
      />

      {/* 2. Soft Atmospheric Ambient Lights & Bokeh */}
      {/* Top ambient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px]" />
      
      {/* Left side warm lamp glow (matching photo's soft lamp bokeh) */}
      <div className="absolute top-1/3 -left-20 w-[420px] h-[500px] bg-sky-400/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 left-0 w-[350px] h-[350px] bg-slate-300/10 rounded-full blur-[90px]" />

      {/* Right side subtle screen illumination */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[450px] bg-indigo-400/10 rounded-full blur-[110px]" />

      {/* 3. Subtle Desk Silhouette & Blurred Executive Foreground at Bottom */}
      <div className="absolute bottom-0 inset-x-0 h-[38vh] overflow-hidden pointer-events-none opacity-40">
        <svg 
          viewBox="0 0 1440 400" 
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="deskBlur" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
            <linearGradient id="deskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E324A" stopOpacity="0.4" />
              <stop offset="40%" stopColor="#132338" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0B1728" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="laptopGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="lampGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Desk Surface Horizon */}
          <path d="M0,240 Q720,230 1440,240 L1440,400 L0,400 Z" fill="url(#deskGrad)" />

          {/* Left Lamp Body & Pencil Cup Silhouette (Blurred) */}
          <g filter="url(#deskBlur)">
            {/* Lamp shade edge */}
            <path d="M-50,60 Q40,160 -10,320 L-60,320 Z" fill="url(#lampGlow)" />
            {/* Stationery cup */}
            <rect x="50" y="220" width="60" height="90" rx="6" fill="#1E293B" opacity="0.6" />
            {/* Pencils */}
            <line x1="68" y1="230" x2="52" y2="175" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            <line x1="88" y1="230" x2="105" y2="170" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            {/* Notebook / Papers */}
            <polygon points="10,300 160,290 140,340 -10,350" fill="#CBD5E1" opacity="0.15" />
          </g>

          {/* Right Laptop Silhouette (Blurred) */}
          <g filter="url(#deskBlur)">
            {/* Laptop Base */}
            <polygon points="980,290 1420,270 1460,360 920,380" fill="url(#laptopGrad)" />
            {/* Laptop Screen Open */}
            <polygon points="1080,180 1400,160 1410,275 1090,295" fill="#E2E8F0" opacity="0.25" />
            {/* Screen UI Glow */}
            <rect x="1110" y="185" width="260" height="85" rx="3" fill="#FFFFFF" opacity="0.2" />
          </g>
        </svg>
      </div>

      {/* 4. The Exact Geometric Hexagonal Infographic Constellation Overlay */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out ${opacityMap[intensity]}`}
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`
        }}
      >
        <svg
          viewBox="0 0 1000 1000"
          className="w-full max-w-[920px] h-full max-h-[920px] object-contain drop-shadow-[0_10px_35px_rgba(0,0,0,0.6)]"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Hexagon Def Helper (radius 52) */}
            <polygon 
              id="hex-node" 
              points="0,-52 45,-26 45,26 0,52 -45,26 -45,-26" 
              stroke="#FFFFFF" 
              strokeWidth="2" 
              fill="rgba(255, 255, 255, 0.08)"
              className="transition-colors"
            />
            
            {/* Larger Center Hexagon (radius 78) */}
            <polygon 
              id="hex-center" 
              points="0,-78 68,-39 68,39 0,78 -68,39 -68,-39" 
              stroke="#FFFFFF" 
              strokeWidth="2.5" 
              fill="rgba(255, 255, 255, 0.12)"
            />

            {/* Glowing filter for connectors */}
            <filter id="whiteGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ========================================================= */}
          {/* CONNECTOR LINES & SATELLITE HUD NETWORK                   */}
          {/* ========================================================= */}
          <g stroke="#FFFFFF" strokeWidth="1.2" opacity="0.7" fill="none">
            {/* Line to Top-Left Node (Chat) */}
            <line x1="455" y1="440" x2="390" y2="385" strokeWidth="1.5" />
            <line x1="390" y1="385" x2="390" y2="350" />
            
            {/* Line to Top-Right Node (Pie Chart) */}
            <line x1="545" y1="440" x2="620" y2="380" strokeWidth="1.5" />

            {/* Line to Mid-Left Node (Bar Chart Curve) */}
            <line x1="432" y1="480" x2="310" y2="455" strokeWidth="1.5" />

            {/* Line to Mid-Right Node (Ascending Bar Arrow) */}
            <line x1="568" y1="480" x2="710" y2="455" strokeWidth="1.5" />

            {/* Line to Bottom-Left Node (Currency Target) */}
            <line x1="440" y1="535" x2="320" y2="540" strokeWidth="1.5" />

            {/* Line to Bottom-Center-Left (Gear %) */}
            <line x1="470" y1="560" x2="435" y2="585" strokeWidth="1.5" />

            {/* Line to Bottom-Center-Right (3-bar Arrow) */}
            <line x1="530" y1="560" x2="600" y2="585" strokeWidth="1.5" />

            {/* Line to Bottom-Right (Music) */}
            <line x1="560" y1="535" x2="710" y2="535" strokeWidth="1.5" />

            {/* Inter-node connectors */}
            <line x1="390" y1="330" x2="310" y2="415" strokeWidth="0.8" strokeDasharray="3 3" />
            <line x1="620" y1="360" x2="710" y2="415" strokeWidth="0.8" strokeDasharray="3 3" />
            <line x1="310" y1="495" x2="320" y2="510" strokeWidth="0.8" />
            <line x1="710" y1="495" x2="710" y2="510" strokeWidth="0.8" />
            <line x1="365" y1="540" x2="390" y2="570" strokeWidth="0.8" />
            <line x1="480" y1="590" x2="555" y2="590" strokeWidth="0.8" strokeDasharray="2 2" />
          </g>

          {/* Micro Telemetry Callouts & Terminal Dots */}
          <g fill="#FFFFFF" opacity="0.85">
            {/* Top dots & callout */}
            <circle cx="500" cy="340" r="3" />
            <circle cx="730" cy="320" r="2.5" />
            <circle cx="270" cy="370" r="2" />
            <circle cx="780" cy="460" r="3" />
            <circle cx="710" cy="600" r="3" />
            <circle cx="240" cy="510" r="2.5" />
            <circle cx="340" cy="620" r="2.5" />
            
            {/* Left micro text block simulation (from image) */}
            <g transform="translate(130, 540)" opacity="0.6">
              <rect x="0" y="0" width="70" height="2" fill="#FFFFFF" />
              <rect x="0" y="5" width="55" height="1.5" fill="#FFFFFF" />
              <rect x="0" y="9" width="60" height="1.5" fill="#FFFFFF" />
              <circle cx="-15" cy="5" r="5" fill="#FFFFFF" />
              <line x1="-10" y1="5" x2="-2" y2="5" stroke="#FFFFFF" strokeWidth="1" />
            </g>

            {/* Right micro text block simulation */}
            <g transform="translate(775, 360)" opacity="0.6">
              <rect x="0" y="0" width="75" height="2" fill="#FFFFFF" />
              <rect x="0" y="5" width="60" height="1.5" fill="#FFFFFF" />
              <rect x="0" y="9" width="50" height="1.5" fill="#FFFFFF" />
              <circle cx="85" cy="5" r="2" fill="#FFFFFF" />
            </g>

            {/* Technical tick marks */}
            <line x1="220" y1="360" x2="250" y2="360" stroke="#FFFFFF" strokeWidth="0.8" />
            <line x1="250" y1="360" x2="270" y2="370" stroke="#FFFFFF" strokeWidth="0.8" />
          </g>

          {/* ========================================================= */}
          {/* 1. CENTER MAIN HEXAGON: BRIEFCASE ICON                   */}
          {/* ========================================================= */}
          <g transform="translate(500, 480)">
            {/* Center Hexagon Plate */}
            <use href="#hex-center" />
            
            {/* Solid White Executive Briefcase */}
            <g transform="translate(0, 0)">
              {/* Handle */}
              <path 
                d="M -18,-24 C -18,-35 18,-35 18,-24" 
                stroke="#FFFFFF" 
                strokeWidth="5" 
                fill="none" 
                strokeLinecap="round" 
              />
              {/* Main Briefcase Body */}
              <rect 
                x="-40" 
                y="-20" 
                width="80" 
                height="54" 
                rx="8" 
                fill="#FFFFFF" 
              />
              {/* Horizontal Seam Line */}
              <path 
                d="M -40,-4 L -14,-4 L -10,4 L 10,4 L 14,-4 L 40,-4" 
                stroke="#122842" 
                strokeWidth="2.5" 
                fill="none" 
              />
              {/* Center Buckle Lock */}
              <rect 
                x="-7" 
                y="-1" 
                width="14" 
                height="10" 
                rx="2" 
                fill="#122842" 
              />
            </g>
          </g>

          {/* ========================================================= */}
          {/* 2. TOP-LEFT HEXAGON: CHAT / SPEECH BUBBLE                */}
          {/* ========================================================= */}
          <g transform="translate(390, 370)">
            <use href="#hex-node" />
            {/* Speech Bubble with Dots */}
            <g transform="translate(0, 0)">
              <path 
                d="M -18,-14 C -18,-22 18,-22 18,-14 C 18,-6 2,-6 -4,0 L -12,4 L -10,-4 C -16,-4 -18,-8 -18,-14 Z" 
                fill="#FFFFFF" 
              />
              {/* Two small inner dots */}
              <circle cx="-6" cy="-14" r="2.5" fill="#122842" />
              <circle cx="4" cy="-14" r="2.5" fill="#122842" />
            </g>
          </g>

          {/* ========================================================= */}
          {/* 3. TOP-RIGHT HEXAGON: DONUT / PIE CHART                  */}
          {/* ========================================================= */}
          <g transform="translate(620, 370)">
            <use href="#hex-node" />
            {/* Donut Chart with Section Slice */}
            <g transform="translate(0, 0)">
              {/* Main Donut 3/4 arc */}
              <path 
                d="M 0,-18 A 18 18 0 1 0 18 0 L 9 0 A 9 9 0 1 1 0 -9 Z" 
                fill="#FFFFFF" 
              />
              {/* Separated Quarter Slice */}
              <path 
                d="M 4,-4 L 18,-4 A 18 18 0 0 0 4,-18 Z" 
                fill="#FFFFFF" 
                transform="translate(2, -2)" 
              />
            </g>
          </g>

          {/* ========================================================= */}
          {/* 4. MID-LEFT HEXAGON: BAR CHART WITH TREND CURVE          */}
          {/* ========================================================= */}
          <g transform="translate(310, 455)">
            <use href="#hex-node" />
            {/* Bar Chart with Trend line */}
            <g transform="translate(0, 0)">
              {/* Baseline */}
              <line x1="-22" y1="16" x2="22" y2="16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              {/* 4 Bars */}
              <rect x="-18" y="6" width="6" height="10" fill="#FFFFFF" />
              <rect x="-9" y="0" width="6" height="16" fill="#FFFFFF" />
              <rect x="0" y="-8" width="6" height="24" fill="#FFFFFF" />
              <rect x="9" y="-16" width="6" height="32" fill="#FFFFFF" />
              {/* Trend Arrow Line */}
              <path 
                d="M -20,2 Q -5,-4 18,-18" 
                stroke="#FFFFFF" 
                strokeWidth="2" 
                fill="none" 
              />
              <polygon points="18,-18 12,-18 18,-12" fill="#FFFFFF" />
            </g>
          </g>

          {/* ========================================================= */}
          {/* 5. MID-RIGHT HEXAGON: ASCENDING BARS WITH UPWARD ARROW   */}
          {/* ========================================================= */}
          <g transform="translate(710, 455)">
            <use href="#hex-node" />
            {/* Ascending 3 Bars + Big Arrow */}
            <g transform="translate(0, 0)">
              <line x1="-20" y1="16" x2="20" y2="16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <rect x="-16" y="4" width="7" height="12" fill="#FFFFFF" />
              <rect x="-5" y="-4" width="7" height="20" fill="#FFFFFF" />
              <rect x="6" y="-12" width="7" height="28" fill="#FFFFFF" />
              {/* Upward Line Arrow */}
              <path d="M -18,10 L 16,-18" stroke="#FFFFFF" strokeWidth="2.5" />
              <polygon points="16,-18 9,-18 16,-11" fill="#FFFFFF" />
            </g>
          </g>

          {/* ========================================================= */}
          {/* 6. BOTTOM-LEFT HEXAGON: FINANCIAL TARGET & CURRENCY COIN  */}
          {/* ========================================================= */}
          <g transform="translate(320, 540)">
            <use href="#hex-node" />
            {/* Target Reticle with Coin */}
            <g transform="translate(0, 0)">
              <circle cx="0" cy="0" r="16" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeDasharray="18 6" />
              <circle cx="-3" cy="2" r="9" fill="#FFFFFF" />
              {/* Currency Symbol in coin */}
              <text x="-6" y="6" fill="#122842" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                ₹
              </text>
              {/* Small indicator dot at top-right */}
              <circle cx="10" cy="-10" r="3.5" fill="#FFFFFF" />
            </g>
          </g>

          {/* ========================================================= */}
          {/* 7. BOTTOM-CENTER-LEFT HEXAGON: GEAR WITH PERCENTAGE (%)   */}
          {/* ========================================================= */}
          <g transform="translate(435, 590)">
            <use href="#hex-node" />
            {/* Gear Cog & % */}
            <g transform="translate(0, 0)">
              {/* Outer Gear Teeth */}
              <path 
                d="M -6,-16 L 6,-16 L 8,-12 L 14,-14 L 18,-6 L 14,-2 L 16,6 L 10,12 L 6,10 L 0,14 L -6,10 L -12,12 L -16,6 L -14,-2 L -18,-6 L -14,-14 Z" 
                fill="#FFFFFF" 
              />
              <circle cx="-1" cy="-1" r="7" fill="#122842" />
              <text x="-4" y="3" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">
                %
              </text>
              {/* Micro badge next to it */}
              <text x="14" y="-4" fill="#FFFFFF" fontSize="8" fontFamily="monospace">
                .0%
              </text>
            </g>
          </g>

          {/* ========================================================= */}
          {/* 8. BOTTOM-CENTER-RIGHT HEXAGON: 3-BAR ATTENDANCE GRAPH   */}
          {/* ========================================================= */}
          <g transform="translate(600, 590)">
            <use href="#hex-node" />
            {/* 3 Step Bars + Ascending Arrow */}
            <g transform="translate(0, 0)">
              <line x1="-16" y1="14" x2="16" y2="14" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <rect x="-14" y="6" width="6" height="8" fill="#FFFFFF" />
              <rect x="-4" y="0" width="6" height="14" fill="#FFFFFF" />
              <rect x="6" y="-8" width="6" height="22" fill="#FFFFFF" />
              {/* Arrow */}
              <path d="M -14,2 L 14,-14" stroke="#FFFFFF" strokeWidth="2" />
              <polygon points="14,-14 9,-14 14,-9" fill="#FFFFFF" />
            </g>
          </g>

          {/* ========================================================= */}
          {/* 9. BOTTOM-RIGHT HEXAGON: MUSIC NOTE (WELLBEING)          */}
          {/* ========================================================= */}
          <g transform="translate(710, 540)">
            <use href="#hex-node" />
            {/* Music Notes */}
            <g transform="translate(0, 0)">
              <path 
                d="M -6,6 C -6,3 -10,3 -12,6 C -14,8 -12,12 -8,12 C -5,12 -5,8 -5,6 L -5,-12 L 8,-8 L 8,2 C 8,-1 4,-1 2,2 C 0,4 2,8 6,8 C 9,8 9,4 9,2 L 9,-14 L -6,-18 Z" 
                fill="#FFFFFF" 
              />
            </g>
          </g>
        </svg>
      </div>

      {/* 5. Fine Horizon Scanline Grid Effect (Subtle & Elegant) */}
      <div 
        className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]"
      />
    </div>
  );
};
