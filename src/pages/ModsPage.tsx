import { useMemo, useState } from 'react';
import { ArrowLeftRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { ModCard } from '../components/ModCard';
import { CATEGORIES } from '../data/mods';
import { MinecraftEdition, ModCategory, ModItem, ModLoader } from '../types/mod';
import { getAverageRating } from '../utils/download';

interface ModsPageProps {
  mods: ModItem[];
  savedIds: Set<string>;
  compareIds: string[];
  selectedCategory: ModCategory | 'all' | 'saved';
  selectedEdition: MinecraftEdition | 'All';
  onCategoryChange: (cat: ModCategory | 'all' | 'saved') => void;
  onEditionChange: (edition: MinecraftEdition | 'All') => void;
  onOpenDetail: (modId: string) => void;
  onToggleSave: (modId: string) => void;
  onToggleCompare: (modId: string) => void;
  onOpenCompare: () => void;
  onDownload: (mod: ModItem) => void;
}

type SortOption = 'downloads' | 'rating' | 'recent' | 'name';

const LOADERS: (ModLoader | 'All')[] = [
  'All',
  'Fabric',
  'NeoForge',
  'Forge',
  'Modpack',
  'Behavior & Resource',
  'Resource Pack',
  'Iris / OptiFine',
];

export function ModsPage({
  mods,
  savedIds,
  compareIds,
  selectedCategory,
  selectedEdition,
  onCategoryChange,
  onEditionChange,
  onOpenDetail,
  onToggleSave,
  onToggleCompare,
  onOpenCompare,
  onDownload,
}: ModsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLoader, setSelectedLoader] = useState<ModLoader | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('downloads');

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: mods.length,
      saved: mods.filter((m) => savedIds.has(m.id)).length,
    };
    for (const cat of CATEGORIES) {
      counts[cat.id] = mods.filter((m) => m.category === cat.id).length;
    }
    return counts;
  }, [mods, savedIds]);

  const filteredAndSorted = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = mods.filter((m) => {
      if (selectedCategory === 'saved' && !savedIds.has(m.id)) return false;
      if (
        selectedCategory !== 'all' &&
        selectedCategory !== 'saved' &&
        m.category !== selectedCategory
      ) {
        return false;
      }
      if (selectedEdition !== 'All') {
        if (m.edition !== selectedEdition && m.edition !== 'Both') return false;
      }
      if (selectedLoader !== 'All') {
        const matchesMain = m.loader === selectedLoader;
        const matchesVariant = m.variants.some((v) => v.loader === selectedLoader);
        if (!matchesMain && !matchesVariant) return false;
      }
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.author.toLowerCase().includes(q) ||
        m.mcVersion.toLowerCase().includes(q) ||
        m.loader.toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'rating') return getAverageRating(b) - getAverageRating(a);
      if (sortBy === 'recent') return b.timestamp - a.timestamp;
      return a.title.localeCompare(b.title);
    });
  }, [mods, savedIds, selectedCategory, selectedEdition, selectedLoader, searchQuery, sortBy]);

  const resetAll = () => {
    setSearchQuery('');
    setSelectedLoader('All');
    setSortBy('downloads');
    onCategoryChange('all');
    onEditionChange('All');
  };

  return (
    <div className="mx-auto max-w-[1160px] px-4 py-8 sm:px-6 sm:py-10 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#F3F1EC]">
            Mods &amp; Addons Catalog
          </h1>
          <p className="mt-1 text-sm text-[#A8A39A]">
            Filter across Java Edition, Bedrock Edition, loaders, and Minecraft releases.
          </p>
        </div>

        {/* Edition Segmented Switch */}
        <div
          className="inline-flex rounded-full border-2 border-[#34323A] bg-[#222127] p-1 self-start sm:self-auto"
          role="group"
          aria-label="Minecraft Edition filter"
        >
          {(['All', 'Java', 'Bedrock'] as (MinecraftEdition | 'All')[]).map((ed) => {
            const active = selectedEdition === ed;
            return (
              <button
                key={ed}
                type="button"
                onClick={() => onEditionChange(ed)}
                aria-pressed={active}
                className={`rounded-full px-4 py-1.5 text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#D93A30] text-white'
                    : 'text-[#A8A39A] hover:text-[#F3F1EC]'
                }`}
              >
                {ed === 'All' ? 'All Editions' : ed}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + Loader + Sort Controls */}
      <div className="grid gap-3 md:grid-cols-12">
        <div className="relative md:col-span-6">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#A8A39A]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by mod title, author, or MC version..."
            aria-label="Search catalog"
            className="w-full rounded-[16px] border-2 border-[#34323A] bg-[#1C1B20] py-3 pr-10 pl-11 text-[15px] text-[#F3F1EC] placeholder:text-[#6F6B63] focus:border-[#FF6A5F] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-[#A8A39A] hover:text-[#F3F1EC] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="md:col-span-3">
          <label htmlFor="loader-select" className="sr-only">
            Filter by loader
          </label>
          <select
            id="loader-select"
            value={selectedLoader}
            onChange={(e) => setSelectedLoader(e.target.value as ModLoader | 'All')}
            className="w-full rounded-[16px] border-2 border-[#34323A] bg-[#1C1B20] px-4 py-3 text-[14.5px] font-medium text-[#F3F1EC] focus:border-[#FF6A5F] focus:outline-none"
          >
            {LOADERS.map((loader) => (
              <option key={loader} value={loader}>
                {loader === 'All' ? 'All Loaders & Formats' : loader}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <label htmlFor="sort-select" className="sr-only">
            Sort mods
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full rounded-[16px] border-2 border-[#34323A] bg-[#1C1B20] px-4 py-3 text-[14.5px] font-medium text-[#F3F1EC] focus:border-[#FF6A5F] focus:outline-none"
          >
            <option value="downloads">Sort: Most Downloaded</option>
            <option value="rating">Sort: Highest Rated</option>
            <option value="recent">Sort: Recently Updated</option>
            <option value="name">Sort: Name (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Category tabs */}
      <div
        className="flex gap-2.5 overflow-x-auto pb-2 thin-scroll"
        role="group"
        aria-label="Category filter tabs"
      >
        {[
          { id: 'all' as const, label: 'All' },
          ...CATEGORIES.map((c) => ({ id: c.id, label: c.name })),
          { id: 'saved' as const, label: 'Saved' },
        ].map((tab) => {
          const active = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={active}
              onClick={() => onCategoryChange(tab.id)}
              className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-[14px] font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                active
                  ? 'border-[#D93A30] bg-[#D93A30] text-white'
                  : 'border-[#34323A] bg-[#222127] text-[#F3F1EC] hover:border-[#6F6B63]'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[12px] opacity-80 tabular-nums">
                {tabCounts[tab.id] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results count & Compare trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-[#A8A39A]">
        <span className="inline-flex items-center gap-1.5 tabular-nums">
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          Showing {filteredAndSorted.length} of {mods.length} packages
        </span>

        <div className="flex items-center gap-3">
          {(searchQuery ||
            selectedCategory !== 'all' ||
            selectedEdition !== 'All' ||
            selectedLoader !== 'All') && (
            <button
              type="button"
              onClick={resetAll}
              className="text-[#FF6A5F] hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          )}
          <button
            type="button"
            onClick={onOpenCompare}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#34323A] bg-[#222127] px-3.5 py-1.5 text-xs font-semibold text-[#F3F1EC] hover:border-[#FF6A5F] hover:text-[#FF6A5F] transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Compare Mods{compareIds.length > 0 ? ` (${compareIds.length}/2)` : ''}</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredAndSorted.length === 0 ? (
        <div className="rounded-[24px] border-2 border-dashed border-[#34323A] bg-[#222127] px-6 py-14 text-center space-y-3">
          <p className="font-display text-lg font-bold text-[#F3F1EC]">
            No packages match these filters
          </p>
          <p className="text-sm text-[#A8A39A]">
            Adjust your edition, loader, or search query to explore more releases.
          </p>
          <button
            type="button"
            onClick={resetAll}
            className="rounded-full bg-[#D93A30] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#FF6A5F] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSorted.map((mod) => (
            <ModCard
              key={mod.id}
              mod={mod}
              isSaved={savedIds.has(mod.id)}
              isCompared={compareIds.includes(mod.id)}
              onOpenDetail={onOpenDetail}
              onToggleSave={onToggleSave}
              onToggleCompare={onToggleCompare}
              onDownload={onDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}
