import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, Coins, User, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthAction = async () => {
    if (user) {
      await logout();
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <span className="novelverse-text-gradient text-2xl font-bold">
              NovelVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/community" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Community
            </Link>
            <Link 
              to="/shop" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center space-x-1"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Shop</span>
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                {userProfile && (
                  <div className="coin-display">
                    <Coins className="h-4 w-4" />
                    <span>{userProfile.coins || 0}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">
                    {userProfile?.displayName || user.displayName || user.email}
                  </span>
                </div>
                <Button 
                  onClick={handleAuthAction}
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate('/register')}
                  className="novelverse-button-primary"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              onClick={toggleMenu}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link 
                to="/" 
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/community" 
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <Link 
                to="/shop" 
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              
              {user && (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-2 text-gray-700 hover:text-purple-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {userProfile && (
                    <div className="px-3 py-2">
                      <div className="coin-display">
                        <Coins className="h-4 w-4" />
                        <span>{userProfile.coins || 0} Coins</span>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              <div className="px-3 py-2 space-y-2">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <User className="h-5 w-5" />
                      <span className="font-medium">
                        {userProfile?.displayName || user.displayName || user.email}
                      </span>
                    </div>
                    <Button 
                      onClick={handleAuthAction}
                      variant="outline"
                      className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                    >
                      Login
                    </Button>
                    <Button 
                      onClick={() => {
                        navigate('/register');
                        setIsMenuOpen(false);
                      }}
                      className="w-full novelverse-button-primary"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

