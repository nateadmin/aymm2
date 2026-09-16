import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PageShell from '@/components/PageShell';
import TabBar from '@/components/ui/TabBar';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { ADMIN_TABS } from '@/lib/constants';
import { entities } from '@/api/entities';
import { useAuth } from '@/lib/auth';
import { useEntityList } from '@/hooks/useEntityList';
import { useToast } from '@/lib/toast';
import { formatRelativeTime } from '@/lib/format';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { isAdmin, user } = useAuth();
  const { push } = useToast();
  const [activeTab, setActiveTab] = useState('contacts');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reviewNote, setReviewNote] = useState('');

  const contacts = useEntityList('Contact', {}, { enabled: isAdmin });
  const identityRequests = useEntityList('IdentityChangeRequest', { status: 'pending' }, { enabled: isAdmin });
  const reports = useEntityList('Report', { status: 'pending' }, { enabled: isAdmin });
  const users = useEntityList('User', {}, { enabled: isAdmin, limit: 100 });
  const profiles = useEntityList('Profile', {}, { enabled: isAdmin, limit: 50 });
  const posts = useEntityList('NewsfeedPost', {}, { enabled: isAdmin, limit: 50 });
  const tables = useEntityList('FamilyTable', {}, { enabled: isAdmin, limit: 50 });

  if (!isAdmin) {
    return <Navigate to="/Newsfeed" replace />;
  }

  const blockedCount = (users.data || []).filter((item) => item.is_blocked).length;

  const invalidateAll = () => {
    queryClient.invalidateQueries();
  };

  const reviewIdentity = useMutation({
    mutationFn: async ({ request, status }) => {
      await entities.IdentityChangeRequest.update(request.id, {
        status,
        reviewed_by: user.email,
        review_note: reviewNote,
      });
      if (status === 'approved') {
        const profile = (profiles.data || []).find((item) => item.user_email === request.user_email);
        if (profile) {
          await entities.Profile.update(profile.id, {
            identity_type: request.requested_identity,
            ...(request.requested_identity === 'family' ? { seeking_type: 'family' } : {}),
          });
        }
      }
    },
    onSuccess: (_, { status }) => {
      invalidateAll();
      setSelectedRequest(null);
      setReviewNote('');
      push(status === 'approved' ? 'Request approved.' : 'Request denied.', 'success');
    },
  });

  const resolveReport = useMutation({
    mutationFn: ({ reportId, status }) => entities.Report.update(reportId, { status }),
    onSuccess: () => {
      invalidateAll();
      setSelectedReport(null);
      push('Report updated.', 'success');
    },
  });

  const blockUser = useMutation({
    mutationFn: ({ userId, blocked }) => entities.User.update(userId, { is_blocked: blocked }),
    onSuccess: () => {
      invalidateAll();
      push('User status updated.', 'success');
    },
  });

  const deleteProfile = useMutation({
    mutationFn: (profileId) => entities.Profile.delete(profileId),
    onSuccess: () => {
      invalidateAll();
      push('Profile deleted.', 'success');
    },
  });

  const deletePost = useMutation({
    mutationFn: (postId) => entities.NewsfeedPost.delete(postId),
    onSuccess: () => {
      invalidateAll();
      push('Post deleted.', 'success');
    },
  });

  const deleteTable = useMutation({
    mutationFn: (tableId) => entities.FamilyTable.delete(tableId),
    onSuccess: () => {
      invalidateAll();
      push('Table deleted.', 'success');
    },
  });

  const markContactReviewed = useMutation({
    mutationFn: (contactId) => entities.Contact.update(contactId, { status: 'reviewed' }),
    onSuccess: () => {
      invalidateAll();
      push('Contact marked reviewed.', 'success');
    },
  });

  const tabData = {
    contacts: contacts.data,
    identity: identityRequests.data,
    reports: reports.data,
    users: users.data,
    profiles: profiles.data,
    posts: posts.data,
    tables: tables.data,
  };

  return (
    <PageShell eyebrow="Admin" title="Admin dashboard" description="Administrative tools for approved AYMM operators.">
      <div className="admin-stats">
        <div className="admin-stat"><span>Identity</span><strong>{identityRequests.data?.length || 0}</strong></div>
        <div className="admin-stat"><span>Reports</span><strong>{reports.data?.length || 0}</strong></div>
        <div className="admin-stat"><span>Contacts</span><strong>{contacts.data?.length || 0}</strong></div>
        <div className="admin-stat"><span>Blocked</span><strong>{blockedCount}</strong></div>
      </div>

      <TabBar tabs={ADMIN_TABS} activeId={activeTab} onChange={setActiveTab} />

      <div className="admin-list">
        {(tabData[activeTab] || []).length ? (tabData[activeTab] || []).map((item) => (
          <article key={item.id} className="admin-card">
            <div className="admin-card__body">
              {activeTab === 'contacts' && (
                <>
                  <p><strong>{item.name || item.email}</strong></p>
                  <p className="aymm-muted">{item.subject}</p>
                  <p>{item.message}</p>
                </>
              )}
              {activeTab === 'identity' && (
                <>
                  <p><strong>{item.user_email}</strong></p>
                  <p>{item.current_identity} → {item.requested_identity}</p>
                  <p className="aymm-muted">{item.reason}</p>
                </>
              )}
              {activeTab === 'reports' && (
                <>
                  <p><strong>{item.report_type}</strong> by {item.reporter_email}</p>
                  <p>{item.reason}</p>
                </>
              )}
              {activeTab === 'users' && (
                <>
                  <p><strong>{item.email}</strong></p>
                  <p className="aymm-muted">{item.role} · {item.is_blocked ? 'blocked' : 'active'}</p>
                </>
              )}
              {activeTab === 'profiles' && (
                <>
                  <p><strong>{item.display_name}</strong></p>
                  <p className="aymm-muted">{item.user_email} · {item.identity_type}</p>
                </>
              )}
              {activeTab === 'posts' && (
                <>
                  <p><strong>{item.author_email}</strong></p>
                  <p>{item.content}</p>
                  <p className="aymm-muted">{formatRelativeTime(item.created_date)}</p>
                </>
              )}
              {activeTab === 'tables' && (
                <>
                  <p><strong>{item.table_name}</strong></p>
                  <p className="aymm-muted">{item.city} · {item.event_date}</p>
                </>
              )}
            </div>

            <div className="admin-card__actions">
              {activeTab === 'contacts' && item.status === 'new' ? (
                <Button variant="outline" onClick={() => markContactReviewed.mutate(item.id)}>Mark reviewed</Button>
              ) : null}
              {activeTab === 'identity' ? (
                <Button onClick={() => setSelectedRequest(item)}>Review</Button>
              ) : null}
              {activeTab === 'reports' ? (
                <Button onClick={() => setSelectedReport(item)}>Resolve</Button>
              ) : null}
              {activeTab === 'users' ? (
                <Button
                  variant="outline"
                  onClick={() => blockUser.mutate({ userId: item.id, blocked: !item.is_blocked })}
                >
                  {item.is_blocked ? 'Unblock' : 'Block'}
                </Button>
              ) : null}
              {activeTab === 'profiles' ? (
                <>
                  <Button variant="outline" onClick={() => deleteProfile.mutate(item.id)}>Delete</Button>
                </>
              ) : null}
              {activeTab === 'posts' ? (
                <Button variant="outline" onClick={() => deletePost.mutate(item.id)}>Delete</Button>
              ) : null}
              {activeTab === 'tables' ? (
                <Button variant="outline" onClick={() => deleteTable.mutate(item.id)}>Delete</Button>
              ) : null}
            </div>
          </article>
        )) : <p className="aymm-muted">No records.</p>}
      </div>

      <Modal open={Boolean(selectedRequest)} title="Review identity request" onClose={() => setSelectedRequest(null)}>
        <textarea
          className="aymm-textarea"
          value={reviewNote}
          onChange={(e) => setReviewNote(e.target.value)}
          rows={4}
          placeholder="Optional review note"
        />
        <div className="page-shell__grid page-shell__grid--actions">
          <Button onClick={() => reviewIdentity.mutate({ request: selectedRequest, status: 'approved' })}>Approve</Button>
          <Button variant="outline" onClick={() => reviewIdentity.mutate({ request: selectedRequest, status: 'denied' })}>Deny</Button>
        </div>
      </Modal>

      <Modal open={Boolean(selectedReport)} title="Resolve report" onClose={() => setSelectedReport(null)}>
        <div className="page-shell__grid page-shell__grid--actions">
          <Button onClick={() => resolveReport.mutate({ reportId: selectedReport.id, status: 'reviewed' })}>Mark reviewed</Button>
          <Button variant="outline" onClick={() => resolveReport.mutate({ reportId: selectedReport.id, status: 'resolved' })}>Resolve</Button>
        </div>
      </Modal>
    </PageShell>
  );
}
