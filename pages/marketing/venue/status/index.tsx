import Link from 'next/link'
import Layout from '../../../../components/Layout'
import Toolbar from "../../../../components/marketing/venue/toolbar";
import SideMenu from "../../../../components/sideMenu";
import {Show, User} from "../../../../interfaces";
import {GetStaticPaths, GetStaticProps} from "next";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {ReactElement, useState} from "react";
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import Status from "../../../../components/marketing/venue/status";


type Props = {
    items: Show[]
}

const Index = ({ items }: Props) => {
    const [searchFilter, setSearchFilter] = useState('');
    
    return(
    <Layout title="Marketing | Seque">
        <div className=" px-4 flex flex-col  flex-auto">
        <Toolbar title={"Status"} searchFilter={searchFilter} setSearchFilter={setSearchFilter} ></Toolbar>
            <div className="flex flex-row w-full">
            <Status searchFilter={searchFilter}></Status>
            </div>

        </div>
    </Layout>
)}


export default Index
