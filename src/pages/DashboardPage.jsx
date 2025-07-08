import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, BookOpen, Coins, Users, Calendar, TrendingUp, 
  Share2, Copy, Gift, Star, Clock, Heart 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentReads, setRecentReads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call - will be replaced with Firebase
    setTimeout(() => {
      setUser({
        id: 1,
        displayName: 'Sarah Reader',
        email: 'sarah@example.com',
        coins: 15,
        dailyFreeChapters: 3,
        subscriptionActive: false,
        referralCode: 'SARAH2024',
        joinedAt: '2024-01-01'
      });

      setStats({
        totalChaptersRead: 127,
        totalCoinsSpent: 45,
        totalReferrals: 3,
        readingStreak: 12,
        favoriteGenres: ['Fantasy', 'Romance', 'Sci-Fi'],
        totalReadingTime: '24 hours'
      });

      setRecentReads([
        {
          id: 1,
          novelTitle: "The Dragon's Legacy",
          chapterTitle: "Chapter 8: The Alliance",
          readAt: '2024-01-20',
          coverUrl: '/api/placeholder/100/150'
        },
        {
          id: 2,
          novelTitle: "Love in Silicon Valley",
          chapterTitle: "Chapter 15: New Beginnings",
          readAt: '2024-01-19',
          coverUrl: '/api/placeholder/100/150'
        },
        {
          id: 3,
          novelTitle: "Stellar Horizons",
          chapterTitle: "Chapter 12: First Contact",
          readAt: '2024-01-18',
          coverUrl: '/api/placeholder/100/150'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const copyReferralLink = () => {
    const referralLink = `https://novelverse.com/register?ref=${user.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  const shareReferralLink = async () => {
    const referralLink = `https://novelverse.com/register?ref=${user.referralCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join NovelVerse',
          text: 'Join me on NovelVerse and discover amazing stories! Use my referral link to get started.',
          url: referralLink
        });
      } catch (error) {
        copyReferralLink();
      }
    } else {
      copyReferralLink();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-purple-100 p-3 rounded-full">
                <User className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user.displayName}!
                </h1>
                <p className="text-gray-600">
                  Member since {new Date(user.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="coin-display">
                <Coins className="h-5 w-5" />
                <span>{user.coins} coins</span>
              </div>
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <BookOpen className="h-4 w-4" />
                <span>{user.dailyFreeChapters} free chapters left</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reading Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Reading Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-2">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalChaptersRead}</div>
                  <div className="text-sm text-gray-600">Chapters Read</div>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 p-3 rounded-full w-fit mx-auto mb-2">
                    <Coins className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalCoinsSpent}</div>
                  <div className="text-sm text-gray-600">Coins Spent</div>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-2">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalReferrals}</div>
                  <div className="text-sm text-gray-600">Referrals</div>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-2">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.readingStreak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </div>
            </div>

            {/* Recent Reads */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Reads</h2>
                <Link to="/" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  Browse More →
                </Link>
              </div>
              <div className="space-y-4">
                {recentReads.map((read) => (
                  <div key={read.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <img 
                      src={read.coverUrl} 
                      alt={read.novelTitle}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{read.novelTitle}</h3>
                      <p className="text-sm text-gray-600">{read.chapterTitle}</p>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(read.readAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Continue
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Referral Program */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full w-fit mx-auto mb-3">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Refer Friends</h3>
                <p className="text-sm text-gray-600">Get 2 coins for each friend who joins</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Your referral code:</span>
                  <Button
                    onClick={copyReferralLink}
                    size="sm"
                    variant="ghost"
                    className="p-1"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="font-mono text-lg font-bold text-purple-600">
                  {user.referralCode}
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={shareReferralLink}
                  className="w-full novelverse-button-primary"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
                <Button 
                  onClick={copyReferralLink}
                  variant="outline" 
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>

            {/* Favorite Genres */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Favorite Genres</h3>
              <div className="flex flex-wrap gap-2">
                {stats.favoriteGenres.map((genre) => (
                  <span key={genre} className="genre-tag">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/shop">
                  <Button variant="outline" className="w-full justify-start">
                    <Coins className="h-4 w-4 mr-2" />
                    Buy Coins
                  </Button>
                </Link>
                <Link to="/subscription">
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Get Premium
                  </Button>
                </Link>
                <Link to="/community">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Join Community
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

