<template>
   <div class="controls-wrapper">
        <i class="fas fa-search" @click="emit('search')"></i>
        <i class="fas fa-caret-down" @click="emit('expand')"></i>
        <i class="fas fa-caret-up" @click="emit('collapse')"></i>
        <i class="fas fa-plus" @click="emit('newTask')"> </i>
   </div>
</template>

<script>
import bus from "../../bus.js"
export default {
    methods:{
        emit(type){
            bus.$emit("dateandstatuscontrols", type);
        }
    }
}
</script>


<style scoped>
    div{
        margin-right: .7rem;
    }
    i{
        /* font-weight: 200; */
        font-size: 1.4rem;
        margin-left: 1.4rem;
    }
    i:hover{
        cursor: pointer;
        color: var(--primary-color);
    }

    .fa-caret-down, .fa-caret-up{
        transform: scale(115%);
    }
    .fa-search{
        transform: scale(80%);
    }

@media only screen and (max-width: 500px){
    
}
</style>