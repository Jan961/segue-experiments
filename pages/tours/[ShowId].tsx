import { useEffect, useState } from 'react'
import Layout from 'components/Layout'
import TourList from 'components/tours/TourList'
import { Tour } from 'interfaces'
import NewTour from 'components/tours/forms/newTour'
import { GetStaticPaths, GetStaticProps } from 'next'
import { SearchBox } from 'components/global/SearchBox'
import { DisplayArchived } from 'components/global/DisplayArchived'

/**
 * Send search request to the API
 *
 * @param query
 */
const searchEndpoint = (query, archived) => `/api/tours/${query}`

type Props = {
  showID: number;
};

export default function Tours ({ showID }: Props) {
  const [archived, setArchived] = useState(true)
  const [data, setData] = useState<Tour[]>([])
  const [searchQuery, setSearchQuery] = useState(' ')
  const [isLoading, setLoading] = useState(false)


  const [inputs, setInputs] = useState({
    search: ' '
  })

  useEffect(() => {
    setLoading(true)
    fetch(searchEndpoint(showID, false))
      .then((res) => res.json())
      .then((res) => {
        setData(res)

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

  // @ts-ignore
  return (
    <>
      <Layout title="Tours | Segue">
        <div className="float-right">
          <DisplayArchived onChange={toggleAchive} checked={archived} />
          <SearchBox onChange={handleOnChange} value={inputs.search} />
          <NewTour show={showID} items={[]}></NewTour>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-primary-blue block xl:inline">Tours</span>
        </h1>
        <div className="w-full flex flex-col items-center md:px-8">
          {data.length !== undefined && <TourList items={data}></TourList>}
        </div>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const showID = ctx.params.ShowId

  return { props: { showID } }
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], // indicates that no page needs be created at build time
    fallback: 'blocking' // indicates the type of fallback
  }
}
