<template>
    <div class="body my-auto mx-2r container bg-primary px-1r py-2r shadow">
        <date-and-status id="date-status"></date-and-status>
        <app-tasks></app-tasks>


    </div>
</template>

<script>
import dateAndStatus from "./body/dateAndStatus.vue";
import appTasks from "./body/appTasks.vue";
export default {
    components:{
        dateAndStatus,
        appTasks
    },
    data(){return{
        
    }}
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

