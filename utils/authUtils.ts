export const EMAIL_NOT_FOUND = 'form_identifier_not_found';
export const EMAIL_ALREADY_EXISTS = 'form_identifier_exists';
export const PASSWORD_INCORRECT = 'form_password_incorrect';
export const SESSION_ALREADY_EXISTS = 'session_exists';
export const INVALID_COMPANY_ID = 'Invalid Company Id';
export const INVALID_VERIFICATION_STRATEGY = 'strategy_for_user_invalid';

export const errorsMap = {
  form_identifier_not_found: 'This email address is not recognised',
  form_password_incorrect: 'Password incorrect',
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
