export default data => {
  const container = document.querySelector('#response-container')

  container.innerHTML = `
    <h4>Process took ${(data.endTime - data.startTime) / 1000} seconds</h4>
  `
}
