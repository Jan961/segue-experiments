import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import PasswordInput from 'components/core-ui-lib/PasswordInput';
import TextInput from 'components/core-ui-lib/TextInput';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { EMAIL_NOT_FOUND, PASSWORD_INCORRECT } from 'utils/authUtils';
import { useWizard } from 'react-use-wizard';
import AuthError from './AuthError';
import axios from 'axios';
import { PrismaInstance } from 'lib/prisma';

const SignInForm = () => {
  const { isLoaded: signInLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { nextStep } = useWizard();
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
        const { data } = await axios('/api/account/fetch?id=2');

        // PrismaInstance.getInstance().setUrl(data.AccountDBUrl);
        // console.log('url', PrismaInstance.getInstance().url);
        await setActive({ session: result.createdSessionId });
        router.push('/');
      }
    } catch (err: any) {
      setError(err.errors[0].code);
      console.error('error', err.errors[0].longMessage);
    }
  };
  return (
    <div className="flex flex-col mx-auto w-96">
      <div className="w-full">
        <Label text="Email Address" />
        <TextInput
          placeholder="Enter Email Address"
          className="w-full"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />
        {error === EMAIL_NOT_FOUND && <AuthError error={error} />}
      </div>
      <div className="w-full mt-3">
        <Label text="Password" />

        <PasswordInput
          inputClassName="w-full"
          className="w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error === PASSWORD_INCORRECT && <AuthError error={error} />}
        <div className="w-full flex justify-end">
          <Link href="/auth/reset-password" passHref>
            <Label text="Forgot Password" />
          </Link>
        </div>
        <div className="w-full flex items-center gap-2 justify-end mt-3">
          <Button text="Sign Up" variant="secondary" onClick={nextStep} className="w-32" />
          <Button text="Sign In" onClick={handleSignIn} className="w-32" disabled={!isValidEmail || !password} />
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
