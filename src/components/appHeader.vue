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
    header{
        padding: 0 .5rem;
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
        background: rgb(219, 219, 219);
        width: 1px;
        height: 1.2rem;
        margin: 0 .3rem;


    }
    .placeholder{
        display: none;
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