import { useMemo } from 'react';
import { errorsMap } from 'utils/authUtils';
const regex = /(?<=\.\s)(?=[A-Z])/;

const AuthError = ({ error, className = '' }: { error: string; className?: string }) => {
  const errors = useMemo(() => {
    if (!error) {
      return null;
    }
    const errorMessage = errorsMap[error] || error;
    return errorMessage?.split(regex) || [];
  }, [error]);

  if (!errors) {
    return null;
  }

  return (
    <div className={`flex flex-col w-full ${className}`} data-testid="auth-error">
      {errors.map((err) => (
        <p key={err} className="text-responsive-sm text-primary-red">
          {err}
        </p>
      ))}
    </div>
  );
};

export default AuthError;
