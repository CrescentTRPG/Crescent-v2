<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'
import AnimatedTrackerItem from './Tracker Components/AnimatedTrackerItem.vue'

export default {
  props: ['charges', 'name'],
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()
    return {
      designStore,
      modal,
      props
    }
  },
  components: { AnimatedTrackerItem }
}
</script>

<template>
  <div>
    <div
      style="
        margin-left: 0.5rem;
        margin-bottom: 0.5rem;
        display: flex;
        justify-content: space-between;
      "
      :style="{ textDecoration: 'underline 1px' + designStore.secondaryTheme }"
    >
      <div>{{ props.name + ' : ' }}</div>
      <div v-if="props.charges == 1" style="margin-right: 1rem">
        <AnimatedTrackerItem></AnimatedTrackerItem>
      </div>
    </div>

    <div
      v-if="props.charges > 1"
      style="border-bottom: 2px solid; display: flex"
      :style="{ borderColor: designStore.secondaryTheme }"
    >
      <div style="display: flex; width: 100%">
        <div style="flex-grow: 2" v-if="props.charges == 1 || props.charges == 2"></div>
        <div style="flex-grow: 1" v-if="props.charges >= 3 && props.charges < 5"></div>
        <div style="padding-left: 0.75rem" v-if="props.charges <= 5"></div>

        <div v-for="index in props.charges" :key="index" style="display: flex; flex-grow: 2">
          <AnimatedTrackerItem
            v-if="index == props.charges && index != 1"
            style="float: left"
          ></AnimatedTrackerItem>
          <AnimatedTrackerItem v-if="index == 1 && index != props.charges"></AnimatedTrackerItem>
          <AnimatedTrackerItem v-if="index != props.charges && index != 1"></AnimatedTrackerItem>
          <hr
            v-if="index != props.charges"
            :style="{ borderColor: designStore.secondaryTheme }"
            style="align-self: center; position: relative; top: -0.5rem; margin-left: 0.5rem"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fullNames {
  display: block;
}

.iconNames {
  display: block;
}
@media (max-width: 600px) {
  .fullNames {
    display: none;
  }
  .iconNames {
    display: block;
  }
}
</style>
