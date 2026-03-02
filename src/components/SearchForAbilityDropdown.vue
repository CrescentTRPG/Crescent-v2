<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { useMartialPerksStore } from '@/stores/martialPerksStore.ts'
import { useSpellStore } from '@/stores/spellsStore.ts'
import { computed, ref } from 'vue'
import SearchableDropdown from './SearchableDropdown.vue'

export default {
  emits: ['ability'],
  setup(props, context) {
    const designStore = useDesignStore()
    const spellStore = useSpellStore()
    const martialPerksStore = useMartialPerksStore()
    const showMessage = ref(true)
    const value = ''
    const spells = computed(() => {
      let ret: Array<string> = []
      const keys = Object.keys(spellStore.manualSpellgroups)
      keys.forEach((key) => {
        let subKeys = Object.keys(spellStore.manualSpellgroups[key].spells)
        subKeys.forEach((subKey) => {
          ret.push('Spellgroup: ' + key + ': ' + subKey)
        })
      })
      return ret
    })
    const perks = computed(() => {
      let ret: Array<string> = []
      const keys = Object.keys(martialPerksStore.manualMartialPerks)
      keys.forEach((key) => {
        ret.push('Perk: ' + key)
      })
      return ret
    })
    function getMedallion(group: string) {
      switch (group) {
        case 'Offensive Perks':
          return 'gi-swords-power'
        case 'Defensive Perks':
          return 'gi-heavy-helm'
        case 'Utility Perks':
          return 'gi-gear-hammer'
        case 'Supportive Perks':
          return 'gi-heart-shield'
      }
    }
    function selectAbility(ability: string) {
      const parts = ability.split(': ')
      const name = parts[parts.length - 1]
      const group = parts[0]
      if (group === 'Perk') {
        context.emit('ability', {
          ...martialPerksStore.manualMartialPerks[name],
          groupIcon: getMedallion(martialPerksStore.manualMartialPerks[name].perkGroup)
        })
      } else if (group === 'Spellgroup') {
        context.emit('ability', {
          ...spellStore.manualSpellgroups[parts[1]].spells[name],
          groupIcon: spellStore.manualSpellgroups[parts[1]].groupIcon
        })
      } else {
        alert('Please Select Ability From Dropdown')
      }
    }
    const abilities = perks.value.concat(spells.value)
    return {
      designStore,
      value,
      props,
      abilities,
      selectAbility,
      showMessage
    }
  },
  components: {
    SearchableDropdown
  }
}
</script>
<template>
  <div style="display: flex; flex-direction: row; width: 100%" @click="showMessage = false">
    <div
      style="
        position: absolute;
        z-index: 10;
        margin-top: 0.5rem;
        margin-left: 0.5rem;
        pointer-events: none;
      "
      :style="{ color: designStore.inputText }"
      v-if="showMessage"
    >
      Search for Ability...
    </div>
    <SearchableDropdown
      :options="abilities"
      @select="(selection) => selectAbility(selection)"
      borders="left"
    ></SearchableDropdown>
  </div>
</template>
<style>
.menu {
  width: 100%;
  position: absolute;
  z-index: 10;
  overflow-y: scroll;
  max-height: 12.75rem;
  padding: 0.5rem;
  border: 1px solid;
}
.menuOption {
  width: inherit;
  cursor: pointer;
}
.menuOption:hover {
  --hover-bg: blue;
  --hover-text: white cursor: pointer;
  background: var(--hover-bg);
  color: var(--hover-text);
}
</style>
