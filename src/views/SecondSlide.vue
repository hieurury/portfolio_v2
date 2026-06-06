<script setup>
import { onMounted, onUnmounted, ref, nextTick, watch } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Icon } from '@iconify/vue';
import { useState } from '../hooks/useState.js';

gsap.registerPlugin(ScrollTrigger);

const { isAutoPlay } = useState();
const autoPlayTimeout = ref(null);

const scrollContainer = ref(null);
const sectionsRef = ref([]);

const currentIndex = ref(0);

watch(isAutoPlay, (newVal) => {
    if (newVal) {
        const currentMilestone = milestones[currentIndex.value];
        const typed = typedMilestones.value[currentIndex.value];
        const isTypedComplete = typed.title === currentMilestone.title && typed.description === currentMilestone.description;

        if (isTypedComplete && currentIndex.value < milestones.length - 1) {
            clearTimeout(autoPlayTimeout.value);
            autoPlayTimeout.value = setTimeout(() => {
                if (isAutoPlay.value) scrollTo(currentIndex.value + 1);
            }, 1200);
        }
    } else {
        clearTimeout(autoPlayTimeout.value);
    }
});

const milestones = [
    {
        year: '2020 - 2021',
        title: 'Bắt đầu học Lập trình',
        description: 'Bắt đầu làm quen với HTML, CSS và JavaScript qua các khóa học trực tuyến và đồ án đại học.',
        color: 'text-orange-400',
        bg: 'bg-orange-950/20',
        lineColor: 'bg-orange-500',
        shadow: 'shadow-orange-500',
        flare: 'via-orange-500/10',
        image: '/second/second-1.png',
        rotation: '-rotate-3'
    },
    {
        year: 'Đầu 2022',
        title: 'Học về Node.js',
        description: 'Bắt đầu viết các ứng dụng backend đơn giản với Node.js, Express và MongoDB. Tìm hiểu về RESTful API và cơ sở dữ liệu NoSQL.',
        color: 'text-red-500',
        bg: 'bg-red-950/20',
        lineColor: 'bg-red-500',
        shadow: 'shadow-red-500',
        flare: 'via-red-500/10',
        image: '/second/second-2.png',
        rotation: '-rotate-4'
    },
    {
        year: '2022 - 2023',
        title: 'Đào sâu vào framework với Vue.js',
        description: 'Làm việc thực tế với Vue.js, TailwindCSS tham gia phát triển giao diện Web tương tác cao.',
        color: 'text-green-400',
        bg: 'bg-green-950/20',
        lineColor: 'bg-green-500',
        shadow: 'shadow-green-500',
        flare: 'via-green-500/10',
        image: '/second/second-3.png',
        rotation: 'rotate-2'
    },
    {
        year: '2023',
        title: 'Đi sâu vào fullstack và dự án thực tế',
        description: 'Tự dựng một số dự án cá nhân, kết hợp frontend Vue.js với backend Node.js/MongoDB. Học cách triển khai ứng dụng và tối ưu hiệu suất.',
        color: 'text-purple-400',
        bg: 'bg-purple-950/20',
        lineColor: 'bg-purple-500',
        shadow: 'shadow-purple-500',
        flare: 'via-purple-500/10',
        image: '/second/second-4.png',
        rotation: '-rotate-2'
    },
    {
        year: '2023 - 2024',
        title: 'Xu hướng AI',
        description: 'Chạy theo xu hướng AI, tích hợp các công nghệ và áp dụng các công cụ AI trong làm việc và nâng cấp hệ thống với các API AI tiên tiến.',
        color: 'text-emerald-400',
        bg: 'bg-emerald-950/20',
        lineColor: 'bg-emerald-500',
        shadow: 'shadow-emerald-500',
        flare: 'via-emerald-500/10',
        image: '/second/second-5.png',
        rotation: 'rotate-3'
    },
    {
        year: 'Hiện tại',
        title: 'Tiếp tục phát triển',
        description: 'Không ngừng học hỏi và cập nhật công nghệ mới, áp dụng AI vào lập trình và giải quyết các vấn đề phức tạp, tối ưu hiệu xuất với AI và biết dùng các công cụ AI mạnh mẽ.',
        color: 'text-sky-400',
        bg: 'bg-sky-950/20',
        lineColor: 'bg-sky-500',
        shadow: 'shadow-sky-500',
        flare: 'via-sky-500/10',
        image: '/second/second-6.png',
        rotation: '-rotate-6'
    }
];

