import Layout from '../components/Layout'
import UserMessage from '../components/dashboard/userMessage'
import Switchboard from '../components/dashboard/switchboard'
import { useEffect, useState } from 'react'
import { LoadingPage } from 'components/global/LoadingPage'

export default function Index() {
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)

    let accoutnID = 0

    useEffect(() => {
        setLoading(true)

        let userid = sessionStorage.getItem("UserId")
        let accountId = sessionStorage.getItem("accountId")


        fetch('/api/account/read/' + accountId)
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
    }, [])

    if (isLoading) return <LoadingPage />
    if (!data) return <p>No profile data</p>

    return (
        <div >
            <Layout title="Dashboard | Segue" >
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mt-5 text-center">
                    <span className="block xl:inline">Home</span>

                </h1>

                <UserMessage></UserMessage>
                <Switchboard key={"sw"} data={accoutnID}  ></Switchboard>
            </Layout>
        </div>
    )
}
