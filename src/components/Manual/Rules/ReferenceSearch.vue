<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import { useDesignStore } from '../../../stores/designStore.ts'

import BackgroundDecor from '@/components/BackgroundDecor.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useManualStore } from '@/stores/manualStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import { close } from 'fs'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import RenderSpecialPage from './Special Reference Pages/RenderSpecialPage.vue'

export default {
  props: ['isCharacter'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const manualStore = useManualStore()
    const { getRules, rulesReference } = storeToRefs(manualStore)
    const designStore = useDesignStore()
    const page = ref('')
    function scrollbarColor() {
      let sec = designStore.secondaryTheme
      let prim = designStore.primaryTheme
      return sec + ' ' + prim
    }

    function getDistance(input: string, key: string) {
      let count = 0
      let inputArr = input.split('')
      let keyArr = input.split('')
      if (input.length < keyArr.length) {
        count += 1
        for (let i = keyArr.length - input.length; i > 0; i--) {
          inputArr.push('*')
        }
      } else {
        inputArr = inputArr.slice(0, keyArr.length)
      }
      let i = 0
      while (i < input.length) {
        if (input[i] != key[i] && input[i] != '*') count++
        i++
      }
      return count
    }
    function getMinTagDistance(input: string, keys: string) {
      let tags = keys.split(':')
      let val = tags.reduce((acc, val) => Math.min(getDistance(input, val), acc), 100)
      return val
    }

    const rulesInPlay = computed(() => {
      let ret = getRules.value
      let sortObj = {}
      if (search.value) {
        ret = ret.filter((rule) => {
          const ruleDist = getDistance(search.value, rule.title.toLowerCase())
          const tagDistance = getMinTagDistance(search.value, rule.tags.toLowerCase())

          if (ruleDist < 3 || tagDistance < 3) {
            sortObj[rule.title] = ruleDist
            return true
          } else {
            return false
          }
        })
        return ret.sort((a, b) => {
          if (sortObj[a.title] < sortObj[b.title]) {
            return -1
          } else if (sortObj[a.title] > sortObj[b.title]) {
            return 1
          } else {
            return 0
          }
        })
      }
      return ret.sort((a, b) => {
        if (a.title < b.title) {
          return -1
        } else if (b.title < a.title) {
          return 1
        } else {
          return 0
        }
      })
    })
    function getBackground(val) {
      if ((page.value === '' && rulesInPlay.value[0].title === val) || page.value === val) {
        return designStore.alertTheme
      }
      return designStore.primaryTheme
    }
    const doc = computed(() => {
      return formatHTML(rulesReference.value[page.value || rulesInPlay.value[0].title].document)
    })
    const ruleRef = computed(() => {
      return rulesReference.value[page.value || rulesInPlay.value[0].title]
    })
    function closeDropdown() {
      document.getElementById('rules')?.classList.add('tagContainer')
      document.getElementById('rules')?.classList.remove('displayItPlease')
    }
    function openDropdown() {
      document.getElementById('rules')?.classList.remove('tagContainer')

      document.getElementById('rules')?.classList.add('displayItPlease')
    }
    function formatHTML(description: string) {
      let sections = description.split('\\n')
      let ret
      if (sections.length === 1) {
        sections = description.split('\n*')
      }

      if (sections.length === 1) {
        sections = description.split('\n')
        if (sections.length === 1) return '<div>' + description + '</div>'
        else {
          ret = '<div style="margin-bottom: .25rem">'
          sections.forEach((s) => {
            if (s === '') {
              ret += '<div style="padding: .5rem"></div>'
            }
            ret += '<div style=" margin-bottom: .25rem;list-style-type:none;">' + s + '</div>'
          })
          ret += '</div>'
        }
      } else {
        let subsections = sections[0].split('\n')
        if (sections.length === 1)
          ret = '<div style="margin-bottom: .25rem">' + sections[0] + '</div>'
        else {
          ret = '<div style="margin-bottom: .25rem">'
          subsections.forEach((s) => {
            if (s === '' || s === ' ') {
              ret += '<div style="padding: .5rem"></div>'
            } else if (s === undefined) {
              ret += 'select'
            } else {
              ret += '<div style=" margin-bottom: .25rem;list-style-type:none;">' + s + '</div>'
            }
          })
          ret += '</div>'
        }
        sections.shift()
        sections.forEach((s) => {
          if (s.length > 3) {
            ret +=
              '<li style="margin-left:.5rem; padding-left: 1rem; margin-bottom: .25rem;list-style-type:none;text-indent: -1rem ;">' +
              '❖ ' +
              s +
              '</li>'
          }
        })
      }
      return ret
    }
    const search = ref('')
    function close() {
      window.setTimeout(closeDropdown, 300)
    }
    function LightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
    const decorScale = computed(() => {
      return window.innerWidth / 650
    })
    return {
      modal,
      userStore,
      props,
      designStore,
      scrollbarColor,
      getRules,
      rulesReference,
      page,
      search,
      formatHTML,
      rulesInPlay,
      getBackground,
      doc,
      openDropdown,
      closeDropdown,
      close,
      LightenDarkenColor,
      decorScale,
      ruleRef
    }
  },
  components: {
    BButton,
    TitleWidget,
    BFormInput,
    TitleMedallion,
    BackgroundDecor,
    RenderSpecialPage
  }
}
</script>

