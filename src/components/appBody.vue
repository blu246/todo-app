<template>
    <div class="body my-auto mx-2r container bg-primary px-1r py-2r shadow">
        <date-and-status id="date-status"></date-and-status>
        <app-task-search v-if="showSearchBar" @close="searchBarFunc('blur');"></app-task-search>
        <app-tasks></app-tasks>
        

    </div>
</template>

<script>
import dateAndStatus from "./body/dateAndStatus.vue";
import appTasks from "./body/appTasks.vue";
import AppTaskSearch from './body/appTaskSearch.vue';
import bus from "../bus.js"
export default {
    components:{
        dateAndStatus,
        appTasks,
        AppTaskSearch
    },
    data(){return{
        showSearchBar: false,
        test: "22"
    }},
    methods:{
        searchBarFunc(type){
            switch(type){
                case "search":
                    this.showSearchBar = !this.showSearchBar;
                    break;
                case "blur":
                    setTimeout(()=>this.showSearchBar = false, 100);
                break;

            }
        }
    },
    created(){
        bus.$on("dateandstatuscontrols", this.searchBarFunc);

    }

}
</script>

<style scoped>
    .body{
        min-height: 80vh;
    }
    #date-status{
        margin-bottom: 1rem;
    }

    @media only screen and (max-width: 700px){
        .body{
            margin: 1rem .3rem;
            padding: .2rem .5rem;
        }
        #date-status{
            margin-bottom: 1rem;
        }
    }
    
</style>

