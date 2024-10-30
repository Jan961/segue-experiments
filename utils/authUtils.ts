import generator from 'generate-password';
export const EMAIL_NOT_FOUND = 'form_identifier_not_found';
export const EMAIL_ALREADY_EXISTS = 'form_identifier_exists';
export const PASSWORD_INCORRECT = 'form_password_incorrect';
export const SESSION_ALREADY_EXISTS = 'session_exists';
export const INVALID_EMAIL_OR_COMPANY_NAME = 'Invalid Email or Company Name';
export const INVALID_VERIFICATION_STRATEGY = 'strategy_for_user_invalid';

export const errorsMap = {
  form_identifier_not_found: 'Email not found.',
  form_password_incorrect: 'Password is incorrect.',
  session_exists: 'Please log out of the current session and try again.',
  form_identifier_exists: 'Email already exists. Please try logging in.',
};

/* 
  Validate Email Rexgex checks for the following
    1. Starts with one or more alphanumeric characters, hyphens, or dots.
    2. Contains an @ symbol.
    3. Contains one or more groups of alphanumeric characters or hyphens followed by a dot (e.g., domain.).
    4. Ends with a top-level domain that is between 2 and 4 characters long, consisting of alphanumeric characters or hyphens.
  Valid  values - user.name@example.com, user-name@sub.domain.co.uk, username@domain.info
  Invalid values - username@domain, user@.com
*/
export const validateEmail = (value: string) => {
  return value ? /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) : false;
};

// Regex ensures: at least one lowercase letter, one uppercase letter, one digit, one symbol, exactly 8 characters long
export const validatePassword = (value: string) => {
  return value ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{8}$/.test(value) : false;
};

/*
  Validate PIN Regex checks for the following
    1. Exactly 5 digits long.
    2. Does not contain more than 2 consecutive ascending or descending numbers.
    3. Does not contain fully ascending or descending sequences.
*/
export const validatePin = (value: number) => {
  if (typeof value !== 'number' || !/^\d{5}$/.test(value.toString())) {
    return { valid: false, message: 'Not a 5-digit number' };
  }

  const digits = value.toString().split('').map(Number);

  // Check for more than 2 consecutive numbers in any order
  for (let i = 0; i < digits.length - 2; i++) {
    const diff1 = digits[i + 1] - digits[i];
    const diff2 = digits[i + 2] - digits[i + 1];

    if ((diff1 === 1 && diff2 === 1) || (diff1 === -1 && diff2 === -1)) {
      return { valid: false, message: 'More than 2 consecutive numbers' };
    }
  }

  // Check for fully ascending or descending sequences
  const isAscending = digits.every((digit, i, arr) => i === 0 || digit > arr[i - 1]);
  const isDescending = digits.every((digit, i, arr) => i === 0 || digit < arr[i - 1]);

  if (isAscending || isDescending) {
    return { valid: false, message: 'All numbers in sequence ascending or descending' };
  }

  return { valid: true, message: '' };
};

export const generateUserPin = (): number => {
  const pin = generator.generate({
    length: 5,
    numbers: true,
    symbols: false,
    lowercase: false,
    uppercase: false,
    strict: true,
  });
  return Number(pin);
};

export const generateUserPassword = (): string => {
  return generator.generate({
    length: 8,
    numbers: true,
    symbols: true,
    lowercase: true,
    uppercase: true,
    strict: true,
  });
};
