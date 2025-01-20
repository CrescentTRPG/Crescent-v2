import { describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import RulesStatus from '@/components/Character/Build/RulesStatus.vue'
import { useSpellStore } from '@/stores/spellsStore.js'
import { useCharacterStore } from '@/stores/characterStore.js'
describe('HelloWorld', () => {
  it('Alets the user when they have spent too many ability points', async () => {
    const wrapper = mount(RulesStatus, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })]
      }
    })
    const characterStore = useCharacterStore()
    characterStore.$patch({ totalAbilityPoints: 12, spentAbilityPoints: 33 })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('#error').exists()).toBe(true)
  })
  it('Alets the user when they purchase out of order', async () => {
    const wrapper = mount(RulesStatus, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })]
      }
    })
    const characterStore = useCharacterStore()
    characterStore.$patch({
      totalAbilityPoints: 12,
      spentAbilityPoints: 9,
      exceptionals: { charisma: 1 }
    })
    const store = useSpellStore()
    store.$patch({
      spellgroups: {
        Darkness: {
          baseCost: 1,
          groupPurchaseLimiter: 'Charisma',
          manaGain: 1,
          name: 'Darkness',
          rankLimiter: 'Power',
          source: 'Base',
          spells: {
            bigSmongo: {
              groupNumber: 4,
              groupSpellIndex: 0,
              known: true,
              name: 'bigSmongo',
              spellIndex: 22,
              spellgroup: 'Darkness',
              rank: 10
            },
            lil: {
              groupNumber: 4,
              groupSpellIndex: 0,
              known: true,
              name: 'lil',
              spellIndex: 21,
              spellgroup: 'Darkness',
              rank: 0
            }
          }
        }
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('#error').exists()).toBe(true)
    expect(wrapper.vm.status[2]).toContain('out of order')
  })
})
