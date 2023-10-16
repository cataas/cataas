<script setup>
import { defineProps } from 'vue'

const { name, type, label, error, help, placeholder, value } = defineProps({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: null
  },
  value: {
    type: String,
    default: null
  },
  error: {
    type: String,
    default: null
  },
  help: {
    type: String,
    default: null
  },
  placeholder: {
      type: String,
      default: null
  },
  required: {
    type: Boolean,
    default: true
  }
})
</script>

<template lang="pug">
div.form-group(v-if="type === 'text' || type === 'password'")
  label(v-if="label", :for="name") {{ $t(label) }}
  input.form-control(:id="name", :name="name", :type="type", :value="value", :placeholder="placeholder", :required="required")
  span.invalid-feedback(v-if="error") {{ $t(error) }}
  div.form-text(v-if="help") {{ $t(help) }}
</template>

<style scoped>

</style>
