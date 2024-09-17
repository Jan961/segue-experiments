import { ReactNode } from 'react';
import formTypeMap from './formTypeMap';

export const createFormInput = (type: string, label: string, value: string): ReactNode => {
  const Component = formTypeMap[type];
  if (!Component) return null;
  return <Component value={value} label={label} />;
};
