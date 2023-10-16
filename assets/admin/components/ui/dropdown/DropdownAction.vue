<script setup>
import { defineProps } from "vue"

const { disabled, active } = defineProps({
  disabled: Boolean,
  active: Boolean,
})
</script>

<template lang="pug">
li
  button(:class="{ disabled, active }", type="button").dropdown-item
    slot(name="button")
    slot
</template>
