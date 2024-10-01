<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import { BPopover, BTable } from 'bootstrap-vue-next'
import { computed, ComputedRef, ref } from 'vue'
import { giIcons } from './icons/giIcons'
import CustomPagination from './CustomPagination.vue'
import IconGrid from './IconGrid.vue'

export default {
  props: ['currentIcon'],
  setup(props: any) {
    const designStore = useDesignStore()
    const selectedIcon = ref('')
    const icons = giIcons
    const currentPage = ref(1)
    const perPage = ref(10)
    const perRow = ref(5)
    const total = ref(icons.length)
    const icon: ComputedRef<string> = computed((): string => {
      return selectedIcon.value || designStore.iconFill
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
  components: {
    BPopover,
    IconGrid
  }
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
      placement="bottom"
    >
      <template #target>
        <BButton v-if="icon.substring(0, 2) == 'gi'" scale="2"
          ><v-icon :name="icon"></v-icon
        ></BButton>
        <BButton v-if="icon.substring(0, 2) == 'bi'" style="font-size: 1.5rem"
          ><i :class="icon"></i
        ></BButton>
      </template>
      <div>
        <IconGrid></IconGrid>
      </div>
    </BPopover>
  </div>
</template>
<style>
.popover {
  --bs-popover-max-width: 1000rem;
}
</style>
