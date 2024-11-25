import AuthError from 'components/auth/AuthError';
import { Button, Icon, Label, PasswordInput, TextInput, Tooltip } from 'components/core-ui-lib';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  PASSWORD_INCORRECT,
  INVALID_EMAIL_OR_COMPANY_NAME,
  EMAIL_NOT_FOUND,
  INVALID_VERIFICATION_STRATEGY,
  SESSION_ALREADY_EXISTS,
  PIN_REGEX,
} from 'utils/authUtils';
import { calibri } from 'lib/fonts';
import Image from 'next/image';
import axios from 'axios';
import { useSignUp } from '@clerk/nextjs';
import Link from 'next/link';

import { userPreSignUpSchema, userSignUpSchema } from 'validators/auth';
import useAuth from 'hooks/useAuth';
import usePermissions from 'hooks/usePermissions';
import { isNullOrEmpty } from 'utils';
import LoadingOverlay from '../../components/core-ui-lib/LoadingOverlay';
import useNavigation from 'hooks/useNavigation';

const DEFAULT_ACCOUNT_DETAILS = {
  firstName: '',
  lastName: '',
  companyName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  pin: 0,
  repeatPin: 0,
  isSystemAdmin: true,
};

const SignUp = () => {
  const router = useRouter();
  const { signIn, signOut } = useAuth();
  const { navigateToHome, navigateToSignIn, getSignInUrl } = useNavigation();
  const [isBusy, setIsBusy] = useState(false);
  const { isSignedIn, setUserPermissions } = usePermissions();
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const { isLoaded: signUpLoaded, signUp } = useSignUp();
  const [authMode, setAuthMode] = useState<'default' | 'newUser' | 'existingUser'>('default');
  const [signedInExistingUserDetails, setSignedInExistingUserDetails] = useState({
    organisationId: '',
    permissions: [],
  });
  const [accountDetails, setAccountDetails] = useState(DEFAULT_ACCOUNT_DETAILS);

  const handleAccountDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountDetails({ ...accountDetails, [e.target.name]: e.target.value });
  };

  const clearErrors = () => {
    setValidationError(null);
    setError('');
  };

  const verifyUserExits = async () => {
    try {
      const { data } = await axios.post('/api/user/verify', {
        companyName: accountDetails.companyName,
        email: accountDetails.email,
      });
      return data;
    } catch (err) {
      setError(err.errors[0].message);
    }
  };

  const processExistingUser = async () => {
    try {
      const userResponse = await verifyUserExits();
      if (userResponse.accountUserExists) {
        navigateToSignIn();
      } else {
        setAccountDetails((prev) => ({ ...prev, firstName: userResponse.firstName, lastName: userResponse.lastName }));
        setAuthMode('existingUser');
      }
    } catch (err) {
      setError(err.errors[0].message);
    }
  };

  const verifyCredentials = async () => {
    try {
      setError('');
      await userPreSignUpSchema.validate(accountDetails, { abortEarly: false });

      // Check for valid company id
      const { data } = await axios.post('/api/account/validate', {
        companyName: accountDetails.companyName,
        email: accountDetails.email,
      });

      if (!data.accountExists) {
        setError(INVALID_EMAIL_OR_COMPANY_NAME);
        return;
      }
      setAccountDetails((prev) => ({ ...prev, accountId: data.id }));
      // Check if user already registered with Clerk. The signIn method will error if the user already exists
      await signIn(accountDetails.email, 'dummy_password');
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const formattedErrors = error.inner.reduce((acc, err) => {
          return {
            ...acc,
            [err.path]: acc[err.path] ? [...acc[err.path], err.errors[0]] : [err.errors[0]],
          };
        }, {});
        setValidationError(formattedErrors);
      } else {
        const errorCode = error?.errors[0]?.code;

        if (errorCode === EMAIL_NOT_FOUND) {
          // check if the user exists in our database. This can happen when a user has already signed up but not yet verified email with clerk
          // Show error  to prevent them from signing up again
          const userResponse = await verifyUserExits();
          if (userResponse.accountUserExists) {
            setError('An error occurred, please contact Segue support');
            return;
          }
          setAuthMode('newUser');
        } else if (errorCode === PASSWORD_INCORRECT || errorCode === INVALID_VERIFICATION_STRATEGY) {
          // 'User already registeredwith clerk. Verify if they have a pin registered'
          processExistingUser();
        } else if (errorCode === SESSION_ALREADY_EXISTS) {
          setShowLogout(true);
          setError('Please log out of the current session and try again');
        } else {
          setError(error?.errors[0]?.messsage || 'An error occurred, please try again');
        }
      }
    }
  };

  const createNewUserWithClerk = async () => {
    try {
      const result = await signUp.create({
        emailAddress: accountDetails.email,
        password: accountDetails.password,
      });
      // Prepare email address verification
      await result.prepareEmailAddressVerification({
        strategy: 'email_link',
        redirectUrl: getSignInUrl(),
      });
    } catch (err) {
      setError(err.errors[0].code);
      console.error('error', err.errors[0].longMessage);
      throw err;
    }
  };

  const saveNewUser = async () => {
    setIsBusy(true);
    setShowLogout(false);
    try {
      await userSignUpSchema.validate(accountDetails, { abortEarly: false });
      // Create the user within clerk
      await createNewUserWithClerk();

      // Create the user in our database
      await axios.post('/api/user/create-admin-user', { user: accountDetails, accountUserOnly: false });

      router.push('/auth/user-created');
    } catch (error: any) {
      if (error instanceof yup.ValidationError) {
        const formattedErrors = error.inner.reduce((acc, err) => {
          return {
            ...acc,
            [err.path]: acc[err.path] ? [...acc[err.path], err.errors[0]] : [err.errors[0]],
          };
        }, {});
        setValidationError(formattedErrors);
      } else {
        console.error(error);
        setError('Something went wrong, please try again');
      }
    } finally {
      setIsBusy(false);
    }
  };

  const saveExistingUser = async () => {
    setIsBusy(true);
    setShowLogout(false);
    try {
      await userSignUpSchema.validate(
        { ...accountDetails, confirmPassword: accountDetails.password },
        { abortEarly: false },
      );
      // Authenticate the user within clerk first to check if we have a valid password
      await signIn(accountDetails.email, accountDetails.password);

      const sigInUrl = getSignInUrl();
      // Create the user in our database
      const { data } = await axios.post('/api/user/create-admin-user', {
        user: accountDetails,
        sigInUrl,
        accountUserOnly: true,
      });

      setSignedInExistingUserDetails({ organisationId: data.organisationId, permissions: data.permissions });
    } catch (error: any) {
      if (error instanceof yup.ValidationError) {
        const formattedErrors = error.inner.reduce((acc, err) => {
          return {
            ...acc,
            [err.path]: acc[err.path] ? [...acc[err.path], err.errors[0]] : [err.errors[0]],
          };
        }, {});
        setValidationError(formattedErrors);
      } else if (!isNullOrEmpty(error.errors)) {
        // We have a clerk error
        const errorCode = error.errors[0].code;
        setError(errorCode);
      } else {
        console.error(error);
        setError('Something went wrong, please try again');
      }
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    const setDataForSignedInUser = async (organisationId, permissions) => {
      await setUserPermissions(organisationId, permissions);
      navigateToHome();
    };

    if (isSignedIn && signedInExistingUserDetails.organisationId) {
      setDataForSignedInUser(signedInExistingUserDetails.organisationId, signedInExistingUserDetails.permissions);
    }
  }, [isSignedIn, signedInExistingUserDetails]);

  const handleSubmit = async () => {
    clearErrors();
    if (authMode === 'default') {
      verifyCredentials();
    } else if (authMode === 'newUser') {
      saveNewUser();
    } else if (authMode === 'existingUser') {
      saveExistingUser();
    }
  };

  const handleLogout = async () => {
    try {
      clearErrors();

      // Sign out from Clerk
      await signOut();
      setShowLogout(false);
      setAccountDetails(DEFAULT_ACCOUNT_DETAILS);
      router.replace(router.asPath);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`${calibri.variable} font-calibri background-gradient flex flex-col py-20  px-6`}>
      <Head>
        <title>Sign Up | Segue</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/segue/segue_mini_icon.png" type="image/png" />
      </Head>
      <Image className="mx-auto mb-2" height={160} width={310} src="/segue/segue_logo_full.png" alt="Segue" />
      <h1 className="my-4 text-2xl font-bold text-center text-primary-input-text">Setup New Account</h1>
      <div className="text-center text-primary-input-text w-[580px] mx-auto">
        <p>If you are joining an existing company account do not create a new account.</p>
        <p>Please contact your System Administrator for your sign-in details.</p>
        <p className="mt-5">
          The System Administrator will have the highest level of security access to this system. If you are not the
          person who will be fulfilling that role, please advise the relevant member of the team to create the account.
          Additional Users can be added later in the process.
        </p>
        {authMode === 'newUser' && (
          <p className="mt-5 text-primary-red">
            This email address is not yet associated with a Segue account. Please create a password.
          </p>
        )}
        {authMode === 'existingUser' && (
          <p className="mt-5 text-primary-red">
            This email address is already associated with a Segue account. Please enter your password.
          </p>
        )}
      </div>

      <div className="flex flex-col mx-auto w-[23rem] gap-3 mt-6">
        {authMode === 'newUser' && (
          <>
            <div className="w-full">
              <Label text="System Administrator First Name" required />
              <TextInput
                name="firstName"
                placeholder="Enter First Name"
                className="w-full mb-1"
                value={accountDetails.firstName}
                onChange={handleAccountDetailsChange}
                error={validationError?.firstName}
              />
              {validationError?.firstName && <AuthError error={validationError.firstName[0]} />}
            </div>
            <div className="w-full">
              <Label text="System Administrator Last Name" required />
              <TextInput
                name="lastName"
                placeholder="Enter Last Name"
                className="w-full mb-1"
                value={accountDetails.lastName}
                onChange={handleAccountDetailsChange}
                error={validationError?.lastName}
              />
              {validationError?.lastName && <AuthError error={validationError.lastName[0]} />}
            </div>
          </>
        )}

        <div className="w-full">
          <Label text="System Administrator Email Address" required />
          <TextInput
            name="email"
            placeholder="Enter Email Address"
            className="w-full mb-1"
            value={accountDetails.email}
            onChange={handleAccountDetailsChange}
            disabled={authMode !== 'default'}
            error={
              validationError?.email || error === INVALID_EMAIL_OR_COMPANY_NAME ? INVALID_EMAIL_OR_COMPANY_NAME : ''
            }
          />
          {validationError?.email && <AuthError error={validationError.email[0]} />}
        </div>

        {authMode !== 'default' && (
          <div className="w-full">
            <div className="flex items-center gap-1">
              <Label text={authMode === 'newUser' ? 'Create Password' : 'Password'} required />
              <Tooltip
                body="Password should be at least 8 characters long with at least one uppercase letter, one lowercase letter, one special character and one number."
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
              inputClassName="w-full"
              className="w-full mb-1"
              value={accountDetails.password}
              onChange={handleAccountDetailsChange}
              error={validationError?.password}
            />
            {validationError?.password && <AuthError error={validationError.password[0]} />}
            {authMode === 'existingUser' && (
              <div className="text-right mt-1">
                <Link className="text-primary-input-text text-sm" href="/forgot-password">
                  Forgotten password?
                </Link>
              </div>
            )}
          </div>
        )}
        {authMode === 'newUser' && (
          <div className="w-full">
            <Label text="Repeat Password" required />
            <PasswordInput
              name="confirmPassword"
              placeholder="Enter Password"
              inputClassName="w-full"
              className="w-full mb-1"
              value={accountDetails.confirmPassword}
              onChange={handleAccountDetailsChange}
              error={validationError?.confirmPassword}
            />
            {validationError?.confirmPassword && <AuthError error={validationError.confirmPassword[0]} />}
          </div>
        )}
        <div className="w-full">
          <Label text="Company Name" required />
          <TextInput
            name="companyName"
            testId="company-name"
            placeholder="Enter Company Name"
            className="w-full mb-1"
            value={accountDetails.companyName}
            onChange={handleAccountDetailsChange}
            disabled={authMode !== 'default'}
            error={
              validationError?.companyName || error === INVALID_EMAIL_OR_COMPANY_NAME
                ? INVALID_EMAIL_OR_COMPANY_NAME
                : ''
            }
          />
          {validationError?.companyName && <AuthError error={validationError.companyName[0]} />}
        </div>
        {authMode !== 'default' && (
          <div className="w-full flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1">
                <Label text="Create PIN for this account" required />
                <Tooltip
                  body="Please create a 5 digit pin for this account. The PIN must not contain more than 2 consecutive numbers, and not contain fully ascending or descending sequences"
                  position="right"
                  width="w-[140px]"
                  bgColorClass="primary-input-text"
                >
                  <Icon iconName="info-circle-solid" variant="xs" />
                </Tooltip>
              </div>
              <PasswordInput
                name="pin"
                placeholder="Enter PIN"
                className="w-32 mb-1"
                value={accountDetails.pin}
                type="password"
                onChange={handleAccountDetailsChange}
                error={validationError?.pin}
                pattern={PIN_REGEX}
              />
              {validationError?.pin && <AuthError error={validationError.pin[0]} />}
            </div>

            <div>
              <div className="flex items-center gap-1">
                <Label text="Repeat PIN" required />
                <Tooltip
                  body="Please repeat the 5 digit pin."
                  position="right"
                  width="w-[140px]"
                  bgColorClass="primary-input-text"
                >
                  <Icon iconName="info-circle-solid" variant="xs" />
                </Tooltip>
              </div>
              <PasswordInput
                name="repeatPin"
                placeholder="Repeat PIN"
                className="w-32 mb-1"
                value={accountDetails.repeatPin}
                type="password"
                onChange={handleAccountDetailsChange}
                pattern={PIN_REGEX}
                error={validationError?.repeatPin}
              />
              {validationError?.repeatPin && <AuthError error={validationError.repeatPin[0]} />}
            </div>
          </div>
        )}
        {error && (
          <div className="flex gap-3 items-center mt-5">
            <AuthError error={error} className=" min-w--32 items-end" />
            {showLogout && <Button variant="secondary" text="Logout" onClick={handleLogout} />}
          </div>
        )}
        <div className="mt-3 w-full flex items-center gap-2 justify-end">
          {authMode !== 'default' && (
            <Button text="Back" variant="secondary" onClick={() => setAuthMode('default')} className="w-32" />
          )}
          <Button
            text={authMode !== 'default' ? 'Sign Up' : 'Next'}
            onClick={handleSubmit}
            className="w-32"
            disabled={!signUpLoaded}
          />
        </div>
      </div>
      {isBusy && <LoadingOverlay className="top-20 left-20 right-20 bottom-20" />}
    </div>
  );
};

export default SignUp;
