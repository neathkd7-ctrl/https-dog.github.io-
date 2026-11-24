import { useState } from 'react';
import { CheckCircle2, Download, FileArchive, Trash2 } from 'lucide-react';
import { DownloadRecord, ModItem, PageRoute } from '../types/mod';
import { formatRelativeTime } from '../utils/download';

interface DownloadsPageProps {
  downloads: DownloadRecord[];
  mods: ModItem[];
  onRedownload: (record: DownloadRecord) => void;
  onDownloadMod: (mod: ModItem) => void;
  onClearHistory: () => void;
  onNavigate: (page: PageRoute) => void;
  onOpenDetail: (modId: string) => void;
}

type GuideTab = 'java-mods' | 'java-modpacks' | 'bedrock' | 'shaders';

const INSTALL_GUIDES: Record<
  GuideTab,
  { title: string; format: string; steps: string[] }
> = {
  'java-mods': {
    title: 'Installing Java Mods (Fabric / NeoForge / Forge)',
    format: '.jar package',
    steps: [
      'Install the matching mod loader (Fabric Loader or NeoForge) for your exact Minecraft version.',
      'Open your .minecraft folder (or launcher instance directory) and locate the mods/ folder.',
      'Drop the downloaded .jar file directly into mods/ without unzipping it.',
      'Launch the loader profile and confirm the mod appears in your in-game Mods list.',
    ],
  },
  'java-modpacks': {
    title: 'Installing Modpacks (.mrpack / .zip)',
    format: '.mrpack / .zip',
    steps: [
      'Open Prism Launcher or the Modrinth App and click Add Instance → Import from file.',
      'Select the downloaded .mrpack bundle and wait for dependency libraries to verify.',
      'Allocate 4 GB to 6 GB of RAM in instance settings for optimal frame pacing.',
      'Launch the instance directly; shader and optimization configs are pre-applied.',
    ],
  },
  bedrock: {
    title: 'Installing Bedrock Addons (.mcaddon / .mcpack)',
    format: '.mcaddon / .mcpack',
    steps: [
      'On Windows, Android, or iOS, tap or double-click the downloaded .mcaddon file to open Minecraft.',
      'Wait for the top banner notification confirming Behavior Pack and Resource Pack import.',
      'Edit your world settings and activate both the Resource Pack and Behavior Pack tabs.',
      'Note: Modern BlockForge addons use stable Script APIs with no experimental toggles needed.',
    ],
  },
  shaders: {
    title: 'Installing Shaders (Iris & Bedrock Deferred)',
    format: '.zip / .mcpack',
    steps: [
      'For Java Edition, install Sodium + Iris Shaders, then place the shader .zip in .minecraft/shaderpacks/.',
      'Open Video Settings → Shader Packs in-game and select Aurora Solstice.',
      'For Bedrock Edition, import the .mcpack and enable Deferred Technical Preview in Video Settings.',
    ],
  },
};

