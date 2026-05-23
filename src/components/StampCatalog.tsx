import React from 'react';
import { Stamp } from '../types';
import { StampBorder } from './StampBorder';
import { ChevronLeft, Calendar, Grid, Trash2 } from 'lucide-react';
import { StampCollectibleIcon } from './CustomIcons';

interface StampCatalogProps {
  stamps: Stamp[];
  onBack: () => void;
  onDeleteStamp?: (stampId: string) => void;
}

export const StampCatalog: React.FC<StampCatalogProps> = ({ stamps, onBack, onDeleteStamp }) => {
  // Group stamps by production date (or creation date)
  // Format: "DayOfWeek, Day, Month, Year" - e.g. "Mon, 16, Jan 2025"
  const groupStampsByDate = () => {
    const groups: { [key: string]: Stamp[] } = {};

    stamps.forEach((stamp) => {
      let dateStr = '';
      try {
        const d = new Date(stamp.createdAt);
        // Format: Fri, 22, May 2026
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const dayName = days[d.getDay()];
        const dayNum = String(d.getDate()).padStart(2, '0');
        const monthName = months[d.getMonth()];
        const year = d.getFullYear();
        
        dateStr = `${dayName}, ${dayNum}, ${monthName} ${year}`;
      } catch (e) {
        dateStr = 'Tue, 07, Dec 2024'; // beautiful fallback
      }

      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(stamp);
    });

    return groups;
  };

  const grouped = groupStampsByDate();

  return (
    <div className="w-full h-full max-h-[calc(100vh-160px)] bg-white rounded-3xl p-6 relative flex flex-col justify-start overflow-hidden">
      {/* Title Block */}
      <div className="flex items-center gap-4 mb-6 shrink-0">
        <div className="p-3 bg-neutral-100 rounded-2xl flex items-center justify-center border border-neutral-200/50 shadow-xs">
          <StampCollectibleIcon className="w-8 h-8 text-neutral-800" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900" style={{ fontFamily: 'var(--font-sans)' }}>Stamps</h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5 uppercase tracking-wider">Catalog of Your Designed Postage Stamps</p>
        </div>
      </div>

      {/* Floating Back Button */}
      <button
        onClick={onBack}
        id="btn-back-catalog"
        className="absolute right-0 top-[40%] translate-x-1/2 bg-[#ebd9d4] hover:bg-[#dfcbca] text-neutral-800 px-5 py-3 rounded-full flex items-center gap-1.5 shadow-md transition-all active:scale-95 z-40 text-base border border-white"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <ChevronLeft className="w-5 h-5 shrink-0" />
        <span className="font-medium">Back</span>
      </button>

      {/* Lists of grouped stamps with lines underneath as in Image 9 */}
      <div className="flex flex-col gap-8 flex-1 pb-2 overflow-y-auto pr-2">
        {Object.keys(grouped).length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-neutral-400">
            <Grid className="w-16 h-16 opacity-30 mb-4 animate-pulse" />
            <p className="text-lg font-medium">Your Stamp Archive is Empty</p>
            <p className="text-sm font-mono mt-1 opacity-75">GO TO STAMP DESIGNER TO FABRICATE REVOLUTIONARY STAMPS</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, stampsList]) => (
            <div key={date} className="flex flex-col gap-5">
              {/* Date Header with Line extending horizontally across */}
              <div className="flex items-center gap-4 w-full">
                <span className="text-sm font-bold font-mono text-neutral-700 whitespace-nowrap flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  {date}
                </span>
                <div className="h-px bg-neutral-300 flex-1" />
              </div>

              {/* Horizontal list of stamp instances */}
              <div className="relative flex items-center group w-full">
                <div className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-neutral-200 w-full">
                  {stampsList.map((stamp) => (
                    <div
                      key={stamp.id}
                      className="snap-start flex flex-col items-center group/item cursor-pointer origin-bottom hover:-translate-y-2 hover:rotate-1 transition-all duration-300 relative"
                    >
                      {onDeleteStamp && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteStamp(stamp.id);
                          }}
                          className="absolute -top-1.5 -right-1.5 z-30 bg-white hover:bg-rose-600 text-rose-600 hover:text-white rounded-full p-1.5 shadow-md hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-neutral-200 opacity-90 sm:opacity-0 group-hover/item:opacity-100 flex items-center justify-center min-w-[28px] min-h-[28px]"
                          title={`Delete stamp "${stamp.name}"`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <StampBorder
                        imageUrl={stamp.imageUrl}
                        edge={stamp.edge}
                        appearance={stamp.appearance}
                        paddingTopBottom={stamp.paddingTopBottom}
                        paddingLeftRight={stamp.paddingLeftRight}
                        width={120}
                        height={120}
                      />
                      <span className="text-xs font-mono font-medium text-neutral-500 mt-3 max-w-[110px] text-center truncate uppercase tracking-tight">
                        {stamp.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Right Arrow indicator if overflowing */}
                {stampsList.length > 4 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xs p-2 rounded-full shadow-md border border-neutral-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <svg className="w-6 h-6 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
