import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export default function Welcome() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <main className="public-page">
      <div>
        <p className="page-shell__eyebrow">Public entry</p>
        <h1 className="page-shell__title">Welcome</h1>
        <p className="page-shell__description">
          Production landing route. Brand visuals will replace this shell later.
        </p>
      </div>

      <div className="page-shell__panel page-shell__grid">
        <p>Login / register action mounts here.</p>
        <button
          type="button"
          className="shell-button shell-button--primary"
          onClick={() => {
            login();
            navigate('/Home');
          }}
        >
          Continue with demo session
        </button>
      </div>

      <div className="public-page__actions">
        <Link className="shell-link" to="/AboutUs">About us</Link>
        <Link className="shell-link" to="/PrivacyPolicy">Privacy policy</Link>
      </div>
    </main>
  );
}
