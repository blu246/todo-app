import Vue from "vue";

const bus = new Vue({
    computed: {
        // onMobile(){
        //     // return ('ontouchstart' in window ) ||( navigator.maxTouchPoints > 0 ) || ( navigator.msMaxTouchPoints > 0 )
        //     console.log(55)
        //     window.innerWidth
        //     return window.innerWidth < 500;
        // }
    },
    data:{
        selectedDate: null,
        todaysDate: null,
        onMobile: !(window.innerWidth > 500)
    },
    created(){
        window.addEventListener("resize", ()=>{this.onMobile = !(window.innerWidth > 500)});
    }
    
});


// - enable keyb shortcuts             -> ctrl+alt+e
// - search                            -> shift + f
// - task nav up/down                  -> up/down key       
// - cancel/close || deselect tasks    -> esc          
// - new task || new subtask           -> shift + n           
// - edit selected                     -> shift + e
// - delete selected                   -> shift + r      
// - mark selected done                -> shift + x         
// - expand / expand selected          -> shift + arrow down
// - collapse / collapse selected      -> shift + arrow up


bus.closeWithDelay = function(body, veil, ths){
    veil.classList.remove("anm-fade-in")
    body.classList.remove("anm-expand-up");

    setTimeout(
        ()=>{
            body.classList.add("anm-expand-up-reverse")
            veil.classList.add("anm-fade-in-reverse")
        }
    , 10)

    setTimeout(
        ()=>console.log(ths.$emit("close"))
    ,401);
}









//it was moronic to believe that the app would remain small enough and not require vuex.

export default bus;
