<template>
 <header class="shadow bg-primary">

     <div class="container flex spc-btw my-auto">
        <div class="placeholder"></div>

        <h1> <i class="fas fa-microchip"></i>BrainCache</h1>

        <div  id="perc-clock-container">
            <div id="perc-container" v-if="!(percVal==-1)">
                <span id=perc-val>{{percString}}</span>
                <span class="separator"></span>
            </div>
            <h2 id="clock">{{time}}</h2>

            <span class="separator"></span>
            <div class="theme-container" @click="themeMethod">
                <transition mode="out-in" name="v">
                    <i class="fas fa-sun btn-hover"  v-if="inLightMode" key="sun"></i>
                    <i class="fas fa-moon btn-hover" v-else key="moon"></i>
                </transition>
            </div>
        </div>
        

     </div>

      <!-- <div v-if="!(percVal==-1)" class="perc-clock-container mobile">{{percString}}</div> -->

 </header>
 
</template>

<script>
import bus from "../bus.js"
export default {
    data(){return{
            date: "",
            time: "",
            percVal: 0,
            inLightMode: true,
        }
    },
    computed:{
        percString(){
            return (this.percVal * 100).toFixed(0) + "% done";
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

        }
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

    .theme-container{
        display: inline-block;
        margin: 0 .5rem;
    }
    .theme-container .fas{
        font-size: 1.6rem;
    }


    .v-leave, .v-enter-active{
        transition: all .2s ease;
        transform: rotate(0deg);
        filter: blur(.5px);
    }
    .v-enter, .v-leave-active{
        transition: all .2s ease;
        transform: rotate(-180deg);
        filter: blur(1px);
    }
    .v-leave-active{
        transform: rotate(180deg);
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