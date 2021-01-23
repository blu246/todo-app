<template>
 <header class="shadow py-2r bg-primary">
     <div class="container flex spc-btw my-auto">
        <h1> <i class="fas fa-microchip"></i>BrainCache</h1>
        <div class="clock flex center-y">
            <h3>{{date}}</h3>
            <h2>{{time}}</h2>
        </div>
     </div>
 </header>
 
</template>

<script>
export default {
    data(){return{
            date: "",
            time: "",
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

    h2,h3{
        font-weight: 200;
    }
    h3{
        margin-right: .25rem;
        padding-right: .25rem;
        border-right: 2px  #ccc solid;
    }
    h2{
        font-size: 1.8rem;
    }

    @media only screen and (max-width: 600px) {
        .container{
            justify-content: center;
        }
        .clock{
            display: none;
            /* cause you got a clock on mobile */
        }
        h1{
            font-size: 1.6rem;
        }
    }

</style>