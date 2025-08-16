<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import ArrayTabsSingleSelect from './ArrayTabsSingleSelect.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { computed, ref } from 'vue'
import CustomModal from '@/components/CustomModal.vue'
import BasicInput from '@/components/Character/BasicInput.vue'

export default {
  props: [
    'currentStatBlock',
    'isEditing',
    'versions',
    'currentVersion',
    'versionObjs',
    'selectVersion',
    'addNewVersion',
    'toggle'
  ],
  emits: ['version'],
  setup(props, context) {
    const designStore = useDesignStore()
    const statBlock = props.currentStatBlock
    const modal = ref(false)

    function addVersion(old, val) {
      if (old === '' || val === '') {
        alert('Must Name All Versions')
      }
      if (props.versions?.length === 0) {
        addFirstVersion(old, val)
      } else if (!props.versions?.includes(val)) {
        props.addNewVersion(val)
        props.selectVersion(val)
      } else alert('Version Names Must Be Unique!')

      ogVersionName.value = ''
      newVersionName.value = ''
      modal.value = false
    }

    function addFirstVersion(old, val) {
      props.addNewVersion(old)
      if (!props.versions?.includes(val)) {
        props.addNewVersion(val)
        props.selectVersion(val)
      } else {
        props.selectVersion(old)
        alert('Version Names Must Be Unique!')
      }
    }

    const tabs = computed(() => {
      let i = 0
      return props.versions.map((v) => {
        return { name: v, index: i++ }
      })
    })

    const ogVersionName = ref('Default')
    const newVersionName = ref('')

    return {
      designStore,
      statBlock,
      props,
      modal,
      ogVersionName,
      newVersionName,
      addVersion,
      tabs
    }
  },
  components: {
    ArrayTabsSingleSelect,
    BButton,
    CustomModal,
    BasicInput
  }
}
</script>
<template>
  <div>
    <div style="display: flex">
      <ArrayTabsSingleSelect
        @selectedTab="(tab) => props.selectVersion(tab)"
        :tabs="props.versions"
        :current-version="props.currentVersion"
      ></ArrayTabsSingleSelect>
      <BButton
        v-if="props.isEditing"
        style="
          display: flex;
          flex-direction: column;
          min-width: 9rem;
          justify-content: center;
          border-radius: 0;
          border-top: 2px solid;
          border-bottom: 2px solid;
        "
        @click="modal = true"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText,
          borderColor: designStore.secondaryTheme
        }"
        ><div style="display: flex; justify-content: center">
          <div>Add Version</div>
          <i class="bi bi-plus" style="font-size: x-large; margin-top: -0.25rem"></i></div
      ></BButton>
      <div
        class="bioButton"
        style="border-radius: 0; border-top: 2px solid; border-bottom: 2px solid"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText,
          borderColor: designStore.secondaryTheme
        }"
      >
        <BButton
          style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            border: 2px solid;
            padding: 0.15rem;
            margin: 0.25rem;
          "
          @click="props.toggle"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          ><div style="display: flex; justify-content: center">
            <i
              class="bi bi-file-earmark-person"
              style="font-size: x-large; margin-top: -0.25rem"
            ></i></div
        ></BButton>
      </div>
    </div>
    <CustomModal
      :showModal="modal"
      :title="
        props.versions && props.versions.length === 0
          ? 'Add New Version And Name The Current One'
          : 'Add New Version'
      "
      @close="modal = false"
      :close-on-enter="true"
    >
      <template v-slot:body>
        <BasicInput
          style="margin-bottom: 0.5rem"
          v-if="props.versions && props.versions.length === 0"
          label="Current Version"
          :value="ogVersionName"
          @newValue="(val) => (ogVersionName = val)"
        ></BasicInput>
        <BasicInput
          label="New Version"
          :value="newVersionName"
          @newValue="(val) => (newVersionName = val)"
        ></BasicInput>
      </template>
      <template v-slot:footer>
        <BButton
          style="border: 1px solid; margin-right: 0.5rem"
          :style="{ borderColor: designStore.secondaryTheme }"
          @click="modal = false"
          >Cancel</BButton
        ><BButton
          @click="addVersion(ogVersionName, newVersionName)"
          style="border: 1px solid; margin-right: 1rem"
          :style="{ borderColor: designStore.secondaryTheme }"
          >Save Version(s)</BButton
        >
      </template>
    </CustomModal>
  </div>
</template>
<style>
.bioButton {
  display: none;
}
@media (max-width: 1200px) {
  .bioButton {
    display: block;
  }
}
</style>
