<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue';
import gsap from 'gsap';
import { Icon } from '@iconify/vue';
import { useState } from '../hooks/useState.js';
import { useRouter } from 'vue-router';

const { isAutoPlay } = useState();
const router = useRouter();

// ==========================================
// PHẦN 1: DỮ LIỆU & LOGIC BỘ BÀI (CARD STACK)
// ==========================================
const projects = [
    {
        name: 'Headless CMS tạo Portfolio tự động',
        members: ['Me', 'chucino', 'cqiungo'],
        description: 'Hệ thống CMS giúp quản lý các dự án cá nhân, các bài viết blog, thông tin liên hệ và các dự án cá nhân',
        images: [
            '/experience/project1-1.jpg',
            '/experience/project1-2.jpg',
            '/experience/project1-3.jpg',
        ],
        technologies: [
            { name: 'React', icon: 'logos:react' },
            { name: 'TailwindCSS', icon: 'logos:tailwindcss-icon' },
            { name: 'Node.js', icon: 'logos:nodejs-icon' },
            { name: 'MongoDB', icon: 'logos:mongodb-icon' },
            { name: 'NestJS', icon: 'logos:nestjs' },
            { name: 'Vite', icon: 'logos:vitejs' },
        ],
        links: [
            { name: 'Mã nguồn', icon: 'mdi:github', url: 'https://github.com/hieurury/Headless-CMS-Portfolio-generate' }
        ],
        color: 'text-orange-400',
        bg: 'border-orange-500/30 bg-gradient-to-br from-orange-900/20 to-black/80',
        btn: 'bg-orange-500 hover:bg-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.5)] text-white'
    },
    {
        name: 'Ứng dụng phụ đề & thuyết minh video đa ngôn ngữ',
        members: ['Me'],
        description: 'Ứng dụng desktop hỗ trợ dịch và edit phụ đề với các mô hình AI mạnh mẽ đến từ nhiều nguồn, hỗ trợ nhiều loại ngôn ngữ và có khả năng tuỳ chỉnh cao.',
        images: [
            '/experience/project2-1.jpg',
            '/experience/project2-2.jpg',
            '/experience/project2-3.jpg',
        ],
        technologies: [
            { name: 'Python', icon: 'logos:python' },
            { name: 'Vue 3', icon: 'logos:vue' },
            { name: 'Tauri', icon: 'logos:tauri' },
            { name: 'FFmpeg', icon: 'logos:ffmpeg' },
            { name: 'Vite', icon: 'logos:vitejs' },
            { name: 'Whisper', icon: 'simple-icons:openai' },
        ],
        links: [
            { name: 'Mã nguồn', icon: 'mdi:github', url: '#' },
            { name: 'Sản phẩm', icon: 'mdi:web', url: '#' }
        ],
        color: 'text-purple-400',
        bg: 'border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-black/80',
        btn: 'bg-purple-500 hover:bg-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)] text-white'
    },
    {
        name: 'Game đa nền tảng với Capacitor',
        members: ['Me'],
        description: 'Giải pháp phát triển trò chơi đa nền tảng với Capacitor, hỗ trợ nhiều loại thiết bị và có khả năng tùy chỉnh cao.',
        images: [
            '/experience/project3-1.jpg',
            '/experience/project3-2.jpg',
            '/experience/project3-3.jpg',
        ],
        technologies: [
            { name: 'Capacitor', icon: 'logos:capacitorjs-icon' },
            { name: 'Vue 3', icon: 'logos:vue' },
            { name: 'TailwindCSS', icon: 'logos:tailwindcss-icon' },
            { name: 'Pixi.js', icon: 'logos:pixijs' },
            { name: 'Vite', icon: 'logos:vitejs' },
            { name: 'Supabase', icon: 'logos:supabase-icon' },
        ],
        links: [
            { name: 'Mã nguồn', icon: 'mdi:github', url: 'https://github.com/hieurury/star-keeper' },
            { name: 'Sản phẩm', icon: 'mdi:web', url: 'https://github.com/hieurury/star-keeper/releases' }
        ],
        color: 'text-emerald-400',
        bg: 'border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 to-black/80',
        btn: 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] text-white'
    }
];

const currentIndex = ref(0);
const animatingOutIndex = ref(-1);
const animatingPhase = ref('');
const isMounted = ref(false);
const isAnimatingCycle = ref(false);
const isFinishedCycle = ref(false);

const cardRefs = ref([]);
let autoPlayTimer = null;
let currentIntervals = [];

const typedNames = ref(projects.map((p, i) => i === 0 ? '' : p.name));
const typedDescs = ref(projects.map((p, i) => i === 0 ? '' : p.description));

const activeImageOffset = ref(0);
let imageCycleInterval = null;

const startImageCycle = () => {
    clearInterval(imageCycleInterval);
    activeImageOffset.value = 0;
    imageCycleInterval = setInterval(() => {
        activeImageOffset.value = (activeImageOffset.value + 1) % projects[currentIndex.value].images.length;
    }, 3500); 
};

const getDisplayImage = (imgIndex) => {
    const images = projects[currentIndex.value].images;
    const len = images.length;
    return images[(imgIndex + activeImageOffset.value) % len];
};

const clearAllTyping = () => {
    currentIntervals.forEach(clearInterval);
    currentIntervals = [];
};

const prepareCard = (index) => {
    typedNames.value[index] = '';
    typedDescs.value[index] = '';
    
    const cardEl = cardRefs.value[index];
    if (!cardEl) return;
    
    const members = cardEl.querySelectorAll('.anim-member');
    const techs = cardEl.querySelectorAll('.anim-tech');
    const btns = cardEl.querySelectorAll('.anim-btn');
    
    gsap.killTweensOf([members, techs, btns]);
    gsap.set([members, techs, btns], { opacity: 0, y: -20 });
};

const typeText = (refArray, index, fullText, speed, callback) => {
    refArray.value[index] = '';
    let i = 0;
    const interval = setInterval(() => {
        if (i < fullText.length) {
            refArray.value[index] += fullText.charAt(i);
            i++;
        } else {
            clearInterval(interval);
            if (callback) callback();
        }
    }, speed);
    currentIntervals.push(interval);
};

