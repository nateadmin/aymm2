import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import TabBar from '@/components/ui/TabBar';
import PlaceholderPanel from '@/components/shared/PlaceholderPanel';
import { ADMIN_TABS } from '@/lib/constants';
import { useAuth } from '@/lib/auth';
import { useEntityList } from '@/hooks/useEntityList';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('contacts');

  const contacts = useEntityList('Contact', {}, { enabled: isAdmin });
  const identityRequests = useEntityList('IdentityChangeRequest', { status: 'pending' }, { enabled: isAdmin });
  const reports = useEntityList('Report', { status: 'pending' }, { enabled: isAdmin });
  const users = useEntityList('User', {}, { enabled: isAdmin });
  const profiles = useEntityList('Profile', {}, { enabled: isAdmin, limit: 50 });
  const posts = useEntityList('NewsfeedPost', {}, { enabled: isAdmin, limit: 50 });
  const tables = useEntityList('FamilyTable', {}, { enabled: isAdmin, limit: 50 });

  if (!isAdmin) {
    return <Navigate to="/Newsfeed" replace />;
  }

  const blockedCount = (users.data || []).filter((item) => item.is_blocked).length;

  return (
    <PageShell
      eyebrow="Admin"
      title="Admin dashboard"
      description="Administrative tools for approved AYMM operators."
    >
      <div className="page-shell__grid page-shell__grid--actions">
        <PlaceholderPanel title="Identity requests" description={`${identityRequests.data?.length || 0} pending`} />
        <PlaceholderPanel title="Reports" description={`${reports.data?.length || 0} pending`} />
        <PlaceholderPanel title="Contacts" description={`${contacts.data?.length || 0} new`} />
        <PlaceholderPanel title="Blocked users" description={`${blockedCount} blocked`} />
      </div>

      <TabBar tabs={ADMIN_TABS} activeId={activeTab} onChange={setActiveTab} />

      {activeTab === 'contacts' ? <AdminList title="Contacts" items={contacts.data} /> : null}
      {activeTab === 'identity' ? <AdminList title="Identity change requests" items={identityRequests.data} /> : null}
      {activeTab === 'reports' ? <AdminList title="Reports" items={reports.data} /> : null}
      {activeTab === 'users' ? <AdminList title="Users" items={users.data} /> : null}
      {activeTab === 'profiles' ? <AdminList title="Profiles" items={profiles.data} /> : null}
      {activeTab === 'posts' ? <AdminList title="Posts" items={posts.data} /> : null}
      {activeTab === 'tables' ? <AdminList title="Tables" items={tables.data} /> : null}
    </PageShell>
  );
}

function AdminList({ title, items = [] }) {
  return (
    <PlaceholderPanel title={title} description="Review and action controls will attach here.">
      {items.length ? items.map((item) => (
        <p key={item.id}>{item.id}</p>
      )) : <p className="aymm-muted">No records.</p>}
    </PlaceholderPanel>
  );
}
