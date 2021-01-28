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
        },

        setMenuPostion(){
            //set position to that of the cursor
            let x = this.cords.rX, y = this.cords.rY;
            const el = this.$refs.ul,
                  aX = this.cords.aX, aY = this.cords.aY,
                  elH = el.clientHeight, elW = el.clientWidth,
                  wH = window.innerHeight, wW = window.innerWidth,
                  onMobile = ('ontouchstart' in window ) ||( navigator.maxTouchPoints > 0 ) || ( navigator.msMaxTouchPoints > 0 );

            //check overflow
            const willOverflow = {
                right: aX + elW > wW,
                left: aX - elW < 0,
                up: aY - elH < 0,
                down: aY + elH > wH
            }
            

            //place the menu above the finger on mobile, a more convenient place.
            if(onMobile){
                //position menu above finger and in the middle
                y -= elH + 10;
                x -= elW / 2;
                //flip the order of the menu so that the more likely to be used items are nearer.
                el.style.display = "flex";
                el.style.flexDirection = "column-reverse"
            }
            onMobile;
            //reposition if overflowing
            if(willOverflow.left){
                // x += elW;
            } 
            else if (willOverflow.right){
                x -= elW;
            }
            // not an elseif cause it can overflow in two axis (e.g: left and bottom)
            if(willOverflow.top){
                // y += elH;
            }
            else if(willOverflow.down){
                y -= elH;
            }

            
            console.log(willOverflow);
            
            //apply position to elment
            // el.style.left = x + "px";
            // el.style.top = y + "px";
            x;y;
        },
        
    },

    mounted(){
        this.setMenuPostion();
        
        

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

    /* ul{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%)
    } */
    /* .shade{
        background: #00000011;
        width: 100vw; height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
    } */
   
    li{
        list-style: none;
        font-size: 1rem;
        padding: 0rem .5rem;
        white-space: nowrap
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