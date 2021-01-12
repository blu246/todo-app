<template>
    <div class="flex spc-btw center-y"> 
            <h1>
                {{todaysDate}} 
                <h3>({{percentageDone + " done"}})</h3>
            </h1>

            <h2 @click="newTask">
                New Task
            </h2>

    </div>
</template>

<script>
import bus from "../../bus.js"
export default {
    data(){return{
        percentageDone: "0%",
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
        }
    },
    mounted(){
        this.interval = setInterval(()=>{this.dateObject = new Date()},30000);
        bus.$on("percchange", (val)=>{
            this.percentageDone = (val * 100).toFixed(0) + "%";
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
        width: fit-content;
    }
    /* h1:after{
        content: "";
        display: block;
        height: 2px;
        background: #eee;

    } */
    h3{
        font-size: 1.2rem;
        font-weight: 100;
        display: inline-block;
        margin-left: -0.5rem;

    }
    div{
        border-bottom: 2px solid #f2f2f2;
    }
    h2{
        /* font-weight: 200; */
        font-size: 1.2rem;
    }
    h2:hover{
        cursor: pointer;
        color: var(--primary-color);
    }

</style>