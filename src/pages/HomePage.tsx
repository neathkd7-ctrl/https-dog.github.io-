import { useMemo, useState } from 'react';
import { ArrowLeftRight, ArrowRight, Search, X } from 'lucide-react';
import { ModCard } from '../components/ModCard';
import { ModImage } from '../components/ModImage';
import { CATEGORIES, HERO_IMAGE } from '../data/mods';
import { MinecraftEdition, ModCategory, ModItem, PageRoute } from '../types/mod';
import { formatCompactNumber } from '../utils/download';

interface HomePageProps {
  mods: ModItem[];
  savedIds: Set<string>;
  compareIds: string[];
  onNavigate: (page: PageRoute) => void;
  onNavigateModsFiltered: (category: ModCategory | 'all' | 'saved', edition?: MinecraftEdition | 'All') => void;
  onOpenDetail: (modId: string) => void;
  onToggleSave: (modId: string) => void;
  onToggleCompare: (modId: string) => void;
  onOpenCompare: () => void;
  onDownload: (mod: ModItem) => void;
}

export function HomePage({
  mods,
  savedIds,
  compareIds,
  onNavigate,
  onNavigateModsFiltered,
  onOpenDetail,
  onToggleSave,
  onToggleCompare,
  onOpenCompare,
  onDownload,
}: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ModCategory | 'all' | 'saved'>('all');

  const totalDownloads = useMemo(
    () => mods.reduce((sum, item) => sum + item.downloads, 0),
    [mods]
  );

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

  const filteredMods = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return mods.filter((m) => {
      if (activeTab === 'saved' && !savedIds.has(m.id)) return false;
      if (activeTab !== 'all' && activeTab !== 'saved' && m.category !== activeTab) {
        return false;
      }
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.author.toLowerCase().includes(q) ||
        m.mcVersion.toLowerCase().includes(q) ||
        m.loader.toLowerCase().includes(q) ||
        m.edition.toLowerCase().includes(q)
      );
    });
  }, [mods, activeTab, savedIds, searchQuery]);

  return (
    <div className="mx-auto max-w-[1160px] px-4 py-8 sm:px-6 sm:py-10 space-y-12">
      {/* Hero Split */}
      <section className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
        <div className="flex flex-col justify-between gap-6 rounded-[24px] border-2 border-[#34323A] bg-[#222127] p-6 sm:p-8 lg:col-span-6">
          <div className="space-y-4">
            <p className="text-[13px] font-semibold tracking-wide text-[#FF6A5F]">
              Java 1.21.4 &amp; Bedrock 1.21.50+ Repository
            </p>
            <h1 className="font-display text-[34px] font-bold leading-[1.12] tracking-tight text-[#F3F1EC] sm:text-[46px]">
              Curated Minecraft Mods for Every World
            </h1>
            <p className="max-w-[52ch] text-[15.5px] leading-relaxed text-[#A8A39A]">
              Discover performance-tested Java mods, native Bedrock addons, complete survival
              modpacks, and lightweight shaders with direct build downloads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('mods')}
              className="inline-flex items-center gap-2 rounded-full bg-[#D93A30] px-6 py-3 text-[15px] font-semibold text-white whitespace-nowrap transition-colors hover:bg-[#FF6A5F] active:scale-[0.98] cursor-pointer"
            >
              <span>Browse All Mods</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('categories')}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#34323A] bg-[#1C1B20] px-5 py-3 text-[15px] font-semibold text-[#F3F1EC] whitespace-nowrap transition-colors hover:border-[#6F6B63] cursor-pointer"
            >
              <span>Explore Categories</span>
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border-2 border-[#34323A] bg-[#222127] lg:col-span-6">
          <div className="relative h-full min-h-[240px] w-full aspect-[16/10] lg:aspect-auto">
            <ModImage
              src={HERO_IMAGE}
              alt="Voxel mountain citadel lit by lanterns and twilight shaders"
              title="BlockForge Featured World"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
              <div>
                <p className="text-xs font-medium text-[#FF6A5F]">Featured Modpack</p>
                <p className="font-display text-lg font-bold text-white">
                  Citadel Horizon Survival Pack
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenDetail('citadel-horizon-modpack')}
                className="rounded-full border border-white/25 bg-[#17161A]/85 px-4 py-2 text-xs font-semibold text-white whitespace-nowrap backdrop-blur-xs transition-colors hover:border-white/50 cursor-pointer"
              >
                Inspect Pack
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Catalog Strip */}
      <section
        aria-label="Catalog highlights"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <div className="rounded-[18px] border border-[#34323A] bg-[#222127] p-4 sm:p-5">
          <p className="text-xs font-medium text-[#A8A39A]">Curated Releases</p>
          <p className="mt-1 font-display text-2xl font-bold text-[#F3F1EC] tabular-nums">
            {mods.length} Packs
          </p>
        </div>
        <div className="rounded-[18px] border border-[#34323A] bg-[#222127] p-4 sm:p-5">
          <p className="text-xs font-medium text-[#A8A39A]">Community Downloads</p>
          <p className="mt-1 font-display text-2xl font-bold text-[#F3F1EC] tabular-nums">
            {formatCompactNumber(totalDownloads)}
          </p>
        </div>
        <div className="rounded-[18px] border border-[#34323A] bg-[#222127] p-4 sm:p-5">
          <p className="text-xs font-medium text-[#A8A39A]">Supported Editions</p>
          <p className="mt-1 font-display text-2xl font-bold text-[#F3F1EC]">
            Java &amp; Bedrock
          </p>
        </div>
        <div className="rounded-[18px] border border-[#34323A] bg-[#222127] p-4 sm:p-5">
          <p className="text-xs font-medium text-[#A8A39A]">Saved Bookmarks</p>
          <p className="mt-1 font-display text-2xl font-bold text-[#F3F1EC] tabular-nums">
            {savedIds.size} Saved
          </p>
        </div>
      </section>

      {/* Interactive Search, Category Tabs & Mod Grid (matching reference site UX) */}
      <section className="space-y-5" aria-labelledby="home-catalog-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="home-catalog-heading" className="font-display text-2xl font-bold text-[#F3F1EC]">
              Browse Mods &amp; Addons
            </h2>
            <p className="text-sm text-[#A8A39A]">
              Search by mod name, Minecraft version, or filter by Java and Bedrock categories.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenCompare}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#34323A] bg-[#222127] px-3.5 py-1.5 text-xs font-semibold text-[#F3F1EC] hover:border-[#FF6A5F] hover:text-[#FF6A5F] transition-colors cursor-pointer"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Compare Mods{compareIds.length > 0 ? ` (${compareIds.length}/2)` : ''}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateModsFiltered('java-mods', 'Java')}
              className="text-xs font-semibold text-[#A8A39A] hover:text-[#FF6A5F] transition-colors cursor-pointer"
            >
              Java Catalog →
            </button>
            <span aria-hidden="true" className="text-[#34323A]">
              |
            </span>
            <button
              type="button"
              onClick={() => onNavigateModsFiltered('bedrock-addons', 'Bedrock')}
              className="text-xs font-semibold text-[#A8A39A] hover:text-[#FF6A5F] transition-colors cursor-pointer"
            >
              Bedrock Catalog →
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#A8A39A]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mods, Bedrock addons, Fabric 1.21.4, shaders..."
            aria-label="Search mods"
            className="w-full rounded-[18px] border-2 border-[#34323A] bg-[#1C1B20] py-3.5 pr-11 pl-12 text-[15.5px] text-[#F3F1EC] placeholder:text-[#6F6B63] focus:border-[#FF6A5F] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-3.5 -translate-y-1/2 rounded-full p-1 text-[#A8A39A] hover:text-[#F3F1EC] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category filter tabs */}
        <div
          className="flex gap-2.5 overflow-x-auto pb-2 thin-scroll"
          role="group"
          aria-label="Filter mods by category"
        >
          {[
            { id: 'all' as const, label: 'All' },
            ...CATEGORIES.map((c) => ({ id: c.id, label: c.name })),
            { id: 'saved' as const, label: 'Saved' },
          ].map((tab) => {
            const pressed = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-[14px] font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  pressed
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

        {/* Mod Grid */}
        {filteredMods.length === 0 ? (
          <div className="rounded-[24px] border-2 border-dashed border-[#34323A] bg-[#222127] px-6 py-12 text-center space-y-3">
            <p className="font-display text-lg font-bold text-[#F3F1EC]">
              {activeTab === 'saved' && !searchQuery
                ? 'No saved mods yet'
                : 'No matching mods found'}
            </p>
            <p className="text-sm text-[#A8A39A]">
              {activeTab === 'saved' && !searchQuery
                ? 'Click the bookmark icon on any mod card to save it here for quick access.'
                : 'Try clearing your search term or switching to another category.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="rounded-full bg-[#D93A30] px-5 py-2 text-sm font-semibold text-white hover:bg-[#FF6A5F] cursor-pointer"
            >
              Show All Mods
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMods.map((mod) => (
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
      </section>
    </div>
  );
}
