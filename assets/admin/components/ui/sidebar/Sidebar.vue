<script setup>
import { ref, onMounted } from "vue"
import { X } from "lucide-vue-next"
import Button from "@admin/components/ui/elements/Button.vue"

const show = ref(false)

onMounted(() => {

})

const toggle = () => {
  show.value = !show.value
}

const close = () => {
  if (show.value) {
    show.value = false
  }
}
</script>

<template lang="pug">
nav(:class="{ show }").sidebar
  div.sidebar-container
    Button(:click="toggle").sidebar-close-button
      X

    slot
</template>
