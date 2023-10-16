import { ref, inject } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('pages', () => {
  const requester = inject('requester')
  const items = ref([])

  async function find (limit = 10, skip = 0) {
    const pages = await requester.get('/admin/cats', { limit, skip })
    items.value = pages

    return pages
  }

  async function remove (item) {
    return await requester.delete(`/admin/cats/${item._id}`)
  }

  async function edit (item, tags) {
    return await requester.patch(`/admin/cats/${item._id}`, { tags }, { 'Content-Type': 'application/json' })
  }

  async function validate (item, tags) {
    return await requester.put(`/admin/cats/${item._id}/validate`)
  }

  return { items, find, remove, edit, validate }
})
