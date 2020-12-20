<template>
    <div id="task" :class="{'dia-bg': diaBg}">
        <div 
            :style="{fontSize: textSize}"
            class="flex spc-btw"
        >
            <div 
                :class="{expandable: hasChildren}" id="task-text-wrapper"
                @click="expandTask"
            >

                <div id="i-wrapper"><i :class="taskIndicator"></i></div>

                <p 
                    ref="taskP"
                    :class="{'task-highlight': highlightTask, placeholder: showPlaceholder,}"
                    :contenteditable="task.editable"
                    @keydown="checkInput"
                    @paste="checkInput"
                    @cut="checkInput"
                >
                {{task.taskText}} 
                </p>
                {{task.hasNextSib}}
            </div>
            
            <app-task-controls 
                @mouseenter.native="highlightTask=true" 
                @mouseleave.native="highlightTask=false"
                @done="task.status = 'done'"
                @failed="task.status = 'failed'"
                @newTask="newTask"
            ></app-task-controls>

        </div>


        <div v-if="hasChildren && task.expanded">
            <app-task 
                v-for="(subtask, index) in task.subtasks" 
                :key="index" 
                :task="subtask"
                :depth="currentDepth"
                :generateTask="generateTask"
                :hasNextSib="hasNextSib"
            ></app-task>
        </div>
    </div>
</template>

<script>
import appTaskControls from './appTaskControls.vue'
export default {
    props: ["task", "depth", "generateTask", "testNextSib", "hasNextSib"], //weee
    components:{
        appTask: ()=>import('./appTask.vue'),
        appTaskControls
    },
    data(){return{
        currentDepth: this.depth + 1,
        highlightTask: false,
        showPlaceholder: false,
        diaBg: false

    }},
    // ====== computed ========
    computed:{
        hasChildren(){
            return Boolean(this.task.subtasks.length)
        },

        textSize(){
            let size;
            switch(this.currentDepth){
                case 1:
                    size = "1.5rem";
                    break;
                case 2:
                    size = "1.3rem";
                    break;
                default:
                    size = "1.2rem";
                
            }
            return size;
        },
        taskIndicator(){
            let value ="";
            value += this.hasChildren ? 'fas fa-caret-right' : 'fas fa-circle';
            if(this.task.expanded){ value += " rotate-icon"}
            const status = this.task.status;
            if(status != "active"){ value += status == "done" ? " done" : " failed"}
            console.log(value);
            return value;
        },
        

    },

    // ====== METHODS ========
    methods:{
        expandTask(){
            if(this.hasChildren && !this.task.editable){
                this.task.expanded = !this.task.expanded
            }
        },
        
        checkInput(e){
            setTimeout(()=>{
                const regexp = /^\s+$/g, 
                    text = this.$refs.taskP.innerText,
                    isEmpty = text == "" || regexp.test(text);
                
                if(e.key === "Enter"){
                    this.task.editable = false;
                    const res = text.replace(/\n/, "")
                    this.$refs.taskP.innerText = res; //remove the inserted \n
                    this.task.taskText = res;

                    if(isEmpty){
                        this.$emit("deleteTask");
                        // return;
                    }
                }
                this.showPlaceholder = isEmpty ? true : false;
                
            }, 0); //placeholder doesn't work properly; isEmpty is set falsly without it.
        },
        newTask(){
            const task = this.generateTask("");
            this.task.subtasks.push(task);
            this.task.expanded = true;
        }
        
            
    },

//======= MOUNTED =========
    mounted(){ //focuses on new task created
        const el = this.$refs.taskP,
              elText = this.$refs.taskP.childNodes[0],
              range = document.createRange(),
              sel = window.getSelection();

        range.setStart(elText, elText.length-1);
        range.collapse(true);
        sel.removeAllRanges()
        sel.addRange(range)

        el.focus()

        this.checkInput(2);
    },

}
</script>

<style scoped>
    #task{
        /* border: 1px solid #aaa; */
        padding-left: 1rem;
        line-height: 2rem;
        height: fit-content;
    }
    #task-text-wrapper{
        font-weight: 200;
        max-width: 83%;
        display: flex;
        align-items: flex-start;
        

    }
    p.task-highlight{
        /* color: var(--primary-color); */
        transform: scale(110%) translateX(4%);
    }
    .expandable:hover{
        cursor: pointer;
    }
    .expandable:hover i{
        color: var(--primary-color);

    }
    .rotate-icon{
        transform: rotate(45deg) translate(0.2em, .1em);
    }
    .fa-circle{
        font-size: .35em; /*em so that it's relative to the font size of the parent h2   */
        transform: translate(-5% ,-55%);
    }
    
    p{
        display: inline-block;
        word-wrap:break-word;
        word-break: break-all;
        margin-left: .25rem;
        /* background: rgba(61, 255, 22, 0.281); */
        /* border: 1px solid black; */
    }

    #i-wrapper i{
        padding-top: 0.1em;
    }
    .placeholder::before{
        content: "Type your task here then press enter..";
        width: fit-content;
        color: #a8a8a8;

    }
    .done{
        color: rgb(0, 226, 113);
    }
    .failed{
        color: rgb(248, 63, 63);
    }
    .strike{
        text-decoration: line-through;
    }
    .dia-bg{
        /* background: rgb(228, 219, 180); */
        position: relative;
    }
    .dia-bg:after{
        content: "";
        display: block;
        width: 0.15rem;
        height: calc(100% - 1rem);
        position: absolute;
        background: #eaeaea;
        /* transform: translate(0.1rem, -100%); */
        top: 1.5rem;
        left: 1.12rem;
    }


</style>
