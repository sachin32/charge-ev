export default function Logo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 350" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F8FAFC" />
          <stop offset="100%" stop-color="#E2E8F0" />
        </linearGradient>
        <linearGradient id="evElectric" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0f766e" />
          <stop offset="100%" stop-color="#2563eb" />
        </linearGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#475569" />
        </linearGradient>
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* <rect width="100%" height="100%" fill="url(#bgGrad)" rx="20" /> */}

      <g transform="translate(5, 190)">
        <text font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="120" font-weight="900" letter-spacing="4" fill="url(#textGrad)">
          CHARGE
        </text>
        <text
          x="540px"
          y="0"
          font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
          font-size="120"
          font-weight="900"
          letter-spacing="4"
          fill="url(#evElectric)"
          filter="url(#neonGlow)"
        >
          E
        </text>

        <g transform="translate(612, -82)">
          <path d="M0,0 L35,82 L58,82 L15,0 Z" fill="url(#textGrad)" />
          <path d="M35,82 L85,-5 L50,-5 L70,-35 L15,30 L45,30 Z" fill="url(#evElectric)" filter="url(#neonGlow)" />
          <circle cx="70" cy="-35" r="12" fill="none" stroke="#00D9F6" stroke-width="2" opacity="0.4" filter="url(#neonGlow)" />
        </g>

        <text x="700" y="0" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="80" font-weight="800" fill="#475569">
          .in
        </text>
        <text x="5" y="55" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="35" font-weight="600" letter-spacing="10" fill="#64748B">
          EV CHARGING STATIONS DIRECTORY
        </text>
      </g>
    </svg>
  );
}
