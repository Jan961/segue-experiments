function getDateFromWeekNum(weekNum: string | number, weekNumToDateMap: { [x: string]: any;[x: number]: Date; }) {
    console.log('1', weekNumToDateMap);
    if (weekNumToDateMap && weekNumToDateMap[weekNum]) {
        return weekNumToDateMap[weekNum];
    }
    return 'N/A';
}

export default getDateFromWeekNum;