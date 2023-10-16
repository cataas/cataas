<script setup>
import { defineProps, computed } from "vue"
import { RouterLink } from "vue-router"

const { href, to } = defineProps({
  to: {
    type: [Object, String],
  },
  href: String,
})

const componentName = computed(() => {
  return href ? 'a' : RouterLink
})

const componentProps = computed(() => {
  return href ? { href } : { to, activeClass: 'active' }
})
</script>

<template lang="pug">
component(:is="componentName", v-bind="componentProps").sidebar-item-action
  slot
</template>
