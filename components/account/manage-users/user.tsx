const tabs = [
  { name: 'Show A', href: '#', current: false },
  { name: 'Show B', href: '#', current: false },
  { name: 'Show C', href: '#', current: true },
  { name: 'Global', href: '#', current: false },
];

const permissions = [
  { id: 1, name: 'Bookings', checked: true, subid: 0 },
  { id: 2, name: 'All Reports', checked: false, subid: 0 },
  { id: 3, name: 'Report A', checked: false, subid: 2 },
  { id: 4, name: 'Report B', checked: false, subid: 2 },
  { id: 5, name: 'Report C', checked: false, subid: 2 },
  { id: 6, name: 'Report D', checked: false, subid: 2 },
  { id: 7, name: 'Marketing', checked: false, subid: 0 },
  { id: 8, name: 'Marketing Home', checked: false, subid: 7 },
  { id: 9, name: 'Venue Data Status', checked: false, subid: 7 },
  { id: 10, name: 'Sales Entry', checked: false, subid: 7 },
  { id: 11, name: 'Final Figures Entry', checked: false, subid: 7 },
  { id: 12, name: 'Load Sales History', checked: false, subid: 7 },
  { id: 13, name: 'Global Activities', checked: false, subid: 7 },
  { id: 14, name: 'Contracts', checked: false, subid: 0 },
  { id: 15, name: 'Holds/Allocations', checked: false, subid: 0 },
  { id: 16, name: 'All Admin', checked: false, subid: 0 },
  { id: 17, name: 'Venues', checked: false, subid: 16 },
  { id: 18, name: 'Show Data', checked: false, subid: 16 },
  { id: 19, name: 'Tour Data', checked: false, subid: 16 },
  { id: 20, name: 'Other', checked: false, subid: 0 },
  { id: 21, name: 'Manage Users', checked: false, subid: 20 },
  { id: 22, name: 'Manage Tout Settings', checked: false, subid: 21 },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const User = () => (
  <div className="mt-10 flex justify-center items-center flex-col w-72 rounded-lg shadow-xl h-auto p-2">
    <div className="flex">
      <div className="flex flex-row">
        <h1>Add another User</h1>
      </div>
      <div>
        <div className="flex flex-row">
          <input type="text" name="name" id="name" placeholder="Your name" />
        </div>
        <div className="flex flex-row">
          <input type="email" name="email" id="email" placeholder="Your email" />
        </div>

        <div className="flex flex-row">
          <h2>Capabilities</h2>
        </div>
        <div>
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
            <select
              id="tabs"
              name="tabs"
              className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              defaultValue={tabs.find((tab) => tab.current).name}
            >
              {tabs.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex" aria-label="Tabs">
                {tabs.map((tab) => (
                  <a
                    key={tab.name}
                    href={tab.href}
                    className={classNames(
                      tab.current
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm',
                    )}
                    aria-current={tab.current ? 'page' : undefined}
                  >
                    {tab.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
          <div className="">
            <ul>
              {permissions.map((permission) => (
                <li>
                  {permission.subid != 0 ? <>&emsp;</> : ''}
                  <input type={'checkbox'} id={permission.subid + 'tourID'} />
                  <label htmlFor={permission.subid + 'tourID'}>
                    {' '}
                    &nbsp;
                    {permission.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <button>Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default User;
