export const addLoader = containerId => {
  const container = document.querySelector(`#${containerId}`)

  const loader = document.createElement('h4')
  loader.setAttribute('class', 'loader')
  loader.innerHTML = 'Loading...'

  container.appendChild(loader)
}

export const removeLoader = containerId => {
  const loader = document.querySelector(`#${containerId} .loader`)

  loader.parentNode.removeChild(loader)
}
