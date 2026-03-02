<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore.ts'
import { useTraitsStore } from '@/stores/traitsStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import _ from 'lodash'
import { Ref, ref } from 'vue'
import { useFaunaStore } from '@/stores/faunaStore.ts'
import { storeToRefs } from 'pinia'
import IconPicker from '@/components/IconPicker.vue'
import BasicInput from '../../BasicInput.vue'
import RibbonTitle from '@/components/RibbonTitle.vue'
import CustomModal from '@/components/CustomModal.vue'
import SelectBaseCreature from './SelectBaseCreature.vue'
import CreatureDisplay from './CreatureDisplay.vue'

export interface creature {
  Name: string
  Description: string
  'HP Changes': string
  Movement: string
  Attacks: string
  Traits: Array<string>
  actionCost: string
  'Armor Changes': string
  groupIcon: string
  rank: number
  Adaptations: Array<string> | undefined
  isCustom: boolean
  baseCreature?: string
  baseCreatureIcon?: string
}
export default {
  props: ['ogCreature', 'mode'],
  setup(props, context) {
    const designStore = useDesignStore()
    const faunaStore = useFaunaStore()
    const { manualCreatures, creatures } = storeToRefs(faunaStore)
    const martialSkillsStore = useMartialSkillsStore()
    const traitsStore = useTraitsStore()
    const stagedCreature: Ref<creature> = ref(_.cloneDeep(props.ogCreature))
    const nameModal = ref(false)
    const typeModal = ref(false)
    const baseCreature = ref('')
    function updateCreature(newCreature) {
      stagedCreature.value = newCreature
    }
    function goBack() {
      context.emit('return')
    }

    function save() {
      if (
        stagedCreature.value.Name === '' ||
        manualCreatures.value[stagedCreature.value.Name] ||
        creatures.value[stagedCreature.value.Name]
      ) {
        alert('Creature needs a unique Name!')
      } else if (baseCreature.value == '') {
        alert('Creature needs a base!')
      } else {
        faunaStore.addCreature({ ...stagedCreature.value, isCustom: true })
        context.emit('added')
      }
    }

    const oneToFive = [
      { value: 1, text: '1' },
      { value: 2, text: '2' },
      { value: 3, text: '3' },
      { value: 4, text: '4' },
      { value: 5, text: '5' }
    ]
    function lightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }

    function updateName(val) {
      stagedCreature.value.Name = val
      nameModal.value = false
    }
    function updateIcon(val) {
      stagedCreature.value.groupIcon = val
    }

    return {
      designStore,
      updateCreature,
      stagedCreature,
      lightenDarkenColor,
      oneToFive,
      nameModal,
      updateName,
      typeModal,
      goBack,
      save,
      updateIcon,
      baseCreature,
      props
    }
  },
  components: {
    // BFormInput,
    // IconPicker,
    // BButton,
    // BFormTextarea,
    IconPicker,
    BasicInput,
    BButton,
    RibbonTitle,
    CustomModal,
    SelectBaseCreature,
    CreatureDisplay
  }
}
</script>
<template>
  <div style="display: flex; flex-direction: column" id="BuildCreature">
    <div
      style="display: flex; justify-content: space-between; z-index: 3"
      :style="{ '--fillColor': designStore.sidebarBacking }"
      class="partialColoredBack"
    >
      <div style="display: flex; flex-wrap: wrap">
        <RibbonTitle
          @click="nameModal = true"
          style="
            height: fit-content;
            align-self: end;
            margin: 1rem;
            margin-right: 0;
            z-index: 5;
            cursor: pointer;
          "
          :background="designStore.primaryTheme"
          :textColor="designStore.primaryText"
          :title="!stagedCreature.Name ? 'Creature Name Here' : stagedCreature.Name"
        ></RibbonTitle>

        <CustomModal
          :showModal="nameModal"
          title="Edit Transformation Name"
          @close="nameModal = false"
        >
          <template v-slot:body>
            <div>
              <BasicInput
                @newValue="(val) => updateName(val)"
                :label="'name'"
                :value="stagedCreature.Name"
              ></BasicInput>
            </div>
          </template>
        </CustomModal>
      </div>

      <div style="display: flex; z-index: 4" class="scaleIcons">
        <SelectBaseCreature
          @baseSelected="(base) => (baseCreature = base)"
          :mode="props.mode"
          :base="stagedCreature"
          :updateCreature="updateCreature"
        ></SelectBaseCreature>

        <div
          style="display: flex; flex-direction: column; margin: 0.5rem; border-radius: 0.5rem"
          :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
        >
          <div style="text-align: center">Icon</div>
          <IconPicker
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            style="align-self: center; border-radius: 10px; margin: 0.5rem; margin-top: 0"
            :currentIcon="stagedCreature.groupIcon"
            @selectedIcon="(icon) => updateIcon(icon)"
            orientation="left"
          ></IconPicker>
        </div>
      </div>
    </div>
    <CreatureDisplay
      style="padding: 1rem"
      :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
      :mode="props.mode"
      :editable="true"
      :creature="stagedCreature"
      :updateCreature="updateCreature"
    ></CreatureDisplay>
    <div
      style="
        display: flex;
        justify-content: flex-end;
        border-top: 2px solid;
        position: absolute;
        left: 0;
        width: calc(100vw - 1.05rem);
        bottom: 0;
        z-index: 5;
      "
      :style="{
        background: designStore.primaryTheme,
        color: designStore.sidebarText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div style="display: flex; justify-content: flex-end; margin: 0.2rem">
        <BButton
          class="footerButtons"
          style="margin-left: 0.5rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="save()"
        >
          <i class="bi bi-floppy"></i>
          <div style="margin-left: 0.5rem" class="discardText">Save</div>
          <div class="goBackText">and Go Back</div>
        </BButton>
        <BButton
          class="footerButtons"
          style="margin-left: 0.5rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="goBack()"
        >
          <i class="bi bi-arrow-90deg-left"></i>
          <div class="discardText">Return</div>
          <div class="goBackText"></div>
        </BButton>
      </div>
    </div>
  </div>
</template>
<style>
.partialColoredBack {
  background-image: linear-gradient(
    to top,
    var(--fillColor) 70%,
    transparent 70%,
    transparent 100%
  );
}
.arrangeMidsection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: -22rem;
}
@media (max-width: 700px) {
  .arrangeMidsection {
    display: flex;
    flex-direction: column;
    margin-bottom: -22rem;
  }
  .scaleIcons {
    transform: scale(0.8);
    z-index: 5;
  }
  @media (max-width: 400px) {
    .scaleIcons {
      flex-wrap: wrap;
      transform: scale(0.75);
      margin-bottom: -1rem;
      z-index: 5;
    }
  }
}
.fancySelect {
  cursor: pointer;
  border-width: 2px;
  margin: 0rem;
  margin-bottom: 0.5rem;
  flex-grow: 1;
}

.bonuses {
  clip-path: stroke-box
    polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%);
  padding: 1rem;
  margin: 1rem;
  border: 2px solid;
  z-index: 3;
  position: relative;
}
</style>
