import './assets/sass/main.scss'
import { initDemo } from './demo.js'

document.addEventListener('DOMContentLoaded', function () {
  const countElement = document.querySelector('#count')
  if (countElement) {
    fetch('/api/count')
      .then(response => response.json())
      .then(({ count }) => { countElement.textContent = count.toLocaleString() })
      .catch(() => {})
  }

  initDemo()

  document.querySelectorAll('form[data-confirm]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!window.confirm(form.dataset.confirm)) event.preventDefault()
    })
  })
})
