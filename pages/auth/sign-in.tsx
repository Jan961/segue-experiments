import { calibri } from 'lib/fonts';
import { useAuth } from '@clerk/nextjs';

import Image from 'next/image';

import Loader from 'components/core-ui-lib/Loader';
import { useRouter } from 'next/router';
import { Wizard } from 'react-use-wizard';
import SignInForm from 'components/auth/SignInForm';
import SignUpForm from 'components/auth/SignUpForm';

export async function getServerSideProps() {
  const basePath = process.env.BASE_URL;
  return {
    props: { basePath },
  };
}
const SignIn = ({ basePath }: { basePath: string }) => {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    router.push('/');
  }

  return isSignedIn ? (
    <div className="w-full h-screen flex justify-center items-center">
      <Loader />
    </div>
  ) : (
    <div className={`${calibri.variable} font-calibri background-gradient flex flex-col py-20  px-6`}>
      <Image className="mx-auto mb-2" height={160} width={310} src="/segue/segue_logo_full.png" alt="Segue" />
      <Wizard>
        <SignInForm />
        <SignUpForm basePath={basePath} />
      </Wizard>
    </div>
  );
};

export default SignIn;
