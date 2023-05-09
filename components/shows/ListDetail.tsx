import * as React from 'react'

import {Show} from '../../interfaces'

type ListDetailProps = {
    item: Show
}

const ListDetail = ({item: show}: ListDetailProps) => (
    <div>
        <h1>Detail for {show.Name}</h1>
        <p>ID: {show.ShowId}</p>
    </div>
)

export default ListDetail
