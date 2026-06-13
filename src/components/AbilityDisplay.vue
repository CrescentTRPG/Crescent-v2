<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDesignStore } from '../stores/designStore.ts'
import AbilityDisplayMedallion from './AbilityDisplayMedallion.vue'
import { ManualSpell } from '@/stores/spellsStore.ts'

export default {
  props: [
    'title',
    'description',
    'rank',
    'actionCost',
    'resistance',
    'target',
    'area',
    'type',
    'duration',
    'medallion',
    'spellgroup',
    'spellgroups',
    'isPerk',
    'perks',
    'anyRankSpellgroup'
  ],
  setup(props, context) {
    const error = ref(null)
    const router = useRouter()
    const designStore = useDesignStore()
    const toggle = ref(true)

    const maxRank: ComputedRef<number> = computed((): number => {
      const groups: any = Object.values(props.spellgroups)

      let max = 0
      groups.forEach((group) => {
        let spell: any = Object.values(group.spells).reduce((a: any, b: any) =>
          a.rank - b.rank > 0 ? a : b
        )

        if (spell.rank > max) {
          max = spell.rank
        }
      })

      return max
    })
    const valueObj = ref({})
    const valueDisplay = () => {
      if (toggle.value) {
        if (
          (props.spellgroup && props.spellgroups[props.spellgroup]?.spells) ||
          props.anyRankSpellgroup
        ) {
          let x = 0
          if (props.anyRankSpellgroup) {
            x = maxRank.value
          } else {
            x = Object.values(props.spellgroups[props.spellgroup]?.spells as ManualSpell[]).reduce(
              (curr: ManualSpell, acc: ManualSpell) => (curr.rank > acc.rank ? curr : acc)
            ).rank
          }
          let addition = 0
          if (savedVal.value.includes('+')) {
            addition = parseInt(savedVal.value.substring(0, savedVal.value.indexOf('+')))
          }
          if (savedVal.value.includes('/') && props.spellgroups) {
            return (
              Math.floor(
                x /
                  parseInt(
                    savedVal.value.substring(
                      savedVal.value.indexOf('/') + 1,
                      savedVal.value.indexOf(')')
                    )
                  )
              ) +
              addition +
              savedEnding.value
            )
          }

          if (savedVal.value.includes('*') && props.spellgroups) {
            return (
              x * parseInt(savedVal.value.substring(0, savedVal.value.indexOf('*'))) ||
              x *
                parseInt(
                  savedVal.value.substring(
                    savedVal.value.indexOf('*') + 1,
                    savedVal.value.indexOf(')')
                  )
                ) +
                addition +
                savedEnding.value
            )
          }
          if (savedVal.value.includes('x') && props.spellgroups) {
            return (
              x * parseInt(savedVal.value.substring(0, savedVal.value.indexOf('x'))) ||
              x *
                parseInt(
                  savedVal.value.substring(
                    savedVal.value.indexOf('x') + 1,
                    savedVal.value.indexOf(')')
                  )
                ) +
                addition +
                savedEnding.value
            )
          }
          return x + savedEnding.value
        } else return savedVal.value
      } else {
        return savedVal.value
      }
    }
    const savedVal = ref('')
    const savedEnding = ref('')

    const tab = ref('corestats')

    function formatSpellRank(input) {
      let text = input
      let ret = '<div style="border-color: inherit; sidebar: inherit">'
      if (text.indexOf('(Rank') < 0 && text.indexOf('(Spell ') < 0) {
        return text
      }
      while (text.indexOf('(Rank') >= 0 || text.indexOf('(Spell ') > 0) {
        let start: number = text.indexOf('(Rank')
        if (start < 0) {
          start = text.indexOf('(Spell ')
        }
        let end: number =
          text.indexOf('d', start) > -1 && text.indexOf('d', start) - text.indexOf(')', start) < 3
            ? text.indexOf(' ', text.indexOf('d', start))
            : text.indexOf(')', start) + 1
        if (
          text.indexOf('* (Rank)') > 0 &&
          start - text.indexOf('* (Rank') <= 3 &&
          text.indexOf('* (Rank') < start
        ) {
          start = text.indexOf('* (Rank)')
          start -= 1
          start = text.substring(0, start).lastIndexOf(' ') + 1
        }
        if (
          text.indexOf('+ (Rank') > 0 &&
          start - text.indexOf('+ (Rank') <= 3 &&
          text.indexOf('+ (Rank') < start
        ) {
          start = text.indexOf('+ (Rank')
          start -= 1
          start = text.substring(0, start).lastIndexOf(' ') + 1
          // end = text.indexOf(' ', text.indexOf(')', start))
        }
        if (text.indexOf(")'") > 0) {
          end = text.indexOf(")'") + 2
        }
        if (end + 1 == text.length) {
          end = text.indexOf(')', start) + 1
        }
        if (text.indexOf('(Rank)') > 0 && text.indexOf('(Rank)') < start) {
          start = text.indexOf('(Rank)')
          end = text.indexOf(')', start) + 1
        }

        savedEnding.value = text.substring(text.indexOf(')', start) + 1, end)
        savedVal.value = text.substring(start, end)

        if (start > 0 && end > 0)
          ret += toggle.value
            ? text.substring(0, start) +
              '<span @click="toggle=!toggle" class="buttonStyle hoverablePrimary" :style={background: designStore.sidebarBacking}> <span>' +
              valueDisplay() +
              ' </span><i class="bi bi-asterisk" style="font-size: x-small;position: relative; bottom: .1rem"></i>' +
              '' +
              '&nbsp' +
              '</span>' +
              ' '
            : text.substring(0, start) +
              '<span @click="toggle=!toggle" class="buttonStyle hoverablePrimary" :style={background: designStore.sidebarBacking}> <span>' +
              valueDisplay() +
              ' </span>' +
              '' +
              '</span>' +
              '&nbsp'
        text = text.substring(end + 1)
      }
      ret += text + ' </div>'
      return ret
    }
    const formatHTML = computed(() => {
      let sections = props.description.split('\\n')
      let ret
      if (sections.length === 1) {
        sections = props.description.split('\n*')
      }

      if (sections.length === 1) {
        sections = props.description.split('\n')
        if (sections.length === 1) {
          if (props.spellgroup) {
            return formatSpellRank(props.description)
          }
          return '<div>' + props.description + '</div>'
        } else {
          ret = '<div style="margin-bottom: .25rem">'
          sections.forEach((s) => {
            if (s === '') {
              ret += '<div style="padding: .5rem"></div>'
            }
            if (props.spellgroup) {
              ret +=
                '<div style=" margin-bottom: .25rem;list-style-type:none;">' +
                formatSpellRank(s) +
                '</div>'
            }
            ret += '<div style=" margin-bottom: .25rem;list-style-type:none;">' + s + '</div>'
          })
          ret += '</div>'
        }
      } else {
        if (props.spellgroup) {
          ret = '<div style="margin-bottom: .25rem">' + formatSpellRank(sections[0]) + '</div>'
        } else {
          ret = '<div style="margin-bottom: .25rem">' + sections[0] + '</div>'
        }
        sections.shift()
        sections.forEach((s) => {
          if (s.length > 3 && props.spellgroup) {
            ret +=
              '<li style="padding-left: 1rem; margin-bottom: .25rem;list-style-type:none;text-indent: -1rem ;">' +
              '❖ ' +
              formatSpellRank(s) +
              '</li>'
          } else if (s.length > 3) {
            ret +=
              '<li style="padding-left: 1rem; margin-bottom: .25rem;list-style-type:none;text-indent: -1rem ;">' +
              '❖ ' +
              s +
              '</li>'
          }
        })
      }
      return ret
    })
    return { designStore, tab, props, valueDisplay, formatHTML, toggle }
  },

  methods: {},
  components: {
    AbilityDisplayMedallion
  }
}
</script>

