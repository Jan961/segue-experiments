import Link from 'next/link'
import { Show } from '../../interfaces'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import UpdateShow from './forms/updateShow'
import Image from 'next/image'
import axios from 'axios'
import { forceReload } from '../../utils/forceReload'
import { MenuButton } from 'components/global/MenuButton'

type Props = {
  data: Show;
};

const ShowListItemThumbnail = ({ src, alt }: { src?: string, alt: string }) => {
  const fallbackSrc = src ? `/segue/logos/${src}` : '/segue/logos/segue_logo.png'

  return (
    <Image
      src={fallbackSrc}
      alt={alt}
      width="170"
      height="40"
    ></Image>
  )
}

// @ts-ignore
const ShowListItem = ({ data }: Props) => {
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

  return (
    <Link href="/tours/[ShowId]" as={`/tours/${data.ShowId}`}>
      <li className="flex min-w-0 w-full flex-1 items-center justify-between hover:bg-blue-400 hover:bg-opacity-25">
        <div className="flex-shrink-0">
          <ShowListItemThumbnail src={data.Logo} alt={data.Name} />
        </div>
        <div className="min-w-0 flex-grow px-4">
          <p className="text-lg  text-primary-blue text-center">
            {data.Name} - ({data.Code})
          </p>
        </div>
        <div className="whitespace-nowrap">
          <UpdateShow items={data}></UpdateShow>
          <MenuButton intent='DANGER' onClick={deleteShow} icon={faTrash} />
        </div>
      </li>
    </Link>
  )
}

export default ShowListItem
