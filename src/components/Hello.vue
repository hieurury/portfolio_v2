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
    <h1 
    class="lg:text-8xl text-5xl font-bold tracking-widest
    text-gray-200 pb-4 relative"
    :class="[{
        'block': isHeadingDone,
        'inline-block': !isHeadingDone || isPenWait
    }]"
    >{{ headingRef }}
        <span 
        v-show="isPenWait" 
        class="w-10 h-2 bg-white absolute bottom-4 -right-6"
        :class="[{
            'wait-blink': isHeadingDone
        }]"></span>
    </h1>
    <p 
    class="text-3xl text-gray-300 relative inline-block"
    >
    {{ descriptionRef }}
        <span 
        v-show="!isPenWait"
        class="w-6 h-1 bg-white absolute bottom-0 lg:-right-8"
        :class="[{
            'wait-blink right-32': isDescriptionDone
        }]"
        ></span>
    </p>
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