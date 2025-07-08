import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Import contexts
import { AuthProvider } from './contexts/AuthContext';

// Import pages
import HomePage from './pages/HomePage';
import NovelPage from './pages/NovelPage';
import ChapterPage from './pages/ChapterPage';
import ShopPage from './pages/ShopPage';
import SubscriptionPage from './pages/SubscriptionPage';
import DashboardPage from './pages/DashboardPage';
import CommunityPage from './pages/CommunityPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/novel/:id" element={<NovelPage />} />
              <Route path="/novel/:novelId/chapter/:chapterId" element={<ChapterPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

