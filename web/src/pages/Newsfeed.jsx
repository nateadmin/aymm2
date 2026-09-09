import React, { useState } from 'react';
import PageShell from '@/components/PageShell';
import TabBar from '@/components/ui/TabBar';
import PlaceholderPanel from '@/components/shared/PlaceholderPanel';
import Sheet from '@/components/ui/Sheet';
import { NEWSFEED_TABS } from '@/lib/constants';
import { useAuth } from '@/lib/auth';
import { useEntityList } from '@/hooks/useEntityList';

export default function Newsfeed() {
  const { isFamily } = useAuth();
  const [activeTab, setActiveTab] = useState('recent');
  const [createOpen, setCreateOpen] = useState(false);
  const postsQuery = useEntityList('NewsfeedPost', {}, { sort: '-created_at' });

  const posts = postsQuery.data || [];
  const sortedPosts = activeTab === 'popular'
    ? [...posts].sort((a, b) => (b.likes + b.comments_count) - (a.likes + a.comments_count))
    : posts;

  return (
    <PageShell
      eyebrow="Community"
      title="Family Newsfeed"
      description="Share stories, photos, and updates with your AYMM community."
    >
      <TabBar tabs={NEWSFEED_TABS} activeId={activeTab} onChange={setActiveTab} />
      {isFamily ? (
        <button type="button" className="aymm-button aymm-button--primary" onClick={() => setCreateOpen(true)}>
          Create post
        </button>
      ) : null}

      <div className="page-shell__grid">
        {activeTab === 'category' ? (
          <PlaceholderPanel title="Category groups" description="Grouped by family, holidays, stories, events, advice, other." />
        ) : (
          sortedPosts.map((post) => (
            <PlaceholderPanel key={post.id} title={post.author_email} description={post.category || 'uncategorized'}>
              <p>{post.content}</p>
              <p className="aymm-muted">Likes {post.likes} · Comments {post.comments_count} · Views {post.views}</p>
            </PlaceholderPanel>
          ))
        )}
        {!sortedPosts.length && activeTab !== 'category' ? (
          <PlaceholderPanel title="No posts yet" description="Family profiles can publish the first story." />
        ) : null}
      </div>

      <Sheet open={createOpen} title="Create post" onClose={() => setCreateOpen(false)}>
        <PlaceholderPanel title="Post composer" description="Content, category, optional photo upload." />
      </Sheet>
    </PageShell>
  );
}
