import { calibri } from 'lib/fonts';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';
import Loader from 'components/core-ui-lib/Loader';
import { useRouter } from 'next/router';
import { Wizard } from 'react-use-wizard';
import SignUpForm from 'components/auth/SignUpForm';
import SubscriptionPlans, { Plan } from 'components/auth/SubscriptionPlans';
import CompanyDetailsForm, { Company, Contact } from 'components/auth/CompanyDetailsForm';
import PaymentDetailsForm from 'components/auth/PaymentDetailsForm';
import { useCallback, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import getAllPlans from 'services/subscriptionPlans';
import { convertObjectKeysToCamelCase } from 'utils';
import { CustomCheckoutProvider, Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import AccountConfirmation from 'components/auth/AccountConfirmation';

export const getServerSideProps: GetServerSideProps = async () => {
  const planColors = ['#41a29a', '#0093c0', '#7b568d'];
  const plans = await getAllPlans();

  return {
    props: {
      plans: plans.map((p, i) => ({ ...convertObjectKeysToCamelCase(p), color: planColors[i] })),
    },
  };
};
const SignIn = ({ plans }: { stripeOptions: any; plans: Plan[] }) => {
  const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  const [subcriptionDetails, seSubscriptionDetails] = useState<Plan>(null);

  const [accountDetails, setAccountDetails] = useState<Company & Contact>(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handleSaveAccountDetails = useCallback(async () => {
    const { data } = await axios.post('/api/account', accountDetails);
    return data;
  }, [accountDetails]);

  return (
    <div className={`${calibri.variable} font-calibri background-gradient flex flex-col py-20  px-6`}>
      <Image className="mx-auto mb-2" height={160} width={310} src="/segue/segue_logo_full.png" alt="Segue" />
      <Wizard>
        <CompanyDetailsForm onSubmit={setCompanyDetails} />
        <SubscriptionPlans plans={plans} onSubmit={seSubscriptionDetails} />
        <Elements stripe={stripe}>
          <PaymentDetailsForm payee={companyDetails} plan={subcriptionDetails} onSubmit={setPaymentDetails} />
        </Elements>
        <AccountConfirmation />
      </Wizard>
    </div>
  );
};

export default SignIn;
