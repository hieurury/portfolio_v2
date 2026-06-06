<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import gsap from 'gsap';
import { useState } from '../hooks/useState.js';

const { isAutoPlay, toggleAutoPlay, showTerminal, toggleTerminal } = useState();

const isOpen = ref(false);

const options = computed(() => [
    { 
        id: 'auto', 
        label: 'Auto Play', 
        desc: isAutoPlay.value ? 'Đang chạy tự động...' : 'Tự động cuộn Slider', 
        icon: isAutoPlay.value ? 'material-symbols:pause-circle-rounded' : 'material-symbols:smart-display-rounded',
        active: isAutoPlay.value
    },
    { 
        id: 'terminal', 
        label: 'Terminal', 
        desc: showTerminal.value ? 'Đang mở' : 'Chế độ dòng lệnh', 
        icon: 'material-symbols:terminal-rounded',
        active: showTerminal.value
    }
]);

const toggleMenu = () => {
    isOpen.value = !isOpen.value;
};

const selectOption = (opt, event) => {
    // Phần tử HTML được click
    const container = event.currentTarget;
    const iconWrapper = container.querySelector('.icon-wrapper');
    
    if (opt.id === 'auto') {
        toggleAutoPlay();
    } else if (opt.id === 'terminal') {
        toggleTerminal();
    }
    
    // Animation glow nền
    gsap.fromTo(container, 
        { backgroundColor: 'rgba(14, 165, 233, 0.4)' }, // Màu Sky-500 nhạt
        { backgroundColor: 'rgba(255, 255, 255, 0)', duration: 0.8, ease: 'power2.out', clearProps: 'backgroundColor' }
    );

    // Animation nảy icon (Bounce)
    const tl = gsap.timeline();
    tl.to(iconWrapper, { scale: 0.7, duration: 0.1, ease: 'power1.out' })
      .to(iconWrapper, { scale: 1.2, duration: 0.3, ease: 'back.out(2)' })
      .to(iconWrapper, { scale: 1, duration: 0.2, ease: 'power1.out' });
};
</script>

<template>
    <!-- Trôi nổi dưới cùng màn hình ở chính giữa -->
    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        
        <!-- Menu Panel (Hiệu ứng mở/đóng mượt mà bằng Vue Transition) -->
        <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-8 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-8 scale-95"
        >
            <div v-show="isOpen" class="mb-4 bg-black/60 relative backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-1 min-w-[260px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] before:content-[''] before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-black/60">
                
                <button 
                    v-for="(opt, index) in options" 
                    :key="opt.id"
                    @click="(e) => selectOption(opt, e)"
                    class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-colors text-left group overflow-hidden relative cursor-pointer"
                >
                    <!-- Wrapper chứa Icon -->
                    <div class="icon-wrapper p-2 bg-white/5 border border-white/10 rounded-lg group-hover:bg-sky-500/20 group-hover:border-sky-500/30 group-hover:text-sky-400 text-gray-300 transition-colors shadow-lg"
                         :class="{ 'bg-sky-500/20 border-sky-500/30 text-sky-400': opt.active }">
                        <Icon :icon="opt.icon" class="w-6 h-6" />
                    </div>
                    <!-- Text mô tả -->
                    <div>
                        <h4 class="text-white font-bold text-sm tracking-wide">{{ opt.label }}</h4>
                        <p class="text-gray-400 text-xs mt-0.5">{{ opt.desc }}</p>
                    </div>
                </button>

            </div>
        </Transition>

        <!-- Toggle Button (Mũi tên) -->
        <button 
            @click="toggleMenu" 
            class="w-14 h-14 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex justify-center items-center text-white hover:bg-white/10 hover:border-white/30 transition-all shadow-[0_0_20px_rgba(0,0,0,0.6)] cursor-pointer outline-none"
            :class="{ 'bg-sky-900/40 border-sky-500/40' : isOpen }"
        >
            <Icon 
                :icon="isOpen ? 'material-symbols:keyboard-arrow-down-rounded' : 'material-symbols:keyboard-arrow-up-rounded'" 
                class="w-8 h-8 transition-transform duration-300"
            />
        </button>
    </div>
</template>

<style scoped>
</style>