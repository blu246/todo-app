<template>
  <div id="app" 
    @click="reportBodyEvents($event, 'click'); "
    @contextmenu="reportBodyEvents($event, 'rclick')"
  >
    <app-header></app-header>
    <app-body ></app-body>
    <div class="box" ref=boxEl></div>

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
    reportBodyEvents(e, type){
      bus.$emit('bodyclicked', {e, type});
    },
    keyboardShortcutsFunc(e){
      // console.log(e)
      const el = this.$refs.boxEl;
      let step = 20;
      if(e.ctrlKey){
        step = 5
      }

      switch(e.key){
        case "ArrowUp":
          
            el.style.top = el.offsetTop - step + "px";
            break;
        case "ArrowDown":
          
            el.style.top = el.offsetTop + step + "px";
            break;
        case "ArrowLeft":
          
            el.style.left = el.offsetLeft - step + "px";
            break;
        case "ArrowRight":
            el.style.left = el.offsetLeft + step + "px";
            break;

      }
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
  created(){
    window.addEventListener("keydown", this.keyboardShortcutsFunc);
  }

}
</script>

<style>
  @import './style.css';
  /* .test-square{
    height: 30px; width: 30px;
    background: brown;
    position: fixed;
  } */

  .box{
    position: fixed;
    height: 50px; width: 50px;
    border: 1px solid red;
  }
</style>