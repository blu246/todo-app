<template>
  <div id="app" 
    @click="reportBodyClicks($event, 'click')"
    @contextmenu="reportBodyClicks($event, 'rclick')"
  >
    <app-header></app-header>
    <app-body ></app-body>
  </div>
</template>

<script>
import appHeader from "./components/appHeader.vue"
import appBody from "./components/appBody.vue"
import bus from "./bus.js"

export default {
  components:{
    appHeader,
    appBody,
  },
  methods:{
    reportBodyClicks(e, type){
      bus.$emit('bodyclicked', {e, type});
    }
  },

}
</script>

<style>
  @import './style.css';
</style>