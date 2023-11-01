import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';

interface MenuButtonProps {
  onClick?: (e: any) => void;
  href?: string;
  iconRight?: IconDefinition;
  iconLeft?: IconDefinition;
  icon?: IconDefinition;
  intent?: undefined | 'DANGER';
  submit?: boolean;
  disabled?: boolean;
  className?: string;
}

export const MenuButton = ({
  children,
  iconLeft,
  iconRight,
  icon,
  onClick,
  intent,
  href,
  submit,
  disabled,
  className,
}: PropsWithChildren<MenuButtonProps>) => {
  const router = useRouter();

  let buttonClass = `font-bold
  text-sm px-3 py-2 rounded shadow
  outline-none focus:outline-none ml-2 mr-1 mb-1 ease-linear
  transition-all duration-150`;

  switch (intent) {
    case undefined:
      buttonClass += ' bg-primary-blue text-white hover:bg-blue-400 active:bg-blue-600';
      if (!disabled) buttonClass += ' hover:bg-blue-400';
      break;
    case 'DANGER':
      buttonClass += ' bg-red-600 text-white hover:bg-red-400 active:bg-red-600';
      break;
  }

  if (disabled) {
    buttonClass += ' opacity-50 cursor-not-allowed';
  }

  const nonPropogatedClick = (e: any) => {
    if (!onClick) return;

    e.preventDefault();
    onClick(e);
  };

  const nonPropogatedNav = (e: any) => {
    e.stopPropagation();
    router.push(href);
  };

  if (href) {
    return (
      <Link href={href} className={classNames(buttonClass, className)} onClick={nonPropogatedNav}>
        {iconLeft && <FontAwesomeIcon icon={iconLeft} className="mr-2" />}
        {children}
        {icon && <FontAwesomeIcon icon={icon} />}
        {iconRight && <FontAwesomeIcon icon={iconRight} className="ml-2" />}
      </Link>
    );
  }
  return (
    <button
      disabled={disabled}
      className={classNames(buttonClass, className)}
      type={submit ? 'submit' : 'button'}
      onClick={nonPropogatedClick}
    >
      {iconLeft && <FontAwesomeIcon icon={iconLeft} className="mr-2" />}
      {children}
      {icon && <FontAwesomeIcon icon={icon} />}
      {iconRight && <FontAwesomeIcon icon={iconRight} className="ml-2" />}
    </button>
  );
};
