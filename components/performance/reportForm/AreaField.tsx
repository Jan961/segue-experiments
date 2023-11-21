import { forwardRef, ComponentPropsWithoutRef, useId } from 'react'

type AreaFieldProps = ComponentPropsWithoutRef<'textarea'> & {
  label: string
  disabled: boolean
}
export const AreaField = forwardRef<HTMLTextAreaElement, AreaFieldProps>(({
  label,
  disabled = false,
  ...props
}, ref) => {
  const id = useId()
  const fieldId = `area-field-${id}`
  return (
    <div className='sm:flex sm:justify-between sm:items-center'>
      <label className='w-44 mr-1 font-bold' htmlFor={fieldId}>
        {label}
      </label>
      <textarea
        className='sm:flex-1 w-full h-28 resize-y rounded-md border border-gray-300 p-1 px-3 py-2 bg-gray-100 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        id={fieldId}
        disabled={disabled}
        ref={ref}
        {...props}
      />
    </div>

  )
})
AreaField.displayName = 'AreaField'
