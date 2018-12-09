import csvGenerator from './csv-generator'

window.addEventListener('load', () => {
  document.querySelector('#generate-csv-button')
    .addEventListener('click', () => {
      const csvContent = csvGenerator()
      const data = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`)
      const filename = 'data.csv'

      const link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.click();
    })
})