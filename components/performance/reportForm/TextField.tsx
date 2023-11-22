import { ComponentPropsWithoutRef, forwardRef } from 'react'

type TextFieldProps = ComponentPropsWithoutRef<'input'> & { label?: string }

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({ label, ...delegated }, ref): React.JSX.Element => (
  <div className='sm:flex sm:justify-between sm:items-center'>
    <label className='w-44 mr-1 font-bold'>{label}</label>
    <input
      className='flex-1 rounded-md w-full border border-gray-300 px-3 py-2 bg-gray-100 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
      {...delegated}
      ref={ref}
    />
  </div>
))

TextField.displayName = 'TextField'
