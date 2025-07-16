import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, Heart, Share2, Clock, User, 
  TrendingUp, BookOpen, Users, Plus, Search 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const CommunityPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [selectedNovel, setSelectedNovel] = useState('');

  useEffect(() => {
    // Mock API calls - will be replaced with Firebase and Instagram API
    setTimeout(() => {
      setDiscussions([
        {
          id: 1,
          userId: 1,
          userName: 'BookLover23',
          userAvatar: '/api/placeholder/40/40',
          novelId: 1,
          novelTitle: "The Dragon's Legacy",
          content: "Just finished Chapter 15 and I'm absolutely blown away! The character development is incredible. What did everyone think about Aria's transformation?",
          timestamp: '2024-01-20T10:30:00Z',
          likes: 24,
          replies: 8,
          isLiked: false
        },
        {
          id: 2,
          userId: 2,
          userName: 'FantasyFan',
          userAvatar: '/api/placeholder/40/40',
          novelId: 2,
          novelTitle: "Love in Silicon Valley",
          content: "The romance in this story is so well-written! The chemistry between the main characters feels so natural. Can't wait for the next chapter!",
          timestamp: '2024-01-20T09:15:00Z',
          likes: 18,
          replies: 5,
          isLiked: true
        },
        {
          id: 3,
          userId: 3,
          userName: 'SciFiReader',
          userAvatar: '/api/placeholder/40/40',
          novelId: 3,
          novelTitle: "Stellar Horizons",
          content: "The world-building in this novel is phenomenal. The author really thought through every detail of the space colony. Highly recommend!",
          timestamp: '2024-01-20T08:45:00Z',
          likes: 31,
          replies: 12,
          isLiked: false
        }
      ]);

      setInstagramPosts([
        {
          id: 1,
          imageUrl: '/api/placeholder/300/300',
          caption: 'New chapter of The Dragon\'s Legacy is live! 🐉✨ #NovelVerse #Fantasy',
          likes: 156,
          timestamp: '2024-01-20T12:00:00Z'
        },
        {
          id: 2,
          imageUrl: '/api/placeholder/300/300',
          caption: 'Which genre is your favorite? Tell us in the comments! 📚❤️ #Reading #BookLovers',
          likes: 203,
          timestamp: '2024-01-19T15:30:00Z'
        },
        {
          id: 3,
          imageUrl: '/api/placeholder/300/300',
          caption: 'Weekend reading vibes ☕📖 What are you reading this weekend?',
          likes: 89,
          timestamp: '2024-01-19T10:00:00Z'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleLike = (discussionId) => {
    setDiscussions(prev => prev.map(discussion => 
      discussion.id === discussionId 
        ? { 
            ...discussion, 
            isLiked: !discussion.isLiked,
            likes: discussion.isLiked ? discussion.likes - 1 : discussion.likes + 1
          }
        : discussion
    ));
  };

  const handleShare = (discussion) => {
    const shareUrl = `https://novelverse.com/community/discussion/${discussion.id}`;
    if (navigator.share) {
      navigator.share({
        title: `Discussion about ${discussion.novelTitle}`,
        text: discussion.content,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Discussion link copied to clipboard!');
    }
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPost.trim() || !selectedNovel) {
      toast.error('Please select a novel and write your thoughts!');
      return;
    }

    const newDiscussion = {
      id: discussions.length + 1,
      userId: 999,
      userName: 'You',
      userAvatar: '/api/placeholder/40/40',
      novelId: parseInt(selectedNovel),
      novelTitle: selectedNovel === '1' ? "The Dragon's Legacy" : selectedNovel === '2' ? "Love in Silicon Valley" : "Stellar Horizons",
      content: newPost,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: 0,
      isLiked: false
    };

    setDiscussions(prev => [newDiscussion, ...prev]);
    setNewPost('');
    setSelectedNovel('');
    toast.success('Your discussion has been posted!');
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
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
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              NoveVerse Community
            </h1>
            <p className="text-lg text-gray-600">
              Connect with fellow readers, share your thoughts, and discover new stories
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* New Post Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Start a Discussion</h2>
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div>
                  <select
                    value={selectedNovel}
                    onChange={(e) => setSelectedNovel(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="">Select a novel to discuss...</option>
                    <option value="1">The Dragon's Legacy</option>
                    <option value="2">Love in Silicon Valley</option>
                    <option value="3">Stellar Horizons</option>
                  </select>
                </div>
                <div>
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your thoughts about this novel..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 h-24 resize-none"
                    required
                  />
                </div>
                <Button type="submit" className="novelverse-button-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Discussion
                </Button>
              </form>
            </div>

            {/* Discussions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Discussions</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Trending
                  </Button>
                  <Button variant="outline" size="sm">
                    <Clock className="h-4 w-4 mr-1" />
                    Latest
                  </Button>
                </div>
              </div>

              {discussions.map((discussion) => (
                <div key={discussion.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={discussion.userAvatar}
                      alt={discussion.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{discussion.userName}</span>
                        <span className="text-gray-500">•</span>
                        <Link 
                          to={`/novel/${discussion.novelId}`}
                          className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                          {discussion.novelTitle}
                        </Link>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500 text-sm">{formatTimeAgo(discussion.timestamp)}</span>
                      </div>
                      <p className="text-gray-800 mb-4 leading-relaxed">
                        {discussion.content}
                      </p>
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(discussion.id)}
                          className={`flex items-center space-x-1 transition-colors ${
                            discussion.isLiked 
                              ? 'text-red-500 hover:text-red-600' 
                              : 'text-gray-500 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${discussion.isLiked ? 'fill-current' : ''}`} />
                          <span className="text-sm">{discussion.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-purple-600 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">{discussion.replies}</span>
                        </button>
                        <button
                          onClick={() => handleShare(discussion)}
                          className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-700">Active Members</span>
                  </div>
                  <span className="font-bold text-gray-900">12,543</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Discussions</span>
                  </div>
                  <span className="font-bold text-gray-900">3,891</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Novels Discussed</span>
                  </div>
                  <span className="font-bold text-gray-900">247</span>
                </div>
              </div>
            </div>

            {/* Instagram Feed */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Latest from Instagram</h3>
                <a 
                  href="https://instagram.com/novelverse" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Follow us →
                </a>
              </div>
              <div className="space-y-4">
                {instagramPosts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt="Instagram post"
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                      <p className="text-sm text-gray-800 mb-2">{post.caption}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{post.likes} likes</span>
                        </div>
                        <span>{formatTimeAgo(post.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Topics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Topics</h3>
              <div className="space-y-2">
                {['#Fantasy', '#Romance', '#SciFi', '#BookRecommendations', '#NewChapters'].map((topic) => (
                  <button
                    key={topic}
                    className="block w-full text-left px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;

