import { IconProp } from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames';
import Icon from 'components/core-ui-lib/Icon';
import Link from 'next/link';

type ItemDefinition = {
  disabled?: boolean;
  title: string;
  icon?: IconProp;
  iconName?: string;
  route?: string;
  color: string;
  onClick?: () => void;
  stroke?: string;
  fill?: string;
  textClass?: string;
  boxClass?: string;
};

interface SwitchBoardItemProps {
  link: ItemDefinition;
}

export const SwitchBoardItem = ({ link }: SwitchBoardItemProps) => {
  const content = (
    <>
      {link.iconName ? (
        <Icon
          iconName={link.iconName}
          variant="5xl"
          className="lg:h-13 lg:w-13 md:h-10 md:w-10"
          stroke={link.stroke}
          fill={link.fill}
        />
      ) : null}
      <span
        className={classNames(
          'text-center whitespace-break-spaces lg:text-responsive-lg md:text-base lg:mt-3 md:mt-2 mt-0 leading-[2.0625rem]',
          { 'w-min': !link.iconName },
        )}
      >
        {link.title}
      </span>
    </>
  );

  const baseClass = `
    ${
      link.disabled ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : `${link.color} hover:opacity-75`
    } h-full flex flex-col items-center justify-center whitespace-nowrap text-white text-center rounded-md`;

  return (
    <li key={link.title} className={`shadow-lg md:w-44 md:h-24 lg:w-56 lg:h-32 ${link.boxClass}`}>
      {link.route && (
        <Link href={link.disabled ? '#' : link.route} className={baseClass}>
          {content}
        </Link>
      )}
      {link.onClick && <button onClick={link.onClick}>{content}</button>}
    </li>
  );
};
