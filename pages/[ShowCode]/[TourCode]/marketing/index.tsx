import Layout from '../../../../components/Layout'
import Toolbar from "../../../../components/marketing/ActionBar";
import SideMenu from "../../../../components/sideMenu";
import {ReactElement, useEffect, useState} from "react";
import MarketingPanel from "../../../../components/marketing/marketing-panel";
import Loading from "../../../../components/global/loading";
import {tourService} from "../../../../services/TourService";
import {showService} from "../../../../services/ShowService";
import {Tour} from "../../../../interfaces";

export default function Index() {
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [show, setShow] = useState({})
    const [tour, setTour] = useState({})


    //setShow(showService.getShowByCode(show))
    //setTour(tourService.getTourByCode(show, TourCode))

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
