import * as React from 'react';
import { useRouter } from 'next/router';
import { useClerk } from '@clerk/nextjs';
import { userService } from 'services/user.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { faHome, faSignOutAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SegueLogo } from './global/SegueLogo';
// import { FormInputSelect } from './global/forms/FormInputSelect';
// import { availableLocales } from 'config/global';
// import { useRecoilState } from 'recoil';
// import { globalState } from 'state/global/globalState';
import useStrings from 'hooks/useStrings';
import Icon from './core-ui-lib/Icon';

interface HeaderNavButtonProps {
  icon: IconDefinition;
  onClick?: () => void;
  className: string;
  href?: string;
}

const HeaderNavButton = ({
  icon,
  onClick,
  className,
  children,
  href,
}: React.PropsWithChildren<HeaderNavButtonProps>) => {
  const ContainerClasses =
    'text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium';
  const ButtonClasses = 'rounded-full p-2 text-white ml-2';

  if (href) {
    return (
      <a href={href} className={ContainerClasses}>
        {children}
        <FontAwesomeIcon icon={icon} size="xs" className={classNames(className, ButtonClasses)} />
      </a>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={ContainerClasses}>
        {children}
        <FontAwesomeIcon icon={icon} size="xs" className={classNames(className, ButtonClasses)} />
      </button>
    );
  }
};

const HeaderNavDivider = () => <span className="mx-2">{' | '}</span>;

export const HeaderNav = ({ menuIsOpen, setMenuIsOpen }: any) => {
  // const [username, setUsername] = React.useState('My Account');
  // const [userPrefs, setUserPrefs] = useRecoilState(globalState);
  const getString = useStrings();
  const router = useRouter();
  const { signOut } = useClerk();

  const logout = async () => {
    userService.logout();
    await signOut();
    router.push('/');
  };
  /* const user = userService.userValue;
   React.useEffect(() => {
    if (user && user.name) {
      setUsername(user.name);
    }
  }, [user]); 
   const onLocaleChange = (e: any) => {
    setUserPrefs({ ...userPrefs, locale: e.target.value });
  }; */

  return (
    <nav>
      <div>
        <div className="flex justify-between items-center">
          <div
            onClick={() => setMenuIsOpen(!menuIsOpen)}
            className="flex items-center h-20 cursor-pointer hover:opacity-70"
          >
            <div id="menu-icon" className="p-2 px-4 pr-2 text-primary-blue">
              <Icon iconName="menu" className="pointer-events-none" variant="xl" />
            </div>
            <SegueLogo className="w-36" />
          </div>
          <div className="flex flex-row items-center pr-10">
            <HeaderNavButton icon={faHome} href="/" className="bg-primary-green">
              {getString('global.home')}
            </HeaderNavButton>

            {/* <div className="">
              <FormInputSelect
                onChange={onLocaleChange}
                value={userPrefs.locale}
                name={'locale'}
                options={availableLocales}
              />
            </div> */}
            <HeaderNavDivider />
            <HeaderNavButton icon={faSignOutAlt} onClick={logout} className="bg-primary-purple">
              {getString('global.logOut')}
            </HeaderNavButton>
          </div>
        </div>
      </div>
    </nav>
  );
};
