import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import TextInput from 'components/core-ui-lib/TextInput';

import React, { useMemo, useState } from 'react';
import PasswordInput from 'components/core-ui-lib/PasswordInput';
import { useWizard } from 'react-use-wizard';
import AuthError from './AuthError';
import axios from 'axios';
import Select from 'components/core-ui-lib/Select';

type UserDetails = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  currency: string;
};

const DEFAULT_USER_DETAILS = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  companyName: '',
  currency: 'GBP',
};

const SignUpForm = () => {
  const { previousStep, nextStep } = useWizard();
  const [userDetails, setUserDetails] = useState<UserDetails>(DEFAULT_USER_DETAILS);
  const [error, setError] = useState<string>('');

  const isValidEmail = useMemo(() => {
    return /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userDetails.email);
  }, [userDetails.email]);

  const isFormValid = useMemo(() => {
    return (
      userDetails.firstName &&
      userDetails.lastName &&
      isValidEmail &&
      userDetails.password === userDetails.confirmPassword
    );
  }, [userDetails.firstName, userDetails.lastName, isValidEmail, userDetails.password, userDetails.confirmPassword]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSignUp = async () => {
    setError('');
    try {
      // Create a new account in the DB with an organisation id
      await axios.post(`/api/account/create`, userDetails);
      nextStep();
    } catch (err: any) {
      console.error('error', err);
    }
  };
  return (
    <div className="flex flex-col items-center mx-auto w-[34.75rem]">
      <div className="flex flex-col items-center text-primary-input-text text-center leading-[1.0625]">
        <h1 className="text-2xl font-bold text-center text-primary-input-text mb-4">Administrator Account</h1>
        <Label
          className="leading-[1.125]"
          text="If you are joining an existing company account do not create a new account."
        />
        <Label className="leading-[1.125]" text="Please contact your System Administrator for your sign-in details." />

        <Label
          className="mt-3 leading-[1.125]"
          text="The System Administrator will have the highest level of security access to this system. "
        />
        <Label
          className="leading-[1.125]"
          text="If you are not the person who will be fulfilling that role, please advise the relevant member of the team to create the
            account. Additional Users can be added later in the process."
        />
      </div>
      <div className="w-96 mt-5">
        <div>
          <Label text="System Administrator First Name" />
          <TextInput
            name="firstName"
            placeholder="Enter First Name"
            className="w-full"
            value={userDetails.firstName}
            onChange={handleValueChange}
          />
        </div>
        <div className="mt-3">
          <Label text="System Administrator Last Name" />
          <TextInput
            name="lastName"
            placeholder="Enter Last Name"
            className="w-full"
            value={userDetails.lastName}
            onChange={handleValueChange}
          />
        </div>
        <div className="mt-3">
          <Label text="Company" />
          <TextInput
            name="companyName"
            placeholder="Enter Company Name"
            className="w-full"
            value={userDetails.companyName}
            onChange={handleValueChange}
          />
        </div>
        <div className="mt-3">
          <Label text="Currency" />
          <Select
            name="currency"
            options={[{ value: 'GBP', text: 'GBP' }]}
            value="GBP"
            className="w-full"
            onChange={(value) => setUserDetails({ ...userDetails, currency: value.toString() })}
          />
        </div>
        <div className="mt-3">
          <Label text="System Administrator Email Address" />
          <TextInput
            name="email"
            placeholder="Enter Email Address"
            className="w-full"
            value={userDetails.email}
            onChange={handleValueChange}
          />
          {error && !isValidEmail && <AuthError error={error} />}
        </div>
        <div className="mt-3">
          <Label text="Create Password" />
          <PasswordInput
            name="password"
            inputClassName="w-full"
            className="w-full"
            value={userDetails.password}
            onChange={handleValueChange}
          />
        </div>
        <div className="mt-3">
          <Label text="Repeat Password" />
          <PasswordInput
            name="confirmPassword"
            inputClassName="w-full"
            className="w-full"
            value={userDetails.confirmPassword}
            onChange={handleValueChange}
          />
        </div>

        <div className="w-full flex items-center gap-2 justify-end mt-3">
          <Button text="Back" variant="secondary" onClick={previousStep} className="w-32" />
          <Button text="Sign Up" onClick={handleSignUp} className="w-32" disabled={!isFormValid} />
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
