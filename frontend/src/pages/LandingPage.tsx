import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTreeStats } from "../lib/api";

export function LandingPage() {
  const [stats, setStats] = useState({
    trees: 0,
    countries: 0,
    players: 0,
    ecoEarned: 0,
  });

  useEffect(() => {
    getTreeStats()
      .then((data) => {
        setStats({
          trees: data.totalTrees || 0,
          countries: data.countries || 0,
          players: data.players || 0,
          ecoEarned: data.ecoEarned || 0,
        });
      })
      .catch((err) => console.error("Failed to load stats:", err));
  }, []);
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <section
        style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          background:
            "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(74,222,128,0.12) 0%, transparent 70%)",
          padding: "4rem 1.5rem",
        }}
      >
        <div className="container text-center fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Glass content wrapper for hero text */}
          <div style={{
            background: 'var(--card-grad-a)',
            backdropFilter: 'blur(64px) saturate(200%)',
            WebkitBackdropFilter: 'blur(64px) saturate(200%)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem 2rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 1px var(--card-shine)',
            maxWidth: '800px',
            width: '100%',
            marginBottom: '2rem'
          }}>
            <div
              className="badge badge-green"
              style={{ margin: "0 auto 1.5rem", fontSize: "0.85rem", display: 'inline-flex' }}
            >
              🌱 Powered by Blockchain & NFTS
            </div>
            <h1
              style={{
                marginBottom: "1.5rem",
                color: "var(--color-text)",
                fontSize: "clamp(3rem, 8vw, 5rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                textShadow: "0 0 40px rgba(74, 222, 128, 0.4), 0 4px 8px rgba(0,0,0,0.5)"
              }}
            >
              Plant Virtual Trees.
              <br /> <span className="text-green" style={{ textShadow: "0 0 40px rgba(74, 222, 128, 0.6), 0 4px 8px rgba(0,0,0,0.5)" }}>Grow Real Forests.</span>
            </h1>
            <p
              style={{
                fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                color: "var(--color-text)",
                maxWidth: 600,
                margin: "0 auto",
                lineHeight: 1.8,
                fontWeight: 500,
                textShadow: "0 2px 4px rgba(0,0,0,0.4)"
              }}
            >
              A blockchain-based game where every virtual tree you plant triggers
              a real-world tree planted by our NGO partners.
            </p>
          </div>

          <div
            className="flex gap-4"
            style={{ justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              to="/login"
              className="btn btn-primary btn-lg"
              style={{ textDecoration: "none" }}
            >
              🌿 Start Planting
            </Link>
            <Link
              to="/map"
              className="btn btn-secondary btn-lg"
              style={{ textDecoration: "none" }}
            >
              🗺 View World Map
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          padding: "4rem 1.5rem",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <div className="container">
          <div className="stat-grid">
            {[
              {
                icon: "🌲",
                value: stats.trees.toLocaleString(),
                label: "Trees Planted",
              },
              {
                icon: "🌍",
                value: stats.countries.toLocaleString(),
                label: "Countries",
              },
              {
                icon: "🏆",
                value: stats.players.toLocaleString(),
                label: "Players",
              },
              {
                icon: "💎",
                value: stats.ecoEarned.toLocaleString(),
                label: "ECO Earned",
              },
            ].map((s) => (
              <div className="stat-card fade-in" key={s.label}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: "3rem" }}>
            How It <span className="text-green">Works</span>
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              {
                step: "01",
                icon: "🔐",
                title: "Sign In",
                desc: "Login with Google or Discord. No wallet required to start.",
              },
              {
                step: "02",
                icon: "🗺",
                title: "Pick a Location",
                desc: "Open the world map and tap any location to plant your virtual tree.",
              },
              {
                step: "03",
                icon: "⛓",
                title: "Mint on Initia",
                desc: "Your tree is minted as an NFT on Initia's fast blockchain in seconds.",
              },
              {
                step: "04",
                icon: "🌱",
                title: "Real Impact",
                desc: "Our NGO partners plant a real tree at the matched location.",
              },
            ].map((item) => (
              <div
                className="card fade-in"
                key={item.step}
                style={{ position: "relative" }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-green-primary)",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    marginBottom: "0.75rem",
                  }}
                >
                  STEP {item.step}
                </div>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
                  {item.icon}
                </div>
                <h3 style={{ marginBottom: "0.5rem" }}>{item.title}</h3>
                <p
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "5rem 1.5rem",
          textAlign: "center",
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(74,222,128,0.08) 0%, transparent 70%)",
        }}
      >
        <div className="container">
          <h2 style={{ marginBottom: "1rem" }}>Ready to Make an Impact?</h2>
          <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
            Join thousands of players building a greener world — one block at a
            time.
          </p>
          <Link
            to="/login"
            className="btn btn-primary btn-lg animate-pulse-glow"
            style={{ textDecoration: "none" }}
          >
            🌳 Play Now — It's Free
          </Link>
        </div>
      </section>

      <footer
        style={{
          borderTop: "1px solid var(--color-border)",
          padding: "2rem 1.5rem",
          textAlign: "center",
          color: "var(--color-text-muted)",
          fontSize: "0.85rem",
        }}
      >
        <div className="container">
          🌱 Leaf Ledger © 2026 — Powered by Initia Blockchain &amp; Real NGO
          Partnerships
        </div>
      </footer>
    </div>
  );
}
