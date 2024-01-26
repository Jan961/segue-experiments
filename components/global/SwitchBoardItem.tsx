import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Icon from 'components/core-ui-lib/Icon';
import Link from 'next/link';

type ItemDefinition = {
  disabled?: boolean;
  title: string;
  icon: IconProp;
  iconName?: string;
  route?: string;
  color: string;
  onClick?: () => void;
  stroke?: string;
  fill?: string;
};

interface SwitchBoardItemProps {
  link: ItemDefinition;
}

export const SwitchBoardItem = ({ link }: SwitchBoardItemProps) => {
  const content = (
    <>
      <Icon
        iconName={link.iconName}
        variant="2xl"
        className="text-5xl h-10 w-10"
        stroke={link.stroke}
        fill={link.fill}
      />
      <span className="text-center text-base mt-2">{link.title}</span>
    </>
  );

  const baseClass = `
    ${link.disabled ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : `${link.color} hover:opacity-75`}
    shadow-lg
    w-46
    h-24
    flex flex-col items-center justify-center
    whitespace-nowrap
    text-white text-center rounded-lg`;

  return (
    <li key={link.title}>
      {link.route && (
        <Link href={link.disabled ? '#' : link.route} className={baseClass}>
          {content}
        </Link>
      )}
      {link.onClick && <button onClick={link.onClick}>{content}</button>}
    </li>
  );
};
