<script setup>
import { defineProps, inject } from "vue"
import Menu from "@admin/components/ui/menu/Menu.vue"
import DropdownHeader from "@admin/components/ui/dropdown/DropdownHeader.vue"
import DropdownAction from "@admin/components/ui/dropdown/DropdownAction.vue"

const emitter = inject('emitter')

const { item } = defineProps({
  item: Object,
})
</script>

<template lang="pug">
Menu
  DropdownHeader {{ $t('actions') }}
  DropdownAction(@click="emitter.emit('modal:delete-item:show', item)")
    span.text-danger {{ $t('actions.delete') }}
  slot
</template>
