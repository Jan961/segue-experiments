import Image from "next/image";
import {lazy} from "react";

export default function Chart()  {

    return(
        <div className={"flex items-center mt-55"}>
            <Image
                src="/segue/icons/chart.png"
                alt="calendar"
                width={33}
                height={33}
            />
        </div>
    )

}