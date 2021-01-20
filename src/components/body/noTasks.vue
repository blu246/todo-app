<template>
    <h1>{{emptyMessage}}</h1>
</template>

<script>
export default {
    computed:{
        emptyMessage(){
            const msg = [
                "Nothing to do :D",
                "Looks a bit empty here..",
                "A lazy sunday?",
                "No tasks to do"
            ];
            const ran = Math.floor(Math.random() * msg.length);
            return msg[ran];
        }
    }
}
</script>

<style scoped>
    h1{
        padding-top: 2rem;
        text-align: center;
        font-weight: 100;
        font-size: 2.8rem;
    }
</style>