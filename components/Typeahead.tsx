import { useState, useRef, useMemo, useEffect } from 'react'

type Option={
    text:string
    value:string|number
}

type props={
    options:Option[]
    placeholder:string
    disabled?:boolean
    selectedOption?:Option
    value?:string|number
    onChange:(option:Option)=>void
}

const Typeahead = ({ options, placeholder, onChange, disabled, value }:props) => {
  const [inputValue, setInputValue] = useState('')
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const inputRef = useRef(null)
  const filteredOptions:Option[] = useMemo(() => options.filter(option =>
    option?.text?.toLowerCase?.().includes?.(inputValue?.toLowerCase?.())
  ), [inputValue, options])
  useEffect(() => {
    const selectedOption = options.find(option => option.value === String(value))
    setInputValue(selectedOption?.text || '')
  }, [value])
  const handleInputChange = (e: { target: { value: any } }) => {
    setInputValue(e.target.value)
  }
  const handleSelectOption = (selectedOption:Option) => {
    setInputValue(selectedOption.text)
    onChange?.(selectedOption)
  }
  const handleInputFocus = () => {
    setDropdownOpen(true)
  }
  const handleInputBlur = () => {
    setTimeout(() => {
      setDropdownOpen(false)
    }, 200)
  }
  return (
    <div className="mb-2">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className={`w-full py-2 px-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
      {isDropdownOpen && filteredOptions.length > 0 && !disabled && (
        <ul className="absolute z-10 mt-1 border rounded shadow bg-white max-h-[300px] overflow-y-auto" style={{ minWidth: inputRef.current.offsetWidth }}>
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelectOption(option)}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100"
            >
              {option.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Typeahead
