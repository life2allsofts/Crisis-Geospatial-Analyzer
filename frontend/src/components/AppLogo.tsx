import React from "react";

interface AppLogoProps {
  className?: string;
  size?: number;
}

export default function AppLogo({ className = "w-8 h-8", size = 32 }: AppLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="appShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#090d16" />
        </linearGradient>
        <linearGradient id="appWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="appAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <filter id="appGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Shield Badge */}
      <path
        d="M 50 6 L 86 20 C 86 56 68 84 50 94 C 32 84 14 56 14 20 Z"
        fill="url(#appShieldGrad)"
        stroke="#38bdf8"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Ghana Tri-Color Accent Line */}
      <path
        d="M 32 15 L 44 19 L 56 19 L 68 15"
        stroke="url(#appAccentGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Iso-Contours / Topography */}
      <path
        d="M 28 38 Q 50 30 72 38"
        fill="none"
        stroke="#64748b"
        strokeWidth="1.5"
        strokeDasharray="2 3"
        opacity="0.6"
      />
      <path
        d="M 24 50 Q 50 42 76 50"
        fill="none"
        stroke="#64748b"
        strokeWidth="1.5"
        strokeDasharray="2 3"
        opacity="0.6"
      />
      <path
        d="M 28 62 Q 50 56 72 62"
        fill="none"
        stroke="#64748b"
        strokeWidth="1.5"
        strokeDasharray="2 3"
        opacity="0.6"
      />

      {/* Dynamic Flood River / Wave Curves */}
      <path
        d="M 20 66 Q 34 52 50 64 T 80 58 C 76 74 64 85 50 90 C 38 84 26 76 20 66 Z"
        fill="url(#appWaveGrad)"
        opacity="0.85"
      />
      <path
        d="M 22 58 Q 38 48 50 58 T 78 52"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Central Geo Beacon / Navigation Star */}
      <circle
        cx="50"
        cy="38"
        r="8"
        fill="#0f172a"
        stroke="#eab308"
        strokeWidth="2.5"
        filter="url(#appGlow)"
      />
      <polygon points="50,32 52,36 56,38 52,40 50,44 48,40 44,38 48,36" fill="#eab308" />
      <circle cx="50" cy="38" r="2" fill="#ffffff" />

      {/* Satellite Signal Pulse Ring */}
      <circle
        cx="50"
        cy="38"
        r="14"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="1.2"
        strokeDasharray="3 3"
        opacity="0.75"
      />
    </svg>
  );
}
