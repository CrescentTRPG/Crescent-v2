import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import RulesStatus from '@/components/Character/Build/RulesStatus.vue'
describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(RulesStatus, {})
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
