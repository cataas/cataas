import './assets/sass/main.scss'
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM ready')

  const countElement = document.querySelector('#count')
  if (countElement) {
    fetch('/api/count')
      .then(response => response.json())
      .then(({ count }) => countElement.innerHTML = count)
  }
})
