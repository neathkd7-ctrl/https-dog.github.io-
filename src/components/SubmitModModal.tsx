import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../data/mods';
import { MinecraftEdition, ModCategory, ModItem, ModLoader } from '../types/mod';

interface SubmitModModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitMod: (newMod: ModItem) => void;
}

const COVER_CHOICES = [
  {
    label: 'Citadel Valley',
    path: '/src/assets/images/hero_voxel_citadel_1795562363732.jpg',
  },
  {
    label: 'Basalt Dungeon',
    path: '/src/assets/images/mod_ember_dungeons_1795562363590.jpg',
  },
  {
    label: 'Clockwork Airship',
    path: '/src/assets/images/mod_skyward_mechanisms_1795562363951.jpg',
  },
  {
    label: 'Aurora Alpine Lake',
    path: '/src/assets/images/mod_aurora_shaders_1795562363194.jpg',
  },
  {
    label: 'Crimson Mycelia Forest',
    path: '/src/assets/images/mod_crimson_biomes_1795562365666.jpg',
  },
  {
    label: 'Obsidian Smithy Forge',
    path: '/src/assets/images/mod_obsidian_arsenal_1795562365565.jpg',
  },
];

export function SubmitModModal({ isOpen, onClose, onSubmitMod }: SubmitModModalProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [edition, setEdition] = useState<MinecraftEdition>('Java');
  const [category, setCategory] = useState<ModCategory>('java-mods');
  const [loader, setLoader] = useState<ModLoader>('Fabric');
  const [mcVersion, setMcVersion] = useState('1.21.4');
  const [fileSize, setFileSize] = useState('8.5 MB');
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState(COVER_CHOICES[0].path);
  const [error, setError] = useState('');

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

  const handleCategoryChange = (cat: ModCategory) => {
    setCategory(cat);
    if (cat === 'bedrock-addons') {
      setEdition('Bedrock');
      setLoader('Behavior & Resource');
      setMcVersion('Bedrock 1.21.50+');
    } else if (cat === 'java-mods') {
      setEdition('Java');
      setLoader('Fabric');
      setMcVersion('1.21.4');
    } else if (cat === 'java-modpacks') {
      setEdition('Java');
      setLoader('Modpack');
      setMcVersion('1.21.1');
    } else if (cat === 'texture-packs') {
      setEdition('Both');
      setLoader('Resource Pack');
      setMcVersion('1.21.4 / Bedrock');
    } else if (cat === 'shaders') {
      setEdition('Both');
      setLoader('Iris / OptiFine');
      setMcVersion('1.21.4 / Deferred');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      setError('Please enter both a mod title and short description.');
      return;
    }

    const catInfo = CATEGORIES.find((c) => c.id === category);
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const id = `${slug || 'custom-mod'}-${Date.now().toString(36)}`;
    const ext =
      edition === 'Bedrock'
        ? '.mcaddon.json'
        : category === 'java-modpacks'
        ? '.mrpack.json'
        : '.jar.json';

    const created: ModItem = {
      id,
      title: title.trim(),
      author: author.trim() || 'Community Creator',
      edition,
      category,
      categoryLabel: catInfo?.name || 'Java Mods',
      loader,
      mcVersion: mcVersion.trim() || '1.21.4',
      fileSize: fileSize.trim() || '8.5 MB',
      updatedAt: 'Just now',
      timestamp: Date.now(),
      summary: summary.trim(),
      description: summary.trim(),
      changelog: ['v1.0.0 — Published to BlockForge community catalog.'],
      coverImage,
      gallery: [coverImage],
      accentTint: '#252429',
      views: 1,
      downloads: 0,
      likes: 1,
      dislikes: 0,
      ratingSum: 5,
      ratingCount: 1,
      variants: [
        {
          id: `${id}-main`,
          label: `${loader} ${mcVersion.trim() || '1.21.4'}`,
          fileName: `${slug || 'community-mod'}-1.0.0${ext}`,
          fileSize: fileSize.trim() || '8.5 MB',
          mcVersion: mcVersion.trim() || '1.21.4',
          loader,
          sha256: Math.random().toString(16).slice(2, 18) + 'a9c4d1f2e0b3',
        },
      ],
      comments: [],
    };

    onSubmitMod(created);
    setTitle('');
    setAuthor('');
    setSummary('');
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-3 sm:p-6 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-mod-title"
    >
      <div
        className="mx-auto max-w-[640px] overflow-hidden rounded-[24px] border-2 border-[#34323A] bg-[#17161A] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-[#34323A] px-5 py-4">
          <h2 id="submit-mod-title" className="font-display text-lg font-bold text-[#F3F1EC]">
            Submit a Minecraft Mod
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#34323A] bg-[#222127] text-[#F3F1EC] hover:border-[#6F6B63] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="mod-title" className="block text-[13px] font-semibold text-[#F3F1EC]">
                Mod Name
              </label>
              <input
                id="mod-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Copper Redstone Relay"
                className="w-full rounded-xl border-2 border-[#34323A] bg-[#1C1B20] px-3.5 py-2.5 text-[14px] text-[#F3F1EC] focus:border-[#FF6A5F] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="mod-author" className="block text-[13px] font-semibold text-[#F3F1EC]">
                Author / Studio
              </label>
              <input
                id="mod-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. VoxelCraft"
                className="w-full rounded-xl border-2 border-[#34323A] bg-[#1C1B20] px-3.5 py-2.5 text-[14px] text-[#F3F1EC] focus:border-[#FF6A5F] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label htmlFor="mod-category" className="block text-[13px] font-semibold text-[#F3F1EC]">
                Category
              </label>
              <select
                id="mod-category"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ModCategory)}
                className="w-full rounded-xl border-2 border-[#34323A] bg-[#1C1B20] px-3 py-2.5 text-[14px] text-[#F3F1EC] focus:border-[#FF6A5F] focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="mod-edition" className="block text-[13px] font-semibold text-[#F3F1EC]">
                Edition
              </label>
              <select
                id="mod-edition"
                value={edition}
                onChange={(e) => setEdition(e.target.value as MinecraftEdition)}
                className="w-full rounded-xl border-2 border-[#34323A] bg-[#1C1B20] px-3 py-2.5 text-[14px] text-[#F3F1EC] focus:border-[#FF6A5F] focus:outline-none"
              >
                <option value="Java">Java Edition</option>
                <option value="Bedrock">Bedrock Edition</option>
                <option value="Both">Java &amp; Bedrock</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="mod-version" className="block text-[13px] font-semibold text-[#F3F1EC]">
                MC Version
              </label>
              <input
                id="mod-version"
                type="text"
                value={mcVersion}
                onChange={(e) => setMcVersion(e.target.value)}
                className="w-full rounded-xl border-2 border-[#34323A] bg-[#1C1B20] px-3.5 py-2.5 text-[14px] text-[#F3F1EC] focus:border-[#FF6A5F] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="mod-loader" className="block text-[13px] font-semibold text-[#F3F1EC]">
                Mod Loader / Format
              </label>
              <select
                id="mod-loader"
                value={loader}
                onChange={(e) => setLoader(e.target.value as ModLoader)}
                className="w-full rounded-xl border-2 border-[#34323A] bg-[#1C1B20] px-3 py-2.5 text-[14px] text-[#F3F1EC] focus:border-[#FF6A5F] focus:outline-none"
              >
                <option value="Fabric">Fabric</option>
                <option value="NeoForge">NeoForge</option>
                <option value="Forge">Forge</option>
                <option value="Modpack">Modpack (.mrpack)</option>
                <option value="Behavior & Resource">Behavior &amp; Resource (.mcaddon)</option>
                <option value="Resource Pack">Resource Pack</option>
                <option value="Iris / OptiFine">Iris / OptiFine</option>
                <option value="Bedrock Deferred">Bedrock Deferred</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="mod-size" className="block text-[13px] font-semibold text-[#F3F1EC]">
                Package Size
              </label>
              <input
                id="mod-size"
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="w-full rounded-xl border-2 border-[#34323A] bg-[#1C1B20] px-3.5 py-2.5 text-[14px] text-[#F3F1EC] focus:border-[#FF6A5F] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="mod-cover" className="block text-[13px] font-semibold text-[#F3F1EC]">
              Showcase Cover Artwork
            </label>
            <select
              id="mod-cover"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full rounded-xl border-2 border-[#34323A] bg-[#1C1B20] px-3 py-2.5 text-[14px] text-[#F3F1EC] focus:border-[#FF6A5F] focus:outline-none"
            >
              {COVER_CHOICES.map((c) => (
                <option key={c.path} value={c.path}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="mod-summary" className="block text-[13px] font-semibold text-[#F3F1EC]">
              Description
            </label>
            <textarea
              id="mod-summary"
              rows={3}
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                if (error) setError('');
              }}
              placeholder="Describe what blocks, mobs, mechanics, or visual upgrades your mod adds..."
              className="w-full rounded-xl border-2 border-[#34323A] bg-[#1C1B20] px-3.5 py-2.5 text-[14px] text-[#F3F1EC] focus:border-[#FF6A5F] focus:outline-none"
            />
          </div>

          {error && <p className="text-xs font-medium text-[#FF6A5F]">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border-2 border-[#34323A] bg-[#222127] px-5 py-2.5 text-[14px] font-semibold text-[#F3F1EC] hover:border-[#6F6B63] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#D93A30] px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-[#FF6A5F] cursor-pointer"
            >
              Publish Mod
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
