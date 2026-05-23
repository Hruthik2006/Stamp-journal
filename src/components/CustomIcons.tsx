import React from 'react';

export const WasteBasketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <ellipse cx="12" cy="4.5" rx="7.5" ry="2.2" />
    <path d="M4.5 4.5 L6.8 19.5 C7 21, 8.5 22, 10 22 H14 C15.5 22, 17 21, 17.2 19.5 L19.5 4.5" />
    <path d="M7 4.5 L12.5 22" strokeWidth="1.5" />
    <path d="M11 4.5 L15.5 22" strokeWidth="1.5" />
    <path d="M15 4.5 L17 14" strokeWidth="1.5" />
    <path d="M17 4.5 L11.5 22" strokeWidth="1.5" />
    <path d="M13 4.5 L8.5 22" strokeWidth="1.5" />
    <path d="M9 4.5 L7 14" strokeWidth="1.5" />
  </svg>
);

export const FloppyDiskIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 3a2 2 0 0 1 2-2h10.5L20 4.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    <rect x="8" y="2" width="6.5" height="5.5" rx="1" />
    <line x1="12" y1="4" x2="12" y2="6.5" strokeWidth="1.5" />
    <rect x="7" y="11" width="10" height="11" rx="1.5" fill="white" stroke="currentColor" />
    <line x1="9.5" y1="14.5" x2="14.5" y2="14.5" strokeWidth="1.5" />
    <line x1="9.5" y1="18.5" x2="14.5" y2="18.5" strokeWidth="1.5" />
  </svg>
);

export const AddStampIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 6c0-1.5 1.5-2.5 3-2.5s2.5 1 3.5 1 2.5-1 3.5-1 2.5 1 3.5 1 3 1 3 2.5-1 2.5-1 3.5 1 2.5 1 3.5-1 2.5-1 3.5v1.5c-1 0-2 1-2.5 2.5s-1.5 2.5-3 2.5-2.5-1-3.5-1-2.5 1-3.5 1-2.5-1-3.5-1-3 1-3-2.5 1-2.5 1-3.5-1-2.5-1-3.5 1-2.5 1-3.5z" />
    <rect x="6.5" y="6.5" width="8.5" height="8.5" rx="1" />
    <path d="M10 8v1.5l1.5 1v1.5l-1.5 1V14" strokeWidth="1.5" />
    <circle cx="12.5" cy="9.5" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="17.5" cy="17.5" r="4.5" fill="white" stroke="currentColor" strokeWidth="2" />
    <line x1="17.5" y1="15" x2="17.5" y2="20" strokeWidth="1.5" />
    <line x1="15" y1="17.5" x2="20" y2="17.5" strokeWidth="1.5" />
  </svg>
);

export const GitHubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6c-3.1 0-5.7 2.6-5.7 5.7 0 2.5 1.6 4.6 3.8 5.4.3.1.4-.1.4-.3v-1.1c-1.6.3-1.9-.8-1.9-.8-.3-.7-.6-.9-.6-.9-.5-.4.1-.4.1-.4.6 0 .9.6.9.6.5.9 1.4.6 1.7.5 0-.4.2-.6.4-.8-1.3-.1-2.6-.6-2.6-2.9 0-.6.2-1.2.6-1.6-.1-.2-.3-.8.1-1.6 0 0 .5-.2 1.6.6a5.5 5.5 0 0 1 2.9 0c1.1-.8 1.6-.6 1.6-.6.3.8.1 1.4.1 1.6.4.4.6 1 .6 1.6 0 2.3-1.3 2.7-2.6 2.9.2.2.4.6.4 1.2v1.7c0 .2.1.4.4.3 2.2-.8 3.8-2.9 3.8-5.4C17.7 8.6 15.1 6 12 6z" />
  </svg>
);

export const YarnBallIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="11" r="8.5" />
    <path d="M5.5 16.5 L 16.5 5.5" />
    <path d="M8.5 18.5 L 18.5 8.5" />
    <path d="M3.5 13.5 L 13.5 3.5" />
    <path d="M10 19 c -1 1.5 -3 2.5 -5 1.5 s -1.5 -3 .5 -3" />
  </svg>
);

export const HomeOutlineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 10.5 L12 3 L21 10.5 V20 A2 2 0 0 1 19 22 H5 A2 2 0 0 1 3 20 Z" />
    <path d="M9 22 V15 A3 3 0 0 1 15 15 V22" />
  </svg>
);

