<script lang="ts">
import { DEFAULT_EFFIGY } from '@/bases.ts'
import TitleWidget from '@/components/TitleWidget.vue'
import { useEffigyStore } from '@/stores/effigyStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import _ from 'lodash'
import { ref } from 'vue'
import {} from 'vue-router'
import { useDesignStore } from '../../../stores/designStore.ts'
import EditEffigy from './EditEffigy.vue'
import EffigyTable from './EffigyTable.vue'

export default {
  setup(props, context) {
    const designStore = useDesignStore()
    const effigyStore = useEffigyStore()

    const navPos = ref('table')
    function switchTab(tab: string) {
      navPos.value = tab
    }
    function navItemStyle(item: string) {
      if (item === navPos.value) {
        return designStore.getAlertTheme
      }
      return designStore.getInputText
    }
    function shiftMode(newMode) {
      mode.value = newMode
    }
    function editEffigy(name) {
      stagedEffigy.value = _.cloneDeep(effigyStore.effigies[name])
      navPos.value = 'buildEffigy'
    }
    const mode = ref('table')
    const stagedEffigy = ref(_.cloneDeep(DEFAULT_EFFIGY))

    return {
      designStore,
      props,
      switchTab,
      navPos,
      navItemStyle,
      mode,
      shiftMode,
      stagedEffigy,
      editEffigy
    }
  },
  methods: {},
  components: {
    TitleWidget,
    BButton,
    EffigyTable,
    EditEffigy
  }
}
</script>

<template>
  <div>
    <div v-if="navPos === 'table'">
      <BButton
        @click="navPos = 'buildEffigy'"
        style="
          border: 2px solid;
          position: absolute;
          right: 2rem;
          font-size: small;
          margin-top: 0.25rem;
        "
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText,
          borderColor: designStore.secondaryTheme
        }"
        >Build New Effigy <v-icon name="gi-gooey-daemon"></v-icon
      ></BButton>
      <TitleWidget title="Effigies" :info-message="''"></TitleWidget>

      <div
        id="effigy-wrapper"
        style="display: flex; border-bottom: 2px solid; width: 100%"
        :style="{
          background: designStore.pageBackdrop,
          color: designStore.sidebarText,
          borderColor: designStore.secondaryTheme
        }"
      >
        <EffigyTable :edit="editEffigy" style="flex-grow: 1"></EffigyTable>
      </div>
    </div>
    <div v-if="navPos === 'buildEffigy'">
      <EditEffigy @return="navPos = 'table'" :ogEffigy="stagedEffigy"></EditEffigy>
    </div>
  </div>
</template>

<style scoped>
li {
  list-style-type: none;
  text-align: center;
  width: 33%;
}
.navClass {
  width: 100%;
  border: 2px solid;
  border-left: 0px;
  border-right: 0px;
}
@media (max-width: 500px) {
  .navClass {
    width: 100%;
    border: 2px solid;
  }
  .navI {
    padding-bottom: 0.5rem;
  }
  .textI {
    display: none;
  }
}
@media (min-width: 501px) {
  .navI {
    display: none;
  }
  .manText {
    display: none;
  }
}
.manText {
  padding-bottom: 0.5rem;
}
</style>
