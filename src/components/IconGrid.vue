<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import { BFormInput, BPopover, BTable } from 'bootstrap-vue-next'
import { computed, ComputedRef, ref } from 'vue'
import { giIcons } from './icons/giIcons'
import CustomPagination from './CustomPagination.vue'

export default {
  emits: ['selectedIcon'],
  props: ['currentIcon'],
  setup(props: any) {
    const designStore = useDesignStore()
    const icons = giIcons
    const cols = ref(5)
    const perRow = ref(5)
    const currentPage = ref(1)
    const filter = ref('')
    const objArray: ComputedRef<Array<any>> = computed((): Array<any> => {
      return icons.map((str) => ({ value: str }))
    })
    const filteredIconSet: ComputedRef<Array<any>> = computed((): Array<any> => {
      return icons.filter((icon) => icon.indexOf(filter.value) > -1)
    })
    const currentIconSet: ComputedRef<Array<any>> = computed((): Array<any> => {
      return filteredIconSet.value.slice(
        (currentPage.value - 1) * 30,
        Math.min(currentPage.value * 30, filteredIconSet.value.length)
      )
    })
    const total: ComputedRef<number> = computed((): number => filteredIconSet.value.length)

    const fields = [{ key: 'value', label: 'icon' }]
    return {
      filter,
      currentPage,
      currentIconSet,
      designStore,
      props,
      icons,
      total,
      objArray,
      fields,
      perRow
    }
  },
  components: {
    CustomPagination,
    BFormInput
  }
}
</script>
<template>
  <div>
    <BFormInput
      class="inputSearch in"
      placeholder="Search..."
      v-model="filter"
      style="border-radius: 0; border: none; border-bottom: 2px solid"
      :style="{
        fontFamily: designStore.font,
        color: designStore.inputText,
        background: designStore.inputBacking,
        borderColor: designStore.secondaryTheme
      }"
    ></BFormInput>
    <div
      class="grid"
      :style="{ background: designStore.inputBacking, color: designStore.iconColor }"
    >
      <div v-for="i in currentIconSet" :key="i">
        <div v-if="i.substring(0, 2) == 'gi'">
          <v-icon
            style="cursor: pointer"
            :name="i"
            scale="2"
            @click="$emit('selectedIcon', i)"
          ></v-icon>
        </div>
        <div v-if="i.substring(0, 2) == 'bi'">
          <i
            style="cursor: pointer; font-size: 1.67rem"
            :class="i"
            @click="$emit('selectedIcon', i)"
          ></i>
        </div>
      </div>
    </div>
    <CustomPagination
      :per-page="30"
      :total-rows="total"
      @currentPage="(page) => (currentPage = page)"
      :maxTab="2"
    ></CustomPagination>
  </div>
</template>
<style>
.grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 25rem;
}
.in {
  width: 25rem;
}
@media (max-width: 600px) {
  .grid {
    width: 15rem;
  }
  .in {
    width: 15rem;
  }
}
</style>
