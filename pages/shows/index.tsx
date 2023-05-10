import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import List from '../../components/shows/List'
import { Show } from '../../interfaces'
import NewShow from '../../components/shows/forms/newShow'
import { userService } from '../../services/user.service'
import { SearchBox } from 'components/global/SearchBox'
import { DisplayArchived } from 'components/global/DisplayArchived'

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

  if (isLoading) return <p>Loading...</p>

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
    <>
      <Layout title="Shows | Segue">
        <div className="float-right">
          <DisplayArchived onChange={toggleAchive} checked={archived} />
          <SearchBox onChange={handleOnChange} value={inputs.search} />
          <NewShow />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-primary-blue block xl:inline">Shows</span>
        </h1>
        <br className='clear' />
        <div className={' max-w-3/4 justify-center flex flex-col items-center'}>
          <List items={data} />
        </div>
      </Layout>
    </>
  )
}
