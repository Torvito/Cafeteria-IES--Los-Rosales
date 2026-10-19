import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = false, className = '' }) => {
  const sizeMap = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative shrink-0 ${sizeMap[size]}`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-md select-none"
          aria-label="Logo Cafetería IES Los Rosales"
        >
          <defs>
            {/* Circular Path for Upper Text */}
            <path
              id="textPathUpper"
              d="M 28,100 A 72,72 0 1,1 172,100"
              fill="none"
            />
            {/* Circular Path for Lower Text */}
            <path
              id="textPathLower"
              d="M 172,100 A 72,72 0 0,1 28,100"
              fill="none"
            />
            <radialGradient id="goldGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#DFBF75" />
              <stop offset="100%" stopColor="#B88B4A" />
            </radialGradient>
            <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E24B4B" />
              <stop offset="100%" stopColor="#A82626" />
            </linearGradient>
            <linearGradient id="cupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E5DFD3" />
            </linearGradient>
          </defs>

          {/* Outer Border Ring */}
          <circle cx="100" cy="100" r="97" fill="#0F3D2E" stroke="#B88B4A" strokeWidth="3" />
          <circle cx="100" cy="100" r="91" fill="none" stroke="#B88B4A" strokeWidth="1" strokeDasharray="3,2" />

          {/* Arched Text */}
          <text fill="#F8F1E3" fontSize="13.5" fontWeight="700" letterSpacing="2.5" fontFamily="'Outfit', sans-serif">
            <textPath href="#textPathUpper" startOffset="50%" textAnchor="middle">
              CAFETERÍA · IES LOS ROSALES
            </textPath>
          </text>

          <text fill="#B88B4A" fontSize="9.5" fontWeight="600" letterSpacing="1.5" fontFamily="'Outfit', sans-serif">
            <textPath href="#textPathLower" startOffset="50%" textAnchor="middle">
              TU PAUSA · TU ESPACIO
            </textPath>
          </text>

          {/* Inner Cream Field */}
          <circle cx="100" cy="100" r="66" fill="#F8F1E3" stroke="#B88B4A" strokeWidth="2.5" />
          <circle cx="100" cy="100" r="62" fill="none" stroke="#0F3D2E" strokeWidth="0.8" opacity="0.3" />

          {/* Central Artwork */}
          <g transform="translate(100, 106)">
            {/* Open Book at bottom */}
            <g transform="translate(0, 12)">
              {/* Book Spine & Pages Left */}
              <path
                d="M 0,14 C -12,8 -28,8 -42,12 C -42,3 -28,0 0,6 Z"
                fill="#FFFFFF"
                stroke="#B88B4A"
                strokeWidth="1.2"
              />
              <path
                d="M 0,14 C -12,9 -28,9 -40,14 L -40,15 C -28,10 -12,10 0,15 Z"
                fill="#0F3D2E"
                opacity="0.8"
              />
              {/* Book Spine & Pages Right */}
              <path
                d="M 0,14 C 12,8 28,8 42,12 C 42,3 28,0 0,6 Z"
                fill="#FFFFFF"
                stroke="#B88B4A"
                strokeWidth="1.2"
              />
              <path
                d="M 0,14 C 12,9 28,9 40,14 L 40,15 C 28,10 12,10 0,15 Z"
                fill="#0F3D2E"
                opacity="0.8"
              />
              {/* Book cover spine */}
              <circle cx="0" cy="14" r="2.5" fill="#B88B4A" />
            </g>

            {/* Coffee Cup with Saucer */}
            <g transform="translate(-10, -8)">
              {/* Saucer */}
              <ellipse cx="0" cy="12" rx="23" ry="5" fill="#E5DFD3" stroke="#B88B4A" strokeWidth="1" />
              <ellipse cx="0" cy="11" rx="18" ry="3.5" fill="#FFFFFF" />

              {/* Cup Body */}
              <path
                d="M -16, -2 C -15, 8 -9, 11 0, 11 C 9, 11 15, 8 16, -2 Z"
                fill="url(#cupGradient)"
                stroke="#0F3D2E"
                strokeWidth="1.2"
              />
              {/* Coffee Surface */}
              <ellipse cx="0" cy="-2" rx="16" ry="4.5" fill="#5A3825" stroke="#B88B4A" strokeWidth="0.8" />
              <ellipse cx="0" cy="-2" rx="12" ry="3" fill="#6F462E" />
              <ellipse cx="-2" cy="-2" rx="5" ry="1.5" fill="#F8F1E3" opacity="0.6" />

              {/* Cup Handle */}
              <path
                d="M 15,0 C 22,0 23,8 14,8"
                fill="none"
                stroke="#0F3D2E"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Steam waves */}
              <path
                d="M -4,-8 C -2,-13 -6,-17 -3,-22"
                fill="none"
                stroke="#B88B4A"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.75"
              />
              <path
                d="M 3,-7 C 6,-12 2,-16 4,-21"
                fill="none"
                stroke="#B88B4A"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.75"
              />
            </g>

            {/* Red Rose (IES Los Rosales Emblem) */}
            <g transform="translate(18, -12)">
              {/* Rose Leaves */}
              <path
                d="M -2, 6 C -8, 10 -4, 18 3, 14 C 6, 9 3, 5 -2, 6 Z"
                fill="#0F3D2E"
              />
              <path
                d="M 12, 4 C 18, 7 15, 15 9, 12 C 7, 7 9, 4 12, 4 Z"
                fill="#165B45"
              />
              {/* Rose Petals / Flower */}
              <path
                d="M 3,-1 C -4,-1 -8,6 -4,11 C 0,16 11,15 13,8 C 14,2 8,-1 3,-1 Z"
                fill="url(#roseGradient)"
                stroke="#7E1717"
                strokeWidth="0.8"
              />
              {/* Inner Petal Swirl */}
              <path
                d="M 1,4 C 0,1 6,1 6,4 C 6,7 1,8 1,5"
                fill="none"
                stroke="#FFE0E0"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx="4" cy="4" r="1.5" fill="#FFE0E0" />
            </g>
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-display font-extrabold text-[#0F3D2E] text-base md:text-lg leading-tight tracking-tight">
            IES LOS ROSALES
          </span>
          <span className="text-[11px] font-semibold text-[#B88B4A] uppercase tracking-wider">
            Cafetería &amp; Cantina
          </span>
        </div>
      )}
    </div>
  );
};
