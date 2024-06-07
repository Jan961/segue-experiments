import Button from 'components/core-ui-lib/Button';
import Icon from 'components/core-ui-lib/Icon';
import Tooltip from 'components/core-ui-lib/Tooltip';
import { FormEvent, useEffect, useState } from 'react';
import { useWizard } from 'react-use-wizard';
import { Plan } from './SubscriptionPlans';

import { CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js';
import TextInput from 'components/core-ui-lib/TextInput';
import Label from 'components/core-ui-lib/Label';
import classNames from 'classnames';
import axios from 'axios';
import Toggle from 'components/core-ui-lib/Toggle';
import { AccountDetails } from 'pages/account/sign-up';
import { add } from 'date-fns';
import useProcessPayment from 'hooks/useProcessPayment';
import { notify } from 'components/core-ui-lib/Notifications';

const baseClass = `w-full block bg-primary-white p-1.5 h-[1.9375rem] !border text-sm shadow-input-shadow text-primary-input-text rounded-md outline-none focus:ring-2 focus:ring-primary-input-text ring-inset border-primary-border`;

const PAYMENT_FAILED_ERROR = 'Error submitting payment';
const SUBSCRIPTION_FAILED_ERROR = 'Error creating subscription';

interface PaymentDetailsFormProps {
  accountDetails: Partial<AccountDetails>;
  plan: Plan;
}
const PaymentDetailsForm = ({ plan, accountDetails }: PaymentDetailsFormProps) => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardHolderName: '',
    postcode: '',
    amount: null,
    currency: 'GBP',
    paymentFrequency: 1,
    email: accountDetails.email,
  });
  const { processCardPayment, isPaymentSuccess, paymentError } = useProcessPayment();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { previousStep, nextStep } = useWizard();

  const handleFormChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handleToggleChange = (isChecked) => {
    const paymentFrequency = isChecked ? 12 : 1;
    const amount = paymentFrequency * plan.planPrice;
    setPaymentDetails({ ...paymentDetails, paymentFrequency, amount });
  };

  const createSubscription = async () => {
    try {
      // Create a subscription in the DB
      const today = new Date();
      await axios.post('/api/subscription/create', {
        planId: plan.planId,
        accountId: accountDetails.accountId,
        startDate: today.toISOString(),
        endDate: add(today, { months: paymentDetails.paymentFrequency }).toISOString(),
        isActive: true,
      });
      setLoading(false);
      nextStep();
    } catch (error) {
      notify.error(SUBSCRIPTION_FAILED_ERROR);
      console.error(error);
    }
  };

  const handleError = (error) => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  useEffect(() => {
    handleError(paymentError);
  }, [paymentError]);

  useEffect(() => {
    if (isPaymentSuccess) {
      createSubscription();
    }
  }, [isPaymentSuccess]);
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      await processCardPayment(
        plan.planPrice * 100,
        plan.planCurrency,
        paymentDetails.cardHolderName,
        paymentDetails.postcode,
        paymentDetails.email,
      );
    } catch (error) {
      handleError(error);
      notify.error(PAYMENT_FAILED_ERROR);
    }
  };

  useEffect(() => {
    const paymentFrequency = 1;
    setPaymentDetails({ ...paymentDetails, amount: paymentFrequency * plan.planPrice, paymentFrequency });
  }, [plan]);

  return (
    <div className="mx-auto w-[32rem] flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center text-primary-input-text">Payment Details</h1>
      <div className="w-full flex justify-between mt-4 gap-5">
        <section className="max-h-96 w-60 flex flex-col items-center rounded-md p-4 bg-primary-white border border-primary-border text-primary-input-text">
          <Icon iconName="price-plan" fill={plan.color} />
          <div className="flex gap-2  justify-center items-center">
            <h2 className="font-bold text-center text-responsive-2xl">{plan.planName}</h2>
            <Icon iconName="info-circle-solid" />
            <Tooltip body="amsn" />
          </div>
          <div className="flex flex-col">
            <p className="text-center font-bold">{plan.planDescription}</p>
          </div>
          <div className="mt-3 mb-10">
            <p className="text-center">{`${plan.planCurrency} ${plan.planPrice} per month`}</p>
            <p className="text-center">{`${plan.planCurrency} ${plan.planPrice * 12} per year`}</p>
          </div>
          <Button text="Change Plan" onClick={previousStep} className="w-32" />
        </section>
        <form onSubmit={handleFormSubmit} className="w-60 space-y-3 text-primary-input-text">
          <div className="w-full flex items-center">
            <Label text="Pay Monthly" />
            <Toggle
              className="mx-2"
              label="Monthly"
              name="toggle"
              checked={paymentDetails.paymentFrequency === 12}
              onChange={handleToggleChange}
            />
            <Label text="Annually" />
          </div>
          <Label
            variant="lg"
            className="font-bold"
            text={`£${plan.planPrice * paymentDetails.paymentFrequency} ${
              paymentDetails.paymentFrequency === 1 ? 'per month' : 'per year'
            }`}
          />
          <div>
            <Label htmlFor="cardHolderName" text="Cardholder Name" />
            <TextInput
              id="cardHolderName"
              name="cardHolderName"
              value={paymentDetails.cardHolderName}
              className="flex w-full"
              placeholder="Cardholder Name"
              onChange={handleFormChange}
            />
          </div>

          <div>
            <Label htmlFor="cardNumber" text="Card Number" />
            <CardNumberElement id="cardNumber" className={baseClass} />
          </div>

          <div className="flex gap-2 w-full items-center">
            <div className="w-1/2">
              <Label htmlFor="cardExpiry" text="Expiry Date" />
              <CardExpiryElement id="cardExpiry" className={classNames(baseClass, 'w-full')} />
            </div>
            <div className="w-1/2">
              <Label htmlFor="cardCVC" text="CVC" />
              <CardCvcElement id="cardCVC" className={classNames(baseClass, 'w-full')} />
            </div>
          </div>

          <div>
            <Label htmlFor="postcode" text="Postcode" />
            <TextInput id="postcode" name="postcode" value={paymentDetails.postcode} onChange={handleFormChange} />
          </div>
          <div>
            <Label htmlFor="email" text="Email" />
            <TextInput
              className="flex w-full"
              placeholder="Email Address"
              id="email"
              name="email"
              value={paymentDetails.email}
              onChange={handleFormChange}
            />
          </div>

          <div className="pt-3">
            <Button type="submit" text="Pay Now" className="w-32" disabled={loading} />
          </div>
          <div className="pt-3">
            {errorMessage && <Label text={errorMessage} variant="md" className="text-primary-red" />}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentDetailsForm;
