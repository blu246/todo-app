<template>
    <div class="task-container">
            <app-task 
                v-for="(task, index) in tasksList"
                :key="index"
                :task="task" 
                :depth=0
                :generateTask="generateTask"
                :parentList="tasksList"
                @deleteTask="tasksList.splice(index, 1)"
            ></app-task>
    </div>
    
</template>

<script>
import bus from "../../bus.js"
import appTask from "./appTask.vue"
export default {
    components: {
        appTask
    },
    data(){return{
        testTask: {
            taskText: "some text here",
            expanded: false,
            status: "active",
            hasNextSib: false,
            editable: false,
            subtasks: [
                {
                    taskText: "this is a subtask", 
                    expanded: false,
                    status: "active",
                    hasNextSib: false,
                    editable: false,

                
                    subtasks: [
                        {taskText: "level 3 subtask", expanded: false, subtasks:[],status: "active",hasNextSib: false,editable: false,},
                        {taskText: "level 3 subtask", expanded: false, subtasks:[],status: "active",hasNextSib: false, editable: false,},

                    ]
                },
                {taskText: "this is another subtask", expanded: false, subtasks: [],status: "active",hasNextSib: false, editable: false,}
            ]
        },
        tasksList:[
            this.generateTask("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            
        ],
        
    }},

    computed:{

    },
    watch:{
        tasksList(){
            //to update % upon new task creation
            bus.$emit("statuschange");
        }
    },
    
    methods:{
        log(x){
            console.log(x);
        },
        generateTask(text=""){
            return {
                taskText: text,
                expanded: false,
                editable: true,
                status: "active", // active/done/failed
                subtasks: [],
                hasNextSib: false,
            }

        },
        newTask(){
            this.tasksList.push(this.generateTask(""));
        },
        //I know, having some of the 1st level task here presents some issues, but making it all part of appTask is a bit more complicated. Will refactor later.
        //Nope, you won't. There's no neat way to encapsule it all. A recursive comp gotta start from somewhere.

        //it's a method and not a computed prop cause it needs to call itself.
        calcPerc(list){
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
            return  total/denom;
        }
        
    },
    created(){
        bus.$on("newtask", ()=>{this.newTask();});
        this.tasksList.push(this.testTask)

        bus.$on("statuschange", ()=>{
            bus.$emit("percchange", this.calcPerc(this.tasksList));
        })
    }
    
    
}
</script>