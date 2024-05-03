import { calibri } from 'lib/fonts';
import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import TextInput from 'components/core-ui-lib/TextInput';
import { useSignIn } from '@clerk/nextjs';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordInput from 'components/core-ui-lib/PasswordInput';

const SignIn = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const router = useRouter();

  // To do
  const handleSignUp = () => null;

  const handleSignIn = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === 'complete') {
        console.log(result);
        await setActive({ session: result.createdSessionId });
        router.push('/');
      } else {
        /* Investigate why the sign-in hasn't completed */
        console.log(result);
      }
    } catch (err: any) {
      console.error('error', err.errors[0].longMessage);
    }
  };
  return (
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
        </div>
        <div className="w-full mt-3">
          <Label text="Password" />

          <PasswordInput
            inputClassName="w-full"
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="w-full flex justify-end">
            <Link href="/auth/reset-password" passHref>
              <Label text="Forgot Password?" />
            </Link>
          </div>
          <div className="w-full flex items-center gap-2 justify-end mt-3">
            <Button text="Sign Up" variant="secondary" onClick={handleSignUp} className="w-32" />
            <Button text="Sign In" onClick={handleSignIn} className="w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
