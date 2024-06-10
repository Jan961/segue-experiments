import axios from 'axios';
import { useState } from 'react';
import { CardNumberElement, useStripe, useElements } from '@stripe/react-stripe-js';
const useProcessPayment = () => {
  const [paymentError, setPaymentError] = useState<string>('');
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const processCardPayment = async (
    amount: number,
    currency: string,
    payee: string,
    postcode: string,
    email: string,
  ) => {
    if (!stripe || !elements) {
      setPaymentError('Stripe is not loaded');
      return;
    }
    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setPaymentError(submitError.message);
        return;
      }
      // Create the PaymentIntent and obtain clientSecret
      const res = await axios.post('/api/payment/stripe/create', {
        amount, // stripe expects amount in cents/pence
        currency,
      });
      const { client_secret: clientSecret } = await res.data;
      // Confirm the PaymentIntent using the details collected by the Payment Element
      const { error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: payee,
              address: {
                postal_code: postcode,
              },
            },
          },
          receipt_email: email,
        },
        {
          handleActions: false,
        },
      );

      if (error) {
        // This point is only reached if there's an immediate error when confirming the payment.
        setIsPaymentSuccess(false);
        setPaymentError(error.message);
      } else {
        setIsPaymentSuccess(true);
        setPaymentError('');
      }
    } catch (error) {
      setPaymentError(error.message);
    }
  };

  return {
    isPaymentSuccess,
    paymentError,
    processCardPayment,
  };
};
export default useProcessPayment;
