<script lang="ts">
import { computed, ComputedRef, ref, useTemplateRef } from 'vue'
import { useDesignStore } from '../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'
import BFormFile from 'bootstrap-vue-next/src/components/BFormFile/BFormFile.vue'

export default {
  emits: ['newImage'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const file = ref('')
    const fileObj = useTemplateRef('my-input')
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()

    function getBase64(image) {
      console.log(typeof image)
      let val = fileObj.value
      var reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onload = function () {
        console.log(reader.result)
        context.emit('newImage', reader.result)
      }
      reader.onerror = function (error) {
        console.log('Error: ', error)
        return 'error'
      }
    }
    function onFileSelected(event) {
      if (event.target.files[0].size > 1048576) {
        alert('File Size is too big!')
      } else {
        getBase64(event.target.files[0])
      }
    }
    return {
      designStore,
      modal,
      userStore,
      characterStore,
      file,
      onFileSelected,
      fileObj
    }
  },
  components: { BFormFile },
  methods: {}
}
</script>

<template>
  <div style="width: 100%">
    <input @change="onFileSelected" type="file" />
  </div>
</template>

<style scoped></style>
