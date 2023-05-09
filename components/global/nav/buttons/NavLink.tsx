import Link from "next/link";

export default function NavLink(title, route)  {

    return(

        <>
            <div className="flex justify-center ...">
                <Link href={route}>title</Link>
            </div>
        </>
    )
}