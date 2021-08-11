<template>
 <header class="shadow bg-primary">
        <help-widget class="help-widget" :signal="helpWidgetSignal"></help-widget>

     <div class="container flex spc-btw my-auto">
        <div class="placeholder"></div>

        <h1> <i class="fas fa-microchip"></i>B-Cache</h1>

        <!-- <div  id="perc-clock-container"> -->
        <transition-group tag="div" id="perc-clock-container" name="ham">

            <div class="perc-container" v-if="!(percVal==-1)" key="percContainer">
                <span id=perc-val>{{percString}}</span>
                <span class="separator"></span>
            </div>
            
            <h2 id="clock" key="clockH2">{{time}}</h2>

            <span class="separator" key="sep1"></span>

            <div class="xtra-container" v-if="showHamContent" key="xtraCont">
                <template v-if="showkeybIcon">
                    <i class="far fa-keyboard keyb-icon btn-hover" @click="keybIconFunc" :class="{keyboardIconOn: keybIconState}"></i>
                </template>

                <span class="separator"></span>

                <div class="theme-container" @click="themeMethod">
                    <transition mode="out-in" name="theme-btn">
                        <i class="fas fa-sun btn-hover"  v-if="inLightMode" key="sun"></i>
                        <i class="fas fa-moon btn-hover" v-else key="moon"></i>
                    </transition>
                </div>
                <span class="separator"></span>

                <i class="far fa-question-circle help-icon btn-hover" @click="helpWidgetSignal++"></i>

                <span class="separator"></span>
            </div>
            

            <i class="fa fa-gear btn-hover ham-icon" key="gearIcon" @click.stop="showHamContent =! showHamContent"></i>

        </transition-group>
        <div class="cover-fix"></div>
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
            window.innerWidth;
            let done = "% done";
            if(window.innerWidth < 320){
                done = !this.showHamContent ? "% done" : "%";
            }
            return (this.percVal * 100).toFixed(0) + done;
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
        overflow: hidden;
    }
  
    .container{
        align-items: flex-end;
        padding-top: .4rem;
        padding-bottom: 0.1rem;
        position: relative;
    }
    h1{
        font-weight: 700;
    }

    
    h2{
        font-weight: 400;
        font-size: 1.8rem;
        display: inline-block;
        z-index: 5;
        background: var(--bg-primary);
        padding: .2rem 0;
    }
    .perc-container{
        display: inline-block;
        font-size: 1.4rem;
        font-weight: 200;
    }
    #perc-clock-container{
        display: flex;
        justify-content: space-between;
        align-items: center;
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
    
    .xtra-container{
        display: flex;
        align-items: center;
        border-radius: 10px;
    }
    .xtra-container > *:not(span){
        padding: 0rem .5rem;
    }
    
    .ham-enter-active, .ham-leave{
        transition: all .4s ;
        transform: translateX(0%);
        z-index: 2;
        position: relat ive;
    }
    .ham-leave-active, .ham-enter{
        transition: all .4s ;
        transform: translateX(100%);
        z-index: 2;
        position: relative;
    }
    .ham-leave-active{
        position: absolute;
    }
    .ham-move{
        transition: transform .4s;
    }
    .ham-icon{
        z-index: 5;
        position: relative;
        padding: .2rem 0;
        background: var(--bg-primary);
    }
    .cover-fix{
        position: absolute;
        top: -30%;
        right: -40%;
        height: 150%;
        width: 40%;
        z-index: 4;
        background: var(--bg-primary);
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
            font-size: 1rem;
            font-weight: 600;
            margin-right: .3rem;
        }

        .perc-clock-container, #placeholder{
             flex-basis: 24%;
             flex-shrink: 1;
         }
         .xtra-container{
            margin-right: .4rem;
         }
         .ham-icon{
            padding: .2rem 0;

         }
        .xtra-container > *:not(span){
        }
        .theme-container .fas, .help-icon, .keyb-icon, .fa-gear{
        font-size: 1.4rem;
    }
    }


</style>