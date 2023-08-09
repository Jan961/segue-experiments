import { useRecoilValue } from 'recoil'
import { dateToSimple, getWeekDay } from 'services/dateService'
import { weekNoSelector } from 'state/booking/selectors/weekNoSelector'
import { isMonday, parseISO } from 'date-fns'
import classNames from 'classnames'

export const DateDisplay = ({ date }: { date: string}) => {
  const weekNos = useRecoilValue(weekNoSelector)

  const monday = isMonday(parseISO(date))

  let baseClass = 'bg-transparent p-1 inline-block text-center border border-transparent rounded'
  if (monday) baseClass = classNames(baseClass, 'bg-orange-200 border-orange-500')

  return (
    <div className="w-40 text-sm p-1 text-soft-primary-grey col-span-4 lg:col-span-3 xl:col-span-2">
      <div className={baseClass}>
        <div className="grid grid-cols-8">
          <div className="col-span-1 font-bold pr-2">
            { weekNos[date] }
          </div>
          <div className="col-span-7 flex justify-end gap-1 px-1 overflow-hidden">
            <div>
              { getWeekDay(date).slice(0, 3)}
            </div>
            <div>
              { dateToSimple(date) }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
