<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import BPopover from 'bootstrap-vue-next/src/components/BPopover.vue'
import { ref, watch } from 'vue'

export default {
  props: ['attack', 'weaponAttack', 'rollstring', 'conditionObj', 'modes', 'useMode', 'modeObj'],
  setup(props, context) {
    const designStore = useDesignStore()
    const rollstringLocal = ref(props.rollstring)

    const weaponAttackLocal = ref(props.rollstring)
    const conditionObjLocal = ref(props.conditionObj)
    const modeObjLocal = ref(props.modeObj)
    const modesLocal = ref(props.modeObj)
    const useModeLocal = ref(props.modeObj)

    watch(props, async (props, old) => {
      rollstringLocal.value = props.rollstring ? props.rollstring : ''
      conditionObjLocal.value = props.conditionObj ? props.conditionObj : {}
      modeObjLocal.value = props.modeObj ? props.modeObj : {}
      modesLocal.value = props.modes ? props.modes : ['']
      useModeLocal.value = props.useMode ? props.useMode : ''
    })

    return {
      designStore,
      props,
      context,
      rollstringLocal,
      weaponAttackLocal,
      modeObjLocal,
      conditionObjLocal
    }
  },
  components: { BInputGroupText, BFormInput, BPopover }
}
</script>
<template>
  <div v-if="useMode">
    <div v-for="mode in props.modes" :key="mode">
      <div style="display: flex; flex-grow: 1" v-if="modeObjLocal[mode]">
        <BInputGroupText
          style="border-radius: 0"
          :style="{
            fontFamily: designStore.font,
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
          >{{ attack }} Rollstring ({{ mode }} )</BInputGroupText
        >
        <BFormInput
          v-model="modeObjLocal[mode].rollstring"
          style="border-radius: 0; flex-grow: 1; min-width: 50%"
          :style="{
            fontFamily: designStore.font,
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
        ></BFormInput>
      </div>
      <div v-if="modeObjLocal[mode]?.conditionObj">
        <div
          style="display: flex; width: 100%"
          id="wqawq"
          v-for="skill in Object.values(modeObjLocal[mode].conditionObj) as Array<any>"
          :key="skill"
        >
          <BPopover
            :style="{
              background: designStore.primaryTheme,
              borderColor: designStore.secondaryTheme
            }"
            class="popover"
            :click="true"
            :close-on-hide="true"
            :delay="{ show: 0, hide: 0 }"
            style="width: 20rem; cursor: pointer"
          >
            <template #target
              ><BInputGroupText
                style="border-radius: 0; cursor: pointer"
                :style="{
                  fontFamily: designStore.font,
                  color: designStore.inputText,
                  background: designStore.inputBacking,
                  borderColor: designStore.secondaryTheme
                }"
                >OR</BInputGroupText
              >
            </template>
            <div
              style="padding: 0.5rem; border-radius: 0.25rem"
              :style="{
                background: designStore.inputBacking,
                color: designStore.inputText
              }"
            >
              {{ skill.condition }}
            </div>
          </BPopover>
          <BFormInput
            style="border-radius: 0"
            :style="{
              fontFamily: designStore.font,
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
            v-model="skill.alternateRollstring"
          ></BFormInput>
        </div>
      </div>
    </div>
  </div>
  <div v-else style="display: flex; flex-grow: 1">
    <BInputGroupText
      style="border-radius: 0"
      :style="{
        fontFamily: designStore.font,
        color: designStore.inputText,
        background: designStore.inputBacking,
        borderColor: designStore.secondaryTheme
      }"
      >{{ attack }} Rollstring
    </BInputGroupText>
    <BFormInput
      v-model="rollstringLocal"
      style="border-radius: 0; flex-grow: 1"
      :style="{
        fontFamily: designStore.font,
        color: designStore.inputText,
        background: designStore.inputBacking,
        borderColor: designStore.secondaryTheme
      }"
    ></BFormInput>
    <div v-if="conditionObjLocal">
      <div
        style="display: flex; width: 100%"
        id="wqawq"
        v-for="skill in Object.values(conditionObjLocal) as Array<any>"
        :key="skill"
      >
        <BPopover
          :style="{
            background: designStore.primaryTheme,
            borderColor: designStore.secondaryTheme
          }"
          class="popover"
          :click="true"
          :close-on-hide="true"
          :delay="{ show: 0, hide: 0 }"
          style="width: 20rem; cursor: pointer"
        >
          <template #target
            ><BInputGroupText
              style="border-radius: 0; cursor: pointer"
              :style="{
                fontFamily: designStore.font,
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              >OR</BInputGroupText
            >
          </template>
          <div
            style="padding: 0.5rem; border-radius: 0.25rem"
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText
            }"
          >
            {{ skill.condition }}
          </div>
        </BPopover>
        <BFormInput
          style="border-radius: 0"
          :style="{
            fontFamily: designStore.font,
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
          v-model="skill.alternateRollstring"
        ></BFormInput>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
