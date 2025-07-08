import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye, Heart, Clock, TrendingUp, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiService } from '../services/apiService';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [featuredNovels, setFeaturedNovels] = useState([]);
  const [trendingNovels, setTrendingNovels] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - will be replaced with Firebase data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFeaturedNovels([
        {
          id: 1,
          title: "The Dragon's Legacy",
          author: "Sarah Chen",
          coverUrl: "/api/placeholder/300/400",
          synopsis: "A young mage discovers her connection to ancient dragons in this epic fantasy adventure.",
          genres: ["Fantasy", "Adventure"],
          rating: 4.8,
          views: 125000,
          likes: 8500,
          totalChapters: 45,
          freeChapters: 5,
          isFeatured: true
        },
        {
          id: 2,
          title: "Love in Silicon Valley",
          author: "Michael Rodriguez",
          coverUrl: "/api/placeholder/300/400",
          synopsis: "A tech entrepreneur and a coffee shop owner find love in the heart of innovation.",
          genres: ["Romance", "Contemporary"],
          rating: 4.6,
          views: 89000,
          likes: 6200,
          totalChapters: 32,
          freeChapters: 5,
          isFeatured: true
        },
        {
          id: 3,
          title: "Stellar Horizons",
          author: "Dr. Emma Watson",
          coverUrl: "/api/placeholder/300/400",
          synopsis: "Humanity's first interstellar colony faces unexpected challenges in this gripping sci-fi tale.",
          genres: ["Sci-Fi", "Thriller"],
          rating: 4.9,
          views: 156000,
          likes: 11200,
          totalChapters: 38,
          freeChapters: 5,
          isFeatured: true
        }
      ]);

      setTrendingNovels([
        {
          id: 4,
          title: "The Midnight Detective",
          author: "James Parker",
          coverUrl: "/api/placeholder/300/400",
          synopsis: "A detective with supernatural abilities solves crimes that others cannot.",
          genres: ["Mystery", "Supernatural"],
          rating: 4.7,
          views: 78000,
          likes: 5400,
          totalChapters: 28,
          freeChapters: 5
        },
        {
          id: 5,
          title: "Royal Deception",
          author: "Isabella Martinez",
          coverUrl: "/api/placeholder/300/400",
          synopsis: "A commoner must navigate royal politics while hiding her true identity.",
          genres: ["Historical", "Romance"],
          rating: 4.5,
          views: 92000,
          likes: 7100,
          totalChapters: 41,
          freeChapters: 5
        }
      ]);

      setGenres([
        "Fantasy", "Romance", "Sci-Fi", "Mystery", "Thriller", 
        "Historical", "Contemporary", "Adventure", "Supernatural"
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const NovelCard = ({ novel, featured = false }) => (
    <div className={`novelverse-card ${featured ? 'md:col-span-2' : ''} group cursor-pointer`}>
      <Link to={`/novel/${novel.id}`}>
        <div className="relative">
          <img 
            src={novel.coverUrl} 
            alt={novel.title}
            className={`w-full ${featured ? 'h-80' : 'h-64'} object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300`}
          />
          {novel.isFeatured && (
            <div className="absolute top-3 left-3">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                Featured
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <div className="flex items-center space-x-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{novel.rating}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className={`font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors ${featured ? 'text-xl' : 'text-lg'}`}>
            {novel.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2">by {novel.author}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {novel.genres.map((genre) => (
              <span key={genre} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
          
          <p className="text-gray-700 text-sm mb-4 overflow-hidden" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {novel.synopsis}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{(novel.views / 1000).toFixed(1)}k</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{(novel.likes / 1000).toFixed(1)}k</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>{novel.totalChapters} chapters</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="free-badge">
              {novel.freeChapters} Free Chapters
            </span>
            <Button 
              size="sm" 
              className="novelverse-button-primary text-sm px-4 py-2"
            >
              Read Now
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="novelverse-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to NovelVerse
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover amazing stories, read 5 free chapters daily, and join a community of book lovers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Start Reading
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 text-lg font-semibold"
            >
              Join Community
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Novels */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Novels</h2>
            <Link to="/novels" className="text-purple-600 hover:text-purple-700 font-medium">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredNovels.map((novel) => (
              <NovelCard key={novel.id} novel={novel} featured={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Novels */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
            </div>
            <Link to="/trending" className="text-purple-600 hover:text-purple-700 font-medium">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingNovels.map((novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))}
          </div>
        </div>
      </section>

      {/* Genres Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Explore by Genre</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {genres.map((genre) => (
              <Link
                key={genre}
                to={`/genre/${genre.toLowerCase()}`}
                className="bg-white border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 px-6 py-3 rounded-full font-medium text-purple-700 transition-all duration-200 hover:scale-105"
              >
                {genre}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Reading Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of readers and discover your next favorite story today
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            Sign Up Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

