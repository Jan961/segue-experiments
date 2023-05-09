import Image from "next/image";
import {lazy} from "react";

export default function Contract()  {

    return(
        <div className={"flex items-center mt-55"}>
            <Image
                src="/segue/icons/contract.png"
                alt="calendar"
                width={33}
                height={33}
            />
        </div>
    )

}