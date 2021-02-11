<template>
    <div id="task" :class="taskIndLine" v-show="showTask">
        <div 
            :style="{fontSize: textSize}"
            class="flex spc-btw"
            id="task-flex-container"
            :class="{'task-highlight': highlightTask}"
            @contextmenu="showContextMenu"
            ref="taskContent"
        >

            <app-controls-menu 
                v-if="showMenu"
                :cords="menuCords"
                :hasChildren="hasChildren"
                @menuevent="menuEvent"
            ></app-controls-menu>

        
            <div 
                :class="{expandable: hasChildren}" id="task-text-wrapper"
                @click=" expandTask"
            >
                <div id="i-wrapper"><i :class="taskIndicator"></i></div>

                <p 
                    ref="taskP"
                    :class="{placeholder: showPlaceholder,}"
                    :contenteditable="task.editable"
                    @keydown="checkInput"
                    @paste="checkInput"
                    @cut="checkInput"
                    @blur="checkInput($event, true)"
                >
                    <span  
                        class="mark-cont" 
                        v-if="search_inSearchMode && search_containsMatch" 
                        v-html="search_modifiedTaskText"
                    ></span>
                    <span v-else>{{task.taskText}}</span>
                </p>
            </div>
            
            <app-task-controls 
                @taskdone="controlsEvent('done')"
                @menuevent="menuEvent"
                :status="task.status"

            ></app-task-controls>


        </div>


        <div v-if="hasChildren && task.expanded">
            <app-task 
                v-for="(subtask, index) in task.subtasks" 
                :key="index" 
                :task="subtask"
                :depth="currentDepth"
                :generateTask="generateTask"
                :checkNextSib="checkNextSib"
                :parentList="task.subtasks"
                :expandCollapse="expandCollapse"
                @deleteTask="task.subtasks.splice(index, 1)"
                @childcontainsmatch="childMatchEventFunc"
            ></app-task>
            <!-- will clean this ^ mess soon enough -->
            <!-- will you though? -->
        </div>
    </div>
</template>

<script>
import appTaskControls from './appTaskControls.vue'
import appControlsMenu from './appControlsMenu.vue'
import bus from '../../bus.js';

