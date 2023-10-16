<script setup>
import { defineProps, computed } from "vue"
import { Loader } from "lucide-vue-next"
import { useResponsive } from "@admin/lib/responsive";

const { xs, sm, md } = useResponsive()

const { type, level, size, form, loading, position, outline, title } = defineProps({
  type: {
      type: String,
      default: "button"
  },
  level: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: null,

    validator(value) {
      ['lg', 'sm'].includes(value);
    }
  },
  form: {
      type: String,
      default: null
  },
  loading: {
      type: Boolean,
      default: false
  },
  position: {
    type: String,
    default: 'left',

    validator(value) {
      return ['left', 'right'].includes(value)
    }
  },
  outline: {
    type: Boolean,
    default: false,
  },
  title: String,
})

const hasLeftIconLoading = computed(() => {
  return position === 'left' && loading
})

const hasRightIconLoading = computed(() => {
  return position === 'right' && loading
})

const hasLeftIcon = computed(() => {
  return position === 'left' && !loading
})

const hasRightIcon = computed(() => {
  return position === 'right' && !loading
})

const className = computed(() => {
  return `btn btn-${outline ? 'outline-' : ''}${level} ${getButtonSize()}`;
})

const getButtonSize = () => {
  if (size) {
    return `btn-${size}`;
  } else if (xs() || sm() || md()) {
    return 'btn-sm';
  }

  return '';
}
</script>

<template lang="pug">
button(:type="type", :form="form", :disabled="loading", :class="className", v-tooltip:500="title")
  slot(v-if="hasLeftIcon", name="icon")
  Loader(v-if="hasLeftIconLoading").me-lg-2.me-1
  slot
  slot(v-if="hasRightIcon", name="icon")
  Loader(v-if="hasRightIconLoading").ms-lg-2.ms-1
</template>
