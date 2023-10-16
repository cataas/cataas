export const EXTRA_SMALL_LIMIT = 576
export const SMALL_LIMIT = 576
export const MEDIUM_LIMIT = 768
export const LARGE_LIMIT = 992
export const EXTRA_LARGE_LIMIT = 1200

export const EXTRA_SMALL = 0
export const SMALL = 1
export const MEDIUM = 2
export const LARGE = 3
export const EXTRA_LARGE = 4

export const TYPES = {
  xs: EXTRA_SMALL,
  sm: SMALL,
  md: MEDIUM,
  lg: LARGE,
  xl: EXTRA_LARGE
}

export function getViewport () {
  const w = window.innerWidth
  if (w < EXTRA_SMALL_LIMIT) {
    return EXTRA_SMALL
  }

  if (w >= SMALL_LIMIT && w < MEDIUM_LIMIT) {
    return SMALL
  }

  if (w >= MEDIUM_LIMIT && w < LARGE_LIMIT) {
    return MEDIUM
  }

  if (w >= LARGE_LIMIT && w < EXTRA_LARGE_LIMIT) {
    return LARGE
  }

  return EXTRA_LARGE
}

export function isViewport (type) {
  const w = window.innerWidth

  if (typeof type === 'string') {
    type = TYPES[type]
  }

  if (
    (type === EXTRA_SMALL && w < EXTRA_SMALL_LIMIT) ||
        (type === SMALL && w >= SMALL_LIMIT && w < MEDIUM_LIMIT) ||
        (type === MEDIUM && w >= MEDIUM_LIMIT && w < LARGE_LIMIT) ||
        (type === LARGE && w >= LARGE_LIMIT && w < EXTRA_LARGE_LIMIT) ||
        (type === EXTRA_LARGE && w >= EXTRA_LARGE_LIMIT)
  ) {
    return true
  }
}

export function useResponsive () {
  return {
    xs: () => getViewport() === EXTRA_SMALL,
    sm: () => getViewport() === SMALL,
    md: () => getViewport() === MEDIUM,
    lg: () => getViewport() === LARGE,
    xl: () => getViewport() === EXTRA_LARGE,

    mobile: () => [EXTRA_SMALL, SMALL].includes(getViewport()),
    table: () => [MEDIUM].includes(getViewport()),
    desktop: () => [LARGE, EXTRA_LARGE].includes(getViewport()),

    isViewport,
    viewport: getViewport
  }
}

export default {
  install (app) {
    app.config.globalProperties.$xs = () => getViewport() === EXTRA_SMALL
    app.config.globalProperties.$sm = () => getViewport() === SMALL
    app.config.globalProperties.$md = () => getViewport() === MEDIUM
    app.config.globalProperties.$lg = () => getViewport() === LARGE
    app.config.globalProperties.$xl = () => getViewport() === EXTRA_LARGE

    app.config.globalProperties.$mobile = () => [EXTRA_SMALL, SMALL].includes(getViewport())
    app.config.globalProperties.$table = () => [MEDIUM].includes(getViewport())
    app.config.globalProperties.$desktop = () => [LARGE, EXTRA_LARGE].includes(getViewport())

    app.config.globalProperties.$isViewport = isViewport
    app.config.globalProperties.$viewport = getViewport
  }
}
