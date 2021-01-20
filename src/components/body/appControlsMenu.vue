<template>
    <ul class="shadow" ref="ul">
        <li @click="menuEvent('newtask')">Add task</li>

        <li @click="deleteTask"  :class="{warn: deleteWarned}" >{{deleteText}}</li>

        <li @click="menuEvent('edit')">Edit</li>
        <li @click="menuEvent('expandall')">Expand all</li>
        <li @click="menuEvent('collapseall')">Collapse all</li>
    </ul>        
</template>

<script>
export default {
    props: ['cords', 'hasChildren'],
    data(){return{
        deleteWarned: false,

    }},
    computed:{
        deleteText(){
            return this.deleteWarned ? "Sure?" : "Delete";
        }
    },
    methods:{
        menuEvent(type){
            this.$emit("menuevent", type)
        },

        deleteTask(e){
            if(this.hasChildren && !this.deleteWarned){
                this.deleteWarned = true;
                e.stopPropagation();

            }else{
                this.$emit("menuevent", "delete");
            }
        }
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
    .warn{
        background: rgba(255, 0, 0, 0.562)
    }
    .warn:hover{
        color: inherit;
    }
</style>