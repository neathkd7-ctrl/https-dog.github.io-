import { ModItem, PageRoute } from '../types/mod';

interface FooterProps {
  mods: ModItem[];
  onNavigate: (page: PageRoute) => void;
  onOpenMod: (modId: string) => void;
}

export function Footer({ mods, onNavigate, onOpenMod }: FooterProps) {
  return (
    <footer className="mt-12 border-t-2 border-[#34323A] bg-[#17161A] py-10">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 space-y-8">
        {/* Mod directory mirror (inspired by rarechicken0.github.io #seo-links) */}
        <div>
          <h2 className="font-display text-[15px] font-bold text-[#F3F1EC] mb-3">
            All Curated Mods
          </h2>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 text-[13.5px]">
            {mods.map((mod) => (
              <li key={mod.id}>
                <button
                  type="button"
                  onClick={() => onOpenMod(mod.id)}
                  className="text-left text-[#A8A39A] hover:text-[#F3F1EC] hover:underline transition-colors cursor-pointer"
                >
                  {mod.title}{' '}
                  <span className="text-[#6F6B63]">({mod.categoryLabel})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#34323A] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-display text-sm font-bold text-[#F3F1EC]">BlockForge</p>
            <p className="text-xs text-[#A8A39A] max-w-2xl">
              BlockForge is an independent community repository and is not affiliated with or
              endorsed by Mojang Studios or Microsoft. Minecraft is a trademark of Mojang Studios.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-[#A8A39A]">
            {(['home', 'mods', 'categories', 'downloads', 'about'] as PageRoute[]).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => onNavigate(page)}
                className="capitalize hover:text-[#F3F1EC] transition-colors cursor-pointer"
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
