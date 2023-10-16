<script setup>
import { RouterLink } from "vue-router"
</script>

<template lang="pug">
RouterLink(to="/").sidebar-brand
  slot
</template>
