<script setup>
import { inject, defineEmits, ref, onMounted } from "vue"
import Confirm from "@admin/components/modal/Confirm.vue"

const emit = defineEmits(['success'])
const emitter = inject('emitter')
const item = ref({})

onMounted(() => {
  emitter.on('modal:delete-item:show', resource => item.value = resource)
})
</script>

<template lang="pug">
Confirm(id="delete-item", @success="emit('success', item)")
  p.mb-0 {{ $t('delete_resource') }} ?
</template>
