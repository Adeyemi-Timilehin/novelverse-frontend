import { useState } from 'react';
import { Coins, CreditCard, Gift, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const ShopPage = () => {
  const [loading, setLoading] = useState(false);
  const [userCoins, setUserCoins] = useState(5);

  const coinPackages = [
    {
      id: 1,
      coins: 10,
      price: 1.99,
      popular: false,
      bonus: 0,
      description: 'Perfect for unlocking a few premium chapters'
    },
    {
      id: 2,
      coins: 50,
      price: 8.99,
      popular: true,
      bonus: 5,
      description: 'Great value pack with bonus coins'
    },
    {
      id: 3,
      coins: 100,
      price: 16.99,
      popular: false,
      bonus: 15,
      description: 'Best value with maximum bonus coins'
    },
    {
      id: 4,
      coins: 250,
      price: 39.99,
      popular: false,
      bonus: 50,
      description: 'Ultimate package for avid readers'
    }
  ];

  const handlePurchase = async (packageItem) => {
    setLoading(true);
    try {
      // Mock Stripe/Flutterwave integration - will be replaced with actual payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const totalCoins = packageItem.coins + packageItem.bonus;
      setUserCoins(prev => prev + totalCoins);
      toast.success(`Successfully purchased ${totalCoins} coins!`);
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full">
                <Coins className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Get More Coins
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Unlock premium chapters and support your favorite authors
            </p>
            <div className="coin-display text-lg">
              <Coins className="h-5 w-5" />
              <span>Current Balance: {userCoins} coins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coin Packages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coinPackages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative bg-white rounded-lg shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
                pkg.popular ? 'border-purple-500 scale-105' : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Most Popular</span>
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Coins className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.coins} Coins
                  </h3>
                  {pkg.bonus > 0 && (
                    <div className="flex items-center justify-center space-x-1 text-green-600 mb-2">
                      <Gift className="h-4 w-4" />
                      <span className="text-sm font-medium">+{pkg.bonus} Bonus Coins</span>
                    </div>
                  )}
                  <div className="text-3xl font-bold text-purple-600">
                    ${pkg.price}
                  </div>
                  <p className="text-gray-600 text-sm mt-2">
                    {pkg.description}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span>Instant delivery</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CreditCard className="h-4 w-4 text-blue-500" />
                    <span>Secure payment</span>
                  </div>
                  {pkg.bonus > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <Gift className="h-4 w-4" />
                      <span>{Math.round((pkg.bonus / pkg.coins) * 100)}% bonus coins</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handlePurchase(pkg)}
                  disabled={loading}
                  className={`w-full ${
                    pkg.popular 
                      ? 'novelverse-button-primary' 
                      : 'novelverse-button-secondary'
                  } flex items-center justify-center space-x-2`}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      <span>Purchase Now</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Secure Payment Methods
          </h3>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-center">
              <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">
                VISA
              </div>
            </div>
            <div className="text-center">
              <div className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
                MASTER
              </div>
            </div>
            <div className="text-center">
              <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold">
                PAYPAL
              </div>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-bold">
                STRIPE
              </div>
            </div>
          </div>
          <p className="text-center text-gray-600 text-sm mt-4">
            All transactions are secured with 256-bit SSL encryption
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">How do coins work?</h4>
              <p className="text-gray-600 text-sm">
                Coins are used to unlock premium chapters. Each premium chapter typically costs 1-3 coins depending on length and popularity.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Do coins expire?</h4>
              <p className="text-gray-600 text-sm">
                No, your coins never expire. Once purchased, they remain in your account until you use them.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Can I get a refund?</h4>
              <p className="text-gray-600 text-sm">
                Refunds are available within 24 hours of purchase if coins haven't been used. Contact support for assistance.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Are there other ways to earn coins?</h4>
              <p className="text-gray-600 text-sm">
                Yes! You get 1 free coin daily, 2 coins for each successful referral, and bonus coins from special events.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;

