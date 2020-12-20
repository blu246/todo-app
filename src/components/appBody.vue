<template>
    <div class="body my-auto mx-2r container bg-primary px-1r py-2r shadow">
        <date-and-status></date-and-status>
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
    div > div{
        margin-bottom: 2rem;
    }    
    
</style>

