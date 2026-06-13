<script lang="ts">
import TitleMedallion from '@/components/TitleMedallion.vue'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import _ from 'lodash'

import { useEquipmentStore } from '@/stores/equipmentStore.ts'
import { storeToRefs } from 'pinia'
import SecondaryHandheld from '@/components/Character/Equipment/SecondaryHandheld.vue'
import PrimaryHandheld from '@/components/Character/Equipment/PrimaryHandheld.vue'
import EquippedArmor from '@/components/Character/Equipment/EquippedArmor.vue'

export default {
  props: ['currentStatBlock', 'updateTemp', 'addItem', 'removeItem'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    function updateWornArmor(newWorn) {
      let temp = _.cloneDeep(props.currentStatBlock)
      temp.equipment.wornArmor = newWorn
      props.updateTemp(temp)
    }
    function updatePrimary(newPrimary) {
      let temp = _.cloneDeep(props.currentStatBlock)
      temp.equipment.primaryHand = newPrimary
      props.updateTemp(temp)
    }

    function updateSecondary(newSecondary) {
      let temp = _.cloneDeep(props.currentStatBlock)
      temp.equipment.secondaryHand = newSecondary
      props.updateTemp(temp)
    }

    return {
      designStore,
      modal,
      userStore,
      characterStore,
      props,
      updateWornArmor,
      updatePrimary,
      updateSecondary
    }
  },
  components: { EquippedArmor, PrimaryHandheld, SecondaryHandheld, TitleMedallion }
}
</script>

<template>
  <div
    class="banner"
    style="border-top: 2px solid"
    :style="{ background: designStore.sidebarBacking, color: designStore.secondaryTheme }"
  >
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 100%;
        padding-top: 1rem;
      "
    >
      <TitleMedallion title="Equipped Items"></TitleMedallion>
      <EquippedArmor
        :update-worn-armor="updateWornArmor"
        :equipment="props.currentStatBlock.equipment"
        :remove-item="props.removeItem"
        :add-item="props.addItem"
        class="bannerItem"
      ></EquippedArmor>
      <PrimaryHandheld
        :update-primary="updatePrimary"
        :equipment="props.currentStatBlock.equipment"
        :remove-item="props.removeItem"
        :add-item="props.addItem"
        class="bannerItem"
      ></PrimaryHandheld>
      <SecondaryHandheld
        :update-secondary="updateSecondary"
        :equipment="props.currentStatBlock.equipment"
        :remove-item="props.removeItem"
        :add-item="props.addItem"
        class="bannerItem"
      >
      </SecondaryHandheld>
    </div>
  </div>
  <div :style="{ color: designStore.secondaryTheme }">
    <div class="banner-emblem-bi" v-if="designStore.charIcon.substring(0, 2) === 'bi'">
      <i :class="designStore.charIcon"></i>
    </div>
    <div class="banner-emblem-gi" v-if="designStore.charIcon.substring(0, 2) === 'gi'">
      <v-icon scale="3" :name="designStore.charIcon"></v-icon>
    </div>
  </div>
  <div class="arrow-down" :style="{ borderTopColor: designStore.sidebarBacking }"></div>
  <div
    class="banner-extension"
    :style="{ background: designStore.secondaryTheme, borderColor: designStore.secondaryTheme }"
  ></div>
  <div
    class="arrow-down-secondary"
    style="z-index: 2; position: relative"
    :style="{ borderTopColor: designStore.secondaryTheme }"
  ></div>
</template>

<style scoped>
.banner-emblem-gi {
  position: absolute;
  z-index: 5;
  left: 5.25rem;
  margin-top: -0.5rem;
}
.banner-emblem-bi {
  font-size: 2.5rem;
  position: absolute;
  z-index: 5;
  left: 5.75rem;
  display: flex;
  margin-top: -0.5rem;
}
.banner {
  border-left: 3px solid;
  border-right: 3px solid;
  width: 13.75rem;
  box-sizing: border-box;
}
.banner-extension {
  border-left: 3px solid;
  border-right: 3px solid;
  width: 13.75rem;
  padding: 0.5rem;
  box-sizing: border-box;
  z-index: 2;
  position: relative;
  height: 1rem;
}
.arrow-down {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 6.7rem solid transparent;
  border-right: 6.7rem solid transparent;
  z-index: 4;
  border-top: 4rem solid;
  margin-left: 3px;
}
.arrow-down-secondary {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 6.875rem solid transparent;
  border-right: 6.875rem solid transparent;
  z-index: 4;
  border-top: 4rem solid;
}
.bannerItem {
  cursor: pointer;
  padding-left: 0.25rem;
  margin-top: 0.5rem;
}
@media (max-width: 600px) {
  .banner-emblem-gi {
    left: 1rem;
  }
  .banner-emblem-bi {
    left: 2.8rem;
    margin-top: -1.5rem;
  }
  .bannerItem {
    margin-top: -1rem;
    margin-bottom: -3rem;
    margin-left: -2.75rem;
    transform: scale(0.65);
  }
  .banner {
    width: 8rem;
  }
  .banner-extension {
    width: 8rem;
    height: 1rem;
  }
  .arrow-down {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 3.85rem solid transparent;
    border-right: 3.85rem solid transparent;
    z-index: 4;
    border-top: 3.85rem solid;
  }
  .arrow-down-secondary {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 4rem solid transparent;
    border-right: 4rem solid transparent;
    z-index: 4;
    border-top: 4rem solid;
  }
}
</style>
