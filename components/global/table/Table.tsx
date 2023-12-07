import classNames from 'classnames';
import { PropsWithChildren } from 'react';

interface ClassNameable {
  className?: string;
  style?: any;
}

/*
  Avoid duplciate classNames and make all tables look the same.
  If additional classes are needed, consider adding additional props such as 'minimal' 'center' etc.
*/

export const Table = ({ children, className, ...props }: PropsWithChildren<ClassNameable>) => {
  return (
    <table className={classNames('min-w-full', className)} {...props}>
      {children}
    </table>
  );
};

interface HeaderRowProps {
  bg?: string;
  className?: string;
}

const HeaderRow = ({ children, bg, className }: PropsWithChildren<HeaderRowProps>) => {
  return (
    <thead className="sticky top-0 border-b-2">
      <tr className={classNames(bg || className)}>{children}</tr>
    </thead>
  );
};

const HeaderCell = ({ children, className }: PropsWithChildren<ClassNameable>) => {
  return (
    <th
      scope="col"
      className={classNames(
        'sticky top-0 py-2 px-2 text-primary-purple text-left font-bold text-xs whitespace-nowrap',
        className,
      )}
    >
      {children}
    </th>
  );
};

const Body = ({ children, className, ...props }: PropsWithChildren<ClassNameable>) => {
  return (
    <tbody className={classNames('divide-y divide-gray-200', className)} {...props}>
      {children}
    </tbody>
  );
};

interface RowProps extends ClassNameable {
  hover?: boolean;
  className?: string;
  onClick?: () => void;
  ref?: any;
  id?: string;
}

const Row = ({ children, hover, onClick, className, ...props }: PropsWithChildren<RowProps>) => {
  let baseClass = 'bg-transparent';

  if (hover) baseClass = classNames(baseClass, 'hover:bg-gray-100 cursor-pointer', className);

  return (
    <tr className={baseClass} onClick={onClick} {...props}>
      {children}
    </tr>
  );
};

interface CellProps extends ClassNameable {
  right?: boolean;
}

const Cell = ({ children, className, right }: PropsWithChildren<CellProps>) => {
  let baseClass = classNames('px-2 py-2 text-gray-500 border-b-2 text-sm font-semibold', className);
  if (right) baseClass = classNames(baseClass, 'text-right');

  return <td className={baseClass}>{children}</td>;
};

Table.HeaderRow = HeaderRow;
Table.HeaderCell = HeaderCell;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;
