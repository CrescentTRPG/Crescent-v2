<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { BPopover } from 'bootstrap-vue-next'
import { computed, ComputedRef, ref } from 'vue'
import IconDisplay from './IconDisplay.vue'
import IconGrid from './IconGrid.vue'
import { giIcons } from './icons/giIcons'

export default {
  emits: ['selectedIcon'],
  props: ['currentIcon', 'orientation', 'color', 'xsmall'],
  setup(props: any) {
    const designStore = useDesignStore()
    const selectedIcon = ref('')
    const icons = giIcons
    const currentPage = ref(1)
    const perPage = ref(10)
    const perRow = ref(5)
    const total = ref(icons.length)
    const icon: ComputedRef<string> = computed((): string => {
      return selectedIcon.value || props.currentIcon
    })
    const objArray: ComputedRef<Array<any>> = computed((): Array<any> => {
      return icons.map((str) => ({ value: str }))
    })
    const fields = [{ key: 'value', label: 'icon' }]
    return {
      designStore,
      selectedIcon,
      props,
      icon,
      icons,
      currentPage,
      perPage,
      total,
      objArray,
      fields,
      perRow
    }
  },
  methods: {
    select(icon: string) {
      this.selectedIcon = icon
      this.$emit('selectedIcon', icon)
    }
  },
  components: { BPopover, IconGrid, IconDisplay }
}
</script>
<template>
  <div style="width: fit-content">
    <BPopover
      :style="{ background: designStore.primaryTheme, borderColor: designStore.secondaryTheme }"
      class="popover"
      :click="true"
      :close-on-hide="true"
      :delay="{ show: 0, hide: 0 }"
      style="width: fit-content !important"
      :placement="props.orientation"
    >
      <template #target>
        <div v-if="props.xsmall">
          <IconDisplay scale="1" fontsize="1rem" :icon="icon" :color="props.color"></IconDisplay>
        </div>
        <div v-else>
          <div
            v-if="icon.substring(0, 2) == 'gi'"
            class="icons hoverableTransparantLinear"
            :style="{ borderColor: designStore.secondaryTheme }"
          >
            <v-icon
              scale="2.5"
              :name="icon"
              style="cursor: pointer"
              :style="{ color: props.color }"
            ></v-icon>
          </div>
          <div
            class="icons"
            :style="{ borderColor: designStore.secondaryTheme, color: props.color }"
            v-if="icon.substring(0, 2) == 'bi'"
            style="font-size: 2.5rem; cursor: pointer"
          >
            <i :class="icon"></i>
          </div>
        </div>
      </template>
      <div>
        <IconGrid @selectedIcon="(icon) => select(icon)"></IconGrid>
      </div>
    </BPopover>
  </div>
</template>
<style>
.popover {
  --bs-popover-max-width: 1000rem;
}
.icons {
  border-radius: 10px;
  padding: 0.5rem;
  border: 1px solid;
}
</style>
