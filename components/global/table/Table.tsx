import classNames from 'classnames'
import { PropsWithChildren } from 'react'

interface ClassNameable {
  className?: string
}

/*
  Avoid duplciate classNames and make all tables look the same.
  If additional classes are needed, consider adding additional props such as 'minimal' 'center' etc.
*/

export const Table = ({ children, className }: PropsWithChildren<ClassNameable>) => {
  return (
    <table className={ classNames('min-w-full', className) }>
      { children }
    </table>
  )
}

interface HeaderRowProps {
  bg?: string
}

const HeaderRow = ({ children, bg }: PropsWithChildren<HeaderRowProps>) => {
  return (
    <thead>
      <tr className={bg || 'bg-primary-green'}>
        { children }
      </tr>
    </thead>
  )
}

const HeaderCell = ({ children, className }: PropsWithChildren<ClassNameable>) => {
  return (
    <th
      scope="col"
      className={classNames('py-2 px-2 text-left font-bold text-xs whitespace-nowrap text-white', className) }
    >
      { children }
    </th>
  )
}

const Body = ({ children, className }: PropsWithChildren<ClassNameable>) => {
  return (
    <tbody className={classNames('bg-white divide-y divide-gray-200', className)}>
      { children }
    </tbody>
  )
}

interface RowProps extends ClassNameable {
  hover?: boolean
  className?:string
  onClick?: () => void
}

const Row = ({ children, hover, onClick, className }: PropsWithChildren<RowProps>) => {
  let baseClass = 'bg-white even:bg-gray-50'

  if (hover) baseClass = classNames(baseClass, 'hover:bg-gray-100 cursor-pointer', className)

  return (
    <tr className={baseClass} onClick={onClick}>
      { children }
    </tr>
  )
}

interface CellProps extends ClassNameable {
  right?: boolean
}

const Cell = ({ children, className, right }: PropsWithChildren<CellProps>) => {
  let baseClass = classNames('px-2 py-2 text-gray-500 border border-gray-200', className)
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
