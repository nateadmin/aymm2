import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import Sheet from '@/components/ui/Sheet';
import Button from '@/components/ui/Button';
import { entities } from '@/api/entities';
import { PLACEHOLDER_AVATAR } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/format';
import { useProfileMap } from '@/hooks/useProfileMap';

export default function PostDetailSheet({
  post,
  profile,
  open,
  onClose,
  currentUserEmail,
  reaction,
  onLike,
  onDislike,
}) {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const { getProfile } = useProfileMap({ enabled: open && Boolean(post?.id) });

  useEffect(() => {
    if (open && post?.id) {
      setCommentText('');
      entities.NewsfeedPost.update(post.id, { views: (post.views || 0) + 1 }).catch(() => {});
    }
  }, [open, post?.id]);

  const commentsQueryKey = ['Comment', 'list', JSON.stringify({ post_id: post?.id }), undefined, undefined];

  const addComment = useMutation({
    mutationFn: async () => {
      await entities.Comment.create({
        post_id: post.id,
        author_email: currentUserEmail,
        content: commentText.trim(),
      });
      await entities.NewsfeedPost.update(post.id, {
        comments_count: (post.comments_count || 0) + 1,
      });
    },
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: ['Comment'] });
      queryClient.invalidateQueries({ queryKey: ['NewsfeedPost'] });
    },
  });

  if (!post) return null;

  const displayName = profile?.display_name || post.author_email?.split('@')[0];
  const avatar = profile?.profile_photos?.[0] || PLACEHOLDER_AVATAR;

  return (
    <Sheet open={open} title={displayName} onClose={onClose}>
      <div className="post-detail">
        <header className="post-detail__header">
          <img src={avatar} alt="" className="post-detail__avatar" />
          <div>
            <p className="post-detail__author">{displayName}</p>
            <p className="aymm-muted">{formatRelativeTime(post.created_date)}</p>
          </div>
        </header>

        {post.photo_url ? (
          <img src={post.photo_url} alt="" className="post-detail__image" />
        ) : null}

        <p className="post-detail__content">{post.content}</p>

        <div className="feed-card__actions">
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
            Share
          </button>
        </div>

        <section className="post-detail__comments">
          <h3 className="aymm-heading aymm-heading--card">Comments</h3>
          <CommentList postId={post.id} getProfile={getProfile} />
          <label className="aymm-field">
            <span className="aymm-label">Add a comment</span>
            <textarea
              className="aymm-textarea"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
            />
          </label>
          <Button
            disabled={!commentText.trim() || addComment.isPending}
            onClick={() => addComment.mutate()}
          >
            Post comment
          </Button>
        </section>
      </div>
    </Sheet>
  );
}

function CommentList({ postId, getProfile }) {
  const queryClient = useQueryClient();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let cancelled = false;
    entities.Comment.filter({ post_id: postId }).then((data) => {
      if (!cancelled) setComments(data || []);
    });
    return () => {
      cancelled = true;
    };
  }, [postId, queryClient]);

  if (!comments.length) {
    return <p className="aymm-muted">No comments yet.</p>;
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => {
        const author = getProfile(comment.author_email);
        return (
          <div key={comment.id} className="comment-list__item">
            <img
              src={author?.profile_photos?.[0] || PLACEHOLDER_AVATAR}
              alt=""
              className="comment-list__avatar"
            />
            <div>
              <p className="comment-list__author">
                {author?.display_name || comment.author_email}
              </p>
              <p className="comment-list__body">{comment.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
