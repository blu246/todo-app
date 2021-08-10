<template>
  <div class="root ">
        <transition name="veil-fade">
            <div v-if="anm_showElements" class="veil anm-fade-in" ref="veil" @click.stop="closePicker"></div>
        </transition>

        <div class="widget-body-container" @click.stop="closePicker">
            <transition name="widget-expand-up" @after-leave="$emit('close')">
                <div v-if="anm_showElements" id="date-picker-body" class="br-rnd shadow" @click.stop ref="pickerBody">
                    
                    <div class="close-btn-container">
                        <i class="fas fa-times btn-hover" @click="closePicker"></i>
                    </div>
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
                                <div class="day-label" v-for="day in days" :key="day">{{day}}</div>
                                
                                
                                <!-- pre-fillers to align date with weekday -->
                                <div 
                                    class="day-number fillers"
                                    v-for="i in monthFirstDay"
                                    :key="i+Math.random()*100"
                                    @click.stop

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
                                    @click.stop="dayPicked(day)"
                                >
                                        
                                        {{day}}
                                </div>

                                <!-- post fillers -->
                                <div 
                                    class="day-number fillers"
                                    v-for="i in numOfPostFillers"
                                    :key="i+Math.random()*100"
                                    @click.stop
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

                    <div class="preference-container">
                        <div class="faux-checkbox checkbox-checked" @click="closeOnSelectionMethod">
                                <i class="fas fa-check" v-if="closeOnSelection"></i>
                        </div>
                        <p>Close on selection</p>
                    </div>
            
            
            </div>
        </transition>
    </div>

  </div>
</template>

<script>
import bus from "../../bus.js"
export default {
    props:["passedDate"],

    data(){return{
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        days:["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        showMonthGrid: false,
        selectedDate: {...this.passedDate},
        closeOnSelection: false,
        anm_showElements: false,

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
        },

        closePicker(){
            // bus.closeWithDelay(this.$refs.pickerBody, this.$refs.veil, this)
            this.anm_showElements = false;
        },
        closeOnSelectionMethod(){
            this.closeOnSelection = !this.closeOnSelection;
            window.localStorage.setItem("closeOnSelectionPreference", this.closeOnSelection);
        },
        dayPicked(day){
            this.selectedDate.day = day;
            this.emitDateSelected()
            if(this.closeOnSelection){
                this.closePicker();
            }
        }

        
    },
    created(){
        this.closeOnSelection = JSON.parse(window.localStorage.getItem("closeOnSelectionPreference"));
        bus.$on("appTasks_closeOpenWindow", ()=>{
            if(this.$refs.veil){
                this.closePicker();
            }
        });
    },
    mounted(){
        this.anm_showElements = true;
    }
    
}
</script>

<style scoped>
    #date-picker-body{
        /* position: fixed; */
        background: var(--bg-primary);
        /* z-index: 20; */
        /* top: 50%; */
        /* left: 50%; */
        /* transform: translate(-50%, -50%); */
        font-size: 1rem;
        padding: 1.2rem;
        cursor: initial;
        color: initial;
        border: var(--shadow-subs-border)

    }
    #month-year-picker-container{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        /* height: 100%; */
        margin: 0 3rem;
        white-space: nowrap;
    }
    #year-month-text{
        text-align: center;
        padding: .8rem 0;
        font-weight: 500;
        width: 7rem;
    }
    #year-month-text:hover, .month:hover{
        cursor: pointer;
        /* background: #00000009; */
        background: var(--bg-hover);
    }
    #months-grid{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        text-align: center;
        grid-gap: 1px;
        /* background: #eee; */
        background: var(--separator2);
        margin: 1rem .5rem 0;
        border: 1px solid var(--separator2);
    }
    .month{
        background: var(--bg-primary);
        /* border-bottom: 1px solid rgb(241, 241, 241);
        border-left: 1px solid rgb(241, 241, 241); */
        padding: 1.5rem;
        text-align: center;
    }

    #days-grid{
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        text-align: center;
        grid-gap: .995px;
        background: var(--separator2);
        margin: .3rem;
        border: 1px solid var(--separator2);
    }
    .day-label, .day-number{
        padding: .7rem .5rem;
        /* background: white; */
        background: var(--bg-primary);
        border: 2px solid transparent;
        color: var(--text-color-darker);
        font-weight: 700;
    }
    .day-label{
        color: var(--text-color-darker);
        background: var(--bg-darker);
    }
    .day-number:hover{
        cursor: pointer;
        /* background: #00000001; */
        background: var(--bg-hover-dark);
    }

    .day-number.fillers{
        cursor: default;
        background: initial;
        background: var(--bg-primary);
    }

    .day-number.is-selected{
        border: 2px solid var(--separator4);
        color: var(--text-color2);
        /* background: var(--bg-inv) */
    }
    .day-number.is-today{
        font-weight: 800;
        color: var(--primary-color);
    }
    .is-empty{
        /* color: rgb(160, 160, 160); */
        color: var(--text-color-light);
        font-weight: 500;

        
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
        padding: 0.5rem 1rem;
    }
    #month-year-picker-container i:hover{
        cursor: pointer;
        color: var(--primary-color);
    }

    .preference-container{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem 1rem .2rem;
        margin-top: 1rem;
        /* border-top: 2px solid var(--separator2); */
    }
    .faux-checkbox{
        height: 1.2rem;
        width: 1.2rem;
        border: .15rem solid #c4c4c4;
        border-radius: 3px;
        display: grid;
        place-content: center;
        cursor: pointer;
        margin-right: .3rem;
    }
    .faux-checkbox i{
        color: var(--primary-color);
        font-size: 1rem;
        animation: pop-in .5s ease forwards;
        transform-origin: 50% 50%;
    }
    .preference-container p{
        font-weight: 500;
        color: #555;
        font-size: 1rem;
    }
    
    @keyframes pop-in{
        0%{
            transform: scale(0%);
        }
        80%{
            transform: scale(130%);
        }
        100%{
            transform: scale(100%);
        }
    }
    
    .close-btn-container{
        display: flex;
        justify-content: flex-end;
        color: var(--text-color-light);
        padding: 0 .2rem;
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
            padding: .5rem .2rem;
        }
        .day-number, .day-label{
            padding: .5rem .3rem;
        }
        #days-grid{
            margin: .1rem;
        }
        .month{
            padding: 1rem .3rem;
        }
    }
</style>