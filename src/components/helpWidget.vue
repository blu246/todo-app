<template>
    <infowidget v-if="showWidget" @close="showWidget=false" class="root-el">    
        <template v-slot:title>General tips {{signal}}</template>
        <template v-slot:main-section>
            <p>This webApp allows for the creation of a to-do list divisible into many steps leveraging the ability to create tasks with subtasks.</p>

            <p>To get started, click on the <i class="fa fa-plus mary"></i> Icon to create a new task then press enter.</p>

            <p>To create subtasks, right click on a task and choose the add task option. You may also edit or delete a task through this menu.</p>

            <p>On mobile, this menu can be accessed through a long press or swiping the task right. Swiping the task left allows you to mark it as done which can also be done through clicking the <i class="fas fa-check mary"></i> icon.</p>

            <p>The <i class="fas fa-caret-up mary"></i> and <i class="fas fa-caret-down mary"></i> icons allow for collapsing and expanding all tasks and their respective subtasks. If the aim is to perform this operation on a single task, right click or swipe and choose the "expand all" or "collapse" all option from the menu.</p>

            <p>The <i class="fas fa-search mary"></i> icon allows you to search through tasks and the <span id="newparse-button" class="mary"><i class="fas fa-list-ul"></i><i class="fas fa-plus"></i></span> icon allows for the creating of tasks through text (see the help section in the parser window for more info).</p>

            <p>Clicking on the day's date opens the date picker, which allows for the viewing or modification of the selected date tasks.</p>

            <p>This app supports keyboard shortcuts, which can be activated by pressing <span class="keyb-shortcuts-box">Alt + Ctrl + e</span>. Find below the full list of supported shortcuts:</p>
            <div class="shortcuts-container">
                <p><span class="keyb-shortcuts-box">Arrow up / Arrow down</span> scroll through tasks</p>
                <p><span class="keyb-shortcuts-box">Shift + N</span> New Task</p>
                <p><span class="keyb-shortcuts-box">Shift + E</span> Edit Task</p>
                <p><span class="keyb-shortcuts-box">Shift + R</span> Remove task</p>
                <p><span class="keyb-shortcuts-box">Shift + X</span> Mark task done</p>
                <p><span class="keyb-shortcuts-box">Shift + F</span> Open Search</p>
                <p><span class="keyb-shortcuts-box">Shift + w</span> Open parser</p>
                <p><span class="keyb-shortcuts-box">Shift + Arrow Up</span> Expand all/ Expand selected</p>
                <p><span class="keyb-shortcuts-box">Shist + Arrow Down</span> Collapse all / collapse Selected</p>
                <p><span class="keyb-shortcuts-box">Escape</span> Deslect task / close window</p>
            
            </div>
        </template>
    </infowidget>
</template>

<script>
import infowidget from "./body/infowidget.vue"
export default{
    components:{infowidget},
    props:["signal"],
    watch:{
        signal(){
            console.log(3);
            this.showWidget = !this.showWidget;
        }
    },
    data(){return{
        showWidget: false
    }},
    mounted(){
    }
}
</script>

<style scoped>
    .root-el{
        position: absolute;
    }
    p{
        margin-bottom: 1rem;
    }
    .keyb-shortcuts-box{
        background: var(--bg-darker);
        padding: .1rem 1rem;
        border-radius: 5px;
        border: var(--separator3) 1px solid;
        font-weight: 400;
    }
    .shortcuts-container p{
        font-weight: 600;
    }
    .mary{
        margin: 0 0.3rem;
    }
    .fa-caret-down, .fa-caret-up{
        font-size: 1.2rem;
    }
</style>