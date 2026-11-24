import { useEffect } from 'react';
import {
  ArrowLeftRight,
  Check,
  Download,
  ExternalLink,
  Star,
  X,
} from 'lucide-react';
import { ModItem } from '../types/mod';
import { formatCompactNumber, getAverageRating } from '../utils/download';
import { ModImage } from './ModImage';

interface CompareModalProps {
  isOpen: boolean;
  mods: ModItem[];
  leftModId: string;
  rightModId: string;
  onSelectLeft: (id: string) => void;
  onSelectRight: (id: string) => void;
  onSwap: () => void;
  onClose: () => void;
  onDownload: (mod: ModItem) => void;
  onOpenDetail: (modId: string) => void;
}

interface StatRowConfig {
  label: string;
  leftValue: number;
  rightValue: number;
  leftDisplay: string;
  rightDisplay: string;
  higherIsBetter?: boolean;
}

function parseSizeMb(sizeStr: string): number {
  const match = sizeStr.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

export function CompareModal({
  isOpen,
  mods,
  leftModId,
  rightModId,
  onSelectLeft,
  onSelectRight,
  onSwap,
  onClose,
  onDownload,
  onOpenDetail,
}: CompareModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const leftMod = mods.find((m) => m.id === leftModId) || mods[0];
  const rightMod = mods.find((m) => m.id === rightModId) || mods[1] || mods[0];

  if (!leftMod || !rightMod) return null;

  const leftAvg = getAverageRating(leftMod);
  const rightAvg = getAverageRating(rightMod);

  const leftApproval =
    leftMod.likes + leftMod.dislikes > 0
      ? Math.round((leftMod.likes / (leftMod.likes + leftMod.dislikes)) * 100)
      : 100;
  const rightApproval =
    rightMod.likes + rightMod.dislikes > 0
      ? Math.round((rightMod.likes / (rightMod.likes + rightMod.dislikes)) * 100)
      : 100;

  const leftSizeMb = parseSizeMb(leftMod.fileSize);
  const rightSizeMb = parseSizeMb(rightMod.fileSize);

  const statRows: StatRowConfig[] = [
    {
      label: 'Total Downloads',
      leftValue: leftMod.downloads,
      rightValue: rightMod.downloads,
      leftDisplay: formatCompactNumber(leftMod.downloads),
      rightDisplay: formatCompactNumber(rightMod.downloads),
      higherIsBetter: true,
    },
    {
      label: 'Average Rating',
      leftValue: leftAvg,
      rightValue: rightAvg,
      leftDisplay: leftAvg > 0 ? `${leftAvg.toFixed(2)} / 5` : '–',
      rightDisplay: rightAvg > 0 ? `${rightAvg.toFixed(2)} / 5` : '–',
      higherIsBetter: true,
    },
    {
      label: 'Community Views',
      leftValue: leftMod.views,
      rightValue: rightMod.views,
      leftDisplay: formatCompactNumber(leftMod.views),
      rightDisplay: formatCompactNumber(rightMod.views),
      higherIsBetter: true,
    },
    {
      label: 'Likes',
      leftValue: leftMod.likes,
      rightValue: rightMod.likes,
      leftDisplay: `${formatCompactNumber(leftMod.likes)} (${leftApproval}%)`,
      rightDisplay: `${formatCompactNumber(rightMod.likes)} (${rightApproval}%)`,
      higherIsBetter: true,
    },
    {
      label: 'Package Footprint',
      leftValue: leftSizeMb,
      rightValue: rightSizeMb,
      leftDisplay: leftMod.fileSize,
      rightDisplay: rightMod.fileSize,
      higherIsBetter: false,
    },
  ];

  const versionRows: { label: string; left: string; right: string }[] = [
    {
      label: 'Minecraft Edition',
      left: leftMod.edition === 'Both' ? 'Java & Bedrock' : `${leftMod.edition} Edition`,
      right: rightMod.edition === 'Both' ? 'Java & Bedrock' : `${rightMod.edition} Edition`,
    },
    {
      label: 'Category',
      left: leftMod.categoryLabel,
      right: rightMod.categoryLabel,
    },
    {
      label: 'Primary Loader / Format',
      left: leftMod.loader,
      right: rightMod.loader,
    },
    {
      label: 'Target Version',
      left: leftMod.mcVersion,
      right: rightMod.mcVersion,
    },
    {
      label: 'Last Updated',
      left: leftMod.updatedAt,
      right: rightMod.updatedAt,
    },
    {
      label: 'Author',
      left: leftMod.author,
      right: rightMod.author,
    },
  ];

  const sameModSelected = leftMod.id === rightMod.id;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 p-3 sm:p-6 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
    >
      <div
        className="mx-auto max-w-[980px] overflow-hidden rounded-[24px] border-2 border-[#34323A] bg-[#17161A] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 border-b-2 border-[#34323A] px-5 py-4">
          <div>
            <h2 id="compare-modal-title" className="font-display text-lg font-bold text-[#F3F1EC]">
              Side-by-Side Mod Comparison
            </h2>
            <p className="text-xs text-[#A8A39A]">
              Compare stats, supported Minecraft versions, loaders, and package features.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onSwap}
              aria-label="Swap compared mods"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#34323A] bg-[#222127] px-3.5 py-2 text-xs font-semibold text-[#F3F1EC] hover:border-[#6F6B63] cursor-pointer"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Swap</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close comparison modal"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#34323A] bg-[#222127] text-[#F3F1EC] hover:border-[#6F6B63] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-7 p-5 sm:p-6">
          {/* Mod Selectors + Side-by-Side Hero Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { side: 'Mod A', mod: leftMod, selectedId: leftMod.id, onChange: onSelectLeft },
              { side: 'Mod B', mod: rightMod, selectedId: rightMod.id, onChange: onSelectRight },
            ].map((slot) => (
              <div
                key={slot.side}
                className="flex flex-col gap-3 rounded-[20px] border-2 border-[#34323A] bg-[#222127] p-4"
              >
                <div className="space-y-1">
                  <label
                    htmlFor={`compare-select-${slot.side}`}
                    className="block text-[11.5px] font-semibold text-[#FF6A5F]"
                  >
                    {slot.side}
                  </label>
                  <select
                    id={`compare-select-${slot.side}`}
                    value={slot.selectedId}
                    onChange={(e) => slot.onChange(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#34323A] bg-[#1C1B20] px-3 py-2 text-sm font-semibold text-[#F3F1EC] focus:border-[#FF6A5F] focus:outline-none"
                  >
                    {mods.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title} ({m.edition} · {m.mcVersion})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#2B2A31]">
                  <ModImage
                    src={slot.mod.coverImage}
                    alt={slot.mod.title}
                    title={slot.mod.title}
                    accentTint={slot.mod.accentTint}
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-[#F3F1EC] leading-snug">
                    {slot.mod.title}
                  </h3>
                  <p className="text-xs text-[#A8A39A] line-clamp-2">{slot.mod.summary}</p>
                </div>

                <div className="mt-auto flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onDownload(slot.mod)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#D93A30] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#FF6A5F] cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Download</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenDetail(slot.mod.id);
                    }}
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-[#34323A] bg-[#1C1B20] px-3.5 py-2 text-xs font-semibold text-[#F3F1EC] hover:border-[#6F6B63] cursor-pointer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {sameModSelected && (
            <p className="rounded-xl border border-[#34323A] bg-[#222127] px-4 py-2.5 text-xs text-[#A8A39A]">
              Both slots currently point to the same package. Pick a different mod in Mod A or Mod B
              to visualize differences.
            </p>
          )}

          {/* Visual Stats Comparison */}
          <section aria-labelledby="compare-stats-heading" className="space-y-3">
            <h3
              id="compare-stats-heading"
              className="font-display text-[15px] font-bold text-[#F3F1EC]"
            >
              Metrics &amp; Popularity Comparison
            </h3>

            <div className="divide-y divide-[#34323A] rounded-[20px] border-2 border-[#34323A] bg-[#222127]">
              {statRows.map((row) => {
                const maxVal = Math.max(row.leftValue, row.rightValue, 0.0001);
                const leftPct = Math.round((row.leftValue / maxVal) * 100);
                const rightPct = Math.round((row.rightValue / maxVal) * 100);

                const leftWins =
                  !sameModSelected &&
                  (row.higherIsBetter
                    ? row.leftValue > row.rightValue
                    : row.leftValue > 0 && row.leftValue < row.rightValue);
                const rightWins =
                  !sameModSelected &&
                  (row.higherIsBetter
                    ? row.rightValue > row.leftValue
                    : row.rightValue > 0 && row.rightValue < row.leftValue);

                return (
                  <div key={row.label} className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#A8A39A]">
                      <span>{row.label}</span>
                      {!row.higherIsBetter && (
                        <span className="text-[11px] text-[#6F6B63]">Smaller is lighter</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-center">
                      {/* Left bar & value */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-sm tabular-nums">
                          <span
                            className={`font-mono-num font-semibold ${
                              leftWins ? 'text-[#69B578]' : 'text-[#F3F1EC]'
                            }`}
                          >
                            {row.leftDisplay}
                          </span>
                          {leftWins && (
                            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#69B578]">
                              <Check className="h-3 w-3" aria-hidden="true" />
                              {row.higherIsBetter ? 'Higher' : 'Lighter'}
                            </span>
                          )}
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#17161A]">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              leftWins ? 'bg-[#69B578]' : 'bg-[#FF6A5F]'
                            }`}
                            style={{ width: `${leftPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Right bar & value */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-sm tabular-nums">
                          <span
                            className={`font-mono-num font-semibold ${
                              rightWins ? 'text-[#69B578]' : 'text-[#F3F1EC]'
                            }`}
                          >
                            {row.rightDisplay}
                          </span>
                          {rightWins && (
                            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#69B578]">
                              <Check className="h-3 w-3" aria-hidden="true" />
                              {row.higherIsBetter ? 'Higher' : 'Lighter'}
                            </span>
                          )}
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#17161A]">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              rightWins ? 'bg-[#69B578]' : 'bg-[#7FA7E8]'
                            }`}
                            style={{ width: `${rightPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Versions & Compatibility Diff Table */}
          <section aria-labelledby="compare-versions-heading" className="space-y-3">
            <h3
              id="compare-versions-heading"
              className="font-display text-[15px] font-bold text-[#F3F1EC]"
            >
              Versions, Edition &amp; Compatibility
            </h3>

            <div className="overflow-hidden rounded-[20px] border-2 border-[#34323A] bg-[#222127]">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#34323A] text-xs font-semibold text-[#A8A39A]">
                    <th className="w-1/3 px-4 py-3">Specification</th>
                    <th className="w-1/3 px-4 py-3 text-[#F3F1EC]">{leftMod.title}</th>
                    <th className="w-1/3 px-4 py-3 text-[#F3F1EC]">{rightMod.title}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#34323A]">
                  {versionRows.map((row) => {
                    const differs = !sameModSelected && row.left !== row.right;
                    return (
                      <tr key={row.label}>
                        <td className="px-4 py-3 text-xs font-medium text-[#A8A39A]">
                          {row.label}
                          {differs && (
                            <span className="ml-2 text-[11px] font-semibold text-[#FF6A5F]">
                              Differs
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-[#F3F1EC]">{row.left}</td>
                        <td className="px-4 py-3 font-medium text-[#F3F1EC]">{row.right}</td>
                      </tr>
                    );
                  })}

                  <tr>
                    <td className="px-4 py-3 text-xs font-medium text-[#A8A39A]">
                      Available Builds
                    </td>
                    <td className="px-4 py-3 text-xs text-[#F3F1EC] space-y-1">
                      {leftMod.variants.map((v) => (
                        <div key={v.id} className="font-mono-num">
                          {v.label} · {v.fileSize}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#F3F1EC] space-y-1">
                      {rightMod.variants.map((v) => (
                        <div key={v.id} className="font-mono-num">
                          {v.label} · {v.fileSize}
                        </div>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Features & Changelog Side-by-Side */}
          <section aria-labelledby="compare-features-heading" className="space-y-3">
            <h3
              id="compare-features-heading"
              className="font-display text-[15px] font-bold text-[#F3F1EC]"
            >
              Overview &amp; Recent Release Highlights
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[leftMod, rightMod].map((mod, idx) => (
                <div
                  key={`${mod.id}-${idx}`}
                  className="rounded-[20px] border-2 border-[#34323A] bg-[#222127] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-display text-sm font-bold text-[#F3F1EC]">{mod.title}</h4>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#F5A623] tabular-nums">
                      <Star className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true" />
                      {getAverageRating(mod) > 0 ? getAverageRating(mod).toFixed(1) : '–'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#A8A39A]">{mod.description}</p>
                  {mod.changelog.length > 0 && (
                    <div className="border-t border-[#34323A] pt-2.5 space-y-1">
                      <p className="text-[11px] font-semibold text-[#FF6A5F]">Latest Changelog</p>
                      <ul className="space-y-1 text-xs text-[#A8A39A]">
                        {mod.changelog.slice(0, 2).map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
