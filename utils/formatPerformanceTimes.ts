

function formatPerformanceTimes(firstPerformanceTime: string | null, secondPerformanceTime: string | null): string {
    let firstPerformanceHour = firstPerformanceTime ? new Date(firstPerformanceTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
    let secondPerformanceHour = secondPerformanceTime ? new Date(secondPerformanceTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
    
    let performances = [];
    if (firstPerformanceHour) performances.push(firstPerformanceHour);
    if (secondPerformanceHour) performances.push(secondPerformanceHour);
    if(performances.length >0){
        return performances.join(", ");
    } else {
        return 'none'
    }
  }


export function formatPerformanceTime(firstPerformanceTime: string): string {
    let performanceHour = firstPerformanceTime ? new Date(firstPerformanceTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

        return performanceHour
    
  }

  
  export default formatPerformanceTimes