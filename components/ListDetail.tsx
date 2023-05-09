import * as React from 'react'

import {User} from '../interfaces'

type ListDetailProps = {
    item: User
}

const ListDetail = ({item: user}: ListDetailProps) => (
    <div>
        <h1>Detail for {user.UserName}</h1>
        <p>ID: {user.UserId}</p>
    </div>
)

export default ListDetail
