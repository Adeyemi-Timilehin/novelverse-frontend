import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { CreditCard, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentForm = ({ amount, coinPackage, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment intent
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
            type: 'coin_purchase'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'NovelVerse User', // This should be the actual user name
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        toast.error(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Payment successful! Coins added to your account.');
        onSuccess({
          paymentIntentId: paymentIntent.id,
          coins: coinPackage.coins + (coinPackage.bonusCoins || 0)
        });
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Your Purchase</h3>
        <p className="text-gray-600">
          {coinPackage.coins} coins {coinPackage.bonusCoins && `+ ${coinPackage.bonusCoins} bonus`}
        </p>
        <p className="text-2xl font-bold text-purple-600">${amount}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Lock className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!stripe || loading}
            className="flex-1 novelverse-button-primary"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              `Pay $${amount}`
            )}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          By completing this purchase, you agree to our Terms of Service and Privacy Policy.
          Coins are non-refundable and do not expire.
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;

