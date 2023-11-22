import { formatDuration } from 'services/dateService'

interface TimeRangeProps { label: string, up?: React.ReactNode, down?: React.ReactNode, error?: React.ReactNode, duration?: number }

export const TimeRange = ({ label, up, down, error, duration }: TimeRangeProps): React.JSX.Element => (
  <div>
    <div className='sm:flex sm:items-center '>
      <label className='w-44 mr-1 font-bold'>{label}</label>
      <div className='flex-1 flex p-1 gap-1 items-center rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
        <div className='flex items-center gap-2 '>
          <label className='font-bold'>UP</label>
          {up}
        </div>
        {
          down !== undefined &&
          <div className='flex items-center gap-2 '>
            <label className='font-bold'>
              DOWN
            </label>
            {down}
          </div>
        }
        <div>
          <span>
            [
            {duration !== undefined
              ? formatDuration(duration)
              : 'Duration'}
            ]
          </span>
        </div>
      </div>
    </div>
    {error}
  </div>
)