export default {
    props: ["task", "depth", "generateTask", "checkNextSib", "parentList", "expandCollapse"],
    components:{
        appTask: ()=>import('./appTask.vue'),
        appTaskControls,
        AppControlsMenu: appControlsMenu
    },

    data(){return{
        currentDepth: this.depth + 1,
        highlightTask: false,
        showPlaceholder: false,

        // true if task has been edited in the currest session (1 sesion: page load --> leave/reload)
        //this is a fix for the cursor being placed 1 letter in after it's been edited once.
        wasEdited: false,
        showMenu: false,
        contextMenuPrevClickPos: 0,
        menuCords: {},
        //vars for while in search mode
        search_childContainsMatch: false,
        search_containsMatch: false,
        search_inSearchMode: false,
        search_modifiedTaskText: "",
       

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
            return value;

        },

        taskIndLine(){
            this.testNextSib();
            return (this.task.expanded && this.task.hasNextSib && this.hasChildren) ? 'task-ind-line' : "";
        },
        showTask(){
            // console.log(this.task.taskText, !this.search_inSearchMode || (this.search_inSearchMode && (this.search_containsMatch || this.search_childContainsMatch)))
            // console.log("SM:",this.search_inSearchMode, "CM:",this.search_containsMatch, "CCM:",this.search_childContainsMatch)
            //don't wanna retype it if ever needed

            return !this.search_inSearchMode || (this.search_inSearchMode && (this.search_containsMatch || this.search_childContainsMatch))
        }

        

    },
    // ====== WATCHED ========
    watch:{
    },

    // ====== METHODS ========
    methods:{
        log(a){console.log(a)},
        expandTask(){
            if(this.hasChildren && !this.task.editable){
               this.task.expanded = !this.task.expanded
            }
        },

        testNextSib(){
            const list  = this.task.subtasks;
            if(list.length){
                for(let task of list){
                    task.hasNextSib = true;
                }
                list[list.length-1].hasNextSib = false;
            }
            //Yes! I know a child shouldn't mutate its parent's data, but in this recursive application, doing it the "proper" way would result in an unecessary duplication of lines. I already have enough of that, and I hate it.
        },
        checkInput(e, isBlurSave){

            //keeps the function tidy. Basically if element loses focus, treats it as a "Enter" input
            if(isBlurSave){
                e.key = "Enter"
            }

            setTimeout(()=>{
                const regexp = /^\s+$/g, 
                    text = this.$refs.taskP.innerText,
                    isEmpty = text == "" || regexp.test(text);
                
                if(e.key === "Enter"){
                    this.task.editable = false;
                    const res = text.replace(/\n/, "").replace(/\n/, ""); 
                    this.$refs.taskP.innerText = res; //remove the inserted \n
                    this.task.taskText = res;


                    if(isEmpty){
                        this.$emit("deleteTask");
                    // return;
                     }
                    
                }
                this.showPlaceholder = isEmpty ? true : false;
                
                
            }, 2); //placeholder doesn't work properly; isEmpty is set falsly without the delay.
        },
        
        newTask(){
            const task = this.generateTask("");
            this.task.subtasks.push(task);
            this.task.expanded = true;
        },

        controlsEvent(type){
            switch(type){
                case "done":
                    this.task.status = this.task.status == "done" ? "active" : "done";
                    break;

                // case "failed":
                //     this.task.status = this.task.status == "failed" ? "active" : "failed";
                //     break;

                // case "newtask":
                //     this.newTask();
                //     break;
            }   
        },

        menuEvent(type){
            switch(type){
                case "edit":
                    this.editTask();
                    break;
                
                // case "rearm":
                //     this.task.status = "active"
                //     break;

                case "newtask":
                    this.newTask();
                    break;

                case "delete":
                    this.$emit("deleteTask");
                    break;

                case "expandall":
                    this.task.expanded = true;
                    this.expandCollapse(this.task.subtasks, true);
                    break;

                case "collapseall":
                    this.task.expanded = false;
                    this.expandCollapse(this.task.subtasks, false);
                    break;
            }
        },
        editTask(e){
            this.task.editable = true;
            this.focusTask();  
            if(e){e.preventDefault()}
        },

        focusTask(){
            setTimeout(
                ()=>{
                    if(this.task.editable == false){
                        return; 
                    }
                    const el = this.$refs.taskP,
                        elText = this.$refs.taskP.childNodes[0],
                        range = document.createRange(),
                        sel = window.getSelection();

                    //fix for cursor placed 1 letter in after 1st edit.
                    const modifier = this.task.firstEdit ? 1 : 0;

                    range.setStart(elText, elText.length - modifier);
                    range.collapse(true);
                    sel.removeAllRanges()
                    sel.addRange(range)
                    el.focus()
                }, 1
            )
        },


        //don't see a point in this.
        //this is to check if the status is to turn green because all the children are green.
        // checkStatus(){
        //    if(!this.task.expanded){
        //         const length = this.task.subtasks.length; 

        //         if(length && this.task.status !== "failed"){
        //             let counter = 0;
        //             for(const task of this.task.subtasks){
        //                 if(task.status === "done"){
        //                     counter++;
        //                 }
        //             }
        //             if(counter === length){
        //                 this.task.status = "done";
        //             } else {
        //                 this.task.status = "active";
        //             }
        //         }
        //    }
        // },

        showContextMenu(e){
            const eX = e.clientX, eY = e.clientY;

            //so you can doubleclick same position to get native contextmenu
            if(this.showMenu && this.contextMenuPrevClickPos == eX*eY){
                return;
            }
            e.preventDefault();
            this.contextMenuPrevClickPos = eX * eY;


            //need the delay cause otherwise the bodyclick event will hide the menu cause it registers after the event from here with a little delay, so we delay this so it happens after it;

            //stop even propagation to avoid this ^ altogether. will change later
            setTimeout(()=>{
                const tar = e.target, el = this.$refs.taskContent;
                //check whether click is on task or one of the children (p or textnode);
                if(
                    el == tar || el == tar.parentElement || el == tar.parentElement.parentElement
                    //is there a better way?
                ){
                    this.showMenu = true;
                    
                    const rect = el.getBoundingClientRect();
                    const x = eX - rect.left; //x position within the element.
                    const y = eY - rect.top;

                    // this.menuCords = {x: e.clientX, y: e.clientY}
                    this.menuCords = {rX: x, rY: y, aX: eX, aY: eY }
                    // rx/y: relative to task. ax/y actual position (relative to window)
                } else {
                    this.showMenu = false;
                }
            }, 0)

        },
        searchTask(input){
            if(input){
                this.search_childContainsMatch = false;

                this.search_inSearchMode = true
                const re = RegExp(input, "gi");

                if(re.test(this.task.taskText)){
                    const matches = this.task.taskText.match(re);

                    let text = this.$sanitize(this.task.taskText);
                    for(const val of matches){
                        text = text.replace(val, "<mark>"+val+"</mark>");
                    }
                    this.search_modifiedTaskText = text;
                    //Do I know that this ^ mess is inefficient and ineloquent? yes. Do I know how to do better RIGHT NOW? Nope. 

                    this.search_containsMatch = true;
                    this.$emit("childcontainsmatch", true)
                } else{
                    this.search_containsMatch = false;
                    this.search_modifiedTaskText = "";
                }

            } else{
                this.search_inSearchMode = false
                this.search_modifiedTaskText = "";


            }
        },
        childMatchEventFunc(bool){
            this.search_childContainsMatch = bool; 
            this.$emit("childcontainsmatch", bool)
        },
        
    },  
        
            

//======= MOUNTED =========
    mounted(){ 
        if(this.task.editable){
            //check input
            this.checkInput("");
            //focuses on new task created
            this.focusTask();
        }
        // See whether to render the line below the taskIndicator or not
        this.testNextSib();

        
    },
//////////////////created//////////
    created(){
        //detect body clicks
        bus.$on("bodyclicked", ({e, type})=>{
            this.showMenu = false;
            e;type;
        });

        //for search fun
        bus.$on("tasksearchinput", this.searchTask)
    },

/////////////////updated//////////// 
    updated(){
    }

}
</script>

<style scoped>
    #task{
        padding-left: 1rem;
        line-height: 2rem;
        height: fit-content;
    }

    #task-text-wrapper{
        font-weight: 200;
        max-width: 85vw;
        display: flex;
        align-items: flex-start;
        /* padding-left: 1rem; */
    }
    
    #task-flex-container:hover{
        background: rgba(28, 39, 71, 0.04);
    }
    #task-flex-container{
        position: relative;
    }

    /* .task-highlight{
        background: rgb(237, 251, 255);
    } */
    
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
        font-weight: 300;
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
    .task-ind-line{
        position: relative;
    }
    .task-ind-line:after{
        content: "";
        display: block;
        width: 0.15rem;
        height: calc(100% - 1rem);
        position: absolute;
        background: #eaeaea;
        top: 1.6em;
        left: 1.12em;
    }
   

    @media only screen and (max-width: 500px){
        #task{
            padding-left: .5rem;
        }
        .task-ind-line:after{
            left: .6rem;
    }
    }


</style>

