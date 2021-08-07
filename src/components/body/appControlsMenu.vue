<template>
    <div class="menu shadow br-rnd" ref="menuEl">
        <div class="veil veil-anm" ref="veil" @click.stop="closeWithDelay"></div>
        <ul id="menu-ul" class="br-rnd menu-anm" ref="menuUl">
            <li @click.stop="menuEvent('newtask')">Add task</li>
            <li @click.stop="deleteTask"  :class="{warn: deleteWarned}" >{{deleteText}}</li>
            <li @click.stop="menuEvent('edit')">Edit</li>
            <template v-if="hasChildren">
                <li @click.stop="menuEvent('expandall')">Expand all</li>
                <li @click.stop="menuEvent('collapseall')">Collapse all</li>
            </template>
        </ul>
        {{text}}
    </div>
</template>

<script>
import bus from "../../bus.js"
export default {
    props: ['cords', 'hasChildren', "text"],
    data(){return{
        deleteWarned: false,

    }},
    computed:{
        deleteText(){
            return this.deleteWarned ? "Sure?" : "Delete";
        }
    },
    watch:{
        cords(){
            this.setMenuPostion();
        }
    },
    methods:{
        menuEvent(type){
            // this.$emit("menuevent", type)
            bus.$emit("appControlsMenu_to_appTask__contextMenuEvent", type);
            this.closeWithDelay();
            
        },

        //whether to delete immediately or ask for confirmation.
        deleteTask(e){
            if(this.hasChildren && !this.deleteWarned){
                this.deleteWarned = true;
                e.stopPropagation();

            }else{
                // this.$emit("menuevent", "delete");
                this.menuEvent("delete")
            }
            this.closeWithDelay();
        },

        setMenuPostion(){
            //set position to that of the cursor
            // let x = this.cords.rX, y = this.cords.rY;
            let x = this.cords.x, y = this.cords.y;
            const el = this.$refs.menuEl,
                //   aX = this.cords.aX, aY = this.cords.aY,
                elH = el.clientHeight, elW = el.clientWidth,
                wH = window.innerHeight, wW = window.innerWidth;

                el.style.left = x + "px";
                el.style.top = y + "px";

                const rect = el.getBoundingClientRect();

                // wH = document.documentElement.clientHeight, wW = document.documentElement.clientWidth;

            //----for diagnosting
            // const willOverflow = {
                //     right: aX + elW > wW,
            //     left: aX - elW < 0,
            //     up: aY - elH < 0,
            //     down: aY + elH > wH
            // }
            // console.log(willOverflow);
            // console.log({aY, elH, wH});
            // if(!bus.onMobile){
                this.$refs.menuEl.style.borderTopLeftRadius = 0;
                //for desktop. Since default pos = right/down, only 2 cases need be checked.
                const pos = {left: true, top: true};
                if(rect.left + elW + 10 > wW){
                    x -= elW;
                    pos.left = false;
                } //display menu on left side
                if(rect.top + elH > wH){
                    y -= elH
                    pos.top = false;
                } //display menu on top

                this.$refs.menuEl.style.borderTopLeftRadius = "inherit";
                this.$refs.menuEl.style.borderTopRightRadius = "inherit";
                this.$refs.menuEl.style.borderBottomRightRadius = "inherit";
                this.$refs.menuEl.style.borderBottomLeftRadius = "inherit";

                if(pos.left && pos.top){
                    this.$refs.menuEl.style.transformOrigin = "0% 0%"
                    this.$refs.menuEl.style.borderTopLeftRadius = 0;

                }else if (!pos.left && pos.top){
                    this.$refs.menuEl.style.transformOrigin = "100% 0%"
                    this.$refs.menuEl.style.borderTopRightRadius = 0;

                }else if(!pos.left && !pos.top){
                    this.$refs.menuEl.style.transformOrigin = "100% 100%"
                    this.$refs.menuEl.style.borderBottomRightRadius = 0;

                }else if(pos.left && !pos.top){
                    this.$refs.menuEl.style.transformOrigin = "0% 100%"                    
                    this.$refs.menuEl.style.borderBottomLeftRadius = 0;
                }
            // }
            // else{
                // //place the menu above the finger on mobile, a more convenient place.
            //     //default position = centered/up
            //     y -= elH + 10; //display menu on top of finger/task
            //     x -= elW / 2;  // display menu centered relative to finger

            //     //flip the order of the menu so that the more likely to be used items are nearer.
            //     el.style.display = "flex";
            //     el.style.flexDirection = "column-reverse"

            //     //correct if willOverflow
            //     if(aX - elW/2 < 0){x+= elH/4} else if(aX + elW/2 > wW){x-= elH/4}
            //     //  ^ willOverflowLeft                 ^ willOverflowRight
            //     //move by a 1/4 width cause it's already moved 1/2

            //     if(aY - elH < 0){y += elH + 10}
            //     // ^ check if it will overflow up. No need to check down cause the menu goes up by default.
            // }
            
            
            //apply position to elment
            el.style.left = x + "px";
            el.style.top = y + "px";
            },

            closeWithDelay(){
            const body = this.$refs.menuUl;
            const veil = this.$refs.veil;

            veil.classList.remove("veil-anm")
            body.classList.remove("menu-anm");

            setTimeout(
                ()=>{
                    body.classList.add("menu-anm-rev")
                    veil.classList.add("veil-anm-rev")
                }
            , 10)

            setTimeout(
                ()=>console.log(this.$emit("close"))
            ,401);
}
        
    },

    mounted(){
       if(!bus.onMobile){
            this.setMenuPostion();
       }
        

    }
}
</script>

