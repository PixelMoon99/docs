import React from 'react';
import VIPProgress from './components/VIPProgress';
import AdminPricing from './components/AdminPricing';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ImageUpload from './components/ImageUpload';
import VoucherForm from './components/VoucherForm';
import OTPLogin from './components/OTPLogin';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/context/ThemeContext';
import { AuthProvider } from './components/context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import HomePage from './components/pages/Home/Home';
import AuthPage from './components/pages/Login/AuthPage';
import GamesPage from './components/pages/Games/GameListing';
import GameDisplay from './components/pages/Games/GameDisplay';
import AdminPanel from './components/pages/Admin/Admin';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import TailwindTest from './components/pages/Admin/TailwindTest';
import LeaderboardPage from './components/pages/Leaderboard/Leaderboard';
import DashboardPage from './components/pages/Dashboard/Dashboardco';
import PaymentSuccess from './components/pages/Games/PaymentSuccess';
import PaymentCallback from './components/pages/Games/PaymentCallback';
import BlogMiniCards from './components/Blog/BlogMiniCard';
import BlogPage from './components/Blog/BlogPage';
import BlogsListPage from './components/Blog/BlogListPage';
import Aboutus from './components/pages/About/About';
import TermsAndConditions from './components/TermsAndConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import RefundPolicy from './components/RefundPolicy';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import './index.css';
import DeveloperPage from './components/pages/Developer/Developer';
import NotificationBar from './components/NotificationBar';
import MobileHome from './components/pages/Home/MobileHome';
import MobileAccount from './components/pages/Account/MobileAccount';
import MobileReports from './components/pages/Reports/MobileReports';
import MoodSeasonSwitcher from './components/MoodSeasonSwitcher';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  React.useEffect(() => {
    const handleResize = () => { setIsMobile(window.innerWidth <= 768); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== 'https://zentry-blond.vercel.app') return;
      if (event.data.type === 'NAVIGATE') { navigate(event.data.path); }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  return (
    <div className="app">
      {!isHomePage && <MoodSeasonSwitcher />}
      {!isHomePage && <Navbar />}
      {!isHomePage && <NotificationBar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <div style={{ height: '100vh', width: '100%' }}>
              <iframe 
                src="https://zentry-blond.vercel.app/"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  border: 'none',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1000
                }}
                title="Gaming Homepage"
                loading="lazy"
              />
            </div>
          } />
          <Route path="/home" element={isMobile ? <MobileHome /> : <HomePage />} />
          <Route path="/account" element={
            <ProtectedRoute>
              {isMobile ? <MobileAccount /> : <Navigate to="/user-dashboard/my-account" replace />}
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              {isMobile ? <MobileReports /> : <Navigate to="/user-dashboard/orders" replace />}
            </ProtectedRoute>
          } />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/developer" element={<DeveloperPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route 
            path="/games/:gameId" 
            element={
              <ProtectedRoute>
                <GameDisplay />
              </ProtectedRoute>
            } 
          />
          <Route path="/blogs" element={<BlogsListPage />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/payment/callback" element={<PaymentCallback />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/user-dashboard/*" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/tailwind-test" element={<TailwindTest />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/admin/api-keys" element={<AdminPricing/>} />
        </Routes>
      </main>
      {!isHomePage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

export function DevTools(){
  return (<div style={{padding:20}}>
    <h2>Dev Tools</h2>
    <VIPProgress current={140} required={200} />
    <AdminPricing />
    <AnalyticsDashboard />
    <ImageUpload />
    <VoucherForm />
    <OTPLogin />
  </div>);
}
