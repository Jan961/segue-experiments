import { Button, Icon, Label, PasswordInput, Select, TextInput } from 'components/core-ui-lib';
import Image from 'next/image';
import { useState } from 'react';
import { calibri } from 'lib/fonts';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import redis from 'lib/redis';

const SignIn = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [accounts, setAccounts] = useState([]);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
    company: '',
    pin: '',
  });

  const handleLoginDetailsChange = (e) => {
    setLoginDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const attemptClerkAuth = async () => {
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
          setIsAuthenticated(true);
          fetchAccounts();
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

  const fetchAccounts = async () => {
    try {
      const { data } = await axios(`/api/account-user/read?email=${loginDetails.email}`);
      setAccounts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignIn = async () => {
    try {
      // Verify Pin
      const { data } = await axios.post('/api/account-user/verify', {
        pin: loginDetails.pin,
        email: loginDetails.email,
        organisationId: loginDetails.company,
      });
      if (data.isValid) {
        // Set organisation id on redis
        const redisResonse = await redis.set(loginDetails.email, loginDetails.company);
        if (redisResonse) {
          router.push('/');
        } else {
          console.error('Error setting redis');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`${calibri.variable} font-calibri background-gradient flex flex-col py-20  px-6`}>
      <Image className="mx-auto mb-2" height={160} width={310} src="/segue/segue_logo_full.png" alt="Segue" />

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
          <Button text="Next" onClick={attemptClerkAuth} className="w-32" disabled={isAuthenticated} />
        </div>
        {isAuthenticated && (
          <div>
            <div className="mt-10 bg-white border-primary-border rounded-md border shadow-md w-full">
              <Select
                className="border-0 !shadow-none w-full"
                label="Company"
                onChange={(value) => setLoginDetails((prev) => ({ ...prev, company: value as string }))}
                options={accounts}
                value={loginDetails.company}
                isClearable={false}
              />
            </div>
            <div className="flex items-center mt-4 ml-4 w-full">
              <Label text="PIN" required />
              <Icon iconName="info-circle-solid" variant="xs" className="text-primary-blue ml-2" />
              <TextInput
                name="pin"
                placeholder="Enter PIN"
                value={loginDetails.pin}
                onChange={handleLoginDetailsChange}
                className="w-24 ml-4"
                type="text"
                pattern="\d{4}"
                maxlength={4}
              />
              <Link href="/auth/sign-up" passHref className="ml-4">
                Forgotten PIN?
              </Link>
            </div>
            <div className="flex justify-end mt-5">
              <Button text="Sign In" onClick={handleSignIn} className="w-32" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default SignIn;
