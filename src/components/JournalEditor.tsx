import React, { useState, useRef, useEffect } from 'react';
import { JournalPage, Stamp, PlacedStamp } from '../types';
import { StampBorder } from './StampBorder';
import { Edit2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { HomeOutlineIcon, RuledNotebookIcon, BookmarkRibbonIcon, FloppyDiskIcon, WasteBasketIcon, AddStampIcon, StampCollectibleIcon } from './CustomIcons';
import { playPageTurnSound } from '../utils/audio';

interface JournalEditorProps {
  page: JournalPage;
  stamps: Stamp[];
  onSave: (updatedPage: JournalPage) => void;
  onDiscard: () => void;
  onGoHome: () => void;
  onGoIndex: () => void;
  onGoBookmarks: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onNewPage: () => void;
  coverColor: 'blue' | 'black' | 'green';
  coverImage: string;
  onCoverColorChange: (color: 'blue' | 'black' | 'green') => void;
  onCoverImageChange: (imageUrl: string) => void;
  pageNumber: number;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({
  page,
  stamps,
  onSave,
  onDiscard,
  onGoHome,
  onGoIndex,
  onGoBookmarks,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onNewPage,
  coverColor,
  coverImage,
  onCoverColorChange,
  onCoverImageChange,
  pageNumber,
}) => {
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);
  const [isBookmarked, setIsBookmarked] = useState(page.isBookmarked);
  const [placedStamps, setPlacedStamps] = useState<PlacedStamp[]>(page.placedStamps || []);
  const [showStampPicker, setShowStampPicker] = useState(false);
  
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const dragStampRef = useRef<{ id: string; startX: number; startY: number; startLeft: number; startTop: number; startRotation: number } | null>(null);

  // Keep state sync'd when page prop changes (e.g. navigating Prev/Next)
  useEffect(() => {
    setTitle(page.title);
    setContent(page.content);
    setIsBookmarked(page.isBookmarked);
    setPlacedStamps(page.placedStamps || []);
  }, [page]);

  const handleSave = () => {
    onSave({
      ...page,
      title: title || 'Untitled Page',
      content,
      isBookmarked,
      placedStamps,
    });
  };

  const handleAddStamp = (stamp: Stamp) => {
    // Drop at a default/randomish position in the page center
    const newPlaced: PlacedStamp = {
      id: `placed-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      stampId: stamp.id,
      imageUrl: stamp.imageUrl,
      topPercent: 30 + Math.random() * 20,
      leftPercent: 30 + Math.random() * 20,
      paddingTopBottom: stamp.paddingTopBottom,
      paddingLeftRight: stamp.paddingLeftRight,
      edge: stamp.edge,
      appearance: stamp.appearance,
      rotationDegrees: 0,
    };
    setPlacedStamps([...placedStamps, newPlaced]);
    setShowStampPicker(false);
  };

  const handleRemovePlacedStamp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlacedStamps(placedStamps.filter((s) => s.id !== id));
  };

  // Stamp Dragging Mechanics
  const handleStampMouseDown = (placedId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const stampEl = e.currentTarget as HTMLElement;
    const parentEl = pageContainerRef.current;
    if (!parentEl) return;

    // Store starting mouse position and original stamp top/left in Percentages
    const currentStamp = placedStamps.find((s) => s.id === placedId);
    if (!currentStamp) return;

    let startRotation = currentStamp.rotationDegrees || 0;

    // Check if Shift or Alt is pressed
    if (e.shiftKey || e.altKey) {
      startRotation = (startRotation + 45) % 360;
      setPlacedStamps((prev) =>
        prev.map((s) => (s.id === placedId ? { ...s, rotationDegrees: startRotation } : s))
      );
    }

    dragStampRef.current = {
      id: placedId,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: currentStamp.leftPercent,
      startTop: currentStamp.topPercent,
      startRotation,
    };

    document.addEventListener('mousemove', handleStampMouseMove);
    document.addEventListener('mouseup', handleStampMouseUp);
  };

  const handleStampMouseMove = (e: MouseEvent) => {
    if (!dragStampRef.current || !pageContainerRef.current) return;
    const { id, startX, startY, startLeft, startTop, startRotation } = dragStampRef.current;

    const isModifierActive = e.shiftKey || e.altKey;

    if (isModifierActive) {
      // Modify rotation based on dragging angle relative to the center of stamp
      const stampElement = document.getElementById(`placed-stamp-${id}`);
      if (stampElement) {
        const rect = stampElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        
        // Calculate raw mathematical angle in degrees
        const angleRad = Math.atan2(dy, dx);
        let angleDeg = angleRad * (180 / Math.PI);
        if (angleDeg < 0) angleDeg += 360;

        // Snapping to nearest 45 degrees
        const snappedAngle = Math.round(angleDeg / 45) * 45;

        setPlacedStamps((prev) =>
          prev.map((s) => (s.id === id ? { ...s, rotationDegrees: snappedAngle % 360 } : s))
        );
      } else {
        // Fallback: rotate stamp by 45 degrees based on horizontal mouse drag distance
        const deltaX = e.clientX - startX;
        const angleOffset = Math.round(deltaX / 15) * 45; // rotate 45 degrees for every 15px dragged
        setPlacedStamps((prev) =>
          prev.map((s) => (s.id === id ? { ...s, rotationDegrees: (startRotation + angleOffset) % 360 } : s))
        );
      }
    } else {
      // Standard translation dragging
      const parentRect = pageContainerRef.current.getBoundingClientRect();
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      // Convert mouse movement pixels into layout container percentages
      const deltaLeftPercent = (deltaX / parentRect.width) * 100;
      const deltaTopPercent = (deltaY / parentRect.height) * 100;

      const newLeftPercent = Math.max(2, Math.min(85, startLeft + deltaLeftPercent));
      const newTopPercent = Math.max(2, Math.min(85, startTop + deltaTopPercent));

      setPlacedStamps((prev) =>
        prev.map((s) => (s.id === id ? { ...s, topPercent: newTopPercent, leftPercent: newLeftPercent } : s))
      );
    }
  };

  const handleStampMouseUp = () => {
    dragStampRef.current = null;
    document.removeEventListener('mousemove', handleStampMouseMove);
    document.removeEventListener('mouseup', handleStampMouseUp);
  };

  // Responsive book cover background classes based on user selections
  const getCoverColorClass = () => {
    switch (coverColor) {
      case 'black':
        return 'bg-[#27272a] border-neutral-800';
      case 'green':
        return 'bg-[#2d4a43] border-[#203631]';
      case 'blue':
        return 'bg-[#93c5fd] border-[#60a5fa]';
      default:
        return 'border-neutral-750/15';
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 relative h-full items-stretch max-h-[calc(100vh-140px)] overflow-hidden">
      
      {/* 1. Left Side Control Panel Pills (Matches Image 6 layout perfectly) */}
      <div className="flex flex-row md:flex-col gap-1.5 md:gap-2 select-none justify-center md:justify-start flex-wrap py-1 shrink-0">
        {/* Title logo (Your Journal) */}
        <div className="hidden md:flex items-center gap-2 px-1 mb-2 select-none">
          <svg className="w-8 h-8 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="font-semibold text-md uppercase tracking-tight text-neutral-900" style={{ fontFamily: 'var(--font-sans)' }}>Your Journal</span>
        </div>

        <button
          onClick={onGoHome}
          id="btn-journal-home"
          className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#f5ebe0] hover:bg-[#ebd9d4] active:scale-95 text-neutral-800 text-sm font-semibold rounded-full transition-all border border-transparent cursor-pointer"
        >
          <HomeOutlineIcon className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={onGoIndex}
          id="btn-journal-index"
          className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#f5ebe0] hover:bg-[#ebd9d4] active:scale-95 text-neutral-800 text-sm font-semibold rounded-full transition-all border border-transparent cursor-pointer"
        >
          <RuledNotebookIcon className="w-4 h-4" />
          <span>Index</span>
        </button>

        {/* Dedicated "Add Stamp" Side Button - Highly requested feature option */}
        <button
          onClick={() => setShowStampPicker(!showStampPicker)}
          id="btn-journal-stamp-control"
          className={`flex items-center gap-2.5 px-3.5 py-2.5 active:scale-95 text-sm font-semibold rounded-full transition-all border border-transparent cursor-pointer ${
            showStampPicker 
              ? 'bg-[#ebd9d4] border-[#dfcbca] text-neutral-950 shadow-inner' 
              : 'bg-[#fdf0e6] hover:bg-[#fbdec5] text-amber-900'
          }`}
        >
          <AddStampIcon className="w-4 h-4" />
          <span>Add Stamp</span>
        </button>

        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          id="btn-journal-bookmark"
          className={`flex items-center gap-2.5 px-3.5 py-2.5 active:scale-95 text-sm font-semibold rounded-full transition-all border border-transparent cursor-pointer ${
            isBookmarked ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-[#f5ebe0] hover:bg-[#ebd9d4] text-neutral-800'
          }`}
        >
          <BookmarkRibbonIcon className={`w-4 h-4 ${isBookmarked ? 'fill-amber-600' : ''}`} />
          <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
        </button>

        <button
          onClick={handleSave}
          id="btn-journal-save"
          className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#ebd9d4] hover:bg-[#dfcbca] active:scale-95 text-neutral-900 text-sm font-semibold rounded-full transition-all border border-transparent cursor-pointer"
        >
          <FloppyDiskIcon className="w-4 h-4" />
          <span>Save</span>
        </button>

        <button
          onClick={onDiscard}
          id="btn-journal-discard"
          className="flex items-center gap-2.5 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 text-sm font-semibold rounded-full transition-all border border-transparent cursor-pointer"
        >
          <WasteBasketIcon className="w-4 h-4" />
          <span>Discard</span>
        </button>
      </div>

      {/* 2. Center: Interactive Opened Book */}
      <div className="flex-1 flex flex-col items-center">
        
        {/* Lined Paper Title input above book layout */}
        <div className="w-full max-w-3xl px-6 mb-2 flex items-center justify-between">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-light text-neutral-800 tracking-tight placeholder-neutral-300 focus:outline-none border-b border-transparent focus:border-neutral-300 py-1 transition-colors bg-transparent"
            placeholder="Title of this page..."
            style={{ fontFamily: 'var(--font-sans)' }}
          />

          {/* Inline Edit helpers */}
          <div className="flex items-center gap-3">
            {/* Float stamp adder */}
            <button
              onClick={() => setShowStampPicker(!showStampPicker)}
              title="Add Stamp"
              className="p-2.5 rounded-full bg-[#ebd9d4] hover:bg-[#dfcbca] text-neutral-800 transition-all cursor-pointer relative"
            >
              <Plus className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* The Open Book itself with margins, rulings and elements */}
        <div
          ref={pageContainerRef}
          className={`w-full max-w-3xl aspect-[1.5] max-h-[calc(100vh-230px)] rounded-3xl p-5 border-4 flex relative overflow-hidden transition-all duration-500 shadow-2xl ${getCoverColorClass()}`}
          style={{
            backgroundImage: coverImage ? `url(${coverImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: ['blue', 'black', 'green'].includes(coverColor) ? undefined : coverColor,
            borderColor: ['blue', 'black', 'green'].includes(coverColor) ? undefined : coverColor,
          }}
        >
          {/* Subtle 3D Depth fold line inside center of book */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-black/15 shadow-xs z-20 pointer-events-none" />

          {/* Left Book Page */}
          <div className="flex-1 bg-[#fbfaf6] h-full p-6 rounded-l-2xl border-r border-neutral-200 shadow-inner flex flex-col relative overflow-hidden">
            {/* Lined-paper horizontal rulings block */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-40">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-full h-px border-b border-sky-300" />
              ))}
            </div>

            {/* Textarea aligning perfectly with ruled notebook background */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full bg-transparent resize-none text-neutral-800 leading-[2.1rem] focus:outline-none text-lg select-text font-serif relative z-10 animate-fade-in"
              placeholder="Start writing your thoughts... You can drop and reposition custom stamps anywhere on these pages!"
              style={{
                lineHeight: '2.44rem',
                paddingTop: '0.2rem',
              }}
            />
            {/* Page Number indicator */}
            <div className="absolute bottom-2.5 left-6 text-[10px] font-mono text-neutral-400 tracking-wider font-bold select-none z-10 transition-all">
              PAGE {pageNumber * 2 - 1}
            </div>
          </div>

          {/* Right Book Page */}
          <div className="flex-1 bg-[#fbfaf6] h-full p-6 rounded-r-2xl shadow-inner flex flex-col justify-between relative overflow-hidden">
            {/* Lined-paper horizontal rulings block */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-40">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-full h-px border-b border-sky-300" />
              ))}
            </div>

            {/* Render any drag-positioned Placed Stamps on the book! */}
            {placedStamps.map((stamp) => (
              <div
                key={stamp.id}
                id={`placed-stamp-${stamp.id}`}
                onMouseDown={(e) => handleStampMouseDown(stamp.id, e)}
                style={{
                  position: 'absolute',
                  top: `${stamp.topPercent}%`,
                  left: `${stamp.leftPercent}%`,
                  zIndex: 30,
                  cursor: 'grab',
                  transform: `rotate(${stamp.rotationDegrees || 0}deg)`,
                }}
                className="absolute group/stamp select-none transition-transform duration-100 ease-out"
              >
                {/* Visual tooltip wrapper with quick action option */}
                <div className="relative">
                  <StampBorder
                    imageUrl={stamp.imageUrl}
                    edge={stamp.edge}
                    appearance={stamp.appearance}
                    paddingTopBottom={stamp.paddingTopBottom}
                    paddingLeftRight={stamp.paddingLeftRight}
                    width={90}
                    height={90}
                  />
                  {/* Miniature discard sticker for placed stamps */}
                  <button
                    onClick={(e) => handleRemovePlacedStamp(stamp.id, e)}
                    className="absolute -top-2.5 -right-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 opacity-0 group-hover/stamp:opacity-100 transition-opacity shadow-md z-40 scale-85 pointer-events-auto cursor-pointer"
                  >
                    <WasteBasketIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {placedStamps.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-neutral-300 pointer-events-none z-0">
                <StampCollectibleIcon className="w-12 h-12 stroke-[1.2] mb-2 text-neutral-400" />
                <p className="text-md font-serif italic text-neutral-500">Stamps Placed Here</p>
                <p className="text-xs font-mono opacity-85 max-w-[180px] mt-1 text-neutral-400 uppercase">CLICK "+" ON THE TOP-RIGHT TO EMBELLISH PORTRAITS</p>
              </div>
            )}
            {/* Page Number indicator */}
            <div className="absolute bottom-2.5 right-6 text-[10px] font-mono text-neutral-400 tracking-wider text-right font-bold select-none z-10 transition-all">
              PAGE {pageNumber * 2}
            </div>
          </div>
        </div>

        {/* Floating Stamp Picker Overlay pop-up */}
        {showStampPicker && (
          <div className="absolute z-50 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-neutral-100 max-w-sm mt-12 flex flex-col gap-3 left-1/2 -translate-x-1/2">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <span className="text-sm font-semibold font-mono uppercase text-neutral-600">Select Stamp to Add</span>
              <button
                onClick={() => setShowStampPicker(false)}
                className="text-xs font-mono text-neutral-400 hover:text-neutral-800"
              >
                Close
              </button>
            </div>
            {stamps.length === 0 ? (
              <div className="text-center py-6 text-neutral-400 text-xs font-mono">
                NO STAMPS DESIGNED
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3 max-h-[180px] overflow-y-auto p-1.5">
                {stamps.map((stamp) => (
                   <button
                    key={stamp.id}
                    onClick={() => handleAddStamp(stamp)}
                    className="hover:scale-105 active:scale-95 transition-transform"
                    title={stamp.name}
                  >
                    <StampBorder
                      imageUrl={stamp.imageUrl}
                      edge={stamp.edge}
                      appearance={stamp.appearance}
                      paddingTopBottom={stamp.paddingTopBottom}
                      paddingLeftRight={stamp.paddingLeftRight}
                      width={65}
                      height={65}
                      shadow={false}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Bottom controls: Prev Page, New, Next */}
        <div className="flex items-center gap-4 mt-4 select-none shrink-0">
          <button
            onClick={() => { playPageTurnSound(); onPrev(); }}
            disabled={!hasPrev}
            id="btn-editor-prev"
            className={`flex items-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
              hasPrev
                ? 'bg-[#f5ebe0] hover:bg-[#ebd9d4] text-neutral-800 active:scale-95 cursor-pointer'
                : 'bg-neutral-100 text-neutral-300 pointer-events-none'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => { playPageTurnSound(); onNewPage(); }}
            id="btn-editor-newpage"
            className="flex items-center gap-1.5 px-6 py-2.5 bg-[#ebd9d4] hover:bg-[#dfcbca] text-neutral-855 font-semibold rounded-full shadow-sm transition-all active:scale-95 cursor-pointer text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Page</span>
          </button>

          <button
            onClick={() => { playPageTurnSound(); onNext(); }}
            disabled={!hasNext}
            id="btn-editor-next"
            className={`flex items-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
              hasNext
                ? 'bg-[#f5ebe0] hover:bg-[#ebd9d4] text-neutral-800 active:scale-95 cursor-pointer'
                : 'bg-neutral-100 text-neutral-300 pointer-events-none'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
