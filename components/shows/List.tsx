import * as React from 'react'
import ListItem from './ListItem'
import {Show} from '../../interfaces'

type Props = {
    items: Show[]
}

const List = ({items}: Props) => (
    <div className=" flex flex-col align-center overflow-hidden bg-gray  sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
        {items?.map((item) => (
            <li key={item.ShowId}>
                <ListItem data={item}/>
            </li>
        ))}
    </ul>
    </div>
)

export default List
