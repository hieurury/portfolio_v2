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
const { showSupport } = useState();


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
                    value: `${method}.${help.command}(${usage.arg})`
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
    <div 
        ref="supportBlock"
        v-if="showSupport"
        :style="{
            position: 'fixed',
            left: position.x + 'px',
            top: position.y + 'px',
            cursor: isDragging ? 'grabbing' : 'grab',
            zIndex: 1000
        }"
        class="bg-slate-600 text-gray-300 p-4 rounded-md"
        @mousedown="startDrag"
    >
        <div>
            <Tree 
                :options="supportData" 
                v-model:selected="selectedCommand"
            />
        </div>
        <div>
            <div v-if="!selectedCommand">
                <h3>Chọn một lệnh để xem hướng dẫn sử dụng!</h3>
            </div>
        </div>
    </div>
</template>


<style scoped>
div {
    user-select: none;
}
</style>