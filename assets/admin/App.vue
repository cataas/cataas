<script setup>
  import { inject } from "vue"
  import { RouterView } from "vue-router"
  import Sidebar from "@admin/components/default/Sidebar.vue"
  import Login from "@admin/components/default/Login.vue"

  const auth = inject('auth')
</script>

<template lang="pug">
div(v-if="auth.isAuthenticated()").viewport
  Sidebar

  section.d-flex.flex-column.flex-grow-1.h-screen.overflow-y-auto
    main.flex-grow-1
      RouterView

Login(v-if="!auth.isAuthenticated()")
</template>
