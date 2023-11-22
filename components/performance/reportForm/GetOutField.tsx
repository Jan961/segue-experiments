
interface GetOutFieldProps { inputTime: React.ReactNode, error: React.ReactNode }

export const GetOutField = ({ inputTime, error }: GetOutFieldProps): React.JSX.Element => (
  <div>
    <div className='sm:flex sm:items-center '>
      <label className='w-44 mr-1 font-bold' htmlFor='getout'>
        Get Out
      </label>
      <div className='flex-1 flex p-1 gap-6 items-center rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
        {inputTime}
      </div>
    </div>
    {error}
  </div>
)
