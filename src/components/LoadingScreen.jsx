import { BookOpen } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <BookOpen className="h-16 w-16 text-purple-600 animate-pulse" />
            <div className="absolute inset-0 bg-purple-600 opacity-20 rounded-full animate-ping"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">NoveVerse</h2>
        <p className="text-gray-600">Loading your reading experience...</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

