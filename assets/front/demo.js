const FILTERS = { none: '', mono: 'filter=mono', negate: 'filter=negate', blur: 'blur=5' }
const PREVIEW_HEIGHT = 300

export function initDemo (root = document.querySelector('[data-demo]')) {
  if (!root) return

  const stage = root.querySelector('[data-stage]')
  const image = root.querySelector('[data-image]')
  const text = root.querySelector('[data-text]')
  const tag = root.querySelector('[data-tag]')
  const urlBox = root.querySelector('[data-url]')
  const copyButton = root.querySelector('[data-copy-url]')
  const state = { filter: 'none', format: 'default' }
  let timer

  const publicUrl = () => {
    const value = text.value.trim()
    const gif = state.format === 'gif'
    const tags = [gif ? 'gif' : '', ...tag.value.split(',').map((t) => t.trim())].filter(Boolean)
    let path = '/cat'
    if (tags.length) path += '/' + tags.map(encodeURIComponent).join(',')
    if (value) path += '/says/' + encodeURIComponent(value)
    const params = []
    if (FILTERS[state.filter]) params.push(FILTERS[state.filter])
    return path + (params.length ? '?' + params.join('&') : '')
  }

  const render = () => {
    const path = publicUrl()
    urlBox.textContent = location.origin + path
    stage.classList.add('is-loading')
    // Cache-buster : un nouveau chat à chaque appel (non affiché dans l'URL)
    image.src = path + (path.includes('?') ? '&' : '?') + `height=${PREVIEW_HEIGHT}&t=${Date.now()}`
  }

  const schedule = () => {
    clearTimeout(timer)
    timer = setTimeout(render, 300)
  }

  image.addEventListener('load', () => stage.classList.remove('is-loading'))
  image.addEventListener('error', () => {
    stage.classList.remove('is-loading')
    urlBox.textContent = root.dataset.error
  })

  text.addEventListener('input', schedule)
  tag.addEventListener('input', schedule)

  for (const [attr, key] of [['data-filter', 'filter'], ['data-format', 'format']]) {
    root.querySelectorAll(`[${attr}]`).forEach((button) => {
      button.addEventListener('click', () => {
        state[key] = button.getAttribute(attr)
        root.querySelectorAll(`[${attr}]`).forEach((b) => b.setAttribute('aria-pressed', String(b === button)))
        render()
      })
    })
  }

  root.querySelector('[data-another]').addEventListener('click', render)

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.origin + publicUrl())
      copyButton.textContent = root.dataset.copied
      setTimeout(() => { copyButton.textContent = root.dataset.copy }, 1500)
    } catch { /* clipboard indisponible */ }
  })

  render()
}
