import { getGoogleLoginUrl, getDiscordLoginUrl } from '../lib/api';

export function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
      background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(74,222,128,0.08) 0%, transparent 70%)',
    }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌳</div>
        <h2 style={{ marginBottom: '0.5rem' }}>Welcome to LeafLedger</h2>
        <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.9rem' }}>
          Sign in to start planting trees and earning ECO rewards on the Initia blockchain.
        </p>

        <div className="flex flex-col gap-4">
          <a
            href={getGoogleLoginUrl()}
            className="btn btn-google"
            style={{ justifyContent: 'center', padding: '0.8rem 1.5rem', fontSize: '0.95rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18L12.048 13.563c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.172.282-1.712V4.956H.957C.347 6.17 0 7.547 0 9s.348 2.83.957 4.044l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.956L3.964 7.288C4.672 5.161 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>

          <a
            href={getDiscordLoginUrl()}
            className="btn btn-discord"
            style={{ justifyContent: 'center', padding: '0.8rem 1.5rem', fontSize: '0.95rem' }}
          >
            <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.93 1.27A16.45 16.45 0 0 0 12.86 0c-.18.33-.4.77-.54 1.12a15.26 15.26 0 0 0-4.63 0C7.54.77 7.32.33 7.13 0A16.4 16.4 0 0 0 3.06 1.27 17.4 17.4 0 0 0 .07 13.01a16.56 16.56 0 0 0 5.06 2.55c.41-.56.77-1.15 1.08-1.78a10.7 10.7 0 0 1-1.7-.81c.14-.1.28-.21.41-.32a11.83 11.83 0 0 0 10.15 0c.13.11.27.22.41.32-.54.32-1.12.58-1.71.81.31.63.67 1.22 1.08 1.78a16.51 16.51 0 0 0 5.07-2.55 17.36 17.36 0 0 0-2.99-11.74zM6.68 10.65c-1 0-1.83-.92-1.83-2.06 0-1.14.81-2.07 1.83-2.07s1.85.93 1.83 2.07c0 1.14-.82 2.06-1.83 2.06zm6.64 0c-1 0-1.83-.92-1.83-2.06 0-1.14.81-2.07 1.83-2.07s1.85.93 1.83 2.07c0 1.14-.81 2.06-1.83 2.06z" fill="white"/>
            </svg>
            Continue with Discord
          </a>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
          By signing in you agree to our Terms of Service.<br />
          No crypto wallet needed to start! 🌱
        </p>
      </div>
    </div>
  );
}
