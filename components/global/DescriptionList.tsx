import classNames from 'classnames'
import { PropsWithChildren } from 'react'

interface ClassNameable {
  className?: string
}

/*
  Avoid duplicate classNames and make all description lists look the same.
  If additional classes are needed, consider adding additional props such as 'minimal' 'center' etc.
*/

interface DescriptionListProps extends ClassNameable {
  inline?: boolean
}

export const DescriptionList = ({ children, className, inline = true}: PropsWithChildren<DescriptionListProps>) => {
  let baseClass = ''
  if (inline) baseClass = classNames(baseClass, 'grid grid-cols-2 justify-items-start place-items-center')

  return (
    <dl className={classNames(baseClass, className)}>
      { children }
    </dl>
  )
}

const Term = ({ children, className }: PropsWithChildren<ClassNameable>) => {
  const baseClass = classNames('mb-1 opacity-50 mr-2', className)

  return (
    <dt className={baseClass}>
      { children }:
    </dt>
  )
}

interface DescriptionProps extends ClassNameable {
  italic?: boolean
}

const Desc = ({ children, italic, className }: PropsWithChildren<DescriptionProps>) => {
  let baseClass = classNames('mb-1', className)

  if (italic) baseClass = classNames(baseClass, 'italic')

  return (
    <dd className={baseClass}>
      { children }
    </dd>
  )
}

DescriptionList.Term = Term
DescriptionList.Desc = Desc
