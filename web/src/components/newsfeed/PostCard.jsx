import { Eye, MessageCircle, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { PLACEHOLDER_AVATAR } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/format';

export default function PostCard({
  post,
  profile,
  reaction,
  onLike,
  onDislike,
  onView,
}) {
  const avatar = profile?.profile_photos?.[0] || PLACEHOLDER_AVATAR;
  const displayName = profile?.display_name || post.author_email?.split('@')[0];

  return (
    <article className="feed-card">
      <header className="feed-card__header">
        <img src={avatar} alt="" className="feed-card__avatar" />
        <div className="feed-card__meta">
          <p className="feed-card__author">{displayName}</p>
          <p className="feed-card__time">{formatRelativeTime(post.created_date)}</p>
        </div>
        {post.category ? <span className="feed-card__category">{post.category}</span> : null}
      </header>

      <button type="button" className="feed-card__content" onClick={() => onView?.(post)}>
        <p>{post.content}</p>
      </button>

      {post.photo_url ? (
        <button type="button" className="feed-card__image-wrap" onClick={() => onView?.(post)}>
          <img src={post.photo_url} alt="" className="feed-card__image" />
        </button>
      ) : null}

      <footer className="feed-card__actions">
        <button
          type="button"
          className={`feed-card__action${reaction === 'like' ? ' feed-card__action--active' : ''}`}
          onClick={() => onLike?.(post)}
        >
          <ThumbsUp size={16} />
          {post.likes || 0}
        </button>
        <button
          type="button"
          className={`feed-card__action${reaction === 'dislike' ? ' feed-card__action--active' : ''}`}
          onClick={() => onDislike?.(post)}
        >
          <ThumbsDown size={16} />
          {post.dislikes || 0}
        </button>
        <button type="button" className="feed-card__action" onClick={() => onView?.(post)}>
          <MessageCircle size={16} />
          {post.comments_count || 0}
        </button>
        <button
          type="button"
          className="feed-card__action feed-card__action--share"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(post.content);
            } catch {
              // ignore
            }
          }}
        >
          <Share2 size={16} />
          {post.shares || 0}
        </button>
        <span className="feed-card__views">
          <Eye size={16} />
          {post.views || 0}
        </span>
      </footer>
    </article>
  );
}
