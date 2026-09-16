import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
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
import NotFound from '@/pages/NotFound';

function PreviewUploadVideoRedirect() {
  const location = useLocation();
  return <Navigate to={`/ProfileSetup/upload-video${location.search}`} replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
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
              <Route path="/preview/upload-video" element={<PreviewUploadVideoRedirect />} />
              <Route path="/preview/:slug" element={<ScreenStub />} />

              <Route element={<RequireAuth />}>
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
