export default (containerId, data) => {
  const container = document.querySelector(`#${containerId}`)

  const rows = [
    `Process time: ${(data.endTime - data.startTime) / 1000} seconds`,
    `Memory allocated: ${(data.rss / 1024 / 1024).toFixed(2)} MB`,
    `Heap size: ${(data.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    `Memory used: ${(data.heapUsed / 1024 / 1024).toFixed(2)} MB`
  ]

  rows.forEach(item => {
    const el = document.createElement('h5')
    el.innerHTML = item

    container.appendChild(el)
  })

  container.appendChild(document.createElement('hr'))
}
