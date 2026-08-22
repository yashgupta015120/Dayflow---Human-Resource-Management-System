import React from 'react';

export const MoveForwardBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Deep Surrealist Blue Gradient Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06153a] via-[#091f58] to-[#02091c]" />

      {/* 2. Scalable High-Fidelity Vector Artwork */}
      <svg
        viewBox="0 0 320 640"
        className="w-full h-full object-cover opacity-90"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Luminous Door Glow */}
          <radialGradient id="doorGlow" cx="20%" cy="20%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#bae6fd" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#091f58" stopOpacity="0" />
          </radialGradient>

          {/* Stairs Light Beam Gradient */}
          <linearGradient id="stairLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>

          {/* Shadow Wall Linear Gradient */}
          <linearGradient id="blueWall" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0c235c" />
            <stop offset="50%" stopColor="#081842" />
            <stop offset="100%" stopColor="#020819" />
          </linearGradient>
        </defs>

        {/* Ambient Room Lighting Beams */}
        <circle cx="50" cy="130" r="160" fill="url(#doorGlow)" opacity="0.65" />

        {/* Top-Left Glowing Doorway */}
        <rect x="0" y="0" width="56" height="235" fill="#e0f2fe" opacity="0.95" />
        <rect x="0" y="0" width="48" height="235" fill="#ffffff" />

        {/* Doorway Inner Soft Cyan Radiance */}
        <line x1="56" y1="0" x2="56" y2="235" stroke="#7dd3fc" strokeWidth="3" opacity="0.8" />

        {/* Silhouette of Person at Top Step */}
        <g fill="#040b1e">
          {/* Head */}
          <circle cx="48" cy="162" r="5" />
          {/* Upper Body / Suit Silhouette */}
          <path d="M42,168 C45,167 51,167 54,168 L56,192 L52,228 L44,228 L40,192 Z" />
          {/* Legs */}
          <rect x="43" y="222" width="3" height="15" rx="1" />
          <rect x="49" y="222" width="3.5" height="15" rx="1" />
        </g>

        {/* Modern Bold Typography Header on Upper-Right */}
        <g fill="#60a5fa" opacity="0.85">
          {/* Sparkle ✦ AI */}
          <text x="270" y="32" fill="#e0f2fe" fontSize="11" fontFamily="sans-serif" fontWeight="bold">✦ AI</text>
          
          {/* MOVE */}
          <text
            x="205"
            y="105"
            fill="#7dd3fc"
            fontSize="44"
            fontFamily="Impact, 'Arial Black', sans-serif"
            letterSpacing="2"
            textAnchor="middle"
          >
            MOVE
          </text>
          
          {/* FORWARD */}
          <text
            x="205"
            y="170"
            fill="#38bdf8"
            fontSize="44"
            fontFamily="Impact, 'Arial Black', sans-serif"
            letterSpacing="2"
            textAnchor="middle"
          >
            FORWARD
          </text>

          {/* Subtitle Quotes */}
          <text
            x="290"
            y="198"
            fill="#bae6fd"
            fontSize="9"
            fontFamily="monospace, sans-serif"
            textAnchor="end"
            opacity="0.9"
          >
            Perfect timing doesn't exist.
          </text>
          <text
            x="290"
            y="214"
            fill="#bae6fd"
            fontSize="9"
            fontFamily="monospace, sans-serif"
            textAnchor="end"
            opacity="0.9"
          >
            Starting does.
          </text>
        </g>

        {/* Perspective Staircase Casting Diagonal Geometric Steps */}
        <g fill="url(#stairLight)">
          {/* Step 1 */}
          <polygon points="25,236 78,236 98,245 45,245" />
          {/* Step 2 */}
          <polygon points="18,248 76,248 102,258 44,258" />
          {/* Step 3 */}
          <polygon points="12,261 74,261 106,272 44,272" />
          {/* Step 4 */}
          <polygon points="6,275 72,275 110,287 44,287" />
          {/* Step 5 */}
          <polygon points="0,290 70,290 114,303 44,303" />
          {/* Step 6 */}
          <polygon points="0,306 68,306 118,320 50,320" />
          {/* Step 7 */}
          <polygon points="0,323 66,323 124,338 58,338" />
          {/* Step 8 */}
          <polygon points="0,341 64,341 130,357 66,357" />
          {/* Step 9 */}
          <polygon points="0,360 62,360 136,377 74,377" />
          {/* Step 10 */}
          <polygon points="0,380 60,380 144,398 84,398" />
          {/* Step 11 */}
          <polygon points="0,401 58,401 152,420 94,420" />
          {/* Step 12 */}
          <polygon points="0,423 56,423 160,443 104,443" />
          {/* Step 13 */}
          <polygon points="0,446 54,446 170,467 116,467" />
          {/* Step 14 */}
          <polygon points="0,470 52,470 180,492 128,492" />
          {/* Step 15 */}
          <polygon points="0,495 50,495 192,518 142,518" />

          {/* Lower Landing / Lower Section Light Block */}
          <polygon points="196,440 280,440 310,490 226,490" opacity="0.85" />
          
          {/* Lower Extension Steps */}
          <polygon points="80,490 220,490 260,515 120,515" />
          <polygon points="65,518 210,518 255,545 110,545" />
          <polygon points="50,548 200,548 250,576 100,576" />
          <polygon points="35,579 190,579 245,608 90,608" />
          <polygon points="20,611 180,611 240,640 80,640" />
        </g>

        {/* Central Cast Shadow Groove running down stairs */}
        <polygon points="55,236 60,236 135,467 130,467" fill="#030919" opacity="0.95" />
      </svg>

      {/* 3. Sleek Translucent Dark Glass Overlay for Optimal Contrast & Button Pop */}
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-slate-950/40 to-slate-950/80 pointer-events-none" />
      <div className="absolute inset-0 border-r border-blue-500/20 pointer-events-none" />
    </div>
  );
};
