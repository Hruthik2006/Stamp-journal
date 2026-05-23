import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JournalPage, Stamp, JournalColor, ActiveScreen } from './types';
import { StampBorder } from './components/StampBorder';
import { StampDesigner } from './components/StampDesigner';
import { StampCatalog } from './components/StampCatalog';
import { JournalEditor } from './components/JournalEditor';
import { AboutScreen } from './components/AboutScreen';
import { NotebookListScreen } from './components/NotebookListScreen';
import { ConfirmModal } from './components/ConfirmModal';
import { Music, AlertCircle, HelpCircle, Key, RefreshCw, FileText } from 'lucide-react';
import { 
  YarnBallIcon, 
  HomeOutlineIcon, 
  RuledNotebookIcon, 
  BookmarkRibbonIcon, 
  ClockRecentsIcon, 
  SteelSafeVaultIcon, 
  SpotifyFocusIcon, 
  AddStampIcon, 
  StampCollectibleIcon, 
  CraftKnifeIcon, 
  UploadTrayIcon, 
  PainterPaletteIcon, 
  NotebookPageEditIcon 
} from './components/CustomIcons';
import { PRELOADED_STAMP_IMAGES } from './utils/stampTemplates';
import { playPageTurnSound } from './utils/audio';

// Default initial pages to present a stunning demo experience
const INITIAL_DEMO_PAGES: JournalPage[] = [
  {
    id: 'demo-1',
    title: 'The Stamped Journey',
    content: `Today I crafted my very first physical postage stamp using the designer.

The scalloped edge feels so crisp, and selecting the Vintage appearance adds a delicate, aged sepia filter. Stamping feels therapeutic, anchoring my memories visually.

This digital stamp collection is fully private, stored safely inside my browser's local sandbox. No clouds, no trackers, just absolute writing solitude.`,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
    isBookmarked: true,
    placedStamps: [
      {
        id: 'p-demo-1',
        stampId: 'pre-airship',
        imageUrl: PRELOADED_STAMP_IMAGES[0].dataUrl,
        topPercent: 12,
        leftPercent: 55,
        paddingTopBottom: 15,
        paddingLeftRight: 15,
        edge: 'rough',
        appearance: 'vintage',
      }
    ],
  },
  {
    id: 'demo-2',
    title: 'Wanderlust in India',
    content: `Traveling through the vibrant streets of Rajasthan, I feel inspired.

The sheer scale of the forts and the deep marigold shades of sunset are unforgettable. I designed a customized Gold stamp using the Eagle template to frame this travel entry!

In the future, I can upload my own camera rolls and lock down travel journals into gorgeous collectible seals.`,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    isBookmarked: false,
    placedStamps: [
      {
        id: 'p-demo-2',
        stampId: 'pre-eagle',
        imageUrl: PRELOADED_STAMP_IMAGES[1].dataUrl,
        topPercent: 40,
        leftPercent: 10,
        paddingTopBottom: 10,
        paddingLeftRight: 10,
        edge: 'scalloped',
        appearance: 'gold',
      }
    ],
  },
];

// Default built-in stamps based on our preloaded templates
const INITIAL_BUILTIN_STAMPS: Stamp[] = PRELOADED_STAMP_IMAGES.map((img, i) => ({
  id: `pre-${img.name.toLowerCase().replace(/\s+/g, '-')}`,
  name: img.name,
  imageUrl: img.dataUrl,
  paddingTopBottom: 12,
  paddingLeftRight: 12,
  edge: i % 2 === 0 ? 'rough' : 'scalloped',
  appearance: i === 1 ? 'gold' : i === 4 ? 'silver' : 'vintage',
  createdAt: new Date(Date.now() - 3600000 * 12 * i).toISOString(),
}));

interface JournalPeekingCoverProps {
  coverColor: JournalColor;
  onWrite: () => void;
  coverImage?: string;
  isBlurred?: boolean;
}

