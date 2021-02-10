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

 export default bus;

