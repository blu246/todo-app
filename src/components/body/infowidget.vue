<template>
<transition>
    <div>
        <div id="widget-body" class="br-rnd shadow anm-expand-up" @click.stop ref="widgetBody">
            <div id="title-section">
                <h3><slot name="title"></slot></h3>
                <i class="fa fa-times btn-hover" @click.stop="close"></i>
            </div>
            <div id="main-section">
                <slot name="main-section">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae temporibus perferendis obcaecati? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam voluptatem mollitia excepturi, necessitatibus possimus laboriosam a fugiat. Id corrupti exercitationem sint ullam asperiores quam aliquam atque non provident dolorem itaque nisi, voluptatem excepturi vel numquam illo mollitia consequatur maxime? Pariatur officiis esse, iure sapiente aut saepe eum odio cum necessitatibus molestias ipsum reiciendis eos veritatis? Maxime necessitatibus voluptatibus distinctio, ea provident quibusdam omnis? Vel sunt dolorem rem error ea. Doloribus, architecto? Molestiae et animi unde ad dolore necessitatibus aliquid eos sunt nobis distinctio consequuntur impedit corporis laudantium eum voluptates, vitae, natus temporibus porro illum cupiditate tempora numquam aliquam qui. Blanditiis possimus dolorem ipsum esse natus sint enim laboriosam aut quis officia odio eligendi excepturi dolore, rerum veniam in nesciunt laborum quidem neque ad velit, ducimus non incidunt. Dignissimos aspernatur quam beatae fuga nam molestias minima doloribus deserunt animi quisquam similique, enim quia culpa suscipit maxime eveniet corporis numquam aut velit explicabo! Mollitia repudiandae qui vel quasi sunt dignissimos pariatur, earum ipsa quaerat reprehenderit ducimus aut sit debitis nisi, eum officiis. Maiores harum, quas amet tempore labore dolor sit beatae qui. Velit, et aut. Consectetur at fugit dolore rerum facilis omnis nemo maiores dolor, culpa laborum necessitatibus provident ratione perspiciatis suscipit.</slot>
            </div>
        </div>
        <div class="veil anm-fade-in" ref="veil" @click.stop="close"></div>
    </div>
</transition>
</template>
<script>
export default {
    methods:{
        close(){
            this.$refs.veil.classList.remove("anm-fade-in")
            this.$refs.widgetBody.classList.remove("anm-expand-up");

            setTimeout(
                ()=>{
                    this.$refs.widgetBody.classList.add("anm-expand-up-reverse")
                    this.$refs.veil.classList.add("anm-fade-in-reverse")
                }
            , 10)

            setTimeout(
                ()=>console.log(this.$emit("close"))
            ,401);
        },
    }
}
</script>


<style scoped>

    .v-enter-active, .v-leave-active{
        transition: transform 1s;
        /* transform: scale(80%); */
        background: red;
        z-index: 20;
    }
    .v-enter-to, .v-leave{
        transform: scale(100%);
        z-index: 20;
        background: yellow;

    }

    #widget-body{
        position: fixed;
        height: 85vh;
        width: 70vw;
        max-width: 50rem;
        background: #ffffffe7;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 30;
        padding: 1rem 2rem;
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
        background: rgb(233, 233, 233);
        top: 110%;
        left: 0%;
    }
    #main-section{
        padding: .5rem .7rem;
        margin-top: 1rem;
        max-height: 90%;
        max-width: 100%;
        overflow-y:auto;
        overflow-x: hidden;
        word-wrap: normal;
        white-space: pre-line;
        /* background: #f1f1f1; */

    }
    .veil{
        z-index: 20;
    }
    .spaced{
        margin-bottom: .5rem;
    }
    .indented{
        margin-left: 2rem;
    }
    img{
        display: block;
    }

    
</style>

