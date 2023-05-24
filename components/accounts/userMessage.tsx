const Messages = [

    // More messages...
]

export default function UserMessage() {
    return (

        <ul role="list" className="grid grid-cols-1 mt-4 mb-3">
            {Messages.map((message) => (
                <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
                    {message.message}
                </p>
            ))}
        </ul>


    )
}