<template>
  <div
    style="display: flex; flex-direction: column; width: 100%"
    :style="{ fontFamily: designStore.font }"
  >
    <div
      class="abilityGrid"
      :style="{
        background: designStore.secondaryTheme,
        color: designStore.sidebarText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div
        class="grid__item"
        :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
      >
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: fit-content;
          "
        >
          <div
            style="
              display: flex;
              justify-content: flex-start;
              height: 100%;
              padding-right: 0.5rem;
              flex-wrap: wrap;
            "
          >
            <div style="align-self: center; text-wrap: nowrap; padding-right: 0.5rem">
              Action Cost:
            </div>
            <div style="align-self: flex-end">{{ props.actionCost }}</div>
          </div>
        </div>
      </div>
      <div
        class="grid__item"
        :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
      >
        <div style="display: flex; flex-direction: column; justify-content: center; height: 100%">
          <div
            style="
              display: flex;
              justify-content: flex-start;
              height: 100%;
              padding-right: 0.5rem;
              flex-wrap: wrap;
            "
          >
            <div style="align-self: center; padding-right: 0.5rem">Target:</div>
            <div style="align-self: center">{{ props.target }}</div>
          </div>
        </div>
      </div>
      <div
        class="grid__item"
        :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
      >
        <div style="display: flex; flex-direction: column; justify-content: center; height: 100%">
          <div
            style="
              display: flex;
              justify-content: flex-start;
              height: 100%;
              padding-right: 0.5rem;
              flex-wrap: wrap;
            "
          >
            <div style="align-self: center; padding-right: 0.5rem">Area:</div>
            <div style="align-self: center">{{ props.area }}</div>
          </div>
        </div>
      </div>
      <div
        class="grid__item"
        :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
      >
        <div style="display: flex; flex-direction: column; justify-content: center; height: 100%">
          <div
            style="
              display: flex;
              justify-content: flex-start;
              height: 100%;
              padding-right: 0.5rem;
              flex-wrap: wrap;
            "
          >
            <div style="align-self: center; padding-right: 0.5rem">Type:</div>
            <div style="align-self: center">{{ props.type }}</div>
          </div>
        </div>
      </div>
      <div
        class="grid__item"
        :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
      >
        <div style="display: flex; flex-direction: column; justify-content: center; height: 100%">
          <div
            style="
              display: flex;
              justify-content: flex-start;
              height: 100%;
              padding-right: 0.5rem;
              flex-wrap: wrap;
            "
          >
            <div style="align-self: center; padding-right: 0.5rem">Duration:</div>
            <div style="align-self: center">{{ props.duration }}</div>
          </div>
        </div>
      </div>
      <div
        class="grid__item"
        :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
      >
        <div style="display: flex; flex-direction: column; justify-content: center; height: 100%">
          <div
            style="
              display: flex;
              justify-content: flex-start;
              height: 100%;
              padding-right: 0.5rem;
              flex-wrap: wrap;
            "
          >
            <div style="align-self: center; padding-right: 0.5rem">Resistance:</div>
            <div style="align-self: center">{{ props.resistance }}</div>
          </div>
        </div>
      </div>
    </div>

    <div
      style="
        border-left: 2px solid;
        border-right: 2px solid;
        border-bottom: 4px solid;
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;
        padding: 0.5rem;
        text-align: left;
      "
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        borderColor: designStore.secondaryTheme,
        '--sidebar': designStore.sidebarBacking
      }"
    >
      <div
        @click="toggle = !toggle"
        v-html="formatHTML"
        style="z-index: 5; margin-left: 0.75rem; margin-right: 0.75rem; text-align: left"
        :style="{
          borderColor: designStore.secondaryTheme,
          '--secondary': designStore.secondaryTheme,
          '--primary': designStore.primaryTheme,
          '--primary-text': designStore.primaryText
        }"
      ></div>
      <AbilityDisplayMedallion :medallion="props.medallion"></AbilityDisplayMedallion>
    </div>
    <div
      style="display: flex; justify-content: center; z-index: 1; width: 100%"
      :style="{
        color: designStore.secondaryTheme,
        borderColor: designStore.secondaryTheme
      }"
    >
      <v-icon
        name="gi-door-ring-handle"
        scale="2"
        style="
          margin-bottom: -1rem;
          position: relative;
          text-align: right;
          bottom: 0.25rem;
          transform: scale(1.25, 1);
          rotate: 180deg;
        "
      ></v-icon>
    </div>
  </div>
</template>

<style>
.abilityGrid {
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  z-index: 4;
  border: 2px solid;
  border-bottom: 2px solid;
  margin-top: -1.5rem;
  grid-gap: 0.05rem;
  justify-content: space-around;
}
.grid__item {
  padding: 0.25rem;
  position: relative;
  padding-left: 0.5rem;
  padding-bottom: 0.5rem;
  padding-top: 0.25rem;
  text-wrap: wrap;
}

.buttonStyle {
  border: 2px solid;
  padding: 0.35rem;
  border-radius: 1rem;
  background: var(--primary);
  border-color: inherit;
  color: var(--primary-text);
  cursor: pointer;
  white-space: nowrap;
  display: inline-block;
}
@media (max-width: 1000px) {
  .abilityGrid {
    grid-template-rows: auto auto auto;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
