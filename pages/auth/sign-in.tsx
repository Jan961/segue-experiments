import { Button, Label, PasswordInput, TextInput } from 'components/core-ui-lib';
import Image from 'next/image';
import { useState } from 'react';
import { calibri } from 'lib/fonts';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/router';

const SignIn = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  });

  const handleLoginDetailsChange = (e) => {
    setLoginDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignIn = async () => {
    if (isLoaded) {
      try {
        const signInAttempt = await signIn.create({
          identifier: loginDetails.email,
          password: loginDetails.password,
        });

        // If sign-in process is complete, set the created session as active
        // and redirect the user
        if (signInAttempt.status === 'complete') {
          await setActive({ session: signInAttempt.createdSessionId, organization: 'Jendagi' });

          router.push('/');
        } else {
          // If the status is not complete, check why. User may need to
          // complete further steps.
          console.error(JSON.stringify(signInAttempt, null, 2));
        }
      } catch (err: any) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2));
      }
    }
  };

  return (
    <div className={`${calibri.variable} font-calibri background-gradient flex flex-col py-20  px-6`}>
      <Image className="mx-auto mb-2" height={160} width={310} src="/segue/segue_logo_full.png" alt="Segue" />
      <h1 className="my-4 text-2xl font-bold text-center text-primary-input-text">Sign In</h1>
      <div className="text-primary-input-text w-[364px] mx-auto">
        <div>
          <Label text="Email Address" required />
          <TextInput
            name="email"
            placeholder="Enter Email Address"
            className="w-full"
            value={loginDetails.email}
            onChange={handleLoginDetailsChange}
          />
        </div>
        <div className="w-full">
          <div className="flex items-center gap-1">
            <Label text="Password" required />
          </div>
          <PasswordInput
            name="password"
            placeholder="Enter Password"
            className="w-full"
            inputClassName="w-full"
            value={loginDetails.password}
            onChange={handleLoginDetailsChange}
          />
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Button variant="secondary" text="Sign Up" onClick={null} className="w-32" />
          <Button text="Next" onClick={handleSignIn} className="w-32" />
        </div>
      </div>
    </div>
  );
};
export default SignIn;
