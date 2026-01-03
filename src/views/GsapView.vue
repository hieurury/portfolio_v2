<script setup>
    import { onMounted, ref } from "vue";
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    gsap.registerPlugin(ScrollTrigger);

    const box1 = ref(null);
    const box2 = ref(null);
    

    onMounted(() => {
        gsap.to(box1.value, {
            scrollTrigger: {
                trigger: box1.value,
                start: "top center",
                end: "bottom 100px",
                markers: true,
                toggleActions: "restart pause resume reverse",
            }, // start animation when ".box1" enters the viewport
            x: 1000,
            duration: 3,
        });
        gsap.to(box2.value, {
            scrollTrigger: {
                trigger: box2.value,
                start: "top center",
                end: "bottom 100px",
                markers: true,
                toggleActions: "restart pause resume reverse",
            }, // start animation when ".box1" enters the viewport
            x: 1000,
            y: 200,
            duration: 3,
        });
    });

</script>


<template>
    <div class="w-full min-h-[2000px] flex justify-start items-center">
        <div ref="box1" class="w-12 h-12 bg-orange-600 absolute"></div>
        <div ref="box2" class="shadow-md w-12 h-12 bg-slate-600 absolute"></div>
    </div>
</template>


<style scoped>

</style>