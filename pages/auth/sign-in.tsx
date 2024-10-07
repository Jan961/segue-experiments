import { Button, Icon, Label, PasswordInput, Select, TextInput, Tooltip } from 'components/core-ui-lib';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { calibri } from 'lib/fonts';
import { useSignIn, useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { accountLoginSchema, loginSchema } from 'validators/auth';
import { useSession } from '@clerk/clerk-react';
import * as yup from 'yup';
import AuthError from 'components/auth/AuthError';
import Spinner from 'components/core-ui-lib/Spinner';
import Head from 'next/head';
import { isNullOrEmpty } from 'utils';
import { SESSION_ALREADY_EXISTS } from 'utils/authUtils';

export const LoadingOverlay = () => (
  <div className="inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center top-20 left-20 right-20 bottom-20">
    <Spinner size="lg" />
  </div>
);

const SignIn = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { user } = useUser();
  const [isBusy, setIsBusy] = useState(false);
  const { signOut } = useClerk();
  const { session } = useSession();
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
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

  const handleAllowAccountSelect = async () => {
    try {
      setIsAuthenticated(true);
      const email = user?.primaryEmailAddress.emailAddress;
      if (email) {
        await fetchAccounts(email);
        setLoginDetails((prev) => ({ ...prev, email, password: 'XXXXXXXX' }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const attemptClerkAuth = async () => {
    clearErrors();
    setShowLogout(false);

    setIsBusy(true);
    if (isLoaded) {
      try {
        // validate inputs
        await loginSchema.validate(loginDetails, { abortEarly: false });

        // const check if user already as an active clerk session
        if (user && user.primaryEmailAddress.emailAddress === loginDetails.email) {
          handleAllowAccountSelect();
        } else {
          const signInAttempt = await signIn.create({
            identifier: loginDetails.email,
            password: loginDetails.password,
          });

          // If sign-in process is complete, set the created session as active
          // and redirect the user
          if (signInAttempt.status === 'complete') {
            await setActive({ session: signInAttempt.createdSessionId, organization: loginDetails.company });
            setIsAuthenticated(true);
            fetchAccounts(loginDetails.email);
          } else {
            // If the status is not complete, check why. User may need to
            // complete further steps.
            console.error(JSON.stringify(signInAttempt, null, 2));
          }
        }
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          const formattedErrors = error.inner.reduce((acc, err) => {
            return {
              ...acc,
              [err.path]: acc[err.path] ? [...acc[err.path], err.errors[0]] : [err.errors[0]],
            };
          }, {});
          setValidationError(formattedErrors);
        } else if (!isNullOrEmpty(error.errors)) {
          const errorCode = error.errors[0].code;
          if (errorCode === SESSION_ALREADY_EXISTS) {
            setShowLogout(true);
          }
          setError(errorCode);
        }
        console.error('Error signing in:', error);
      } finally {
        setIsBusy(false);
      }
    }
  };

  const fetchAccounts = async (email: string) => {
    try {
      const { data } = await axios(`/api/account-user/get-accounts-for-user?email=${email}`);
      setAccounts(data.accounts);
    } catch (err) {
      console.error(err);
    }
  };

  const clearErrors = () => {
    setValidationError(null);
    setError('');
  };

  const handleSignIn = async () => {
    clearErrors();
    setIsBusy(true);
    try {
      // validate inputs
      await accountLoginSchema.validate(loginDetails, { abortEarly: false });
      // Verify Pin
      const { data } = await axios.post('/api/account-user/verify', {
        pin: loginDetails.pin,
        email: loginDetails.email,
        organisationId: loginDetails.company,
      });

      
      session.user.update({
        unsafeMetadata: {
          organisationId: loginDetails.company,
        },
      });
        
      
      router.push('/');
    }

     catch (error) {
      if (error instanceof yup.ValidationError) {
        const formattedErrors = error.inner.reduce((acc, err) => {
          return {
            ...acc,
            [err.path]: acc[err.path] ? [...acc[err.path], err.errors[0]] : [err.errors[0]],
          };
        }, {});
        setValidationError(formattedErrors);
      }
      console.error(error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleLogout = async () => {
    try {
      clearErrors();
      
      // Sign out from Clerk
      await signOut();
      setShowLogout(false);
      setIsAuthenticated(false);
      setLoginDetails({ email: '', password: '', company: '', pin: '' });
      router.replace(router.asPath);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (router?.query.selectAccount && user) {
      handleAllowAccountSelect();
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
      <h1 className="my-4 text-2xl font-bold text-center text-primary-input-text">Sign In</h1>
      <div className="text-primary-input-text w-[364px] mx-auto">
        <div>
          <Label text="Email Address" required />
          <TextInput
            name="email"
            placeholder="Enter Email Address"
            className="w-full mb-2"
            value={loginDetails.email}
            onChange={handleLoginDetailsChange}
            disabled={isAuthenticated}
          />
          {validationError?.email && <AuthError error={validationError.email[0]} />}
        </div>
        <div className="w-full">
          <div className="flex items-center gap-1">
            <Label text="Password" required />
            <Tooltip
              body="Password should be at least 8 characters long with at least one uppercase letter, one lowercase letter and one number."
              position="right"
              width="w-[140px]"
              bgColorClass="primary-input-text"
            >
              <Icon iconName="info-circle-solid" variant="xs" />
            </Tooltip>
          </div>
          <PasswordInput
            name="password"
            placeholder="Enter Password"
            className="w-full mb-2"
            inputClassName="w-full"
            value={loginDetails.password}
            onChange={handleLoginDetailsChange}
            disabled={isAuthenticated}
            autoComplete="off"
          />
          {validationError?.password
            ? validationError.password.map((error) => <AuthError key={error} error={error} />)
            : null}
          <div className="flex justify-end">
            <Link href="/auth/password-reset" passHref className="ml-4 mt-2">
              Forgotten Password?
            </Link>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Button
            variant="secondary"
            text="Sign Up"
            onClick={() => router.push('/auth/sign-up')}
            className="w-32"
            disabled={isAuthenticated}
          />
          <Button loading={isBusy} text="Next" onClick={attemptClerkAuth} className="w-32" disabled={isAuthenticated} />
        </div>
        {isAuthenticated && (
          <div>
            <div className="mt-10 mb-2 bg-white border-primary-border rounded-md border shadow-md w-full">
              <Select
                className="border-0 !shadow-none w-full"
                label="Company"
                onChange={(value) => setLoginDetails((prev) => ({ ...prev, company: value as string }))}
                options={accounts}
                value={loginDetails.company}
                isClearable={false}
              />
            </div>
            {validationError?.company && <AuthError error={validationError.company[0]} />}
            <div className="flex items-center mt-4 mb-2 w-full">
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
                autoComplete="off"
              />
            </div>
            {validationError?.pin && <AuthError error={validationError.pin[0]} />}
            <div className="flex justify-end mt-5">
              {isAuthenticated && (
                <Button text="Logout" variant="secondary" onClick={handleLogout} className="w-32 mr-3" />
              )}
              <Button text="Sign In" onClick={handleSignIn} className="w-32" />
            </div>
          </div>
        )}
        {!!error && (
          <div className="flex gap-3 items-center mt-5">
            <AuthError error={error} className="items-end" />
            {showLogout && <Button variant="secondary" text="Logout" onClick={handleLogout} />}
          </div>
        )}
      </div>
      {isBusy && <LoadingOverlay />}
    </div>
  );
};
export default SignIn;
