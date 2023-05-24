import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { userService } from '../../services/user.service'

export default function Switchboard (accountID) {
  const user = userService.userValue
  const userd = {
    userName: 'Peter',
    isActive: true,
    emailAddress: 'a@a.cc',
    accountID: 30,
    accountAdin: true,
    isSegueAdmin: true,
    isAccountOwner: true,
    userPermissions: {
      shows: {
        1: [
          {
            reports: {
              reporta: true,
              reportb: true
            },
            tours: {},
            bookings: {},
            marketing: {},
            contracts: {},
            holds: {}
          }
        ],
        2: [
          {
            reports: {},
            tours: {},
            bookings: {},
            marketing: {},
            contracts: {},
            holds: {}
          }
        ]
      },

      admin: {
        venues: true,
        showDataL: true,
        tourData: true
      },
      other: {
        manageUser: true,
        manageTourSetting: true
      }
    }
  }

  const links = [
    {
      title: 'Shows',
      route: '/shows',
      icon: 'faArrowRight',
      order: '0',
      permission: 8,
      color: 'bg-primary-blue'
    },
    {
      title: 'Tasks',
      route: '/tasks',
      icon: 'faArrowRight',
      order: '0',
      permission: 9,
      color: 'bg-primary-purple'
    },
    {
      title: 'Reports',
      route: '/reports',
      icon: 'faArrowRight',
      order: '0',
      permission: 10,
      color: 'bg-pink-500'
    },

    {
      title: 'User Profile',
      route: '/profile',
      icon: 'faArrowRight',
      order: '0',
      permission: 11,
      color: 'bg-primary-orange'
    }
  ]

  if (user !== undefined && user !== null) {
    if (user.accountAdmin || user.isAccountOwner) {
      links.push({
        title: 'Your Account',
        route: '/accounts',
        icon: 'faArrowRight',
        order: '0',
        permission: 12,
        color: 'bg-orange-500'
      })
    }

    if (user.segueAdmin) {
      links.push({
        title: 'Manage Options',
        route: '/administration',
        icon: 'faArrowRight',
        order: '0',
        permission: 99,
        color: 'bg-gray-800'
      })
    }
  }

  return (
    <div className="mt-12 flex flex-row justify-center">

      <ul
        role="list"
        className="max-w-xlg w-2/3 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {links.map((link) => (
          <li
            key={link.title}
            className="col-span-1 flex flex-col justify-center items-center "
          >
            <a href={link.route} className="text-center">
              <div className={`${link.color} rounded-full w-24 h-24 shadow-lg flex items-center justify-center text-white`}>
                <FontAwesomeIcon icon={faArrowRight as IconProp} className="text-4xl" />
              </div>
              <div className="text-center pt-2">{link.title}</div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
