import { 
    get, 
    // template 
} from 'radash';
import strings from './strings';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getString=(locale='en-US')=>(path:string, params?:any):string=>{
    if(!locale){
        locale = Intl.NumberFormat().resolvedOptions().locale;
    }
    locale=locale.replace('-','_')
    // template(, params);
    return get(strings[locale||"en_GB"],path)
}