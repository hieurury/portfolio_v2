<script setup>
    import { ref, onMounted, provide } from 'vue';
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    //components
    import CodeBlock from '../components/CodeBlock.vue';
    import SupportBlock from '../components/SupportBlock.vue';
    // import FirstSlide from '../components/FirstSlide.vue';


    

    //init
    gsap.registerPlugin(ScrollTrigger);

   


</script>


<template>
    <CodeBlock class="hidden"/>
    <SupportBlock/>
    <div ref="slidesContainer" class="flex flex-row min-h-screen overflow-x-hidden">
        <div id="first" class="w-full shrink-0 bg-black/90">
            <!-- <FirstSlide/> -->
        </div>
        <div id="second" class="w-full shrink-0 bg-black/90">
        </div>
        <div id="third" class="w-full shrink-0 bg-sky-600/40 flex justify-center items-center">
            <h1 class="text-4xl uppercase font-semibold text-gray-600 tracking-wider">Phần ba</h1>
        </div>
        <div id="last" class="w-full shrink-0 bg-slate-800/20 flex justify-center items-center">
            <h1 class="text-4xl uppercase font-semibold text-gray-600 tracking-wider">Phần cuối</h1>
        </div>
    </div>
</template>


<style scoped>
</style>