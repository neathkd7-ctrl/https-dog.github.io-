import { DownloadVariant, ModItem } from '../types/mod';

export function formatCompactNumber(value: number): string {
  const n = Math.max(0, value || 0);
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return String(n);
}

export function formatRelativeTime(timestamp: number): string {
  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSeconds < 60) return 'Just now';
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  if (diffSeconds < 2592000) return `${Math.floor(diffSeconds / 86400)}d ago`;
  return `${Math.floor(diffSeconds / 2592000)}mo ago`;
}

export function getAverageRating(mod: ModItem): number {
  if (!mod.ratingCount) return 0;
  return mod.ratingSum / mod.ratingCount;
}

export function triggerPackageFileDownload(mod: ModItem, variant: DownloadVariant): void {
  const manifest = {
    source: 'BlockForge Mod Repository',
    modId: mod.id,
    title: mod.title,
    author: mod.author,
    edition: mod.edition,
    category: mod.categoryLabel,
    loader: variant.loader,
    minecraftVersion: variant.mcVersion,
    packageLabel: variant.label,
    estimatedSize: variant.fileSize,
    sha256: variant.sha256,
    exportedAt: new Date().toISOString(),
    installNotes:
      mod.edition === 'Bedrock'
        ? 'Double-click the .mcaddon / .mcpack file or open with Minecraft Bedrock Edition to import automatically.'
        : 'Place the .jar inside your .minecraft/mods folder (or import the .mrpack in Modrinth / Prism Launcher).',
  };

  const blob = new Blob([JSON.stringify(manifest, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = variant.fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