<template>
  <div
    style="height: fit-content"
    :style="{ fontFamily: designStore.font, background: designStore.inputBacking }"
  >
    <title-widget title="Quick Reference"></title-widget>
    <b-form-input
      @focus="openDropdown()"
      @focusout="close()"
      :debounce="400"
      v-model="search"
      placeholder="search..."
      style="border-radius: 0; border-bottom: 2px solid"
      @change="page = ''"
      :style="{
        background: designStore.sidebarBacking,
        color: designStore.sidebarText,
        borderColor: designStore.secondaryTheme
      }"
    ></b-form-input>
    <div style="display: flex; max-height: calc(100vh - 16.5rem)">
      <div id="rules" class="tagContainer" ref="rulesRef" @blur="closeDropdown()">
        <div
          style="
            display: flex;
            flex-direction: column;
            overflow-y: scroll;
            min-width: 14rem;
            width: 15vw;
            height: 100%;
            max-height: calc(100vh - 16.5rem);
          "
          :style="{ scrollbarColor: scrollbarColor(), background: designStore.sidebarBacking }"
        >
          <div v-for="r in rulesInPlay" :key="r.title">
            <b-button
              @click="((page = r.title), closeDropdown())"
              style="width: 98%; margin: 0.25rem; z-index: 6; position: relative"
              :style="{ background: getBackground(r.title), color: designStore.primaryText }"
              >{{ r.title }}</b-button
            >
          </div>
        </div>
      </div>
      <div
        style="flex-grow: 1; display: flex; justify-content: center"
        :style="{ background: designStore.pageBackdrop }"
      >
        <div class="largeDecor" :style="{ background: designStore.pageBackdrop }">
          <BackgroundDecor
            :color="LightenDarkenColor(designStore.pageBackdrop, -20)"
            :scale="decorScale"
            :size="decorScale + 'rem'"
            direction="column"
            justify="space-around"
            :icons="[
              'wi-moon-alt-new',
              'wi-moon-alt-waxing-crescent-2',
              'wi-moon-alt-waxing-crescent-3',
              'wi-moon-alt-waxing-crescent-4',
              'wi-moon-alt-waxing-crescent-5',
              'wi-moon-alt-waxing-crescent-6',
              'wi-moon-alt-first-quarter',
              'wi-moon-alt-waxing-gibbous-1',
              'wi-moon-alt-waxing-gibbous-2',
              'wi-moon-alt-waxing-gibbous-3',
              'wi-moon-alt-waxing-gibbous-4',
              'wi-moon-alt-waxing-gibbous-5',
              'wi-moon-alt-waxing-gibbous-6',
              'wi-moon-alt-full'
            ]"
          ></BackgroundDecor>
        </div>
      </div>
      <div style="display: flex; justify-content: center">
        <div
          :style="{ scrollbarColor: scrollbarColor(), background: designStore.sidebarBacking }"
          style="height: 100%; max-height: calc(100vh - 16.5rem); overflow-y: scroll"
        >
          <div :style="{ background: designStore.inputBacking, color: designStore.inputText }">
            <title-medallion
              :title="rulesReference[page || rulesInPlay[0].title].title"
            ></title-medallion>
            <div v-if="ruleRef.type === 'html'">
              <div
                style="padding: 1rem; max-width: 90rem"
                v-html="doc"
                :style="{ background: designStore.inputBacking }"
              ></div>
            </div>
            <div v-if="ruleRef.type === 'special'">
              <RenderSpecialPage :title="ruleRef.title"></RenderSpecialPage>
            </div>
          </div>
        </div>
      </div>
      <div
        style="flex-grow: 1; display: flex; justify-content: center"
        :style="{ background: designStore.pageBackdrop }"
      >
        <div class="largeDecor" :style="{ background: designStore.pageBackdrop }">
          <BackgroundDecor
            :color="LightenDarkenColor(designStore.pageBackdrop, -20)"
            :scale="decorScale"
            :size="decorScale + 'rem'"
            direction="column"
            justify="space-around"
            :icons="[
              'wi-moon-alt-new',
              'wi-moon-alt-waxing-crescent-2',
              'wi-moon-alt-waxing-crescent-3',
              'wi-moon-alt-waxing-crescent-4',
              'wi-moon-alt-waxing-crescent-5',
              'wi-moon-alt-waxing-crescent-6',
              'wi-moon-alt-first-quarter',
              'wi-moon-alt-waxing-gibbous-1',
              'wi-moon-alt-waxing-gibbous-2',
              'wi-moon-alt-waxing-gibbous-3',
              'wi-moon-alt-waxing-gibbous-4',
              'wi-moon-alt-waxing-gibbous-5',
              'wi-moon-alt-waxing-gibbous-6',
              'wi-moon-alt-full'
            ]"
          ></BackgroundDecor>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.tag {
  width: 12rem;
  margin: 0.25rem;
}
.tagContainer {
  display: block;
}

@media (max-width: 800px) {
  .tagContainer {
    position: absolute;
    z-index: 5;
    display: none;
  }
  .displayItPlease {
    display: block;
    position: absolute;
    z-index: 5;
  }
}
.largeDecor {
  display: none;
}
@media (min-width: 2000px) {
  .largeDecor {
    display: block;
  }
}
</style>
