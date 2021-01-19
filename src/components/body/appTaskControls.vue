<template>
    <div class="menu-container">
        <i class="fas fa-ellipsis-h" @click="showMenu = !showMenu" ref="menuBtn"></i>
        <i class="fas fa-plus" @click="controlsEvent('newtask')"></i>
        <!-- <i class="fas fa-times" @click="controlsEvent('failed')"></i> -->
        <i 
            class="fas fa-check" 
            :class="{done: status=='done'}"
            @click="controlsEvent('done')"
        ></i>
        <!-- <app-control-menu 
            class="menu"
            v-if="showMenu"
            @mouseleave.native="showMenu = false"
            @click.native="showMenu = false"
            @menuevent="menuEvent"
        >
        </app-control-menu> -->

    </div>
</template>

<script>
// import appControlMenu from "./appControlsMenu.vue"
import bus from "../../bus.js"

export default {
    // components:{appControlMenu},
    props:["status"],

    data(){return{
        showMenu: false
    }},

    methods:{
        controlsEvent(type){
            this.$emit("controlsevent",type);
        },
        
        menuEvent(type){
            this.$emit("menuevent", type);
        }
    },

    created(){
        bus.$on("bodyclicked", (e)=>{
            if(e.target == this.$refs.menuBtn){
                return;
            }
            this.showMenu = false;
        })
        //We'll make it hover based instead.
        //did that ^. will keep it as another way to close 
    }   
}
</script>

<style scoped>
    i{
        margin-left: 1.5rem;
        font-size: 1.5rem;
        transform: scale(80%)
    }
    i:hover{
        cursor: pointer;
        color: var(--primary-color);
    }
    .menu-container{
        position: relative;
        flex-shrink: 0;
    }
    
    /* Yes, it is duplicated. Will I do something about 30 charactres? Maybe.. */
    .done{
        color: rgb(0, 226, 113);
    }

</style>