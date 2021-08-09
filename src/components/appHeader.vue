<template>
 <header class="shadow bg-primary">
        <help-widget class="help-widget" :signal="helpWidgetSignal"></help-widget>

     <div class="container flex spc-btw my-auto">
        <div class="placeholder"></div>

        <h1> <i class="fas fa-microchip"></i>BrainCache</h1>

        <div  id="perc-clock-container">
            <div id="perc-container" v-if="!(percVal==-1)">
                <span id=perc-val>{{percString}}</span>
            </div>
            
            <span class="separator"></span>
            <h2 id="clock">{{time}}</h2>

            <span class="separator"></span>

            <div class="ham-container">

                <i class="fa fa-gear btn-hover" @click.stop="showHamContent =! showHamContent"></i>

                <transition name="ham">
                    <div class="ham-inner-cont" v-if="showHamContent">
                        <div class="theme-container" @click="themeMethod">

                            <transition mode="out-in" name="theme-btn">
                                <i class="fas fa-sun btn-hover"  v-if="inLightMode" key="sun"></i>
                                <i class="fas fa-moon btn-hover" v-else key="moon"></i>
                            </transition>
                        </div>


                        <i class="far fa-question-circle help-icon btn-hover" @click="helpWidgetSignal++"></i>

                        <template v-if="showkeybIcon">
                            <i class="far fa-keyboard keyb-icon btn-hover" @click="keybIconFunc" :class="{keyboardIconOn: keybIconState}"></i>
                        </template>
                    </div>
                </transition>
            </div>

        </div>
     </div>

      <!-- <div v-if="!(percVal==-1)" class="perc-clock-container mobile">{{percString}}</div> -->

 </header>
 
</template>

<script>
import bus from "../bus.js"
import helpWidget from "./helpWidget.vue"
export default {
    components:{
        helpWidget
    },
    data(){return{
            date: "",
            time: "",
            percVal: 0,
            inLightMode: true,
            helpWidgetSignal: 0,
            keybIconState: null,
            showHamContent: false,
        }
    },
    computed:{
        percString(){
            return (this.percVal * 100).toFixed(0) + "% done";
        },
        showkeybIcon(){
            return !bus.onMobile
        }
    },
    methods:{
        updateDateTime(){
            const date = new Date();
            this.date = this.leadingZero(date.getUTCDate()) + "/" + this.leadingZero((date.getUTCMonth()+1));
            this.time = this.leadingZero((date.getUTCHours()+1)) + ":" + this.leadingZero(date.getUTCMinutes()) + ":" + this.leadingZero(date.getSeconds());
        },
        leadingZero(number){
            return number <= 9 ? "0"+number : number;
        },
        themeMethod(){
            this.inLightMode = !this.inLightMode;
            document.documentElement.className = this.inLightMode ? "light" : "dark";
            window.localStorage.setItem("theme_inLightMode", this.inLightMode);

        },
        keybIconFunc(){
            bus.$emit("appHeader_to_appTasks__keybIconClicked")
        },
    },
    mounted(){
        this.updateDateTime(); //set date initially to avoid the 1s delay;
        this.$options.dateTimeInterval = setInterval(this.updateDateTime, 1000);

        bus.$on("percchange", (val)=>{
            this.percVal = val;
        })
    },
    unmounted(){
        clearInterval(this.$options.dateTimeInterval);  
    },
    created(){
        let mode = JSON.parse(window.localStorage.getItem("theme_inLightMode"));
        if(mode == null){
            mode = this.inLightMode;
            window.localStorage.setItem("theme_inLightMode", mode);
        }
        this.inLightMode = mode;
        document.documentElement.className = mode ? "light" : "dark";

        bus.$on("appTasks_to_appHeader__keybShortcutsToggle", (state)=>this.keybIconState = state);
        this.keybIconState = JSON.parse(window.localStorage.getItem("isKeyboardShortcutsOn"));
    }
}

</script>

<style scoped>
    header{
        padding: 0 .5rem;
        border: var(--shadow-subs-border);
        border-left: 0; border-right: 0; border-top: 0;
    }
  
    .container{
        align-items: flex-end;
        padding-top: .4rem;
        padding-bottom: 0.1rem;
    }
    h1{
        font-weight: 700;
    }

    
    h2{
        font-weight: 400;
        font-size: 1.8rem;
        display: inline-block;
    }
    #perc-container{
        display: inline-block;
        font-size: 1.4rem;
        font-weight: 200;
    }
    
    .separator{
        display: inline-block;
        background: var(--separator2);
        width: 1px;
        height: 1.2rem;
        margin: 0 .3rem;


    }
    .placeholder{
        display: none;
    }
    .help-widget{
        display: inline-block;
    }
    .theme-container, .help-icon, .keyb-icon, .ham-container{
        display: inline-block;
        margin: 0 .3rem;
    }
    .theme-container .fas, .help-icon, .keyb-icon, .fa-gear{
        font-size: 1.6rem;
    }

    .theme-btn-leave, .theme-btn-enter-active{
        transition: all .2s ease;
        transform: rotate(0deg);
        filter: blur(.5px);
    }
    .theme-btn-enter, .theme-btn-leave-active{
        transition: all .2s ease;
        transform: rotate(-180deg);
        filter: blur(1px);
    }
    .theme-btn-leave-active{
        transform: rotate(180deg);
    }
    .keyboardIconOn{
        color: var(--primary-color);
    }
    .ham-container{
        position: relative;
    }
    .ham-inner-cont{
        position: absolute;
        z-index: 5;
        top: 100%;
        left: -100%;
        background: var(--bg-thirdary);
        box-shadow: 2px 2px 2px var(--shadow-val1), -1px -1px 2px var(--shadow-val2);
        border: var(--shadow-subs-border);
        border-radius: 7px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        padding: .2rem 0;
        transform-origin: 0 0;
    }
    .ham-inner-cont > *{
        padding: .6rem .4rem;
    }
    .shrink-up{
        }
    .ham-enter-active, .ham-leave{
        animation: expand-down .3s ease-in-out forwards;
    }
    .ham-leave-active, .ham-active{
        animation: expand-down .3s ease-in-out reverse;
    }
    @keyframes expand-down{
        from{transform: scaleY(0%); z-index: 5; opacity: 0;}
        to{transform: scaleY(100%); z-index: 5; opacity: 1}
    }
    

    @media only screen and (max-width: 600px) {
        
        #clock{
            display: none;
            /* cause you got a clock on mobile */
        }
        h1{
            font-size: 1.4rem;
        }
       
        .container{
            flex-shrink: 0;
            padding-bottom: 0rem;

        }
        .separator{
            display: none;
        }
        #perc-val{
            font-size: 1.2rem;
            font-weight: 400;
        }

        .perc-clock-container, #placeholder{
             flex-basis: 24%;
             flex-shrink: 1;
         }
    }


</style>