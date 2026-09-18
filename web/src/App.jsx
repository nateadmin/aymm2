import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { syncMobilePreview } from '@/lib/mobilePreview';
import { AuthProvider } from '@/lib/auth';
import { ToastProvider } from '@/lib/toast';
import { queryClient } from '@/lib/queryClient';
import RequireAuth, { RequireProfile } from '@/components/RequireAuth';
import AppLayout from '@/components/layout/AppLayout';
import Splash from '@/pages/Splash';
import Welcome from '@/pages/Welcome';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Demo from '@/pages/Demo';
import EmailLogin from '@/pages/EmailLogin';
import EmailRegister from '@/pages/EmailRegister';
import PhoneLogin from '@/pages/PhoneLogin';
import OTP from '@/pages/OTP';
import ForgotPassword from '@/pages/ForgotPassword';
import CreatePassword from '@/pages/CreatePassword';
import ProfileSetup from '@/pages/ProfileSetup';
import AboutUs from '@/pages/AboutUs';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Home from '@/pages/Home';
import Messages from '@/pages/Messages';
import FamilyTables from '@/pages/FamilyTables';
import Newsfeed from '@/pages/Newsfeed';
import Profile from '@/pages/Profile';
import AdminDashboard from '@/pages/AdminDashboard';
import ScreenIndex from '@/pages/ScreenIndex';
import ScreenStub from '@/pages/ScreenStub';
import Discovery from '@/pages/Discovery';
import Community from '@/pages/Community';
import Prototype from '@/pages/Prototype';
import NotFound from '@/pages/NotFound';

function PreviewUploadPhotoRedirect() {
  const location = useLocation();
  return <Navigate to={`/ProfileSetup/upload-photo${location.search}`} replace />;
}

function PreviewUploadVideoRedirect() {
  const location = useLocation();
  return <Navigate to={`/ProfileSetup/upload-video${location.search}`} replace />;
}

function PreviewCompleteRedirect() {
  const location = useLocation();
  return <Navigate to={`/ProfileSetup/complete${location.search}`} replace />;
}

function PreviewDiscoveryRedirect({ slug }) {
  const location = useLocation();
  return <Navigate to={`/Discovery/${slug}${location.search}`} replace />;
}

const DISCOVERY_PREVIEW_SLUGS = [
  'daughter-profile',
  'mother-profile',
  'family-profile',
  'connection-success',
  'seeking-parent-reasons',
  'seeking-child-reasons',
  'seeking-sibling-reasons',
  'lifestyle-questions',
  'personal-questions',
  'family-questions',
  'religion-info',
  'recommend',
];

function PreviewCommunityRedirect({ slug }) {
  const location = useLocation();
  return <Navigate to={`/Community/${slug}${location.search}`} replace />;
}

const COMMUNITY_PREVIEW_SLUGS = [
  'letters-inbox',
  'message-requests',
  'open-conversation',
  'family-table-listing',
  'family-table-details',
  'request-join-table',
  'register-table',
  'table-confirmation',
  'previous-photos',
  'event-reminders',
];

function PreviewPrototypeRedirect({ slug }) {
  const location = useLocation();
  return <Navigate to={`/Prototype/${slug}${location.search}`} replace />;
}

const PROTOTYPE_PREVIEW_SLUGS = [
  'home',
  'settings',
  'my-profile',
  'profile-carousel',
  'adoption-approved',
  'aymm-family-match',
  'message-request-detail',
  'compatibility-challenge',
  'religion-selector',
  'seeking-qs-parent',
  'seeking-qs-child',
  'seeking-qs-sibling',
  'username-validation',
  'register-table-full',
];

function SyncPreviewFlags() {
  const location = useLocation();
  useEffect(() => {
    syncMobilePreview(location.search);
  }, [location.search]);
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <SyncPreviewFlags />
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/Splash" element={<Navigate to="/" replace />} />
              <Route path="/Welcome" element={<Welcome />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/EmailLogin" element={<EmailLogin />} />
              <Route path="/EmailRegister" element={<EmailRegister />} />
              <Route path="/PhoneLogin" element={<PhoneLogin />} />
              <Route path="/OTP" element={<OTP />} />
              <Route path="/ForgotPassword" element={<ForgotPassword />} />
              <Route path="/CreatePassword" element={<CreatePassword />} />
              <Route path="/AboutUs" element={<AboutUs />} />
              <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
              <Route path="/screens" element={<ScreenIndex />} />
              <Route path="/screens/:slug" element={<ScreenStub />} />
              <Route path="/preview/upload-photo" element={<PreviewUploadPhotoRedirect />} />
              <Route path="/preview/upload-video" element={<PreviewUploadVideoRedirect />} />
              <Route path="/preview/complete" element={<PreviewCompleteRedirect />} />
              {DISCOVERY_PREVIEW_SLUGS.map((slug) => (
                <Route
                  key={slug}
                  path={`/preview/${slug}`}
                  element={<PreviewDiscoveryRedirect slug={slug} />}
                />
              ))}
              {COMMUNITY_PREVIEW_SLUGS.map((slug) => (
                <Route
                  key={slug}
                  path={`/preview/${slug}`}
                  element={<PreviewCommunityRedirect slug={slug} />}
                />
              ))}
              {PROTOTYPE_PREVIEW_SLUGS.map((slug) => (
                <Route
                  key={slug}
                  path={`/preview/${slug}`}
                  element={<PreviewPrototypeRedirect slug={slug} />}
                />
              ))}
              <Route path="/preview/aymf-family-match" element={<PreviewPrototypeRedirect slug="aymm-family-match" />} />
              <Route path="/preview/:slug" element={<ScreenStub />} />

              <Route element={<RequireAuth />}>
                <Route path="/Discovery/*" element={<Discovery />} />
                <Route path="/Community/*" element={<Community />} />
                <Route path="/Prototype/*" element={<Prototype />} />
                <Route path="/ProfileSetup/*" element={<ProfileSetup />} />
                <Route element={<RequireProfile />}>
                  <Route element={<AppLayout />}>
                    <Route path="/Home" element={<Home />} />
                    <Route path="/Messages" element={<Messages />} />
                    <Route path="/FamilyTables" element={<FamilyTables />} />
                    <Route path="/Newsfeed" element={<Newsfeed />} />
                    <Route path="/Profile" element={<Profile />} />
                    <Route path="/AdminDashboard" element={<AdminDashboard />} />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
