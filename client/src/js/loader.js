export const addLoader = () => {
  const container = document.querySelector('#response-container')

  container.innerHTML = `
    <h4>Loading...</h4>`
}

export const removeLoader = () => {
  const container = document.querySelector('#response-container')

  container.innerHTML = ''
}
