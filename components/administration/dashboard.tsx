import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";

export default function Switchboard(accountID ) {
    let user = {
        userName: "Peter",
        isActive: true,
        emailAddress: "a@a.cc",
        accountID: 30,
        accountAdin: true,
        isSegueAdmin: true,
        isAccountOwner: true,
    }
    let links = [
        {
            title: 'Accounts',
            route: '/',
            icon: 'faArrowRight',
            order: '0',
            permission: 8
        },

    ]


    if(user.isSegueAdmin){
        links.push({
                title: 'Venue List',
                route: '/administration/venues',
                icon: 'faArrowRight',
                order: '0',
                permission: 99
            },
            {
                title: 'Business Types',
                route: '/accounts/' + parseInt(accountID),
                icon: 'faArrowRight',
                order: '0',
                permission: 99
            },
            {
                title: 'Licence Types',
                route: '/accounts/' + parseInt(accountID),
                icon: 'faArrowRight',
                order: '0',
                permission: 99
            },
            {
                title: 'Manage Input Options',
                route: '/administration/input-options',
                icon: 'faArrowRight',
                order: '0',
                permission: 99
            },
                   )
    }

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
