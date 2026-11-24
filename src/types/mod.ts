export type PageRoute = 'home' | 'mods' | 'categories' | 'downloads' | 'about';

export type MinecraftEdition = 'Java' | 'Bedrock' | 'Both';

export type ModCategory =
  | 'java-mods'
  | 'java-modpacks'
  | 'bedrock-addons'
  | 'texture-packs'
  | 'shaders';

export type ModLoader =
  | 'Fabric'
  | 'Forge'
  | 'NeoForge'
  | 'Modpack'
  | 'Behavior & Resource'
  | 'Resource Pack'
  | 'Iris / OptiFine'
  | 'Bedrock Deferred';

export interface DownloadVariant {
  id: string;
  label: string;
  fileName: string;
  fileSize: string;
  mcVersion: string;
  loader: ModLoader;
  sha256: string;
}

export interface ModComment {
  id: string;
  author: string;
  text: string;
  createdAt: number;
}

export interface ModItem {
  id: string;
  title: string;
  author: string;
  edition: MinecraftEdition;
  category: ModCategory;
  categoryLabel: string;
  loader: ModLoader;
  mcVersion: string;
  fileSize: string;
  updatedAt: string;
  timestamp: number;
  summary: string;
  description: string;
  changelog: string[];
  coverImage: string;
  gallery: string[];
  accentTint: string;
  views: number;
  downloads: number;
  likes: number;
  dislikes: number;
  ratingSum: number;
  ratingCount: number;
  variants: DownloadVariant[];
  comments: ModComment[];
  featured?: boolean;
}

export interface CategoryInfo {
  id: ModCategory;
  name: string;
  edition: MinecraftEdition;
  shortDesc: string;
  formats: string;
  popularVersions: string;
  accentColor: string;
}

export interface DownloadRecord {
  id: string;
  modId: string;
  modTitle: string;
  variantLabel: string;
  fileName: string;
  fileSize: string;
  edition: MinecraftEdition;
  loader: ModLoader;
  mcVersion: string;
  sha256: string;
  downloadedAt: number;
  status: 'downloading' | 'completed';
  progress: number;
}

export interface UserVoteState {
  like?: 1 | -1;
  stars?: number;
}
