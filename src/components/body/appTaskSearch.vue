<template>
    <div id="search-bar" class="br-rnd shadow">
        <input type="text" class="br-rnd" :value="searchInput" @input="searchInput=$event.target.value; searchFunc()" @blur="blurred" ref="inputEl">
        <!-- v-model doesn't play nice with mobile. I believe v-model's @change takes priority over @input, so it doesn't update as you type -->
        <i class="fas fa-times btn-hover" @click.stop="hideBar"></i>
    </div>
</template>

<script>
import bus from "../../bus.js"
export default {
    data(){return{
        searchInput: ""
    }},
    methods:{
        searchFunc(){
            bus.$emit("tasksearchinput", this.searchInput);
        },
        hideBar(){
            if(this.searchInput){
                this.searchInput = "";
                this.searchFunc();
            }else{
                this.$emit("close")
                this.searchInput = "";
            }
        },
        blurred(){
            if(!this.searchInput){
                console.log("called?");
                // this.$emit("close")
            }
        }
    },
    created(){
        bus.$on("apptasksearch_xbutton", this.hideBar)
    },
    mounted(){
        setTimeout(()=>this.$refs.inputEl.focus(), 10);
        

        //clear F from search bar when invoking it using shortcut shift + f;
        setTimeout(()=>this.$refs.inputEl.value = "", 10);
    },
    unmount(){
       this.$refs.inputEl.value = "";
    }


}
</script>

<style scoped>
    
    input{
        width: 100%;
        height: 2.3rem;
        border: 1px solid rgba(0, 0, 0, 0.1);
        padding: .5rem 1rem;
        font-size: 1rem;
        font-family: inherit;
        color: inherit;
        outline: none;
        background: var(--bg-thirdary);
        border: var(--shadow-subs-border)
    }
    
    #search-bar{
        position: relative ;
        margin-bottom: 1rem;
        max-height: 2.3rem;
        box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.17), -1px -1px 1px rgba(0, 0, 0, 0.043);


    }
    i{
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        margin-right: .92rem;
        font-size: 1.2rem;
        color: var(--text-color-dark);
    }
    /* i:hover{
        cursor: pointer;
        color: var(--primary-color);
    } */
    

</style>