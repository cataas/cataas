import { Tooltip } from 'bootstrap'

export default (el, binding) => {
  if (binding.value) {
    el.title = binding.value

    return new Tooltip(el, {
      delay: { show: parseInt(binding.arg || 0), hide: 0 },
      html: binding.modifiers.html || false
    })
  }
}
