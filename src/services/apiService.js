import { auth } from '../lib/firebase';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://us-central1-novelverse-app.cloudfunctions.net/api'
  : 'http://localhost:5001/novelverse-app/us-central1/api';

// Helper function to get auth token
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

// Helper function to make authenticated requests
const makeRequest = async (url, options = {}) => {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

export const apiService = {
  // Novel endpoints
  async getNovels() {
    return makeRequest('/novels');
  },

  async getFeaturedNovels() {
    return makeRequest('/novels/featured');
  },

  async getNovel(id) {
    return makeRequest(`/novels/${id}`);
  },

  async getNovelChapters(novelId) {
    return makeRequest(`/novels/${novelId}/chapters`);
  },

  async getChapter(chapterId) {
    return makeRequest(`/chapters/${chapterId}`);
  },

  // User endpoints
  async getUserProfile() {
    return makeRequest('/user/profile');
  },

  async updateUserProfile(updates) {
    return makeRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async addToLibrary(novelId) {
    return makeRequest(`/user/library/${novelId}`, {
      method: 'POST',
    });
  },

  // Payment endpoints
  async createPaymentIntent(amount, metadata) {
    return makeRequest('/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, metadata }),
    });
  },

  // Community endpoints
  async getDiscussions(novelId = null, limit = 20) {
    const params = new URLSearchParams();
    if (novelId) params.append('novelId', novelId);
    params.append('limit', limit.toString());
    
    return makeRequest(`/discussions?${params.toString()}`);
  },

  async createDiscussion(novelId, novelTitle, content) {
    return makeRequest('/discussions', {
      method: 'POST',
      body: JSON.stringify({ novelId, novelTitle, content }),
    });
  },

  // Analytics endpoints
  async trackReadingProgress(novelId, chapterId, timeSpent) {
    return makeRequest('/analytics/reading-progress', {
      method: 'POST',
      body: JSON.stringify({ novelId, chapterId, timeSpent }),
    });
  },

  // Search functionality
  async searchNovels(query, filters = {}) {
    const novels = await this.getNovels();
    
    // Simple client-side search (in production, this would be server-side)
    return novels.filter(novel => {
      const matchesQuery = !query || 
        novel.title.toLowerCase().includes(query.toLowerCase()) ||
        novel.author.toLowerCase().includes(query.toLowerCase()) ||
        novel.synopsis.toLowerCase().includes(query.toLowerCase());
      
      const matchesGenre = !filters.genre || 
        novel.genres.includes(filters.genre);
      
      const matchesStatus = !filters.status || 
        novel.status === filters.status;
      
      return matchesQuery && matchesGenre && matchesStatus;
    });
  },

  // Recommendation system
  async getRecommendations(userId) {
    try {
      const userProfile = await this.getUserProfile();
      const allNovels = await this.getNovels();
      
      // Simple recommendation based on user's library genres
      const userGenres = userProfile.stats?.favoriteGenres || [];
      
      return allNovels
        .filter(novel => 
          novel.genres.some(genre => userGenres.includes(genre)) &&
          !userProfile.library?.includes(novel.id)
        )
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  },

  // Reading statistics
  async getReadingStats(userId) {
    try {
      const userProfile = await this.getUserProfile();
      return {
        chaptersRead: userProfile.stats?.chaptersRead || 0,
        timeSpent: userProfile.stats?.timeSpent || 0,
        favoriteGenres: userProfile.stats?.favoriteGenres || [],
        librarySize: userProfile.library?.length || 0,
        coins: userProfile.coins || 0,
        isPremium: userProfile.isPremium || false,
      };
    } catch (error) {
      console.error('Error getting reading stats:', error);
      return null;
    }
  },
};

