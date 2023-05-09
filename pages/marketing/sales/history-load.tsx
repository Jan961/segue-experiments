import Link from 'next/link'
import Layout from '../../../components/Layout'
import Toolbar from "../../../components/marketing/venue/toolbar";
import SideMenu from "../../../components/sideMenu";
import {Show, User} from "../../../interfaces";
import {GetStaticPaths, GetStaticProps} from "next";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {ReactElement} from "react";
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import Status from "../../../components/marketing/venue/status";
import Entry from "../../../components/marketing/sales/entry";
import EmailLoader from "../../../components/marketing/sales/email-loader";
import FinalSales from "../../../components/marketing/sales/final";
import HistoryLoad from "../../../components/marketing/sales/historyload";
import TemplateHelper from "../../../components/marketing/sales/templates-helper";


type Props = {
    items: Show[]
}
const pagetitle = "Marketing - Sale Entry"

const Index = ({ items }: Props) => (
    <Layout title={pagetitle + "| Seque"} >
        <Toolbar title={pagetitle}  searchFilter={""}></Toolbar>
        <div className="flex flex-auto">
            <SideMenu></SideMenu>
            <HistoryLoad></HistoryLoad>
            <TemplateHelper></TemplateHelper>
        </div>
    </Layout>
)


export default Index
