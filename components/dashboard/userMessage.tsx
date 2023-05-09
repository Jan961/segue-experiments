import {EnvelopeIcon, PhoneIcon} from '@heroicons/react/20/solid'
import {faAnglesDown} from "@fortawesome/free-solid-svg-icons";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import * as React from "react";

const Messages = [
    {
        title: 'Welcome',
        message: 'lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\n' +
            '            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim\n' +
            '            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\n' +
            '            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate\n' +
            '            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat\n' +
            '            cupidatat non proident, sunt in culpa qui o!cia deserunt mollit anim id est\n' +
            '            laborum.',
        linkTitle: '',
        route: '',
        order: '0',
    },

    // More people...
]

export default function UserMessage() {
    return (

        <ul role="list" className="grid grid-cols-1 my-4">
            {Messages.map((message) => (
                <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
                    {message.message}
                </p>
            ))}
        </ul>


    )
}