<script setup>
//js
import { ref, defineProps, computed } from 'vue';

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

const colorClasses = {
    gray: 'border-gray-700 bg-gray-500',
    orange: 'border-orange-700 bg-orange-500',
    emerald: 'border-emerald-700 bg-emerald-500',
    purple: 'border-purple-700 bg-purple-500',
    slate: 'border-slate-700 bg-slate-500',
    blue: 'border-blue-700 bg-blue-500',
    red: 'border-red-700 bg-red-500',
    green: 'border-green-700 bg-green-500',
    yellow: 'border-yellow-700 bg-yellow-500',
    pink: 'border-pink-700 bg-pink-500',
};

const tagClasses = computed(() => {
    return colorClasses[props.color] || colorClasses.gray;
});

</script>

<template>
    <span class="inline-block px-3 py-1 border text-white"
    :class="tagClasses">
        {{ props.label }}
    </span>
</template>

<style scoped>
/* css */
</style>