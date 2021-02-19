<template>
    <div class="tasks-container">
        <!-- if something is broken, change tasks-con to task-con -->
            <template v-if="tasksList.length">
                <app-task 
                    id="task"
                    v-for="(task, index) in tasksList"
                    :key="task.taskText+index"
                    :task="task" 
                    :depth=0
                    :generateTask="generateTask"
                    :parentList="tasksList"
                    :expandCollapse="expandCollapse"
                    @deleteTask="tasksList.splice(index, 1)"
                ></app-task>
            </template>
            <no-tasks v-else></no-tasks>

            {{flatList.map(task=>{
                return task.taskText;
            })}}
 
    </div>
    
</template>

<script>
import bus from "../../bus.js"
import appTask from "./appTask.vue"
import noTasks from "./noTasks.vue"
export default {
    components: {
        appTask,
        noTasks

    },
    data(){return{
        // testTask: {
        //     taskText: "some text here",
        //     expanded: false,
        //     status: "active",
        //     hasNextSib: false,
        //     editable: false,
        //     subtasks: [
        //         {
        //             taskText: "this is a subtask", 
        //             expanded: false,
        //             status: "active",
        //             hasNextSib: false,
        //             editable: false,

                
        //             subtasks: [
        //                 {taskText: "level 3 subtask", expanded: false, subtasks:[],status: "active",hasNextSib: false,editable: false,},
        //                 {taskText: "level 3 subtask", expanded: false, subtasks:[],status: "active",hasNextSib: false, editable: false,},

        //             ]
        //         },
        //         {taskText: "this is another subtask", expanded: false, subtasks: [],status: "active",hasNextSib: false, editable: false,}
        //     ]
        // },
        tasksList: [],
        selectedDate: "",
        flatListSelectedIndex: -1,
    }},

    watch:{
        tasksList:{
            deep: true,
            handler(){
                //to update %done upon new task creation
                bus.$emit("statuschange");
                this.storeTasksList(this.selectedDate);
            }
        },


    },
////////////COMPUTED////////
computed:{
    todaysDate(){
        const date = new Date();  
        return date.getUTCFullYear() + "-" + (date.getUTCMonth()+1) + "-" + date.getUTCDate();
    },
    flatList(){
        return this.flattenList(this.tasksList)
    }
    
},

//////////// METHODS ///////////
    methods:{
        log(x){
            console.log(x)
        },
        generateTask(text=""){
            return {
                taskText: text,
                expanded: false,
                editable: true,
                status: "active", // active/done/failed
                subtasks: [],
                hasNextSib: false,
                isSelected: false
            }

        },
        newTask(){
            this.tasksList.push(this.generateTask(""));
        },
        //I know, having some of the 1st level task here presents some issues, but making it all part of appTask is a bit more complicated. Will refactor later.
        //Nope, you won't. There's no neat way to encapsule it all. A recursive comp gotta start from somewhere.

        //it's a method and not a computed prop cause it needs to call itself.
        calcPerc(list){
            if(!this.tasksList.length){return -1}

            const denom = list.length;
            let total = 0; 

            for(const task of list){
                
                switch(task.status){
                    case "done":
                        total++;
                        break;

                    case "failed":
                        //should there be a penalty? Shoudld "failed" be removed entirely??
                        break;
                    
                    case "active":
                        if(task.subtasks.length){
                            total += this.calcPerc(task.subtasks);
                        }
                    
                }
            }
            //for when denom=0, to avoid returning NaN;
            if(denom==0){return 0}

            return  total/denom;
        },

       
        storeTasksList(day){
            //storing all the days in a [year].[month].[day] object will make it neater but retreiving the data means retreiving the whole massive object. ==> Why I'm storing each day in its own "day/month/date" localstorage entry.
            const data = JSON.stringify(this.tasksList);
            window.localStorage.setItem(day, data);
        },
        retrieveTasksList(day){
            let data = window.localStorage.getItem(day);
            if(!data){data="[]"}
            this.tasksList  = JSON.parse(data);
        },

        dateAndStatusControls(type){
            switch(type){
                case "newTask":
                    this.newTask();
                    break;
                case 'expand':
                    this.expandCollapse(this.tasksList, true);
                    break;
                case 'collapse':
                    this.expandCollapse(this.tasksList, false);
                    break;
            }
        },

        expandCollapse(list, action){
            //true-> expand. false -> collapse;
            for(const task of list){
                task.expanded = action;
                if(task.subtasks.length){
                    this.expandCollapse(task.subtasks, action);
                }
            }
        },
        // async taskSearchFunc(input){
        //     //the function used to search through tasks to find a match for user input, if it wasn't obvious enough
        //     const list = await JSON.parse(JSON.stringify(this.tasksList));
            
        //     let outputList = await (()=>{
        //         for(const task of list){
        //             if(task.subtasks.length){
        //             //reach childless tasks first, and work up from there
        //                 task.matchFound = this.taskSearchFunc(task.subtasks);
        //             }

        //             // mark matches
        //             if(task.taskText.includes(input)){
        //                 const re = RegExp(input), rep = "<mark>" + input + "</mark>";
        //                 task.taskText.replace(re, rep);
        //                 task.matchFound = true;
        //             }

        //             return 



        //         }
        //     })();
        //     return outputList;

        // }

        //flatListArr = [] before calling func bellow
        flattenList(list){
            const flatlist = [];
            list.forEach((task)=>{
                flatlist.push(task);
                if(task.expanded && task.subtasks.length){
                    flatlist.push(...this.flattenList(task.subtasks));
                }
            })
            flatlist.forEach((task, i)=>task.flatindex = i);
            return flatlist;
        }
    },
    
    //////////// HOOKS ///////////
    created(){
        //assigning the value here instead of in data() solved the selectedDate being set to undefined problem. Dunno why
        this.selectedDate = this.todaysDate;

        this.retrieveTasksList(this.todaysDate);

        bus.$on("statuschange", ()=>{
            bus.$emit("percchange", this.calcPerc(this.tasksList));
        })

        bus.$on("dateandstatuscontrols", (type)=>{this.dateAndStatusControls(type)});

        bus.$on("selecteddateupdated", (sd)=>{
            this.selectedDate = (sd.year +"-"+ (sd.month+1) +"-"+ sd.day);
            this.retrieveTasksList(this.selectedDate);
        });
        //I think we foolishly assumed that this was going to be a small app that didn't require vuex

        bus.$on("apptasksshortcutevents", (e)=>{
            switch(e.key){
                case "ArrowDown":
                    (()=>{
                        let i = this.flatListSelectedIndex;
        
                        if(i > -1){this.flatList[i].isSelected = false}
            
                        i = i < (this.flatList.length-1) ? ++i : 0;
                        
                        console.log(i)
                        this.flatListSelectedIndex = i;
                        this.flatList[i].isSelected = true;
                    })();

            }
        });
        
    },

    
    
}
</script>

<style scoped>
    @media only screen and (max-width: 500px){
    /* To remove the padding on the first task on mobile since space is more limited  */
        #task{
            padding-left: .1rem;
        }
    }
</style>