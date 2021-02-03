<template>
    <div class="container"> 
            <h1 @click="showDatePicker=true">
                {{dateString}} 
                <!-- <h3 v-if="showPerc">({{percString}})</h3> -->
                <date-picker 
                    v-if="showDatePicker"
                    @closedatepicker="showDatePicker = false"
                    :passedDate="{...selectedDate}"
                ></date-picker>
            </h1>

            <date-and-status-controls id="controls"></date-and-status-controls>
            {{showDatePicker}}

    </div>
</template>

<script>
import bus from "../../bus.js"
import dateAndStatusControls from "./dateAndStatusControls.vue"
import datePicker from "./datePicker.vue"

export default {
    components:{dateAndStatusControls, datePicker},
    data(){return{
        percVal: 0,
        dateObject: new Date(),
        interval: "",
        showDatePicker: false,
        selectedDate: {},
    }},
    methods:{
        log(x){console.log(x);},
        newTask(){
            bus.$emit("newtask");
        },
        checkOrdinal(day){
            let ordinal;
            const firstDigit = day.toString().split("").reverse()[0]

            switch(firstDigit){
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

            return ordinal;
        },
        
    },

    computed:{
        todaysEqualsSelected(){
            const td = this.todaysDate, sd = this.selectedDate;
            if(sd.day == td.day && sd.month == td.month && sd.year == td.year ){
                 return true;
            } else{
                return false;
            }
        },
        todaysDate(){
            const date = new Date();  
            return {
                day: date.getUTCDate(),
                month: date.getUTCMonth(), //january = 0
                year: date.getUTCFullYear(), 
            }
        },
        dateString(){
            const date = this.dateObject;
            const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Firday", "Saturday"];
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; //could use new Date().toLocalString() but this seems to be less likely to fail.

            const dayName = weekDays[date.getUTCDay()];
            const day = date.getUTCDate();
            const month = monthNames[date.getUTCMonth()];

            const ordinal = this.checkOrdinal(day);
            

            if(!this.todaysEqualsSelected){
                const sd = this.selectedDate;
                return "Tasks from " + sd.day + this.checkOrdinal(sd.day) +" of "+ monthNames[sd.month]; 
            }

            if(bus.onMobile){
                return month + " " + day+ordinal;
            }
            return `${dayName}, ${day+ordinal} of ${month}`;
        },
       


        percString(){
            return (this.percVal * 100).toFixed(0) + "% done";
        },
        showPerc(){
            return !(this.percVal==-1) && !bus.onMobile;
        }
    },
    mounted(){
        this.interval = setInterval(()=>{this.dateObject = new Date()},30000);
        
    },
    created(){
        bus.$on("percchange", (val)=>{
            this.percVal = val;
        });
        
        const obj = {...this.todaysDate}
        this.selectedDate = obj;
        bus.$on("selecteddateupdated", date => this.selectedDate = {...date})

    },
    updated(){
    },

    umounted(){
        clearInterval(this.interval);
    },
    
}
</script>

<style scoped>
    h1{
        font-weight: 200;
        font-size: 2rem;
        display: inline-block;
        position: relative;
    }
    
    
    h3{
        display: inline-block;
        font-size: 1.2rem;
        font-weight: 100;
        margin-left: -.3rem

    }

    .container{
        border-bottom: 2px solid #f2f2f2;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;


    }
    

    
   

    @media only screen and (max-width:700px){
        .container{
            padding: .4rem 0;
            justify-content: space-between;
        }
        h1{
            font-size: 1.2rem;
            font-weight: 600;
        }
        h3{
            display: none;
        }
    }


</style>



