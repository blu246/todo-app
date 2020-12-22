<template>
  <div id="app" @click="bodyClicked">
    <app-header></app-header>
    <app-body></app-body>
  </div>
</template>

<script>
import appHeader from "./components/appHeader.vue"
import appBody from "./components/appBody.vue"
import bus from "./bus.js"

export default {
  components:{
    appHeader,
    appBody
  },
  methods:{
    bodyClicked(e){
      bus.$emit('bodyclicked', e)
    }
  },

}
</script>

<style>
  @import './style.css';
</style>