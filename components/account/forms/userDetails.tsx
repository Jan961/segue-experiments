const Account = {
  email: 'me@myemail.com',
  name: 'R C Kelly',
  telephone: '',
  businessName: 'R C Kelly',
  webURl: 'https://www.rckelly.local',
  addressLine1: '123 Fake Street',
  addressLine2: '123 Fake Street',
  addressLine3: '123 Fake Street',
  country: '123 Fake Street',
  postcode: '123 Fake Street',
  isVatRegistered: true,
  businessType: '123 Fake Street',
  numberOfUsers: '6',
};
export default function UserDetails() {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="email" className="sr-only">
            email
          </label>

          <input
            type="email"
            name="email"
            id="email"
            className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Your email"
            value={Account.email}
          />
        </div>
        <div>
          <label htmlFor="name" className="sr-only">
            Your name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Your Name"
            value={Account.name}
            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="password_confrm" className="sr-only">
            Confirm Password
          </label>
          <input
            type="password"
            name="password_confrm"
            id="password_confrm"
            placeholder="Password Repeat"
            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div></div>
      </div>
    </>
  );
}