const animateActiveCard = (index) => {
    if (currentIndex.value !== index) return;
    
    const cardEl = cardRefs.value[index];
    if (!cardEl) return;
    
    const members = cardEl.querySelectorAll('.anim-member');
    const techs = cardEl.querySelectorAll('.anim-tech');
    const btns = cardEl.querySelectorAll('.anim-btn');
    
    typeText(typedNames, index, projects[index].name, 40, () => {
        typeText(typedDescs, index, projects[index].description, 15, () => {
            const tl = gsap.timeline({
                onComplete: () => {
                    if (isAutoPlay.value) {
                        autoPlayTimer = setTimeout(() => {
                            if (isFinishedCycle.value) return;
                            if (currentIndex.value === projects.length - 1) {
                                isFinishedCycle.value = true;
                                nextCard();
                                setTimeout(() => {
                                    scrollToGacha();
                                }, 1000);
                            } else {
                                nextCard();
                            }
                        }, 2500);
                    }
                }
            });
            
            tl.to(members, { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: 'power2.out' })
              .to(techs, { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: 'power2.out' }, "-=0.1")
              .to(btns, { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: 'power2.out' }, "-=0.1");
        });
    });
};

const nextCard = () => {
    if (isAnimatingCycle.value) return;
    isAnimatingCycle.value = true;
    
    clearTimeout(autoPlayTimer);
    
    const oldIndex = currentIndex.value;
    
    clearAllTyping();
    typedNames.value[oldIndex] = projects[oldIndex].name;
    typedDescs.value[oldIndex] = projects[oldIndex].description;
    
    if (cardRefs.value[oldIndex]) {
        const els = cardRefs.value[oldIndex].querySelectorAll('.anim-item');
        gsap.killTweensOf(els);
        gsap.set(els, { opacity: 1, y: 0 });
    }
    
    const nextIdx = (oldIndex + 1) % projects.length;
    prepareCard(nextIdx);
    
    animatingOutIndex.value = oldIndex;
    animatingPhase.value = 'right';
    
    setTimeout(() => {
        currentIndex.value = nextIdx;
        animatingPhase.value = 'back';
        
        setTimeout(() => {
            animatingOutIndex.value = -1;
            isAnimatingCycle.value = false;
            animateActiveCard(currentIndex.value);
        }, 400); 
    }, 400); 
};

watch(isAutoPlay, (newVal) => {
    if (newVal) {
        if (!isAnimatingCycle.value && currentIntervals.length === 0 && !isFinishedCycle.value) {
            if (currentIndex.value === projects.length - 1) {
                isFinishedCycle.value = true;
                nextCard();
                setTimeout(() => {
                    scrollToGacha();
                }, 1000);
            } else {
                autoPlayTimer = setTimeout(nextCard, 1000);
            }
        }
    } else {
        clearTimeout(autoPlayTimer);
    }
});

watch(currentIndex, () => {
    startImageCycle();
});

const getDiff = (index) => {
    return (index - currentIndex.value + projects.length) % projects.length;
};

const getCardStyle = (index) => {
    const total = projects.length;
    
    if (!isMounted.value) {
        return {
            zIndex: 0,
            transform: `translate(0px, 0px) scale(0) rotate(0deg)`,
            opacity: 0,
            transition: 'none'
        };
    }
    
    if (animatingOutIndex.value === index) {
        if (animatingPhase.value === 'right') {
            return {
                zIndex: 100, 
                transform: `translate(120%, 50px) scale(0.95) rotate(15deg)`, 
                opacity: 1, 
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
            };
        } else if (animatingPhase.value === 'back') {
            const diff = getDiff(index);
            const zIndex = total - diff;
            let rotate = diff * 5; 
            let translateX = diff * 35; 
            let translateY = diff * -25; 
            let scale = 1 - (diff * 0.06); 
            
            return {
                zIndex,
                transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                opacity: 1,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s'
            };
        }
    }

    const diff = getDiff(index);
    const zIndex = total - diff;
    
    let rotate = diff * 5; 
    let translateX = diff * 35; 
    let translateY = diff * -25; 
    let scale = 1 - (diff * 0.06); 
    
    return {
        zIndex,
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
        opacity: 1, 
        transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s'
    };
};

// ==========================================
// PHẦN 2: DỮ LIỆU & LOGIC VÒNG QUAY GACHA
// ==========================================