<style scoped>
    .menu{
        position: absolute;
        background: var(--bg-thirdary);
        padding: .2rem;
        display: block;
        z-index: 4;
        transform-origin: 0% 0%;
        border: var(--shadow-subs-border);
        animation: roll-down .2s forwards ease-in-out;
    }
    @keyframes roll-down{
        0%{
            transform: scale(0%)
        }
        100%{
            transform: scale(100%)
        }
    }
    li{
        list-style: none;
        font-size: 1rem;
        padding: .2rem .5rem;
        white-space: nowrap;
        position: relative;
    }
    li:hover{
        cursor: pointer;
        color: var(--primary-color);
        background: var(--bg-hover);

    }
    .warn{
        background: #ff4336;
        color: #fff;
    }
    .warn:hover{
        color: inherit;
    }
    .veil{
        display: none;
    }

    @media only screen and (max-width: 500px){
        .veil{
            display: block;
            position: fixed;
            height: 300vh;
            width: 300vw;
            background: rgba(0, 0, 0, 0.4);
            z-index: 6;
            top: -50vh;
            left: -50vw;
        }
        .veil-anm{
            animation: veil-anm .4s forwards;
        }
        .veil-anm-rev{
            animation: veil-anm-rev 0.4s forwards ;
        }
        @keyframes veil-anm{
            from{opacity: 0;}
            to{opacity: 1}
        }
        @keyframes veil-anm-rev{
            from{opacity: 1}
            to{opacity: 0}
        }
        .menu{
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            background: transparent;
            width: 100vw;
            z-index: 3;
            opacity: 1;
            display: grid;
            animation: none;
            animation: none;
            transform-origin: 50% 50%;
        }
        #menu-ul{
            align-self: center;
            justify-self: center;
            z-index: 7;
            background: var(--bg-primary);
            /* position: relative; */
            /* top: 3rem; */
            /* min-width: 30vw; */
            text-align: center;
            padding: .5rem 3rem;
            /* box-shadow: 2px 2px 3px #00000040, 1px 1px 2px #00000020;; */
        } 
       
        #menu-ul li{
            font-size: 1.2rem;
            border-bottom: 1px solid var(--separator);
            padding: .5rem 0;
        }
        #menu-ul li:last-child{
            border-bottom: none;
            margin-bottom: 0;
        }

        @keyframes expand{
            0%{
                transform: translateY(50vh) scale(0);
                opacity: 0;
            }
            100%{
                transform: translateY(0) scale(100%);
                opacity: 100%;
            }
            
        }
        .menu-anm{
            animation: expand .4s ease-in-out forwards
        }
        .menu-anm-rev{
            animation: expand .4s ease-in-out forwards reverse;
        }
       
    }

    
</style>