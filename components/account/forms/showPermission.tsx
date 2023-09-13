import React from "react";

//Get Permissions list

//GetUserPermissions


export default function ShowPermission(tab) {
    if (tab.data.Active === true) {
        return (
            <div>
                {JSON.stringify(tab)}

                <h1>tab.data.</h1>
            </div>)
    } else {
        return (<></>)
    }

}