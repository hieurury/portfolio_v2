<script setup>
    import { ref, onMounted, watch } from 'vue';
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    //components
    import CodeBlock from '../components/CodeBlock.vue';
    import SupportBlock from '../components/SupportBlock.vue';
    import Hello from '../components/Hello.vue';
    import StatusCard from '../components/StatusCard.vue';

    //icons
    import { Icon } from '@iconify/vue';
    import Programming from '../components/Programming.vue';

    //init
    gsap.registerPlugin(ScrollTrigger);

    const isHelloDone = ref(false);
    const isStatusDone = ref(false);
    const isProgrammingDone = ref(false);
    //animation
    const slideRight = ref(null);


    const handleHelloDone = () => {
        isHelloDone.value = true;
    }

    const handleStatusDone = () => {
        isStatusDone.value = true;
    }

    const handleProgrammingDone = () => {
        isProgrammingDone.value = true;
    }

    //gsap
    onMounted(() => {
        //animation cho silde right
        if(slideRight.value){
            gsap.fromTo(slideRight.value, 
            {
                opacity: 0,
                width: '0%'
            },
            {
                opacity: 1,
                width: '100%',
                duration: 0.5,
                ease: 'ease.out'
            });
        }
    })


</script>


<template>
    <CodeBlock class="hidden"/>
    <SupportBlock/>
    <div class="flex flex-row min-h-screen overflow-x-hidden">
        <div id="first" class="w-full shrink-0 bg-black/90">
            <div class="grid grid-cols-2 min-h-screen">
                <div class="lg:col-span-1 col-span-2 px-6 py-8">
                    <Hello
                    title="Hi There!"
                    description="Welcome to my portfolio!"
                    @done="handleHelloDone"
                    />
                    <div class="lg:pr-48">
                        <StatusCard 
                        v-if="isHelloDone" 
                        @done="handleStatusDone" />
                    </div>
                    <!-- list of programing -->
                    <Programming 
                    title="Languages"
                    :list="[
                        {label: 'JavaScript', color: 'yellow'},
                        {label: 'Python', color: 'emerald'},
                        {label: 'HTML', color: 'orange'},
                        {label: 'CSS', color: 'blue'}
                    ]"
                    v-if="isStatusDone"/>
                    <Programming 
                    @done="handleProgrammingDone"
                    title="Technologies"
                    :list="[
                        {label: 'Vue.js', color: 'green'},
                        {label: 'MongoDB', color: 'emerald'},
                        {label: 'Node.js', color: 'green'},
                        {label: 'Git', color: 'orange'}
                    ]"
                    v-if="isStatusDone"/>
                    <!-- footer -->
                    <div class="grid grid-cols-4 mt-16 text-gray-300">
                        <div class="col-span-1 flex flex-col items-center">
                            <h3 class="text-2xl font-extrabold">4,5</h3>
                            <p class="text-sm">Years of Study</p>
                        </div>
                        <div class="col-span-3 flex items-center border-l border-gray-300 pl-2">
                            <button class="bg-orange-600 px-16 py-2 rounded-lg shadow-[0_4px_0] shadow-orange-600/50
                            cursor-pointer active:shadow-[0_2px_0] active:translate-y-1">
                                Download CV
                            </button>
                        </div>
                    </div>
                </div>
                <!-- bên phải -->
                <div class="lg:col-span-1 col-span-2 flex justify-end items-center">
                    <div ref="slideRight" class="h-full flex items-center lg:bg-orange-500 bg-transparent rounded-l-full">
                        <div class="flex flex-1 flex-col items-center lg:space-y-6 space-x-0 lg:py-0 py-6">
                            <h3 class="lg:text-5xl text-2xl font-extrabold uppercase text-white">Next step!</h3>
                            <p class="text-white lg:text-md text-sm">Continue your journey</p>
                            <a href="#second" class="bg-emerald-500/90 cursor-pointer backdrop-blur-lg border-2 border-white shadow-[0_2px_0] shadow-white px-12 rounded-full
                            active:shadow-[0_0_0] active:translate-y-1 flex items-center space-x-4 py-2 transition-all duration-150 hover:bg-emerald-500/100">
                                <Icon class="text-white" icon="material-symbols:line-end-arrow-rounded" width="64" height="64" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="second" class="w-full shrink-0 bg-green-600/40 flex justify-center items-center">
            <h1 class="text-4xl uppercase font-semibold text-gray-600 tracking-wider">Phần hai</h1>
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