const JournalPeekingCover: React.FC<JournalPeekingCoverProps> = ({ coverColor, onWrite, coverImage, isBlurred }) => {
  const getCoverBg = () => {
    switch (coverColor) {
      case 'black':
        return 'bg-neutral-800 border-neutral-750/15 shadow-neutral-900/30 text-white';
      case 'green':
        return 'bg-emerald-800 border-neutral-750/15 shadow-emerald-900/30 text-white';
      case 'blue':
        return 'bg-blue-400 border-neutral-750/15 shadow-blue-400/30 text-white';
      default:
        return 'border-neutral-750/15 shadow-neutral-900/10 text-white';
    }
  };

  return (
    <div className={`hidden xl:flex w-[240px] shrink-0 h-full select-none relative overflow-visible rounded-r-3xl ${isBlurred ? 'pointer-events-none' : ''}`}>
      {/* Edge Cover binding folder peeking */}
      <div 
        className={`w-full h-full p-8 shadow-2xl relative border-l-12 flex flex-col justify-between border-b-6 transition-all duration-300 ${getCoverBg()} ${
          isBlurred ? 'blur-[3px] opacity-75 scale-[0.98]' : ''
        }`}
        style={{ 
          borderBottomLeftRadius: '0px', 
          borderTopLeftRadius: '0px', 
          borderTopRightRadius: '24px', 
          borderBottomRightRadius: '24px',
          backgroundImage: coverImage ? `url(${coverImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: ['blue', 'black', 'green'].includes(coverColor) ? undefined : coverColor,
        }}
      >
        {/* Spine shadow lines */}
        <div className="absolute top-0 bottom-0 left-0 w-4 bg-black/15 shadow-inner" />

        {/* Top layout */}
        <div className="pt-12 text-left pl-2">
          <h2 className="text-3xl font-serif tracking-tight font-medium" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            Your<br />Journal
          </h2>
        </div>

        {/* Bottom pill trigger cut-off cleanly */}
        <div className="pl-2 pb-4">
          <button
            onClick={onWrite}
            disabled={isBlurred}
            className="bg-white/90 hover:bg-white text-neutral-800 font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-md active:scale-95 transition-all text-xs uppercase tracking-wide border border-neutral-100 cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Continue...</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // --- Persistent LocalStates ---
  const [pages, setPages] = useState<JournalPage[]>(() => {
    const saved = localStorage.getItem('stamp_journal_pages');
    return saved ? JSON.parse(saved) : INITIAL_DEMO_PAGES;
  });

  const [stamps, setStamps] = useState<Stamp[]>(() => {
    const saved = localStorage.getItem('stamp_journal_stamps');
    return saved ? JSON.parse(saved) : INITIAL_BUILTIN_STAMPS;
  });

  const [coverColor, setCoverColor] = useState<JournalColor>(() => {
    return (localStorage.getItem('stamp_journal_cover_color') as JournalColor) || 'blue';
  });

  const [coverImage, setCoverImage] = useState<string>(() => {
    return localStorage.getItem('stamp_journal_cover_image') || '';
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('stamp_journal_user_name') || 'Jane';
  });

  const [homeNotes, setHomeNotes] = useState(() => {
    return localStorage.getItem('stamp_journal_home_notes') || "This is your personal scratchpad.\nJot down ideas, to-dos, or warm thoughts here directly on the home page.\nIt saves automatically!";
  });

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    pageId: string;
    title: string;
    fromEditor?: boolean;
  } | null>(null);
  const [stampDeleteConfirmation, setStampDeleteConfirmation] = useState<{
    isOpen: boolean;
    stampId: string;
    stampName: string;
  } | null>(null);
  const [showSpotify, setShowSpotify] = useState(false);

  // Sync state into LocalStorage
  useEffect(() => {
    localStorage.setItem('stamp_journal_pages', JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem('stamp_journal_stamps', JSON.stringify(stamps));
  }, [stamps]);

  useEffect(() => {
    localStorage.setItem('stamp_journal_cover_color', coverColor);
  }, [coverColor]);

  useEffect(() => {
    if (coverImage) {
      localStorage.setItem('stamp_journal_cover_image', coverImage);
    } else {
      localStorage.removeItem('stamp_journal_cover_image');
    }
  }, [coverImage]);

  useEffect(() => {
    localStorage.setItem('stamp_journal_user_name', userName);
  }, [userName]);

  // --- Actions ---

  const handleCreateNewPage = () => {
    playPageTurnSound();
    const newPage: JournalPage = {
      id: `page-${Date.now()}`,
      title: 'Untitled Page',
      content: '',
      createdAt: new Date().toISOString(),
      isBookmarked: false,
      placedStamps: [],
    };
    setPages((prev) => [newPage, ...prev]);
    setEditingPageId(newPage.id);
    setActiveScreen('writing');
  };

  const handleEditPage = (pageId: string) => {
    playPageTurnSound();
    setEditingPageId(pageId);
    setActiveScreen('writing');
  };

  const handleSavePage = (updatedPage: JournalPage) => {
    setPages((prev) => prev.map((p) => (p.id === updatedPage.id ? updatedPage : p)));
    setActiveScreen('home');
  };

  const handleDeletePage = (pageId: string) => {
    const page = pages.find((p) => p.id === pageId);
    const title = page?.title || 'Untitled Page';
    setDeleteConfirmation({
      isOpen: true,
      pageId,
      title,
      fromEditor: true,
    });
  };

  const handleToggleBookmarkInList = (pageId: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, isBookmarked: !p.isBookmarked } : p))
    );
  };

  const handleDeletePageFromList = (pageId: string) => {
    const page = pages.find((p) => p.id === pageId);
    const title = page?.title || 'Untitled Page';
    setDeleteConfirmation({
      isOpen: true,
      pageId,
      title,
      fromEditor: false,
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmation) return;
    const { pageId, fromEditor } = deleteConfirmation;
    setPages((prev) => prev.filter((p) => p.id !== pageId));
    if (fromEditor) {
      setActiveScreen('home');
      setEditingPageId(null);
    }
    setDeleteConfirmation(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleDeleteStamp = (stampId: string) => {
    const stamp = stamps.find((s) => s.id === stampId);
    if (!stamp) return;
    setStampDeleteConfirmation({
      isOpen: true,
      stampId,
      stampName: stamp.name,
    });
  };

  const handleConfirmDeleteStamp = () => {
    if (!stampDeleteConfirmation) return;
    const { stampId } = stampDeleteConfirmation;
    setStamps((prev) => prev.filter((s) => s.id !== stampId));
    setStampDeleteConfirmation(null);
  };

  const handleCancelDeleteStamp = () => {
    setStampDeleteConfirmation(null);
  };

  const handleSaveDesignedStamp = (newStampData: Omit<Stamp, 'id' | 'createdAt'>) => {
    const newStamp: Stamp = {
      ...newStampData,
      id: `stamp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setStamps((prev) => [newStamp, ...prev]);
    setActiveScreen('stamps'); // redirect to Catalog of Stamps to admire!
  };

  // Navigations inside the booklet list helpers
  const getEditingPage = () => {
    return pages.find((p) => p.id === editingPageId) || pages[0];
  };

  const handlePrevPage = () => {
    if (!editingPageId) return;
    const currentIndex = pages.findIndex((p) => p.id === editingPageId);
    if (currentIndex < pages.length - 1) {
      playPageTurnSound();
      setEditingPageId(pages[currentIndex + 1].id);
    }
  };

  const handleNextPage = () => {
    if (!editingPageId) return;
    const currentIndex = pages.findIndex((p) => p.id === editingPageId);
    if (currentIndex > 0) {
      playPageTurnSound();
      setEditingPageId(pages[currentIndex - 1].id);
    }
  };

  const getPageIndex = () => {
    if (!editingPageId) return 1;
    const idx = [...pages].reverse().findIndex((p) => p.id === editingPageId);
    return idx !== -1 ? idx + 1 : 1;
  };

  // Cover styling backgrounds
  const getCoverBg = () => {
    switch (coverColor) {
      case 'black':
        return 'bg-neutral-800 hover:bg-neutral-700 shadow-neutral-900/30';
      case 'green':
        return 'bg-emerald-800 hover:bg-emerald-700 shadow-emerald-900/30';
      case 'blue':
        return 'bg-blue-400 hover:bg-blue-300 shadow-blue-400/30';
      default:
        return 'shadow-neutral-900/10 hover:opacity-95';
    }
  };

  // Sort bookmarks & recents for dashboard previews
  const recentsForDashboard = pages.slice(0, 3);
  const bookmarksForDashboard = pages.filter((p) => p.isBookmarked).slice(0, 3);

  return (
    <div className="w-screen h-screen max-h-screen bg-[#ede8df] flex items-center justify-center p-0 md:p-6 overflow-hidden">
      
      {/* Immersive Responsive Desktop Web App Frame - Fits exactly to the browser viewport layout */}
      <div className="w-full h-full bg-[#fbfaf6] text-neutral-800 flex flex-col justify-between py-6 px-10 md:px-12 overflow-y-auto md:overflow-hidden select-none shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] md:rounded-2xl border border-neutral-300/40 relative shrink-0">
      
      {/* Immersive Background Lofi Ambient Music layer */}
      {showSpotify && (
        <div className="fixed bottom-24 left-4 z-50 w-[300px] bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden">
          <div className="p-3 bg-emerald-500 text-white font-mono text-xs flex justify-between items-center font-bold">
            <span className="flex items-center gap-1.5 uppercase tracking-tight">🎤 Lo-fi Focus Radio</span>
            <button
              onClick={() => setShowSpotify(false)}
              className="hover:scale-105 active:scale-95 text-white bg-transparent outline-none font-bold text-sm"
            >
              ✕
            </button>
          </div>
          <iframe
            style={{ borderRadius: '0px' }}
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DWWf7Z7bSclZ1?utm_source=generator&theme=0"
            width="100%"
            height="200"
            frameBorder="0"
            allowFullScreen={false}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      )}
  
      {/* Main workspace container sizing strictly aligned to templates */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto flex items-center justify-center py-4 overflow-y-auto md:overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: Home Dashboard Grid Layout (Image 3) */}
          {activeScreen === 'home' && (
            <motion.div
              key="screen-home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center h-full min-h-0"
            >
              {/* Left Wing Sidebar layout (Title, instructions, links) */}
              <div className="col-span-1 md:col-span-6 flex flex-col justify-between h-full min-h-0 py-1">
                <div className="flex flex-col flex-1 justify-start">
                  {/* Top stamp branding */}
                  <div className="flex items-center gap-3 mb-1 select-none">
                    {/* SVG ball of yarn / stamp outline */}
                    <div className="w-8 h-8 border-3 border-neutral-800 rounded-full flex items-center justify-center font-bold text-md select-none bg-white shadow-xs">
                      ✎
                    </div>
                  </div>
 
                  <h1 className="text-5xl font-light tracking-tighter text-neutral-900 mb-3" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.04em' }}>
                    Stamp Journal
                  </h1>
 
                  {/* Customizable name greetings */}
                  <div className="flex items-center gap-2 mb-4 group select-none">
                    <span className="text-xl font-light text-neutral-600">Hi,</span>
                    <div className="relative flex items-center gap-1.5 border-b border-transparent group-hover:border-neutral-300 focus-within:border-neutral-800 transition-colors">
                      <input
                        type="text"
                        className="text-xl font-semibold text-neutral-950 bg-transparent focus:outline-none w-[110px]"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value.substring(0, 15))}
                      />
                      {/* Interactive pencil icon */}
                      <svg className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 transition-colors pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
 
                  {/* CLEAN RULED LINED NOTEBOOK BLOCK */}
                  <div className="my-1 bg-transparent p-0 relative overflow-hidden select-none flex flex-col flex-1 min-h-[160px] max-h-[240px]">
                    {/* Ruled lined text styling */}
                    <textarea
                      value={homeNotes}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHomeNotes(val);
                        localStorage.setItem('stamp_journal_home_notes', val);
                      }}
                      className="w-full flex-1 bg-transparent resize-none focus:outline-none text-base text-neutral-800 font-hand leading-[28px] select-text placeholder:text-neutral-400 placeholder:italic placeholder:text-sm"
                      style={{
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0) 96.5%, rgba(0,0,0,0.06) 96.5%, rgba(0,0,0,0.06) 100%)',
                        backgroundSize: '100% 28px',
                        lineHeight: '28px',
                      }}
                      placeholder="Write quick diary notes, reminders or doodles..."
                    />
                  </div>
                </div>

                {/* Bottom Left Columns inside left sidebar columns: Recents and Bookmarks lists */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-neutral-200/90 pr-4">
                  {/* Recents Widget */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setActiveScreen('recents')}
                      className="text-sm font-semibold font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-950 flex items-center gap-1.5 cursor-pointer text-left w-fit"
                    >
                      <span>⏱ Recents</span>
                    </button>
                    <div className="flex flex-col gap-1.5">
                      {recentsForDashboard.length === 0 ? (
                        <span className="text-xs text-neutral-400 font-serif italic py-1 border-b border-neutral-100">Empty list</span>
                      ) : (
                        recentsForDashboard.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => handleEditPage(p.id)}
                            className="text-xs font-serif text-neutral-700 hover:text-sky-600 transition-colors text-left border-b border-neutral-200/60 pb-1.5 truncate pr-2 cursor-pointer"
                          >
                            {p.title}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Bookmarks Widget */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setActiveScreen('bookmarks')}
                      className="text-sm font-semibold font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-950 flex items-center gap-1.5 cursor-pointer text-left w-fit"
                    >
                      <span>🔖 Bookmarks</span>
                    </button>
                    <div className="flex flex-col gap-1.5">
                      {bookmarksForDashboard.length === 0 ? (
                        <span className="text-xs text-neutral-400 font-serif italic py-1 border-b border-neutral-100">No bookmarks</span>
                      ) : (
                        bookmarksForDashboard.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => handleEditPage(p.id)}
                            className="text-xs font-serif text-neutral-700 hover:text-rose-600 transition-colors text-left border-b border-neutral-200/60 pb-1.5 truncate pr-2 cursor-pointer"
                          >
                            {p.title}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Wing Block layout containing the cover book */}
              <div className="col-span-1 md:col-span-6 flex flex-col items-center justify-center h-full min-h-0">
                
                {/* Book cover component box wrapper - Scaled safely to prevent vertical overflow */}
                <div className="relative group h-[300px] sm:h-[340px] md:h-[370px] lg:h-[400px] aspect-[3/4]">
                  {/* Floating Left Circle buttons for Stamps catalog + creator */}
                  <div className="absolute left-0 top-[25%] -translate-x-1/2 flex flex-col gap-4 z-40 select-none">
                    <button
                      onClick={() => setActiveScreen('stamps')}
                      id="btn-nav-catalog"
                      title="Open Stamp Catalog"
                      className="w-13 h-13 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 border-2 border-neutral-200 shadow-md flex items-center justify-center transition-all hover:scale-108 active:scale-95 cursor-pointer"
                    >
                      {/* Custon retro stamps icon with scalloped outer border */}
                      <StampCollectibleIcon className="w-6 h-6 text-neutral-800" />
                    </button>
                    
                    <button
                      onClick={() => setActiveScreen('stamp-designer')}
                      id="btn-nav-designer"
                      title="Open Stamp Designer"
                      className="w-13 h-13 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 border-2 border-neutral-200 shadow-md flex items-center justify-center transition-all hover:scale-108 active:scale-95 cursor-pointer"
                    >
                      {/* Artist design tools icon */}
                      <CraftKnifeIcon className="w-5.5 h-5.5 text-neutral-800" />
                    </button>
                  </div>
 
                  {/* Interactive Ribbon booktabs hanging on right side (Index, Bookmarks, Recents) */}
                  <div className="absolute right-0 top-[20%] translate-x-[42%] flex flex-col gap-3.5 z-10 select-none">
                    {/* Index tab (Blue ribbon list) */}
                    <button
                      onClick={() => setActiveScreen('index')}
                      className="w-12 h-9 bg-sky-400 hover:bg-sky-300 text-white rounded-r-lg shadow-sm border border-l-0 border-sky-400 flex items-center justify-center transition-all hover:translate-x-1 text-sm font-semibold active:scale-95 cursor-pointer"
                      title="Open Index directory"
                    >
                      <RuledNotebookIcon className="w-5 h-5" />
                    </button>
                    {/* Bookmark tab (Amber ribbon heart) */}
                    <button
                      onClick={() => setActiveScreen('bookmarks')}
                      className="w-12 h-9 bg-rose-400 hover:bg-rose-300 text-white rounded-r-lg shadow-sm border border-l-0 border-rose-400 flex items-center justify-center transition-all hover:translate-x-1 text-sm font-semibold active:scale-95 cursor-pointer"
                      title="Open Saved Bookmarks"
                    >
                      <BookmarkRibbonIcon className="w-5 h-5" />
                    </button>
                    {/* History Tab (Indigo clock list) */}
                    <button
                      onClick={() => setActiveScreen('recents')}
                      className="w-12 h-9 bg-indigo-400 hover:bg-indigo-300 text-white rounded-r-lg shadow-sm border border-l-0 border-indigo-400 flex items-center justify-center transition-all hover:translate-x-1 text-sm font-semibold active:scale-95 cursor-pointer"
                      title="Open Chronological History"
                    >
                      <ClockRecentsIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* The Physical Book Cover Graphic itself */}
                  <div
                    className={`w-full h-full rounded-2xl border-r-12 border-neutral-750/15 flex flex-col justify-between p-8 shadow-2xl relative transition-all duration-500 ease-out select-none transform hover:-rotate-1 hover:scale-101 border-b-6 border-l-3 ${getCoverBg()}`}
                    style={{
                      backgroundImage: coverImage ? `url(${coverImage})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: ['blue', 'black', 'green'].includes(coverColor) ? undefined : coverColor,
                    }}
                  >
                    {/* Spine binding line styling */}
                    <div className="absolute top-0 bottom-0 left-0 w-4 bg-black/15 shadow-inner" />
 
                    {/* Top layout */}
                    <div className="pt-12 text-center text-white/95">
                      <h2 className="text-4xl font-serif tracking-tight font-medium" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        Your<br />Journal
                      </h2>
                    </div>
 
                    {/* Bottom pill button trigger trigger */}
                    <button
                      onClick={handleCreateNewPage}
                      id="btn-cover-write-now"
                      className="mx-auto bg-white/90 hover:bg-white text-neutral-800 font-semibold px-5 py-3 rounded-full flex items-center gap-1.5 shadow-md active:scale-95 transition-all text-sm uppercase tracking-wide border border-neutral-100 cursor-pointer"
                    >
                      {/* Writing icon tablet */}
                      <svg className="w-4 h-4 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Continue Writing</span>
                    </button>
                  </div>
                </div>

                {/* Sub Cover customization widget (📖 - 🎨 and round paint selector dots) */}
                <div className="flex items-center gap-3 mt-6 bg-neutral-100 rounded-full px-5 py-2.5 shadow-md border border-neutral-200 select-none">
                  <span className="text-sm font-semibold font-mono text-neutral-500 flex items-center gap-1.5">
                    🎨 Color
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCoverColor('blue')}
                      id="btn-color-blue"
                      className={`w-5 h-5 rounded-full bg-blue-400 border border-white hover:scale-110 active:scale-95 transition-transform cursor-pointer ${coverColor === 'blue' ? 'ring-2 ring-neutral-800 ring-offset-1' : ''}`}
                      title="Blue cover"
                    />
                    <button
                      onClick={() => setCoverColor('black')}
                      id="btn-color-black"
                      className={`w-5 h-5 rounded-full bg-neutral-800 border border-white hover:scale-110 active:scale-95 transition-transform cursor-pointer ${coverColor === 'black' ? 'ring-2 ring-neutral-850 ring-offset-1' : ''}`}
                      title="Charcoal slate"
                    />
                    <button
                      onClick={() => setCoverColor('green')}
                      id="btn-color-green"
                      className={`w-5 h-5 rounded-full bg-emerald-800 border border-white hover:scale-110 active:scale-95 transition-transform cursor-pointer ${coverColor === 'green' ? 'ring-2 ring-neutral-850 ring-offset-1' : ''}`}
                      title="Forest sage"
                    />
                  </div>

                  <div className="w-px h-4 bg-neutral-300 mx-1" />

                  {/* Icon image input trigger */}
                  <label className="flex items-center justify-center p-1.5 bg-white hover:bg-neutral-50 rounded-full border border-neutral-300 cursor-pointer hover:scale-108 transition-all shadow-xs relative" title="Upload Custom Cover Photo">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const r = new FileReader();
                          r.onloadend = () => {
                            if (typeof r.result === 'string') {
                              setCoverImage(r.result);
                            }
                          };
                          r.readAsDataURL(file);
                        }
                      }} 
                      className="hidden" 
                    />
                    <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </label>

                  {/* Custom color picker input trigger */}
                  <label className="flex items-center justify-center p-1.5 bg-white hover:bg-neutral-50 rounded-full border border-neutral-300 cursor-pointer hover:scale-108 transition-all shadow-xs relative w-7 h-7" title="Select Custom Cover Color">
                    <input 
                      type="color" 
                      value={['blue', 'black', 'green'].includes(coverColor) ? '#60a5fa' : coverColor}
                      onChange={(e) => setCoverColor(e.target.value)} 
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
                    />
                    <PainterPaletteIcon className="w-4 h-4 text-neutral-600" />
                  </label>

                  {coverImage && (
                    <button 
                      onClick={() => setCoverImage('')}
                      className="p-1 px-1.5 text-[10px] font-mono text-rose-600 hover:bg-rose-50 border border-rose-100 rounded-lg cursor-pointer transition-all"
                      title="Clear custom cover photo"
                    >
                      Reset
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {/* SCREEN 2: Stamp Designer */}
          {activeScreen === 'stamp-designer' && (
            <motion.div
              key="screen-designer"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full flex gap-0 items-stretch overflow-visible relative"
            >
              <div className="flex-1 min-w-0">
                <StampDesigner
                  onSaveStamp={handleSaveDesignedStamp}
                  onBack={() => setActiveScreen('home')}
                />
              </div>
              <JournalPeekingCover coverColor={coverColor} onWrite={handleCreateNewPage} coverImage={coverImage} isBlurred={true} />
            </motion.div>
          )}

          {/* SCREEN 3: Stamps Catalog list */}
          {activeScreen === 'stamps' && (
            <motion.div
              key="screen-stamps"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full flex gap-0 items-stretch overflow-visible relative"
            >
              <div className="flex-1 min-w-0">
                <StampCatalog stamps={stamps} onDeleteStamp={handleDeleteStamp} onBack={() => setActiveScreen('home')} />
              </div>
              <JournalPeekingCover coverColor={coverColor} onWrite={handleCreateNewPage} coverImage={coverImage} isBlurred={true} />
            </motion.div>
          )}

          {/* SCREEN 4: Journal Editor view */}
          {activeScreen === 'writing' && editingPageId && (
            <motion.div
              key="screen-editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <JournalEditor
                page={getEditingPage()}
                stamps={stamps}
                onSave={handleSavePage}
                onDiscard={() => handleDeletePage(editingPageId)}
                onGoHome={() => setActiveScreen('home')}
                onGoIndex={() => setActiveScreen('index')}
                onGoBookmarks={() => setActiveScreen('bookmarks')}
                hasPrev={pages.findIndex((p) => p.id === editingPageId) < pages.length - 1}
                hasNext={pages.findIndex((p) => p.id === editingPageId) > 0}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
                onNewPage={handleCreateNewPage}
                coverColor={coverColor}
                onCoverColorChange={setCoverColor}
                coverImage={coverImage}
                onCoverImageChange={setCoverImage}
                pageNumber={getPageIndex()}
              />
            </motion.div>
          )}

          {/* SCREEN 5: About view */}
          {activeScreen === 'about' && (
            <motion.div
              key="screen-about"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full flex gap-0 items-stretch overflow-visible relative"
            >
              <div className="flex-1 min-w-0">
                <AboutScreen onBack={() => setActiveScreen('home')} />
              </div>
              <JournalPeekingCover coverColor={coverColor} onWrite={handleCreateNewPage} coverImage={coverImage} />
            </motion.div>
          )}

          {/* SCREEN 6: Notebook Lists (Index, Bookmarks, Recents) */}
          {(activeScreen === 'index' || activeScreen === 'bookmarks' || activeScreen === 'recents') && (
            <motion.div
              key="screen-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <NotebookListScreen
                title={
                  activeScreen === 'bookmarks' ? 'Bookmarks' : activeScreen === 'recents' ? 'Recents' : 'Index'
                }
                pages={
                  activeScreen === 'bookmarks'
                    ? pages.filter((p) => p.isBookmarked)
                    : activeScreen === 'recents'
                    ? pages
                    : [...pages].reverse() // show in direct index chronological sequence
                }
                onSelectPage={handleEditPage}
                onGoHome={() => setActiveScreen('home')}
                onContinueWriting={() => {
                  if (pages.length > 0) {
                    handleEditPage(pages[0].id);
                  } else {
                    handleCreateNewPage();
                  }
                }}
                onToggleBookmark={handleToggleBookmarkInList}
                onDeletePage={handleDeletePageFromList}
                allPages={pages}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Persistent Bottom Layout Banner (Spotify widgets + static clean design as in Image 3) - Only on home screen */}
      {activeScreen === 'home' && (
        <footer className="w-full max-w-[1240px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-neutral-200/50 select-none">
          
          {/* Left Side: Spotify Focus Trigger button with clean official-looking logo */}
          <button
            onClick={() => window.open('https://open.spotify.com/playlist/37i9dQZF1DWWf7Z7bSclZ1', '_blank')}
            id="btn-footer-spotify"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer border border-emerald-200/50"
          >
            {/* Real aesthetic Spotify vector logo path */}
            <svg className="w-4 h-4 text-emerald-600 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.98-.336.075-.67-.14-.744-.477-.076-.336.14-.67.476-.744 3.856-.88 7.15-.502 9.814 1.13.295.18.387.563.207.864zm1.224-2.72c-.227.367-.707.487-1.074.26-2.723-1.673-6.874-2.157-10.082-1.182-.413.125-.85-.107-.978-.52-.128-.413.108-.85.52-.977 3.666-1.112 8.236-.574 11.353 1.34.367.228.487.708.26 1.075v.004zm.107-2.812C14.53 8.8 8.012 8.583 4.225 9.733c-.58.175-1.192-.16-1.368-.74-.175-.58.16-1.192.74-1.368 4.345-1.32 11.535-1.072 15.545 1.31.522.31.69.982.38 1.503-.31.523-.982.69-1.503.38z"/>
            </svg>
            <span>Spotify Focus Soundtrack</span>
          </button>
 
          {/* Center: Replaced Marquee with beautiful static literary quote and embedded About button */}
          <div className="flex-1 max-w-lg bg-neutral-100 rounded-full py-1 px-2 flex items-center justify-between border border-neutral-200 relative">
            <span className="font-serif italic text-xs text-neutral-600 pl-4 pr-16 truncate">
              "Create, stamp, and reflect in absolute digital privacy."
            </span>
 
            {/* Embedded About button pill inside (Image 3) */}
            <button
              onClick={() => setActiveScreen('about')}
              id="btn-footer-about"
              className="absolute right-1 leading-none bg-sky-200 hover:bg-sky-300 text-sky-800 font-bold px-3.5 py-1.5 rounded-full text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              About
            </button>
          </div>
 
          {/* Right Side: Local storage stamp of total offline privacy (Image 3) */}
          <div className="inline-flex flex-col items-end gap-0.5 max-w-[160px] text-right text-xs pr-1">
            <span className="font-semibold text-neutral-800 font-mono flex items-center gap-1 uppercase tracking-tight">
              🔒 Local Storage
            </span>
            <span className="text-[10px] text-neutral-400 font-mono tracking-tighter uppercase whitespace-nowrap">
              Personal Sandbox, Total Privacy
            </span>
          </div>
 
        </footer>
      )}

      {/* Visual Custom Confirm Modal across the entire application */}
      <ConfirmModal
        isOpen={deleteConfirmation?.isOpen || false}
        title={deleteConfirmation?.fromEditor ? "Discard Page" : "Delete Page"}
        message={
          deleteConfirmation?.fromEditor
            ? `Your edits to "${deleteConfirmation.title}" will be permanently discarded. Are you sure?`
            : `Are you sure you want to permanently delete "${deleteConfirmation?.title || 'Untitled Page'}"? This action cannot be undone.`
        }
        confirmText={deleteConfirmation?.fromEditor ? "Discard" : "Delete"}
        cancelText={deleteConfirmation?.fromEditor ? "Keep Draft" : "Cancel"}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Visual Custom Confirm Modal specifically for deleting stamps */}
      <ConfirmModal
        isOpen={stampDeleteConfirmation?.isOpen || false}
        title="Delete Stamp"
        message={`Are you sure you want to permanently delete the stamp "${stampDeleteConfirmation?.stampName || 'this stamp'}" from your library? It will no longer be available to place on pages.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDeleteStamp}
        onCancel={handleCancelDeleteStamp}
      />

      </div>
    </div>
  );
}
