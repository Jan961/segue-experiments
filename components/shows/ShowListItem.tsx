import Link from 'next/link'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { forceReload } from 'utils/forceReload'
import { MenuButton } from 'components/global/MenuButton'
import { useRouter } from 'next/router'
import { ShowDTO } from 'interfaces'

type Props = {
  show: ShowDTO;
};

export const ShowListItem = ({ show }: Props) => {
  const router = useRouter()

  const deleteShow = (e) => {
    e.preventDefault()
    const showId = show.Id

    axios({
      method: 'POST',
      url: '/api/shows/delete/' + show.Id,
      data: showId
    })
      .then((response) => {
        console.log('Marked ' + show.Id + ' As deleted')
        forceReload()
      })
      .catch((error) => {
        console.log(JSON.stringify(error))
      })
  }

  const navigateToShow = () => {
    router.push(`/account/shows/${show.Code}`)
  }

  return (
    <li
      onClick={navigateToShow}
      className="flex w-full
      cursor-pointer
      items-center justify-between border-b border-gray-200
      hover:bg-blue-400 hover:bg-opacity-25 h-16">
      <div className="min-w-0 flex-grow px-4">
        <Link href={`/account/shows/${show.Code}`}>
          <p className="text-lg  text-primary-blue text-center">
            {show.Name} - ({show.Code})
          </p>
        </Link>
      </div>
      <div className="whitespace-nowrap">
        <MenuButton href={`/account/shows/edit/${show.Id}`} icon={faPencil} />
        <MenuButton href={`/account/shows/delete/${show.Id}`} intent='DANGER' onClick={deleteShow} icon={faTrash} />
      </div>
    </li>
  )
}
