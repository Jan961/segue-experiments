import { loggingService } from "services/loggingService"



async function getUsers(accountId:number){
    try{
    const address = ()=> `/api/users/read/accountAssociated/${accountId}`
    const response = await fetch(address())
    if(response.ok){
      const parsedResponse = await response.json()
      return parsedResponse
    }
  } catch (error) {
    loggingService.logError( error)
    console.error(error)
  }
}


export default getUsers