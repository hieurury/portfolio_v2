<script setup>
    import { ref, onMounted, watch } from 'vue';
    //components
    import CodeBlock from '../components/CodeBlock.vue';
    import SupportBlock from '../components/SupportBlock.vue';
    import Hello from '../components/Hello.vue';
    import StatusCard from '../components/StatusCard.vue';

    //icons
    import { Icon } from '@iconify/vue';
    import Programming from '../components/Programming.vue';


    const isHelloDone = ref(false);
    const isStatusDone = ref(false);


    const handleHelloDone = () => {
        isHelloDone.value = true;
    }

    const handleStatusDone = () => {
        isStatusDone.value = true;
    }


</script>


<template>
    <CodeBlock class="hidden"/>
    <SupportBlock/>
    <div class="flex flex-row h-screen overflow-x-hidden">
        <div id="first" class="w-full shrink-0 bg-black/90">
            <div class="grid grid-cols-2 min-h-screen">
                <div class="col-span-1 px-6 py-8">
                    <Hello
                    title="Hi There!"
                    description="Welcome to my portfolio!"
                    @done="handleHelloDone"
                    />
                    <div class="pr-48">
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
                <div class="col-span-1 flex justify-center">
                    <div class="flex flex-1 items-center bg-orange-500 rounded-l-full">
                        <div class="flex flex-1 flex-col items-center space-y-6">
                            <h3 class="text-5xl font-extrabold uppercase text-white">Next step!</h3>
                            <p class="text-white">Continue your journey</p>
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