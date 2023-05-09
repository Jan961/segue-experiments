/**
 *
 * This Service will call the stored procedures to fenerate the reprots sending backthe data to generate the
 * excel files
 *
 *
 * @type {{salesReport: *}}
 */
export const reportsService = {
    salesReport,
    MasterPlanReport
}


function salesReport(params: any){
    /**
     * Call the Sored Proceduee
     */
    console.log("SalesReportCalled")
    return true
}


function MasterPlanReport(startDate?: Date, endDate?: Date){


    return [
        { Name: "Bill Clinton", Index: 1111 },
        { Name: "GeorgeW Bush", Index: 44444 },
        { Name: "Barack Obama", Index: 66666 },
        { Name: "Donald Trump", Index: 900878897987},
        { Name: "Joseph Biden", Index: 696996969696969646 }
    ]

}