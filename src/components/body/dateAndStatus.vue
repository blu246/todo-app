<template>
    <div class="container"> 
            <h1>{{todaysDate}}</h1>

            <div id="perc-cont">
                <h3 v-if="!(percVal==-1)">{{percString}}</h3>
                <!-- simple fix to prevent controls from shifting when the h3 above isn't showing -->
                <h3 v-else></h3>
                <date-and-status-controls id="controls"></date-and-status-controls>
            </div>

    </div>
</template>

<script>
import bus from "../../bus.js"
import dateAndStatusControls from "./dateAndStatusControls.vue"

export default {
    components:{dateAndStatusControls},

    data(){return{
        percVal: 0,
        dateObject: new Date(),
        interval: "",
    }},
    methods:{
        newTask(){
            bus.$emit("newtask");
        }
    },
    computed:{
        todaysDate(){
            const date = this.dateObject;
            const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Firday", "Saturday"];
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; //could use new Date().toLocalString() but this seems to be less likely to fail.

            const dayName = weekDays[date.getUTCDay()];
            const day = date.getUTCDate();
            const month = monthNames[date.getUTCMonth()];
            let ordinal;

            switch(day.toString().split("").reverse()[0]){
                case "1":
                    ordinal = "st";
                    break;
                case "2":
                    ordinal = "nd";
                    break;
                case "3":
                    ordinal = "rd";
                    break;
                default:
                    ordinal = "th";
            }
            if(day >=11 && day <=13){ordinal = "th"} 
            //because how dare english have consistent pronounciation

            return `${dayName}, ${day+ordinal} of ${month}`;
        },
        percString(){
            return (this.percVal * 100).toFixed(0) + "% done";
        }
    },
    mounted(){
        this.interval = setInterval(()=>{this.dateObject = new Date()},30000);
        bus.$on("percchange", (val)=>{
            this.percVal = val;
        })
    },
    umounted(){
        clearInterval(this.interval);
    }
    
}
</script>

<style scoped>
    h1{
        font-weight: 100;
        font-size: 2rem;

    }
    h3{
        font-size: 1.2rem;
        font-weight: 100;

    }
    h3:before{content: "("}
    h3:after{content: ")"}

    .container{
        border-bottom: 2px solid #f2f2f2;
        display: flex;

    }
    #perc-cont{
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        flex-grow: 1;
        padding-bottom: .25rem;
    }
   

    @media only screen and (max-width:700px){
        .container{
            flex-direction: column;
            padding: .4rem 0;
        }
        h1{
            display: none;
        }
        h3{
            font-weight: 700;
            font-size: 1.2rem;
        }
        h3:before{content: ""}
        h3:after{content: ""}
    }


</style>



