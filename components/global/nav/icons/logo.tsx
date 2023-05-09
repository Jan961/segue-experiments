import Image from "next/image";
import {lazy} from "react";

export default function Logo()  {

    return(
        <div className={"flex items-center mt-55"}>
            <Image
                src="/segue/logo.png"
                alt="logo"
                width={123}
                height={63
            }
            />
        </div>
    )

}