import { FontawesomeObject } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React, { PropsWithChildren, ReactNode } from 'react'

export const BreadCrumb = ({ children }: PropsWithChildren<unknown>) => {
  const items = React.Children.toArray(children).length

  return (<ul className="mb-4">
    {
      React.Children.map(children, (x: ReactNode, index) => {
        return (
          <li key={index} className="inline-block">
            { x }
            { index + 1 < items && (<FontAwesomeIcon className="mx-2 ml-1" icon={faChevronRight} />)}
          </li>
        )
      })
    }
  </ul>)
}

interface BreadCrumbItemProps {
  href?: string
  icon?: FontawesomeObject
}

const BreadCrumbItem = ({ href, icon, children } :PropsWithChildren<BreadCrumbItemProps>) => {
  if (href) return <Link href={href} className="underline text-primary-blue inline-block">{ children } </Link>
  return <h1 className="font-bold">{children}</h1>
}

BreadCrumb.Item = BreadCrumbItem
