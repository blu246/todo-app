<template>
  <div id="app" 
    @click="reportBodyClicks($event, 'click'); "
    @contextmenu="reportBodyClicks($event, 'rclick'); checkOverflow()"
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
    },
    checkOverflow(){

    }

    // -------- keep this here in case this breaks again --------
    // testSquareFunc(e){
    //     const type = "layer";
    //     //layerX/Y seemed to have problems while hovering over the task elements
    //     // it breaks when hovering above a relative placed elem.


    //     const el = this.$refs.testSquareEl;
    //     const x = e[type + "X"] - 10  + "px", y = e[type + "Y"] - 40 + "px";
    //     const st = el.style;

    //     st.top = y;
    //     st.left = x;
    //     console.log(x, y)
    // }
    //-----------------------------------------------------------
  },

}
</script>

<style>
  @import './style.css';
  /* .test-square{
    height: 30px; width: 30px;
    background: brown;
    position: fixed;
  } */
</style>