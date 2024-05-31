import { calibri } from 'lib/fonts';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';

import { Wizard } from 'react-use-wizard';

import SubscriptionPlans, { Plan } from 'components/auth/SubscriptionPlans';
import AccountDetailsForm, { Account } from 'components/auth/AccountDetailsForm';
import PaymentDetailsForm from 'components/auth/PaymentDetailsForm';
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import getAllPlans from 'services/subscriptionPlans';
import { convertObjectKeysToCamelCase } from 'utils';

import AccountConfirmation from 'components/auth/AccountConfirmation';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';

export const getServerSideProps: GetServerSideProps = async () => {
  const planColors = ['#41a29a', '#0093c0', '#7b568d'];
  const plans = await getAllPlans();

  return {
    props: {
      plans: plans.map((p, i) => ({ ...convertObjectKeysToCamelCase(p), color: planColors[i] })),
    },
  };
};

const DEFAULT_ACCOUNT_DETAILS = {
  contactId: null,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  companyId: null,
  companyName: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  town: '',
  country: '',
  postcode: '',
  vatNumber: '',
  currency: 'GBP',
};
const NewAccount = ({ plans }: { stripeOptions: any; plans: Plan[] }) => {
  const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  const [accountDetails, setAccountDetails] = useState<Account>(DEFAULT_ACCOUNT_DETAILS);

  const [subcriptionDetails, seSubscriptionDetails] = useState<Plan>(null);

  const handleSaveAccountDetails = async () => {
    const { data } = await axios.post(`/api/account/${accountDetails.accountId ? 'update' : 'create'}`, accountDetails);
    setAccountDetails(data);
  };

  return (
    <div className={`${calibri.variable} font-calibri background-gradient flex flex-col py-20  px-6`}>
      <Image className="mx-auto mb-2" height={160} width={310} src="/segue/segue_logo_full.png" alt="Segue" />
      <Wizard>
        <AccountDetailsForm
          accountDetails={accountDetails}
          onChange={setAccountDetails}
          onSave={handleSaveAccountDetails}
        />
        <SubscriptionPlans plans={plans} onSubmit={seSubscriptionDetails} />
        <Elements stripe={stripe}>
          <PaymentDetailsForm payee={accountDetails} plan={subcriptionDetails} />
        </Elements>
        <AccountConfirmation />
      </Wizard>
    </div>
  );
};

export default NewAccount;
