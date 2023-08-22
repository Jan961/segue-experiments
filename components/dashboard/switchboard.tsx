import { faCalendarAlt, faChartLine, faCheckSquare, faFile, faUserCog, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const Switchboard = () => {
  const links = [
    {
      title: 'Bookings',
      route: '/bookings',
      icon: faCalendarAlt,
      color: 'bg-primary-orange'
    },
    {
      title: 'Tasks',
      route: '/tasks',
      icon: faCheckSquare,
      color: 'bg-primary-yellow'
    },
    {
      title: 'Marketing',
      route: '/marketing',
      icon: faVolumeHigh,
      color: 'bg-primary-green'
    },
    {
      title: 'Contracts',
      route: '/contracts',
      icon: faFile,
      color: 'bg-primary-blue'
    },
    {
      title: 'Reports',
      route: '/reports',
      icon: faChartLine,
      color: 'bg-primary-purple'
    },
    {
      title: 'Segue Management',
      disabled: true,
      route: '/admin',
      icon: faUserCog,
      color: 'bg-primary-pink'
    }
  ]

  return (

    <ul
      role="list"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 mt-4 max-w-2xl mx-auto"
    >
      {links.map((link) => (
        <li key={link.title}>
          <a href={link.disabled ? '#' : link.route}
            className={`
              ${link.disabled ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : `${link.color} hover:opacity-75`}
              shadow-lg
              flex flex-col items-center
             text-white text-center rounded-lg p-6`}>
            <FontAwesomeIcon icon={link.icon as IconProp} className="text-5xl" />
            <span className="text-center text-lg pt-2">{link.title}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
