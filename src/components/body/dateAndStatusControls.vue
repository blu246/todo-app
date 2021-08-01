<template>
   <div class="controls-wrapper">
        <div id="newparse-button" @click.stop="emit('newparse')">
            <i class="fas fa-list-ul"></i>
            <i class="fas fa-plus"></i>
        </div>
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
    .controls-wrapper{
        margin-right: .7rem;
    }
    i{
        /* font-weight: 200; */
        font-size: 1.4rem;
        margin-left: 1.4rem;
    }
    i:hover, #newparse-button:hover{
        cursor: pointer;
        color: var(--primary-color);
    }

    .fa-caret-down, .fa-caret-up{
        transform: scale(115%);
    }
    .fa-search{
        transform: scale(80%);
    }
    #newparse-button{
        position: relative;
        display: inline-block;
    }
    #newparse-button .fa-list-ul{
        position: absolute;
        font-size: 70%;
        z-index: 3;
        right: -17%;
        top: -12%;
        }
    #newparse-button .fa-plus{
        font-size: 110%;
    }

@media only screen and (max-width: 500px){
    
}
</style>