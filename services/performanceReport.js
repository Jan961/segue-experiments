import { format } from 'date-fns';
import ReactPDF from '@react-pdf/renderer';
import Report from './reportPDF/Report';
import { newDate } from './dateService';

function formatDuration(duration, options = {}) {
  const { h = 'h', m = 'm' } = options;
  const minutes = Math.floor(duration / 1000 / 60);
  // format minutes to hours and minutes
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0) {
    return `${hours}${h} ${remainingMinutes}${m}`;
  } else if (remainingMinutes > 0) {
    return `${remainingMinutes}${m}`;
  } else {
    return '';
  }
}

export async function generateReport(report) {
  const reportData = {
    ...report,
    performanceDuration: formatDuration(report.actOneDuration + report.actTwoDuration, {
      h: ' Hours',
      m: ' Minutes',
    }),
    actOneDuration: formatDuration(report.actOneDuration),
    actTwoDuration: formatDuration(report.actTwoDuration),
    intervalDuration: formatDuration(report.intervalDuration),
    getOutDuration: formatDuration(report.getOutDuration),
    performanceDate: format(newDate(report.performanceDate), 'eee dd/MM/yyyy'),
    performanceTime: format(newDate(report.performanceTime), 'HH:mm'),
  };
  return await ReactPDF.renderToStream(<Report reportData={reportData} />);
}
