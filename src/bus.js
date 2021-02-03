import Vue from "vue";

const bus = new Vue({
    computed: {
        onMobile(){
            return ('ontouchstart' in window ) ||( navigator.maxTouchPoints > 0 ) || ( navigator.msMaxTouchPoints > 0 )
        }
    },
    data:{
        selectedDate: null,
        todaysDate: null
    }
    
});

 export default bus;

