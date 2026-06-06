<script setup>
import {
    ref,
    onMounted,
    computed,
    reactive,
} from "vue";
import Tree from "./Tree.vue";
import METHODS from "../languages/normal";
import { useState } from '../hooks/useState';
const { showSupport, setShowSupport } = useState();


const selectedCommand = ref(null);

const supportBlock = ref(null);
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const position = ref({ x: 500, y: 100 });

const startDrag = (e) => {
    isDragging.value = true;
    const rect = supportBlock.value.getBoundingClientRect();
    dragOffset.value = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
};

const onDrag = (e) => {
    if (!isDragging.value) return;
    position.value = {
        x: e.clientX - dragOffset.value.x,
        y: e.clientY - dragOffset.value.y
    };
};

const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
};

const supportData = computed(() => {
    return Object.keys(METHODS)
    //lọc các method chưa có help
    .filter(method => METHODS[method].help)
    .map((method, index) => {
        const helps = METHODS[method].help();
        const data = reactive({
            label: method,
            isLeaf: false,
            children: []
        })


        const children = helps.map((help, index) => {
            const child = reactive({
                label: help.command,
                isLeaf: false,
                children: []
            })

            const usages = help.usage.map((usage, uIndex) => {
                return {
                    label: `${method}.${help.command}(${usage.arg})`,
                    isLeaf: true,
                    value: {
                        command: `${method}.${help.command}(${usage.arg})`,
                        commandDesc: help.description,
                        usageDesc: usage.description
                    }
                }
            })
            child.children = usages;
            return child;
        })

        data.children = children;
        return data;
        

    })
})



</script>


<template>
    <Transition name="fade-scale">
        <div 
            ref="supportBlock"
            v-if="showSupport"
            :style="{
                position: 'fixed',
                left: position.x + 'px',
                top: position.y + 'px',
                zIndex: 1000
            }"
            class="w-[400px] bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden text-gray-300"
        >
            <!-- Mac OS Header -->
            <div 
                @mousedown="startDrag"
                :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
                class="h-12 bg-white/5 border-b border-white/10 flex items-center px-4 justify-between"
            >
                <div class="flex space-x-2">
                    <div @click="setShowSupport(false)" class="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 cursor-pointer shadow-sm transition-colors"></div>
                    <div class="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 cursor-pointer shadow-sm transition-colors"></div>
                    <div class="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 cursor-pointer shadow-sm transition-colors"></div>
                </div>
                <h1 class="text-gray-400 text-xs font-bold tracking-widest flex-grow text-center uppercase mr-8">Support</h1>
            </div>

            <!-- Content -->
            <div class="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                <div>
                    <Tree 
                        :options="supportData" 
                        v-model:selected="selectedCommand"
                    />
                </div>
                <div class="mt-4 border-t border-white/10 pt-4">
                    <div v-if="!selectedCommand" class="text-sm text-gray-500 text-center italic">
                        Chọn một lệnh để xem hướng dẫn sử dụng!
                    </div>
                    <div v-else class="flex flex-col gap-3">
                        <div class="text-sm text-sky-400 font-mono bg-black/40 p-3 rounded-lg border border-sky-500/20 shadow-inner break-all">
                            {{ selectedCommand.command }}
                        </div>
                        <div class="bg-white/5 rounded-lg p-3 text-sm border border-white/5">
                            <p class="text-gray-300 font-semibold mb-1">Chức năng:</p>
                            <p class="text-gray-400">{{ selectedCommand.commandDesc }}</p>
                            
                            <p class="text-gray-300 font-semibold mt-3 mb-1">Chi tiết tham số:</p>
                            <p class="text-gray-400">{{ selectedCommand.usageDesc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>


<style scoped>
div {
    user-select: none;
}
.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
}
</style>