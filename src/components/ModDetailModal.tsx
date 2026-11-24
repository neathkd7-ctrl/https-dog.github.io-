import { useEffect, useState } from 'react';
import {
  ArrowLeftRight,
  Bookmark,
  Download,
  Eye,
  Send,
  Star,
  ThumbsDown,
  ThumbsUp,
  X,
} from 'lucide-react';
import { DownloadVariant, ModItem, UserVoteState } from '../types/mod';
import {
  formatCompactNumber,
  formatRelativeTime,
  getAverageRating,
} from '../utils/download';
import { ModImage } from './ModImage';

interface ModDetailModalProps {
  mod: ModItem | null;
  isSaved: boolean;
  isCompared: boolean;
  userVote: UserVoteState;
  onClose: () => void;
  onToggleSave: (modId: string) => void;
  onToggleCompare: (modId: string) => void;
  onDownloadVariant: (mod: ModItem, variant: DownloadVariant) => void;
  onVoteLike: (modId: string, value: 1 | -1) => void;
  onVoteStar: (modId: string, stars: number) => void;
  onAddComment: (modId: string, author: string, text: string) => void;
}

export function ModDetailModal({
  mod,
  isSaved,
  isCompared,
  userVote,
  onClose,
  onToggleSave,
  onToggleCompare,
  onDownloadVariant,
  onVoteLike,
  onVoteStar,
  onAddComment,
}: ModDetailModalProps) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    setGalleryIndex(0);
    setCommentError('');
  }, [mod?.id]);

  useEffect(() => {
    if (!mod) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [mod, onClose]);

  if (!mod) return null;

  const images = mod.gallery.length > 0 ? mod.gallery : [mod.coverImage];
  const activeImg = images[galleryIndex] || mod.coverImage;
  const avg = getAverageRating(mod);
  const activeStars = userVote.stars ?? Math.round(avg);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) {
      setCommentError('Please write a short comment before posting.');
      return;
    }
    const authorName = commentAuthor.trim() || 'Community Player';
    onAddComment(mod.id, authorName, trimmed);
    setCommentText('');
    setCommentError('');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-3 sm:p-6 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mod-detail-title"
    >
      <div
        className="mx-auto max-w-[860px] overflow-hidden rounded-[24px] border-2 border-[#34323A] bg-[#17161A] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b-2 border-[#34323A] bg-[#17161A] px-5 py-3.5">
          <span className="font-display text-[15px] font-bold tracking-tight text-[#F3F1EC]">
            BlockForge · {mod.categoryLabel}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close mod details"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#34323A] bg-[#222127] text-[#F3F1EC] transition-colors hover:border-[#6F6B63] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A5F]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 16:9 Gallery */}
        <div className="aspect-video w-full bg-[#2B2A31]">
          <ModImage
            src={activeImg}
            alt={`${mod.title} preview ${galleryIndex + 1}`}
            title={mod.title}
            accentTint={mod.accentTint}
          />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto px-5 pt-3 thin-scroll">
            {images.map((img, idx) => (
              <button
                key={`${mod.id}-thumb-${idx}`}
                type="button"
                onClick={() => setGalleryIndex(idx)}
                aria-pressed={idx === galleryIndex}
                aria-label={`View screenshot ${idx + 1}`}
                className={`h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-opacity cursor-pointer ${
                  idx === galleryIndex
                    ? 'border-[#FF6A5F] opacity-100'
                    : 'border-[#34323A] opacity-65 hover:opacity-100'
                }`}
              >
                <ModImage src={img} alt="" accentTint={mod.accentTint} />
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="space-y-6 p-5 sm:p-6">
          {/* Header & Specs */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium text-[#A8A39A]">
              <span className="text-[#FF6A5F] font-semibold">
                {mod.edition === 'Both' ? 'Java & Bedrock' : `${mod.edition} Edition`}
              </span>
              <span aria-hidden="true">·</span>
              <span>{mod.loader}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">{mod.mcVersion}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">{mod.fileSize}</span>
              <span aria-hidden="true">·</span>
              <span>Updated {mod.updatedAt}</span>
            </div>

            <h2
              id="mod-detail-title"
              className="font-display text-2xl font-bold text-[#F3F1EC] sm:text-[28px]"
            >
              {mod.title}
            </h2>

            <p className="text-[13.5px] text-[#A8A39A]">
              Created by <span className="font-semibold text-[#F3F1EC]">{mod.author}</span>
            </p>

            <p className="max-w-[68ch] text-[15px] leading-relaxed text-[#F3F1EC]/90 pt-1">
              {mod.description}
            </p>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-5 text-[13.5px] text-[#A8A39A] tabular-nums border-y border-[#34323A] py-3.5">
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4" aria-hidden="true" />
              <span>{formatCompactNumber(mod.views)} views</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>{formatCompactNumber(mod.downloads)} downloads</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ThumbsUp className="h-4 w-4" aria-hidden="true" />
              <span>{formatCompactNumber(mod.likes)} likes</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#F5A623]">
              <Star className="h-4 w-4" fill="currentColor" aria-hidden="true" />
              <span className="font-semibold text-[#F3F1EC]">
                {avg > 0 ? `${avg.toFixed(1)} / 5.0` : 'Unrated'}
              </span>
              <span className="text-[#A8A39A]">({formatCompactNumber(mod.ratingCount)})</span>
            </span>
          </div>

          {/* Download Builds */}
          <section aria-labelledby="download-builds-heading" className="space-y-3">
            <h3
              id="download-builds-heading"
              className="font-display text-[14px] font-bold text-[#A8A39A]"
            >
              Download Package Builds
            </h3>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {mod.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[#34323A] bg-[#222127] p-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-[#F3F1EC]">
                      {variant.label}
                    </p>
                    <p className="text-[12px] text-[#A8A39A] font-mono-num">
                      {variant.mcVersion} · {variant.fileSize}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDownloadVariant(mod, variant)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#D93A30] px-4 py-2 text-[13px] font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#FF6A5F] cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Changelog */}
          {mod.changelog.length > 0 && (
            <section className="space-y-2">
              <h3 className="font-display text-[14px] font-bold text-[#A8A39A]">
                Recent Changelog
              </h3>
              <ul className="space-y-1.5 text-[13.5px] text-[#A8A39A]">
                {mod.changelog.map((entry, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {entry}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Rating, Vote & Save */}
          <section className="space-y-3 border-t border-[#34323A] pt-5">
            <h3 className="font-display text-[14px] font-bold text-[#A8A39A]">
              Rate &amp; Save
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onVoteLike(mod.id, 1)}
                aria-pressed={userVote.like === 1}
                className={`inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-[13.5px] font-semibold transition-colors cursor-pointer ${
                  userVote.like === 1
                    ? 'border-[#D93A30] bg-[#D93A30] text-white'
                    : 'border-[#34323A] bg-[#222127] text-[#F3F1EC] hover:border-[#6F6B63]'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span className="tabular-nums">{formatCompactNumber(mod.likes)}</span>
              </button>

              <button
                type="button"
                onClick={() => onVoteLike(mod.id, -1)}
                aria-pressed={userVote.like === -1}
                className={`inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-[13.5px] font-semibold transition-colors cursor-pointer ${
                  userVote.like === -1
                    ? 'border-[#D93A30] bg-[#D93A30] text-white'
                    : 'border-[#34323A] bg-[#222127] text-[#F3F1EC] hover:border-[#6F6B63]'
                }`}
              >
                <ThumbsDown className="h-4 w-4" />
                <span className="tabular-nums">{formatCompactNumber(mod.dislikes)}</span>
              </button>

              <div className="flex items-center gap-1 px-2" role="group" aria-label="Star rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => onVoteStar(mod.id, star)}
                    aria-label={`Rate ${star} stars`}
                    aria-pressed={userVote.stars === star}
                    className={`p-1 rounded-md transition-transform hover:scale-110 cursor-pointer ${
                      star <= activeStars ? 'text-[#F5A623]' : 'text-[#34323A]'
                    }`}
                  >
                    <Star
                      className="h-5 w-5"
                      fill={star <= activeStars ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
              </div>

              {userVote.stars && (
                <span className="text-xs text-[#A8A39A]">
                  Your rating: {userVote.stars}/5
                </span>
              )}

              <div className="ml-auto flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleCompare(mod.id)}
                  aria-pressed={isCompared}
                  className={`inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-[13.5px] font-semibold transition-colors cursor-pointer ${
                    isCompared
                      ? 'border-[#FF6A5F] bg-[#FF6A5F] text-[#17161A]'
                      : 'border-[#34323A] bg-[#222127] text-[#F3F1EC] hover:border-[#6F6B63]'
                  }`}
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleSave(mod.id)}
                  aria-pressed={isSaved}
                  className={`inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-[13.5px] font-semibold transition-colors cursor-pointer ${
                    isSaved
                      ? 'border-[#D93A30] bg-[#D93A30] text-white'
                      : 'border-[#34323A] bg-[#222127] text-[#F3F1EC] hover:border-[#6F6B63]'
                  }`}
                >
                  <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
                  <span>{isSaved ? 'Saved' : 'Save Mod'}</span>
                </button>
              </div>
            </div>
          </section>

          {/* Comments */}
          <section className="space-y-4 border-t border-[#34323A] pt-5">
            <h3 className="font-display text-[17px] font-bold text-[#F3F1EC]">
              Community Comments ({mod.comments.length})
            </h3>

            <form onSubmit={handleSubmitComment} className="space-y-2.5">
              <div className="grid gap-2.5 sm:grid-cols-3">
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="Your nickname (optional)"
                  className="rounded-xl border-2 border-[#34323A] bg-[#1C1B20] px-3.5 py-2.5 text-[14px] text-[#F3F1EC] placeholder:text-[#6F6B63] focus:border-[#FF6A5F] focus:outline-none"
                />
                <div className="sm:col-span-2 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => {
                      setCommentText(e.target.value);
                      if (commentError) setCommentError('');
                    }}
                    placeholder="Share feedback, compatible shaders, or server performance..."
                    className="flex-1 rounded-xl border-2 border-[#34323A] bg-[#1C1B20] px-3.5 py-2.5 text-[14px] text-[#F3F1EC] placeholder:text-[#6F6B63] focus:border-[#FF6A5F] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#D93A30] px-4 py-2.5 text-[14px] font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#FF6A5F] cursor-pointer"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>Post</span>
                  </button>
                </div>
              </div>
              {commentError && (
                <p className="text-xs font-medium text-[#FF6A5F]">{commentError}</p>
              )}
            </form>

            {mod.comments.length === 0 ? (
              <p className="text-[14px] text-[#A8A39A] py-2">
                No comments yet. Be the first player to review this pack.
              </p>
            ) : (
              <div className="divide-y divide-[#34323A]">
                {mod.comments.map((comment) => (
                  <div key={comment.id} className="py-3 space-y-1">
                    <div className="flex items-center gap-2 text-[13px]">
                      <span className="font-bold text-[#F3F1EC]">{comment.author}</span>
                      <span aria-hidden="true" className="text-[#6F6B63]">
                        ·
                      </span>
                      <span className="text-[#A8A39A]">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-[14px] text-[#F3F1EC]/90 leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
