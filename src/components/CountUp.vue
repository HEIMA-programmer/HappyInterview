<template>
  <span>{{ displayValue }}{{ suffix }}</span>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  end: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 2
  },
  suffix: {
    type: String,
    default: ''
  }
})

const displayValue = ref(0)

const startAnimation = () => {
  const startTime = Date.now()
  const startValue = 0
  const endValue = props.end
  const duration = props.duration * 1000

  const updateValue = () => {
    const now = Date.now()
    const progress = Math.min((now - startTime) / duration, 1)
    const easeProgress = 1 - Math.pow(1 - progress, 3) // easeOutCubic
    displayValue.value = Math.floor(startValue + (endValue - startValue) * easeProgress)

    if (progress < 1) {
      requestAnimationFrame(updateValue)
    }
  }

  updateValue()
}

onMounted(startAnimation)
watch(() => props.end, startAnimation)
</script>
