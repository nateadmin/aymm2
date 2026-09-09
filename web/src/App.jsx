import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { ToastProvider } from '@/lib/toast';
import { queryClient } from '@/lib/queryClient';
import RequireAuth, { RequireProfile } from '@/components/RequireAuth';
import AppLayout from '@/components/layout/AppLayout';
import Welcome from '@/pages/Welcome';
import ProfileSetup from '@/pages/ProfileSetup';
import AboutUs from '@/pages/AboutUs';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Home from '@/pages/Home';
import Messages from '@/pages/Messages';
import FamilyTables from '@/pages/FamilyTables';
import Newsfeed from '@/pages/Newsfeed';
import Profile from '@/pages/Profile';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/Welcome" replace />} />
              <Route path="/Welcome" element={<Welcome />} />
              <Route path="/AboutUs" element={<AboutUs />} />
              <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />

              <Route element={<RequireAuth />}>
                <Route path="/ProfileSetup" element={<ProfileSetup />} />
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
