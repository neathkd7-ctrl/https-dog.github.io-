import { useCallback, useEffect, useState } from 'react';
import { ArrowLeftRight, X } from 'lucide-react';
import { CompareModal } from './components/CompareModal';
import { Footer } from './components/Footer';
import { ModDetailModal } from './components/ModDetailModal';
import { Navbar } from './components/Navbar';
import { SubmitModModal } from './components/SubmitModModal';
import { INITIAL_MODS } from './data/mods';
import { AboutPage } from './pages/AboutPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { HomePage } from './pages/HomePage';
import { ModsPage } from './pages/ModsPage';
import {
  DownloadRecord,
  DownloadVariant,
  MinecraftEdition,
  ModCategory,
  ModItem,
  PageRoute,
  UserVoteState,
} from './types/mod';
import { triggerPackageFileDownload } from './utils/download';

const STORAGE_KEYS = {
  saved: 'blockforge_saved_v1',
  downloads: 'blockforge_downloads_v1',
  votes: 'blockforge_votes_v1',
  customMods: 'blockforge_custom_mods_v1',
  comments: 'blockforge_comments_v1',
};

function parseRouteFromHash(): PageRoute {
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (hash === 'mods') return 'mods';
  if (hash === 'categories') return 'categories';
  if (hash === 'downloads') return 'downloads';
  if (hash === 'about') return 'about';
  return 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>(() => parseRouteFromHash());
  const [modsCategory, setModsCategory] = useState<ModCategory | 'all' | 'saved'>('all');
  const [modsEdition, setModsEdition] = useState<MinecraftEdition | 'All'>('All');

  const [mods, setMods] = useState<ModItem[]>(() => {
    try {
      const customRaw = localStorage.getItem(STORAGE_KEYS.customMods);
      const customMods: ModItem[] = customRaw ? JSON.parse(customRaw) : [];
      const commentsRaw = localStorage.getItem(STORAGE_KEYS.comments);
      const extraComments: Record<string, ModItem['comments']> = commentsRaw
        ? JSON.parse(commentsRaw)
        : {};

      return [...customMods, ...INITIAL_MODS].map((m) => ({
        ...m,
        comments: [...(extraComments[m.id] || []), ...m.comments],
      }));
    } catch {
      return INITIAL_MODS;
    }
  });

  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.saved);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [downloadHistory, setDownloadHistory] = useState<DownloadRecord[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.downloads);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [votes, setVotes] = useState<Record<string, UserVoteState>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.votes);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [activeModId, setActiveModId] = useState<string | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMsg(message);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 3200);
    return () => clearTimeout(t);
  }, [toastMsg]);

  useEffect(() => {
    const onHashChange = () => {
      setCurrentPage(parseRouteFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((page: PageRoute) => {
    setCurrentPage(page);
    window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateModsFiltered = useCallback(
    (category: ModCategory | 'all' | 'saved', edition: MinecraftEdition | 'All' = 'All') => {
      setModsCategory(category);
      setModsEdition(edition);
      navigate('mods');
    },
    [navigate]
  );

  const handleOpenDetail = useCallback((modId: string) => {
    setActiveModId(modId);
    setMods((prev) =>
      prev.map((m) => (m.id === modId ? { ...m, views: m.views + 1 } : m))
    );
  }, []);

  const handleToggleSave = useCallback(
    (modId: string) => {
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (next.has(modId)) {
          next.delete(modId);
          showToast('Removed from saved mods.');
        } else {
          next.add(modId);
          showToast('Saved to your bookmarks.');
        }
        try {
          localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(Array.from(next)));
        } catch {
          // ignore storage quota errors
        }
        return next;
      });
    },
    [showToast]
  );

  const handleToggleCompare = useCallback(
    (modId: string) => {
      setCompareIds((prev) => {
        if (prev.includes(modId)) {
          showToast('Removed from comparison.');
          return prev.filter((id) => id !== modId);
        }
        if (prev.length >= 2) {
          showToast('Replaced first comparison slot with selected mod.');
          return [prev[1], modId];
        }
        const next = [...prev, modId];
        if (next.length === 2) {
          showToast('2 mods selected — ready to compare.');
        } else {
          showToast('Selected 1st mod — pick one more to compare.');
        }
        return next;
      });
    },
    [showToast]
  );

  const handleOpenCompare = useCallback(() => {
    setCompareIds((prev) => {
      if (prev.length >= 2) return prev;
      const first = prev[0] || mods[0]?.id;
      const second = mods.find((m) => m.id !== first)?.id || first;
      return [first, second].filter(Boolean) as string[];
    });
    setCompareOpen(true);
  }, [mods]);

  const handleDownloadVariant = useCallback(
    (mod: ModItem, variant: DownloadVariant) => {
      triggerPackageFileDownload(mod, variant);

      const recordId = `dl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newRecord: DownloadRecord = {
        id: recordId,
        modId: mod.id,
        modTitle: mod.title,
        variantLabel: variant.label,
        fileName: variant.fileName,
        fileSize: variant.fileSize,
        edition: mod.edition,
        loader: variant.loader,
        mcVersion: variant.mcVersion,
        sha256: variant.sha256,
        downloadedAt: Date.now(),
        status: 'downloading',
        progress: 35,
      };

      setDownloadHistory((prev) => {
        const next = [newRecord, ...prev].slice(0, 25);
        try {
          localStorage.setItem(
            STORAGE_KEYS.downloads,
            JSON.stringify(next.map((r) => ({ ...r, status: 'completed', progress: 100 })))
          );
        } catch {
          // ignore
        }
        return next;
      });

      setMods((prev) =>
        prev.map((m) => (m.id === mod.id ? { ...m, downloads: m.downloads + 1 } : m))
      );

      showToast(`Downloading ${variant.fileName}`);

      setTimeout(() => {
        setDownloadHistory((prev) =>
          prev.map((r) => (r.id === recordId ? { ...r, progress: 100, status: 'completed' } : r))
        );
      }, 350);
    },
    [showToast]
  );

  const handleQuickDownload = useCallback(
    (mod: ModItem) => {
      const primaryVariant = mod.variants[0];
      if (primaryVariant) {
        handleDownloadVariant(mod, primaryVariant);
      }
    },
    [handleDownloadVariant]
  );

  const handleRedownload = useCallback(
    (record: DownloadRecord) => {
      const matchedMod = mods.find((m) => m.id === record.modId);
      if (matchedMod) {
        const matchedVariant =
          matchedMod.variants.find((v) => v.fileName === record.fileName) ||
          matchedMod.variants[0];
        if (matchedVariant) {
          handleDownloadVariant(matchedMod, matchedVariant);
          return;
        }
      }
      showToast(`Re-downloading ${record.fileName}`);
    },
    [mods, handleDownloadVariant, showToast]
  );

  const handleClearHistory = useCallback(() => {
    setDownloadHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.downloads);
    } catch {
      // ignore
    }
    showToast('Download history cleared.');
  }, [showToast]);

  const handleVoteLike = useCallback(
    (modId: string, value: 1 | -1) => {
      const prevVote = votes[modId] || {};
      const oldLike = prevVote.like || 0;
      const newLike = oldLike === value ? undefined : value;

      const deltaLikes = (newLike === 1 ? 1 : 0) - (oldLike === 1 ? 1 : 0);
      const deltaDislikes = (newLike === -1 ? 1 : 0) - (oldLike === -1 ? 1 : 0);

      setVotes((prev) => {
        const updated = {
          ...prev,
          [modId]: { ...prevVote, like: newLike },
        };
        try {
          localStorage.setItem(STORAGE_KEYS.votes, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });

      setMods((prev) =>
        prev.map((m) =>
          m.id === modId
            ? { ...m, likes: m.likes + deltaLikes, dislikes: m.dislikes + deltaDislikes }
            : m
        )
      );
    },
    [votes]
  );

  const handleVoteStar = useCallback(
    (modId: string, stars: number) => {
      const prevVote = votes[modId] || {};
      const oldStars = prevVote.stars || 0;
      const newStars = oldStars === stars ? undefined : stars;

      const deltaSum = (newStars || 0) - oldStars;
      const deltaCount = (newStars ? 1 : 0) - (oldStars ? 1 : 0);

      setVotes((prev) => {
        const updated = {
          ...prev,
          [modId]: { ...prevVote, stars: newStars },
        };
        try {
          localStorage.setItem(STORAGE_KEYS.votes, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });

      setMods((prev) =>
        prev.map((m) =>
          m.id === modId
            ? {
                ...m,
                ratingSum: m.ratingSum + deltaSum,
                ratingCount: Math.max(0, m.ratingCount + deltaCount),
              }
            : m
        )
      );

      if (newStars) {
        showToast(`Rated ${newStars} out of 5 stars.`);
      }
    },
    [votes, showToast]
  );

  const handleAddComment = useCallback(
    (modId: string, author: string, text: string) => {
      const newComment = {
        id: `c-${Date.now()}`,
        author,
        text,
        createdAt: Date.now(),
      };

      setMods((prev) =>
        prev.map((m) =>
          m.id === modId ? { ...m, comments: [newComment, ...m.comments] } : m
        )
      );

      try {
        const raw = localStorage.getItem(STORAGE_KEYS.comments);
        const existing: Record<string, ModItem['comments']> = raw ? JSON.parse(raw) : {};
        existing[modId] = [newComment, ...(existing[modId] || [])];
        localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(existing));
      } catch {
        // ignore
      }
      showToast('Comment posted.');
    },
    [showToast]
  );

  const handleSubmitMod = useCallback(
    (newMod: ModItem) => {
      setMods((prev) => [newMod, ...prev]);
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.customMods);
        const existing: ModItem[] = raw ? JSON.parse(raw) : [];
        localStorage.setItem(STORAGE_KEYS.customMods, JSON.stringify([newMod, ...existing]));
      } catch {
        // ignore
      }
      showToast(`${newMod.title} published to catalog.`);
      navigate('mods');
    },
    [navigate, showToast]
  );

  const activeMod = activeModId ? mods.find((m) => m.id === activeModId) || null : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#17161A] text-[#F3F1EC]">
      <Navbar
        currentPage={currentPage}
        onNavigate={navigate}
        onOpenSubmit={() => setSubmitOpen(true)}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            mods={mods}
            savedIds={savedIds}
            compareIds={compareIds}
            onNavigate={navigate}
            onNavigateModsFiltered={navigateModsFiltered}
            onOpenDetail={handleOpenDetail}
            onToggleSave={handleToggleSave}
            onToggleCompare={handleToggleCompare}
            onOpenCompare={handleOpenCompare}
            onDownload={handleQuickDownload}
          />
        )}

        {currentPage === 'mods' && (
          <ModsPage
            mods={mods}
            savedIds={savedIds}
            compareIds={compareIds}
            selectedCategory={modsCategory}
            selectedEdition={modsEdition}
            onCategoryChange={setModsCategory}
            onEditionChange={setModsEdition}
            onOpenDetail={handleOpenDetail}
            onToggleSave={handleToggleSave}
            onToggleCompare={handleToggleCompare}
            onOpenCompare={handleOpenCompare}
            onDownload={handleQuickDownload}
          />
        )}

        {currentPage === 'categories' && (
          <CategoriesPage
            mods={mods}
            onExploreCategory={(cat, ed) => navigateModsFiltered(cat, ed || 'All')}
            onExploreEdition={(ed) => navigateModsFiltered('all', ed)}
          />
        )}

        {currentPage === 'downloads' && (
          <DownloadsPage
            downloads={downloadHistory}
            mods={mods}
            onRedownload={handleRedownload}
            onDownloadMod={handleQuickDownload}
            onClearHistory={handleClearHistory}
            onNavigate={navigate}
            onOpenDetail={handleOpenDetail}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigate={navigate} onShowToast={showToast} />
        )}
      </main>

      <Footer mods={mods} onNavigate={navigate} onOpenMod={handleOpenDetail} />

      <ModDetailModal
        mod={activeMod}
        isSaved={activeMod ? savedIds.has(activeMod.id) : false}
        isCompared={activeMod ? compareIds.includes(activeMod.id) : false}
        userVote={activeMod ? votes[activeMod.id] || {} : {}}
        onClose={() => setActiveModId(null)}
        onToggleSave={handleToggleSave}
        onToggleCompare={handleToggleCompare}
        onDownloadVariant={handleDownloadVariant}
        onVoteLike={handleVoteLike}
        onVoteStar={handleVoteStar}
        onAddComment={handleAddComment}
      />

      <CompareModal
        isOpen={compareOpen}
        mods={mods}
        leftModId={compareIds[0] || mods[0]?.id || ''}
        rightModId={compareIds[1] || mods[1]?.id || mods[0]?.id || ''}
        onSelectLeft={(id) =>
          setCompareIds((prev) => [id, prev[1] || mods[1]?.id || id])
        }
        onSelectRight={(id) =>
          setCompareIds((prev) => [prev[0] || mods[0]?.id || id, id])
        }
        onSwap={() =>
          setCompareIds((prev) => [
            prev[1] || mods[1]?.id || '',
            prev[0] || mods[0]?.id || '',
          ])
        }
        onClose={() => setCompareOpen(false)}
        onDownload={handleQuickDownload}
        onOpenDetail={handleOpenDetail}
      />

      <SubmitModModal
        isOpen={submitOpen}
        onClose={() => setSubmitOpen(false)}
        onSubmitMod={handleSubmitMod}
      />

      {compareIds.length > 0 && !compareOpen && (
        <div
          role="region"
          aria-label="Mod comparison selection"
          className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-24px)] max-w-[660px] -translate-x-1/2 items-center justify-between gap-3 rounded-full border-2 border-[#34323A] bg-[#222127]/95 px-4 py-2 shadow-2xl backdrop-blur-xs"
        >
          <div className="flex min-w-0 items-center gap-2 text-xs font-medium text-[#F3F1EC]">
            <ArrowLeftRight className="h-4 w-4 shrink-0 text-[#FF6A5F]" aria-hidden="true" />
            <span className="truncate">
              {compareIds
                .map((id) => mods.find((m) => m.id === id)?.title)
                .filter(Boolean)
                .join(' vs ')}
              {compareIds.length === 1 ? ' · Select 1 more' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenCompare}
              className="rounded-full bg-[#D93A30] px-4 py-1.5 text-xs font-semibold text-white whitespace-nowrap hover:bg-[#FF6A5F] cursor-pointer"
            >
              {compareIds.length === 2 ? 'Compare Now' : 'Open Compare'}
            </button>
            <button
              type="button"
              onClick={() => setCompareIds([])}
              aria-label="Clear comparison selection"
              className="grid h-7 w-7 place-items-center rounded-full border border-[#34323A] bg-[#17161A] text-[#A8A39A] hover:text-[#F3F1EC] cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[#34323A] bg-[#F3F1EC] px-5 py-2.5 text-sm font-semibold text-[#17161A] shadow-xl"
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
