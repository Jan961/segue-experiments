import Link from 'next/link'
import Layout from '../../../../../../components/Layout'
import Toolbar from "../../../../../../components/marketing/venue/toolbar";
import SideMenu from "../../../../../../components/sideMenu";
import {Show, User} from "../../../../../../interfaces";
import {GetStaticPaths, GetStaticProps} from "next";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {ReactElement} from "react";
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import Status from "../../../../../../components/marketing/venue/status";



const Index = (Tour) => (
    <Layout title="Marketing | Seque">
        <Toolbar></Toolbar>
        <div className="flex flex-auto">
            <SideMenu></SideMenu>
            <Status searchFilter={""} ></Status>

        </div>
    </Layout>
)


export default Index


