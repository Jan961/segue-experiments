import {
  faEdit,
  faMinus,

} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HardCodedWarning } from '../HardCodedWarning'

const holdsVenue = [
  { reason: 'Lighting Desk', seats: '4' },
  { reason: 'Sound Desk', seats: '8' }
]

const holdsTh = [
  {
    day: 'Monday',
    date: '10/10/2022',
    time: '17:30',
    name: 'Peter Griffin',
    numberSeats: '4',
    allocations: '1-50',
    available: '1-50',
    range: '1-2',
    note: 'Some note'
  }
]

const holdsPromoter = [
  {
    date: '10/10/2010',
    time: '17:30',
    name: 'Sam Smith',
    numberSeats: '1',
    allocatedSeats: '49',
    email: 'sam.smith@somedomain.co.uk'
  },
  {
    date: '10/10/2010',
    time: '17:30',
    name: 'Sam Smith',
    numberSeats: '1',
    allocatedSeats: '49',
    email: 'sam.smith@somedomain.co.uk'
  },
  {
    date: '11/05/2011',
    time: '17:30',
    name: 'Sam Smith',
    numberSeats: '1',
    allocatedSeats: '49',
    email: 'sam.smith@somedomain.co.uk'
  }
]

const PromoterHolds = () => (
  <div className={'flex w-9/12'}>
    <div className="flex-auto mx-4 mt-0overflow-hidden   ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
      <HardCodedWarning />
      <div className={'mb-1 border relative py-2 text-center border-black rounded w-1/2'}>
        <a href="#" className="text-gray-600 text-center hover:text-indigo-900 mr-1 ">
          <span >
             4 x Lighting Desk &nbsp;
          </span>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FontAwesomeIcon icon={faMinus} className="  border-2 rounded-md" />
          </div>
        </a>
      H</div>
      <div className={'mb-1 border relative py-2 text-center border-black rounded w-1/2'}>
        <a href="#" className="text-gray-600 text-center hover:text-indigo-900 mr-1">
          <span >
             8 x Sound Desk &nbsp;
          </span>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">

            <FontAwesomeIcon icon={faMinus} className="  border-2 rounded-md" />
          </div>
        </a>
      </div>
      <div className={'mb-4'}>
        <button
          className={
            'inline-flex items-center mt-5 rounded border border-gray-300 bg-primary-green px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary-green focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          }
        >
          Add Hold{' '}
        </button>
      </div>
      <div className="mt-8 mb-4 space-x-4 flex flex-row items-center">
        <span className="text-primary-green">Available Seats</span>
        <button
          className={
            'inline-flex items-center rounded-md  bg-white  px-6 py-3 text-xs font-medium drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          }
        >
          Add Hold
        </button>
      </div>
      <table className=" min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr className="bg-primary-green">
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-white border-l border-l-white rounded-tl-md sm:pl-6"
            >
              Day
            </th>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-white border-l border-l-white sm:pl-6"
            >
              Date
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white border-l border-l-white lg:table-cell"
            >
              Time
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white border-l border-l-white sm:table-cell"
            >
              Name
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white border-l border-l-white sm:table-cell"
            >
              Seats
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white border-l border-l-white sm:table-cell"
            >
              Allocation
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white border-l border-l-white sm:table-cell"
            >
              Available
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white border-l border-l-white sm:table-cell"
            >
              Seat Range / Notes
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white rounded-tr-md sm:table-cell"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {holdsTh.map((holdTh, idx) => (
            <tr
              key={holdTh.date + holdTh.time}
              className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:w-auto sm:max-w-none sm:pl-6">
                {holdTh.day}
              </td>
              <td className="border-l border-l-gray-300 hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                {holdTh.date}{' '}
              </td>
              <td className="border-l border-l-gray-300 hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                {holdTh.time}
              </td>
              <td className="border-l border-l-gray-300 hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                {holdTh.name}
              </td>
              <td className="border-l border-l-gray-300 hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                {holdTh.numberSeats}
              </td>
              <td className="border-l border-l-gray-300 hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                {holdTh.allocations}
              </td>
              <td className="border-l border-l-gray-300 hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                {holdTh.available}
              </td>
              <td className="border-l border-l-gray-300 hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                {holdTh.range} {holdTh.note}
              </td>
              <td className=" hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-900 mr-1"
                >
                  <FontAwesomeIcon icon={faMinus} />
                  <span className="sr-only">Add</span>
                </a>
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-900 mr-1"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  <span className="sr-only">Edit</span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <div className="mt-8 mb-4  space-x-4 flex flex-row items-center">
          <span className="text-primary-green">Allocated Seats</span>
          <button
            className={
              'inline-flex items-center rounded-md  bg-white  px-6 py-3 text-xs font-medium drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            }
          >
          Allocate Hold{' '}
          </button>
        </div>

        <table className=" min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr className="bg-primary-green">
              <th
                scope="col"
                className="py-1 pl-4 pr-3 text-center text-sm font-semibold text-white border-l border-l-white rounded-tl-md sm:pl-6"
              >
                Date / Time
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white border-l border-l-white lg:table-cell"
              >
                Name
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white border-l border-l-white sm:table-cell"
              >
                No Seats
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white border-l border-l-white sm:table-cell"
              >
                Allocated Seats
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white border-l border-l-white sm:table-cell"
              >
                Email
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white border-l border-l-white rounded-tr-md sm:table-cell"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {holdsPromoter.map((holdTh, idx) => (
              <tr key={holdTh.date + holdTh.time}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                  {holdTh.date} {holdTh.time}{' '}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  {holdTh.name}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  {holdTh.numberSeats}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  {holdTh.allocatedSeats}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  {holdTh.email}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  <a
                    href="#"
                    className="text-indigo-600 hover:text-indigo-900 mr-1"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                    <span className="sr-only">remove</span>
                  </a>
                  <a
                    href="#"
                    className="text-indigo-600 hover:text-indigo-900 mr-1"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    <span className="sr-only">Edit</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div></div>
      </div>
    </div>
  </div>
)

export default PromoterHolds
