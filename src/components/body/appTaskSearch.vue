<template>
    <div id="search-bar">
        <input type="text" v-model="searchInput" @input="searchFunc">
        <i class="fas fa-times" @click="searchInput=''"></i>
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
            bus.$emit("tasksearchinput", this.searchInput)
        }
    }
}
</script>

<style scoped>
    input{
        width: 100%;
        height: 2.3rem;
        border: 1px solid #ccc;
        padding: .5rem 1rem;
        font-size: 1rem;
        font-family: inherit;
        color: inherit;
    }
    #search-bar{
        position: relative ;
        margin-bottom: 1rem;
        background: red;
        max-height: 2.3rem;
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