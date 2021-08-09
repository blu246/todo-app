<template>
    <div class="controls-wrapper" click.stop ref="controlsContainer">
        <i class="fas fa-ellipsis-h"  @click.stop="showCompactedIcons=!showCompactedIcons"></i>
        <transition>
            <div class="compact-container compacted" v-show="showCompactedIcons" ref="test">
                <div id="newparse-button" @click.stop="emit('newparse')" >
                    <i class="fas fa-list-ul"></i>
                    <i class="fas fa-plus"></i>
                </div>
                <i class="fas fa-search" @click.stop="emit('search')"></i>
                <i class="fas fa-caret-down" @click.stop="emit('expand')"></i>
                <i class="fas fa-caret-up" @click.stop="emit('collapse')"></i>
            </div>
        </transition>
        <i class="fas fa-plus"  @click.stop="emit('newTask')" ref="newTaskBtn"> </i>
   </div>
</template>

<script>
import bus from "../../bus.js"
export default {
    data(){return{
        showCompactedIcons: window.innerWidth > 350,
    }},
    computed:{
       
    },
    methods:{
        emit(type){
            bus.$emit("dateandstatuscontrols", type);
            if(bus.onMobile){
                this.showCompactedIcons = false;
            }
        },
        
    },
    mounted(){
        if(bus.onMobile){
            bus.$on("bodyclicked", ()=>this.showCompactedIcons = false);
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
    i:hover, #newparse-button:hover i{
        cursor: pointer;
        color: var(--primary-color);
    }

    .fa-caret-down, .fa-caret-up{
        transform: scale(115%);
    }
    .fa-search{
        transform: scale(80%);
    }
    /* move to global styling */
    /* #newparse-button{
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
    } */
    .compact-container{
        display: inline-block;
    }
    .fa-ellipsis-h{
        display: none;
    }
    .compacted{
        display: inline-block;
    }

@media only screen and (max-width: 350px){
    .fa-ellipsis-h{
        display: inline-block;
    }
    .compacted{
        position: absolute;
        top: 0;
        left: 0;
        /* background: red; */
        background: var(--bg-primary);
    }
    @keyframes expand-left {
        0%{transform: scaleX(0%); transform-origin: 100% 0; opacity: 0;;}
        100%{transform: scaleX(100%); transform-origin: 100% 0; opacity: 1;}
    }
    .compacted i{
        margin: 0;
        padding: .4rem .9rem;
    }
    .compacted.v-enter-active{
        animation: expand-left .3s ease-in-out forwards;
    }
    .compacted.v-leave-active{
        animation: expand-left .3s ease-in-out backwards reverse;
    }
}
</style>