import { Button, Icon, Label, PasswordInput, TextInput, Tooltip } from 'components/core-ui-lib';
import Image from 'next/image';
import { useState } from 'react';
import { calibri } from 'lib/fonts';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { emailSchema, passwordResetSchema } from 'validators/auth';
import AuthError from 'components/auth/AuthError';
import { isNullOrEmpty } from 'utils';
import { EMAIL_NOT_FOUND, SESSION_ALREADY_EXISTS } from 'utils/authUtils';
import Head from 'next/head';
import useAuth from 'hooks/useAuth';

const PasswordReset = () => {
  const { logout } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [showLogout, setShowLogout] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState(null);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    code: '',
  });
  const handleLoginDetailsChange = (e) => {
    setLoginDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const attemptClerkAuth = async () => {
    setError('');
    setShowLogout(false);
    if (isLoaded) {
      try {
        await emailSchema.validate(loginDetails);
        await signIn.create({
          strategy: 'reset_password_email_code',
          identifier: loginDetails.email,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error validating email:', error);
        if (error instanceof yup.ValidationError) {
          setValidationError({ errors: error.errors, path: error.path });
        } else if (!isNullOrEmpty(error.errors)) {
          const errorCode = error.errors[0].code;
          if (errorCode === EMAIL_NOT_FOUND) {
            setError('Email not found. Please contact your system administrator');
          } else if (errorCode === SESSION_ALREADY_EXISTS) {
            setShowLogout(true);
            setError('Please log out of the current session and try again');
          } else {
            setError(error.errors[0].messsage);
          }
        }
      }
    }
  };

  const resetPassword = async () => {
    setError('');
    try {
      await passwordResetSchema.validate(loginDetails, { abortEarly: false });

      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: loginDetails.code,
        password: loginDetails.password,
      });

      if (result.status === 'complete') {
        // Set the active session to
        // the newly created session (user is now signed in)
        setActive({ session: result.createdSessionId });
        setError('');
        router.push('/');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      if (error instanceof yup.ValidationError) {
        const formattedErrors = error.inner.reduce((acc, err) => {
          return {
            ...acc,
            [err.path]: acc[err.path] ? [...acc[err.path], err.errors[0]] : [err.errors[0]],
          };
        }, {});
        console.log('formattedErrors', formattedErrors);
        setValidationError(formattedErrors);
      } else if (!isNullOrEmpty(error.errors)) {
        setError(error.errors[0].longMessage);
      }
    }
  };

  const handleLogout = async () => {
    await logout(loginDetails.email);
    setIsAuthenticated(false);
    setError('');
    setShowLogout(false);
    setLoginDetails({ email: '', password: '', confirmPassword: '', code: '' });
    router.replace(router.asPath);
  };

  return (
    <div className={`${calibri.variable} font-calibri background-gradient flex flex-col py-20  px-6`}>
      <Head>
        <title>Password Reset | Segue</title>
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
          {validationError?.path === 'email' && <AuthError error={validationError.errors[0]} />}
        </div>
        <div className="mt-5 flex flex-col items-end gap-2">
          <div className="flex justify-end gap-2">
            <Button variant="secondary" text="Login" onClick={() => router.push('/auth/sign-in')} className="w-32" />
            <Button text="Get Password Rest Code" onClick={attemptClerkAuth} className="w-32" />
          </div>
        </div>

        {isAuthenticated && (
          <div>
            <div>
              <Label text="Code" required />
              <TextInput
                name="code"
                placeholder="Enter Code"
                className="w-full"
                value={loginDetails.code}
                autoComplete="off"
                onChange={handleLoginDetailsChange}
              />
              {validationError?.code && <AuthError error={validationError.code[0]} />}
            </div>
            <div className="w-full mt-4">
              <div className="flex items-center gap-1">
                <Label text="New Password" required />
                <Tooltip
                  body="Password should be at least 8 characters long with at least one uppercase letter, one special character, one lowercase letter and one number."
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
                value={loginDetails.password}
                autoComplete="off"
                onChange={handleLoginDetailsChange}
              />
              {validationError?.password
                ? validationError.password.map((error) => <AuthError key={error} error={error} />)
                : null}
            </div>
            <div>
              <Label text="Confirm Password" required />
              <TextInput
                name="confirmPassword"
                placeholder="Enter Password"
                className="w-full"
                value={loginDetails.confirmPassword}
                autoComplete="off"
                onChange={handleLoginDetailsChange}
              />
              {validationError?.confirmPassword && <AuthError error={validationError.confirmPassword[0]} />}
            </div>
            <div className="flex justify-end mt-5">
              <Button text="Submit" onClick={resetPassword} className="w-32" />
            </div>
          </div>
        )}
        {!!error && (
          <div className="flex gap-3 items-center mt-5">
            <AuthError error={error} />
            {showLogout && <Button variant="secondary" text="Logout" onClick={handleLogout} />}
          </div>
        )}
      </div>
    </div>
  );
};
export default PasswordReset;
