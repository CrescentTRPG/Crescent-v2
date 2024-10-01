<script lang="ts">
import { BButton, BInputGroup, BFormSelect, BInputGroupText } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '@/stores/designStore'
import CustomModal from '@/components/CustomModal.vue'
import { useMartialPerksStore } from '@/stores/martialPerksStore'
import { storeToRefs } from 'pinia'

export default {
  setup(context) {
    const designStore = useDesignStore()
    const modal = ref(false)
    const currentModal = ref(0)
    const martialPerksStore = useMartialPerksStore()
    const { perkGain } = storeToRefs(martialPerksStore)
    const optionsI = ref('')
    const optionsII = ref('')
    const optionsIII = ref('')
    const optionsIV = ref('')
    const optionsV = ref('')
    return {
      perkGain,
      designStore,
      modal,
      currentModal,
      martialPerksStore,
      optionsI,
      optionsII,
      optionsIII,
      optionsIV,
      optionsV
    }
  },
  computed: {
    gainedHealth() {
      let ret = 0
      if (this.perkGain[0] == 'hitpoints') {
        ret += 3
      }
      if (this.perkGain[1] == 'hitpoints') {
        ret += 6
      }
      if (this.perkGain[2] == 'hitpoints') {
        ret += 9
      }
      if (this.perkGain[3] == 'hitpoints') {
        ret += 12
      }
      if (this.perkGain[4] == 'hitpoints') {
        ret += 15
      }
      return ret
    },
    gainedMovespeed() {
      let ret = 0
      if (this.perkGain[0] == 'movespeed') {
        ret += 2
      }
      if (this.perkGain[1] == 'movespeed') {
        ret += 4
      }
      if (this.perkGain[2] == 'movespeed') {
        ret += 6
      }
      if (this.perkGain[3] == 'movespeed') {
        ret += 8
      }
      if (this.perkGain[4] == 'movespeed') {
        ret += 10
      }
      return ret
    },
    entitledGain() {
      let ret = 0
      Object.values(this.martialPerksStore.martialPerks).forEach((perk: any) => {
        if (perk) {
          ret = Math.max(perk?.rank, ret) || ret
        }
      })
      return ret
    }
  },
  methods: {
    setMartialPerkGain(pos: number, type: string) {
      let copy = this.martialPerksStore.perkGain.slice()
      copy[pos] = type
      this.martialPerksStore.setPerkGain(copy)
    },
    options(rank: number) {
      let ret: Array<string> = []
      Object.values(this.martialPerksStore.martialPerks).forEach((perk: any) => {
        if (
          perk &&
          perk.rank === rank &&
          (perk.perkGroup === 'Utility Perks' || perk.perkGroup === 'Offensive Perks')
        ) {
          if (!ret.includes('movespeed')) {
            ret.push('movespeed')
          }
        } else if (
          perk &&
          perk.rank === rank &&
          (perk.perkGroup === 'Supportive Perks' || perk.perkGroup === 'Defensive Perks')
        ) {
          if (!ret.includes('hitpoints')) {
            ret.push('hitpoints')
          }
        }
      })
      return ret
    },
    showModal(id: number) {
      if (id === 1) {
        this.optionsI = this.perkGain[0]
      } else if (id === 2) {
        this.optionsII = this.perkGain[1]
      } else if (id === 3) {
        this.optionsIII = this.perkGain[2]
      } else if (id === 4) {
        this.optionsIV = this.perkGain[3]
      } else if (id === 5) {
        this.optionsV = this.perkGain[4]
      }
      this.currentModal = id
      this.modal = !this.modal
    },
    perkGainIcon(gainType: string) {
      switch (gainType) {
        case 'movespeed':
          return 'gi-sprint'
        case 'hitpoints':
          return 'gi-hearts'
        case '':
          return 'gi-select'
      }
    }
  },
  components: {
    BButton,
    CustomModal,
    BInputGroupText,
    BFormSelect,
    BInputGroup
  }
}
</script>

