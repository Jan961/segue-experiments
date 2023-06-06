import { useRecoilValue } from 'recoil'
import { dateService } from 'services/dateService'
import { weekNoSelector } from 'state/booking/selectors/weekNoSelector'
import { isMonday, parseISO } from 'date-fns'
import classNames from 'classnames'


export const DateDisplay = ({ date }: { date: string}) => {
  const weekNos = useRecoilValue(weekNoSelector)

  const monday = isMonday(parseISO(date))

  let baseClass = 'bg-transparent p-1 px-2 inline-block text-center'
  if (monday) baseClass = classNames(baseClass, 'bg-orange-200 shadow-md rounded')

  return (
    <>
      <div className="col-span-4 text-soft-primary-grey text-center items-center">
        <div className={baseClass}>
          <div className="grid grid-cols-6">
            <div className="col-span-1 font-bold">
              { weekNos[date] }
            </div>
            <div className="col-span-2">
              { dateService.getWeekDay(date).slice(0, 3)}
            </div>
            <div className="col-span-3">
              { dateService.dateToSimple(date) }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
