<template>
    <div>
        <div id="parser-body" class="shadow br-rnd anm-expand-up" @click.stop ref="parserBody">
            <div id="title-section">
                <h2>Add entries through typing <i class="far fa-question-circle btn-hover" 
                    @click.stop="showInfo=!showInfo">
                </i></h2>
                
                <div id="controls">
                    <i class="fas fa-check btn-hover" @click="parseInput"></i>
                    <i class="fas fa-times btn-hover" @click="closeParser()"></i>
                </div>
            </div>
            <textarea ref="textArea" class="br-rnd" id="parser-input" v-model="parserInput"></textarea>
        </div>

        <div class="veil anm-fade-in" @click.stop="closeParser" ref="veil"></div>
        
        <infowidget v-if="showInfo" @close="showInfo=false">
            <template v-slot:title>Creating tasks the easy way</template>
            <template v-slot:main-section>
                <p class="spaced">This window allows for the creation of tasks in bulk via text input.</p>
                <p class="spaced">New lines (enter button) are used as separator between tasks.</p>
                <p class="spaced">The symbol <strong>&gt;</strong> is used to mark subtasks. Each additional symbol is a level deeper</p>

                <div class="spaced">The following input for example:<br>
                        <span class="indented"> Example task<br> </span>
                        <span class="indented"> >example sub task<br> </span>
                        <span class="indented"> >>example sub sub task<br> </span><br>
                        <p class="spaced"> Results in the following:</p>
                        <img src="../../assets/parseexample.png">
                </div>
                
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
        parserInput(){
            console.log(JSON.stringify(this.parserInput));
        }
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
            if(e.shiftKey && e.code == "Enter"){
                this.parseInput();
            }
        },
        closeParser(){
            this.$refs.veil.classList.remove("anm-fade-in")
            this.$refs.parserBody.classList.remove("anm-expand-up");

            setTimeout(
                ()=>{
                    this.$refs.parserBody.classList.add("anm-expand-up-reverse")
                    this.$refs.veil.classList.add("anm-fade-in-reverse")
                }
            , 10)

            setTimeout(
                ()=>console.log(this.$emit("close"))
            ,401);
        },
        

    },
    mounted(){
        setTimeout(()=>this.$refs.textArea.focus(), 50)
    }, 
    created(){
        window.addEventListener("keydown", this.keyboardShortcutsFunc)
        //would it be better to handle keyboard shortcuts locally? 
    }

}
</script>

<style scoped>
    #parser-body{
        height: 80vh; width: 60vw;
        max-width: 40rem;
        background: #fff;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 1rem 1.3rem;
        z-index: 20;
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
        top: 85%;
        left: 0%;
    }
    #controls{
        font-size: 1.2rem;
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
        color: #555;
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
        height: 90%;
        width: 100%;
        resize: none;
        outline: unset;
        background: #fafafa;
        border: 1px solid rgb(209, 209, 209);
        padding: 1rem;
        font-size: 1rem;
    }
    
    

</style>