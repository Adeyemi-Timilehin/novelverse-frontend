import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (replace with your actual publishable key)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_key');

export const paymentService = {
  // Create payment intent for coin purchase
  async createPaymentIntent(amount, coinPackage) {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency: 'usd',
          metadata: {
            coinPackage: coinPackage.coins,
            bonusCoins: coinPackage.bonusCoins || 0,
            userId: 'current_user_id' // This should be the actual user ID
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  // Process coin purchase
  async processCoinPurchase(coinPackage) {
    try {
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Create payment intent
      const { clientSecret } = await this.createPaymentIntent(coinPackage.price, coinPackage);

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // This would be replaced with actual card element
          },
          billing_details: {
            name: 'Customer Name',
            email: 'customer@example.com',
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Payment successful, update user's coin balance
        return {
          success: true,
          paymentIntentId: paymentIntent.id,
          coins: coinPackage.coins + (coinPackage.bonusCoins || 0)
        };
      }

      throw new Error('Payment was not successful');
    } catch (error) {
      console.error('Error processing coin purchase:', error);
      throw error;
    }
  },

  // Create subscription for premium membership
  async createSubscription(priceId, customerId) {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },

  // Process subscription payment
  async processSubscription(planType) {
    try {
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Create customer and subscription
      const priceId = planType === 'monthly' ? 'price_monthly_id' : 'price_yearly_id';
      const { clientSecret } = await this.createSubscription(priceId, 'customer_id');

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret);

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          subscriptionId: paymentIntent.id,
          planType
        };
      }

      throw new Error('Subscription payment was not successful');
    } catch (error) {
      console.error('Error processing subscription:', error);
      throw error;
    }
  },

  // Get payment methods for user
  async getPaymentMethods(customerId) {
    try {
      const response = await fetch(`/api/payment-methods/${customerId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  },

  // Add payment method
  async addPaymentMethod(paymentMethodId, customerId) {
    try {
      const response = await fetch('/api/attach-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId,
          customerId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add payment method');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  },

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch(`/api/cancel-subscription/${subscriptionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  },

  // Get subscription status
  async getSubscriptionStatus(customerId) {
    try {
      const response = await fetch(`/api/subscription-status/${customerId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      throw error;
    }
  }
};

