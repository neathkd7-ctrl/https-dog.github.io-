import { ArrowRight, Blocks, Layers, Package, Palette, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/mods';
import { MinecraftEdition, ModCategory, ModItem } from '../types/mod';
import { formatCompactNumber } from '../utils/download';

interface CategoriesPageProps {
  mods: ModItem[];
  onExploreCategory: (category: ModCategory, edition?: MinecraftEdition | 'All') => void;
  onExploreEdition: (edition: MinecraftEdition) => void;
}

const CATEGORY_ICONS: Record<ModCategory, typeof Blocks> = {
  'java-mods': Blocks,
  'bedrock-addons': Layers,
  'java-modpacks': Package,
  'texture-packs': Palette,
  shaders: Sparkles,
};

export function CategoriesPage({
  mods,
  onExploreCategory,
  onExploreEdition,
}: CategoriesPageProps) {
  const javaCount = mods.filter((m) => m.edition === 'Java' || m.edition === 'Both').length;
  const bedrockCount = mods.filter((m) => m.edition === 'Bedrock' || m.edition === 'Both').length;

  return (
    <div className="mx-auto max-w-[1160px] px-4 py-8 sm:px-6 sm:py-10 space-y-10">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold text-[#F3F1EC]">
          Mod &amp; Addon Categories
        </h1>
        <p className="max-w-2xl text-sm sm:text-base text-[#A8A39A]">
          Browse packages organized by Minecraft Java Edition, Minecraft Bedrock Edition, and
          cross-edition visual enhancements.
        </p>
      </div>

      {/* Java vs Bedrock Edition Split Banner */}
      <section className="grid gap-5 md:grid-cols-2" aria-label="Minecraft Edition tracks">
        <div className="flex flex-col justify-between gap-5 rounded-[22px] border-2 border-[#34323A] bg-[#222127] p-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#FF6A5F]">Desktop &amp; Custom Launchers</p>
            <h2 className="font-display text-2xl font-bold text-[#F3F1EC]">
              Minecraft Java Edition
            </h2>
            <p className="text-sm leading-relaxed text-[#A8A39A]">
              Full `.jar` mods and `.mrpack` modpacks built for Fabric, NeoForge, and Forge across
              versions 1.20.1 through 1.21.4.
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-[#34323A] pt-4">
            <span className="text-sm font-semibold text-[#F3F1EC] tabular-nums">
              {javaCount} Java-compatible packages
            </span>
            <button
              type="button"
              onClick={() => onExploreEdition('Java')}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#D93A30] px-4 py-2 text-xs font-semibold text-white hover:bg-[#FF6A5F] cursor-pointer"
            >
              <span>Filter Java</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-5 rounded-[22px] border-2 border-[#34323A] bg-[#222127] p-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#FF6A5F]">
              Windows, Mobile, Console &amp; Realms
            </p>
            <h2 className="font-display text-2xl font-bold text-[#F3F1EC]">
              Minecraft Bedrock Edition
            </h2>
            <p className="text-sm leading-relaxed text-[#A8A39A]">
              Native `.mcaddon` and `.mcpack` bundles using stable Bedrock Script APIs with one-tap
              import on Android, iOS, and Windows.
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-[#34323A] pt-4">
            <span className="text-sm font-semibold text-[#F3F1EC] tabular-nums">
              {bedrockCount} Bedrock-compatible packages
            </span>
            <button
              type="button"
              onClick={() => onExploreEdition('Bedrock')}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#D93A30] px-4 py-2 text-xs font-semibold text-white hover:bg-[#FF6A5F] cursor-pointer"
            >
              <span>Filter Bedrock</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* All 5 Categories Grid */}
      <section className="space-y-4" aria-labelledby="all-categories-heading">
        <h2 id="all-categories-heading" className="font-display text-xl font-bold text-[#F3F1EC]">
          Browse by Package Type
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.id];
            const matching = mods.filter((m) => m.category === category.id);
            const categoryDownloads = matching.reduce((sum, m) => sum + m.downloads, 0);

            return (
              <div
                key={category.id}
                className="flex flex-col justify-between gap-5 rounded-[22px] border-2 border-[#34323A] bg-[#222127] p-6 transition-colors hover:border-[#6F6B63]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-xl border border-[#34323A] bg-[#1C1B20]">
                      <Icon
                        className="h-5 w-5"
                        style={{ color: category.accentColor }}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="text-xs font-medium text-[#A8A39A] font-mono-num">
                      {category.formats}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-[#FF6A5F]">
                      {category.edition === 'Both'
                        ? 'Java & Bedrock'
                        : `${category.edition} Edition`}
                    </p>
                    <h3 className="mt-0.5 font-display text-xl font-bold text-[#F3F1EC]">
                      {category.name}
                    </h3>
                  </div>

                  <p className="text-sm leading-relaxed text-[#A8A39A]">{category.shortDesc}</p>
                </div>

                <div className="space-y-4 border-t border-[#34323A] pt-4">
                  <div className="flex items-center justify-between text-xs text-[#A8A39A] tabular-nums">
                    <span>{matching.length} packages</span>
                    <span>{formatCompactNumber(categoryDownloads)} downloads</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onExploreCategory(
                        category.id,
                        category.edition === 'Both' ? 'All' : category.edition
                      )
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#34323A] bg-[#1C1B20] px-4 py-2.5 text-sm font-semibold text-[#F3F1EC] transition-colors hover:border-[#FF6A5F] hover:text-[#FF6A5F] cursor-pointer"
                  >
                    <span>Explore {category.name}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
