import { ReactNode } from 'react';
import formTypeMap from './formTypeMap';

export const createFormInput = (type: string, label: string, value: string): ReactNode => {
  const Component = formTypeMap[type];
  if (!Component) return null;
  return (
    <div>
      <div className="w-52">{label}</div>
      <Component value={value} />
    </div>
  );
};
