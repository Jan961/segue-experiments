interface CustomSelectProps {
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    disabled: boolean
    options: React.ReactNode
    isLoading: boolean
  }

export const CustomSelect = ({ label, value, onChange, disabled, options, isLoading }: CustomSelectProps): React.JSX.Element => (
  <div className='sm:flex sm:items-center sm:gap-4 mt-2'>
    <label className='font-bold w-36' htmlFor='performanceSelect'>
      {label}
    </label>
    <select
      className='w-full border border-gray-300 rounded px-3 py-2 flex-1 text-gray-800'
      id='performanceSelect'
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <option value=''>Select performance</option>
      {isLoading
        ? (
          <option value='' disabled>
              Loading...
          </option>
        )
        : (
          options
        )}
    </select>
  </div>
)
