export default function EVChargerIcon({ color = "#00B16A", size = 40 }) {
  const stroke = color;
  const width = size;
  const height = size;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180" width={width} height={height}>
      <g fill={stroke}>
        <path
          d="
      M 50,150 
      L 50,140 
      A 6,6 0 0,1 56,134 
      L 60,134 
      L 60,25 
      A 20,20 0 0,1 80,5 
      L 120,5 
      A 20,20 0 0,1 140,25 
      L 140,134 
      L 144,134 
      A 6,6 0 0,1 150,140 
      L 150,150 
      A 4,4 0 0,1 146,154 
      L 54,154 
      A 4,4 0 0,1 50,150 Z
    "
        />

        <rect x="90" y="16" width="20" height="3" rx="1.5" fill="#ffffff" />

        <rect x="72" y="28" width="56" height="32" rx="6" fill="#ffffff" />

        <polygon points="105,68 88,96 101,96 95,124 112,94 99,94" fill="#ffffff" />

        <path d="M 140,84 C 158,84 148,124 162,138 C 176,152 190,148 190,102" fill="none" stroke={stroke} stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />

        <path
          d="
      M 176,102 
      A 4,4 0 0,1 172,98 
      L 172,72 
      A 12,12 0 0,1 184,60 
      L 196,60 
      A 12,12 0 0,1 208,72 
      L 208,98 
      A 4,4 0 0,1 204,102 
      Z
    "
        />

        <rect x="179" y="46" width="5" height="14" rx="2" fill={stroke} />
        <rect x="196" y="46" width="5" height="14" rx="2" fill={stroke} />
      </g>
    </svg>
  );
}
