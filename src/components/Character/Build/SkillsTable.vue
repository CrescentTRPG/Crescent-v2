<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { db } from '@/firebase/config.js'
import { useCharacterStore } from '../../../stores/characterStore'
import { useUserStore } from '../../../stores/userStore'
import { BButton, BCard, BNavItem, BNavbar, BTable, BFormSelect, BThead } from 'bootstrap-vue-next'
import { onSnapshot, doc, query, getDocs, updateDoc, collection } from 'firebase/firestore'
import CustomModal from '@/components/CustomModal.vue'
import CustomCheckbox from "../CustomCheckbox.vue"
import { ref, onMounted } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

export default {
  setup(props, context) {
    const userStore = useUserStore()
    const characterStore = useCharacterStore()
    const designStore = useDesignStore()
    const skills = ref({})
    const allSkills: any = ref([])
    const effectiveSkills: any = ref([])
    const modal = ref(false)
    const currentModal = ref(0)
    const options = [
      { value: '0', text: '0' },
      { value: '1', text: '1' },
      { value: '2', text: '2' },
      { value: '3', text: '3' },
      { value: '4', text: '4' },
      { value: '5', text: '5' },
      { value: '6', text: '6' },
      { value: '7', text: '7' },
      { value: '8', text: '8' },
      { value: '9', text: '9' },
      { value: '10', text: '10' }
    ]
    const getEffectiveSkills = () => {
      allSkills.value.forEach((skill) => {
        effectiveSkills.value.push({
          skill: skill.skill,
          rank: (skill.rank = skills.value[skill.skill]?.rank || 0),
          description: skill.description,
          attribute: skill.attribute,
          isOrigin: characterStore.originSkills.includes(skill.skill)
        })
      })
    }
    onMounted(() => {
      let allSkillsRef = collection(db, 'Skill/Base/Skill')
      let collectionRef = collection(
        db,
        'User/' + userStore.getUserId + '/Character/' + characterStore.getCharacterId + '/Skills'
      )
      onSnapshot(
        collectionRef,
        (snap) => {
          snap.docs.forEach((doc) => {
            skills.value[doc.data().skill] = doc.data()
          })
        },
        (err) => {
          console.log(err.message)
        }
      )
      onSnapshot(
        allSkillsRef,
        (snap) => {
          let results: any = []
          snap.docs.forEach((doc) => {
            results.push({ ...doc.data() })
          })
          allSkills.value = results
          getEffectiveSkills()
        },
        (err) => {
          console.log(err.message)
        }
      )
    })
    const fields = ref([{ key: 'skill' }, {key: 'isOrigin?'}, { key: 'actions' }])
    return { designStore, fields, skills, allSkills, effectiveSkills, options, modal, currentModal }
  },
  methods: {
    showModal(id: number) {
      this.currentModal = id
      this.modal = !this.modal
    }
  },
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard,
    BTable,
    BFormSelect,
    CustomModal,
    CustomCheckbox
  }
}
</script>

<template>
  <div
    id="BuildTab"
    style="display: flex; justify-content: flex-start; flex-direction: column; width: 100%"
    :style="{ fontFamily: designStore.font }"
  >
    <div
      style="font-size: x-large; margin-top: 1rem; padding: 0.5rem; display: flex;flex-direction: column;"
      :style="{
        fontFamily: designStore.titleFont,
        color: designStore.primaryText,
        background: designStore.primaryTheme
      }"
    >
      <div style="margin-left: 2rem">Skills</div>
      <span style="display: flex;  margin-bottom: -1rem; margin-top: -1rem;" :style="{borderColor: designStore.secondaryTheme, color:designStore.secondaryTheme}">
          <v-icon name="gi-abstract-119" style="position: relative; left: .25rem; top: .5rem"></v-icon>
          <hr :style="{borderColor: designStore.secondaryTheme}"></hr>
          <v-icon name="gi-abstract-119" style="position: relative; right: .25rem; top: .5rem"></v-icon>

        </span>
    </div>
    <BTable
      :items="effectiveSkills"
      :fields="fields"
      :style="{
        fontFamily: designStore.font,
        borderColor: designStore.secondaryTheme,
        color: designStore.inputText,
        backgroundColor: designStore.inputBacking
      }"
      headerTitle="Skills"
      class="tableClass"
    >
      <template #cell(skill)="data" :style="{ background: designStore.inputBacking }">
        <BButton
          style="width: 100%; border: 2px solid; text-align: left"
          @click="showModal(data.index)"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          >{{ data.item.skill }}</BButton
        >
        <CustomModal
          v-if="currentModal == data.index"
          :showModal="modal"
          :title="data.item.skill"
          @close="showModal(data.index)"
        >
          <template v-slot:body>
            <div v-html="data.item.description"></div>
          </template>
        </CustomModal>
      </template>
      <template #cell(isOrigin?)="data">
        <CustomCheckbox :isChecked="data.item.isOrigin" style="margin-left: 1rem;"></CustomCheckbox>
      </template>
      <template #cell(actions)="data">
        <BFormSelect
          :options="options"
          v-model="effectiveSkills[data.index].rank"
          :style="{
            color: designStore.inputText,
            backgroundColor: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
          style="font-size: large; border: none; text-align: right; cursor: pointer"
        ></BFormSelect>
      </template>
    </BTable>
  </div>
</template>

<style>
.tableClass {
  --bs-table-bg: background-color !important;
  --bs-table-color-type: color !important;
}
</style>
