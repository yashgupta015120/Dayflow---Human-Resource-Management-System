import React from 'react';

interface CompanyLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withContainer?: boolean;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  className = '',
  size = 'md',
  withContainer = false
}) => {
  const sizeMap = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const logoSvg = (
    <svg
      viewBox="0 0 1000 1000"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full object-contain"
    >
      <g fill="currentColor">
        {/* Left 'D' Wing / Emblem */}
        <path
          fillRule="evenodd"
          d="M 220 360 
             C 320 360, 420 388, 488 425 
             L 488 638 
             L 220 568 
             L 380 464 
             L 220 360 Z 
             M 292 400 
             L 452 444 
             L 396 492 
             Z 
             M 318 534 
             L 398 478 
             L 452 572 
             Z"
        />

        {/* Right 'F' Wing Top Stroke */}
        <path
          d="M 512 425 
             C 580 388, 680 360, 780 360 
             L 780 396 
             C 690 396, 610 420, 552 445 
             L 552 638 
             L 512 638 
             Z"
        />

        {/* Right 'F' Middle Horizontal Bar */}
        <polygon
          points="552,456 696,456 666,488 552,488"
        />

        {/* Right 'F' Bottom Dynamic Angled Wedge */}
        <polygon
          points="606,536 684,536 768,568 606,568"
        />
      </g>
    </svg>
  );

  if (withContainer) {
    return (
      <div
        className={`rounded-xl bg-black text-white flex items-center justify-center p-1 shadow-lg border border-white/20 select-none shrink-0 ${sizeMap[size]} ${className}`}
      >
        {logoSvg}
      </div>
    );
  }

  return (
    <div className={`text-white select-none shrink-0 ${sizeMap[size]} ${className}`}>
      {logoSvg}
    </div>
  );
};
