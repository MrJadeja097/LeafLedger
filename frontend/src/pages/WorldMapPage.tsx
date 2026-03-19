import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAllTrees, getTreeStats, plantTree } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Link } from 'react-router-dom';

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

interface PlantModal { lat: number; lng: number; }

function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng.lat, e.latlng.lng) });
  return null;
}

export function WorldMapPage() {
  const { user } = useAuthStore();
  const theme = useThemeStore((state) => state.theme);
  const [trees, setTrees] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [plantModal, setPlantModal] = useState<PlantModal | null>(null);
  const [locationName, setLocationName] = useState('');
  const [ngoPartner, setNgoPartner] = useState('GreenEarth NGO');
  const [planting, setPlanting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    getAllTrees().then(setTrees).catch(() => {});
    getTreeStats().then(setStats).catch(() => {});
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    if (!user) return;
    setPlantModal({ lat, lng });
    setLocationName('');
    setSuccessMsg('');
  };

  const handlePlant = async () => {
    if (!plantModal) return;
    setPlanting(true);
    try {
      const tree = await plantTree({
        latitude: plantModal.lat,
        longitude: plantModal.lng,
        locationName: locationName || `${plantModal.lat.toFixed(4)}, ${plantModal.lng.toFixed(4)}`,
        ngoPartner,
      });
      setTrees((prev) => [...prev, tree]);
      setSuccessMsg('🌳 Tree planted! Your NFT is being minted on Initia.');
      setPlantModal(null);
      getTreeStats().then(setStats).catch(() => {});
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to plant tree. Please try again.');
    } finally {
      setPlanting(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header bar */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.1rem' }}>🗺 World <span className="text-green">Tree Map</span></h2>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
            {user ? 'Click anywhere on the map to plant a tree' : 'Sign in to plant trees'}
          </p>
        </div>
        <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
          <button
            onClick={useThemeStore.getState().toggleTheme}
            className="btn btn-surface"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            {theme === 'dark' ? '☀️ Light Tiles' : '🌙 Dark Tiles'}
          </button>
          
          {stats && (
            <>
              <div className="badge badge-green">🌲 {stats.totalTrees} Total Trees</div>
              <div className="badge badge-blue">✅ {stats.confirmedTrees} Confirmed</div>
            </>
          )}
          {!user && <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none', padding: '0.4rem 1rem' }}>Sign In to Plant</Link>}
        </div>
      </div>

      {successMsg && (
        <div style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.35)', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1.5rem', margin: '0.75rem 1.5rem', color: 'var(--color-green-primary)', fontWeight: 500 }}>
          {successMsg}
        </div>
      )}

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          style={{ height: 'calc(100vh - 180px)', width: '100%' }}
          maxBounds={[[-90, -180], [90, 180]]}
        >
          <TileLayer
            key={theme} // Force re-render of TileLayer when theme changes
            url={
              theme === 'light'
                ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            }
            attribution='© <a href="https://carto.com/">CARTO</a>'
          />
          <ClickHandler onMapClick={handleMapClick} />

          {/* Planted trees */}
          {trees.map((tree) => (
            <Marker
              key={tree.id}
              position={[parseFloat(tree.latitude), parseFloat(tree.longitude)]}
              icon={tree.status === 'confirmed' ? greenIcon : blueIcon}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <strong>🌳 {tree.locationName || 'Tree'}</strong>
                  <div style={{ fontSize: '0.8rem', marginTop: '0.35rem', color: 'var(--color-text-muted)' }}>
                    Status: <span style={{ color: tree.status === 'confirmed' ? 'var(--color-green-primary)' : 'var(--color-accent)' }}>{tree.status}</span>
                  </div>
                  {tree.user?.displayName && <div style={{ fontSize: '0.8rem' }}>Planted by: {tree.user.displayName}</div>}
                  {tree.ngoPartner && <div style={{ fontSize: '0.8rem' }}>NGO: {tree.ngoPartner}</div>}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Plant preview marker */}
          {plantModal && (
            <Marker position={[plantModal.lat, plantModal.lng]}>
              <Popup>📍 Plant here?</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Plant Modal */}
      {plantModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem',
        }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: 420 }}>
            <h3 style={{ marginBottom: '0.25rem' }}>🌱 Plant a Tree</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              📍 {plantModal.lat.toFixed(5)}, {plantModal.lng.toFixed(5)}
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem', display: 'block' }}>Location Name</label>
              <input
                className="input"
                placeholder="e.g. Amazon Rainforest, Brazil"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem', display: 'block' }}>NGO Partner</label>
              <input
                className="input"
                placeholder="NGO partner"
                value={ngoPartner}
                onChange={(e) => setNgoPartner(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handlePlant} disabled={planting}>
                {planting ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Planting…</> : '🌳 Confirm & Mint'}
              </button>
              <button className="btn btn-secondary" onClick={() => setPlantModal(null)} disabled={planting}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
