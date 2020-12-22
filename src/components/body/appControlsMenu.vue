<template>
    <ul class="shadow">
        <li @click="menuEvent('edit')">Edit</li>
        <li @click="menuEvent('rearm')">Rearm</li>
        <li @click="menuEvent('delete')">Delete</li>
    </ul>        
</template>

<script>
export default {
    methods:{
        menuEvent(type){
            this.$emit("menuevent", type)
        }
    }
}
</script>

<style scoped>
    li{
        list-style: none;
        font-size: 1rem;
        padding: 0rem .5rem;
    }
    li:hover{
        cursor: pointer;
        color: var(--primary-color);
    }
</style>