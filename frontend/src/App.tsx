import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { WorldMapPage } from './pages/WorldMapPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { useAuthStore } from './store/authStore';
import './index.css';

function App() {
  const { token, fetchMe } = useAuthStore();

  // Restore session on mount
  useEffect(() => {
    if (token) fetchMe();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/map" element={<WorldMapPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
