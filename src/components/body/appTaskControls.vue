<template>
    <div>
        <i class="fas fa-ellipsis-h"></i>
        <i class="fas fa-plus" @click="emit('newTask')"></i>
        <i class="fas fa-times" @click="emit('failed')"></i>
        <i class="fas fa-check" @click="emit('done')"></i>
    </div>
</template>

<script>
export default {
    methods:{
        emit(type){
            this.$emit(type);
        }
    }
}
</script>

<style scoped>
    i{
        margin-left: 1.5rem;
        font-size: 1.5rem;
        transform: scale(80%)
    }
    i:hover{
        cursor: pointer;
        color: var(--primary-color);
    }

</style>