<script setup>
import { Loader } from "lucide-vue-next"
import { defineProps, inject } from "vue"
import YesNo from "@admin/components/ui/badge/YesNo.vue"
import DropdownAction from "@admin/components/ui/dropdown/DropdownAction.vue";

import useCatsStore from '../../stores/cats'

const { remove, validate, edit } = useCatsStore()

const requester = inject('requester')
const { items } = defineProps({
  items: Array,
  loading: Boolean,
  actions: Function
})

const editTags = (event, item) => {
    const tags = event.target.elements.tags.value;

    edit(item, tags)
}
</script>

<template lang="pug">
Loader(v-if="loading")
table(v-if="!loading").table-content
  thead
    tr
      th #
      th {{ $t('image') }}
      th {{ $t('validated') }}
      th {{ $t('tags') }}
      th {{ $t('edited_at') }}
      th {{ $t('created_at') }}
      th {{ $t('actions') }}
  tbody
    tr(v-for="item in items" :key="item.id")
      td {{ item._id }}
      td
        img(:src="'/images/' + item.file", width="128")
      td
        YesNo(:bool="item.validated")
      td
        form(@submit.prevent="editTags($event, item)").inline-form
          div.input-group
            input(type="text", name="tags", :value="item.tags.join(',')", required).form-control
            button(type="submit").btn.btn-sm.btn-success {{ $t('actions.submit') }}

      td(v-date="{ hour: 'numeric', minute: 'numeric' }") {{ item.updatedAt }}
      td(v-date) {{ item.createdAt }}
      td
        component(:is="actions", :item="item")
          DropdownAction(@click="validate(item)") {{ $t('actions.validate') }}
</template>
