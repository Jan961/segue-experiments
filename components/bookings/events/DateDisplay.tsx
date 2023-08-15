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
    <div className="w-41 text-sm p-1 text-soft-primary-grey col-span-4 lg:col-span-3 xl:col-span-2">
      <div className={baseClass}>
        <div className="grid grid-cols-12">
          <div className="col-span-3 font-bold whitespace-nowrap ">
            {`Wk ${weekNos[date]}`}
          </div>
          <div className="col-span-3">
            { getWeekDay(date).slice(0, 3)}
          </div>
          <div className="col-span-6 flex justify-end gap-1 px-1 overflow-hidden">
            <div>
              { dateToSimple(date) }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
