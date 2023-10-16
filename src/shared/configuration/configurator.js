module.exports = {
  _items: null,
  immutable: true,

  /**
   * Set box content
   * @param {object} items
   * @param {object} [options={}]
   * @param {boolean} [options.immutable=true] Set content immutable
   */
  set (items, { immutable } = {}) {
    if (this.immutable && this._items !== null) {
      throw new Error('Content can\'t change because box is immutable.')
    }

    if (typeof items !== 'object' || Array.isArray(items) || items === null) {
      throw new Error('Items has to be an object.')
    }

    this._items = items

    if (!!immutable && !this.immutable) {
      this.immutable = immutable
    }
  },

  /**
   * Add item into box
   * @param {string} name
   * @param {*} value
   */
  add (name, value) {
    if (this.immutable && !!this._items[name]) {
      throw new Error('Can\'t add item because it already exists and box is immutable.')
    }

    this._items[name] = value
  },

  /**
   * Get item from box
   * @param {string} name
   * @param {*} [def=null] default value
   *
   * @return {*|null}
   */
  get (name, def = null) {
    const levels = name.split('.')

    let last = this._items
    for (let i = 0; i < levels.length; i++) {
      if (last === null) {
        break
      }

      last = last[levels[i]] !== undefined ? last[levels[i]] : def
    }

    return last
  },

  /**
   * Search something into tree
   * @param {string} name
   * @param {object} [tree=null]
   *
   * @return {*}
   */
  search (name, tree = null) {
    tree = tree !== null ? tree : this._items

    const nodes = []
    for (const prop in tree) {
      if (prop === name) {
        return tree[prop]
      }

      if (
        typeof tree[prop] === 'object' &&
        !Array.isArray(tree[prop]) &&
        tree[prop] !== null
      ) {
        nodes.push(tree[prop])
      }
    }

    let search = null
    for (let i = 0; i < nodes.length; i++) {
      search = this.search(name, nodes[i])

      if (search) {
        return search
      }
    }

    return null
  },

  /**
   * Get items
   * @return {object}
   */
  get items () {
    return this._items
  },

  _clear () {
    this._items = null
    this.immutable = false
  }
}
