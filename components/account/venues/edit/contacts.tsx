import * as React from 'react';
import { faBook, faEdit, faPlus, faSquareXmark, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const activities = [
  {
    activityName: 'hello World!',
    type: 'Type 1',
    created: '10/10/2022',
    followup: '20/12/2022',
    co: 'cs',
    venue: 'The kings, Glasgow',
    notes: 'loripsuim',
  },
  {
    activityName: 'hello World!',
    type: 'Type 1',
    created: '10/10/2022',
    followup: '20/12/2022',
    co: 'cs',
    venue: 'The kings, Glasgow',
    notes: 'loripsuim',
  },
  {
    activityName: 'hello World!',
    type: 'Type 1',
    created: '10/10/2022',
    followup: '20/12/2022',
    co: 'cs',
    venue: 'The kings, Glasgow',
    notes: 'loripsuim',
  },
  {
    activityName: 'hello World!',
    type: 'Type 1',
    created: '10/10/2022',
    followup: '20/12/2022',
    co: 'cs',
    venue: 'The kings, Glasgow',
    notes: 'loripsuim',
  },
  {
    activityName: 'hello World!',
    type: 'Type 1',
    created: '10/10/2022',
    followup: '20/12/2022',
    co: 'cs',
    venue: 'The kings, Glasgow',
    notes: 'loripsuim',
  },
  {
    activityName: 'hello World!',
    type: 'Type 1',
    created: '10/10/2022',
    followup: '20/12/2022',
    co: 'cs',
    venue: 'The kings, Glasgow',
    notes: 'loripsuim',
  },
];

// @ts-ignore
const today = new Date().toDateString();

const Contacts = () => (
  <div className={'flex bg-blue-100 w-9/12 p-5'}>
    <div className="flex-auto mx-4 mt-0overflow-hidden shadow  ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
      <div className={'mb-1'}>
        <form>
          <input type={'checkbox'} className={''} name={'onSale'} value={'off'} />
          <label htmlFor={'onSale'} className={''}>
            On Sale
          </label>
          <label htmlFor={'date'} className={'sr-only'}>
            Date
          </label>
          <input type={'date'} id={'date'} value={today} name={'date'} />
          <input type={'checkbox'} className={''} name={'onSale'} value={'off'} />
          <label htmlFor={'onSale'} className={''}>
            {' '}
            Marketing Plans Received{' '}
          </label>
          <input type={'checkbox'} className={''} name={'onSale'} value={'off'} />
          <label htmlFor={'onSale'} className={''}>
            {' '}
            Print requirements received{' '}
          </label>
          <input type={'checkbox'} className={''} name={'onSale'} value={'off'} />
          <label htmlFor={'onSale'} className={''}>
            {' '}
            Contact info Received{' '}
          </label>
        </form>
      </div>
      <table className=" min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50 min-w-full">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Activity Name
            </th>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              type
            </th>
            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
              week created / Follow up Date
            </th>
            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
              co
            </th>
            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
              Notes
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {activities.map((activity) => (
            <tr key={activity.activityName}>
              <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                {activity.activityName}
              </td>
              <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{activity.type}</td>
              <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                {activity.created} - {activity.followup}
              </td>
              <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{activity.co}</td>
              <td className="px-3 py-4 text-sm text-gray-500">{activity.venue}</td>
              <td className="px-3 py-4 text-sm text-gray-500">
                <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-1">
                  <FontAwesomeIcon icon={faPlus} />
                  <span className="sr-only">Single Seat</span>
                </a>
                <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-1">
                  <FontAwesomeIcon icon={faEdit} />
                  <span className="sr-only">Single Seat</span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          className={
            'inline-flex items-center mt-5 rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          }
        >
          Add Activity{' '}
        </button>
      </div>
    </div>
  </div>
);

export default Contacts;
