import Layout from 'components/Layout'
import Toolbar from 'components/marketing/ActionBar'
import SideMenu from 'components/sideMenu'
import { useState } from 'react'
import MarketingPanel from 'components/marketing/marketing-panel'

export default function Index() {
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [show, setShow] = useState({})
    const [tour, setTour] = useState({})

    return (
        <>
            <Layout title="Marketing | Seque">
                <Toolbar onActiveToursChange={undefined}></Toolbar>
                <div className="flex flex-auto">
                    <SideMenu Tour={tour} ></SideMenu>
                    <MarketingPanel Tour={tour}></MarketingPanel>
                </div>
            </Layout>
        </>
    )
}
