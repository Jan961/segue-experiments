import { calibri } from 'lib/fonts';
import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import TextInput from 'components/core-ui-lib/TextInput';
import { useAuth, useSignUp } from '@clerk/nextjs';

import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordInput from 'components/core-ui-lib/PasswordInput';
import { EMAIL_NOT_FOUND, PASSWORD_INCORRECT, errorsMap } from 'utils/authUtils';
import Loader from 'components/core-ui-lib/Loader';
import SignUpForm from 'components/auth/SignUpForm';

const LoginError = ({ error }: { error: string }) => {
  if (!error) {
    return null;
  }
  const errorMessage = errorsMap[error];
  return <Label variant="sm" className="ml-2 text-primary-red" text={errorMessage} />;
};

const SignUp = () => {
  const { isLoaded: isClerkLoaded, signUp, setActive } = useSignUp();

  const [pendingVerification, setPendingVerification] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');

  const router = useRouter();
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    router.push('/');
  }

  // This function will handle the user submitting a code for verification
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!isClerkLoaded) {
      return;
    }

    try {
      // Submit the code that the user provides to attempt verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If complete, the user has been created -- set the session active
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        // Redirect the user to a post sign-up route
        router.push('/');
      } else {
        // The status can also be `abandoned` or `missing_requirements`
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      setError(err.errors[0].code);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return isSignedIn ? (
    <div className="w-full h-screen flex justify-center items-center">
      <Loader />
    </div>
  ) : (
    <div className={`${calibri.variable} font-calibri background-gradient flex flex-col py-20  px-6`}>
      <Image className="mx-auto mb-2" height={160} width={310} src="/segue/segue_logo_full.png" alt="Segue" />
      <SignUpForm />
    </div>
  );
};

export default SignUp;
