<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import { BFormInput, BFormRadio, BInputGroup, BInputGroupText } from 'bootstrap-vue-next'
import IconPicker from '@/components/IconPicker.vue'
export default {
  props: ['trait'],
  emits: ['stagedTrait'],
  setup(props, context) {
    const designStore = useDesignStore()
    const tab = ref('corestats')
    const number = ref(1)
    const emitTrait = (traitType: string) => {
      switch (traitType) {
        case 'number':
          context.emit('stagedTrait', {
            ...props.trait,
            number: number.value,
            description: traitDescription.value
          })
          break
        case 'nestedNumber':
          context.emit('stagedTrait', {
            ...selectedNestedTrait.value,
            number: number.value,
            description: selectedTraitDescription.value
          })
          break
        case 'nested':
          context.emit('stagedTrait', { ...selectedNestedTrait.value })
          break
      }
    }

    const traitDescription: ComputedRef<string> = computed((): string => {
      return props.trait.nested ? '' : props.trait?.description.replaceAll('*NUM*', number.value)
    })
    const nestedTraits: ComputedRef<Array<any>> = computed((): Array<any> => {
      if (props.trait.nested) {
        let ret: Array<any> = Object.values(props.trait).filter((item: any) => item.name)
        return ret
      } else return []
    })

    const selectedNestedTrait = ref({
      description: "Select a trait to read it's description"
    })
    const selectedTraitDescription: ComputedRef<string> = computed((): string => {
      return selectedNestedTrait.value.description.replace('*NUM*', number.value + '')
    })
    return {
      designStore,
      tab,
      props,
      traitDescription,
      number,
      nestedTraits,
      selectedNestedTrait,
      selectedTraitDescription,
      emitTrait
    }
  },
  watch: {
    selectedNestedTrait() {
      if (this.selectedNestedTrait['number'] === 0) {
        this.emitTrait('nestedNumber')
      } else {
        this.emitTrait('nested')
      }
    }
  },
  components: { BInputGroup, BFormInput, BInputGroupText, BFormRadio }
}
</script>
<template>
  <div>
    <div v-if="props.trait.nested" style="display: flex; flex-direction: column">
      <div
        class="nested-grid"
        :style="{
          '--bs-form-check-bg': designStore.inputBacking,
          borderColor: designStore.primaryText,
          '--input-bg': designStore.alertTheme
        }"
      >
        <BFormRadio
          style="margin: 0.25rem"
          v-model="selectedNestedTrait"
          v-for="o in nestedTraits"
          :value="o"
          :key="o.name"
        >
          {{
            o.name.includes('Bonus') ? o.name.split(' ')[1] + ' ' + o.name.split(' ')[2] : o.name
          }}
        </BFormRadio>
      </div>

      <div
        v-if="nestedTraits[0].number == 0"
        style="margin-top: 1rem; margin-left: 0.5rem; margin-right: 0.5rem"
      >
        <BInputGroup
          style="border: 3px solid; border-radius: 10px; margin-bottom: 1rem"
          :style="{ borderColor: designStore.secondaryTheme, background: designStore.primaryTheme }"
        >
          <BInputGroupText
            style="width: 7rem; border: none"
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            >Number</BInputGroupText
          >
          <BFormInput
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme
            }"
            style="border: none; border-left: 1px solid"
            type="number"
            min="0"
            v-model="number"
            @change="emitTrait('nestedNumber')"
          ></BFormInput>
        </BInputGroup>
        {{ traitDescription }}
      </div>

      <div
        style="
          height: fit-content;
          margin: 0.5rem;
          padding: 0.5rem;
          border: 2px solid;
          border-radius: 10px;
        "
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
      >
        <div style="margin-bottom: 0.5rem; margin-left: 2rem">Description</div>
        <span
          class="line"
          :style="{ borderColor: designStore.secondaryTheme, color: designStore.secondaryTheme }"
        >
          <v-icon name="gi-abstract-119" style="position: relative; left: 0.25rem"></v-icon>
          <hr :style="{ borderColor: designStore.secondaryTheme }" />
          <v-icon name="gi-abstract-119" style="position: relative; right: 0.25rem"></v-icon>
        </span>
        <div style="display: flex; margin-left: 2rem; margin-right: 2rem">
          {{ selectedTraitDescription }}
        </div>
      </div>
    </div>
    <div v-if="!props.trait.nested">
      <div v-if="props.trait.number == 0">
        <BInputGroup
          style="border: 3px solid; border-radius: 10px; margin-bottom: 1rem"
          :style="{ borderColor: designStore.secondaryTheme, background: designStore.primaryTheme }"
        >
          <BInputGroupText
            style="width: 7rem; border: none"
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            >Number</BInputGroupText
          >
          <BFormInput
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme
            }"
            style="border: none; border-left: 1px solid"
            type="number"
            min="0"
            max="10"
            v-model="number"
            @change="emitTrait('number')"
          ></BFormInput>
        </BInputGroup>
        {{ traitDescription }}
      </div>
      <div v-if="props.trait.number != 0">no number</div>
    </div>
  </div>
</template>
<style>
.form-check-input {
  --bs-form-check-bg: inherit;
  color: inherit;
  border-color: inherit;
}
.form-check {
  --bs-form-check-bg: inherit;
  color: inherit;
  background-color: inherit;
  border-color: inherit;
}
.form-check-input:checked {
  --bs-form-check-bg: inherit;
  color: inherit;
  --input-bg: inherit;
  background-color: var(--input-bg);
  border-color: inherit;
  background-image: none;
}
.nested-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
@media (min-width: 1024px) {
  .nested-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 650px) {
  .nested-grid {
    margin-top: -1rem;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
