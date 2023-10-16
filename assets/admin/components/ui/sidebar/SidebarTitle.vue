<script setup>
import { defineProps, computed } from "vue"

const { h } = defineProps({
  h: {
    type: [Number, String],
    default: 4,

    validator(value) {
      return [1, 2, 3, 4, 5].includes(parseInt(value));
    },
  },
})

const hn = computed(() => {
  return parseInt(h)
})
</script>

<template lang="pug">
h1(v-if="hn === 1").sidebar-title
  slot
h2(v-if="hn === 2").sidebar-title
  slot
h3(v-if="hn === 3").sidebar-title
  slot
h4(v-if="hn === 4").sidebar-title
  slot
h5(v-if="hn === 5").sidebar-title
  slot
</template>

<style scoped>

</style>
