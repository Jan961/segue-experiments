import { useRecoilValue } from 'recoil'
import { dateService } from 'services/dateService'
import { weekNoSelector } from 'state/booking/selectors/weekNoSelector'
import { isMonday, parseISO } from 'date-fns'
import classNames from 'classnames'


export const DateDisplay = ({ date }: { date: string}) => {
  const weekNos = useRecoilValue(weekNoSelector)

  const monday = isMonday(parseISO(date))

  let baseClass = 'bg-transparent p-1 px-2 inline-block text-center'
  if (monday) baseClass = classNames(baseClass, 'bg-orange-200 shadow-md rounded font-bold')

  return (
    <>
      <div className="col-span-1 font-bold text-soft-primary-grey max-w-[25px] text-center">
        { weekNos[date] }
      </div>
      <div className="col-span-2 font-medium text-soft-primary-grey">
        <div className={baseClass}>
          <div className="grid grid-cols-3">
            <div>
              { dateService.getWeekDay(date).slice(0, 3)}
            </div>
            <div className="col-span-2">
              { dateService.dateToSimple(date) }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
