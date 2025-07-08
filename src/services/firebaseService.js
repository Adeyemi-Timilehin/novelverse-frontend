import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  increment
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Novel Services
export const novelService = {
  // Get all novels
  async getAllNovels() {
    try {
      const novelsRef = collection(db, 'novels');
      const snapshot = await getDocs(novelsRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching novels:', error);
      throw error;
    }
  },

  // Get featured novels
  async getFeaturedNovels() {
    try {
      const novelsRef = collection(db, 'novels');
      const q = query(novelsRef, where('isFeatured', '==', true), limit(6));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching featured novels:', error);
      throw error;
    }
  },

  // Get trending novels
  async getTrendingNovels() {
    try {
      const novelsRef = collection(db, 'novels');
      const q = query(novelsRef, orderBy('views', 'desc'), limit(8));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching trending novels:', error);
      throw error;
    }
  },

  // Get novel by ID
  async getNovelById(novelId) {
    try {
      const novelDoc = await getDoc(doc(db, 'novels', novelId));
      if (novelDoc.exists()) {
        return {
          id: novelDoc.id,
          ...novelDoc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching novel:', error);
      throw error;
    }
  },

  // Get novels by genre
  async getNovelsByGenre(genre) {
    try {
      const novelsRef = collection(db, 'novels');
      const q = query(novelsRef, where('genres', 'array-contains', genre));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching novels by genre:', error);
      throw error;
    }
  },

  // Increment novel views
  async incrementViews(novelId) {
    try {
      const novelRef = doc(db, 'novels', novelId);
      await updateDoc(novelRef, {
        views: increment(1)
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }
  },

  // Add novel to favorites (like)
  async toggleLike(novelId) {
    try {
      const novelRef = doc(db, 'novels', novelId);
      await updateDoc(novelRef, {
        likes: increment(1)
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }
};

// Chapter Services
export const chapterService = {
  // Get chapters for a novel
  async getChaptersByNovelId(novelId) {
    try {
      const chaptersRef = collection(db, 'chapters');
      const q = query(
        chaptersRef, 
        where('novelId', '==', novelId), 
        orderBy('chapterNumber', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching chapters:', error);
      throw error;
    }
  },

  // Get chapter by ID
  async getChapterById(chapterId) {
    try {
      const chapterDoc = await getDoc(doc(db, 'chapters', chapterId));
      if (chapterDoc.exists()) {
        return {
          id: chapterDoc.id,
          ...chapterDoc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching chapter:', error);
      throw error;
    }
  },

  // Get specific chapter by novel and chapter number
  async getChapterByNumber(novelId, chapterNumber) {
    try {
      const chaptersRef = collection(db, 'chapters');
      const q = query(
        chaptersRef,
        where('novelId', '==', novelId),
        where('chapterNumber', '==', parseInt(chapterNumber))
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching chapter by number:', error);
      throw error;
    }
  },

  // Validate chapter access
  async validateChapterAccess(userId, chapterId, userProfile) {
    try {
      const chapter = await this.getChapterById(chapterId);
      if (!chapter) {
        throw new Error('Chapter not found');
      }

      // Free chapter
      if (!chapter.isPremium) {
        return {
          hasAccess: userProfile.dailyFreeChapters > 0,
          requiresCoins: false,
          requiresFreeChapter: true,
          chapter
        };
      }

      // Premium chapter - check subscription or coins
      const hasSubscription = userProfile.subscriptionActive && 
        (userProfile.subscriptionExpires === null || 
         new Date(userProfile.subscriptionExpires) > new Date());

      if (hasSubscription) {
        return {
          hasAccess: true,
          requiresCoins: false,
          requiresFreeChapter: false,
          chapter
        };
      }

      // Check coins
      const hasEnoughCoins = userProfile.coins >= (chapter.coinCost || 2);
      return {
        hasAccess: hasEnoughCoins,
        requiresCoins: true,
        requiresFreeChapter: false,
        coinCost: chapter.coinCost || 2,
        chapter
      };
    } catch (error) {
      console.error('Error validating chapter access:', error);
      throw error;
    }
  }
};

// Discussion Services
export const discussionService = {
  // Get discussions for a novel
  async getDiscussionsByNovelId(novelId) {
    try {
      const discussionsRef = collection(db, 'discussions');
      const q = query(
        discussionsRef,
        where('novelId', '==', novelId),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching discussions:', error);
      throw error;
    }
  },

  // Get all recent discussions
  async getRecentDiscussions(limitCount = 20) {
    try {
      const discussionsRef = collection(db, 'discussions');
      const q = query(
        discussionsRef,
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching recent discussions:', error);
      throw error;
    }
  },

  // Add new discussion
  async addDiscussion(userId, novelId, content) {
    try {
      const discussionData = {
        userId,
        novelId,
        content,
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: 0
      };

      const docRef = await addDoc(collection(db, 'discussions'), discussionData);
      return {
        id: docRef.id,
        ...discussionData
      };
    } catch (error) {
      console.error('Error adding discussion:', error);
      throw error;
    }
  },

  // Toggle discussion like
  async toggleDiscussionLike(discussionId) {
    try {
      const discussionRef = doc(db, 'discussions', discussionId);
      await updateDoc(discussionRef, {
        likes: increment(1)
      });
    } catch (error) {
      console.error('Error toggling discussion like:', error);
      throw error;
    }
  }
};

// Transaction Services
export const transactionService = {
  // Record transaction
  async recordTransaction(userId, amount, status, gateway, metadata = {}) {
    try {
      const transactionData = {
        userId,
        amount,
        status, // 'pending', 'completed', 'failed'
        gateway, // 'stripe', 'flutterwave', 'paystack'
        metadata,
        timestamp: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'transactions'), transactionData);
      return {
        id: docRef.id,
        ...transactionData
      };
    } catch (error) {
      console.error('Error recording transaction:', error);
      throw error;
    }
  },

  // Get user transactions
  async getUserTransactions(userId) {
    try {
      const transactionsRef = collection(db, 'transactions');
      const q = query(
        transactionsRef,
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      throw error;
    }
  }
};

// Analytics Services
export const analyticsService = {
  // Log chapter read event
  async logChapterRead(userId, novelId, chapterId) {
    try {
      const eventData = {
        userId,
        novelId,
        chapterId,
        event: 'chapter_read',
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, 'analytics'), eventData);
    } catch (error) {
      console.error('Error logging chapter read:', error);
      // Don't throw error for analytics
    }
  },

  // Log purchase event
  async logPurchase(userId, amount, type) {
    try {
      const eventData = {
        userId,
        amount,
        type, // 'coins', 'subscription'
        event: 'purchase_completed',
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, 'analytics'), eventData);
    } catch (error) {
      console.error('Error logging purchase:', error);
      // Don't throw error for analytics
    }
  }
};

