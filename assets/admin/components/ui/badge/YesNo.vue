<script setup>
import { Check, X } from "lucide-vue-next"
import { defineProps } from "vue"

const { bool } = defineProps({
  bool: Boolean
})
</script>

<template lang="pug">
span(v-if="bool").d-flex-inline.align-items-center.badge.rounded-pill.text-bg-success
  Check(size="16px")
  span.ms-1 {{ $t('yes') }}

span(v-if="!bool").d-flex-inline.align-items-center.badge.rounded-pill.text-bg-danger
  X(size="16px")
  span.ms-1 {{ $t('no') }}
</template>
