import React from 'react';

interface DelcaLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'compact';
  badge?: boolean;
}

export default function DelcaLogo({ className = 'h-10', variant = 'full', badge = false }: DelcaLogoProps) {
  // Ultra-crisp pixel-perfect vector representation of the official DELCA VisionTech logo
  const Emblem = () => (
    <svg 
      viewBox="0 0 240 240" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-auto shrink-0 select-none drop-shadow-sm"
    >
      {/* Top Vertical Cap (Red) */}
      <line x1="60" y1="18" x2="60" y2="46" stroke="#C8102E" strokeWidth="3" />
      <line x1="52" y1="18" x2="68" y2="18" stroke="#C8102E" strokeWidth="4" />
      <rect x="55" y="14" width="10" height="8" fill="#C8102E" rx="0.5" />

      {/* Bottom Vertical Cap (Red) */}
      <line x1="60" y1="194" x2="60" y2="222" stroke="#C8102E" strokeWidth="3" />
      <line x1="52" y1="222" x2="68" y2="222" stroke="#C8102E" strokeWidth="4" />
      <rect x="55" y="218" width="10" height="8" fill="#C8102E" rx="0.5" />

      {/* Outer Red Line Arch with Control Vector Nodes */}
      <path 
        d="M 60,28 H 135 C 185,28 220,65 220,120 C 220,175 185,212 135,212 H 60" 
        fill="none" 
        stroke="#C8102E" 
        strokeWidth="3.5" 
        strokeLinecap="square"
      />

      {/* Outer Red Vector Control Nodes (Square handles matching original vector design) */}
      <rect x="55" y="23" width="10" height="10" fill="#C8102E" />
      <rect x="130" y="23" width="10" height="10" fill="#C8102E" />
      <rect x="182" y="44" width="9" height="9" fill="#C8102E" />
      <rect x="215" y="115" width="10" height="10" fill="#C8102E" />
      <rect x="182" y="186" width="9" height="9" fill="#C8102E" />
      <rect x="130" y="207" width="10" height="10" fill="#C8102E" />
      <rect x="55" y="207" width="10" height="10" fill="#C8102E" />

      {/* Middle Main Navy Blue Thick 'D' Arch */}
      <path 
        d="M 72,52 H 135 C 172,52 196,80 196,120 C 196,160 172,188 135,188 H 72" 
        fill="none" 
        stroke="#0B2240" 
        strokeWidth="18" 
        strokeLinecap="butt"
      />

      {/* Inner Thin Navy Arc with Red Nodes */}
      <path 
        d="M 145,82 C 163,92 170,105 170,120 C 170,135 163,148 145,158" 
        fill="none" 
        stroke="#0B2240" 
        strokeWidth="3" 
      />
      {/* Small Red Terminal Dots on Inner Arc */}
      <rect x="141" y="78" width="7" height="7" fill="#C8102E" />
      <rect x="141" y="154" width="7" height="7" fill="#C8102E" />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <Emblem />
      </div>
    );
  }

  const logoContent = (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      {/* Left Typography Block */}
      <div className="flex flex-col justify-center leading-none select-none">
        <span 
          className="font-black tracking-tight text-[#0B2240] dark:text-white"
          style={{ 
            fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif",
            fontSize: '1.45em',
            letterSpacing: '-0.025em',
            lineHeight: '0.9',
            fontWeight: 900
          }}
        >
          DELCA
        </span>
        <span 
          className="font-bold text-[#C8102E]"
          style={{ 
            fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif",
            fontSize: '1.05em',
            letterSpacing: '-0.015em',
            lineHeight: '1.05',
            marginTop: '0.08em',
            fontWeight: 700
          }}
        >
          VisionTech
        </span>
      </div>

      {/* Right Emblem Icon */}
      <Emblem />
    </div>
  );

  if (badge) {
    return (
      <div className="inline-flex items-center px-3 py-1.5 rounded-xl bg-white text-navy-950 border border-slate-200 shadow-md backdrop-blur-md hover:shadow-lg transition-all">
        {logoContent}
      </div>
    );
  }

  return logoContent;
}

