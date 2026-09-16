import React, { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PageShell from '@/components/PageShell';
import TabBar from '@/components/ui/TabBar';
import Sheet from '@/components/ui/Sheet';
import Button from '@/components/ui/Button';
import PostCard from '@/components/newsfeed/PostCard';
import PostDetailSheet from '@/components/newsfeed/PostDetailSheet';
import { uploadImage } from '@/api/profile';
import { entities } from '@/api/entities';
import { NEWSFEED_CATEGORIES, NEWSFEED_TABS } from '@/lib/constants';
import { useAuth } from '@/lib/auth';
import { useEntityList } from '@/hooks/useEntityList';
import { useProfileMap } from '@/hooks/useProfileMap';
import { useToast } from '@/lib/toast';
import { getReaction, setReaction } from '@/lib/reactions';

export default function Newsfeed() {
  const queryClient = useQueryClient();
  const { user, isFamily } = useAuth();
  const { push } = useToast();
  const [activeTab, setActiveTab] = useState('recent');
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('family');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [reactions, setReactions] = useState(() => ({}));

  const postsQuery = useEntityList('NewsfeedPost', {}, { sort: '-created_at' });
  const { getProfile } = useProfileMap();

  const posts = postsQuery.data || [];
  const sortedPosts = activeTab === 'popular'
    ? [...posts].sort((a, b) => (b.likes + b.comments_count) - (a.likes + a.comments_count))
    : posts;

  const groupedPosts = useMemo(() => {
    const groups = {};
    NEWSFEED_CATEGORIES.forEach((item) => {
      groups[item] = posts.filter((post) => post.category === item);
    });
    return groups;
  }, [posts]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['NewsfeedPost'] });

  const createPost = useMutation({
    mutationFn: () => entities.NewsfeedPost.create({
      author_email: user.email,
      content: content.trim(),
      category,
      photo_url: photoUrl || null,
    }),
    onSuccess: () => {
      invalidate();
      setCreateOpen(false);
      setContent('');
      setPhotoUrl('');
      push('Post published!', 'success');
    },
  });

  const updateReaction = async (post, type) => {
    const current = getReaction(post.id);
    const next = current === type ? null : type;
    setReaction(post.id, next);
    setReactions((state) => ({ ...state, [post.id]: next }));

    const likes = post.likes || 0;
    const dislikes = post.dislikes || 0;
    let nextLikes = likes;
    let nextDislikes = dislikes;

    if (current === 'like') nextLikes -= 1;
    if (current === 'dislike') nextDislikes -= 1;
    if (next === 'like') nextLikes += 1;
    if (next === 'dislike') nextDislikes += 1;

    await entities.NewsfeedPost.update(post.id, {
      likes: Math.max(0, nextLikes),
      dislikes: Math.max(0, nextDislikes),
    });
    invalidate();
  };

  const handlePhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await uploadImage(file);
      setPhotoUrl(file_url);
    } catch {
      push('Photo upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const reactionFor = (postId) => reactions[postId] ?? getReaction(postId);

  return (
    <PageShell
      eyebrow="Community"
      title="Family Newsfeed"
      description="Share stories, photos, and updates with your AYMM community."
    >
      <TabBar tabs={NEWSFEED_TABS} activeId={activeTab} onChange={setActiveTab} />
      {isFamily ? (
        <Button onClick={() => setCreateOpen(true)}>Create post</Button>
      ) : null}

      <div className="feed-list">
        {activeTab === 'category' ? (
          NEWSFEED_CATEGORIES.map((item) => (
            <section key={item} className="feed-category-group">
              <h2 className="home-section-title">{item}</h2>
              {groupedPosts[item]?.length ? groupedPosts[item].map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  profile={getProfile(post.author_email)}
                  reaction={reactionFor(post.id)}
                  onLike={() => updateReaction(post, 'like')}
                  onDislike={() => updateReaction(post, 'dislike')}
                  onView={setSelectedPost}
                />
              )) : <p className="aymm-muted">No posts in this category yet.</p>}
            </section>
          ))
        ) : (
          sortedPosts.length ? sortedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              profile={getProfile(post.author_email)}
              reaction={reactionFor(post.id)}
              onLike={() => updateReaction(post, 'like')}
              onDislike={() => updateReaction(post, 'dislike')}
              onView={setSelectedPost}
            />
          )) : <p className="aymm-muted">No posts yet.</p>
        )}
      </div>

      <Sheet open={createOpen} title="Create post" onClose={() => setCreateOpen(false)}>
        <div className="page-shell__grid">
          <label className="aymm-field">
            <span className="aymm-label">Content</span>
            <textarea className="aymm-textarea" value={content} onChange={(e) => setContent(e.target.value)} rows={5} />
          </label>
          <label className="aymm-field">
            <span className="aymm-label">Category</span>
            <select className="aymm-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {NEWSFEED_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="aymm-field">
            <span className="aymm-label">Photo</span>
            <input type="file" accept="image/*" onChange={handlePhoto} disabled={uploading} />
          </label>
          {photoUrl ? <img src={photoUrl} alt="" className="feed-card__image" /> : null}
          <Button disabled={!content.trim() || createPost.isPending} onClick={() => createPost.mutate()}>
            Publish
          </Button>
        </div>
      </Sheet>

      <PostDetailSheet
        post={selectedPost}
        profile={selectedPost ? getProfile(selectedPost.author_email) : null}
        open={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        currentUserEmail={user?.email}
        reaction={selectedPost ? reactionFor(selectedPost.id) : null}
        onLike={() => selectedPost && updateReaction(selectedPost, 'like')}
        onDislike={() => selectedPost && updateReaction(selectedPost, 'dislike')}
      />
    </PageShell>
  );
}
