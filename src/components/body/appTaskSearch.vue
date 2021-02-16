<template>
    <div id="search-bar">
        <input type="text" :value="searchInput" @input="searchInput=$event.target.value; searchFunc()" @blur="blurred" ref="inputEl">
        <!-- v-model doesn't play nice with mobile. I believe v-model's @change takes priority over @input, so it doesn't update as you type -->
        <i class="fas fa-times" @click.stop="hideBar"></i>
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
            }else{
                this.$emit("close")
            }
        },
        blurred(){
            if(!this.searchInput){
                this.$emit("close")
            }
        }
    },
    mounted(){
        this.$refs.inputEl.focus();
    }

}
</script>

<style scoped>
    input{
        width: 100%;
        height: 2.3rem;
        border: 1px solid rgba(0, 0, 0, 0.08);
        padding: .5rem 1rem;
        font-size: 1rem;
        font-family: inherit;
        color: inherit;
    }
    #search-bar{
        position: relative ;
        margin-bottom: 1rem;
        max-height: 2.3rem;
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.05), -2px -2px 5px rgba(0, 0, 0, 0.022)
    }
    i{
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        margin-right: .92rem;
        font-size: 1.2rem;
    }
    i:hover{
        cursor: pointer;
        color: #666;
    }


</style>