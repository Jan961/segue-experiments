const excelJsLoader = async () => {
  const ExcelJS = await import('exceljs/dist/es5/exceljs.browser')
  return ExcelJS.default
}

export default excelJsLoader
