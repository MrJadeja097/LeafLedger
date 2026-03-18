import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * This page handles the OAuth redirect callback.
 * Backend redirects to: /auth/callback?token=<jwt>
 */
export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, fetchMe } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
      fetchMe().then(() => navigate('/dashboard'));
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="text-center fade-in">
        <div className="spinner" style={{ margin: '0 auto 1rem' }} />
        <p className="text-muted">Signing you in…</p>
      </div>
    </div>
  );
}