export function DownloadsPage({
  downloads,
  mods,
  onRedownload,
  onDownloadMod,
  onClearHistory,
  onNavigate,
  onOpenDetail,
}: DownloadsPageProps) {
  const [guideTab, setGuideTab] = useState<GuideTab>('java-mods');
  const topReleases = [...mods].sort((a, b) => b.downloads - a.downloads).slice(0, 4);

  return (
    <div className="mx-auto max-w-[1160px] px-4 py-8 sm:px-6 sm:py-10 space-y-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#F3F1EC]">Download Center</h1>
          <p className="mt-1 text-sm text-[#A8A39A]">
            Track downloaded Java &amp; Bedrock packages, inspect SHA-256 hashes, and view install steps.
          </p>
        </div>

        {downloads.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#34323A] bg-[#222127] px-4 py-2 text-xs font-semibold text-[#A8A39A] hover:border-[#6F6B63] hover:text-[#F3F1EC] self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Active / Recent Download Queue */}
      <section aria-labelledby="download-history-heading" className="space-y-4">
        <h2
          id="download-history-heading"
          className="font-display text-xl font-bold text-[#F3F1EC]"
        >
          Your Download History ({downloads.length})
        </h2>

        {downloads.length === 0 ? (
          <div className="rounded-[22px] border-2 border-dashed border-[#34323A] bg-[#222127] px-6 py-10 text-center space-y-3">
            <p className="font-display text-lg font-bold text-[#F3F1EC]">
              No packages downloaded in this session yet
            </p>
            <p className="mx-auto max-w-md text-sm text-[#A8A39A]">
              Click Download on any mod below or in the catalog to fetch its manifest package and
              track it here.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('mods')}
              className="rounded-full bg-[#D93A30] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#FF6A5F] cursor-pointer"
            >
              Browse Mods Catalog
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {downloads.map((rec) => (
              <div
                key={rec.id}
                className="flex flex-col gap-4 rounded-[20px] border-2 border-[#34323A] bg-[#222127] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#34323A] bg-[#1C1B20] text-[#FF6A5F]">
                    <FileArchive className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenDetail(rec.modId)}
                        className="font-display text-base font-bold text-[#F3F1EC] hover:text-[#FF6A5F] text-left cursor-pointer"
                      >
                        {rec.modTitle}
                      </button>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#69B578]">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{rec.status === 'completed' ? 'Saved' : 'Downloading'}</span>
                      </span>
                    </div>
                    <p className="text-xs text-[#A8A39A] font-mono-num">
                      {rec.variantLabel} · {rec.fileSize} · {formatRelativeTime(rec.downloadedAt)}
                    </p>
                    <p className="truncate text-[11.5px] text-[#6F6B63] font-mono-num">
                      SHA-256: {rec.sha256}
                    </p>
                    {rec.status === 'downloading' && (
                      <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-[#1C1B20]">
                        <div
                          className="h-full bg-[#FF6A5F] transition-all duration-200"
                          style={{ width: `${rec.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRedownload(rec)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-[#34323A] bg-[#1C1B20] px-4 py-2 text-xs font-semibold text-[#F3F1EC] whitespace-nowrap shrink-0 hover:border-[#FF6A5F] hover:text-[#FF6A5F] cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Re-download</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Direct Verified Releases */}
      <section aria-labelledby="direct-releases-heading" className="space-y-4">
        <h2
          id="direct-releases-heading"
          className="font-display text-xl font-bold text-[#F3F1EC]"
        >
          Popular Verified Releases
        </h2>

        <div className="overflow-x-auto rounded-[20px] border-2 border-[#34323A] bg-[#222127]">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#34323A] text-xs font-semibold text-[#A8A39A]">
                <th className="px-5 py-3.5">Package</th>
                <th className="px-4 py-3.5">Edition</th>
                <th className="px-4 py-3.5">Loader / Format</th>
                <th className="px-4 py-3.5">Version</th>
                <th className="px-4 py-3.5">Size</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#34323A]">
              {topReleases.map((mod) => (
                <tr key={mod.id} className="hover:bg-[#2B2A31]/45 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-[#F3F1EC]">
                    <button
                      type="button"
                      onClick={() => onOpenDetail(mod.id)}
                      className="hover:text-[#FF6A5F] text-left cursor-pointer"
                    >
                      {mod.title}
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-[#A8A39A]">{mod.edition}</td>
                  <td className="px-4 py-3.5 text-[#A8A39A]">{mod.loader}</td>
                  <td className="px-4 py-3.5 font-mono-num text-[#F3F1EC]">{mod.mcVersion}</td>
                  <td className="px-4 py-3.5 font-mono-num text-[#A8A39A]">{mod.fileSize}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => onDownloadMod(mod)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#D93A30] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#FF6A5F] cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Install Guides */}
      <section aria-labelledby="install-guides-heading" className="space-y-4">
        <h2 id="install-guides-heading" className="font-display text-xl font-bold text-[#F3F1EC]">
          Installation Guides
        </h2>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Installation guide tabs">
          {(
            [
              { id: 'java-mods', label: 'Java Mods (.jar)' },
              { id: 'java-modpacks', label: 'Modpacks (.mrpack)' },
              { id: 'bedrock', label: 'Bedrock (.mcaddon)' },
              { id: 'shaders', label: 'Shaders' },
            ] as { id: GuideTab; label: string }[]
          ).map((t) => {
            const active = guideTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setGuideTab(t.id)}
                className={`rounded-full border-2 px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'border-[#D93A30] bg-[#D93A30] text-white'
                    : 'border-[#34323A] bg-[#222127] text-[#F3F1EC] hover:border-[#6F6B63]'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-[22px] border-2 border-[#34323A] bg-[#222127] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-[#F3F1EC]">
              {INSTALL_GUIDES[guideTab].title}
            </h3>
            <span className="font-mono-num text-xs text-[#FF6A5F]">
              {INSTALL_GUIDES[guideTab].format}
            </span>
          </div>

          <ol className="space-y-2.5 text-sm text-[#A8A39A]">
            {INSTALL_GUIDES[guideTab].steps.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="font-mono-num font-bold text-[#FF6A5F]">
                  0{idx + 1}.
                </span>
                <span className="text-[#F3F1EC]/90">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
