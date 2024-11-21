import { calibri } from 'lib/fonts';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';
import { Wizard } from 'react-use-wizard';
import SubscriptionPlans, { Plan } from 'components/account/SubscriptionPlans';
import AccountDetailsForm, { Account } from 'components/account/AccountDetailsForm';
import PaymentDetailsForm from 'components/account/PaymentDetailsForm';
import { useState } from 'react';
import { GetServerSideProps } from 'next';
// import getAllPlans from 'services/subscriptionPlans';
import AccountConfirmation from 'components/account/AccountConfirmation';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { notify } from 'components/core-ui-lib';
import { getCountriesAsSelectOptions, getCurrenciesAsSelectOptions } from 'services/globalService';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import LoadingOverlay from 'components/core-ui-lib/LoadingOverlay';
import useAuth from 'hooks/useAuth';

export const getServerSideProps: GetServerSideProps = async () => {
  const planColors = ['#41a29a', '#0093c0', '#7b568d'];
  const plans = null; // await getAllPlans();
  let subscriptionPlans = [];
  if (plans) {
    const formattedPlans = plans.map((p, i) => {
      return {
        planId: p.PlanId,
        planName: p.PlanName,
        planDescription: p.PlanDescription,
        planPrice: p.PlanPrice.toNumber(),
        planFrequency: p.PlanFrequency,
        planPriceId: p.PlanPriceId,
        planCurrency: p.PlanCurrency,
        color: planColors[i % planColors.length],
      };
    });
    subscriptionPlans = formattedPlans;
  }

  // get countries and currencies
  const currencies = await getCurrenciesAsSelectOptions();
  const countries = await getCountriesAsSelectOptions();

  return {
    props: {
      plans: subscriptionPlans,
      currencies,
      countries,
    },
  };
};

const DEFAULT_ACCOUNT_DETAILS = {
  accountId: null,
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
  agreementChecked: false,
};
export type AccountDetails = typeof DEFAULT_ACCOUNT_DETAILS;
const ACCOUNT_CREATION_FAILED_ERROR = 'Error creating new account';
const NewAccount = ({
  plans,
  currencies = [],
  countries = [],
}: {
  stripeOptions: any;
  plans: Plan[];
  currencies: SelectOption[];
  countries: SelectOption[];
}) => {
  const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  const [accountDetails, setAccountDetails] = useState<Account>(DEFAULT_ACCOUNT_DETAILS);
  const [subcriptionDetails, seSubscriptionDetails] = useState<Plan>(null);
  const [loading, setLoading] = useState(false);
  const { getSignUpUrl } = useAuth();

  if (!stripe) {
    return <div>Loading...</div>;
  }

  const handleSaveAccountDetails = async (onSaveSuccess: () => void) => {
    setLoading(true);
    try {
      const signUpUrl = getSignUpUrl();
      const { data } = await axios.post(`/api/account/${accountDetails.accountId ? 'update' : 'create'}`, {
        account: accountDetails,
        signUpUrl,
      });
      setAccountDetails(data);

      onSaveSuccess();
    } catch (error) {
      console.error(error);
      notify.error(ACCOUNT_CREATION_FAILED_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${calibri.variable} font-calibri background-gradient flex flex-col py-20  px-6`}>
      <Image className="mx-auto mb-2" height={160} width={310} src="/segue/segue_logo_full.png" alt="Segue" />
      <Wizard>
        <AccountDetailsForm
          currencies={currencies}
          countries={countries}
          accountDetails={accountDetails}
          onChange={setAccountDetails}
          onSave={handleSaveAccountDetails}
        />
        {/* Subscription plans and Payment details have been temporarily disabled */}
        {false && <SubscriptionPlans plans={plans} onSubmit={seSubscriptionDetails} />}
        {false && (
          <Elements stripe={stripe}>
            <PaymentDetailsForm accountDetails={accountDetails} plan={subcriptionDetails} />
          </Elements>
        )}
        <AccountConfirmation />
      </Wizard>
      {loading && <LoadingOverlay />}
    </div>
  );
};

export default NewAccount;
