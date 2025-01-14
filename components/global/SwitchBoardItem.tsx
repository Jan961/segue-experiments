import { IconProp } from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames';
import Icon from 'components/core-ui-lib/Icon';
import Link from 'next/link';
import { Tooltip } from 'components/core-ui-lib';

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
  tooltipMessage?: string;
  tooltipPosition?: 'left' | 'right' | 'bottom' | 'top';
  smallerText?: boolean;
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
        className={classNames('text-center whitespace-break-spaces w-full mt-0 !leading-[1.1875rem]', {
          'text-lg': !link?.smallerText,
          'text-md': link?.smallerText,
          'lg:mt-3 md:mt-2': !!link.iconName,
        })}
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
    <Tooltip body={link?.tooltipMessage} position={link?.tooltipPosition ? link?.tooltipPosition : 'bottom'}>
      <li key={link.title} className="shadow-lg md:w-44 md:h-24 lg:w-56 lg:h-32">
        {link.route && (
          <Link href={link.disabled ? '#' : link.route} className={baseClass}>
            {content}
          </Link>
        )}
        {link.onClick && <button onClick={link.onClick}>{content}</button>}
      </li>
    </Tooltip>
  );
};
