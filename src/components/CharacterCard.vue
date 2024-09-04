<template>
  <BCard class="characterCard">
    <BCardImg
      v-if="useImg"
      :src="getCharacterImage()"
      style="border: 4px solid #dfdfdf; border-radius: 0; background-color: #dfdfdf"
    ></BCardImg>
    <div v-if="!useImg" class="addIconContainer">
      <i class="bi bi-person-add" style="position: relative; right: 1rem"></i>
    </div>
    <div style="margin: 1.5rem"></div>
    <BCardTitle class="characterCardTitle">{{ name }}</BCardTitle></BCard
  >
</template>

<script>
import { BCard, BCardImg, BCardTitle } from 'bootstrap-vue-next'
import { ref } from 'vue'

export default {
  props: ['character', 'name', 'useImg'],
  setup(props, context) {
    const character = ref(props.character)
    const name = ref(props.name)
    const useImg = ref(props.useImg)
    return { character }
  },
  components: {
    BCard,
    BCardTitle,
    BCardImg
  },
  methods: {
    getCharacterImage() {
      const val = Math.floor(Math.random() * 5) + 1
      switch (val) {
        case 4:
          return 'src\\assets\\flame.png'
        case 5:
          return 'src\\assets\\Finn.png'
        default:
          return 'src\\assets\\default' + val + '.png'
      }
    }
  }
}
</script>

<style>
.addIconContainer {
  background-color: #dfdfdf;
  display: flex;
  justify-content: center;
  font-size: 12rem;
  color: #ffffff;
}
.characterCard {
  background: #f1eef1;
  border: 4px solid #c2b172;
  box-shadow: 3px 3px 4px 3px #888888;
  width: 45%;
  max-width: 350px;
  max-height: 500px;
  margin: 0.5rem;
  margin-right: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
}
.characterCardTitle {
  background: #422c58;
  color: #dfdfdf;
  padding: 0.5rem;
  width: fit-content;
  border-radius: 10px;
  font-size: 1.5rem;
  position: absolute;
  bottom: 1rem;
  left: 1.5rem;
  max-width: 90%;
}
@media (min-width: 900px) {
  .characterCard {
    background: #f1eef1;
    border: 4px solid #c2b172;
    box-shadow: 3px 3px 4px 3px #888888;
    width: 30%;
    max-width: 350px;
    max-height: 500px;
    margin: 0.5rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
    cursor: pointer;
  }
}
@media (max-width: 770px) {
  .addIconContainer {
    background-color: #dfdfdf;
    display: flex;
    justify-content: center;
    font-size: 8rem;
    color: #ffffff;
  }
  .characterCardTitle {
    background: #422c58;
    color: #dfdfdf;
    padding: 0.5rem;
    width: fit-content;
    border-radius: 10px;
    font-size: 1rem;
    position: absolute;
    bottom: 1rem;
    left: 1.5rem;
    max-width: 90%;
  }
}
</style>
