import { PropsWithChildren } from 'react';

export const FormContainer = ({ children }: PropsWithChildren<unknown>) => {
  return <div className="p-4 rounded-lg shadow-lg relative mb-4 max-w-screen-md mx-auto bg-white">{children}</div>;
};
