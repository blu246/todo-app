<template>
 <header class="shadow py-2r bg-primary">
     <div id="placeholder"></div>

     <div class="container flex spc-btw my-auto">
        <h1> <i class="fas fa-microchip"></i>BrainCache</h1>
        <div class="clock flex center-y">
            <div v-if="!(percVal==-1)" id="perc-val">{{percString}}</div>
            <span class="separator">|</span>
            <h2>{{time}}</h2>
        </div>
     </div>

      <div v-if="!(percVal==-1)" class="perc-val mobile">{{percString}}</div>

 </header>
 
</template>

<script>
import bus from "../bus.js"
export default {
    data(){return{
            date: "",
            time: "",
            percVal: 0,
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
    }

}

</script>

<style scoped>
  
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
        margin-right: .2rem;
    }
    .perc-val{
        font-size: 1.4rem;
        font-weight: 200;
        align-self: flex-end;
        padding-bottom: .15rem;
    }
    .separator{
        color: rgb(211, 211, 211);
        font-size: 1.2rem;
    }
    .mobile{
        display: none;
    }
    

    @media only screen and (max-width: 600px) {
        
        .clock{
            display: none;
            /* cause you got a clock on mobile */
        }
        h1{
            font-size: 1.4rem;
        }
            
        header{
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 0.3rem;
        }
        .container{
            flex-shrink: 0;
            padding-bottom: 0rem;

        }
        
        .perc-val.mobile{
            font-weight: 700;
            font-size: 1rem;
            display: flex;
            justify-content: flex-end;
            padding-right: .07rem;

        }

         .perc-val, #placeholder{
             flex-basis: 24%;
             flex-shrink: 1;
         }
    }

</style>