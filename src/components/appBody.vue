<template>
    <div class="body my-auto mx-2r container bg-primary px-1r py-2r shadow br-rnd">
        <date-and-status id="date-status"></date-and-status>
        <transition name="anm-search">
            <app-task-search v-if="showSearchBar" @close="searchBarFunc('blur');"></app-task-search>
        </transition>

        <app-tasks></app-tasks>
        <parser-input  v-if="showParserInput" @close="showParserInput=false" ></parser-input>
        
        <context-menu 
            v-if="contextMenu_showMenu" 
            :cords="contextMenu_cords" 
            :hasChildren="contextMenu_hasChildren"
            :key="Math.random()"
            @close="contextMenu_showMenu = false"
        ></context-menu>
    </div>
</template>

<script>
import dateAndStatus from "./body/dateAndStatus.vue";
import appTasks from "./body/appTasks.vue";
import AppTaskSearch from './body/appTaskSearch.vue';
import bus from "../bus.js"
import parserInput from "./body/parserInput.vue"
import contextMenu from "./body/appControlsMenu.vue"
export default {
    components:{
        dateAndStatus,
        appTasks,
        AppTaskSearch,
        parserInput,
        contextMenu
    },
    data(){return{
        showSearchBar: false,
        showParserInput: false,
        contextMenu_cords: {},
        contextMenu_showMenu: false,
        contextMenu_hasChildren: null,
    }},
    watch:{
        contextMenu_showMenu(){
            if(!this.contextMenu_showMenu){
                bus.$emit("appTask_contextMenuEvent__setShowMenuToFalse")

            }
        }
    },
    methods:{
        searchBarFunc(type){
            switch(type){
                case "search":
                    this.showSearchBar = !this.showSearchBar
                    break;
                case "blur":
                    setTimeout(()=>this.showSearchBar = false, 10);
                    // setTimeout(()=>this.showParserInput = false, 10);
                    if(this.showSearchBar){bus.$emit("tasksearchinput", "")}
                    //everytime that damn bus causes us a problem I will make it loud and clear so next time you use Vuex

                    break;
                case "newparse":
                    this.showParserInput = !this.showParserInput;
                    break;

            }
        },
        contextMenuMethod(obj){
            this.contextMenu_cords = {x: obj.x, y: obj.y};
            this.contextMenu_showMenu = true;
            this.contextMenu_hasChildren = obj.hasChildren;
        }
        
    },
    created(){
        bus.$on("dateandstatuscontrols", this.searchBarFunc);
        bus.$on("bodyclicked", 
            ()=>{
                this.showParserInput=false, this.contextMenu_showMenu = false;
        });
        
        bus.$on("appTask_contextMenuEvent", this.contextMenuMethod)
    }

}
</script>

<style scoped>
    .body{
        min-height: 80vh;
        /* overflow: hidden; */
        border: var(--shadow-subs-border2);

    }
    #date-status{
        margin-bottom: 1rem;
        position: relative;
        background: inherit;
    }

    .anm-search-enter-active, .anm-search-leave{
        transition: all .4s ease-out;
        transform: translateY(0);
        margin-top: 0;
        opacity: 1;
    }
    .anm-search-leave-active, .anm-search-enter{
        transition: all .4s ease-in;
        transform: translateY(-1rem);
        margin-top: -3.3rem;
        opacity: 0;




    }


    @media only screen and (max-width: 700px){
        .body{
            margin: 1rem .3rem;
            padding: .2rem .5rem;
        }
        .body:focus{
            background: red;
        }
        #date-status{
            margin-bottom: 1rem;
        }
    }

    
    
</style>

