<template>
  <div class="root">
        <div class="veil"></div>
        <div id="date-picker-body">
            <div 
                name="month" 
                id="month-year-picker-container" 
            >
                <i class="fas fa-caret-left" @click.stop="monthYearArrowFunc('dec')"> </i>
                <div id="year-month-text" @click.stop="showMonthGrid=!showMonthGrid">
                    <span 
                        v-if="!showMonthGrid"
                    >
                        {{months[selectedDate.month]}}
                    </span>
                    {{selectedDate.year}}
                </div>
                <i class="fas fa-caret-right" @click.stop="monthYearArrowFunc('inc')"> </i>

            </div>

            <div class="days-picker-container">
                    <div id="days-grid" v-if="!showMonthGrid">
                        <!-- the labels. Mon, Tue,... -->
                        <div class="day-label">Mon</div>
                        <div class="day-label">Tue</div>
                        <div class="day-label">Wen</div>
                        <div class="day-label">Thu</div>
                        <div class="day-label">Fri</div>
                        <div class="day-label">Sat</div>
                        <div class="day-label">Sun</div>
                        
                        <!-- pre-fillers to align date with weekday -->
                        <div 
                            class="day-number fillers"
                            v-for="i in monthFirstDay"
                            :key="i+Math.random()*100"
                        >
                        </div>

                        <!-- actual numbers -->
                        <div 
                            class="day-number"
                            v-for="day in numberOfDays"
                            :key="day"
                            :class="{
                                        'is-empty': isDayEmpty(day),
                                        'is-today': day == todaysDate.day
                                                    && todaysDate.month == selectedDate.month
                                                    && todaysDate.year == selectedDate.year,

                                        'is-selected': day == passedDate.day 
                                                    && selectedDate.month == passedDate.month
                                                    && selectedDate.year == passedDate.year,
                                    }"
                            @click.stop="selectedDate.day = day; $emit('closedatepicker'); emitDateSelected()"
                        >
                                
                                {{day}}
                        </div>

                        <!-- post fillers -->
                        <div 
                            class="day-number fillers"
                            v-for="i in numOfPostFillers"
                            :key="i+Math.random()*100"
                        >
                            
                        </div>

                    </div>

                <div id="months-grid" v-else>
                    <div 
                        v-for="(month, index) in months"
                        :key="month"
                        @click.stop="selectedDate.month=index; showMonthGrid=false"
                        class="month"
                        :class="{'is-selected': index == selectedDate.month}"
                    >
                        {{month}}
                    </div>
                </div>
            </div>
    </div>
  </div>
</template>

<script>
import bus from "../../bus.js"
export default {
    props:["passedDate"],

    data(){return{
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        showMonthGrid: false,
        selectedDate: {...this.passedDate},
    }},

    computed:{
        todaysDate(){
            const date = new Date();  
            return {
                day: date.getUTCDate(),
                month: date.getUTCMonth(), //january = 0
                year: date.getUTCFullYear(), 
            }
        },
        monthFirstDay(){
            const sd = this.selectedDate;
            //return the weekday of day 1 of a month (e.g: 1st february = tuesday); I know, amazing name :p
            const date = new Date(sd.year, sd.month, 1, 12);
            const i = date.getUTCDay() - 1;
            return i == -1 ? 6 : i; 
            // ^ days are 0-based. Sunday = 0; The calendar is shifted by one day: monday = 0; 0-1 = -1 which causes an array error; if the month starts on sunday, 6 fillers are required. 

        },
        numOfPostFillers(){
            const req = 7 - ((this.numberOfDays + this.monthFirstDay) % 7);
            return req < 7 ? req : 0;
        },
        numberOfDays(){
            const month = this.selectedDate.month, year = this.selectedDate.year;
            if(month == 3 || month == 5 || month == 8 || month == 10){
                return 30;
            }
            else if (month == 1){
                if(year%4 == 0){
                    return 29;
                } else {
                    return 28;
                }
            } 
            else {
                return 31;
            }
        },
    },

    methods:{
        log(x){console.log(x)},
        
        isDayEmpty(day){
            const d = {...this.selectedDate};
            const dString = d.year +"-"+ (d.month+1) +"-"+ day;
            let list = window.localStorage.getItem(dString);
            if(list){
                list = JSON.parse(list);
                if(list.length){
                    return false;
                } else{
                    return true;
                }
            } else {
                return true;
            }
        },

        monthYearArrowFunc(dir){
            const mod =  dir == "dec" ? -1 : 1;
            const sd = this.selectedDate;
            //whether to decrement or increment;

            if(!this.showMonthGrid){
                sd.month += mod;
                if(sd.month == 12){
                    sd.month = 0;
                    sd.year++;
                }
                else if(sd.month == -1){
                    sd.month = 11;
                    sd.year--;
                }
            } else{
                sd.year = sd.year + mod;
                //+= doesn't work here cause reference type(?)
            }
        },


        emitDateSelected(){
            bus.$emit("selecteddateupdated", this.selectedDate)
        }
    },
    
}
</script>

<style scoped>
    #date-picker-body{
        /* position: fixed; */
        background: var(--bg-primary);
        z-index: 5;
        /* border: 1px solid red; */
        top: 90%;
        left: 2rem;
        font-size: 1rem;
        box-shadow: 2px 2px 5px rgba(43, 43, 43, 0.247), -1px -1px 10px #2222221e;
        padding: .5rem .2rem;

    }
    #month-year-picker-container{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        height: 100%;
        margin: 0 3rem;
        white-space: nowrap
    }
    #year-month-text{
        text-align: center;
        padding: .2rem 0;
        width: 7rem;
    }
    #year-month-text:hover, .month:hover{
        cursor: pointer;
        background: #00000005;
    }
    #months-grid{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        text-align: center;
        grid-gap: 1px;
        background: #eee;
        margin: 1rem .5rem 0;
    }
    .month{
        background: white;
        /* border-bottom: 1px solid rgb(241, 241, 241);
        border-left: 1px solid rgb(241, 241, 241); */
        padding: .5rem;
        text-align: center;
    }

    #days-grid{
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        text-align: center;
        grid-gap: 1px;
        background: #eee;
        margin: .3rem;
    }
    .day-label, .day-number{
        padding: .5rem .2rem;
        background: white;
        border: 2px solid transparent;
        color: #222;
    }
    .day-number:hover{
        cursor: pointer;
        background: #00000001;
    }
    .day-number{
        font-weight: 200;   
    }

    .day-label{
        padding-bottom: 0;
        border-bottom: 1px solid #dfdfdf;
        font-weight: 600;
    }

    .is-today{
        font-weight: 600;
    }
    .is-selected{
        border: 2px solid #969696;
    }
    .is-empty{
        color: rgb(160, 160, 160);
        
    }
    /* .is-empty:after{
        content: "";
        position: absolute;
        height: 100%;
        width: 100%;
        background: rgb(211, 211, 211);
        top: 0;
        left: 0;
        clip-path: polygon(79% 21%, 81% 24%, 25% 80%, 23% 78%);
    } */
    #month-year-picker-container i{
        font-size: 1.3rem;
        padding: 0 1rem;
    }
    #month-year-picker-container i:hover{
        cursor: pointer;
        color: var(--primary-color);
    }

    @media only screen and (max-width: 600px){
        #date-picker-body{
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            min-width: 85vw;
            min-height: 65vw;
            z-index: 7;
        }
        .veil{
            content: "";
            position: fixed;
            height: 200vh;
            width: 200vw;
            background: #00000040;
            z-index: 5;
            top: -20%;
            left: -20%;
            
        }
    }
</style>