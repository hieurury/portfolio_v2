<script setup>
    import CodeBlock from '../components/CodeBlock.vue';
    import SupportBlock from '../components/SupportBlock.vue';
    import DynamicOptions from '../components/DynamicOptions.vue';
    import { useRoute } from 'vue-router';
    
    const route = useRoute();
</script>

<template>
    <div class="relative">
        <div class="fixed top-6 left-8 z-50 pointer-events-none mix-blend-difference">
            <h2 class="text-sm font-bold text-gray-400 uppercase tracking-widest font-mono">
                portfolio <span class="text-white mx-2">/</span> <span class="text-sky-400">{{ route.name || '...' }}</span>
            </h2>
        </div>
        <CodeBlock />
        <SupportBlock/>
        <router-view></router-view>
        <DynamicOptions/>
        <!-- <div class="absolute bottom-4 right-0 left-0 mx-auto h-12 rounded-full cursor-pointer">
        </div> -->
    </div>
</template>

<style scoped>
</style>