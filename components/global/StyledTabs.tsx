import { Tab } from '@headlessui/react'
import classNames from 'classnames'
import { PropsWithChildren, Fragment } from 'react'

export const StyledTab = ({ children }: PropsWithChildren<unknown>) => {
  const commonClass = 'p-2 px-4 rounded mr-2'

  return (
    <Tab as={Fragment}>
      {({ selected }) => (
        <button className={selected
          ? classNames('bg-primary-blue text-white', commonClass)
          : classNames('bg-gray-300 bg-opacity-50', commonClass)
        } >
          { children}
        </button>
      )}
    </Tab>
  )
}
