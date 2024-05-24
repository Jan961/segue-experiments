import { calibri } from 'lib/fonts';
import Image from 'next/image';

import Loader from 'components/core-ui-lib/Loader';
import { useRouter } from 'next/router';
import { Wizard } from 'react-use-wizard';
import SignUpForm from 'components/auth/SignUpForm';
import SubscriptionPlans, { Plan } from 'components/auth/SubscriptionPlans';
import CompanyDetailsForm, { Company } from 'components/auth/CompanyDetailsForm';
import PaymentDetailsForm from 'components/auth/PaymentDetailsForm';
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import getAllPlans from 'services/subscriptionPlans';
import { convertObjectKeysToCamelCase } from 'utils';

export const getServerSideProps: GetServerSideProps = async () => {
  const planColors = ['#41a29a', '#0093c0', '#7b568d'];
  const plans = await getAllPlans();
  console.log(plans);
  return {
    props: {
      plans: plans.map((p, i) => ({ ...convertObjectKeysToCamelCase(p), color: planColors[i] })),
    },
  };
};
const SignIn = ({ plans }: { plans: Plan[] }) => {
  console.log(plans);
  const [subcriptionDetails, seSubscriptionDetails] = useState<Plan>(null);

  const [companyDetails, setCompanyDetails] = useState<Company>(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  return (
    <div className={`${calibri.variable} font-calibri background-gradient flex flex-col py-20  px-6`}>
      <Image className="mx-auto mb-2" height={160} width={310} src="/segue/segue_logo_full.png" alt="Segue" />
      <Wizard>
        <CompanyDetailsForm onSubmit={setCompanyDetails} />
        <SubscriptionPlans plans={plans} onSubmit={seSubscriptionDetails} />
        <PaymentDetailsForm payee={companyDetails} plan={subcriptionDetails} onSubmit={setPaymentDetails} />
        <SignUpForm />
      </Wizard>
    </div>
  );
};

export default SignIn;
