import * as React from 'react'
import { useRouter } from 'next/router'
import { useClerk } from "@clerk/nextjs";
import { userService } from 'services/user.service'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { faHome, faUser, faSignOutAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons'

interface HeaderNavButtonProps {
  icon: IconDefinition;
  onClick?: () => void;
  className: string;
  href?: string
}

const HeaderNavButton = ({ icon, onClick, className, children, href }: React.PropsWithChildren<HeaderNavButtonProps>) => {
  const ContainerClasses = 'text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium'
  const ButtonClasses = 'rounded-full p-2 text-white ml-2'

  if (href) {
    return (
      <a
        href={href}
        className={ContainerClasses}
      >
        { children }
        <FontAwesomeIcon
          icon={icon}
          size='xs'
          className={classNames(className, ButtonClasses)}
        />
      </a>
    )
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={ContainerClasses}
      >
        { children }
        <FontAwesomeIcon
          icon={icon}
          size='xs'
          className={classNames(className, ButtonClasses)}
        />
      </button>
    )
  }
}

const HeaderNavDivider = () => (<span className="mx-2">{' | '}</span>)

export const HeaderNav = ({ menuIsOpen, setMenuIsOpen }:any) => {
  const [username, setUsername] = React.useState('My Account')
  const router = useRouter()
  const { signOut } = useClerk()

  function logout () {
    userService.logout()
    signOut()
    router.push('/')
  }
  const user = userService.userValue
  React.useEffect(() => {
    if (user && user.name) {
      setUsername(user.name)
    }
  }, [user])

  return (
    <nav>
      <div>
        <div className="flex justify-between items-center">
          <div onClick={() => setMenuIsOpen(!menuIsOpen)} className="flex items-center h-20">
            <img
              className="sticky h-full w-auto"
              src="/segue/segue_logo.png"
              alt="Your Company"
            />
          </div>
          <div className="flex flex-row items-center pr-2">
            <HeaderNavButton
              icon={faHome}
              href='/'
              className="bg-primary-green"
            >
              Home
            </HeaderNavButton>
            <HeaderNavDivider />
            <HeaderNavButton
              icon={faUser}
              href='/accounts'
              className="bg-primary-orange"
            >
              { username }
            </HeaderNavButton>
            <HeaderNavDivider />
            <HeaderNavButton
              icon={faSignOutAlt}
              onClick={logout}
              className="bg-purple-500"
            >
              Log Out
            </HeaderNavButton>
          </div>
        </div>
      </div>
    </nav>
  )
}
