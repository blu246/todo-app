<template>
<transition>
    <div>
        <div class="widget-body-container" @click.stop="close">
            <transition name="widget-expand-up" @after-leave="afterLeaveFunc">
                <div v-if="anm_showElements"  class="widget-body br-rnd shadow" @click.stop ref="widgetBody">
                    <div id="title-section">
                        <h3><slot name="title"></slot></h3>
                        <i class="fa fa-times btn-hover" @click.stop="close"></i>
                    </div>
                    <div id="main-section">
                        <slot name="main-section">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae temporibus perferendis obcaecati? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam voluptatem mollitia excepturi, necessitatibus possimus laboriosam a fugiat. Id corrupti exercitationem sint ullam asperiores quam aliquam atque non provident dolorem itaque nisi, voluptatem excepturi vel numquam illo mollitia consequatur maxime? Pariatur officiis esse, iure sapiente aut saepe eum odio cum necessitatibus molestias ipsum reiciendis eos veritatis? Maxime necessitatibus voluptatibus distinctio, ea provident quibusdam omnis? Vel sunt dolorem rem error ea. Doloribus, architecto? Molestiae et animi unde ad dolore necessitatibus aliquid eos sunt nobis distinctio consequuntur impedit corporis laudantium eum voluptates, vitae, natus temporibus porro illum cupiditate tempora numquam aliquam qui. Blanditiis possimus dolorem ipsum esse natus sint enim laboriosam aut quis officia odio eligendi excepturi dolore, rerum veniam in nesciunt laborum quidem neque ad velit, ducimus non incidunt. Dignissimos aspernatur quam beatae fuga nam molestias minima doloribus deserunt animi quisquam similique, enim quia culpa suscipit maxime eveniet corporis numquam aut velit explicabo! Mollitia repudiandae qui vel quasi sunt dignissimos pariatur, earum ipsa quaerat reprehenderit ducimus aut sit debitis nisi, eum officiis. Maiores harum, quas amet tempore labore dolor sit beatae qui. Velit, et aut. Consectetur at fugit dolore rerum facilis omnis nemo maiores dolor, culpa laborum necessitatibus provident ratione perspiciatis suscipit.</slot>
                    </div>
                </div>
            </transition>
        </div>

        <transition name="veil-fade">
            <div v-if="anm_showElements" class="veil" ref="veil"></div>
        </transition>
    </div>
</transition>
</template>

<script>
import bus from "../../bus.js"

export default{
    data(){return{
        anm_showElements: false,
    }},
    methods:{
       
        close(){
            this.anm_showElements = false;
        },
        afterLeaveFunc(){
            this.$emit("close");
        }
        
    },
    created(){
        bus.$on("appTasks_closeOpenWindow", ()=>{
            if(this.$refs.veil){
                this.close();
            }
        });
    },
    mounted(){
        this.anm_showElements = true;
    }
}
</script>


<style scoped>

    

    
    /* .v-enter-active, .v-leave-active{
        transition: transform 1s;
        transform: scale(80%);
        background: red;
        z-index: 20;
    }
    .v-enter-to, .v-leave{
        transform: scale(100%);
        z-index: 20;
        background: yellow;

    } */
    

    .widget-body{
        min-height: 80vh;
        max-height: 90vh;
        width: 70vw;
        max-width: 50rem;
        background: var(--bg-primary);
        padding: 1rem 2rem 2rem;
        border: var(--shadow-subs-border)

    }
    #title-section{
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
    }
    #title-section:after{
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 2px;
        background: var(--separator);
        top: 115%;
        left: 0%;
    }
    #main-section{
        padding: .5rem .7rem;
        max-height: 70vh;
        margin-top: 1rem;
        max-width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        word-wrap: normal;
        white-space: pre-line;
        /* background: #f1f1f1; */

    }
    .veil{
        z-index: 20;
    }
    .fa-times{
        font-size: 1.2rem;
    }
    

@media only screen and (max-width: 600px){
    .widget-body{
        width: 95vw;
        max-width: 40rem;
        padding: .7rem;
        
    }
    #title-section h3{
        font-size: 1rem;
        font-weight: 700;
    }
}

    
</style>

