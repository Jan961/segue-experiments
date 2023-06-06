import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Disclosure, Transition } from '@headlessui/react'
import { PropsWithChildren } from 'react'

interface PanelDrawerProps {
  title: string
  open: boolean
}

export const PanelDrawer = ({ children, title, open = false}: PropsWithChildren<PanelDrawerProps>) => {
  return (
    <Disclosure defaultOpen={open}>
      {({ open }) => (
        /* Use the `open` state to conditionally change the direction of an icon. */
        <>
          <Disclosure.Button
            className="rounded bg-gray-200 hover:bg-gray-300
            flex justify-between
            w-full py-2 px-3 mt-2 text-left">
            { title }
            <FontAwesomeIcon
              icon={faChevronRight}
              className={open ? 'rotate-90 transform p-1' : 'p-1'}
            />
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="mt-2">{ children }</Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}