export const UploadTrayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const StampCollectibleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 6c0-1.5 1.5-2.5 3-2.5s2.5 1 3.5 1 2.5-1 3.5-1 2.5 1 3.5 1 3 1 3 2.5-1 2.5-1 3.5 1 2.5 1 3.5-1 2.5-1 3.5-2.5 1-3.5 1-2.5-1-3.5-1-2.5 1-3.5 1-2.5-1-3.5-1-3 1-3-2.5 1-2.5 1-3.5-1-2.5-1-3.5 1-2.5 1-3.5z" />
    <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" />
    <path d="M11 9v2l1.5 1v1.5l-1.5 1v1.5" strokeWidth="1.5" />
    <circle cx="13.5" cy="10.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const CraftKnifeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M13 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6" />
    <line x1="6" y1="2" x2="6" y2="22" />
    <path d="M11 21 L12 17 L21.5 7.5a1.5 1.5 0 0 1 2 2L14 19z" />
    <line x1="12.5" y1="16.5" x2="15.5" y2="19.5" strokeWidth="1.5" />
  </svg>
);

export const SpotifyFocusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10.5" />
    <path d="M7 15 C 9.5 13.5, 14.5 13.5, 17 15" strokeWidth="2" />
    <path d="M6 11.5 C 9 9.8, 15 9.8, 18 11.5" strokeWidth="2.5" />
    <path d="M5.5 8 C 8.5 6, 15.5 6, 18.5 8" strokeWidth="3" />
  </svg>
);

export const ClockRecentsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3a9 9 0 1 1-6.36 2.64" />
    <path d="M12 7v5l-3 3" />
    <path d="M7 2h5v5" />
  </svg>
);

export const BookmarkRibbonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 2h12a2 2 0 0 1 2 2v18l-8-5-8 5V4a2 2 0 0 1 2-2z" />
  </svg>
);

export const RuledNotebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="7" y1="8" x2="17" y2="8" />
    <line x1="7" y1="12" x2="17" y2="12" />
    <line x1="7" y1="16" x2="17" y2="16" />
  </svg>
);

export const SpiralBookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="5" y="3" width="15" height="18" rx="2" fill="white" stroke="currentColor" strokeWidth="2" />
    <path d="M3 6 H6" />
    <path d="M3 10 H6" />
    <path d="M3 14 H6" />
    <path d="M3 18 H6" />
    <rect x="8" y="7" width="9" height="7" rx="1" strokeWidth="1.5" />
    <circle cx="10.5" cy="9.5" r="0.7" fill="currentColor" />
    <path d="M9 13 L 12 10 L 16 13" strokeWidth="1" />
    <line x1="10" y1="17" x2="16" y2="17" strokeWidth="2" />
    <path d="M16 17 L 18 17" strokeWidth="2" />
  </svg>
);

export const PainterPaletteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.5 0 2.8-.8 3.5-2 .5-.7 1.5-1 2.3-1 1.2 0 2.2-1 2.2-2.2 0-1.3-1-2.3-1-3.5 0-2.5 1.5-4.5 1-6.8C19.5 4 16 2 12 2z" />
    <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor" />
    <circle cx="11.5" cy="7.5" r="1.5" fill="currentColor" />
    <circle cx="15.5" cy="10.5" r="1.5" fill="currentColor" />
    <circle cx="13" cy="15" r="1.5" fill="currentColor" />
  </svg>
);

export const NotebookPageEditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
    <line x1="7" y1="2" x2="7" y2="20" />
    <rect x="9" y="5" width="4" height="2" rx="1" />
    <rect x="10" y="9" width="11" height="13" rx="1.5" fill="white" stroke="currentColor" />
    <circle cx="13" cy="12.5" r="0.8" fill="currentColor" />
    <path d="M12 17.5l2-2.5 2 2.5" strokeWidth="1.5" />
    <path d="M17 21l4-4" />
    <path d="M16 22l1-1" strokeWidth="1.5" />
  </svg>
);

export const SteelSafeVaultIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <line x1="12" y1="4" x2="12" y2="7" />
    <line x1="12" y1="17" x2="12" y2="20" />
    <line x1="4" y1="12" x2="7" y2="12" />
    <line x1="17" y1="12" x2="20" y2="12" />
    <circle cx="6" cy="6" r="0.7" fill="currentColor" />
    <circle cx="18" cy="6" r="0.7" fill="currentColor" />
    <circle cx="6" cy="18" r="0.7" fill="currentColor" />
    <circle cx="18" cy="18" r="0.7" fill="currentColor" />
  </svg>
);
