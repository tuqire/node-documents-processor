export default data => {
  const container = document.querySelector('#response-container')

  container.innerHTML = `
    <h4>Process time: ${(data.endTime - data.startTime) / 1000} seconds</h4>
    <h4>Memory allocated: ${(data.rss / 1024 / 1024).toFixed(2)} MB</h4>
    <h4>Heap size: ${(data.heapTotal / 1024 / 1024).toFixed(2)} MB</h4>
    <h4>Memory used: ${(data.heapUsed / 1024 / 1024).toFixed(2)} MB</h4>
  `
}
