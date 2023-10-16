<script setup>
import { ref, inject } from "vue"

import Input from "@admin/components/elements/form/Input.vue"

const requester = inject('requester')
const auth = inject('auth')
const form = ref()
const error = ref()

const onSubmit = async () => {
  error.value = null
  try {
    const { token } = await requester.post('/security/sign-in', form.value, { 'Content-Type': 'application/json' })
    auth.accessToken = token
    window.location.reload()
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template lang="pug">
main.h-screen.w-100#login-container
  section.container
    div.row.py-5.text-center
      h1.text-dark {{ $t('admin') }}

    div.row
      div.col-xxl-4.col-xl-3
      div.col-xxl-4.col-xl-6
        div.rounded.bg-white.shadow.shadow-dark.p-5
          p(v-if="error").alert.alert-danger {{ $t(error) }}

          form(action="/", method="post", @submit.prevent="onSubmit", ref="form")
            Input(name="username", label="form.label.username").mb-4
            Input(name="password", label="form.label.password", type="password").mb-4

            button.w-100.btn.btn-primary(type="submit") {{ $t('actions.sign_in') }}
      div.col-xxl-4.col-xl-3
</template>

<style>
  #login-container {
    min-height: 100%;
    background-color: #353353;
    background-image: url('https://images.pexels.com/photos/1809644/pexels-photo-1809644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
</style>
