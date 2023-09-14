import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export const SwitchBoardItem = ({ link }: { link: any }) => {
  return (
    <li key={link.title}>
      <Link href={link.disabled ? '#' : link.route}
        className={`
              ${link.disabled ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : `${link.color} hover:opacity-75`}
              shadow-lg
              flex flex-col items-center
             text-white text-center rounded-lg p-6`}>
        <FontAwesomeIcon icon={link.icon as IconProp} className="text-5xl" />
        <span className="text-center text-lg pt-2">{link.title}</span>
      </Link>
    </li>
  )
}