let triggers = [];

const typedMilestones = ref(milestones.map(() => ({ title: '', description: '' })));
const textIntervals = {};

const scrollTo = (index) => {
    if (index >= 0 && index < milestones.length && sectionsRef.value[index]) {
        sectionsRef.value[index].scrollIntoView({ behavior: 'smooth' });
    }
};

const typeText = (index, key, fullText, baseSpeed = 30, callback = null) => {
    const id = `${index}-${key}`;
    if (textIntervals[id]) clearInterval(textIntervals[id]);
    
    typedMilestones.value[index][key] = '';
    let i = 0;
    const speed = baseSpeed;
    
    textIntervals[id] = setInterval(() => {
        if (i < fullText.length) {
            typedMilestones.value[index][key] += fullText.charAt(i);
            i++;
        } else {
            clearInterval(textIntervals[id]);
            if (callback) callback();
        }
    }, speed);
};

const clearTextIntervals = (index) => {
    if (textIntervals[`${index}-title`]) clearInterval(textIntervals[`${index}-title`]);
    if (textIntervals[`${index}-description`]) clearInterval(textIntervals[`${index}-description`]);
};

onMounted(() => {
    nextTick(() => {
        if (!scrollContainer.value) return;

        sectionsRef.value.forEach((section, index) => {
            const leftEl = section.querySelector('.anim-left');
            const rightEl = section.querySelector('.anim-right');
            const lineEl = section.querySelector('.anim-line');

            const trigger = ScrollTrigger.create({
                trigger: section,
                scroller: scrollContainer.value,
                start: "top 60%",
                
                onEnter: () => {
                    currentIndex.value = index;
                    gsap.fromTo(leftEl, 
                        { opacity: 0, x: -50 }, 
                        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out', overwrite: 'auto' }
                    );
                    gsap.fromTo(rightEl, 
                        { opacity: 0, x: 50 }, 
                        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out', overwrite: 'auto' }
                    );
                    // Line roll out
                    if (lineEl) {
                        gsap.fromTo(lineEl, 
                            { scaleY: 0 }, 
                            { scaleY: 1, duration: 2, ease: 'power3.inOut', overwrite: 'auto' }
                        );
                    }

                    typeText(index, 'title', milestones[index].title, 50, () => {
                        typeText(index, 'description', milestones[index].description, 20, () => {
                            const nextBtn = section.querySelector('.next-section-btn');
                            if (nextBtn) {
                                gsap.fromTo(nextBtn, 
                                    { opacity: 0, y: 20 }, 
                                    { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
                                );
                            }
                            const prevBtn = section.querySelector('.prev-section-btn');
                            if (prevBtn) {
                                gsap.fromTo(prevBtn, 
                                    { opacity: 0, y: -20 }, 
                                    { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
                                );
                            }
                            
                            // AutoPlay transition cho SecondSlide (Đợi 1.2s sau khi gõ xong)
                            if (isAutoPlay.value && index < milestones.length - 1) {
                                clearTimeout(autoPlayTimeout.value);
                                autoPlayTimeout.value = setTimeout(() => {
                                    if (isAutoPlay.value) scrollTo(index + 1);
                                }, 1200);
                            }
                        });
                    });
                },

                onLeaveBack: () => {
                    gsap.to([leftEl, rightEl], { opacity: 0, duration: 0.4, overwrite: 'auto' });
                    if (lineEl) gsap.to(lineEl, { scaleY: 0, duration: 0.4, overwrite: 'auto' });
                    
                    const nextBtn = section.querySelector('.next-section-btn');
                    if (nextBtn) gsap.to(nextBtn, { opacity: 0, y: 20, duration: 0.3, overwrite: 'auto' });
                    
                    const prevBtn = section.querySelector('.prev-section-btn');
                    if (prevBtn) gsap.to(prevBtn, { opacity: 0, y: -20, duration: 0.3, overwrite: 'auto' });

                    clearTextIntervals(index);
                    typedMilestones.value[index].title = '';
                    typedMilestones.value[index].description = '';
                },

                onLeave: () => {
                    clearTextIntervals(index);
                    typedMilestones.value[index].title = milestones[index].title;
                    typedMilestones.value[index].description = milestones[index].description;
                    
                    const nextBtn = section.querySelector('.next-section-btn');
                    if (nextBtn) gsap.to(nextBtn, { opacity: 1, y: 0, duration: 0, overwrite: 'auto' });
                    
                    const prevBtn = section.querySelector('.prev-section-btn');
                    if (prevBtn) gsap.to(prevBtn, { opacity: 1, y: 0, duration: 0, overwrite: 'auto' });
                },

                onEnterBack: () => {
                    currentIndex.value = index;
                    gsap.fromTo(leftEl, 
                        { opacity: 0, x: -50 }, 
                        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out', overwrite: 'auto' }
                    );
                    gsap.fromTo(rightEl, 
                        { opacity: 0, x: 50 }, 
                        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out', overwrite: 'auto' }
                    );
                    if (lineEl) {
                        gsap.fromTo(lineEl, 
                            { scaleY: 0 }, 
                            { scaleY: 1, duration: 2, ease: 'power3.inOut', overwrite: 'auto' }
                        );
                    }

                    typeText(index, 'title', milestones[index].title, 50, () => {
                        typeText(index, 'description', milestones[index].description, 20, () => {
                            const nextBtn = section.querySelector('.next-section-btn');
                            if (nextBtn) {
                                gsap.fromTo(nextBtn, 
                                    { opacity: 0, y: 20 }, 
                                    { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
                                );
                            }
                            const prevBtn = section.querySelector('.prev-section-btn');
                            if (prevBtn) {
                                gsap.fromTo(prevBtn, 
                                    { opacity: 0, y: -20 }, 
                                    { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
                                );
                            }
                            
                            // AutoPlay transition cho SecondSlide (Đợi 1.2s sau khi gõ xong)
                            if (isAutoPlay.value && index < milestones.length - 1) {
                                clearTimeout(autoPlayTimeout.value);
                                autoPlayTimeout.value = setTimeout(() => {
                                    if (isAutoPlay.value) scrollTo(index + 1);
                                }, 1200);
                            }
                        });
                    });
                }
            });
            triggers.push(trigger);
        });
    });
});

onUnmounted(() => {
    Object.values(textIntervals).forEach(clearInterval);
    triggers.forEach(t => t.kill());
    ScrollTrigger.getAll().forEach(t => t.kill());
});
</script>

<template>
    <div 
        ref="scrollContainer" 
        class="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory bg-[#0a0a0a] scroll-smooth"
    >
        <div 
            v-for="(item, index) in milestones" 
            :key="index"
            ref="sectionsRef"
            class="min-h-screen relative overflow-hidden w-full snap-start snap-always flex items-center justify-center py-12 px-6 lg:px-16 transition-colors duration-1000"
            :class="item.bg"
        >
            <!-- Ánh sáng loá chạy ngang -> Sweep Flare Effect -->
            <div class="absolute inset-0 z-0 pointer-events-none opacity-60">
                <div class="sweep-anim absolute top-0 bottom-0 w-full lg:w-[150%] bg-gradient-to-r from-transparent to-transparent skew-x-[-20deg]"
                     :class="item.flare"></div>
            </div>

            <!-- Timeline Vertical Line -->
            <div class="absolute top-[20%] h-[60%] w-[3px] z-10 pointer-events-none"
                 :class="index % 2 === 0 ? 'left-6 lg:left-16' : 'right-6 lg:right-16'">
                <div class="anim-line w-full h-full origin-top relative rounded-full" :class="item.lineColor">
                    <!-- Point nhấp nháy phát sáng -->
                    <div class="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full animate-pulse shadow-[0_0_20px_var(--tw-shadow-color)]"
                         :class="[
                             item.lineColor, 
                             item.shadow,
                             index === milestones.length - 1 ? 'bottom-0 translate-y-1/2' : 'top-0 -translate-y-1/2'
                         ]"></div>
                </div>
            </div>

            <!-- Nội dung (z-20 đè lên trên Line và Flare) -->
            <div class="max-w-7xl w-full pl-6 lg:pl-0 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-20">
                
                <!-- LAYOUT LẼ MÀN HÌNH CHẴN: TIME BÊN TRÁI, CARD CHI TIẾT BÊN PHẢI -->
                <template v-if="index % 2 === 0">
                    <div class="anim-left flex flex-col items-center lg:items-start text-center lg:text-left opacity-0">
                        <div class="text-6xl lg:text-8xl font-black mb-4 tracking-tighter" :class="item.color">{{ item.year }}</div>
                        <div class="flex space-x-6 mt-6">
                            <button @click="scrollTo(index - 1)" :disabled="index === 0" class="p-4 bg-white/5 hover:bg-white/20 border border-white/10 rounded-full disabled:opacity-20 transition-all cursor-pointer disabled:cursor-not-allowed">
                                <Icon icon="material-symbols:arrow-upward" class="w-8 h-8 text-white"/>
                            </button>
                            <button @click="scrollTo(index + 1)" :disabled="index === milestones.length - 1" class="p-4 bg-white/5 hover:bg-white/20 border border-white/10 rounded-full disabled:opacity-20 transition-all cursor-pointer disabled:cursor-not-allowed">
                                <Icon icon="material-symbols:arrow-downward" class="w-8 h-8 text-white"/>
                            </button>
                        </div>
                    </div>

                    <div class="anim-right flex flex-col opacity-0 h-full justify-center">
                        <div class="bg-black/40 p-8 rounded-2xl border border-white/5 backdrop-blur-md relative transition-transform duration-500 hover:scale-[1.02] min-h-[400px] flex flex-col">
                            <div class="flex-grow">
                                <h3 class="mb-4 text-3xl font-bold text-white min-h-[40px]">
                                    {{ typedMilestones[index].title }}<span v-if="typedMilestones[index].title !== item.title" class="animate-pulse">_</span>
                                </h3>
                                <p class="text-lg text-gray-400 leading-relaxed mb-8 min-h-[84px]">
                                    {{ typedMilestones[index].description }}<span v-if="typedMilestones[index].title === item.title && typedMilestones[index].description !== item.description" class="animate-pulse">_</span>
                                </p>
                            </div>
                            <img :src="item.image" :class="['w-full max-h-60 object-cover object-center rounded-xl shadow-2xl shadow-black/80 transform origin-center', item.rotation]" alt="Milestone Thumbnail" loading="lazy" />
                            
                            <!-- Nút Trở Lại (Chỉ hiển thị nút ẩn cho Slide đầu tiên) -->
                            <div v-if="index === 0" class="absolute -top-6 left-8 sm:left-12 z-50">
                                <router-link to="/" class="prev-section-btn opacity-0 px-8 py-3 bg-orange-500 text-white font-extrabold rounded-full shadow-[0_0_20px_var(--tw-shadow-color)] shadow-orange-500/50 hover:bg-orange-400 hover:scale-105 transition-all flex items-center gap-2">
                                    <Icon icon="material-symbols:arrow-back-rounded" class="w-6 h-6"/> Trở lại
                                </router-link>
                            </div>

                            <!-- Nút Chuyển Tiếp (Chỉ hiển thị nút ẩn cho Slide cuối) -->
                            <div v-if="index === milestones.length - 1" class="absolute -bottom-6 right-8 sm:right-12 z-50">
                                <router-link to="/third" class="next-section-btn opacity-0 px-8 py-3 bg-sky-500 text-white font-extrabold rounded-full shadow-[0_0_20px_var(--tw-shadow-color)] shadow-sky-500/50 hover:bg-sky-400 hover:scale-105 transition-all flex items-center gap-2">
                                    Tiếp tục <Icon icon="material-symbols:arrow-forward-rounded" class="w-6 h-6"/>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- LAYOUT MÀN HÌNH LẺ: CARD CHI TIẾT BÊN TRÁI, TIME BÊN PHẢI -->
                <template v-else>
                    <div class="anim-left flex flex-col order-2 lg:order-1 opacity-0 h-full justify-center">
                        <div class="bg-black/40 p-8 rounded-2xl border border-white/5 backdrop-blur-md relative transition-transform duration-500 hover:scale-[1.02] min-h-[400px] flex flex-col">
                            <div class="flex-grow">
                                <h3 class="mb-4 text-3xl font-bold text-white min-h-[40px]">
                                    {{ typedMilestones[index].title }}<span v-if="typedMilestones[index].title !== item.title" class="animate-pulse">_</span>
                                </h3>
                                <p class="text-lg text-gray-400 leading-relaxed mb-8 min-h-[84px]">
                                    {{ typedMilestones[index].description }}<span v-if="typedMilestones[index].title === item.title && typedMilestones[index].description !== item.description" class="animate-pulse">_</span>
                                </p>
                            </div>
                            <img :src="item.image" :class="['w-full max-h-60 object-cover object-center rounded-xl shadow-2xl shadow-black/80 transform origin-center', item.rotation]" alt="Milestone Thumbnail" loading="lazy" />
                            
                            <!-- Nút Chuyển Tiếp -->
                            <div v-if="index === milestones.length - 1" class="absolute -bottom-6 left-8 sm:left-12 z-50">
                                <router-link to="/third" class="next-section-btn opacity-0 px-8 py-3 bg-sky-500 text-white font-extrabold rounded-full shadow-[0_0_20px_var(--tw-shadow-color)] shadow-sky-500/50 hover:bg-sky-400 hover:scale-105 transition-all flex items-center gap-2">
                                    Tiếp tục <Icon icon="material-symbols:arrow-forward-rounded" class="w-6 h-6"/>
                                </router-link>
                            </div>
                        </div>
                    </div>

                    <div class="anim-right flex flex-col items-center lg:items-end text-center lg:text-right order-1 lg:order-2 opacity-0">
                        <div class="text-6xl lg:text-8xl font-black mb-4 tracking-tighter" :class="item.color">{{ item.year }}</div>
                        <div class="flex space-x-6 mt-6">
                            <button @click="scrollTo(index - 1)" :disabled="index === 0" class="p-4 bg-white/5 hover:bg-white/20 border border-white/10 rounded-full disabled:opacity-20 transition-all cursor-pointer disabled:cursor-not-allowed">
                                <Icon icon="material-symbols:arrow-upward" class="w-8 h-8 text-white"/>
                            </button>
                            <button @click="scrollTo(index + 1)" :disabled="index === milestones.length - 1" class="p-4 bg-white/5 hover:bg-white/20 border border-white/10 rounded-full disabled:opacity-20 transition-all cursor-pointer disabled:cursor-not-allowed">
                                <Icon icon="material-symbols:arrow-downward" class="w-8 h-8 text-white"/>
                            </button>
                        </div>
                    </div>
                </template>

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

::-webkit-scrollbar {
    width: 0px;
    background: transparent;
}
</style>