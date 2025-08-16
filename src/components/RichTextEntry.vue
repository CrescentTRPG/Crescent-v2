<script lang="ts">
import { ref, watch } from 'vue'
import { useDesignStore } from '../stores/designStore'
import { useAdventureStore } from '@/stores/adventureStore'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter'
import IconPicker from './IconPicker.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'

export default {
  props: ['sendUpdates', 'formVal'],
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()
    const adventureStore = useAdventureStore()
    const form = ref(props.formVal)
    function lightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
    watch(form, (newForm, oldForm) => {
      props.sendUpdates(newForm)
    })
    const icon = ref('gi-stars-stack')
    function addIcon() {
      let selection = getSelection()
      let startPos = form.value.indexOf(
        selection?.anchorNode?.firstChild?.firstChild?.textContent || ''
      )
      let newForm =
        form.value.substring(0, startPos) +
        '<v-icon name="' +
        icon.value +
        '">' +
        '</v-icon>' +
        form.value.substring(startPos)
      form.value = newForm
    }

    const modules = [
      {
        name: 'blotFormatter',
        module: BlotFormatter,
        options: {}
      }
    ]
    return {
      designStore,
      modal,
      adventureStore,
      props,
      form,
      lightenDarkenColor,
      modules,
      icon,
      addIcon
    }
  },
  components: { QuillEditor }
}
</script>

<template>
  <div
    class="quill-override-var"
    style="height: 100%"
    :style="{
      fontFamily: designStore.font,
      background: designStore.primaryTheme,
      '--toolbar-stroke': designStore.primaryText,
      '--toolbar-picker-stroke': designStore.inputText,
      '--alarms': designStore.alertTheme,
      '--input-backing': designStore.inputBacking,
      '--input-backing-highlight': lightenDarkenColor(designStore.inputBacking, 20),
      '--primary-highlight': lightenDarkenColor(designStore.primaryTheme, 20),
      '--primary-backing': designStore.primaryTheme
    }"
  >
    <QuillEditor
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        fill: designStore.alertTheme
      }"
      :options="{
        placeholder: 'jot some notes...',
        theme: 'snow'
      }"
      toolbar="full"
      :modules="modules"
      v-model:content="form"
      contentType="html"
    ></QuillEditor>
  </div>
</template>

<style>
.quill-override-var {
  --input-backing: white;
  --primary-backing: white;
  --input-backing-highlight: white;
  --primary-highlight: black;
  --toolbar-picker-stroke: black;
  --toolbar-stroke: white;
  --alarms: pink;
}
.ql-bubble,
.ql-picker-label,
.ql-stroke,
.ql-snow,
.ql-fill {
  stroke: var(--toolbar-stroke) !important;
  color: var(--toolbar-stroke) !important;
  fill: var(--primary-backing) !important;
}
.ql-editor {
  stroke: var(--toolbar-picker-stroke) !important;
  color: var(--toolbar-picker-stroke) !important;
}

.ql-picker,
.ql-picker-item .ql-stroke {
  stroke: var(--toolbar-picker-stroke) !important;
  color: var(--toolbar-picker-stroke) !important;
  fill: var(--toolbar-picker-stroke) !important;
}

.ql-toolbar button:hover,
.ql-bubble button:hover,
.ql-picker-label:hover,
.ql-snow.ql-toolbar .ql-picker-label.ql-active,
.ql-active,
.ql-active .ql-stroke,
.ql-snow.ql-toolbar button.ql-active,
.ql-clean .ql-active {
  color: var(--alarms) !important;
  stroke: var(--alarms) !important;
  fill: var(--primary-highlight) !important;

  background: var(--primary-highlight) !important;
}

.ql-picker-options {
  background-color: var(--input-backing) !important;
}
.ql-picker-item:hover {
  background-color: var(--input-backing-highlight) !important;
}
.ql-picker-item.ql-selected {
  background-color: var(--primary-highlight) !important;
}
.ql-picker-item.ql-selected,
.ql-picker-item.ql-selected .ql-stroke {
  background-color: var(--input-backing) !important;
  color: var(--alarms) !important;
}
</style>
