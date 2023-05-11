import { useEffect, useState } from 'react'
import Layout from 'components/Layout'
import ShowList from 'components/shows/ShowList'
import { Show } from 'interfaces'
import { SearchBox } from 'components/global/SearchBox'
import { DisplayArchived } from 'components/global/DisplayArchived'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { MenuButton } from 'components/global/MenuButton'
import { LoadingPage } from 'components/global/LoadingPage'

/**
 * Send search request to the API
 *
 * @param query
 */
const searchEndpoint = (query, archived) =>
  `/api/shows/search/${query}/${archived}`

export default function Index () {
  const [archived, setArchived] = useState(false)
  const [data, setData] = useState<Show[]>([])
  const [searchQuery, setSearchQuery] = useState(' ')
  const [isLoading, setLoading] = useState(false)

  const [inputs, setInputs] = useState({
    search: ' '
  })

  useEffect(() => {
    setLoading(true)
    setArchived(false)
    fetch(searchEndpoint(searchQuery, archived))
      .then((res) => res.json())
      .then((res) => {
        setData(res.searchResults)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <LoadingPage />

  function search () {
    fetch(searchEndpoint(searchQuery, archived))
      .then((res) => res.json())
      .then((res) => {
        setData(res.searchResults)
      })
  }

  const handleOnChange = (e) => {
    e.persist()

    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
    setSearchQuery(e.target.value)
    search()
  }

  function toggleAchive () {
    setArchived(!archived)
    search()
  }

  return (
    <Layout title="Shows | Segue">
      <div className="float-right">
        <DisplayArchived onChange={toggleAchive} checked={archived} />
        <SearchBox onChange={handleOnChange} value={inputs.search} />
        <MenuButton iconRight={faPlus} href='/shows/create'>Create Show</MenuButton>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">
        <span className="text-primary-blue block xl:inline">Shows</span>
      </h1>
      <br className='clear' />
      <div className='max-w-screen-md mx-auto'>
        <ShowList items={data} />
      </div>
    </Layout>
  )
}
