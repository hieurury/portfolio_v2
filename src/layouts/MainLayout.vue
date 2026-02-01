<script setup>
    import CodeBlock from '../components/CodeBlock.vue';
    import SupportBlock from '../components/SupportBlock.vue';
    import DynamicOptions from '../components/DynamicOptions.vue';
</script>

<template>
    <div class="relative">
        <CodeBlock class="hidden"/>
        <SupportBlock/>
        <router-view></router-view>
        <DynamicOptions/>
        <!-- <div class="absolute bottom-4 right-0 left-0 mx-auto h-12 rounded-full cursor-pointer">
        </div> -->
    </div>
</template>

<style scoped>
</style>