


function formatDate (inputDate){
    let newDate = new Date(inputDate)
    return newDate.toLocaleDateString()
    }

export default formatDate