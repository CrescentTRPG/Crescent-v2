<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { useCharacterStore } from '@/stores/characterStore.ts'

import { useSpellStore } from '@/stores/spellsStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const spellsStore = useSpellStore()
    const { manualSpellgroups } = storeToRefs(spellsStore)

    return {
      designStore,
      modal,
      userStore,
      characterStore,
      manualSpellgroups
    }
  }
}
</script>

<template>
  <div style="width: 100%; height: 100%">
    <div
      style="
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        height: 100%;
        padding-right: 8rem;
        justify-content: space-evenly;
        border-bottom: 2px solid;
      "
      :style="{
        background: designStore.primaryTheme,
        borderColor: designStore.secondaryTheme,
        color: designStore.primaryText
      }"
    >
      <div class="actionItems">
        <v-icon name="gi-divided-square" class="pictographic"></v-icon>

        <div class="fullActionNames">Core</div>
        <div class="fullerActionNames">Core Action</div>

        :
        <div class="iconsCont">
          <div>
            <v-icon
              v-if="characterStore.plannedCoreAction.ability.name"
              :name="
                manualSpellgroups[characterStore.plannedCoreAction.ability.spellgroup]?.groupIcon ||
                characterStore.plannedCoreAction.ability.groupIcon ||
                'gi-uncertainty'
              "
            ></v-icon>

            <i class="bi bi-x-lg" v-if="!characterStore.plannedCoreAction.ability.name"></i>
          </div>
        </div>
      </div>
      <div class="actionItems">
        <v-icon name="gi-azul-flake" class="pictographic"></v-icon>
        <div class="fullActionNames">Swift</div>
        <div class="fullerActionNames">Swift Action</div>

        :
        <div class="iconsCont">
          <v-icon
            v-if="characterStore.plannedSwiftAction.ability.name"
            :name="
              manualSpellgroups[characterStore.plannedSwiftAction.ability.spellgroup]?.groupIcon ||
              characterStore.plannedSwiftAction.ability.groupIcon
            "
          ></v-icon>
          <i class="bi bi-x-lg" v-if="!characterStore.plannedSwiftAction.ability.name"></i>
        </div>
      </div>
      <div class="actionItems">
        <v-icon name="gi-bowen-knot" class="pictographic"></v-icon>

        <div class="fullActionNames">Move</div>
        <div class="fullerActionNames">Movement Action</div>

        :
        <div class="iconsCont">
          <v-icon
            v-if="characterStore.plannedMovementAction.ability"
            :name="
              manualSpellgroups[characterStore.plannedMovementAction.ability.spellgroup]
                ?.groupIcon || characterStore.plannedMovementAction.ability.groupIcon
            "
          ></v-icon>
          <i class="bi bi-x-lg" v-if="!characterStore.plannedMovementAction.ability.name"></i>
        </div>
      </div>
      <div class="actionItems">
        <v-icon name="gi-radial-balance" class="pictographic"></v-icon>

        <div class="fullActionNames">Reaction</div>
        <div class="fullerActionNames">Reaction</div>
        :

        <div class="iconsCont">
          <v-icon
            v-if="characterStore.plannedReaction.ability"
            :name="
              manualSpellgroups[characterStore.plannedReaction.ability.spellgroup]?.groupIcon ||
              characterStore.plannedReaction.ability.groupIcon
            "
          ></v-icon>
          <i class="bi bi-x-lg" v-if="!characterStore.plannedReaction.ability.name"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.actionItems {
  align-items: center;
  display: flex;
}
.iconsCont {
  align-items: cente border;
  display: block;
  margin-left: 0.5rem;
}
.fullActionNames {
  text-align: center;

  display: none;
}
.fullerActionNames {
  text-align: center;
  display: block;
}
.pictographic {
  display: none;
}

.iconNames {
  display: block;
}
@media (max-width: 900px) {
  .fullActionNames {
    display: block;
  }
  .fullerActionNames {
    display: none;
  }
}
@media (max-width: 500px) {
  .fullActionNames {
    display: none;
  }
  .pictographic {
    display: block;
  }
}
</style>
