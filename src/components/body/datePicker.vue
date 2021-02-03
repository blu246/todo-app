<template>
    <div id="date-picker-body">
            <div 
                tabindex="-1" 
                name="month" 
                id="month-year-picker-container" 
            >
                <i class="fas fa-caret-left" @click="monthYearArrowFunc('dec')"> </i>
                <div id="year-month-text" @click="showMonthGrid=!showMonthGrid">
                    <span 
                        v-if="!showMonthGrid"
                    >
                        {{months[selectedDate.month]}}
                    </span>
                    {{selectedDate.year}}
                </div>
                <i class="fas fa-caret-right" @click="monthYearArrowFunc('inc')"> </i>

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
                                        'is-today': day == todaysDate.day,
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
                        @click="selectedDate.month=index; showMonthGrid=false"
                        class="month"
                        :class="{'is-selected': index == selectedDate.month}"
                    >
                        {{month}}
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
            return date.getUTCDay() - 1;
            // (num of pre fillers)

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
            return !window.localStorage.getItem(dString); 
        },
        monthYearArrowFunc(dir){
            const mod =  dir == "dec" ? -1 : 1;
            //whether to decrement or increment;

            if(!this.showMonthGrid){
                this.selectedDate.month += mod;
                if(this.selectedDate.month == 12){
                    this.selectedDate.month = 0;
                    this.selectedDate.year++;
                }
                else if(this.selectedDate.month == -1){
                    this.selectedDate.month = 11;
                    this.selectedDate.year--;
                }
            } else{
                this.selectedDate.year = this.selectedDate.year + mod;
                //+= doesn't work here reference type(?)
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
        position: absolute;
        background: var(--bg-primary);
        z-index: 5;
        border: 1px solid red;
        top: 0;
        left: 2rem;
        font-size: 1rem;
    }

    #month-year-picker-container{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        min-width: 30vw;
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
        grid-gap: 0;
    }
    .month{
        border-bottom: 1px solid rgb(241, 241, 241);
        border-left: 1px solid rgb(241, 241, 241);
        padding: .5rem;
        text-align: center;
    }
    .month:nth-child(n+10){
        border-bottom: none;
    }
    .month:nth-child(1),
    .month:nth-child(4),
    .month:nth-child(7),
    .month:nth-child(10){
        border-left: none;
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
        padding: .2rem;
        background: white;
        border: 2px solid transparent;
        color: #222;
    }
    .day-number:hover{
        cursor: pointer;
        background: #00000001;
    }

    .day-label{
        padding-bottom: 0;
        border-bottom: 1px solid #dfdfdf;
        font-weight: 400;
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
</style>