import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrandLockup from '@/components/brand/BrandLockup';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';

export default function Welcome() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <main className="public-page public-page--welcome">
      <BrandLockup large />

      <div className="public-page__actions">
        <Button
          onClick={() => {
            login();
            navigate('/Home');
          }}
        >
          Get Started
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            login();
            navigate('/Home');
          }}
        >
          Sign In
        </Button>
      </div>

      <div className="public-page__links">
        <Link className="aymm-button aymm-button--ghost" to="/AboutUs">About us</Link>
        <Link className="aymm-button aymm-button--ghost" to="/PrivacyPolicy">Privacy policy</Link>
      </div>
    </main>
  );
}
