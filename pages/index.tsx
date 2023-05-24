import Layout from 'components/Layout'
import Switchboard from 'components/dashboard/switchboard'
// import { useEffect, useState } from 'react'
// import { LoadingPage } from 'components/global/LoadingPage'

const accountId = 0

// Login functionality disabled
export default function Index () {
/*
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)

    const userid = sessionStorage.getItem('UserId')
    const accountId = sessionStorage.getItem('accountId')

    fetch('/api/account/read/' + accountId)
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <LoadingPage />
  if (!data) return <p>No profile data</p>
  */

  return (
    <Layout title="Dashboard | Segue" >
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mt-5 text-center">
        <span className="block xl:inline">Home</span>
      </h1>
      <Switchboard key={'sw'} data={accountId} ></Switchboard>
    </Layout>
  )
}
