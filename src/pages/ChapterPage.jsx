import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, Lock, Coins, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const ChapterPage = () => {
  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();
  const [novel, setNovel] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCoins, setUserCoins] = useState(5);
  const [userFreeChapters, setUserFreeChapters] = useState(3);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Mock API call - will be replaced with Firebase
    setTimeout(() => {
      const mockNovel = {
        id: parseInt(novelId),
        title: "The Dragon's Legacy",
        author: "Sarah Chen",
        totalChapters: 45
      };

      const chapterNum = parseInt(chapterId);
      const mockChapter = {
        id: chapterNum,
        chapterNumber: chapterNum,
        title: `Chapter ${chapterNum}: ${getChapterTitle(chapterNum)}`,
        content: generateChapterContent(chapterNum),
        isPremium: chapterNum > 5,
        coinCost: chapterNum > 5 ? 2 : 0,
        wordCount: Math.floor(Math.random() * 2000) + 1000,
        publishedAt: new Date(2024, 0, chapterNum).toISOString(),
        novelId: parseInt(novelId)
      };

      // Check access
      let access = false;
      if (!mockChapter.isPremium) {
        // Free chapter - check daily limit
        access = userFreeChapters > 0;
      } else {
        // Premium chapter - check coins or subscription
        access = userCoins >= mockChapter.coinCost;
      }

      setNovel(mockNovel);
      setChapter(mockChapter);
      setHasAccess(access);
      setLoading(false);
    }, 1000);
  }, [novelId, chapterId, userCoins, userFreeChapters]);

  const getChapterTitle = (chapterNum) => {
    const titles = [
      "The Awakening", "Ancient Whispers", "Dragon's Call", "The First Flight",
      "Shadows of the Past", "The Crystal Cave", "Bonds of Fire", "The Prophecy",
      "Dark Omens", "The Alliance", "Trial by Fire", "The Lost Kingdom",
      "Secrets Revealed", "The Dragon Lord", "Battle of the Skies"
    ];
    return titles[(chapterNum - 1) % titles.length] || "The Adventure Continues";
  };

  const generateChapterContent = (chapterNum) => {
    const paragraphs = [
      "The morning sun cast long shadows across the ancient courtyard as Aria stepped through the massive stone archway. Her heart pounded with anticipation and fear as she approached the dragon's lair, knowing that this moment would change everything.",
      
      "Dragons had been nothing more than legends for over three centuries, their existence relegated to children's stories and faded tapestries. Yet here she stood, feeling the unmistakable pull of ancient magic coursing through her veins, calling to something deep within her soul.",
      
      "The air grew thick with an otherworldly energy as she descended the spiral staircase carved into the living rock. Each step echoed with the weight of destiny, and she could hear whispers in a language she had never learned but somehow understood.",
      
      "At the bottom of the stairs, a vast cavern opened before her, its walls lined with crystals that pulsed with an inner light. In the center of the chamber, coiled in magnificent splendor, lay a dragon unlike anything she had ever imagined.",
      
      "Its scales shimmered with colors that had no names, shifting from deep emerald to brilliant sapphire to warm gold as it breathed. When it opened its eyes, Aria felt as though she was looking into the very heart of creation itself.",
      
      "\"You have come at last, young one,\" the dragon spoke, its voice resonating not in her ears but directly in her mind. \"I have been waiting for you for longer than the mountains have stood, longer than the seas have flowed.\"",
      
      "Aria found her voice, though it trembled with awe. \"I don't understand. How can you be real? Dragons are just myths, stories told to children.\" The dragon's laugh was like the sound of wind chimes made of starlight.",
      
      "\"Myths are often the deepest truths, hidden in plain sight. We never left, child. We simply learned to hide from those who would destroy what they cannot understand. But you... you are different. You carry the old blood, the gift that bridges our worlds.\"",
      
      "As the dragon spoke, Aria felt something awakening within her, a power she had never known she possessed. The air around her began to shimmer, and she realized that her life as she knew it was ending, and something far greater was beginning."
    ];
    
    return paragraphs.slice(0, Math.min(paragraphs.length, chapterNum + 3)).join('\n\n');
  };

  const handleUnlock = async () => {
    if (chapter.isPremium && userCoins >= chapter.coinCost) {
      // Deduct coins and unlock chapter
      setUserCoins(prev => prev - chapter.coinCost);
      setHasAccess(true);
      toast.success(`Chapter unlocked! ${chapter.coinCost} coins used.`);
    } else if (!chapter.isPremium && userFreeChapters > 0) {
      // Use free chapter
      setUserFreeChapters(prev => prev - 1);
      setHasAccess(true);
      toast.success('Free chapter accessed!');
    } else {
      // Redirect to shop
      navigate('/shop');
    }
  };

  const navigateChapter = (direction) => {
    const newChapterId = parseInt(chapterId) + direction;
    if (newChapterId >= 1 && newChapterId <= novel.totalChapters) {
      navigate(`/novel/${novelId}/chapter/${newChapterId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Chapter Not Found</h2>
          <Link to={`/novel/${novelId}`} className="text-purple-600 hover:text-purple-700">
            Return to Novel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Chapter Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to={`/novel/${novelId}`}
                className="text-purple-600 hover:text-purple-700 flex items-center space-x-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back to Novel</span>
              </Link>
              <div className="text-gray-400">•</div>
              <h1 className="text-lg font-semibold text-gray-900">{novel.title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {!chapter.isPremium && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Eye className="h-4 w-4" />
                  <span>Free chapters left: {userFreeChapters}</span>
                </div>
              )}
              <div className="coin-display">
                <Coins className="h-4 w-4" />
                <span>{userCoins}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Chapter Title */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {chapter.title}
              </h1>
              <div className="flex items-center space-x-2">
                {chapter.isPremium ? (
                  <span className="premium-badge">Premium</span>
                ) : (
                  <span className="free-badge">Free</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{chapter.wordCount.toLocaleString()} words</span>
              <span>•</span>
              <span>Published: {new Date(chapter.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Content or Access Gate */}
          <div className="p-6">
            {hasAccess ? (
              <div className="chapter-content">
                {chapter.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {chapter.isPremium ? 'Premium Chapter' : 'Daily Limit Reached'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {chapter.isPremium 
                    ? `Unlock this chapter for ${chapter.coinCost} coins to continue reading.`
                    : 'You have used all your free chapters for today. Come back tomorrow or unlock with coins.'
                  }
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {chapter.isPremium && userCoins >= chapter.coinCost ? (
                    <Button 
                      onClick={handleUnlock}
                      className="novelverse-button-primary"
                    >
                      <Coins className="h-4 w-4 mr-2" />
                      Unlock for {chapter.coinCost} Coins
                    </Button>
                  ) : (
                    <Link to="/shop">
                      <Button className="novelverse-button-secondary">
                        Get More Coins
                      </Button>
                    </Link>
                  )}
                  
                  <Link to="/subscription">
                    <Button variant="outline" className="border-purple-600 text-purple-600">
                      Get Premium Access
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          {hasAccess && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => navigateChapter(-1)}
                  disabled={parseInt(chapterId) <= 1}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous Chapter</span>
                </Button>

                <span className="text-gray-600 text-sm">
                  Chapter {chapterId} of {novel.totalChapters}
                </span>

                <Button
                  onClick={() => navigateChapter(1)}
                  disabled={parseInt(chapterId) >= novel.totalChapters}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <span>Next Chapter</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;

