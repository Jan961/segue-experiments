export const EMAIL_NOT_FOUND = 'form_identifier_not_found';
export const EMAIL_ALREADY_EXISTS = 'form_identifier_exists';
export const PASSWORD_INCORRECT = 'form_password_incorrect';
export const INVALID_COMPANY_ID = 'Invalid Company Id';
export const INVALID_VERIFICATION_STRATEGY = 'strategy_for_user_invalid';

export const errorsMap = {
  form_identifier_not_found: 'This email address is not recognised',
  form_password_incorrect: 'Password incorrect',
};

export const validateEmail = (value: string) => {
  return /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
};
