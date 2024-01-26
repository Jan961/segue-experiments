import { getString } from "lang/locale"
import { useMemo } from "react"
import { useRecoilValue } from "recoil"
import { globalState } from "state/global/globalState"


const useStrings = ()=>{
    const locale = useMemo(()=>Intl.NumberFormat().resolvedOptions().locale, [])
    const userPrefs = useRecoilValue(globalState);
    return getString(userPrefs.locale||locale);
}

export default useStrings;