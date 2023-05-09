import * as React from 'react'
import ListItem from './ListItem'
import {Show, Tour} from '../../interfaces'
import { useRouter } from 'next/router'

type Props = {
    items: Tour[]
}



const List = ({items}: Props) => (
    <ul role="list" className="divide-y divide-gray-200">

        {items.map((item) => (
            <>
                <li key={item.TourId}>
                    <ListItem data={item}/>
                </li>
            </>
        ))}
    </ul>
)

export default List
