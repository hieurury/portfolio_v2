<script setup>
    import { defineProps, ref, onMounted, watch, defineEmits } from 'vue';

    const props = defineProps({
        title: {
            type: String,
            default: 'Hello Component'
        },
        description: {
            type: String,
            default: 'Welcome to my portfolio!'
        }
    });
    const emit = defineEmits(['done']);

    const headingRef = ref(null);
    const descriptionRef = ref(null);
    const isHeadingDone = ref(false);
    const isDescriptionDone = ref(false);
    const isPenWait = ref(true);

    onMounted(() => {
        //đầu tiên vô chạy heading trước
        headingAnimation();
    })
    //nào heading xong thì chạy description
    watch(isHeadingDone, (newVal) => {
        if(newVal){
            const timeout = setTimeout(() => {
                clearTimeout(timeout);
                isPenWait.value = false;
                descriptionAnimation();
            }, 1000);
        }
    });

    const headingAnimation = () => {
        if(!props.title) return;
        headingRef.value = '';
        const heading = props.title;
        const chars = heading.split('');
        const interval = setInterval(() => {
            if(chars.length === 0){
                isHeadingDone.value = true;
                clearInterval(interval);
                return;
            }
            headingRef.value += chars.shift();
        }, 90);

    }
    const descriptionAnimation = () => {
        if(!props.description) return;
        descriptionRef.value = '';
        const description = props.description;
        const chars = description.split('');
        const interval = setInterval(() => {
            if(chars.length === 0){
                clearInterval(interval);
                isDescriptionDone.value = true;
                emit('done');
                return;
            }
            descriptionRef.value += chars.shift();
        }, 70);
    }
//js
</script>

<template>
    <div class="mb-4 min-h-[4rem] lg:min-h-[7rem]">
        <h1 class="lg:text-8xl text-5xl font-bold tracking-widest text-gray-200 inline break-words">
            {{ headingRef }}<span v-show="isPenWait" class="inline-block w-8 lg:w-12 h-[6px] lg:h-[8px] bg-white ml-2 align-baseline" :class="[{ 'wait-blink': isHeadingDone }]"></span>
        </h1>
    </div>
    
    <div class="min-h-[2.5rem]">
        <p class="text-3xl text-gray-300 inline break-words">
            {{ descriptionRef }}<span v-show="!isPenWait" class="inline-block w-4 lg:w-6 h-[4px] bg-white ml-1 align-baseline" :class="[{ 'wait-blink': isDescriptionDone }]"></span>
        </p>
    </div>
</template>

<style scoped>
.wait-blink {
    animation: blink 0.5s infinite;
}
@keyframes blink {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
}
</style>