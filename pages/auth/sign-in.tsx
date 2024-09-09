import { Button, Icon, Label, Loader, PasswordInput, Select, TextInput, Tooltip } from 'components/core-ui-lib';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { calibri } from 'lib/fonts';
import { useSignIn, useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { accountLoginSchema, loginSchema } from 'validators/auth';

import * as yup from 'yup';
import AuthError from 'components/auth/AuthError';
import Spinner from 'components/core-ui-lib/Spinner';
import Head from 'next/head';

export const LoadingOverlay = () => (
  <div className="inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center top-20 left-20 right-20 bottom-20">
    <Loader variant="lg" iconProps={{ stroke: '#FFF' }} />
  </div>
);

const SignIn = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { user } = useUser();
  const [isBusy, setIsBusy] = useState(false);
  const { signOut } = useClerk();
  const [validationError, setValidationError] = useState<string>('');
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
    setIsBusy(true);
    if (isLoaded) {
      try {
        // validate inputs
        await loginSchema.validate(loginDetails, { abortEarly: true });

        const signInAttempt = await signIn.create({
          identifier: loginDetails.email,
          password: loginDetails.password,
        });

        // If sign-in process is complete, set the created session as active
        // and redirect the user
        if (signInAttempt.status === 'complete') {
          await setActive({ session: signInAttempt.createdSessionId, organization: 'Jendagi' });
          setIsAuthenticated(true);
          fetchAccounts(loginDetails.email);
        } else {
          // If the status is not complete, check why. User may need to
          // complete further steps.
          console.error(JSON.stringify(signInAttempt, null, 2));
        }
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          setValidationError(error.errors[0]);
        }
        console.error('Error signing in:', error);
      } finally {
        setIsBusy(false);
      }
    }
  };

  const fetchAccounts = async (email: string) => {
    try {
      const { data } = await axios(`/api/account-user/read?email=${email}`);
      setAccounts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignIn = async () => {
    setIsBusy(true);
    try {
      // validate inputs
      await accountLoginSchema.validate(loginDetails, { abortEarly: true });
      // Verify Pin
      const { data } = await axios.post('/api/account-user/verify', {
        pin: loginDetails.pin,
        email: loginDetails.email,
        organisationId: loginDetails.company,
      });
      if (data.isValid) {
        // Set organisation id on redis

        const { data } = await axios.post('/api/user/session/create', {
          email: loginDetails.email,
          organisationId: loginDetails.company,
        });
        if (data.success) {
          router.push('/');
        } else {
          console.error('Error setting redis');
        }
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setValidationError(error.errors[0]);
      }
      console.error(error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Sign out from Clerk
      await signOut();
      // Remove organisation id on redis
      const { data } = await axios.post('/api/user/session/create', {
        email: loginDetails.email,
      });

      if (!data.success) {
        console.error('Error deleting user session');
      }
      setIsAuthenticated(false);
      setLoginDetails({ email: '', password: '', company: '', pin: '' });
      router.replace(router.asPath);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSessionExpired = async () => {
    try {
      setIsAuthenticated(true);
      const email = user?.primaryEmailAddress.emailAddress;
      console.log('email', email, user);
      if (email) {
        await fetchAccounts(email);
        setLoginDetails((prev) => ({ ...prev, email, password: 'XXXXXXXX' }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (router?.query['seg-session-expired'] && user) {
      handleSessionExpired();
    }
  }, [router, user]);

  return !isLoaded ? (
    <Spinner size="lg" />
  ) : (
    <div className={`${calibri.variable} font-calibri background-gradient flex flex-col py-20  px-6`}>
      <Head>
        <title>Sign In | Segue</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/segue/segue_mini_icon.png" type="image/png" />
      </Head>
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
            disabled={isAuthenticated}
          />
          {validationError?.includes('Email') && <AuthError error={validationError} />}
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
            disabled={isAuthenticated}
          />
          {validationError?.includes('Password') && <AuthError error={validationError} />}
          <div className="flex justify-end">
            <Link href="/auth/password-reset" passHref className="ml-4">
              Forgotten Password?
            </Link>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Button loading={isBusy} text="Next" onClick={attemptClerkAuth} className="w-32" disabled={isAuthenticated} />
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
            {validationError?.includes('Company') && <AuthError error={validationError} />}
            <div className="flex items-center mt-4 ml-4 w-full">
              <Label text="PIN" required />
              <Tooltip
                body="Please enter the 4 digit pin for this account."
                position="right"
                width="w-[140px]"
                bgColorClass="primary-input-text"
              >
                <Icon iconName="info-circle-solid" variant="xs" className="text-primary-blue ml-2" />
              </Tooltip>

              <TextInput
                name="pin"
                placeholder="Enter PIN"
                value={loginDetails.pin}
                onChange={handleLoginDetailsChange}
                className="w-24 ml-4"
                type="text"
                maxlength={4}
              />
              <Link href="/auth/sign-up" passHref className="ml-4">
                Forgotten PIN?
              </Link>
            </div>
            {validationError?.includes('PIN') && (
              <div className="flex items-center ml-2 w-full">
                <AuthError error={validationError} />
              </div>
            )}
            <div className="flex justify-end mt-5">
              {isAuthenticated && (
                <Button text="Logout" variant="secondary" onClick={handleLogout} className="w-32 mr-3" />
              )}
              <Button text="Sign In" onClick={handleSignIn} className="w-32" />
            </div>
          </div>
        )}
      </div>
      {isBusy && <LoadingOverlay />}
    </div>
  );
};
export default SignIn;
