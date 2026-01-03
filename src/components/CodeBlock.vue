<script setup>
import Codemirror from "codemirror-editor-vue3";
// placeholder
import "codemirror/addon/display/placeholder.js";

// language
import "codemirror/mode/javascript/javascript.js";
// placeholder
import "codemirror/addon/display/placeholder.js";
// theme
import "codemirror/theme/dracula.css";

import { reactive, ref } from 'vue';
import METHODS from "../languages/normal";


const cmOptions = {
    mode: "javascript",
    theme: "dracula",
    placeholder: "Write your commands",
    lineNumbers: true,
};

const code = ref(`currentPage.go('top')`);
const histories = ref([]);

const regexCommand = (command) => {
    const regex = /(\w+)\.(\w+)\((.*?)\)/g;
    const matches = [...command.matchAll(regex)];
    return matches.map(match => {
        const object = match[1];
        const method = match[2];
        let args = match[3]
            .split(',')
            .map(arg => arg.trim().replace(/^['"]|['"]$/g, ''));
        

        if(args.includes('true')) {
            args[0] = true;
        } else if(args.includes('false')) {
            args[0] = false;
        }
        return { object, method, args };
    });
}

const submitCode = () => {
    const codeMessage = reactive({
        type: null,
        content: null,
        location: null
    })
    const commands = regexCommand(code.value);
    if(commands.length === 0) {
        codeMessage.type = 'error';
        codeMessage.content = 'No valid commands found.';
        console.log(codeMessage);
        return;
    }
    //thực thi từng command
    commands.forEach((cmd, index) => {
        const { object, method, args } = cmd;
        if(METHODS[object] && METHODS[object][method]) {
            const result = METHODS[object][method](...args);
            codeMessage.type = result.type;
            codeMessage.content = result.message;
            codeMessage.location = `Dòng ${index + 1}`;

            //lưu lịch sử
            histories.value.push({
                command: `${object}.${method}(${args.map(arg => `'${arg}'`).join(', ')})`,
                result: codeMessage
            });
        } else {
            codeMessage.type = 'error';
            codeMessage.content = `Lệnh không hợp lệ: ${object}.${method}`;
            codeMessage.location = `Dòng ${index + 1}`;

            //lưu lịch sử
            histories.value.push({
                command: `${object}.${method}(${args.map(arg => `'${arg}'`).join(', ')})`,
                result: codeMessage
            });
        }
    });
};

//khởi tạo giá trị cho codeblock để kéo thả
const codeBlock = ref(null);
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const position = ref({ x: 50, y: 50 });

const startDrag = (e) => {
    // Chỉ drag khi click vào header, không phải codemirror
    if (e.target.closest('.CodeMirror')) return;
    
    isDragging.value = true;
    const rect = codeBlock.value.getBoundingClientRect();
    dragOffset.value = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
};

const drag = (e) => {
    if (!isDragging.value) return;
    
    position.value = {
        x: e.clientX - dragOffset.value.x,
        y: e.clientY - dragOffset.value.y
    };
};

const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
};

const keybind = (e) => {
};
</script>

<template>
    <div 
        ref="codeBlock"
        class="max-w-md bg-slate-700/80 rounded-md p-1 pb-0 fixed"
        :style="{
            left: position.x + 'px',
            top: position.y + 'px',
            zIndex: 1000,
        }"
        @mousedown="startDrag"
        @keypress="keybind"
    >
        <div :class="[{
            'cursor-grab': !isDragging,
            'cursor-grabbing': isDragging
        }]" class="my-1 drag-handle flex justify-between items-center">
            <h1 class="uppercase text-gray-200 text-xs font-semibold">Command block</h1>
            <div class="flex-grow">
                <button @click="submitCode" type="primary">Run</button>
            </div>
        </div>
        <Codemirror
            height="100px"
            width="400px"
            :options="cmOptions"
            border
            v-model:value="code"
        />
    </div>
</template>

<style scoped>
.drag-handle {
    user-select: none;
}
</style>