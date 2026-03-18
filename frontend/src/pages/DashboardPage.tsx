import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getMyTrees, getTokenBalance, updateWallet } from '../lib/api';

export function DashboardPage() {
  const { user, fetchMe } = useAuthStore();
  const [myTrees, setMyTrees] = useState<any[]>([]);
  const [balance, setBalance] = useState<string | null>(null);
  const [walletInput, setWalletInput] = useState('');
  const [savingWallet, setSavingWallet] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getMyTrees()
      .then(setMyTrees)
      .finally(() => setLoading(false));

    if (user.walletAddress) {
      getTokenBalance(user.walletAddress)
        .then((d) => setBalance(d.balance))
        .catch(() => setBalance('0'));
    }
  }, [user]);

  const handleSaveWallet = async () => {
    if (!walletInput) return;
    setSavingWallet(true);
    try {
      await updateWallet(walletInput);
      await fetchMe();
      setWalletInput('');
    } catch {
      alert('Failed to update wallet address');
    } finally {
      setSavingWallet(false);
    }
  };

  if (!user) return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="text-center">
        <p className="text-muted" style={{ marginBottom: '1rem' }}>You need to be signed in to view your dashboard.</p>
        <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>Sign In</Link>
      </div>
    </div>
  );

  const confirmedTrees = myTrees.filter((t) => t.status === 'confirmed').length;
  const pendingTrees = myTrees.filter((t) => t.status === 'pending').length;

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '2rem 1.5rem' }}>
      <div className="container">
        {/* Header */}
        <div className="flex items-center gap-4" style={{ marginBottom: '2rem', flexWrap: 'wrap' }}>
          {user.avatarUrl && (
            <img src={user.avatarUrl} alt="avatar" style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid var(--color-green-primary)' }} />
          )}
          <div>
            <h2 style={{ marginBottom: '0.2rem' }}>Welcome back, <span className="text-green">{user.displayName}</span> 🌱</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>{user.email}</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Link to="/map" className="btn btn-primary" style={{ textDecoration: 'none' }}>+ Plant a Tree</Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="stat-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-icon">🌲</div>
            <div className="stat-value">{user.treesPlanted}</div>
            <div className="stat-label">Trees Planted</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{confirmedTrees}</div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-value">{pendingTrees}</div>
            <div className="stat-label">Pending NGO</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💎</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{balance !== null ? Number(balance).toLocaleString() : '—'}</div>
            <div className="stat-label">ECO Tokens</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Wallet card */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>⛓ Wallet Settings</h3>
            {user.walletAddress ? (
              <div>
                <div className="badge badge-green" style={{ marginBottom: '0.75rem', wordBreak: 'break-all', display: 'block', textAlign: 'left', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>
                  {user.walletAddress}
                </div>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>ECO Balance: <strong className="text-green">{balance ?? '…'} ECO</strong></p>
              </div>
            ) : (
              <div>
                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Connect your Initia wallet to receive NFTs and ECO tokens.</p>
                <input
                  className="input"
                  placeholder="0x... your Initia wallet address"
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                  style={{ marginBottom: '0.75rem' }}
                />
                <button className="btn btn-primary w-full" onClick={handleSaveWallet} disabled={savingWallet || !walletInput}>
                  {savingWallet ? 'Saving…' : 'Link Wallet'}
                </button>
              </div>
            )}
          </div>

          {/* Impact card */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>🌍 Your Real-World Impact</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'CO₂ Offset (est.)', value: `${(user.treesPlanted * 22).toLocaleString()} kg` },
                { label: 'Real Trees Planted', value: confirmedTrees.toString() },
                { label: 'Rank', value: '🥉 Sapling' },
                { label: 'Next Rank at', value: '50 Trees' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-green-light)', fontSize: '0.9rem' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Trees table */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>🌳 My Trees</h3>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><div className="spinner" /></div>
          ) : myTrees.length === 0 ? (
            <div className="text-center" style={{ padding: '2rem' }}>
              <p className="text-muted" style={{ marginBottom: '1rem' }}>You haven't planted any trees yet!</p>
              <Link to="/map" className="btn btn-primary" style={{ textDecoration: 'none' }}>🗺 Go to World Map</Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {['Location', 'Coordinates', 'Status', 'NFT Token', 'Date'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.6rem 0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {myTrees.map((tree) => (
                    <tr key={tree.id} style={{ borderBottom: '1px solid rgba(74,222,128,0.06)' }}>
                      <td style={{ padding: '0.75rem' }}>{tree.locationName || '—'}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{parseFloat(tree.latitude).toFixed(4)}, {parseFloat(tree.longitude).toFixed(4)}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${tree.status === 'confirmed' ? 'badge-green' : 'badge-blue'}`}>
                          {tree.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--color-text-muted)' }}>{tree.tokenId ? `#${tree.tokenId}` : '—'}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{new Date(tree.plantedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
