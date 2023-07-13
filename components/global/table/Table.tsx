import classNames from 'classnames'
import { PropsWithChildren } from 'react'

interface ClassNameable {
  className?: string
}

/*
  Avoid duplciate classNames and make all tables look the same.
  If additional classes are needed, consider adding additional props such as 'minimal' 'center' etc.
*/

export const Table = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <table className="min-w-full">
      { children }
    </table>
  )
}

const HeaderRow = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <thead>
      <tr className="bg-primary-green ">
        { children }
      </tr>
    </thead>
  )
}

const HeaderCell = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <th
      scope="col"
      className="py-3.5 p1-4 pr-3 text-center text-sm font-normal text-white  sm:pl-6"
    >
      { children }
    </th>
  )
}

const Body = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <tbody className="bg-white">
      { children }
    </tbody>
  )
}

const Row = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <tr className="bg-white even:bg-gray-50">
      { children }
    </tr>
  )
}

interface CellProps extends ClassNameable {
  right?: boolean
}

const Cell = ({children, className, right}: PropsWithChildren<CellProps>) => {
  let baseClass = classNames('px-3 py-4 text-sm text-gray-500 border border-gray-200', className)
  if (right) baseClass = classNames(baseClass, 'text-right')

  return (
    <td className={baseClass}>{ children }</td>
  )
}

Table.HeaderRow = HeaderRow
Table.HeaderCell = HeaderCell
Table.Body = Body
Table.Row = Row
Table.Cell = Cell
