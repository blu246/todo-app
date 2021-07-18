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
  data(){return{
    isKeyboardShortcutsOn: false,
  }},
  methods:{
    reportBodyEvents(e, type){
      bus.$emit('bodyclicked', {e, type});
    },
    keyboardShortcutsParser(e){
      let cmnd;
      // Activate shortcuts shortcut
      if(e.ctrlKey && e.altKey && e.code == "KeyE"){
          this.isKeyboardShortcutsOn  = !this.isKeyboardShortcutsOn;
      }
      if(this.isKeyboardShortcutsOn){
        // cmnd with SHIFT modifier
        if(e.shiftKey){
          switch(e.code){
              case "KeyF":
                  cmnd = "search";
                  break;
              case "KeyN":
                  cmnd = "newtask";
                  break
              case "KeyE":
                  cmnd = "edit";
                  break;
              case "KeyR":
                  cmnd = "delete";
                  break;
              case "KeyX":
                  cmnd = "done";
                  break;
              case "ArrowDown":
                  cmnd = "expand";
                  break;
              case "ArrowUp":
                  cmnd = "collapse";
                  break;
          }
        } else{
          switch(e.code){
              case "Escape":
                  cmnd = "cancel";
                  break;
              case "ArrowUp":
                  cmnd = "nextTask"
                  break;
              case "ArrowDown":
                  cmnd = "prevTask";
                  break;            
              
          }
      }
      }
    if(cmnd){
      console.log(cmnd)
      bus.$emit("shortcuts_"+cmnd);
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
    window.addEventListener("keydown", this.keyboardShortcutsParser)
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