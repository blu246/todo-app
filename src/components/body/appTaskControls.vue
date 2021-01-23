<template>
    <!-- <div class="menu-container"> -->
        <!-- <i class="fas fa-ellipsis-h" @click="showMenu = !showMenu" ref="menuBtn"></i> -->
        <!-- <i class="fas fa-plus" @click="controlsEvent('newtask')"></i> -->
        <!-- <i class="fas fa-times" @click="controlsEvent('failed')"></i> -->
        <i
            class="fas fa-check" 
            :class="{done: status=='done'}"
            @click="$emit('taskdone')"
        ></i>
        <!-- <app-control-menu 
            class="menu"
            v-if="showMenu"
            @mouseleave.native="showMenu = false"
            @click.native="showMenu = false"
            @menuevent="menuEvent"
        >
        </app-control-menu> -->

    <!-- </div> -->
</template>

<script>
// import appControlMenu from "./appControlsMenu.vue"
// import bus from "../../bus.js"

export default {
    // components:{appControlMenu},
    props:["status"],

    // data(){return{
    //     // showMenu: false
    // }},
  
}
</script>

<style scoped>
    i{
        margin: .4rem .6rem 0 0;
        font-size: 1.2rem;
        /* transform: scale(80%) translateY(12%); */
        padding-left: .5rem ;
    
    }
    i:hover{
        cursor: pointer;
        color: var(--primary-color);
    }
    /* .menu-container{
        position: relative;
        flex-shrink: 0;
    } */
    
    /* Yes, it is duplicated. Will I do something about 30 charactres? Maybe.. */
    .done{
        color: rgb(0, 226, 113);
    }

</style>