const gachaItems = ref([
    { id: 1, type: 'project', isUnlocked: false, name: 'Sudoku game', color: 'text-blue-400', members: ['Me'], description: 'Trò chơi giải đố sudoku với giao diện đơn giản và tính năng đa dạng.', technologies: [{name: 'Vue.js', icon: 'logos:vue'}, {name: 'Pinia', icon: 'logos:pinia'}, {name: 'Tailwindcss', icon: 'logos:tailwindcss-icon'}, {name: 'Vite', icon: 'logos:vitejs'}, {name: 'Tauri', icon: 'logos:tauri'}, {name: 'Typescript', icon: 'logos:typescript-icon'}], links: ['https://github.com/hieurury/sudoku_game'] },
    { id: 2, type: 'project', isUnlocked: false, name: 'Server chat đơn giản', color: 'text-yellow-400', members: ['Me'], description: 'Server Socket hỗ trợ phòng chat riêng tư.', technologies: [{name: 'Node.js', icon: 'logos:nodejs-icon'}, {name: 'Socket.io', icon: 'logos:socket-io'}, {name: 'Nestjs', icon: 'logos:nestjs'}], links: ['https://github.com/hieurury/rury-chat-server'] },
    { id: 3, type: 'project', isUnlocked: false, name: 'Website đọc truyện tranh', color: 'text-emerald-400', members: ['Me'], description: 'Trang web đọc truyện tranh với giao diện đơn giản, áp dụng các kỹ thuật xử lý api.', technologies: [{name: 'Vue 3', icon: 'logos:vue'}, {name: 'TailwindCSS', icon: 'logos:tailwindcss-icon'}, {name: 'Vite', icon: 'logos:vitejs'}], links: ['https://github.com/hieurury/vue-comics'] },
    { id: 4, type: 'project', isUnlocked: false, name: 'Wordle game', color: 'text-purple-400', members: ['Me'], description: 'Game Wordle với React. Vừa chơi vừa học thêm về từ vựng tiếng Anh.', technologies: [{name: 'React', icon: 'logos:react'}, {name: 'TailwindCSS', icon: 'logos:tailwindcss-icon'}, {name: 'Vite', icon: 'logos:vitejs'}], links: ['https://github.com/hieurury/wordle'] },
    { id: 5, type: 'project', isUnlocked: false, name: 'Rury documents', color: 'text-rose-400', members: ['Me'], description: 'Trang web chia sẻ tài liệu học cũng như các lý thuyết và nội dung hay về nhiều lĩnh vực. Hỗ trợ đa ngôn ngữ và tích hợp các trình biên dịch.', technologies: [{name: 'Vue 3', icon: 'logos:vue'}, {name: 'StackBlitz', icon: 'logos:stackblitz-icon'}, {name: 'Typescript', icon: 'logos:typescript-icon'}, {name: 'TailwindCSS', icon: 'logos:tailwindcss-icon'}], links: ['https://documents.hieurury.id.vn'] },
    { id: 6, type: 'project', isUnlocked: false, name: 'Hệ thống quản lý thư viện', color: 'text-sky-400', members: ['Me'], description: 'Hệ thống quản lý thư viện với các tính năng cơ bản như mượn, trả, thêm sách, quản lý mượn. Ngoài ra còn tích hợp chatbot thông minh giúp hỗ trợ người dùng.', technologies: [{name: 'Vue 3', icon: 'logos:vue'}, {name: 'TailwindCSS', icon: 'logos:tailwindcss-icon'}, {name: 'Vite', icon: 'logos:vitejs'}, {name: 'Pinia', icon: 'logos:pinia'}, {name: 'Node.js', icon: 'logos:nodejs-icon'}, {name: 'MongoDB', icon: 'logos:mongodb-icon'}, {name: 'Express', icon: 'simple-icons:express'}], links: [] },

    { id: 7, type: 'skill', isUnlocked: false, name: 'C++', icon: 'logos:c', color: 'text-emerald-400', mastery: 70, concepts: ['Logic thuật toán', 'OOP', 'IoT'] },
    { id: 8, type: 'skill', isUnlocked: false, name: 'SQL', icon: 'logos:mysql', color: 'text-emerald-400', mastery: 40, concepts: ['Relational Databases', 'Query Optimization', 'Constraints'] },
    { id: 9, type: 'skill', isUnlocked: false, name: 'Java', icon: 'logos:java', color: 'text-emerald-400', mastery: 30, concepts: ['OOP', 'Basic Syntax', 'Java Window form'] },
    { id: 10, type: 'skill', isUnlocked: false, name: 'JavaScript', icon: 'logos:javascript', color: 'text-emerald-400', mastery: 80, concepts: ['ES6+', 'Asynchronous', 'DOM Manipulation'] },
    { id: 11, type: 'skill', isUnlocked: false, name: 'Vue.js', icon: 'logos:vue', color: 'text-emerald-400', mastery: 80, concepts: ['Composition API', 'Reactivity', 'Vue Router'] },
    { id: 12, type: 'skill', isUnlocked: false, name: 'React', icon: 'logos:react', color: 'text-sky-400', mastery: 50, concepts: ['Hooks', 'Context API', 'Redux'] },
    { id: 13, type: 'skill', isUnlocked: false, name: 'Node.js', icon: 'logos:nodejs-icon', color: 'text-green-500', mastery: 80, concepts: ['Express', 'REST API', 'Socket.io'] },
    { id: 14, type: 'skill', isUnlocked: false, name: 'TypeScript', icon: 'logos:typescript-icon', color: 'text-blue-500', mastery: 60, concepts: ['Interfaces', 'Generics', 'Utility Types'] },
    { id: 15, type: 'skill', isUnlocked: false, name: 'MongoDB', icon: 'logos:mongodb-icon', color: 'text-green-400', mastery: 60, concepts: ['Aggregation', 'Indexes', 'Mongoose'] },
    { id: 16, type: 'skill', isUnlocked: false, name: 'Express', icon: 'simple-icons:express', color: 'text-blue-600', mastery: 60, concepts: ['Router', 'REST API', 'Json Web Token'] },
    { id: 17, type: 'skill', isUnlocked: false, name: 'NestJS', icon: 'logos:nestjs', color: 'text-orange-500', mastery: 30, concepts: ['Service', 'Controller', 'Module'] },
    { id: 18, type: 'skill', isUnlocked: false, name: 'TailwindCSS', icon: 'logos:tailwindcss-icon', color: 'text-teal-400', mastery: 85, concepts: ['Utility-First', 'Custom Config', 'Plugins'] },
    { id: 19, type: 'skill', isUnlocked: false, name: 'Git', icon: 'logos:git-icon', color: 'text-red-500', mastery: 75, concepts: ['Releases', 'Merge Conflicts', 'Actions'] },
    { id: 20, type: 'skill', isUnlocked: false, name: 'Python', icon: 'logos:python', color: 'text-yellow-500', mastery: 30, concepts: ['AI', 'FastAPI', 'IoT'] }
]);

const row1Items = computed(() => gachaItems.value);
const row2Items = computed(() => [...gachaItems.value].reverse());
const isAllUnlocked = computed(() => gachaItems.value.every(i => i.isUnlocked));

const row1Track = ref(null);
const row2Track = ref(null);
let row1Tween = null;
let row2Tween = null;
let gachaSpeedInterval = null;

const itemWidth = 196; // 180px width + 16px gap
const trackWidth = 20 * itemWidth; // 3920px
const isDrawing = ref(false);
const isHovering = ref(false);
const showFlash = ref(false);
const particles = ref([]);
const rayCoords = ref({ x: 0, y: 0 });
const selectedGacha = ref(null);

const spawnParticles = (type) => {
    const colors = ['bg-yellow-400', 'bg-sky-400', 'bg-emerald-400', 'bg-pink-400', 'bg-purple-400', 'bg-white'];
    const shapes = ['rounded-full', 'rounded-sm', 'rounded-none'];
    const newParticles = [];
    
    if (type === 'shake') {
        for (let i = 0; i < 25; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = (Math.random() * Math.random()) * 500 + 150; // Bắn ra xa
            newParticles.push({
                id: 'shake-' + Date.now() + '-' + i,
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: shapes[Math.floor(Math.random() * shapes.length)],
                size: Math.random() * 6 + 2,
                width: null,
                targetX: Math.cos(angle) * velocity,
                targetY: Math.sin(angle) * velocity,
                rotation: Math.random() * 720 - 360,
                duration: Math.random() * 0.5 + 0.5,
                isStreak: false
            });
        }
    } else if (type === 'burst') {
        for (let i = 0; i < 70; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = (Math.random() * Math.random()) * 350 + 80; 
            const isStreak = Math.random() > 0.7; // 30% là vệt sáng
            
            newParticles.push({
                id: 'burst-' + Date.now() + '-' + i,
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: isStreak ? 'rounded-full' : shapes[Math.floor(Math.random() * shapes.length)],
                size: Math.random() * 8 + 4,
                width: isStreak ? (Math.random() * 80 + 30) : null,
                targetX: Math.cos(angle) * velocity,
                targetY: Math.sin(angle) * velocity,
                rotation: isStreak ? (angle * 180 / Math.PI) : (Math.random() * 720 - 360),
                duration: isStreak ? Math.random() * 0.3 + 0.3 : Math.random() * 0.8 + 0.6,
                isStreak
            });
        }
    }
    
    particles.value = [...particles.value, ...newParticles];
};

