import { Tooltip } from 'bootstrap'

// https://dockyard.com/blog/2020/02/14/you-probably-don-t-need-moment-js-anymore
export default (el, binding = {}) => {
  try {
    if (el.textContent) {
      const date = new Date(el.textContent)
      el.textContent = date.toLocaleDateString(navigator.language, binding.value)
      el.title = date.toLocaleDateString(navigator.language, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      })

      return new Tooltip(el, { delay: { show: 500, hide: 0 } })
    }
  } catch (e) {}
}
