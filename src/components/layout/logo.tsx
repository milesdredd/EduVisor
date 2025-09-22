import React from 'react';

export function Logo() {
  return (
    <svg
      width="140"
      height="40"
      viewBox="0 0 140 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-foreground"
    >
      <text
        x="10"
        y="28"
        fontFamily="JetBrains Mono, monospace"
        fontSize="24"
        fontWeight="bold"
        fill="currentColor"
      >
        Edu
        <tspan fill="hsl(var(--primary))">Visor</tspan>
      </text>
    </svg>
  );
}
