export const reverseDate = (inputDt) => {
   return new Date(inputDt.split('/').reverse().join('/')).getTime()
}