import { getMonday } from "services/dateService";

 const getDateFromWeekNum = (date:string, weeknum:number)=>{
    const  startDate = new Date(date);
    const numberOfDays = Math.abs(weeknum)*7
    startDate.setDate(weeknum<0?startDate.getDate() - numberOfDays:startDate.getDate() + numberOfDays)
    return getMonday(startDate.toISOString()).toISOString();
  }
  
const getWeekNumsToDateMap = (StartDate:string,EndDate:string,list:number[])=>{
    return list.reduce((weeknumToDateMap, weeknum)=>{
      weeknumToDateMap[weeknum] = getDateFromWeekNum(StartDate, weeknum)
      return weeknumToDateMap;
    },{})
  }

  export default getWeekNumsToDateMap;
  