<script setup>
    import { ref, defineProps, onMounted } from 'vue';
    import Tag from './Tag.vue';


    const props = defineProps({
        title: {
            type: String,
            default: 'Programming Languages'
        },
        list: {
            type: Array,
            default: () => ([
                'JavaScript',
                'CSS',
                'HTML',
            ])
        }
    });
    
    const listRef = ref(null);

    onMounted(() => {
        //animation or something
        // appendListItem();
        listRef.value = props.list;
    })

    // const appendListItem = () => {
    //     if(!listRef.value) return;
    //     listRef.value = [];
    //     const interval = setInterval(() => {
    //         if(listRef.value.length >= props.list.length) {
    //             clearInterval(interval);
    //             return;
    //         }
    //         listRef.value.push(props.list[listRef.value.length]);
    //     }, 200);
    // }
</script>

<template>
    <div class="my-2">
        <h3 class="text-gray-300 my-2">{{ props.title }}</h3>
        <ul class="flex">
            <li v-for="(item, index) in listRef" :key="item">
                <Tag :label="item.label" :color="item.color" 
                class="tagAnimate opacity-0"
                :style="{
                    animationDelay: `${(index+1) * 200}ms`
                }"
                />
            </li>
        </ul>
        <!-- <h3 class="text-gray-300 my-2">Technologies:    </h3>
        <ul>
            <li>
                <Tag label="Git" color="orange"/>
                <Tag label="MongoDB" color="emerald"/>
                <Tag label="Postman" color="orange"/>
                <Tag label="Vite" color="purple"/>
                <Tag label="Vercel" color="slate"/>
                <Tag label="Cloudflare" color="orange"/>
            </li>
        </ul> -->
    </div>
</template>

<style scoped>
/* css */
.tagAnimate {
    animation: tag-animate 0.5s ease-in-out forwards;
}

@keyframes tag-animate {
    0% {
        opacity: 0;
        transform: translateX(20px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>