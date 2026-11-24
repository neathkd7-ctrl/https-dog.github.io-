import { ArrowLeftRight, Bookmark, Download, Eye, Star, ThumbsUp } from 'lucide-react';
import { ModItem } from '../types/mod';
import { formatCompactNumber, getAverageRating } from '../utils/download';
import { ModImage } from './ModImage';

interface ModCardProps {
  mod: ModItem;
  isSaved: boolean;
  isCompared: boolean;
  onOpenDetail: (modId: string) => void;
  onToggleSave: (modId: string) => void;
  onToggleCompare: (modId: string) => void;
  onDownload: (mod: ModItem) => void;
}

export function ModCard({
  mod,
  isSaved,
  isCompared,
  onOpenDetail,
  onToggleSave,
  onToggleCompare,
  onDownload,
}: ModCardProps) {
  const avg = getAverageRating(mod);

  return (
    <article
      onClick={() => onOpenDetail(mod.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetail(mod.id);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${mod.title}`}
      className="group flex flex-col overflow-hidden rounded-[20px] border-2 border-[#34323A] bg-[#222127] text-left transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-[#6F6B63] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A5F] cursor-pointer"
    >
      {/* Cover artwork */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#2B2A31]">
        <ModImage
          src={mod.coverImage}
          alt={`${mod.title} showcase artwork`}
          title={mod.title}
          accentTint={mod.accentTint}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent"
        />
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(mod.id);
            }}
            aria-pressed={isCompared}
            aria-label={
              isCompared ? `Remove ${mod.title} from comparison` : `Compare ${mod.title}`
            }
            title={isCompared ? 'Selected for comparison' : 'Add to comparison'}
            className={`grid h-10 w-10 place-items-center rounded-full border transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A5F] ${
              isCompared
                ? 'border-[#FF6A5F] bg-[#FF6A5F] text-[#17161A]'
                : 'border-[#34323A] bg-[#17161A]/85 text-[#F3F1EC] hover:border-[#A8A39A]'
            }`}
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(mod.id);
            }}
            aria-pressed={isSaved}
            aria-label={isSaved ? `Remove ${mod.title} from saved` : `Save ${mod.title}`}
            className={`grid h-10 w-10 place-items-center rounded-full border transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A5F] ${
              isSaved
                ? 'border-[#D93A30] bg-[#D93A30] text-white'
                : 'border-[#34323A] bg-[#17161A]/85 text-[#F3F1EC] hover:border-[#A8A39A]'
            }`}
          >
            <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Card content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Clean unboxed metadata with typographic separators */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12.5px] font-medium text-[#A8A39A]">
          <span className="text-[#FF6A5F] font-semibold">
            {mod.edition === 'Both' ? 'Java & Bedrock' : `${mod.edition} Edition`}
          </span>
          <span aria-hidden="true">·</span>
          <span>{mod.categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num">{mod.mcVersion}</span>
        </div>

        <h3 className="font-display text-[19px] font-bold leading-snug text-[#F3F1EC] transition-colors group-hover:text-white">
          {mod.title}
        </h3>

        <p className="line-clamp-2 text-[14px] leading-relaxed text-[#A8A39A]">
          {mod.summary}
        </p>

        {/* Bottom stats + direct Download CTA */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2 border-t border-[#34323A]/70">
          <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-[#A8A39A] tabular-nums">
            <span className="inline-flex items-center gap-1" title="Views">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              {formatCompactNumber(mod.views)}
            </span>
            <span className="inline-flex items-center gap-1" title="Downloads">
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              {formatCompactNumber(mod.downloads)}
            </span>
            <span className="inline-flex items-center gap-1" title="Likes">
              <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
              {formatCompactNumber(mod.likes)}
            </span>
            <span className="inline-flex items-center gap-1 text-[#F5A623]" title="Average rating">
              <Star className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true" />
              <span className="font-semibold text-[#F3F1EC]">
                {avg > 0 ? avg.toFixed(1) : '–'}
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(mod);
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#D93A30] px-3.5 py-2 text-[13px] font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#FF6A5F] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A5F] cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </article>
  );
}
