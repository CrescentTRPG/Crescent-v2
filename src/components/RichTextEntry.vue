<script lang="ts">
import { ref, watch, onMounted, Ref } from 'vue'
import { useDesignStore } from '../stores/designStore.ts'
import { useAdventureStore } from '@/stores/adventureStore.ts'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

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
    watch(props, (newForm, oldForm) => {
      form.value = props.formVal
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

    const modules: Ref<any> = ref([
      // blotFormatter will be added dynamically on mount to avoid
      // CommonJS/interop circular import issues in production builds.
    ])

    onMounted(async () => {
      let BlotFormatterModule: any = null
      try {
        const m = await import('quill-blot-formatter')
        BlotFormatterModule = m && (m.default || m)
      } catch (e) {
        // fallback to UMD bundle which exposes `QuillBlotFormatter` on window/globalThis
        try {
          await import('quill-blot-formatter/dist/quill-blot-formatter.min.js')
          // prefer `.default` if present
          BlotFormatterModule =
            globalThis.QuillBlotFormatter &&
            (globalThis.QuillBlotFormatter.default || globalThis.QuillBlotFormatter)
        } catch (err) {
          /* ignore - BlotFormatter will remain unavailable */
        }
      }

      if (BlotFormatterModule) {
        modules.value.push({ name: 'blotFormatter', module: BlotFormatterModule, options: {} })
      }
    })
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
    :style="{
      fontFamily: designStore.font,
      background: designStore.primaryTheme,
      '--toolbar-stroke': designStore.primaryText,
      '--toolbar-picker-stroke': designStore.inputText,
      '--alarms': designStore.alertTheme,
      '--input-backing': designStore.inputBacking,
      '--input-backing-highlight': lightenDarkenColor(designStore.inputBacking, 20),
      '--primary-highlight': lightenDarkenColor(designStore.primaryTheme, 20),
      '--primary-backing': designStore.primaryTheme,
      '--border': designStore.secondaryTheme
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
.ql-container {
  border: 1px solid var(--border) !important;
}
.ql-toolbar {
  border: 1px solid var(--border) !important;
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
