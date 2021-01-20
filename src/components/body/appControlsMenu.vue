<template>
    <ul class="shadow" ref="ul">
        <li @click="menuEvent('newtask')">Add task</li>
        <li @click="menuEvent('delete')">Delete</li>
        <li @click="menuEvent('edit')">Edit</li>
        <li @click="menuEvent('expandall')">Expand all</li>
        <li @click="menuEvent('collapseall')">Collapse all</li>
    </ul>        
</template>

<script>
export default {
    props: ['cords'],
    methods:{
        menuEvent(type){
            this.$emit("menuevent", type)
        },
    },

    mounted(){
        //set position to that of the cursor
        const el = this.$refs.ul;
        el.style.top = this.cords.y + "px";
        el.style.left = this.cords.x + "px";
    }
}
</script>

<style scoped>
    ul{
        position: absolute;
        z-index: 2;
        background: var(--bg-primary);
        padding: .2rem;
        display: block;
    }
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