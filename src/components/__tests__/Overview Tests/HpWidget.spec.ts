import { describe, it, expect, vi } from 'vitest'

import { enableAutoUnmount, mount, shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import HpWidget from '@/components/Character/Overview/HpWidget.vue'
import { useCharacterStore } from '@/stores/characterStore.js'
import CustomModal from '@/components/CustomModal.vue'
import { afterEach, beforeEach } from 'node:test'

describe('HpWidget', () => {
  enableAutoUnmount(afterEach)

  beforeEach(() => {
    // create teleport target
    const el = document.createElement('div')
    el.id = 'modal'
    document.body.appendChild(el)
  })
  afterEach(() => {
    // clean up
    document.body.innerHTML = ''
  })
  it('Renders The basic HP widget', async () => {
    const wrapper = mount(HpWidget, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })]
      }
    })

    const characterStore = useCharacterStore()
    characterStore.$patch({ totalAbilityPoints: 30, currentHp: 20, barrierHp: 2 })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.totalHp).toBe(34)
    expect(characterStore.totalAbilityPoints).toBe(30)
    expect(wrapper.get('[data-test="total-hp"]').text()).toBe('34')
    expect(wrapper.get('[data-test="current-hp"]').text()).toBe('20')
    expect(wrapper.get('[data-test="barrier-hp"]').text()).toBe('2')
  })
  it('Users can edit Current ad Barrier HP in Modal', async () => {
    const modalWrapper = mount(CustomModal, {
      emits: ['close'],
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })]
      },
      props: {
        showModal: true,
        title: 'wawoo'
      },
      data() {
        return { showModalRef: true, titleRef: 'waaaa' }
      },
      attachTo: document.body
    })

    const characterStore = useCharacterStore()
    characterStore.$patch({ totalAbilityPoints: 30, currentHp: 20, barrierHp: 2 })

    expect(modalWrapper.vm).toBeDefined()

    await modalWrapper.vm.$nextTick()
  })
})
