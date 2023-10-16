<script setup>
import { inject, defineProps, defineEmits, ref, computed, onMounted, onUnmounted } from "vue"
import Button from "@admin/components/ui/elements/Button.vue"
import { Modal } from "bootstrap"

const emitter = inject('emitter')
const emit = defineEmits(['close', 'success'])
const modal = ref()
let modalId
let modalElement

const { title, options, scroll, size } = defineProps({
  title: String,
  options: {
    type: Object,
    default: {}
  },
  scroll: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'md',
    validator(value) {
      return ['sm', 'md', 'lg', 'xl'].includes(value);
    }
  }
})

const className = computed(() => {
  return `modal-dialog modal-${size} ${scroll ? 'modal-dialog-scrollable' : ''}`
})

onMounted(() => {
  modal.value.addEventListener('hidden.bs.modal', () => emit('close'))

  modalElement = new Modal(modal.value, options)
  modalId = modal.value.id

  if (modalId) {
    emitter.on(`modal:${modalId}:show`, () => show())
    emitter.on(`modal:${modalId}:hide`, () => hide())
  }
})

onUnmounted(() => {
  if (modalId) {
    emitter.off(`modal:${modalId}:show`);
    emitter.off(`modal:${modalId}:hide`);
  }
})

const success = (detail = {}) => {
  emit('success', detail)
  close()
}

const close = detail => {
  modalElement.hide()
  emit('close', detail)
}

const show = () => {
  modalElement.show()
}

const hide = () => {
  modalElement.hide()
}
</script>

<template lang="pug">
div(ref="modal", tabindex="-1").modal.fade
  div(:class="className")
    div.modal-content
      slot(name="header", :success="success", :close="close", :modal="modal")
        header(v-if="title").modal-header
          h5.modal-title {{ title }}
          button(type="button", data-bs-dismiss="modal").btn-close

      div.modal-body
        slot(name="body", :success="success", :close="close", :modal="modal")

      div.modal-footer
        slot(name="footer", :success="success", :close="close", :modal="modal")
          Button(level="success", @click="success") {{ $t('validate') }}
          Button(level="secondary", @click="close") {{ $t('cancel') }}
</template>
