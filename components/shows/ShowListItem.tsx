import Link from 'next/link'
import { Show } from 'interfaces'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { forceReload } from 'utils/forceReload'
import { MenuButton } from 'components/global/MenuButton'
import { ListItemThumbnail } from 'components/global/list/ListItemThumbnail'
import { useRouter } from 'next/router'

type Props = {
  data: Show;
};

export const ShowListItem = ({ data }: Props) => {
  const router = useRouter()

  const deleteShow = (e) => {
    e.preventDefault()
    const showId = data.ShowId

    axios({
      method: 'POST',
      url: '/api/shows/delete/' + showId,
      data: showId
    })
      .then((response) => {
        console.log('Marked ' + showId + ' As deleted')
        forceReload()
      })
      .catch((error) => {
        console.log(JSON.stringify(error))
      })
  }

  const navigateToShow = () => {
    router.push(`/tours/${data.ShowId}`)
  }

  return (
    <li
      onClick={navigateToShow}
      className="flex w-full
      cursor-pointer
      items-center justify-between border-b border-gray-200
      hover:bg-blue-400 hover:bg-opacity-25">
      <div className="flex-shrink-0">
        <ListItemThumbnail src={undefined} alt={data.Name} />
      </div>
      <div className="min-w-0 flex-grow px-4">
        <Link href={`/tours/${data.ShowId}`}>
          <p className="text-lg  text-primary-blue text-center">
            {data.Name} - ({data.Code})
          </p>
        </Link>
      </div>
      <div className="whitespace-nowrap">
        <MenuButton href={`/shows/edit/${data.ShowId}`} icon={faPencil} />
        <MenuButton intent='DANGER' onClick={deleteShow} icon={faTrash} />
      </div>
    </li>
  )
}
