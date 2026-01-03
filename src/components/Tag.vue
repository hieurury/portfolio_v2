<script setup>
//js
import { defineProps } from 'vue';

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: 'gray'
    }
});

</script>

<template>
    <span :class="`inline-block px-3 py-1 border border-${props.color}-700 text-white bg-${props.color}-500`">
        {{ props.label }}
    </span>
</template>

<style scoped>
/* css */
</style>