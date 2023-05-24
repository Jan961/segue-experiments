import Layout from 'components/Layout'
import Toolbar from 'components/marketing/venue/toolbar'
import { Show } from 'interfaces'
import { useState } from 'react'
import Status from 'components/marketing/venue/status'

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
