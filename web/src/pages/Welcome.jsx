import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrandLockup from '@/components/brand/BrandLockup';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import { useAuth } from '@/lib/auth';

export default function Welcome() {
  const navigate = useNavigate();
  const { login, isAuthenticated, hasProfile } = useAuth();
  const [email, setEmail] = useState('demo@aymm.test');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(hasProfile ? '/Home' : '/ProfileSetup', { replace: true });
    }
  }, [isAuthenticated, hasProfile, navigate]);

  const handleLogin = async () => {
    await login(email);
  };

  return (
    <main className="public-page public-page--welcome">
      <BrandLockup large />

      <div className="page-shell__grid">
        <TextField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="public-page__actions">
        <Button onClick={handleLogin}>Get Started</Button>
        <Button variant="outline" onClick={handleLogin}>Sign In</Button>
      </div>

      <div className="public-page__links">
        <Link className="aymm-button aymm-button--ghost" to="/AboutUs">About us</Link>
        <Link className="aymm-button aymm-button--ghost" to="/PrivacyPolicy">Privacy policy</Link>
      </div>
    </main>
  );
}
