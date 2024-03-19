import Link from 'next/link';

type ItemDefinition = {
  disabled?: boolean;
  title: string;
  route?: string;
  color: string;
  onClick?: () => void;
  textClass?: string;
};

interface TilesItemProps {
  link: ItemDefinition;
}
export default function Tiles({ link }: TilesItemProps) {
  const baseClass = `
    ${
      link.disabled ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : `${link.color} hover:opacity-75`
    } h-full flex flex-col items-center justify-center whitespace-nowrap text-white text-center rounded-lg`;

  return (
    <div
      className={` w-[180px] min-h-[95px] flex justify-center items-center px-5 font-bold rounded-md shadow-md  ${baseClass}`}
    >
      <Link href={link.disabled ? '#' : link.route} className={`text-white text-center leading-5  `}>
        <p className={` ${link.textClass}`}>{link.title}</p>
      </Link>
    </div>
  );
}
