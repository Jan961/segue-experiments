import { calibri } from 'lib/fonts';
import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import TextInput from 'components/core-ui-lib/TextInput';
import { useSignIn, useAuth } from '@clerk/nextjs';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordInput from 'components/core-ui-lib/PasswordInput';
import { EMAIL_NOT_FOUND, PASSWORD_INCORRECT, errorsMap } from 'utils/authUtils';
import Loader from 'components/core-ui-lib/Loader';

const LoginError = ({ error }: { error: string }) => {
  if (!error) {
    return null;
  }
  const errorMessage = errorsMap[error];
  return <Label variant="sm" className="ml-2 text-primary-red" text={errorMessage} />;
};

const SignIn = () => {
  const { isLoaded: signInLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    router.push('/');
  }

  const isValidEmail = useMemo(() => {
    return /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailAddress);
  }, [emailAddress]);

  const handleSignIn = async () => {
    if (!signInLoaded) {
      return;
    }
    setError('');
    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status !== 'complete') {
        setError(result.status);
      } else {
        await setActive({ session: result.createdSessionId });
        router.push('/');
      }
    } catch (err: any) {
      setError(err.errors[0].code);
      console.error('error', err.errors[0].longMessage);
    }
  };
  return isSignedIn ? (
    <div className="w-full h-screen flex justify-center items-center">
      <Loader />
    </div>
  ) : (
    <div className={`${calibri.variable} font-calibri background-gradient flex flex-col py-20  px-6`}>
      <Image className="mx-auto mb-2" height={160} width={310} src="/segue/segue_logo_full.png" alt="Segue" />
      <div className="flex flex-col mx-auto w-96">
        <div className="w-full">
          <Label text="Email Address" />
          <TextInput
            placeholder="Enter Email Address"
            className="w-full"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
          {error === EMAIL_NOT_FOUND && <LoginError error={error} />}
        </div>
        <div className="w-full mt-3">
          <Label text="Password" />

          <PasswordInput
            inputClassName="w-full"
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error === PASSWORD_INCORRECT && <LoginError error={error} />}
          <div className="w-full flex justify-end">
            <Link href="/auth/reset-password" passHref>
              <Label text="Forgot Password" />
            </Link>
          </div>
          <div className="w-full flex items-center gap-2 justify-end mt-3">
            <Button text="Sign Up" variant="secondary" onClick={() => router.push('/auth/sign-up')} className="w-32" />
            <Button text="Sign In" onClick={handleSignIn} className="w-32" disabled={!isValidEmail || !password} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
