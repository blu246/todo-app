<template>
    <div class="task-container">
            <app-task 
                v-for="(task, index) in tasksList"
                :key="index"
                :task="task" 
                :depth=0
                :generateTask="generateTask"
                :testNextSib="testNextSib"
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
            subtasks: [
                {
                    taskText: "this is a subtask", 
                    expanded: false,
                    status: "active",
                
                    subtasks: [
                        {taskText: "level 3 subtask", expanded: false, subtasks:[],status: "active",},
                        {taskText: "level 3 subtask", expanded: false, subtasks:[],status: "active",},

                    ]
                },
                {taskText: "this is another subtask", expanded: false, subtasks: [],status: "active",}
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
                hasNextSibling: false
            }
        },
        newTask(){
            this.tasksList.push(this.generateTask(" "));
        },
        testNextSib(arr){
            for(let i = 0; i<arr.length; i++){
                if(arr[i+1]){
                    arr[i].hasNextSibling = true;
                }
            }
        }
        
        
    },
    created(){
        bus.$on("newtask", ()=>{this.newTask();});
        this.tasksList.push(this.testTask)
    }
    
    
}
</script>