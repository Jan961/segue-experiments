import {da} from "date-fns/locale";
import moment from 'moment';

export const dateService = {
    dateToSimple,
    todayToSimple,
    toISO,
    toSql,
    getWeekDay,
    weeks,
    toTimestamo,
    dateTimeToTime,
    timeNow,
    formatTime,
    getMonday,
    getWeekDayLong,
    getSunday,
    formatDateUK,
    getDateDaysAgo,
    getDateDaysInFuture,
    quickISO,
    formDate
};



function dateToSimple(dateToFormat){

    let date = new Date(dateToFormat);
    let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    // @ts-ignore
    return(date.toLocaleDateString('en-GB', options));
}

function dateTimeToTime(dateToFormat){
    return moment(dateToFormat).format("HH:mm")

}


function todayToSimple(){
    let date = new Date();
    let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return(date.toDateString());
}

function toISO(date){
    return date.toISOString()
}

function toSql(date){
    return  date.slice(0, 10);
}

function getDateDaysAgo(date, daysToSubtract){
    date = new Date(date)
    return moment(date,'dd/mm/yyyy').subtract(daysToSubtract, 'days')
}

function getDateDaysInFuture(date, daysToSubtract){
    date = new Date(date)
    return moment(date,'dd/mm/yyyy').add(daysToSubtract, 'days')
}


function getWeekDay(dateToFormat){
    let date = new Date(dateToFormat);
    let options = {weekday: 'short'};
    // @ts-ignore
    return date.toLocaleDateString('en-US',options);

}

function getWeekDayLong(dateToFormat){
    let date = new Date(dateToFormat);
    let options = {weekday: 'long'};
    // @ts-ignore
    return date.toLocaleDateString('en-US',options);

}


/**
 *
 * Calculate WeeKs Number Based on
 *
 * @param ShowDate
 * @param Date
 */
function weeks(ShowDate, Date) {
    let date = moment(ShowDate, 'YYYY-MM-DD');
    let TourStartDate = moment(Date, 'YYYY-MM-DD');
    var diff = moment.duration(TourStartDate.diff(date));

    let week = Math.floor(diff.asWeeks())
    if(week >= 0){
        week = week +1
    }

    return week

}

/**
 * Get Date of a dau plus or minus a number of days
 *
 * @param initialDate
 */
function getDate(initialDate, numberDays, direction){



}

function toTimestamo(date){
    return new Date(dateToSimple(date + " 00:00:00"))
}

function timeNow(){
    var today = new Date();
    return today.getHours().toFixed() + ":" + today.getMinutes().toFixed() + ":" + today.getSeconds().toFixed();
}

function formatTime(timestamp){
    // This will ignre date
    var today = new Date(timestamp);
    var options = { hours: '2-digit', minutes: '2-digit', seconds: '2-digit' };
    return today.toLocaleTimeString() ;
}


function formatDateUK(date){
    // This will ignre date
    var today = new Date(date);
    return today.toLocaleDateString("en-GB") ;
}

/**
 * This is a get Week Start
 * @param inputDate
 */
function getMonday(inputDate){


    let currentDateObj = new Date(inputDate);
    currentDateObj.setDate(currentDateObj.getDate() - (currentDateObj.getDay() + 6) % 7);
    return currentDateObj

}

/**
 * Get Week End
 * @param inputDate
 */
function getSunday(inputDate){


    let currentDateObj = new Date(inputDate);
    currentDateObj.setDate(currentDateObj.getDate() - (currentDateObj.getDay() + 7) % 7 + 1);
    return currentDateObj

}

function quickISO(DateString){
    console.log(DateString)
    const date = new Date(DateString);
    console.log(date)
    return date//.toISOString().substr(0, 10);
}

function formDate(DateString){
   // const date = new Date(DateString);
    //return DateString.substring(0,10);

   // return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')


    let formDateString = DateString.toString()
    return formDateString.substring(0,10)

}