<template>
  <div style="display: flex; flex-direction: column">
    <div
      style="
        display: flex;
        justify-content: space-around;
        padding: 0.25rem;
        width: 10rem;
        border-top: 2px solid;
        border-right: 2px solid;
        border-top-right-radius: 1rem;
      "
      :style="{
        color: designStore.getPrimaryText,
        background: designStore.primaryTheme,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div><v-icon name="gi-hearts"></v-icon> : {{ gainedHealth }}</div>
      <div><v-icon name="gi-sprint"></v-icon> : {{ gainedMovespeed }}</div>
    </div>
    <div
      style="
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        height: 100%;
        border-top: 2px solid;
        border-bottom: 2px solid;
      "
      :style="{
        color: designStore.inputText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <BButton
        @click="showModal(1)"
        class="perkGainItem"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        >Perk Gain I :</BButton
      >
      <BButton
        @click="showModal(1)"
        class="perkGainItemMobile"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        >I :</BButton
      >
      <div
        @click="showModal(1)"
        class="perkGain"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
      >
        <div v-if="entitledGain == 0">
          <i class="bi bi-x-lg" style="font-size: 1.5rem"></i>
        </div>
        <div v-else>
          <v-icon :name="perkGainIcon(perkGain[0])" scale="1.25"></v-icon>
        </div>
      </div>
      <CustomModal
        :showModal="modal && currentModal == 1"
        title="Perk Gain I"
        @close="showModal(1)"
      >
        <template v-slot:body>
          <div v-if="entitledGain < 1">
            <div>
              Perk Gain is a passive gain that you get when buying martial perks. Each purchased
              rank of Offensive Perks and Utility Perks allow a character to gain passive movespeed
              while each purchased rank of Defensive and Supportive perks gives the Character access
              to increased hitpoints(HP). If a character has multiple perks at the same rank, they
              may choose which perk gain they prefer.
            </div>
            <div style="padding-top: 1rem; text-align: center">
              In Order to select Perk Rank I, you must buy a rank 1 Martial Perk.
            </div>
          </div>
          <BInputGroup
            v-if="entitledGain >= 1"
            style="border: 2px solid; border-radius: 0.5rem"
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
            ><BInputGroupText
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              >Perk Gain I</BInputGroupText
            ><BFormSelect
              v-model="optionsI"
              :options="options(1)"
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              @change="setMartialPerkGain(0, optionsI)"
            ></BFormSelect
          ></BInputGroup>
        </template>
      </CustomModal>
      <BButton
        @click="showModal(2)"
        class="perkGainItem"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        >Perk Gain II :</BButton
      >
      <BButton
        @click="showModal(2)"
        class="perkGainItemMobile"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        >II :</BButton
      >
      <div
        @click="showModal(2)"
        class="perkGain"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
      >
        <div v-if="entitledGain < 2">
          <i class="bi bi-x-lg" style="font-size: 1.5rem"></i>
        </div>
        <div v-else>
          <v-icon :name="perkGainIcon(perkGain[1])" scale="1.25"></v-icon>
        </div>
      </div>
      <CustomModal
        :showModal="modal && currentModal == 2"
        title="Perk Gain II"
        @close="showModal(2)"
      >
        <template v-slot:body>
          <div v-if="entitledGain < 2">
            <div>
              Perk Gain is a passive gain that you get when buying martial perks. Each purchased
              rank of Offensive Perks and Utility Perks allow a character to gain passive movespeed
              while each purchased rank of Defensive and Supportive perks gives the Character access
              to increased hitpoints(HP). If a character has multiple perks at the same rank, they
              may choose which perk gain they prefer.
              <div style="padding-top: 1rem; text-align: center">
                In Order to select Perk Rank II, you must buy a rank 2 Martial Perk.
              </div>
            </div>
          </div>
          <BInputGroup
            v-if="entitledGain >= 2"
            style="border: 2px solid; border-radius: 0.5rem"
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
            ><BInputGroupText
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              >Perk Gain I</BInputGroupText
            ><BFormSelect
              @change="setMartialPerkGain(1, optionsII)"
              v-model="optionsII"
              :options="options(2)"
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
            ></BFormSelect
          ></BInputGroup>
        </template>
      </CustomModal>
      <BButton
        @click="showModal(3)"
        class="perkGainItem"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        >Perk Gain III :</BButton
      >
      <BButton
        @click="showModal(3)"
        class="perkGainItemMobile"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        >III :</BButton
      >

      <div
        @click="showModal(3)"
        class="perkGain"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
      >
        <div v-if="entitledGain < 3">
          <i class="bi bi-x-lg" style="font-size: 1.5rem"></i>
        </div>
        <div v-else>
          <v-icon :name="perkGainIcon(perkGain[2])" scale="1.25"></v-icon>
        </div>
      </div>
      <CustomModal
        :showModal="modal && currentModal == 3"
        title="Perk Gain III"
        @close="showModal(3)"
      >
        <template v-slot:body>
          <div v-if="entitledGain < 3">
            <div>
              Perk Gain is a passive gain that you get when buying martial perks. Each purchased
              rank of Offensive Perks and Utility Perks allow a character to gain passive movespeed
              while each purchased rank of Defensive and Supportive perks gives the Character access
              to increased hitpoints(HP). If a character has multiple perks at the same rank, they
              may choose which perk gain they prefer.
              <div style="padding-top: 1rem; text-align: center">
                In Order to select Perk Rank III, you must buy a rank 3 Martial Perk.
              </div>
            </div>
          </div>

          <BInputGroup
            v-if="entitledGain >= 3"
            style="border: 2px solid; border-radius: 0.5rem"
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
            ><BInputGroupText
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              >Perk Gain I</BInputGroupText
            ><BFormSelect
              @change="setMartialPerkGain(2, optionsIII)"
              v-model="optionsIII"
              :options="options(3)"
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
            ></BFormSelect
          ></BInputGroup>
        </template>
      </CustomModal>
      <BButton
        @click="showModal(4)"
        class="perkGainItem"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        >Perk Gain IV :</BButton
      >
      <BButton
        @click="showModal(4)"
        class="perkGainItemMobile"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        >IV :</BButton
      >
      <div
        @click="showModal(4)"
        class="perkGain"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
      >
        <div v-if="entitledGain < 4">
          <i class="bi bi-x-lg" style="font-size: 1.5rem"></i>
        </div>
        <div v-else>
          <v-icon :name="perkGainIcon(perkGain[3])" scale="1.25"></v-icon>
        </div>
      </div>
      <CustomModal
        :showModal="modal && currentModal == 4"
        title="Perk Gain IV"
        @close="showModal(4)"
      >
        <template v-slot:body>
          <div v-if="entitledGain < 4">
            <div>
              Perk Gain is a passive gain that you get when buying martial perks. Each purchased
              rank of Offensive Perks and Utility Perks allow a character to gain passive movespeed
              while each purchased rank of Defensive and Supportive perks gives the Character access
              to increased hitpoints(HP). If a character has multiple perks at the same rank, they
              may choose which perk gain they prefer.
              <div style="padding-top: 1rem; text-align: center">
                In Order to select Perk Rank IV, you must buy a rank 4 Martial Perk.
              </div>
            </div>
          </div>
          <BInputGroup
            v-if="entitledGain >= 4"
            style="border: 2px solid; border-radius: 0.5rem"
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
            ><BInputGroupText
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              >Perk Gain I</BInputGroupText
            ><BFormSelect
              @change="setMartialPerkGain(3, optionsIV)"
              v-model="optionsIV"
              :options="options(4)"
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
            ></BFormSelect
          ></BInputGroup>
        </template>
      </CustomModal>
      <BButton
        @click="showModal(5)"
        class="perkGainItem"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        >Perk Gain V :</BButton
      >
      <BButton
        @click="showModal(5)"
        class="perkGainItemMobile"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        >V :</BButton
      >
      <div
        @click="showModal(5)"
        class="perkGain"
        style="padding-right: 2.5%"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
      >
        <div v-if="entitledGain < 5">
          <i class="bi bi-x-lg" style="font-size: 1.5rem"></i>
        </div>
        <div v-else>
          <v-icon :name="perkGainIcon(perkGain[4])" scale="1.25"></v-icon>
        </div>
      </div>
      <CustomModal
        :showModal="modal && currentModal == 5"
        title="Perk Gain V"
        @close="showModal(5)"
      >
        <template v-slot:body>
          <div v-if="entitledGain < 5">
            <div>
              Perk Gain is a passive gain that you get when buying martial perks. Each purchased
              rank of Offensive Perks and Utility Perks allow a character to gain passive movespeed
              while each purchased rank of Defensive and Supportive perks gives the Character access
              to increased hitpoints(HP). If a character has multiple perks at the same rank, they
              may choose which perk gain they prefer.
              <div style="padding-top: 1rem; text-align: center">
                In Order to select Perk Rank V, you must buy a rank 5 Martial Perk.
              </div>
            </div>
          </div>
          <BInputGroup
            v-if="entitledGain >= 5"
            style="border: 2px solid; border-radius: 0.5rem"
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
            ><BInputGroupText
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              >Perk Gain I</BInputGroupText
            ><BFormSelect
              @change="setMartialPerkGain(4, optionsV)"
              v-model="optionsV"
              :options="options(5)"
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
            ></BFormSelect
          ></BInputGroup>
        </template>
      </CustomModal>
    </div>
  </div>
</template>

<style scoped>
.perkGainItem {
  cursor: pointer;
  border-radius: 0;
  border: none;
  display: flex;
  justify-content: center;
  flex-grow: 1;
  align-items: center;
}
.perkGain {
  cursor: pointer;
  border-radius: 0;
  border: none;
  display: flex;
  justify-content: center;
  flex-grow: 1;
  align-items: center;
}
.perkGainItemMobile {
  cursor: pointer;
  border-radius: 0;
  border: none;
  display: flex;
  justify-content: center;
  flex-grow: 1;
  align-items: center;
  display: none;
}
.bi-x-lg:hover {
  opacity: 1;
}
@media (max-width: 600px) {
  .perkGainItem {
    display: none;
  }
  .perkGainItemMobile {
    display: block;
  }
}
@media (min-width: 601px) {
  .perkGainItemMobile {
    display: none;
  }
  .perkGainItem {
    display: block;
  }
}
</style>
