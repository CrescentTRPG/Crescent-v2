<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { useManualStore } from '@/stores/manualStore.ts'
import { useSpellStore } from '@/stores/spellsStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import BasicInput from '../Character/BasicInput.vue'
import DropdownSelect from '../DropdownSelect.vue'
import TitleMedallion from '../TitleMedallion.vue'

export default {
  setup(props, context) {
    let designStore = useDesignStore()
    let spellsStore = useSpellStore()
    let manualStore = useManualStore()
    const { rollingTables } = storeToRefs(manualStore)
    const rollers = computed(() => {
      return Object.keys(manualStore.rollingTables).concat('random spell')
    })
    const finesses = ref(0)
    const selected = ref('')
    function roll() {
      if (selected.value) {
        if (selected.value === 'random spell') {
          getRandomSpell()
        } else {
          let table = rollingTables.value[selected.value]
          if (table.multiroll) {
            let compositeResult = table.baseString || ''
            let tables: Array<any> = Object.values(table.tables)
            tables.forEach((miniTable) => {
              let result = rollOnTable(miniTable)
              let keyword = '*&' + miniTable.name + '&*'
              compositeResult = compositeResult.replace(keyword, result)
              compositeResult = compositeResult.replace('\\n', '\n').replaceAll('\\n', '\n')
            })
            context.emit('result', compositeResult)
          } else {
            let result = rollOnTable(table)
            context.emit('result', result)
          }
        }
      }
    }

    function getRandomSpell() {
      let spellgroups = Object.keys(spellsStore.manualSpellgroups)
      let num = Math.floor(Math.random() * spellgroups.length)
      let chosenspellgroup = spellgroups[num]
      const chosenRank = Math.ceil(Math.random() * 6) + parseInt(finesses.value + '')

      let results: any = ''

      let possibleSpells = Object.values(
        spellsStore.manualSpellgroups[chosenspellgroup].spells
      ).filter((spell: any) => spell.rank === chosenRank)
      if (possibleSpells.length > 0) {
        results = possibleSpells.reduce((acc: any, val: any) => {
          return acc + val.name + ' - ' + val.rank + ', '
        }, '')
      }

      let resultsFinal = chosenspellgroup + ' ' + chosenRank + ': ' + results
      context.emit('result', resultsFinal.substring(0, resultsFinal.length - 2))
    }

    function rollOnTable(table) {
      console.log(table)
      let num = Object.keys(table).length - 1
      let rolledNum = Math.floor(Math.random() * num)
      let result = table[rolledNum].result
      let subtable = result.indexOf('*&')
      let subtableName = result.substring(result.indexOf('*&') + 2, result.indexOf('&*'))
      if (subtable >= 0) {
        console.log(subtableName, table)
        return (
          result.substring(0, subtable) +
          rollOnTable(table[rolledNum][subtableName]) +
          result.substring(result.indexOf('&*') + 2)
        )
      }
      return result
    }
    return {
      designStore,
      rollers,
      props,
      roll,
      selected,
      finesses
    }
  },
  components: {
    BButton,
    TitleMedallion,
    DropdownSelect,
    BasicInput
  }
}
</script>
<template>
  <div :style="{ fontFamily: designStore.font }">
    <TitleMedallion title="Rolling Tables" :color="designStore.primaryText"></TitleMedallion>

    <div style="display: flex; justify-content: center; flex-direction: column">
      <DropdownSelect
        @selection="(selection) => (selected = selection)"
        :options="rollers"
        :borderless="false"
        label="Rolling Table"
      ></DropdownSelect>
      <BasicInput
        v-if="selected === 'random spell'"
        style="margin-top: 0.5rem"
        label="# Finesses"
        type="number"
        @new-value="(val) => (finesses = val)"
      ></BasicInput>
      <BButton
        class="shaky-btn"
        style="border: 2px solid; width: 60%; padding: 0; padding-top: 0.25rem; align-self: center"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText,
          borderColor: designStore.secondaryTheme,
          '--bs-secondary-color': designStore.inputText
        }"
        @click="roll()"
      >
        <div
          style="display: flex; flex-direction: row; justify-content: center; font-size: large"
          :style="{ color: designStore.secondaryTheme }"
        >
          <div :style="{ color: designStore.primaryText }">Roll!</div>
          <v-icon scale="1.5" name="gi-rolling-dice-cup"></v-icon>
        </div>
      </BButton>
    </div>
  </div>
</template>
<style>
.shaky-btn {
  margin-top: 0.5rem;
  cursor: pointer;
}
.shaky-btn:active {
  animation: shake 0.4s ease-out;
}
.left {
  margin-bottom: 0.25rem;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.right {
  margin-bottom: 0.25rem;
  border-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
@keyframes shake {
  0% {
    transform: skewX(-10deg);
  }

  25% {
    transform: skewX(10deg);
  }

  50% {
    transform: skewX(-10deg);
  }

  75% {
    transform: skewX(10deg);
  }

  100% {
    transform: skewX(-10deg);
  }
}
</style>
