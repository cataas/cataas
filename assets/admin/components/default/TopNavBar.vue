<script setup>
import NavBar from "@admin/components/ui/navbar/NavBar.vue"
import Button from "@admin/components/ui/elements/Button.vue"
import { Menu } from "lucide-vue-next"

const toggleSidebar = () => {
  console.log('toggleSidebar')
}
</script>

<template lang="pug">
NavBar
  Button(outline="true", level="secondary", @click="toggleSidebar").ms-0.sidebar-lg-toggle
    Menu(v-slot="icon")

  slot
</template>
