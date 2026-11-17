import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import Loader from './components/common/Loader';
import toast from 'react-hot-toast';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import ApplicationsPage from './pages/ApplicationsPage';
import TalentPoolPage from './pages/TalentPoolPage';
import InterviewsPage from './pages/InterviewsPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader text="Loading SmartHire..." />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Listen for Google OAuth redirect callback with access_token in URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const token = params.get('access_token');
      if (token) {
        window.history.replaceState(null, '', window.location.pathname);
        toast.loading('Authenticating with Google...', { id: 'google-auth' });
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then(async (profile) => {
            await loginWithGoogle({
              email: profile.email,
              first_name: profile.given_name || profile.name?.split(' ')[0] || 'User',
              last_name: profile.family_name || profile.name?.split(' ').slice(1).join(' ') || '',
              avatar: profile.picture || null,
              role: 'RECRUITER',
            });
            toast.success(`Welcome back, ${profile.name || profile.email}!`, { id: 'google-auth' });
            navigate('/dashboard');
          })
          .catch(() => {
            toast.error('Google authentication verification failed.', { id: 'google-auth' });
          });
      }
    }
  }, [loginWithGoogle, navigate]);

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Protected with Layout */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/talent-pool" element={<TalentPoolPage />} />
        <Route path="/interviews" element={<InterviewsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/requests" element={<DashboardPage />} />
        <Route path="/notifications-page" element={<DashboardPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
