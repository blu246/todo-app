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
        isKeyboardShortcutsOn: true,
        textParser: "",
        // isCollapseAll: undefined

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
        // console.log(this.flatlist);
        return this.flattenList(this.tasksList);
    }
    
},

//////////// METHODS ///////////
    methods:{
        log(x){
            console.log(x)
        },
        generateTask(text="", editable="true", expanded="false"){
            return {
                taskText: text,
                expanded: expanded,
                editable: editable,
                status: "active", // active/done/failed
                subtasks: [],
                hasNextSib: false,
                isSelected: false,
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
            // console.log(this.flatlist)
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
            bus.appTask_anm_initialDepth = 0;
            // this.isCollapseAll = true;
            for(const task of list){
                task.expanded = action;
                if(task.subtasks.length){
                    this.expandCollapse(task.subtasks, action);
                }
            }
            // setTimeout( ()=>this.isCollapseAll = false, 401)
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
            flatlist.forEach((task, i)=>{task.flatindex = i; task.isSelected = false});
            return flatlist;
        },
        scrollTasks(forwards){
            let i = this.flatListSelectedIndex;
            if(this.flatList.length < 1){return;}

            if(i > -1){this.flatList[i].isSelected = false}

            
            if(forwards){
                i = i < (this.flatList.length-1) ? ++i : 0;
            } else{
                i = i > 0 ? --i : (this.flatList.length-1);
            }
            // console.log(i);
            this.flatListSelectedIndex = i;
            this.flatList[i].isSelected = true;
        },
        deselectTasks(){
            if(this.flatListSelectedIndex > -1){
                this.flatList[this.flatListSelectedIndex].isSelected = false;
                this.flatListSelectedIndex = -1;
            }

            //to blur search bar
            bus.$emit("apptasksearch_xbutton", "blur");
            bus.$emit("dateandstatuscontrols", "blur")


        },
        globalLocalExpandCollapse(expand){
            const i = this.flatListSelectedIndex;
            if(this.flatListSelectedIndex > -1){
                if(this.flatList[i].subtasks.length> 0 ){
                    if(expand){
                        this.expandCollapse([this.flatList[i]], true)
                    } else{
                        this.expandCollapse([this.flatList[i]], false)
                    }
                    this.flatList[i].isSelected = true;
                }
            }
            else{
                if(expand){
                    this.expandCollapse(this.tasksList, true)
                }else{
                    this.expandCollapse(this.tasksList, false)

                }
            }
        },
        shortcutsTaskFunctions(type){
            const i = this.flatListSelectedIndex;
            // switch(type){
            //     case "newtask":
            //         if(i> -1){
            //             bus.$emit("shortcuts_taskfunctions", this.flatListSelectedIndex, "newtask");
            //         }else{
            //             this.newTask();
            //         }
            //         break;
                
            //     case "markdone":
            //         // code here
            //         break;
            //     case "delete":

            // }

            if(i < 0 && type == "newtask"){
                    this.newTask();
            }else{
                bus.$emit("shortcuts_taskfunctions", this.flatListSelectedIndex, type);
            }
        },
        keyboardShortcutsParser(e){

            // List of shortcuts
            // - enable keyb shortcuts             -> ctrl+alt+e
            // - search                            -> shift + f
            // - task nav up/down                  -> up/down key

            // - expand / expand selected          -> shift + arrow down
            // - collapse / collapse selected      -> shift + arrow up
            // - cancel/close || deselect tasks    -> esc          

            // - new task || new subtask           -> shift + n           
            // - edit selected                     -> shift + e
            // - delete selected                   -> shift + r      
            // - mark selected done                -> shift + x      

            let cmnd;
            // Activate shortcuts shortcut
            if(e.ctrlKey && e.altKey && e.code == "KeyE"){
                this.isKeyboardShortcutsOn  = !this.isKeyboardShortcutsOn;
            }
            if(this.isKeyboardShortcutsOn){
                // cmnd with SHIFT modifier
                if(e.shiftKey){
                    switch(e.code){
                        case "KeyF":
                            cmnd = "search";
                            bus.$emit("dateandstatuscontrols", "search");
                            break;
                        case "KeyN":
                            cmnd = "newtask";
                            this.shortcutsTaskFunctions("newtask")
                            break
                        case "KeyE":
                            cmnd = "edit";
                            this.shortcutsTaskFunctions("edit")
                            break;
                        case "KeyR":
                            cmnd = "delete";
                            this.shortcutsTaskFunctions("delete")
                            break;
                        case "KeyX":
                            cmnd = "done";
                            this.shortcutsTaskFunctions("done")
                            break;
                        case "ArrowDown":
                            cmnd = "expand";
                            this.globalLocalExpandCollapse(true)
                            break;
                        case "ArrowUp":
                            cmnd = "collapse";
                            this.globalLocalExpandCollapse(false)
                            break;
                        }
                } else{
                switch(e.code){
                    case "Escape":
                        cmnd = "cancel";
                        this.deselectTasks();
                        break;
                    case "ArrowUp":
                        cmnd = "nextTask"
                        this.scrollTasks(false);
                        break;
                    case "ArrowDown":
                        cmnd = "prevTask";
                        this.scrollTasks(true);
                        break;            
                    
                }
            }
        }
            if(cmnd){
            console.log(cmnd)
            //   bus.$emit("shortcuts_"+cmnd);
            }
        },

        parsedListtoTasks(treeifiedList){
            const gentask = this.generateTask;
            function generateTaskObj(inputList){
                const list = [];
                for(const item of inputList){
                    const task = (gentask(item.head, false, true));
                    if(item.children.length){
                        task.subtasks = generateTaskObj(item.children);
                    }
                    list.push(task);
                }
                return list;
            }

            const output = generateTaskObj(treeifiedList);
            this.tasksList.push(...output);
        },
        
    },
    
    //////////// HOOKS ///////////
    created(){
        window.parser = this.parseTextToTask

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
        //I think I foolishly assumed that this was going to be a small app that didn't require vuex
        bus.$on("parserinput_parsed", this.parsedListtoTasks)


// KEYBOARD SHORTCUTS
        //select task up/down
        // bus.$on("shortcuts_nextTask", ()=>this.scrollTasks(false));
        // bus.$on("shortcuts_prevTask", ()=>this.scrollTasks(true));

        //cancel cmnd
        // bus.$on("shortcuts_cancel", this.deselectTasks);

        //collapse/expand
        // bus.$on("shortcuts_expand", ()=>this.globalLocalExpandCollapse(true));
        // bus.$on("shortcuts_collapse", ()=>this.globalLocalExpandCollapse(false));

        //other funcs
        //search
        // bus.$on("shortcuts_search", ()=>bus.$emit("dateandstatuscontrols", "search"))

        //new task
        // bus.$on("shortcuts_newtask", ()=>this.shortcutsTaskFunctions("newtask"))
        // bus.$on("shortcuts_delete", ()=>this.shortcutsTaskFunctions("delete"))
        // bus.$on("shortcuts_edit", ()=>this.shortcutsTaskFunctions("edit"))
        // bus.$on("shortcuts_done", ()=>this.shortcutsTaskFunctions("done"))

        window.addEventListener("keydown", this.keyboardShortcutsParser);
        



        
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