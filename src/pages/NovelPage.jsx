import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Eye, Heart, BookOpen, Clock, Lock, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NovelPage = () => {
  const { id } = useParams();
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCoins, setUserCoins] = useState(5);
  const [userFreeChapters, setUserFreeChapters] = useState(5);

  useEffect(() => {
    // Mock API call - will be replaced with Firebase
    setTimeout(() => {
      const mockNovel = {
        id: parseInt(id),
        title: "The Dragon's Legacy",
        author: "Sarah Chen",
        coverUrl: "/api/placeholder/400/600",
        synopsis: "In a world where magic has been forgotten for centuries, Aria discovers she possesses the rare ability to communicate with dragons. As ancient prophecies unfold and dark forces threaten the realm, she must embrace her destiny and unite the scattered dragon clans to save her world from eternal darkness. This epic fantasy adventure spans multiple kingdoms and explores themes of courage, friendship, and the power of believing in oneself.",
        genres: ["Fantasy", "Adventure", "Magic"],
        rating: 4.8,
        views: 125000,
        likes: 8500,
        totalChapters: 45,
        freeChapters: 5,
        isFeatured: true,
        status: "ongoing",
        lastUpdated: "2024-01-15"
      };

      const mockChapters = Array.from({ length: 45 }, (_, i) => ({
        id: i + 1,
        chapterNumber: i + 1,
        title: `Chapter ${i + 1}: ${getChapterTitle(i + 1)}`,
        isPremium: i >= 5,
        coinCost: i >= 5 ? 2 : 0,
        wordCount: Math.floor(Math.random() * 2000) + 1000,
        publishedAt: new Date(2024, 0, 1 + i).toISOString()
      }));

      setNovel(mockNovel);
      setChapters(mockChapters);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getChapterTitle = (chapterNum) => {
    const titles = [
      "The Awakening", "Ancient Whispers", "Dragon's Call", "The First Flight",
      "Shadows of the Past", "The Crystal Cave", "Bonds of Fire", "The Prophecy",
      "Dark Omens", "The Alliance", "Trial by Fire", "The Lost Kingdom",
      "Secrets Revealed", "The Dragon Lord", "Battle of the Skies"
    ];
    return titles[chapterNum % titles.length] || "The Adventure Continues";
  };

  const handleChapterClick = (chapter) => {
    if (!chapter.isPremium) {
      // Free chapter
      return `/novel/${id}/chapter/${chapter.id}`;
    } else {
      // Premium chapter - check if user has coins or subscription
      if (userCoins >= chapter.coinCost) {
        return `/novel/${id}/chapter/${chapter.id}`;
      } else {
        // Redirect to shop or show unlock modal
        return null;
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!novel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Novel Not Found</h2>
          <Link to="/" className="text-purple-600 hover:text-purple-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Novel Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cover Image */}
            <div className="lg:col-span-1">
              <div className="relative">
                <img 
                  src={novel.coverUrl} 
                  alt={novel.title}
                  className="w-full max-w-sm mx-auto lg:max-w-none rounded-lg shadow-lg"
                />
                {novel.isFeatured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Novel Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium">{novel.rating}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600 capitalize">{novel.status}</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {novel.title}
              </h1>
              <p className="text-lg text-gray-600 mb-4">by {novel.author}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {novel.genres.map((genre) => (
                  <span key={genre} className="genre-tag">
                    {genre}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-6 mb-6 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Eye className="h-5 w-5" />
                  <span>{(novel.views / 1000).toFixed(1)}k views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-5 w-5" />
                  <span>{(novel.likes / 1000).toFixed(1)}k likes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-5 w-5" />
                  <span>{novel.totalChapters} chapters</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {novel.synopsis}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to={`/novel/${id}/chapter/1`}
                  className="novelverse-button-primary text-center"
                >
                  Start Reading
                </Link>
                <Button 
                  variant="outline" 
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  Add to Library
                </Button>
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Like
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Chapters</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="free-badge">
                {novel.freeChapters} Free Chapters
              </span>
              <span>•</span>
              <span>Updated: {new Date(novel.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {chapters.map((chapter) => {
              const canRead = !chapter.isPremium || userCoins >= chapter.coinCost;
              const linkTo = handleChapterClick(chapter);

              return (
                <div key={chapter.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {linkTo ? (
                        <Link 
                          to={linkTo}
                          className="block group"
                        >
                          <h3 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                            {chapter.title}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>{chapter.wordCount.toLocaleString()} words</span>
                            <span>•</span>
                            <span>{new Date(chapter.publishedAt).toLocaleDateString()}</span>
                          </div>
                        </Link>
                      ) : (
                        <div className="block">
                          <h3 className="font-medium text-gray-500">
                            {chapter.title}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>{chapter.wordCount.toLocaleString()} words</span>
                            <span>•</span>
                            <span>{new Date(chapter.publishedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      {chapter.isPremium ? (
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-yellow-600">
                            <Coins className="h-4 w-4" />
                            <span className="text-sm font-medium">{chapter.coinCost}</span>
                          </div>
                          {!canRead && (
                            <Lock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      ) : (
                        <span className="free-badge">Free</span>
                      )}

                      {linkTo ? (
                        <Link 
                          to={linkTo}
                          className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                        >
                          Read
                        </Link>
                      ) : (
                        <Link 
                          to="/shop"
                          className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                        >
                          Unlock
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovelPage;

