import {EnvelopeIcon, PhoneIcon} from '@heroicons/react/20/solid'
import {faAnglesDown} from "@fortawesome/free-solid-svg-icons";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import {random} from "nanoid";
import accountId from "../../pages/accounts/update-details/[account-id]";
import Accounts from "../../pages/accounts";
import {useRef} from "react";
import {array} from "yup";



export default class Switchboard extends React.Component {

    state = {
        account: null,
    }


    render() {

        const links = [
            {
                title: 'Manage Users',
                route: '/accounts/manage-users',
                icon: 'faArrowRight',
                order: '0',
                permission: 1
            },
            {
                title: 'Update account Details',
                route: '/accounts/update-details/' +  +"",
                icon: 'faArrowRight',
                order: '0',
                permission: 1
            },
            {
                title: 'update Payment Info',
                route: '/accounts/payment',
                icon: 'faArrowRight',
                order: '0',
                permission: 1
            },
            {
                title: 'Add Custom Venue Data',
                route: '/accounts/venues',
                icon: 'faArrowRight',
                order: '0',
                permission: 2
            },
            {
                title: 'Manage Sales Data Validation Limits',
                route: '/accounts/sales-validation',
                icon: 'faArrowRight',
                order: '0',
                permission: 2
            },
    ]


        return (
            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {links.map((link) => (
                    <li
                        key={link.title}
                        className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
                    >
                        <div className="m-5">
                            <a href={link.route}>
                                <div className="rounded-full text-centre pt-2 bg-black h-px-50 w-px-50 text-white">
                                    <FontAwesomeIcon icon={faArrowRight as IconProp}/>&nbsp;
                                </div>
                                <div className="text-centre pt-2">
                                    {link.title}
                                </div>
                            </a>
                        </div>

                    </li>
                ))}
            </ul>
        )
    }
}