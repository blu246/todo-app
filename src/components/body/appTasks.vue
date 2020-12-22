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
    
    methods:{
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
        //I know, having some of the 1st level task here presents some issues, but making it all part of appTask is a bit more complicated. Will refactor later 
        //this will run on on each expanded, will it affect performance much? Dunno..
        
    },
    created(){
        bus.$on("newtask", ()=>{this.newTask();});
        this.tasksList.push(this.testTask)
    }
    
    
}
</script>