import { useState } from 'react';
import { Check, Star, Zap, BookOpen, Coins, Crown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const SubscriptionPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const plans = {
    monthly: {
      price: 4.99,
      period: 'month',
      savings: null
    },
    yearly: {
      price: 49.99,
      period: 'year',
      savings: '17%'
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Unlimited Chapter Access',
      description: 'Read all premium chapters without spending coins',
      free: false,
      premium: true
    },
    {
      icon: Zap,
      title: 'Early Access',
      description: 'Get new chapters 24 hours before free users',
      free: false,
      premium: true
    },
    {
      icon: Coins,
      title: 'Daily Bonus Coins',
      description: 'Receive 5 bonus coins every day',
      free: '1 coin',
      premium: '5 coins'
    },
    {
      icon: Star,
      title: 'Ad-Free Experience',
      description: 'Enjoy reading without any advertisements',
      free: false,
      premium: true
    },
    {
      icon: Crown,
      title: 'Premium Badge',
      description: 'Show your premium status in the community',
      free: false,
      premium: true
    },
    {
      icon: BookOpen,
      title: 'Offline Reading',
      description: 'Download chapters for offline reading',
      free: false,
      premium: true
    }
  ];

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Mock Stripe integration - will be replaced with actual payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Subscription activated successfully!');
    } catch (error) {
      toast.error('Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Crown className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Unlock Premium Reading
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Get unlimited access to all premium chapters, early releases, and exclusive features
            </p>
            
            {/* Plan Toggle */}
            <div className="bg-white bg-opacity-20 rounded-lg p-1 inline-flex mb-8">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  selectedPlan === 'monthly'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`px-6 py-2 rounded-md font-medium transition-all relative ${
                  selectedPlan === 'yearly'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                Yearly
                {plans.yearly.savings && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    Save {plans.yearly.savings}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Pricing Card */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 text-center">
              <h2 className="text-3xl font-bold mb-2">NovelVerse Premium</h2>
              <div className="text-5xl font-bold mb-2">
                ${plans[selectedPlan].price}
                <span className="text-xl font-normal">/{plans[selectedPlan].period}</span>
              </div>
              {selectedPlan === 'yearly' && (
                <p className="text-purple-100">
                  That's just $4.17/month - Save {plans.yearly.savings}!
                </p>
              )}
            </div>

            <div className="p-8">
              <Button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full novelverse-button-primary text-lg py-4 mb-8"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Crown className="h-5 w-5 mr-2" />
                    Start Premium Subscription
                  </>
                )}
              </Button>

              <p className="text-center text-gray-600 text-sm mb-8">
                Cancel anytime. No hidden fees. 7-day free trial for new users.
              </p>

              {/* Features Comparison */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
                  What's Included
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <BookOpen className="h-5 w-5 text-gray-600" />
                      </div>
                      Free Plan
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-600">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        5 free chapters daily
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        1 coin daily bonus
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Community access
                      </li>
                      <li className="flex items-center text-gray-400">
                        <X className="h-4 w-4 text-red-500 mr-2" />
                        Premium chapters
                      </li>
                      <li className="flex items-center text-gray-400">
                        <X className="h-4 w-4 text-red-500 mr-2" />
                        Ad-free experience
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-full mr-3">
                        <Crown className="h-5 w-5 text-white" />
                      </div>
                      Premium Plan
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-900">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Unlimited chapter access
                      </li>
                      <li className="flex items-center text-gray-900">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        5 coins daily bonus
                      </li>
                      <li className="flex items-center text-gray-900">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Early access to new chapters
                      </li>
                      <li className="flex items-center text-gray-900">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Ad-free reading experience
                      </li>
                      <li className="flex items-center text-gray-900">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Offline reading capability
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h4>
                <p className="text-gray-600 text-sm">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
                <p className="text-gray-600 text-sm">
                  New users get a 7-day free trial to experience all premium features before being charged.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600 text-sm">
                  We accept all major credit cards, PayPal, and other secure payment methods through Stripe.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Do I keep my coins if I subscribe?</h4>
                <p className="text-gray-600 text-sm">
                  Yes, all your existing coins remain in your account and you'll receive 5 bonus coins daily as a premium member.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

