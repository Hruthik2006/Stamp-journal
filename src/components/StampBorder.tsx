import React from 'react';
import { StampEdge, StampAppearance } from '../types';

interface StampBorderProps {
  imageUrl: string;
  edge: StampEdge;
  appearance: StampAppearance;
  paddingTopBottom: number;
  paddingLeftRight: number;
  width?: number;
  height?: number;
  className?: string;
  shadow?: boolean;
}

export const StampBorder: React.FC<StampBorderProps> = ({
  imageUrl,
  edge,
  appearance,
  paddingTopBottom,
  paddingLeftRight,
  width = 140,
  height = 140,
  className = '',
  shadow = true,
}) => {
  // Appearance coloring
  const getAppearanceStyles = () => {
    switch (appearance) {
      case 'vintage':
        return {
          bg: '#f3e8d2',
          border: '#8b7a66',
          filter: 'sepia(0.45) contrast(0.95) saturate(0.85)',
          overlayBg: 'rgba(139, 122, 102, 0.08)',
          text: '#5c4e3e'
        };
      case 'gold':
        return {
          bg: 'linear-gradient(135deg, #fef08a 0%, #eab308 50%, #ca8a04 100%)',
          border: '#a16207',
          filter: 'none',
          overlayBg: 'rgba(254, 240, 138, 0.1)',
          text: '#713f12'
        };
      case 'silver':
        return {
          bg: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 50%, #64748b 100%)',
          border: '#475569',
          filter: 'contrast(1.05)',
          overlayBg: 'rgba(255, 255, 255, 0.05)',
          text: '#334155'
        };
      case 'white':
      default:
        return {
          bg: '#ffffff',
          border: '#94a3b8',
          filter: 'none',
          overlayBg: 'transparent',
          text: '#1e293b'
        };
    }
  };

  const appStyles = getAppearanceStyles();

  // Generate vector clip path for absolute precision
  // We'll divide each edge into teeth
  const numTeeth = 10;
  const size = 180; // Local coordinate scale
  const step = size / numTeeth;

  // Let's generate a beautiful SVG path for the stamp custom edge:
  let pathD = '';

  if (edge === 'scalloped') {
    // Scalloped has round bite-offs
    const r = step / 3.2; // radius of scallop cuts
    // Start at top-left
    pathD += `M 0,0`;

    // Top edge -> going right
    for (let i = 0; i < numTeeth; i++) {
      const xStart = i * step;
      const xMid = xStart + step / 2;
      const xEnd = (i + 1) * step;
      pathD += ` H ${xMid - r} A ${r} ${r} 0 0 0 ${xMid + r} 0 H ${xEnd}`;
    }

    // Right edge -> going down
    for (let i = 0; i < numTeeth; i++) {
      const yStart = i * step;
      const yMid = yStart + step / 2;
      const yEnd = (i + 1) * step;
      pathD += ` V ${yMid - r} A ${r} ${r} 0 0 0 ${size} ${yMid + r} V ${yEnd}`;
    }

    // Bottom edge -> going left (backward)
    for (let i = 0; i < numTeeth; i++) {
      const xStart = size - i * step;
      const xMid = xStart - step / 2;
      const xEnd = size - (i + 1) * step;
      pathD += ` H ${xMid + r} A ${r} ${r} 0 0 0 ${xMid - r} ${size} H ${xEnd}`;
    }

    // Left edge -> going up (backward)
    for (let i = 0; i < numTeeth; i++) {
      const yStart = size - i * step;
      const yMid = yStart - step / 2;
      const yEnd = size - (i + 1) * step;
      pathD += ` V ${yMid + r} A ${r} ${r} 0 0 0 0 ${yMid - r} V ${yEnd}`;
    }

    pathD += ' Z';
  } else if (edge === 'wave') {
    // Wave has smooth undulating waves
    const h = step / 4; // wave amplitude
    pathD += `M 0,0`;

    // Top edge
    for (let i = 0; i < numTeeth; i++) {
      const xStart = i * step;
      const xMid = xStart + step / 2;
      const xEnd = (i + 1) * step;
      pathD += ` Q ${xMid} ${h}, ${xEnd} 0`;
    }

    // Right edge
    for (let i = 0; i < numTeeth; i++) {
      const yStart = i * step;
      const yMid = yStart + step / 2;
      const yEnd = (i + 1) * step;
      pathD += ` Q ${size - h} ${yMid}, ${size} ${yEnd}`;
    }

    // Bottom edge
    for (let i = 0; i < numTeeth; i++) {
      const xStart = size - i * step;
      const xMid = xStart - step / 2;
      const xEnd = size - (i + 1) * step;
      pathD += ` Q ${xMid} ${size - h}, ${xEnd} ${size}`;
    }

    // Left edge
    for (let i = 0; i < numTeeth; i++) {
      const yStart = size - i * step;
      const yMid = yStart - step / 2;
      const yEnd = size - (i + 1) * step;
      pathD += ` Q ${h} ${yMid}, 0 ${yEnd}`;
    }

    pathD += ' Z';
  } else {
    // 'rough' -> serrated sharp teeth (triangles)
    const tHeight = step / 3.5;
    pathD += 'M 0,0';

    // Top edge
    for (let i = 0; i < numTeeth; i++) {
      const xStart = i * step;
      const xMid = xStart + step / 2;
      const xEnd = (i + 1) * step;
      pathD += ` L ${xMid} ${tHeight} L ${xEnd} 0`;
    }

    // Right edge
    for (let i = 0; i < numTeeth; i++) {
      const yStart = i * step;
      const yMid = yStart + step / 2;
      const yEnd = (i + 1) * step;
      pathD += ` L ${size - tHeight} ${yMid} L ${size} ${yEnd}`;
    }

    // Bottom edge
    for (let i = 0; i < numTeeth; i++) {
      const xStart = size - i * step;
      const xMid = xStart - step / 2;
      const xEnd = size - (i + 1) * step;
      pathD += ` L ${xMid} ${size - tHeight} L ${xEnd} ${size}`;
    }

    // Left edge
    for (let i = 0; i < numTeeth; i++) {
      const yStart = size - i * step;
      const yMid = yStart - step / 2;
      const yEnd = size - (i + 1) * step;
      pathD += ` L ${tHeight} ${yMid} L 0 ${yEnd}`;
    }

    pathD += ' Z';
  }

  // Create unique id for the mask in case of multiple stamps on the screen
  const clipId = React.useId().replace(/:/g, '');

  // Calculate inner photo area with user's padding
  const pt = Math.min(paddingTopBottom, 40);
  const pl = Math.min(paddingLeftRight, 40);
  
  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        filter: shadow ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))' : 'none',
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={`clip-${clipId}`}>
            <path d={pathD} />
          </clipPath>
          
          {/* Subtle paper grain texture pattern */}
          <pattern id="paper-texture" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="transparent" />
            <path d="M0 0h40v40H0z" fill="none" />
            <circle cx="2" cy="5" r="1" fill="#000000" opacity="0.03" />
            <circle cx="15" cy="18" r="0.8" fill="#000000" opacity="0.04" />
            <circle cx="34" cy="8" r="1.1" fill="#000000" opacity="0.035" />
            <circle cx="25" cy="30" r="0.7" fill="#000000" opacity="0.025" />
            <circle cx="8" cy="35" r="1.2" fill="#000000" opacity="0.04" />
          </pattern>
        </defs>

        {/* Outline background with background gradient/color */}
        <g clipPath={`url(#clip-${clipId})`}>
          {/* Solid Base Fill */}
          <rect
            width={size}
            height={size}
            fill={appStyles.bg.startsWith('linear') ? 'url(#foo)' : appStyles.bg}
            style={{
              background: appStyles.bg, // SVG fallback fails, so set inline rect backgrounds via style if gradients are used
            }}
          />
          
          {/* If the background is a CSS linear gradient, we match layout */}
          {appStyles.bg.startsWith('linear') && (
            <foreignObject width={size} height={size}>
              <div style={{ width: '100%', height: '100%', background: appStyles.bg }} />
            </foreignObject>
          )}

          {/* Paper texture overlay */}
          <rect width={size} height={size} fill="url(#paper-texture)" />

          {/* Tint overlay for vintage aging effect */}
          <rect width={size} height={size} fill={appStyles.overlayBg} />

          {/* Double border for elegant framing */}
          <rect
            x="4"
            y="4"
            width={size - 8}
            height={size - 8}
            fill="none"
            stroke={appStyles.border}
            strokeWidth="1"
            strokeDasharray="2,2"
            opacity="0.6"
          />
          <rect
            x="8"
            y="8"
            width={size - 16}
            height={size - 16}
            fill="none"
            stroke={appStyles.border}
            strokeWidth="1.5"
            opacity="0.8"
          />

          {/* Render User Image centered inside with padding */}
          <g transform={`translate(${pl * (size / 100)}, ${pt * (size / 100)}) scale(${(100 - pl * 2) / 100}, ${(100 - pt * 2) / 100})`}>
            {/* Background of the image frame */}
            <rect
              width={size}
              height={size}
              fill="rgba(0, 0, 0, 0.03)"
            />

            {/* Render Actual Image */}
            <image
              href={imageUrl}
              width={size}
              height={size}
              preserveAspectRatio="xMidYMid slice"
              referrerPolicy="no-referrer"
              style={{
                filter: appStyles.filter,
              }}
            />

            {/* Inner vignette shadow or border */}
            <rect
              width={size}
              height={size}
              fill="none"
              stroke="rgba(0, 0, 0, 0.1)"
              strokeWidth="2"
            />
          </g>
          
          {/* Outer edge shading outline */}
          <path
            d={pathD}
            fill="none"
            stroke={appStyles.border}
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
};
