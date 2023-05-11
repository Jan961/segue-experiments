import Link from 'next/link'
import { Tour } from 'interfaces'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { forceReload } from 'utils/forceReload'
import { loggingService } from 'services/loggingService'
import { ListItemThumbnail } from 'components/global/list/ListItemThumbnail'
import { MenuButton } from 'components/global/MenuButton'

interface TourListDateDisplayProps {
  startDate: Date;
  endDate: Date;
  label: string;
}

const TourListDateDisplay = ({ startDate, endDate, label }: TourListDateDisplayProps) => {
  return (
    <div className="flex basis-1 flex-col pr-2 mr-2">
      <b>{ label }</b>
      <span className="whitespace-nowrap">{convertDate(startDate)} &#12297;{convertDate(endDate)}</span>
    </div>
  )
}

type TourListItemProps = {
  data: Tour;
};

const TourListItem = ({ data }: TourListItemProps) => {
  const deleteTour = () => {
    const tourId = data.TourId

    axios({
      method: 'POST',
      url: '/api/tours/delete/' + tourId,
      data: tourId
    })
      .then((response) => {
        console.log('Marked ' + tourId + ' As deleted')
        loggingService.logAction('Tour', 'Deleted' + tourId)
        forceReload()
      })
      .catch((error) => {
        console.log(JSON.stringify(error))
        loggingService.logError(error)
      })
  }

  return (
    <Link href={`/bookings/${data.Show.Code}/${data.Code}`}>
      <li className="flex w-full
        items-center justify-between border-b border-gray-200
        hover:bg-blue-400 hover:bg-opacity-25">
        <div className="flex-shrink-0">
          <ListItemThumbnail alt={data.Show.Name} src={data.logo} />
        </div>
        <div className="flex-grow">
          <p className="text-sm text-gray-900">
            {data.Show.Name} ({data.Show.Code}) - Tour {data.Code}
          </p>
          <p className="mt-2 flex justify-between text-sm text-gray-500">
            <TourListDateDisplay label='Rehearsals' startDate={data.RehearsalStartDate} endDate={data.RehearsalEndDate} />
            <TourListDateDisplay label='Touring' startDate={data.TourStartDate} endDate={data.TourEndDate}/>
          </p>
        </div>
        <div className="whitespace-nowrap">
          <MenuButton icon={faPencil} href={`/tours/edit/${data.TourId}`} />
          <MenuButton intent='DANGER' icon={faTrash} onClick={deleteTour} />
        </div>
      </li>
    </Link>
  )
}

export default TourListItem

const convertDate = (date: Date) => {
  const dateObject = new Date(date)
  if (dateObject.getTime() <= 0) return 'N/A'
  return dateObject.toISOString().slice(0, 10).toString()
}
