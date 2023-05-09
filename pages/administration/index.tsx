import Link from 'next/link'
import Layout from '../../components/Layout'
import UserMessage from "../../components/dashboard/userMessage";
import Switchboard from "../../components/administration/dashboard";
import {useEffect, useState} from "react";
import accountId from "./../accounts/update-details/[account-id]";



export default function Index() {
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)

    let accoutnID = 0

    useEffect(() => {
        setLoading(true)

        let  userid = sessionStorage.getItem("UserId")
        let accoutnID = sessionStorage.getItem("accountId")


        fetch('/api/account/read/' + accoutnID)
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
    }, [])

    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>



    return (
        <>
            <Layout title="Super Admin | Segue">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mt-5 text-center">
        <span className="block xl:inline">Global Administration</span>

            </h1>

            <UserMessage></UserMessage>
            <div>

            </div>
            <Switchboard key={"sw"} data={accoutnID}  ></Switchboard>
        </Layout>
        </>
)
}
