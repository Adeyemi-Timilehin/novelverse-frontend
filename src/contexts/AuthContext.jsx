import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user profile from Firestore
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const fetchUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const createUserProfile = async (uid, userData) => {
    try {
      const userProfile = {
        uid,
        email: userData.email,
        displayName: userData.displayName || '',
        dailyFreeChapters: 5,
        lastReset: new Date().toISOString().split('T')[0],
        coins: 1, // Welcome coin
        subscriptionActive: false,
        subscriptionExpires: null,
        referralCode: generateReferralCode(),
        referredBy: null,
        fcmToken: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', uid), userProfile);
      setUserProfile(userProfile);
      return userProfile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const signUp = async (email, password, displayName) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(firebaseUser, { displayName });
      
      // Create user profile in Firestore
      await createUserProfile(firebaseUser.uid, {
        email,
        displayName
      });

      toast.success('Account created successfully!');
      return firebaseUser;
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!');
      return firebaseUser;
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user: firebaseUser } = await signInWithPopup(auth, provider);
      
      // Check if user profile exists, create if not
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        await createUserProfile(firebaseUser.uid, {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName
        });
      }

      toast.success('Signed in with Google successfully!');
      return firebaseUser;
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const updateUserProfile = async (updates) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      setUserProfile(prev => ({ ...prev, ...updates }));
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const useCoins = async (amount) => {
    if (!userProfile || userProfile.coins < amount) {
      throw new Error('Insufficient coins');
    }

    try {
      const newCoinBalance = userProfile.coins - amount;
      await updateDoc(doc(db, 'users', user.uid), {
        coins: newCoinBalance,
        updatedAt: new Date().toISOString()
      });
      
      setUserProfile(prev => ({ ...prev, coins: newCoinBalance }));
      return newCoinBalance;
    } catch (error) {
      console.error('Error using coins:', error);
      throw error;
    }
  };

  const addCoins = async (amount) => {
    if (!userProfile) return;

    try {
      const newCoinBalance = userProfile.coins + amount;
      await updateDoc(doc(db, 'users', user.uid), {
        coins: newCoinBalance,
        updatedAt: new Date().toISOString()
      });
      
      setUserProfile(prev => ({ ...prev, coins: newCoinBalance }));
      return newCoinBalance;
    } catch (error) {
      console.error('Error adding coins:', error);
      throw error;
    }
  };

  const useFreeChapter = async () => {
    if (!userProfile || userProfile.dailyFreeChapters <= 0) {
      throw new Error('No free chapters remaining');
    }

    try {
      const newFreeChapters = userProfile.dailyFreeChapters - 1;
      await updateDoc(doc(db, 'users', user.uid), {
        dailyFreeChapters: newFreeChapters,
        updatedAt: new Date().toISOString()
      });
      
      setUserProfile(prev => ({ ...prev, dailyFreeChapters: newFreeChapters }));
      return newFreeChapters;
    } catch (error) {
      console.error('Error using free chapter:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    updateUserProfile,
    useCoins,
    addCoins,
    useFreeChapter,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

