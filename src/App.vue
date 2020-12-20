<template>
  <div id="app">
    <app-header></app-header>
    <app-body></app-body>
  </div>
</template>

<script>
import appHeader from "./components/appHeader.vue"
import appBody from "./components/appBody.vue"
export default {
  components:{
    appHeader,
    appBody
  },
  methods:{
  }
  
}
</script>

<style>
  @import './style.css';
</style>