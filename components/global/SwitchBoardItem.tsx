import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type ItemDefinition = {
  disabled?: boolean;
  title: string;
  icon: IconProp;
  route?: string;
  color: string;
  onClick?: () => void;
};

interface SwitchBoardItemProps {
  link: ItemDefinition;
}

export const SwitchBoardItem = ({ link }: SwitchBoardItemProps) => {
  const content = (
    <div className="flex flex-col items-center justify-center">
      {link.icon && (
        <FontAwesomeIcon icon={link.icon as IconProp} className="text-5xl" />
      )}
      <span className="text-center text-lg pt-2">{link.title}</span>
    </div>
  );

  const baseClass = `
    ${
      link.disabled
        ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
        : `${link.color} hover:opacity-75`
    }
    shadow-lg
    w-full
    h-full
    flex flex-col items-center justify-center
    whitespace-nowrap
    text-white text-center rounded-lg p-6`;

  return (
    <li key={link.title}>
      {link.route && (
        <Link href={link.disabled ? "#" : link.route} className={baseClass}>
          {content}
        </Link>
      )}
      {link.onClick && (
        <button onClick={link.onClick} className={baseClass}>
          {content}
        </button>
      )}
    </li>
  );
};