const getMasteryLevel = (percent) => {
    if (percent <= 40) return 'Cơ bản';
    if (percent <= 65) return 'Có thể làm việc';
    if (percent <= 85) return 'Thông hiểu';
    return 'Thành thạo';
};

const startMarquee = () => {
    if (row1Tween) row1Tween.kill();
    if (row2Tween) row2Tween.kill();
    
    let cX1 = parseFloat(gsap.getProperty(row1Track.value, "x")) || 0;
    cX1 = cX1 % trackWidth;
    gsap.set(row1Track.value, { x: cX1 });
    
    row1Tween = gsap.to(row1Track.value, {
        x: cX1 - trackWidth,
        ease: 'none',
        duration: 60,
        repeat: -1,
        modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % trackWidth)
        }
    });
    
    let cX2 = parseFloat(gsap.getProperty(row2Track.value, "x")) || -trackWidth;
    cX2 = cX2 % trackWidth;
    if (cX2 > 0) cX2 -= trackWidth;
    gsap.set(row2Track.value, { x: cX2 });
    
    row2Tween = gsap.to(row2Track.value, {
        x: cX2 + trackWidth,
        ease: 'none',
        duration: 60,
        repeat: -1,
        modifiers: {
            x: gsap.utils.unitize(x => {
                let v = parseFloat(x) % trackWidth;
                if (v > 0) v -= trackWidth;
                return v;
            })
        }
    });
};

const startRandomSpeed = () => {
    clearInterval(gachaSpeedInterval);
    gachaSpeedInterval = setInterval(() => {
        if (isDrawing.value || isHovering.value) return;
        
        const randomSpeed = gsap.utils.random(0.5, 2);
        gsap.to([row1Tween, row2Tween], { timeScale: randomSpeed, duration: 1 });
        
        if (Math.random() > 0.8) {
            gsap.to([row1Tween, row2Tween], { timeScale: 0, duration: 1 });
            setTimeout(() => {
                if (!isDrawing.value && !isHovering.value) {
                    gsap.to([row1Tween, row2Tween], { timeScale: 1, duration: 1 });
                }
            }, 1500);
        }
    }, 4000);
};

const pauseMarquee = () => {
    isHovering.value = true;
    if (!isDrawing.value && row1Tween && row2Tween) gsap.to([row1Tween, row2Tween], { timeScale: 0, duration: 0.5 });
};

const resumeMarquee = () => {
    isHovering.value = false;
    if (!isDrawing.value && row1Tween && row2Tween) gsap.to([row1Tween, row2Tween], { timeScale: 1, duration: 0.5 });
};

const drawCard = () => {
    const lockedItems = gachaItems.value.filter(i => !i.isUnlocked);
    if (lockedItems.length === 0) return;
    
    isDrawing.value = true;
    
    // Chọn 1 thẻ random chưa mở
    const targetItem = lockedItems[Math.floor(Math.random() * lockedItems.length)];
    const targetRow1Index = row1Items.value.findIndex(i => i.id === targetItem.id);
    
    // Tăng tốc độ quay (Fast Spin)
    gsap.to([row1Tween, row2Tween], { timeScale: 8, duration: 1.5, ease: 'power2.in' });
    
    setTimeout(() => {
        row1Tween.kill();
        row2Tween.kill();
        
        let cX1 = parseFloat(gsap.getProperty(row1Track.value, "x")) || 0;
        let cX2 = parseFloat(gsap.getProperty(row2Track.value, "x")) || -trackWidth;
        
        const centerScreen = window.innerWidth / 2 - 180 / 2; // 180 là width của 1 card
        let finalX = centerScreen - (targetRow1Index * itemWidth);
        
        finalX = finalX % trackWidth;
        if (finalX > 0) finalX -= trackWidth;
        
        let spinTargetX = finalX - (trackWidth * 4); // Quay thêm 4 vòng
        while (spinTargetX > cX1) spinTargetX -= trackWidth;
        
        const distanceToTravel = cX1 - spinTargetX; // Positive distance
        
        gsap.to(row1Track.value, {
            x: spinTargetX,
            duration: 4.5,
            ease: 'circ.out', // Chậm dần
            modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % trackWidth) }
        });
        
        gsap.to(row2Track.value, {
            x: cX2 + distanceToTravel, 
            duration: 4.5,
            ease: 'circ.out',
            modifiers: { x: gsap.utils.unitize(x => {
                let v = parseFloat(x) % trackWidth;
                if (v > 0) v -= trackWidth;
                return v;
            })},
            onComplete: () => {
                const centerScreenX = window.innerWidth / 2;
                let bestEl = null;
                let minDiff = Infinity;
                
                for (let n = 1; n <= 3; n++) {
                    const el = document.getElementById(`gacha-card-${targetItem.id}-${n}`);
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        const elCenterX = rect.left + rect.width / 2;
                        const diff = Math.abs(elCenterX - centerScreenX);
                        if (diff < minDiff) {
                            minDiff = diff;
                            bestEl = el;
                        }
                    }
                }
                
                if (bestEl) {
                    bestEl.style.transition = 'none';
                    
                    const rect = bestEl.getBoundingClientRect();
                    rayCoords.value = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
                    
                    // Bắn hạt lúc đang lắc
                    spawnParticles('shake');
                    nextTick(() => {
                        const shakeEls = document.querySelectorAll('.particle-anim:not([data-animated="true"])');
                        shakeEls.forEach(el => {
                            el.dataset.animated = 'true';
                            const rot = parseFloat(el.dataset.rot);
                            gsap.set(el, { rotation: 0 });
                            gsap.to(el, {
                                x: parseFloat(el.dataset.x),
                                y: parseFloat(el.dataset.y),
                                rotation: rot,
                                opacity: 0,
                                duration: parseFloat(el.dataset.dur),
                                ease: "power2.in"
                            });
                        });
                    });
                    
                    // Lắc thẻ (Shake)
                    gsap.to(bestEl, {
                        rotateZ: 8,
                        yoyo: true,
                        repeat: 11,
                        duration: 0.08,
                        ease: "none",
                        onComplete: () => {
                            gsap.set(bestEl, { rotateZ: 0 });
                            
                            spawnParticles('burst');
                            
                            nextTick(() => {
                                gsap.fromTo('.particle-flash', 
                                    { scale: 0.2, opacity: 1 }, 
                                    { scale: 3, opacity: 0, duration: 0.7, ease: "power2.out" }
                                );
                                
                                const particleEls = document.querySelectorAll('.particle-anim:not([data-animated="true"])');
                                particleEls.forEach(el => {
                                    el.dataset.animated = 'true';
                                    const rot = parseFloat(el.dataset.rot);
                                    gsap.set(el, { rotation: el.dataset.streak === 'true' ? rot : 0 }); 
                                    
                                    gsap.to(el, {
                                        x: parseFloat(el.dataset.x),
                                        y: parseFloat(el.dataset.y),
                                        rotation: rot,
                                        opacity: 0,
                                        duration: parseFloat(el.dataset.dur),
                                        ease: el.dataset.streak === 'true' ? "power4.out" : "power3.out"
                                    });
                                });
                            });
                            
                            // Xoay vòng và mở khóa
                            gsap.to(bestEl, {
                                rotateY: 720,
                                duration: 1.2,
                                ease: "power2.inOut",
                                onUpdate: function() {
                                    if (this.progress() > 0.5 && !targetItem.isUnlocked) {
                                        targetItem.isUnlocked = true;
                                    }
                                },
                                onComplete: () => {
                                    particles.value = [];
                                    bestEl.style.transition = '';
                                    gsap.set(bestEl, { rotateY: 0 });
                                    
                                    setTimeout(() => {
                                        isDrawing.value = false;
                                        startMarquee();
                                        if (isAutoGacha.value) checkAutoGacha();
                                    }, 1000);
                                }
                            });
                        }
                    });
                } else {
                    targetItem.isUnlocked = true;
                    isDrawing.value = false;
                    startMarquee();
                    if (isAutoGacha.value) checkAutoGacha();
                }
            }
        });
        
    }, 1500);
};

