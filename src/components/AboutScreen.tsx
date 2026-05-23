import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface AboutScreenProps {
  onBack: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onBack }) => {
  return (
    <div className="w-full min-h-[580px] bg-white rounded-3xl p-8 relative flex flex-col justify-start select-none">
      
      {/* Title Header Matching Image 1 */}
      <div className="flex items-center gap-4 mb-8">
        {/* Custom ball of yarn / stamp string logo from Image 1 */}
        <div className="p-3 bg-[#e6fffa] rounded-2xl">
          <svg className="w-9 h-9 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 0A7.5 7.5 0 105.146 15.07a10.023 10.023 0 0013.254-8.156l-.036-.356zM8 12h.01M12 12h.01M16 12h.01" />
          </svg>
        </div>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900" style={{ fontFamily: 'var(--font-sans)' }}>ABOUT</h1>
          <p className="text-sm text-neutral-500 font-mono mt-0.5">LOCAL PERSISTENCE & DATA PRIVACY ENGINE</p>
        </div>
      </div>

      {/* Floating Back Button */}
      <button
        onClick={onBack}
        id="btn-back-about"
        className="absolute right-0 top-[40%] translate-x-1/3 bg-[#ebd9d4] hover:bg-[#dfcbca] text-neutral-800 px-6 py-4.5 rounded-full flex items-center gap-2 shadow-md transition-all active:scale-95 z-40 text-lg border border-white"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {/* The Mint Green Open Booklet (Matching Image 1 perfectly) */}
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="w-full max-w-2.5xl aspect-[4/3] rounded-3xl p-5 border-4 border-[#a7f3d0] bg-[#c6f6d5] flex relative shadow-2xl overflow-hidden">
          {/* Subtle center crease shadow */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-black/10 z-20 pointer-events-none" />

          {/* Left Page (Bio Content with line underlines exactly like Image 1) */}
          <div className="flex-1 bg-[#f0fdf4] h-full p-8 rounded-l-2xl border-r border-neutral-100 flex flex-col justify-between relative overflow-hidden">
            {/* Lined notebook decoration */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none opacity-40">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-full h-px border-b border-emerald-200" />
              ))}
            </div>

            {/* Structured Text Content */}
            <div className="relative z-10 flex flex-col gap-4 pt-2">
              <div className="text-2xl font-bold text-neutral-900 leading-snug tracking-tight">
                Secure Offline Storage
              </div>
              
              <div className="text-xs text-neutral-600 leading-relaxed">
                Every journal entry you write, beautiful stamp you place, and customized notebook color you select is saved instantly to your computer or phone using browser-level <strong className="text-neutral-800">LocalStorage</strong>.
              </div>

              <div className="text-xs text-neutral-600 leading-relaxed">
                This guarantees maximum privacy. The application requires no logins, sends zero private data to third-party databases, and runs completely local.
              </div>

              {/* Storage sync list card */}
              <div className="bg-white/90 border border-emerald-100/80 rounded-xl p-3 flex flex-col gap-1 text-left shadow-xs mt-1">
                <span className="text-[9px] font-mono font-bold text-emerald-800 uppercase tracking-widest">Active Storage Identifiers:</span>
                <div className="text-[10px] font-mono text-neutral-500 flex flex-col gap-0.5 leading-tight">
                  <div>- <code className="text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-sans">stamp_journal_pages</code></div>
                  <div>- <code className="text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-sans">stamp_journal_stamps</code></div>
                  <div>- <code className="text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-sans">stamp_journal_cover_color</code></div>
                </div>
              </div>
            </div>

            {/* Greeting footer */}
            <div className="relative z-10 text-xs font-mono tracking-tight text-neutral-400 border-t border-emerald-100/65 pt-3">
              100% PRIVATE • STORED ON YOUR DEVICE
            </div>
          </div>

          {/* Right Page (Empty lined sheets as in Image 1) */}
          <div className="flex-1 bg-[#f0fdf4] h-full p-8 rounded-r-2xl shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none opacity-40">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-full h-px border-b border-emerald-200" />
              ))}
            </div>
            
            {/* Ambient greeting */}
            <div className="h-full flex items-center justify-center relative z-10 text-center px-4">
              <p className="text-sm font-mono text-emerald-700/60 leading-relaxed uppercase">
                THIS INTERACTIVE DIARY SUPPORTS CUSTOM SAVED ENTRIES, COLOR SWAPPING, VINTAGE SCALLOPING, AND SPOTIFY MEDITATION BACKDROPS. Enjoy your journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
