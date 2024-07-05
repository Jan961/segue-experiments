import Label from 'components/core-ui-lib/Label';
import { errorsMap } from 'utils/authUtils';

const AuthError = ({ error }: { error: string }) => {
  if (!error) {
    return null;
  }
  const errorMessage = errorsMap[error] || error;
  return <Label variant="sm" className="ml-2 text-primary-red" text={errorMessage} />;
};

export default AuthError;
