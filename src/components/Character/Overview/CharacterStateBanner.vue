<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useCharacterStore } from '@/stores/characterStore'
import { useUserStore } from '@/stores/userStore'
import HpWidget from './HpWidget.vue'
import ManaWidget from './ManaWidget.vue'
import ArmorWidget from './ArmorWidget.vue'
import MPWidget from './MPWidget.vue'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    return {
      designStore,
      modal,
      userStore,
      characterStore
    }
  },
  components: {
    HpWidget,
    ManaWidget,
    ArmorWidget,
    MPWidget
  }
}
</script>

<template>
  <div
    class="banner"
    style=""
    :style="{ background: designStore.sidebarBacking, color: designStore.secondaryTheme }"
  >
    <span
      style="display: flex; margin-bottom: -1.5rem"
      :style="{ borderColor: designStore.secondaryTheme, color: designStore.secondaryTheme }"
    >
      <v-icon name="gi-abstract-119" style="position: relative; left: 0.25rem"></v-icon>
      <hr :style="{ borderColor: designStore.secondaryTheme }" />
      <v-icon name="gi-abstract-119" style="position: relative; right: 0.25rem"></v-icon>
    </span>
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 100%;
        padding-top: 1rem;
      "
    >
      <HpWidget class="bannerItem"></HpWidget>
      <ManaWidget class="bannerItem"></ManaWidget>
      <ArmorWidget class="bannerItem"></ArmorWidget>
      <MPWidget class="bannerItem" style="margin-left: 0.5rem"></MPWidget>
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
