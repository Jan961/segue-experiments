import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import TextInput from 'components/core-ui-lib/TextInput';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import PasswordInput from 'components/core-ui-lib/PasswordInput';

type UserDetails = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
  companyName: string;
};

const DEFAULT_USER_DETAILS = {
  firstName: '',
  lastName: '',
  emailAddress: '',
  password: '',
  confirmPassword: '',
  companyName: '',
};
const SignUpForm = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDetails>(DEFAULT_USER_DETAILS);
  const [error, setError] = useState<string>('');
  const { signUp } = useSignUp();

  const isValidEmail = useMemo(() => {
    return /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userDetails.emailAddress);
  }, [userDetails.emailAddress]);

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
    // Start the sign-up process using the email and password provided
    try {
      await signUp.create({
        emailAddress: userDetails.emailAddress,
        password: userDetails.password,
      });

      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
    } catch (err: any) {
      setError(err.errors[0].code);
      console.error('error', err.errors[0].longMessage);
    }
  };
  return (
    <div className="flex flex-col items-center mx-auto w-[34.75rem]">
      <div className="flex flex-col items-center text-primary-input-text text-center leading-[1.0625]">
        <h1 className="text-responsive-lg leading-[2.5625rem] mb-2 font-bold">Create New Account</h1>
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
          <Label text="Company Name (if applicable)" />
          <TextInput
            name="companyName"
            placeholder="Enter Company Name"
            className="w-full"
            value={userDetails.companyName}
            onChange={handleValueChange}
          />
        </div>
        <div className="mt-3">
          <Label text="System Administrator Email Address" />
          <TextInput
            name="emailAddress"
            placeholder="Enter Email Address"
            className="w-full"
            value={userDetails.emailAddress}
            onChange={handleValueChange}
          />
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
          <Button text="Sign In" variant="secondary" onClick={() => router.push('/auth/sign-in')} className="w-32" />
          <Button text="Sign Up" onClick={handleSignUp} className="w-32" disabled={!isFormValid} />
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
