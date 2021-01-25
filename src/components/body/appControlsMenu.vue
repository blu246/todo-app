<template>
    <ul class="shadow" ref="ul">
        <li @click="menuEvent('newtask')">Add task</li>

        <li @click="deleteTask"  :class="{warn: deleteWarned}" >{{deleteText}}</li>

        <li @click="menuEvent('edit')">Edit</li>
        <template v-if="hasChildren">
            <li @click="menuEvent('expandall')">Expand all</li>
            <li @click="menuEvent('collapseall')">Collapse all</li>
        </template>
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

        //whether to delete immediately or ask for confirmation.
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
        let x = this.cords.x, y = this.cords.y;

        //place the menu above the finger on mobile, a more convenient place.
        if(
            ('ontouchstart' in window ) ||  
            ( navigator.maxTouchPoints > 0 ) ||  
            ( navigator.msMaxTouchPoints > 0 )
        ){
            //position menu above finger and in the middle
            y -= el.clientHeight + 10;
            x -= el.clientWidth / 2;

            //flip the order of the menu so that the more likely to be used items are nearer.
            this.$refs.ul.style.display = "flex";
            this.$refs.ul.style.flexDirection = "column-reverse"
            
        }

        el.style.left = x + "px";
        el.style.top = y + "px";

    }
}
</script>

<style scoped>
    ul{
        position: fixed;
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
        background: rgb(255, 62, 49)
    }
    .warn:hover{
        color: inherit;
    }

    
</style>