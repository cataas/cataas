<script setup>
import { Dropdown } from 'bootstrap'
import { ref, computed, defineProps, onMounted } from "vue";
import Button from "@admin/components/ui/elements/Button.vue"

const root = ref()

const { title, options, direction, level, show, outline } = defineProps({
  title: String,
  options: {
    type: Object,
    default: {},
  },
  direction: {
    type: String,
    default: 'end'
  },
  level: {
    type: String,
    default: 'light'
  },
  show: {
    type: Boolean,
    default: false,
  },
  outline: Boolean,
})

const dropdownMenuClassName = computed(() => {
  return `dropdown-menu dropdown-menu-${direction}${show ? ' show' : ''}`
})

onMounted(() => {
  const button = root.value.querySelector('.dropdown button')

  if (button) {
    button.setAttribute('data-bs-toggle', 'dropdown')
    new Dropdown(button, options)
  }
})
</script>

<template lang="pug">
div(ref="root").dropdown
  slot(name="button")
    Button(:level="level", :outline="outline").dropdown-toggle {{ $t(title) }}

  ul(:class="dropdownMenuClassName")
    slot
</template>
