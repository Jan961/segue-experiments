import { FormInputNumeric } from 'components/global/forms/FormInputNumeric'
import RangeSlider from 'react-range-slider-input'

interface NumericSliderRangeProps {
  min: number
  max: number
  value: [number, number]
  name: string
  isSlider: boolean
  label: string
  handleRangeChange: (value: [number, number], id: string) => void
}

export const NumericSliderRange = ({ min, max, value, isSlider, label, handleRangeChange, name }: NumericSliderRangeProps) => {
  if (isSlider) {
    return (
      <label>
        <div className='text-right inline-block text-xs mt-3'>{label}: ({value[0]} to {value[1]})</div>
        <RangeSlider
          min={min} max={max} step={5} name={name}
          onInput={(x: [number, number]) => handleRangeChange(x, name)} className="my-4" value={value} />
      </label>
    )
  } else {
    return (
      <div className='grid grid-cols-3 clear-both gap-2 items-center'>
        <label>{label}</label>
        <FormInputNumeric className='mb-0'
          name={name + 'Min'}
          onChange={(changed) => handleRangeChange([changed, value[1]], name)}
          value={value[0]}/>
        <FormInputNumeric className='mb-0'
          name={name + 'Max'}
          onChange={(changed) => handleRangeChange([value[0], changed], name)}
          value={value[1]}/>
      </div>
    )
  }
}
