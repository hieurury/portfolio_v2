<script setup>
    import { ref, onMounted, provide, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import { useState } from '../hooks/useState.js';

    //components
    import Hello from '../components/Hello.vue';
    import StatusCard from '../components/StatusCard.vue';
    import Programming from '../components/Programming.vue';
    //icons
    import { Icon } from '@iconify/vue';

    const router = useRouter();
    const { isAutoPlay } = useState();
    let autoPlayTimeout = null;

    //init
    gsap.registerPlugin(ScrollTrigger);

    //refs          
    const isHelloDone = ref(false);
    const isStatusDone = ref(false);
    const isProgrammingDone = ref(false);
    const isRightSlideDone = ref(false);
    const slideRight = ref(null);

    watch(isAutoPlay, (newVal) => {
        if (newVal && isRightSlideDone.value) {
            clearTimeout(autoPlayTimeout);
            autoPlayTimeout = setTimeout(() => {
                if (isAutoPlay.value) router.push('/second');
            }, 1200);
        } else if (!newVal) {
            clearTimeout(autoPlayTimeout);
        }
    });

    //methods
    const handleHelloDone = () => {
        isHelloDone.value = true;
    };
    const handleStatusDone = () => {
        isStatusDone.value = true;
    };
    const handleProgrammingDone = () => {
        isProgrammingDone.value = true;
        // Chạy animation hiển thị phần bên phải sau khi phần trái đã xong
        if(slideRight.value) {
            gsap.fromTo(slideRight.value,
                {
                    x: 100,
                    opacity: 0,
                },
                {
                    x: 0,
                    duration: 1,
                    ease: 'power2.out',
                    opacity: 1,
                    onComplete: () => {
                        isRightSlideDone.value = true;
                        if (isAutoPlay.value) {
                            autoPlayTimeout = setTimeout(() => {
                                if (isAutoPlay.value) router.push('/second');
                            }, 1200);
                        }
                    }
                }
            );
        }
    };

    onMounted(() => {
        // Khởi tạo ẩn phần bên phải
        if(slideRight.value) {
            gsap.set(slideRight.value, { opacity: 0, x: 100 });
        }
    });
</script>

<template>
    <div class="grid lg:grid-cols-2 grid-cols-1 min-h-screen bg-[#0a0a0a] relative overflow-hidden">
        
        <!-- Ánh sáng loá chạy ngang -> Sweep Flare Effect giống SecondSlide -->
        <div class="absolute inset-0 z-0 pointer-events-none opacity-60">
            <div class="sweep-anim absolute top-0 bottom-0 w-full lg:w-[150%] bg-gradient-to-r from-transparent via-sky-500/10 to-transparent skew-x-[-20deg]"></div>
        </div>

        <!-- Left side (Nội dung và dữ liệu cũ) -->
        <div class="col-span-1 px-6 py-12 lg:pl-16 relative z-20 flex flex-col justify-center">
            <Hello
            title="Hi There!"
            description="Welcome to my portfolio!"
            @done="handleHelloDone"
            />
            
            <div class="lg:pr-12">
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
            
            <!-- footer (Dữ liệu cũ - years of study + button CV) -->
            <div class="grid grid-cols-4 mt-8 text-gray-300 items-center">
                <div class="col-span-1 flex flex-col items-center justify-center">
                    <h3 class="text-4xl lg:text-5xl font-extrabold text-white">4,5</h3>
                    <p class="text-xs lg:text-sm text-gray-400 mt-2 uppercase tracking-wider font-semibold text-center">Years of Study</p>
                </div>
                <div class="col-span-3 flex items-center border-l border-white/10 pl-6 h-full">
                    <button class="px-8 py-3 bg-orange-500 text-white font-extrabold rounded-full shadow-[0_0_20px_var(--tw-shadow-color)] shadow-orange-500/50 hover:bg-orange-400 hover:scale-105 transition-all flex items-center gap-2">
                        <Icon icon="material-symbols:download-rounded" class="w-6 h-6"/> Download CV
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Right side (Bố cục nút Next như cũ nhưng phong cách nửa vòng tròn kịch trần, Glassmorphic) -->
        <div class="col-span-1 flex justify-end items-stretch relative z-20 py-0 pr-0">
            <!-- Khối chứa Half-circle chiếm toàn chiều cao màn hình -->
            <div ref="slideRight" class="w-[90%] lg:w-[80%] min-h-screen bg-black/40 backdrop-blur-md border-y border-l border-white/5 rounded-l-full shadow-[-10px_0_30px_-5px_rgba(2,132,199,0.1)] flex flex-col justify-center items-center text-center relative opacity-0">
                
                <h3 class="lg:text-6xl text-4xl font-extrabold text-white mb-4 tracking-tighter ml-12 lg:ml-20">Next step!</h3>
                <p class="text-lg text-gray-400 leading-relaxed mb-12 ml-12 lg:ml-20">Continue your journey</p>
                
                <router-link to="/second" class="ml-12 lg:ml-20 px-12 py-4 bg-sky-500 text-white font-extrabold rounded-full shadow-[0_0_20px_var(--tw-shadow-color)] shadow-sky-500/50 hover:bg-sky-400 hover:scale-110 transition-all flex items-center justify-center">
                    <Icon class="text-white" icon="material-symbols:arrow-forward-rounded" width="36" height="36" />
                </router-link>

            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes sweepMotion {
    0% {
        transform: translateX(-150%) skewX(-20deg);
        opacity: 0;
    }
    30% {
        opacity: 1;
    }
    70% {
        opacity: 1;
    }
    100% {
        transform: translateX(150%) skewX(-20deg);
        opacity: 0;
    }
}

.sweep-anim {
    animation: sweepMotion 6s infinite ease-in-out;
}
</style>