<script setup>
import { ref, inject, defineProps } from "vue"
import { Menu } from "lucide-vue-next"
import { useResponsive } from "@admin/lib/responsive"
import Dropdown from "@admin/components/ui/dropdown/Dropdown.vue"
import Button from "@admin/components/ui/elements/Button.vue"
import Modal from "@admin/components/modal/Modal.vue"

const menuId = 0
const emitter = inject('emitter')
const { xs } = useResponsive()
const root = ref()

const { options, direction, level, outline } = defineProps({
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
  outline: Boolean,
})

const openModal = () => {
  if (xs()) {
    root.value.querySelector('.dropdown-menu').classList.add('d-none')
    emitter.emit(`modal:${menuId}:show`)
  } else {
    root.value.querySelector('.dropdown-menu').classList.remove('d-none')
  }
}
</script>

<template lang="pug">
Modal(:id="menuId")
  template(v-slot:body)
    div(style="position: relative;").dropdown-menu.d-block.show.shadow-none
      slot

div(ref="root")
  Dropdown(ref="dropdown", :options="options", :direction="direction", @click="openModal")
    template(v-slot:button)
      slot(name="button")
        Button(:level="level", :outline="outline")
          Menu

    slot
</template>
