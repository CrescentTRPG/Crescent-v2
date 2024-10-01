<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import { BFormInput, BPopover, BTable } from 'bootstrap-vue-next'
import { computed, ComputedRef, ref } from 'vue'
import { giIcons } from './icons/giIcons'
import CustomPagination from './CustomPagination.vue'

export default {
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
      class="inputSearch"
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
      style="display: flex; flex-direction: row; flex-wrap: wrap; width: 25rem"
      :style="{ background: designStore.inputBacking, color: designStore.iconColor }"
    >
      <div v-for="i in currentIconSet" :key="i"><v-icon :name="i" scale="2"></v-icon></div>
    </div>
    <CustomPagination
      :per-page="30"
      :total-rows="total"
      @currentPage="(page) => (currentPage = page)"
    ></CustomPagination>
  </div>
</template>
<style></style>
