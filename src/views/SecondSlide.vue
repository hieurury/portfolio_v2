<script setup>
    import { inject, onMounted, ref, watch } from 'vue';
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    //init
    gsap.registerPlugin(ScrollTrigger);

    const container = ref(null);
    const line = ref(null);


    
    function createAnimation() {
        gsap.fromTo(line.value, 
            {
                width: '0%'
            },
            {
                width: '100%',
                ease: 'power1.out',
            }
        );
    }

    onMounted(() => {
        if(container.value) {
            createAnimation();
        }
    })

</script>

<template>
    <div ref="container" class="grid grid-cols-2 min-h-screen bg-black/90">
        <div class="col-span-1 p-4">
            <span ref="line" class="block h-1 bg-white"></span>
        </div>
        <div class="col-span-1"></div>
    </div>
</template>

<style scoped>
</style>