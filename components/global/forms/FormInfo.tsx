import classNames from 'classnames';
import { PropsWithChildren } from 'react';

interface FormInfoProps {
  intent?: undefined | 'DANGER' | 'WARNING';
  header?: string;
  className?: string;
}

export const FormInfo = ({ intent, children, header, className }: PropsWithChildren<FormInfoProps>) => {
  let baseClass = 'p-3 rounded  mb-4 shadow-sm';

  switch (intent) {
    case 'DANGER':
      baseClass = classNames(baseClass, 'bg-red-200');
      break;
    case 'WARNING':
      baseClass = classNames(baseClass, 'bg-amber-200');
      break;
    default:
      baseClass = classNames(baseClass, 'bg-blue-200');
      break;
  }

  return (
    <div className={classNames(baseClass, className)}>
      {header && <h3 className="text-lg mb-4">{header}</h3>}
      {children}
    </div>
  );
};
