<template>
    <div>
        <div id="parser-body" class="shadow br-rnd anm-expand-up" @click.stop ref="parserBody">
            <div id="title-section">
                <h2>Add entries through typing <i class="far fa-question-circle btn-hover" 
                    @click.stop="showInfo=!showInfo">
                </i></h2>
                
                <div id="controls">
                    <!-- <i class="fas fa-check btn-hover" @click="parseInput"></i> -->
                    <i class="fas fa-times btn-hover" @click="closeParser()"></i>
                </div>
            </div>
            <textarea ref="textArea" class="br-rnd" id="parser-input" v-model="parserInput"></textarea>

            <div class='parse-btn-container'>
                <span class="parse-btn btn-hover" @click.stop="parseInput">Parse input</span>
            </div>
        </div>

        <div class="veil anm-fade-in" @click.stop="closeParser" ref="veil"></div>
        
        <infowidget v-if="showInfo" @close="showInfo=false">
            <template v-slot:title>Creating tasks the easy way</template>
            <template v-slot:main-section>
                <p class="spaced">- This window allows for the creation of tasks in bulk via text input.</p>
                <p class="spaced">- New lines (enter button) are used as separator between tasks.</p>
                <p class="spaced">- The symbol <strong>&gt;</strong> is used to mark subtasks. Each additional symbol is a level deeper.</p>

                <p class="spaced">The following input for example:</p>
                        <div class="input spaced br-rnd">
                            <p class="indented"> Groceries </p>
                            <p class="indented"> >Milk </p>
                            <p class="indented"> >snacks </p>
                            <p class="indented"> >>chocolate </p>
                            <p class="indented"> >>chips </p>
                        </div>
                <p class=""> Results in the creation of a task (Groceries) with two subtasks (Milk and Snacks), the second of which (Snacks) has two subtasks of its own (Chocolate and Chips).</p>
                
            </template>
        </infowidget>
    </div>
</template>

<script>
import infowidget from "./infowidget.vue";
import bus from "../../bus.js";
export default {
    components:{
        infowidget
    },
    data(){return{
        parserInput: "",
        showInfo: false,
    }},
    watch:{
        // parserInput(){
        //     console.log(JSON.stringify(this.parserInput));
        // }
    },
    methods:{
        parseInput(){
            const inpt = this.parserInput.trim();
            let depth = -1; let linesArr;

            if(inpt){
                linesArr = inpt.split(/\n\s*/gm);
            } else {
                this.closeParser();
                return;
            }

            function treeify(unsortedArr){
                depth++; 
                const regex = new RegExp(`^>{${depth}}[^>].*$`, "");
                const outArr = [];                 
                let prevMatchPos = 0;

                unsortedArr.push("$BUFFER$");

                for(const [i, item] of unsortedArr.entries()){
                    if((regex.test(item) && i != 0) || item == "$BUFFER$"){
                        const obj = {};
                        const arr = unsortedArr.slice(prevMatchPos+1, i);
                        obj.head = unsortedArr[prevMatchPos].slice(depth,unsortedArr[prevMatchPos].length )
                        obj.children = arr;
                        outArr.push(obj);
                        prevMatchPos = i;

                        // console.log(depth);
                        if(obj.children.length){
                            obj.children = treeify(obj.children);
                        }
                    }
                }
                depth--;               
                return outArr;
            }            
            bus.$emit("parserinput_parsed", treeify(linesArr));
            this.closeParser();

        },
        keyboardShortcutsFunc(e){
            e.stopPropagation();
            if(e.shiftKey && e.code == "Enter" && this.$refs.veil){
                this.parseInput();
            }
        },
        closeParser(){
            // this.$refs.veil.classList.remove("anm-fade-in")
            // this.$refs.parserBody.classList.remove("anm-expand-up");

            // setTimeout(
            //     ()=>{
            //         this.$refs.parserBody.classList.add("anm-expand-up-reverse")
            //         this.$refs.veil.classList.add("anm-fade-in-reverse")
            //     }
            // , 10)

            // setTimeout(
            //     ()=>console.log(this.$emit("close"))
            // ,401);
            bus.closeWithDelay(this.$refs.parserBody, this.$refs.veil, this);
        },
        

    },
    mounted(){
        setTimeout(()=>this.$refs.textArea.focus(), 50)
    }, 
    created(){
        window.addEventListener("keydown", this.keyboardShortcutsFunc)
        //would it be better to handle keyboard shortcuts locally? 

        bus.$on("appTasks_closeOpenWindow", ()=>{
            //vue resuses components so check that the component is mounted before closing it
            if(!this.showInfo && this.$refs.veil){
                this.closeParser()
            }
        });
    },
    unmounted(){
        console.log(33);
    }

}
</script>

<style scoped>
    #parser-body{
        min-height: 50vh; width: 60vw;
        max-width: 40rem;
        background: var(--bg-primary);
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 1rem 1.3rem;
        z-index: 20;
        border: var(--shadow-subs-border);
        /* overflow: auto; */
    }
    
    #title-section{
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
    }
    #title-section:after{
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 2px;
        background: rgba(243, 243, 243, 0.74);
        background: var(--separator);
        top: 90%;
        left: 0%;
    }
    #controls{
        font-size: 1.2rem;
        transform: translateY(-15%);
    }
    .fa-check{
        margin-right: 1.5rem;
    }
   
    .fa-question-circle{
        font-size: .8rem;
        transform: translate(-20%, -50%);
    }
    h2{
        font-size: 1.2rem;
        font-weight: 400;
        color: var(--text-color-dark);
        margin-bottom: .5rem;
        position: relative;
    }
    /* h2 span{
        position: absolute;
        left: -900%;
        top: 200%;
        background: rgba(0, 0, 0, 0.815);
        width: 20vw;
        color: #eee;
        font-family: 'Open Sans' , sans-serif;
        padding: .7rem;
        border-radius: 5px;
        font-size: 1rem;



    } */
    /* h2:after{
        content:"";
        position: absolute;
        background: rgb(190, 190, 190);
        height: 2px;
        width: 100%;
        left: 50%;
        bottom: -15%;
        transform: translate(-50%, -50%);
    } */

    #parser-input{
        margin-top: 1rem;
        min-height: 70vh;
        width: 100%;
        resize: none;
        outline: unset;
        background: var(--bg-fourthary);
        border: var(--parser-border);
        padding: 1rem;
        font-size: 1rem;
        /* box-shadow: inset 1px 1px 15px  rgba(0, 0, 0, 0.05); */
    }
    .parse-btn-container{
        display: flex;
        justify-content:center;
        margin: 1rem 0 0;
    }
    .parse-btn{
        padding: .2rem 4rem;
        background: var(--bg-parse-btn);
        font-weight: 600;
        color: var(--text-color);
        border: var(--parser-border);
        border-radius: 7px;
    }
    .indented{
        padding-left: 1rem;
    }
    .spaced{
        margin-bottom: 1rem;
    }
    .input{
        background: var(--bg-darker);
        border: var(--separator4);
        display: inline-block;
        padding: 1rem 7rem 1rem 0;
    }


    @media only screen and (max-width: 600px){
        #parser-body{
            width: 95vw;
            padding: .7rem;
        }
        #title-section h2{
            font-size: 1rem;
            font-weight: 700;
        }
    }
    
    

</style>