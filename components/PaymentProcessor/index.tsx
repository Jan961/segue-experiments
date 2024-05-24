import { useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const PaymentProcessor = ({ email, priceId }: { email: string; priceId: string }) => {
  const fetchClientSecret = useCallback(async () => {
    const { data } = await axios.post('/api/payment/stripe/session', { email, priceId });
    console.log('session data', data);
    // Create a Checkout Session
    return data.clientSecret;
  }, []);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default PaymentProcessor;