// AUTO GACHA LOOP
let autoGachaInterval = null;
const isAutoGacha = ref(false);

const checkAutoGacha = () => {
    if (isAutoGacha.value) {
        if (isAllUnlocked.value) {
            isAutoGacha.value = false;
        } else {
            setTimeout(drawCard, 2000);
        }
    }
};

const openModal = (item) => {
    if (!item.isUnlocked) return;
    selectedGacha.value = item;
};

// Scroll Observation
const isGachaVisible = ref(false);

const scrollToGacha = () => {
    const el = document.getElementById('gacha-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
};

onMounted(() => {
    startImageCycle();
    nextTick(() => {
        prepareCard(0);
        
        setTimeout(() => {
            isMounted.value = true;
            setTimeout(() => {
                animateActiveCard(0);
            }, 800);
        }, 100);
    });
    
    // Gacha Init
    startMarquee();
    startRandomSpeed();
    
    const observer = new IntersectionObserver((entries) => {
        isGachaVisible.value = entries[0].isIntersecting;
    }, { threshold: 0.5 });
    
    setTimeout(() => {
        const gachaEl = document.getElementById('gacha-section');
        if (gachaEl) observer.observe(gachaEl);
    }, 500);

    // Dành cho terminal system
    window.gameActions = {
        isAutoGachaMode: () => isAutoGacha.value,
        autoGacha: (bool) => {
            isAutoGacha.value = bool;
            if (bool && !isDrawing.value) checkAutoGacha();
        },
        gacha: () => {
            if (!isDrawing.value && !isAllUnlocked.value) drawCard();
        },
        unlockGacha: (number) => {
            const item = gachaItems.value.find(i => i.id === number);
            if (item) item.isUnlocked = true;
        },
        unlockAllGacha: () => {
            gachaItems.value.forEach(i => i.isUnlocked = true);
        },
        resetGacha: () => {
            gachaItems.value.forEach(i => i.isUnlocked = false);
            isAutoGacha.value = false;
        }
    };
});

onUnmounted(() => {
    clearTimeout(autoPlayTimer);
    clearInterval(imageCycleInterval);
    clearInterval(gachaSpeedInterval);
    isAutoGacha.value = false;
    clearAllTyping();
    if (row1Tween) row1Tween.kill();
    if (row2Tween) row2Tween.kill();
    
    if (window.gameActions) {
        delete window.gameActions;
    }
});
</script>

<template>
    <!-- Snap Container giúp chia tách rõ ràng 2 màn hình -->
    <div class="h-screen w-full bg-[#0a0a0a] relative overflow-y-auto overflow-x-hidden custom-scrollbar snap-y snap-mandatory scroll-smooth">
        
        <!-- Background Effects -->
        <div class="fixed inset-0 z-0 pointer-events-none opacity-30">
            <div class="absolute top-10 left-10 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-sky-600/20 rounded-full blur-[150px]"></div>
            <div class="absolute bottom-10 right-10 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-purple-600/20 rounded-full blur-[150px]"></div>
        </div>

        <!-- ========================================== -->
        <!-- PHẦN 1: BỘ BÀI VÀ HÌNH ẢNH (Màn hình 1)     -->
        <!-- ========================================== -->
        <div class="snap-start z-10 w-full min-h-screen max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center relative py-20 pb-28">
            
            <div class="relative w-full h-[600px] flex items-center justify-center lg:justify-start">
                <div v-for="(project, index) in projects" :key="index"
                     :ref="el => { if (el) cardRefs[index] = el }"
                     class="absolute w-full max-w-[420px] backdrop-blur-2xl border-2 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] origin-bottom-left flex flex-col"
                     :class="project.bg"
                     :style="getCardStyle(index)">
                     
                     <button v-if="getDiff(index) === 0 && animatingOutIndex !== index" @click="nextCard"
                             class="absolute top-5 right-5 p-2 rounded-full shadow-lg transition-all duration-300 pointer-events-auto hover:rotate-180 hover:scale-110 z-50"
                             :class="project.btn"
                             title="Xoay bài">
                         <Icon icon="mdi:sync" class="w-5 h-5" />
                     </button>
                     
                     <div class="absolute inset-0 w-full h-full flex flex-col items-center justify-center transition-opacity duration-500 pointer-events-none"
                          :class="getDiff(index) !== 0 ? 'opacity-100 z-50' : 'opacity-0 -z-10'">
                         <div class="w-28 h-28 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shadow-inner">
                             <Icon icon="mdi:code-braces" class="w-12 h-12 text-white/20" />
                         </div>
                     </div>

                     <div class="w-full h-full flex flex-col transition-opacity duration-500"
                          :class="getDiff(index) === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'">
                          
                         <h3 class="text-3xl lg:text-4xl font-black mb-6 tracking-tight pr-14 leading-tight min-h-[80px]" :class="project.color">
                             {{ typedNames[index] }}<span v-if="typedNames[index] !== project.name" class="animate-pulse">_</span>
                         </h3>
                         
                         <div class="space-y-5 flex-grow">
                             <div>
                                 <div class="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-2"><Icon icon="mdi:account-group" class="w-4 h-4"/> Thành viên</div>
                                 <div class="flex flex-wrap gap-2 min-h-[30px]">
                                     <span v-for="(m, mIdx) in project.members" :key="mIdx" class="anim-member anim-item px-3 py-1.5 bg-white/10 border border-white/5 rounded-lg text-xs font-semibold text-gray-200 shadow-sm">{{m}}</span>
                                 </div>
                             </div>
                             
                             <div>
                                 <div class="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-2"><Icon icon="mdi:text-box-outline" class="w-4 h-4"/> Mô tả</div>
                                 <p class="text-sm text-gray-300 leading-relaxed font-medium min-h-[80px]">
                                     {{ typedDescs[index] }}<span v-if="typedDescs[index] !== project.description" class="animate-pulse">_</span>
                                 </p>
                             </div>
                             
                             <div>
                                 <div class="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-2"><Icon icon="mdi:code-tags" class="w-4 h-4"/> Công nghệ</div>
                                 <div class="grid grid-cols-6 gap-3 min-h-[44px]">
                                     <div v-for="tech in project.technologies" :key="tech.name" class="anim-tech anim-item group/tech relative flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/20 transition-all cursor-pointer shadow-md">
                                         <Icon :icon="tech.icon" class="w-6 h-6 text-white group-hover/tech:scale-110 transition-transform" />
                                         <div class="absolute -top-10 px-2 py-1 bg-black/95 text-white text-[11px] font-bold rounded opacity-0 group-hover/tech:opacity-100 whitespace-nowrap pointer-events-none shadow-2xl border border-white/10 z-50 transition-opacity">
                                             {{ tech.name }}
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                         
                         <div class="flex flex-wrap gap-3 mt-8 pt-5 border-t border-white/10 min-h-[60px]">
                             <a v-for="link in project.links" :key="link.name" :href="link.url" 
                                class="anim-btn anim-item flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border border-white/10 transition-transform hover:-translate-y-1 hover:brightness-110"
                                :class="project.btn">
                                 <Icon :icon="link.icon" class="w-5 h-5"/> {{ link.name }}
                             </a>
                         </div>
                     </div>

                </div>
            </div>

            <div class="relative w-full h-[550px] flex items-center justify-center">
                <transition name="fade-slide" mode="out-in">
                    <div :key="currentIndex" class="w-full h-full flex flex-col gap-4">
                        <div class="w-full h-[70%] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)] border border-white/10 relative group bg-black/20">
                            <transition name="fade-img">
                                <img :key="getDisplayImage(0)" :src="getDisplayImage(0)" class="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 ease-out" alt="Main Project Image" />
                            </transition>
                            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 pointer-events-none z-10"></div>
                            <div class="absolute bottom-0 left-0 p-8 w-full pointer-events-none z-20">
                                <div class="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                    <div class="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white mb-3 shadow-lg">Hình ảnh Demo</div>
                                    <h4 class="text-2xl font-black text-white leading-tight" :class="projects[currentIndex].color">{{ projects[currentIndex].name }}</h4>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex gap-4 h-[30%]">
                            <div class="flex-1 rounded-2xl overflow-hidden border border-white/10 shadow-lg relative group bg-black/20">
                                <transition name="fade-img">
                                    <img :key="getDisplayImage(1)" :src="getDisplayImage(1)" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Sub Project Image" />
                                </transition>
                                <div class="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 pointer-events-none z-10"></div>
                            </div>
                            <div class="flex-1 rounded-2xl overflow-hidden border border-white/10 shadow-lg relative group bg-black/20">
                                <transition name="fade-img">
                                    <img :key="getDisplayImage(2)" :src="getDisplayImage(2)" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Sub Project Image" />
                                </transition>
                                <div class="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 pointer-events-none z-10"></div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            
        </div>
        
        <!-- ========================================== -->
        <!-- PHẦN 2: VÒNG QUAY GACHA (Màn hình 2)       -->
        <!-- ========================================== -->
        <div id="gacha-section" class="snap-start z-10 w-full h-screen flex flex-col items-center justify-center relative overflow-hidden">
            
            <div class="relative w-full flex flex-col items-center justify-center">
                <!-- Mũi tên chỉ định băng chuyền trên -->
                <div class="absolute -top-14 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                    <Icon icon="mdi:menu-down" class="w-16 h-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
                </div>

                <!-- Hiệu ứng Particle Burst -->
                <div v-if="particles.length > 0" class="fixed z-[200] pointer-events-none" :style="{ left: rayCoords.x + 'px', top: rayCoords.y + 'px' }">
                    <div class="absolute w-[200px] h-[200px] bg-white rounded-full blur-[40px] opacity-80 -ml-[100px] -mt-[100px] particle-flash scale-0"></div>
                    <div v-for="p in particles" :key="p.id" 
                         class="absolute particle-anim shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                         :class="[p.color, p.shape]"
                         :data-x="p.targetX"
                         :data-y="p.targetY"
                         :data-rot="p.rotation"
                         :data-dur="p.duration"
                         :data-streak="p.isStreak"
                         :style="{ 
                            width: (p.isStreak ? p.width : p.size) + 'px', 
                            height: (p.isStreak ? Math.max(p.size/3, 2) : p.size) + 'px', 
                            marginLeft: -(p.isStreak ? p.width/2 : p.size/2) + 'px', 
                            marginTop: -(p.isStreak ? Math.max(p.size/3, 2)/2 : p.size/2) + 'px'
                         }">
                    </div>
                </div>

                <div class="w-full" @mouseenter="pauseMarquee" @mouseleave="resumeMarquee">
                    <!-- BĂNG CHUYỀN TRÊN -->
                    <div class="relative w-full h-[280px] flex items-center">
                        <div class="absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r from-[#0a0a0a] to-transparent z-40 pointer-events-none"></div>
                        <div class="absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l from-[#0a0a0a] to-transparent z-40 pointer-events-none"></div>
                        
                        <div class="flex gap-4 w-max h-[240px]" ref="row1Track">
                            <template v-for="n in 3" :key="'r1-'+n">
                                <div v-for="item in row1Items" :key="item.id + '-' + n" :id="'gacha-card-' + item.id + '-' + n"
                                     class="w-[180px] h-[240px] shrink-0 border border-white/10 rounded-2xl cursor-pointer relative overflow-hidden transition-transform hover:scale-105 bg-[#111] group"
                                     @click="openModal(item)">
                                     
                                    <!-- Mặt Đóng (Locked) -->
                                    <div class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-[#050505] transition-opacity duration-700"
                                         :class="item.isUnlocked ? 'opacity-0 pointer-events-none' : 'opacity-100 z-20'">
                                        <div class="text-7xl font-black text-gray-700/50 group-hover:text-gray-500/80 transition-colors drop-shadow-xl">{{ item.id }}</div>
                                    </div>
                                    
                                    <!-- Mặt Mở (Unlocked) -->
                                    <div class="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br transition-opacity duration-700"
                                         :class="[
                                            item.isUnlocked ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none',
                                            item.type === 'project' ? 'from-sky-900/30 to-black' : 'from-emerald-900/30 to-black'
                                         ]">
                                        <div class="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-2xl backdrop-blur-md">
                                            <Icon v-if="item.type === 'skill'" :icon="item.icon" class="w-8 h-8" />
                                            <Icon v-else icon="mdi:folder-star-multiple" class="w-8 h-8 text-sky-400" />
                                        </div>
                                        <h3 class="text-sm font-black text-center mb-2 leading-tight line-clamp-2" :class="item.color">{{ item.name }}</h3>
                                        <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                                            {{ item.type === 'project' ? 'Dự Án' : 'Kỹ Năng' }}
                                        </div>
                                    </div>
                                    
                                </div>
                            </template>
                        </div>
                    </div>
                    
                    <!-- BĂNG CHUYỀN DƯỚI -->
                    <div class="relative w-full h-[280px] flex items-center">
                        <div class="absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r from-[#0a0a0a] to-transparent z-40 pointer-events-none"></div>
                        <div class="absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l from-[#0a0a0a] to-transparent z-40 pointer-events-none"></div>
                        
                        <div class="flex gap-4 w-max h-[240px]" ref="row2Track">
                            <template v-for="n in 3" :key="'r2-'+n">
                                <div v-for="item in row2Items" :key="item.id + '-' + n" 
                                     class="w-[180px] h-[240px] shrink-0 border border-white/10 rounded-2xl cursor-pointer relative overflow-hidden transition-transform hover:scale-105 bg-[#111] group"
                                     @click="openModal(item)">
                                     
                                    <div class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-[#050505] transition-opacity duration-700"
                                         :class="item.isUnlocked ? 'opacity-0 pointer-events-none' : 'opacity-100 z-20'">
                                        <div class="text-7xl font-black text-gray-700/50 group-hover:text-gray-500/80 transition-colors drop-shadow-xl">{{ item.id }}</div>
                                    </div>
                                    
                                    <div class="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br transition-opacity duration-700"
                                         :class="[
                                            item.isUnlocked ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none',
                                            item.type === 'project' ? 'from-sky-900/30 to-black' : 'from-emerald-900/30 to-black'
                                         ]">
                                        <div class="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-2xl backdrop-blur-md">
                                            <Icon v-if="item.type === 'skill'" :icon="item.icon" class="w-8 h-8" />
                                            <Icon v-else icon="mdi:folder-star-multiple" class="w-8 h-8 text-sky-400" />
                                        </div>
                                        <h3 class="text-sm font-black text-center mb-2 leading-tight line-clamp-2" :class="item.color">{{ item.name }}</h3>
                                        <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                                            {{ item.type === 'project' ? 'Dự Án' : 'Kỹ Năng' }}
                                        </div>
                                    </div>
                                    
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Nút Quay -->
                <div class="mt-8 text-center">
                    <button @click="drawCard" :disabled="isDrawing || isAutoGacha" 
                            class="px-8 py-4 rounded-xl font-black text-sm md:text-base uppercase tracking-widest transition-all duration-300 relative overflow-hidden group"
                            :class="[
                                isAllUnlocked 
                                    ? 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.5)] cursor-default' 
                                    : 'bg-transparent border-2 border-yellow-400 text-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.2)]',
                                (isDrawing || isAutoGacha)
                                    ? 'opacity-50 cursor-not-allowed saturate-0' 
                                    : (!isAllUnlocked ? 'hover:bg-yellow-400 hover:text-black hover:shadow-[0_0_30px_rgba(250,204,21,0.6)] hover:-translate-y-1 cursor-pointer' : '')
                            ]">
                        <span class="relative z-10 flex items-center justify-center gap-2">
                            <Icon v-if="!isAllUnlocked" icon="mdi:magic-staff" class="w-5 h-5" />
                            {{ isAutoGacha ? 'auto....' : (isAllUnlocked ? 'Bạn đã có được tôi' : 'Mở khoá tôi') }}
                        </span>
                        <div v-if="!isAllUnlocked && !isDrawing && !isAutoGacha" class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                </div>
            </div>
            
        </div>
        
        <!-- NÚT ĐIỀU HƯỚNG FIXED -->
        <div class="fixed bottom-6 lg:bottom-10 w-full px-6 lg:px-16 flex justify-between z-50 pointer-events-none">
            <div class="pointer-events-auto">
                <router-link to="/timeline" class="px-5 py-3 lg:px-6 bg-white/10 backdrop-blur-md text-white font-extrabold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-white/20 hover:scale-105 border border-white/20 transition-all flex items-center gap-2 text-sm lg:text-base">
                    <Icon icon="material-symbols:arrow-back-rounded" class="w-5 h-5"/> <span class="hidden sm:inline">Trở lại</span>
                </router-link>
            </div>
            <div class="pointer-events-auto hidden">
                <button v-if="!isGachaVisible" @click="scrollToGacha" class="px-5 py-3 lg:px-6 bg-sky-500 text-white font-extrabold rounded-full shadow-[0_0_20px_rgba(14,165,233,0.5)] hover:bg-sky-400 hover:scale-105 transition-all flex items-center gap-2 text-sm lg:text-base border border-sky-400/50">
                    <span class="hidden sm:inline">Tiếp tục</span> <Icon icon="material-symbols:arrow-downward-rounded" class="w-5 h-5"/>
                </button>
                <router-link v-else to="/fourth" class="px-5 py-3 lg:px-6 bg-emerald-500 text-white font-extrabold rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:bg-emerald-400 hover:scale-105 transition-all flex items-center gap-2 text-sm lg:text-base border border-emerald-400/50 animate-pulse cursor-pointer">
                    <span class="hidden sm:inline">Tiếp tục</span> <Icon icon="material-symbols:arrow-downward-rounded" class="w-5 h-5"/>
                </router-link>
            </div>
        </div>

        <!-- MODAL CHI TIẾT -->
        <transition name="fade">
            <div v-if="selectedGacha" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4" @click="selectedGacha = null">
                <div class="w-full max-w-2xl bg-[#111] border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative transform transition-all" @click.stop>
                    
                    <button @click="selectedGacha = null" class="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                        <Icon icon="mdi:close" class="w-6 h-6" />
                    </button>

                    <!-- Modal cho Dự án -->
                    <div v-if="selectedGacha.type === 'project'">
                        <div class="flex items-center gap-5 mb-8 border-b border-white/5 pb-6">
                            <div class="w-16 h-16 rounded-2xl bg-sky-900/30 flex items-center justify-center border border-sky-500/30 shrink-0 shadow-lg">
                                <Icon icon="mdi:folder-star-multiple" class="w-8 h-8 text-sky-400" />
                            </div>
                            <h2 class="text-3xl font-black leading-tight" :class="selectedGacha.color">{{ selectedGacha.name }}</h2>
                        </div>
                        
                        <p class="text-gray-300 text-base leading-relaxed mb-8">{{ selectedGacha.description }}</p>
                        
                        <div class="mb-6">
                            <div class="text-[11px] text-gray-500 uppercase font-bold mb-3 tracking-widest flex items-center gap-2"><Icon icon="mdi:account-group" class="w-4 h-4"/> Thành viên</div>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="m in selectedGacha.members" :key="m" class="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-gray-200">{{m}}</span>
                            </div>
                        </div>
                        
                        <div class="mb-10">
                            <div class="text-[11px] text-gray-500 uppercase font-bold mb-3 tracking-widest flex items-center gap-2"><Icon icon="mdi:code-tags" class="w-4 h-4"/> Công nghệ sử dụng</div>
                            <div class="flex flex-wrap gap-3">
                                <div v-for="t in selectedGacha.technologies" :key="t.name" class="anim-tech anim-item group/tech relative flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/20 transition-all cursor-pointer shadow-md">
                                    <Icon :icon="t.icon" class="w-6 h-6 text-white group-hover/tech:scale-110 transition-transform" />
                                    <div class="absolute -top-10 px-2 py-1 bg-black/95 text-white text-[11px] font-bold rounded opacity-0 group-hover/tech:opacity-100 whitespace-nowrap pointer-events-none shadow-2xl border border-white/10 z-50 transition-opacity">
                                        {{ t.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex gap-4" v-if="selectedGacha.links && selectedGacha.links.length > 0">
                            <a v-if="selectedGacha.links.some(l => l.includes('github.com'))"
                               :href="selectedGacha.links.find(l => l.includes('github.com'))"
                               target="_blank"
                               class="flex-1 py-3.5 bg-white/10 hover:bg-white/20 text-center rounded-xl font-bold text-sm text-white transition-colors border border-white/5 flex items-center justify-center gap-2">
                                <Icon icon="mdi:github" class="w-5 h-5" /> Mã nguồn
                            </a>
                            <a v-if="selectedGacha.links.some(l => !l.includes('github.com'))"
                               :href="selectedGacha.links.find(l => !l.includes('github.com'))"
                               target="_blank"
                               class="flex-1 py-3.5 bg-sky-500 hover:bg-sky-400 text-center rounded-xl font-bold text-sm text-white shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all flex items-center justify-center gap-2">
                                <Icon icon="mdi:web" class="w-5 h-5" /> Sản phẩm
                            </a>
                        </div>
                    </div>

                    <!-- Modal cho Kỹ năng -->
                    <div v-else>
                        <div class="flex items-center gap-6 mb-10">
                            <div class="w-20 h-20 rounded-3xl bg-emerald-900/30 flex items-center justify-center border border-emerald-500/30 shrink-0 shadow-lg">
                                <Icon :icon="selectedGacha.icon" class="w-12 h-12" />
                            </div>
                            <div class="flex-1">
                                <h2 class="text-4xl font-black leading-tight mb-2" :class="selectedGacha.color">{{ selectedGacha.name }}</h2>
                                <div class="flex items-center gap-3 mt-4 mb-2">
                                    <div class="text-gray-400 font-bold text-xs uppercase tracking-widest">
                                        Trình độ
                                    </div>
                                    <div class="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 font-black text-sm shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                        {{ getMasteryLevel(selectedGacha.mastery) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div class="text-[11px] text-gray-500 uppercase font-bold mb-4 tracking-widest flex items-center gap-2"><Icon icon="mdi:star-circle" class="w-4 h-4"/> Kiến thức trọng tâm</div>
                            <div class="grid grid-rows-3 grid-flow-col gap-x-8 gap-y-4 w-max min-w-full">
                                <div v-for="c in selectedGacha.concepts" :key="c" class="flex items-start gap-3 text-sm text-gray-200 font-medium leading-relaxed">
                                    <Icon icon="mdi:check-decagram" class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> {{ c }}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </transition>

    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.98);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-40px) scale(0.98);
}

.fade-img-enter-active,
.fade-img-leave-active {
  transition: opacity 1.2s ease-in-out;
}
.fade-img-enter-from,
.fade-img-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.flash-fade-enter-active {
  transition: opacity 0.1s ease-out;
}
.flash-fade-leave-active {
  transition: opacity 0.8s ease-in;
}
.flash-fade-enter-from,
.flash-fade-leave-to {
  opacity: 0;
}
</style>
