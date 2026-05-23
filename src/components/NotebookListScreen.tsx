import React, { useState, useMemo } from 'react';
import { JournalPage } from '../types';
import { Edit3, Heart, Filter, ArrowUpDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { HomeOutlineIcon, BookmarkRibbonIcon, ClockRecentsIcon, RuledNotebookIcon, WasteBasketIcon, NotebookPageEditIcon } from './CustomIcons';

interface NotebookListScreenProps {
  title: 'Index' | 'Bookmarks' | 'Recents';
  pages: JournalPage[];
  onSelectPage: (pageId: string) => void;
  onGoHome: () => void;
  onContinueWriting: () => void;
  onToggleBookmark?: (pageId: string) => void;
  onDeletePage?: (pageId: string) => void;
  allPages: JournalPage[];
}

export const NotebookListScreen: React.FC<NotebookListScreenProps> = ({
  title,
  pages,
  onSelectPage,
  onGoHome,
  onContinueWriting,
  onToggleBookmark,
  onDeletePage,
  allPages,
}) => {
  // Filter & Sort State
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Select decorative color configuration based on list category
  const getCategoryStyles = () => {
    switch (title) {
      case 'Bookmarks':
        return {
          icon: <BookmarkRibbonIcon className="w-5 h-5 text-rose-500 fill-rose-100" />,
          description: "PAGES PLUCKED FOR SAFE KEEPING",
          colorClass: "text-rose-750"
        };
      case 'Recents':
        return {
          icon: <ClockRecentsIcon className="w-5 h-5 text-indigo-500" />,
          description: "CHRONOLOGICAL LOG OF RECENT WRITING",
          colorClass: "text-indigo-750"
        };
      case 'Index':
      default:
        return {
          icon: <RuledNotebookIcon className="w-5 h-5 text-sky-500" />,
          description: "COMPREHENSIVE DIRECTORY OF ALL ENTRIES",
          colorClass: "text-sky-750"
        };
    }
  };

  const catStyles = getCategoryStyles();

  // Filter and Sort calculation
  const filteredAndSortedPages = useMemo(() => {
    let result = [...pages];

    // Filter by start date range
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      result = result.filter((p) => {
        const d = new Date(p.createdAt);
        return d >= start;
      });
    }

    // Filter by end date range
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter((p) => {
        const d = new Date(p.createdAt);
        return d <= end;
      });
    }

    // Sorting strategies
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'date-asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'title-desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    return result;
  }, [pages, startDate, endDate, sortBy]);

  // Pagination logic
  const itemsPerPage = 16;
  const totalPages = Math.ceil(filteredAndSortedPages.length / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(0, totalPages - 1));

  const paginatedPages = useMemo(() => {
    return filteredAndSortedPages.slice(activePage * itemsPerPage, (activePage + 1) * itemsPerPage);
  }, [filteredAndSortedPages, activePage]);

  // Draw 8 items per page, matching notebook horizontal lines
  const leftPageItems = paginatedPages.slice(0, 8);
  const rightPageItems = paginatedPages.slice(8, 16);

  return (
    <div className="w-full flex flex-col justify-start relative">
      
      {/* Header bar matching Images 2, 5, 7 */}
      <div className="flex items-center justify-between w-full mb-3 select-none">
        {/* Home button */}
         <button
          onClick={onGoHome}
          id={`btn-list-home-${title.toLowerCase()}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#ebd9d4] hover:bg-[#e1cecb] text-neutral-800 text-xs font-semibold rounded-full transition-all active:scale-95 cursor-pointer"
        >
          <HomeOutlineIcon className="w-3.5 h-3.5" strokeWidth="2.5" />
          <span>Home</span>
        </button>

        {/* Categories Dynamic Title */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900" style={{ fontFamily: 'var(--font-sans)' }}>
            {title}
          </h1>
          <p className="text-[10px] text-neutral-400 font-mono mt-0.5 tracking-wider uppercase">
            {catStyles.description}
          </p>
        </div>

        {/* Continue writing button */}
        <button
          onClick={onContinueWriting}
          id={`btn-list-write-${title.toLowerCase()}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#ebd9d4] hover:bg-[#e1cecb] text-neutral-800 text-xs font-semibold rounded-full transition-all active:scale-95 cursor-pointer"
        >
          {/* Custom edit tablets matching Images 2, 5, 7 */}
          <NotebookPageEditIcon className="w-3.5 h-3.5" />
          <span>Continue Writing</span>
        </button>
      </div>

      {/* Date Range and Sort Controls Block */}
      <div className="flex flex-wrap items-center justify-center gap-3 bg-[#fbfaf6] border border-[#dcd1c4] rounded-2xl p-2 px-4 mb-3 shadow-xs max-w-2.5xl mx-auto w-full select-none">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
          <Filter className="w-3.5 h-3.5 text-amber-750" />
          <span className="font-bold uppercase tracking-wider">Date range:</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">From</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(0);
              }}
              className="bg-white border border-[#d2c5b7] rounded-xl px-2 py-0.5 font-mono text-xs text-neutral-700 focus:outline-none focus:border-neutral-500 shadow-3xs cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">To</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(0);
              }}
              className="bg-white border border-[#d2c5b7] rounded-xl px-2 py-0.5 font-mono text-xs text-neutral-700 focus:outline-none focus:border-neutral-500 shadow-3xs cursor-pointer"
            />
          </div>
        </div>

        <div className="h-4 w-px bg-neutral-300 hidden md:block" />

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> Sort
          </span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(0);
            }}
            className="bg-white border border-[#d2c5b7] rounded-xl px-2.5 py-0.5 font-mono text-xs text-neutral-700 focus:outline-none focus:border-neutral-500 shadow-3xs cursor-pointer"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="title-asc">Title: A to Z</option>
            <option value="title-desc">Title: Z to A</option>
          </select>
        </div>

        {(startDate || endDate || sortBy !== 'date-desc') && (
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
              setSortBy('date-desc');
              setCurrentPage(0);
            }}
            className="text-[10px] font-mono text-rose-600 hover:text-rose-800 flex items-center gap-1 font-bold px-2 py-0.5 rounded-lg hover:bg-rose-50 transition-colors uppercase cursor-pointer"
          >
            <X className="w-3 h-3" /> Clear filters
          </button>
        )}
      </div>

      {/* The blue-covered lined book list */}
      <div className="w-full max-w-3xl mx-auto aspect-[1.5] max-h-[calc(100vh-275px)] rounded-3xl p-5 border-4 border-[#3b82f6] bg-[#93c5fd] flex relative shadow-2xl overflow-hidden select-none">
        {/* Crease shadow */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-black/15 z-20 pointer-events-none" />

        {/* Left Book Page */}
        <div className="flex-1 bg-[#f0f9ff]/95 h-full p-6 rounded-l-2xl border-r border-neutral-100 flex flex-col relative justify-between overflow-hidden">
          {/* Notebook Rulings background */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-40">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full h-px border-b border-sky-300" />
            ))}
          </div>

          {/* Page Titles Left */}
          <div className="relative z-10 flex flex-col h-full justify-between py-2">
            {Array.from({ length: 8 }).map((_, i) => {
              const pageItem = leftPageItems[i];
              // Calculate physical/chronological page sequence number
              let absoluteIndex = 1;
              if (pageItem) {
                const indexInAll = [...allPages].reverse().findIndex((p) => p.id === pageItem.id);
                absoluteIndex = indexInAll !== -1 ? indexInAll + 1 : 1;
              }

              return (
                <div key={i} className="h-8 flex items-center">
                  {pageItem ? (
                    <div className="w-full flex items-center justify-between gap-2 pr-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {/* Elegant stamp number badge */}
                        <span className="text-xs font-mono text-sky-800 font-semibold bg-sky-100/80 px-1.5 py-0.5 rounded shrink-0">
                          #{absoluteIndex}
                        </span>
                        <button
                          onClick={() => onSelectPage(pageItem.id)}
                          className="text-left font-serif text-neutral-800 hover:text-sky-600 hover:underline transition-colors truncate text-sm font-semibold cursor-pointer block"
                        >
                          {pageItem.title}
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Mini Date */}
                        <span className="text-[9px] font-mono text-neutral-400 uppercase hidden sm:inline">
                          {new Date(pageItem.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>

                        {/* Interactive direct inline bookmark toggle */}
                        <button
                          onClick={() => onToggleBookmark?.(pageItem.id)}
                          className={`p-1 rounded-full hover:bg-neutral-200/50 transition-colors cursor-pointer ${
                            pageItem.isBookmarked 
                              ? 'text-rose-500 hover:text-rose-600' 
                              : 'text-neutral-400 hover:text-neutral-600'
                          }`}
                          title={pageItem.isBookmarked ? "Remove Bookmark" : "Bookmark Page"}
                        >
                          <BookmarkRibbonIcon className={`w-3.5 h-3.5 ${pageItem.isBookmarked ? 'fill-current text-rose-500' : ''}`} />
                        </button>

                        {/* Interactive direct inline page delete */}
                        <button
                          onClick={() => {
                            onDeletePage?.(pageItem.id);
                          }}
                          className="p-1 rounded-full text-neutral-450 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Page"
                        >
                          <WasteBasketIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-px bg-transparent" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Book Page */}
        <div className="flex-1 bg-[#f0f9ff]/95 h-full p-6 rounded-r-2xl shadow-inner flex flex-col relative justify-between overflow-hidden">
          {/* Notebook Rulings background */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-40">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full h-px border-b border-sky-300" />
            ))}
          </div>

          {/* Page Titles Right */}
          <div className="relative z-10 flex flex-col h-full justify-between py-2">
            {Array.from({ length: 8 }).map((_, i) => {
              const pageItem = rightPageItems[i];
              // Calculate physical/chronological page sequence number
              let absoluteIndex = 1;
              if (pageItem) {
                const indexInAll = [...allPages].reverse().findIndex((p) => p.id === pageItem.id);
                absoluteIndex = indexInAll !== -1 ? indexInAll + 1 : 1;
              }

              return (
                <div key={i} className="h-8 flex items-center">
                  {pageItem ? (
                    <div className="w-full flex items-center justify-between gap-2 pl-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {/* Elegant stamp number badge */}
                        <span className="text-xs font-mono text-sky-800 font-semibold bg-sky-100/80 px-1.5 py-0.5 rounded shrink-0">
                          #{absoluteIndex}
                        </span>
                        <button
                          onClick={() => onSelectPage(pageItem.id)}
                          className="text-left font-serif text-neutral-800 hover:text-sky-600 hover:underline transition-colors truncate text-sm font-semibold cursor-pointer block"
                        >
                          {pageItem.title}
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Mini Date */}
                        <span className="text-[9px] font-mono text-neutral-400 uppercase hidden sm:inline">
                          {new Date(pageItem.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>

                        {/* Interactive direct inline bookmark toggle */}
                        <button
                          onClick={() => onToggleBookmark?.(pageItem.id)}
                          className={`p-1 rounded-full hover:bg-neutral-200/50 transition-colors cursor-pointer ${
                            pageItem.isBookmarked 
                              ? 'text-rose-500 hover:text-rose-600' 
                              : 'text-neutral-400 hover:text-neutral-600'
                          }`}
                          title={pageItem.isBookmarked ? "Remove Bookmark" : "Bookmark Page"}
                        >
                          <BookmarkRibbonIcon className={`w-3.5 h-3.5 ${pageItem.isBookmarked ? 'fill-current text-rose-500' : ''}`} />
                        </button>

                        {/* Interactive direct inline page delete */}
                        <button
                          onClick={() => {
                            onDeletePage?.(pageItem.id);
                          }}
                          className="p-1 rounded-full text-neutral-450 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Page"
                        >
                          <WasteBasketIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-px bg-transparent" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty log help state */}
          {filteredAndSortedPages.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-neutral-300 pointer-events-none z-0">
              <NotebookPageEditIcon className="w-12 h-12 stroke-[1.2] opacity-70 mb-2 text-neutral-400" />
              <p className="text-sm font-serif italic text-neutral-400">No Pages Found</p>
              <p className="text-[10px] font-mono opacity-85 mt-1 text-neutral-400 uppercase">
                {pages.length === 0 ? "THERE ARE NO JOURNAL ENTRIES COMMITTED YET" : "NO ENTRIES MATCH DATE CRITERIA"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-6 select-none bg-[#ebd9d4] border border-white py-2 px-5 rounded-full max-w-[280px] mx-auto shadow-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={activePage === 0}
            className={`p-1.5 rounded-full transition-all ${
              activePage === 0
                ? 'text-neutral-400 opacity-40 cursor-not-allowed'
                : 'text-neutral-800 hover:bg-white/40 active:scale-95 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-mono text-xs font-semibold text-neutral-700">
            PAGE {activePage + 1} OF {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={activePage === totalPages - 1}
            className={`p-1.5 rounded-full transition-all ${
              activePage === totalPages - 1
                ? 'text-neutral-400 opacity-40 cursor-not-allowed'
                : 'text-neutral-800 hover:bg-white/40 active:scale-95 cursor-pointer'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
