import Link from 'next/link'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { forceReload } from 'utils/forceReload'
import { loggingService } from 'services/loggingService'
import { ListItemThumbnail } from 'components/global/list/ListItemThumbnail'
import { MenuButton } from 'components/global/MenuButton'
import { dateService } from 'services/dateService'
import { useRouter } from 'next/router'
import { TourDTO } from 'interfaces'

interface TourListDateDisplayProps {
  startDate: string;
  endDate: string;
  label: string;
}

const TourListDateDisplay = ({ startDate, endDate, label }: TourListDateDisplayProps) => {
  return (
    <div className="flex basis-1 flex-col pr-2 mr-2">
      <b>{ label }</b>
      <span className="whitespace-nowrap">{dateService.dateToSimple(startDate)} &#12297;{dateService.dateToSimple(endDate)}</span>
    </div>
  )
}

type TourListItemProps = {
  tour: TourDTO;
};

const TourListItem = ({ tour }: TourListItemProps) => {
  const router = useRouter()

  const deleteTour = () => {
    axios({
      method: 'POST',
      url: '/api/tours/delete/' + tour.Id,
      data: tour.Id
    })
      .then((response) => {
        console.log('Marked ' + tour.Id + ' As deleted')
        loggingService.logAction('Tour', 'Deleted' + tour.Id)
        forceReload()
      })
      .catch((error) => {
        console.log(JSON.stringify(error))
        loggingService.logError(error)
      })
  }

  const navigateToShow = () => {
    router.push(`/bookings/${tour.ShowCode}/${tour.Code}`)
  }

  return (
    <li
      onClick={navigateToShow}
      className="flex w-full
        cursor-pointer
        items-center justify-between border-b border-gray-200
        hover:bg-blue-400 hover:bg-opacity-25">
      <div className="flex-shrink-0">
        <ListItemThumbnail alt={tour.ShowName} src={undefined} />
      </div>
      <div className="flex-grow">
        <Link href={`/bookings/${tour.ShowCode}/${tour.Code}`} className="text-sm text-gray-900">
          {tour.ShowName} ({tour.ShowCode}) - Tour {tour.Code}
        </Link>
        <div className="mt-2 flex justify-between text-sm text-gray-500">
          { tour.DateBlock.map((x) => (<TourListDateDisplay key={x.Id} label={x.Name} startDate={x.StartDate} endDate={x.EndDate} />))}
        </div>
      </div>
      <div className="whitespace-nowrap">
        <MenuButton icon={faPencil} href={`/tours/edit/${tour.Id}`} />
        <MenuButton intent='DANGER' icon={faTrash} onClick={deleteTour} />
      </div>
    </li>
  )
}

export default TourListItem
