<template>
    <div class="menu shadow" ref="menuEl">
        <ul>
            <li @click="menuEvent('newtask')">Add task</li>
            <li @click="deleteTask"  :class="{warn: deleteWarned}" >{{deleteText}}</li>
            <li @click="menuEvent('edit')">Edit</li>
            <template v-if="hasChildren">
                <li @click="menuEvent('expandall')">Expand all</li>
                <li @click="menuEvent('collapseall')">Collapse all</li>
            </template>
        </ul>        
    </div>
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
            const el = this.$refs.menuEl,
                  aX = this.cords.aX, aY = this.cords.aY,
                  elH = el.clientHeight, elW = el.clientWidth,
                  wH = window.innerHeight, wW = window.innerWidth,
                  onMobile = ('ontouchstart' in window ) ||( navigator.maxTouchPoints > 0 ) || ( navigator.msMaxTouchPoints > 0 );

            //----for diagnosting
            // const willOverflow = {
            //     right: aX + elW > wW,
            //     left: aX - elW < 0,
            //     up: aY - elH < 0,
            //     down: aY + elH > wH
            // }
            // console.log(willOverflow);


            
            if(!onMobile){
                //for desktop. Since default pos = right/down, only 2 cases need be checked.
                if(aX + elW > wW){x -= elW;} //display menu on left side
                if(aY + elH > wH) {y -= elH} //display menu on top
            }
            else{
            //place the menu above the finger on mobile, a more convenient place.
                //default position = centered/up
                y -= elH + 10; //display menu on top of finger/task
                x -= elW / 2;  // display menu centered relative to finger

                //flip the order of the menu so that the more likely to be used items are nearer.
                el.style.display = "flex";
                el.style.flexDirection = "column-reverse"

                //correct if willOverflow
                if(aX - elW/2 < 0){x+= elH/4} else if(aX + elW/2 > wW){x-= elH/4}
                //  ^ willOverflowLeft                 ^ willOverflowRight
                //move by a 1/4 width cause it's already moved 1/2

                if(aY - elH < 0){y += elH + 10}
                // ^ check if it will overflow up. No need to check down cause the menu goes up by default.
            }
            
            
            //apply position to elment
            el.style.left = x + "px";
            el.style.top = y + "px";
        },
        
    },

    mounted(){
        this.setMenuPostion();
        
        

    }
}
</script>

<style scoped>
    .menu{
        position: absolute;
        background: var(--bg-primary);
        padding: .2rem;
        display: block;
        z-index: 3;
    }

    
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