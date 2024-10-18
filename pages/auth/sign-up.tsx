import AuthError from 'components/auth/AuthError';
import { Button, Icon, Label, PasswordInput, TextInput, Tooltip } from 'components/core-ui-lib';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import {
  PASSWORD_INCORRECT,
  validateEmail,
  INVALID_COMPANY_ID,
  EMAIL_NOT_FOUND,
  INVALID_VERIFICATION_STRATEGY,
  SESSION_ALREADY_EXISTS,
} from 'utils/authUtils';
import { calibri } from 'lib/fonts';
import Image from 'next/image';
import axios from 'axios';
import { useClerk, useSignIn, useSignUp } from '@clerk/nextjs';
import Link from 'next/link';
import classNames from 'classnames';

const PIN_REGEX = /^[0-9]{4}$/;

const DEFAULT_ACCOUNT_DETAILS = {
  firstName: '',
  lastName: '',
  companyName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  organisationId: '',
  pin: '',
  repeatPin: '',
};

const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const { signOut } = useClerk();
  const { isLoaded: signUpLoaded, signUp } = useSignUp();
  const [authMode, setAuthMode] = useState<'default' | 'signUp' | 'signIn'>('default');
  const { signIn } = useSignIn();
  const [accountDetails, setAccountDetails] = useState(DEFAULT_ACCOUNT_DETAILS);

  const isValidEmail = useMemo(() => validateEmail(accountDetails.email), [accountDetails.email]);

  const isFormValid = useMemo(() => {
    switch (authMode) {
      case 'default':
        return isValidEmail && accountDetails.organisationId;
      case 'signUp':
        return PIN_REGEX.test(accountDetails.pin) && accountDetails.pin === accountDetails.repeatPin;
      case 'signIn':
        return true;
    }
  }, [accountDetails, isValidEmail, authMode]);

  const handleAccountDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountDetails({ ...accountDetails, [e.target.name]: e.target.value });
  };

  const verifyUserExits = async () => {
    try {
      const { data } = await axios.post('/api/user/verify', {
        organisationId: accountDetails.organisationId,
        Email: accountDetails.email,
      });
      if (data.id) {
        setAccountDetails((prev) => ({ ...prev, accountId: data.id }));
      } else {
        setAuthMode('signIn');
      }
    } catch (err) {
      setError(err.errors[0].message);
    }
  };

  const verifyCredentials = async () => {
    try {
      // Check for valid company id
      const { data } = await axios.post('/api/account/validate', {
        organisationId: accountDetails.organisationId,
        email: accountDetails.email,
      });

      if (!data.id) {
        setError(INVALID_COMPANY_ID);
        return;
      }
      setAccountDetails((prev) => ({ ...prev, accountId: data.id }));
      // Check if user already registered with Clerk
      await signIn.create({
        identifier: accountDetails.email,
        password: 'dummy_password',
      });
      return true;
    } catch (err) {
      const errorCode = err.errors[0].code;

      if (errorCode === EMAIL_NOT_FOUND) {
        setAuthMode('signUp');
      } else if (errorCode === PASSWORD_INCORRECT || errorCode === INVALID_VERIFICATION_STRATEGY) {
        // 'User already registeredwith clerk. Verify if they have a pin registered'
        verifyUserExits();
      } else if (errorCode === SESSION_ALREADY_EXISTS) {
        setShowLogout(true);
        setError('Please log out of the current session and try again');
      } else {
        setError(err.errors[0].messsage);
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
        redirectUrl: `${window.location.origin}/sign-in`,
      });
      return true;
    } catch (err) {
      setError(err.errors[0].code);
      console.error('error', err.errors[0].longMessage);
      return false;
    }
  };

  const handleSaveUser = async () => {
    setShowLogout(false);
    try {
      // Create the user within clerk
      await createNewUserWithClerk();

      // Create the user in our database
      await axios.post('/api/user/create', accountDetails);

      router.push('/auth/user-created');
    } catch (error: any) {
      setError('Something went wrong, please try again');
    }
  };

  const handleUpdateUser = async () => {
    try {
      await axios.post('/api/user/update', accountDetails);
      router.push('/auth/sign-in ');
    } catch (error: any) {
      setError('Something went wrong, please try again');
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (authMode === 'default') {
      verifyCredentials();
    } else if (authMode === 'signUp') {
      handleSaveUser();
    } else if (authMode === 'signIn') {
      handleUpdateUser();
    }
  };

  const handleLogout = async () => {
    try {
      setError('');

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
        {authMode === 'signUp' && (
          <p className="mt-5 text-primary-red">
            This email address is not yet associated with a Segue account. Please create a password.
          </p>
        )}
        {authMode === 'signIn' && (
          <p className="mt-5 text-primary-red">
            This email address is already associated with a Segue account. Please enter your password.
          </p>
        )}
      </div>

      <div className="flex flex-col mx-auto w-[23rem] gap-3 mt-6">
        <div className="w-full">
          <Label text="Company ID (please refer to setup email" required />
          <TextInput
            name="organisationId"
            placeholder="Enter Company Id"
            className="w-full"
            value={accountDetails.organisationId}
            onChange={handleAccountDetailsChange}
            disabled={authMode !== 'default'}
          />
          {error === INVALID_COMPANY_ID && <AuthError error={error} />}
        </div>
        {authMode === 'signUp' && (
          <>
            <div className="w-full">
              <Label text="System Administrator First Name" required />
              <TextInput
                name="firstName"
                placeholder="Enter First Name"
                className="w-full"
                value={accountDetails.firstName}
                onChange={handleAccountDetailsChange}
              />
            </div>
            <div className="w-full">
              <Label text="System Administrator Last Name" required />
              <TextInput
                name="lastName"
                placeholder="Enter Last Name"
                className="w-full"
                value={accountDetails.lastName}
                onChange={handleAccountDetailsChange}
              />
            </div>
          </>
        )}
        <div className="w-full">
          <Label text="System Administrator Email Address" required />
          <TextInput
            name="email"
            placeholder="Enter Email Address"
            className="w-full"
            value={accountDetails.email}
            onChange={handleAccountDetailsChange}
            disabled={authMode !== 'default'}
          />
        </div>
        {authMode !== 'default' && (
          <div className="w-full">
            <div className="flex items-center gap-1">
              <Label text={authMode === 'signUp' ? 'Create Password' : 'Password'} required />
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
              inputClassName="w-full"
              className="w-full"
              value={accountDetails.password}
              onChange={handleAccountDetailsChange}
            />
            <div className="text-right mt-1">
              <Link className="text-primary-input-text text-sm" href="/forgot-password">
                Forgotten password?
              </Link>
            </div>
          </div>
        )}
        {authMode === 'signUp' && (
          <div className="w-full">
            <Label text="Repeat Password" required />
            <PasswordInput
              name="confirmPassword"
              placeholder="Enter Password"
              inputClassName="w-full"
              className="w-full"
              value={accountDetails.confirmPassword}
              onChange={handleAccountDetailsChange}
            />
            {error === PASSWORD_INCORRECT && <AuthError error={error} />}
          </div>
        )}
        {authMode !== 'default' && (
          <div className="w-full flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1">
                <Label text="Create PIN for this account" required />
                <Tooltip
                  body="Please create a 4 digit pin for this account."
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
                className="w-32"
                value={accountDetails.pin}
                maxlength={4}
                onChange={handleAccountDetailsChange}
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Label text="Repeat PIN" required />
                <Tooltip
                  body="Please repeat the 4 digit pin."
                  position="right"
                  width="w-[140px]"
                  bgColorClass="primary-input-text"
                >
                  <Icon iconName="info-circle-solid" variant="xs" />
                </Tooltip>
              </div>
              <PasswordInput
                name="repeatPin"
                placeholder="Enter PIN"
                className="w-32"
                value={accountDetails.repeatPin}
                maxlength={4}
                onChange={handleAccountDetailsChange}
              />
            </div>
          </div>
        )}
        {error.includes('current session') && (
          <div className="flex gap-3 items-center mt-5">
            <AuthError error={error} className="items-end" />
            {showLogout && <Button variant="secondary" text="Logout" onClick={handleLogout} />}
          </div>
        )}
        <div
          className={classNames('w-full flex items-center gap-2 mt-5 justify-end', {
            'justify-between': authMode !== 'default',
          })}
        >
          {authMode !== 'default' && (
            <Button text="Back" variant="secondary" onClick={() => setAuthMode('default')} className="w-32" />
          )}
          <Button
            text={authMode !== 'default' ? 'Sign Up' : 'Next'}
            onClick={handleSubmit}
            className="w-32"
            disabled={!isFormValid || !signUpLoaded}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
