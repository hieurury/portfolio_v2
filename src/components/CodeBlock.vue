<script setup>
import { reactive, ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import gsap from 'gsap';
import { Icon } from '@iconify/vue';
import METHODS from "../languages/normal";
import { useState } from '../hooks/useState.js';

const { showTerminal, toggleTerminal } = useState();

const histories = ref([
    { type: 'info', text: 'Welcome to Terminal! Type "system.support(true)" to open Support!' }
]);

const currentInput = ref('');
const terminalContent = ref(null);
const terminalInputRef = ref(null);
const inputLineRef = ref(null);
const ghostDivRef = ref(null);

const commandHistory = ref([]);
const historyIndex = ref(-1);

const suggestions = ref([]);
const showSuggestions = ref(false);
const selectedSuggestionIndex = ref(0);

const size = ref({ w: 500, h: 348 });
const isResizing = ref(false);

const popupStyle = ref({ top: '0px', left: '0px' });

const updatePopupPosition = () => {
    if (!showSuggestions.value || !inputLineRef.value || !codeBlock.value) return;
    const inputRect = inputLineRef.value.getBoundingClientRect();
    const codeBlockRect = codeBlock.value.getBoundingClientRect();
    
    const spaceAbove = inputRect.top - codeBlockRect.top;
    
    if (spaceAbove > 150) {
        popupStyle.value = {
            bottom: `${codeBlockRect.bottom - inputRect.top + 4}px`,
            left: `100px`,
            top: 'auto'
        };
    } else {
        popupStyle.value = {
            top: `${inputRect.bottom - codeBlockRect.top + 4}px`,
            left: `100px`,
            bottom: 'auto'
        };
    }
};

const updateSuggestions = () => {
    nextTick(() => {
        const val = currentInput.value;
        const cursorIndex = terminalInputRef.value ? terminalInputRef.value.selectionStart : val.length;
        const textBeforeCursor = val.slice(0, cursorIndex);
        
        if (!textBeforeCursor.trim()) {
            showSuggestions.value = false;
            return;
        }

        let newSuggestions = [];

        // Check if we are inside a method call
        const insideParamsRegex = /^(\w+)\.(\w+)\((.*)$/;
        const paramMatch = textBeforeCursor.match(insideParamsRegex);

        if (paramMatch) {
            const object = paramMatch[1];
            const method = paramMatch[2];
            const typedArgText = paramMatch[3]; // partial arg being typed

            if (METHODS[object] && METHODS[object].help) {
                const helps = typeof METHODS[object].help === 'function' ? METHODS[object].help() : [];
                const helpObj = helps.find(h => h.command === method);
                if (helpObj && helpObj.usage) {
                    const cleanTyped = typedArgText.replace(/['"]/g, '');
                    newSuggestions = helpObj.usage
                        .filter(u => u.arg.replace(/['"]/g, '').startsWith(cleanTyped) && u.arg.replace(/['"]/g, '') !== cleanTyped)
                        .map(u => ({
                            text: u.arg,
                            description: u.description
                        }));
                }
            }
        } else {
            const parts = textBeforeCursor.split('.');
            if (parts.length === 1) {
                const word = parts[0];
                const baseObjects = Object.keys(METHODS).map(o => ({ text: o, description: `Đối tượng hệ thống` }));
                baseObjects.push({ text: 'clear', description: 'Xoá toàn bộ lịch sử Terminal' });
                
                newSuggestions = baseObjects.filter(o => o.text.startsWith(word) && o.text !== word);
            } else if (parts.length === 2) {
                const object = parts[0];
                const word = parts[1];
                if (METHODS[object] && METHODS[object].help) {
                    const helps = typeof METHODS[object].help === 'function' ? METHODS[object].help() : [];
                    newSuggestions = helps
                        .filter(h => h.command.startsWith(word) && h.command !== word)
                        .map(h => ({
                            text: h.command,
                            description: h.description
                        }));
                }
            }
        }

        suggestions.value = newSuggestions;
        showSuggestions.value = suggestions.value.length > 0;
        selectedSuggestionIndex.value = 0;
        if (showSuggestions.value) {
            updatePopupPosition();
        }
    });
};

const handleInputScroll = (e) => {
    if (ghostDivRef.value) {
        ghostDivRef.value.scrollLeft = e.target.scrollLeft;
    }
};

watch(currentInput, () => {
    updateSuggestions();
    nextTick(() => {
        if (ghostDivRef.value && terminalInputRef.value) {
            ghostDivRef.value.scrollLeft = terminalInputRef.value.scrollLeft;
        }
    });
});

const highlightCommand = (str) => {
    if (!str) return '';
    let html = '';
    const dotIndex = str.indexOf('.');
    const parenIndex = str.indexOf('(');
    
    if (dotIndex === -1 && parenIndex === -1) {
        if (str === 'clear') return `<span class="text-white">${str}</span>`;
        return `<span class="text-orange-400">${str}</span>`;
    }
    
    let object = '';
    let method = '';
    let argsStr = '';
    let hasDot = false;
    let hasParen = false;
    
    if (dotIndex !== -1 && (parenIndex === -1 || dotIndex < parenIndex)) {
        object = str.slice(0, dotIndex);
        hasDot = true;
        if (parenIndex !== -1) {
            method = str.slice(dotIndex + 1, parenIndex);
            hasParen = true;
            argsStr = str.slice(parenIndex + 1);
        } else {
            method = str.slice(dotIndex + 1);
        }
    } else {
        object = str.slice(0, parenIndex);
        hasParen = true;
        argsStr = str.slice(parenIndex + 1);
    }
    
    html += `<span class="text-orange-400">${object}</span>`;
    if (hasDot) {
        html += `<span class="text-white">.</span><span class="text-white">${method}</span>`;
    }
    if (hasParen) {
        html += `<span class="text-white">(</span>`;
        
        let closedParen = '';
        if (argsStr.endsWith(')')) {
            closedParen = ')';
            argsStr = argsStr.slice(0, -1);
        }
        
        if (argsStr) {
            let parts = [];
            let currentPart = '';
            let inQuotes = false;
            let quoteChar = '';
            
            for (let i = 0; i < argsStr.length; i++) {
                const char = argsStr[i];
                if ((char === "'" || char === '"') && !inQuotes) {
                    inQuotes = true;
                    quoteChar = char;
                    currentPart += char;
                } else if (char === quoteChar && inQuotes) {
                    inQuotes = false;
                    currentPart += char;
                } else if (char === ',' && !inQuotes) {
                    parts.push(currentPart);
                    currentPart = '';
                } else {
                    currentPart += char;
                }
            }
            parts.push(currentPart);
            
            const highlightedParts = parts.map(p => {
                const leadingSpacesMatch = p.match(/^\s*/);
                const trailingSpacesMatch = p.match(/\s*$/);
                const leadingSpaces = leadingSpacesMatch ? leadingSpacesMatch[0] : '';
                const trailingSpaces = trailingSpacesMatch ? trailingSpacesMatch[0] : '';
                const content = p.trim();
                
                if (!content) return p;
                
                let partHtml = content;
                if ((content.startsWith("'") && content.endsWith("'")) || (content.startsWith('"') && content.endsWith('"')) || content.startsWith("'") || content.startsWith('"')) {
                    partHtml = `<span class="text-emerald-400">${content}</span>`;
                } else if (content === 'true' || content === 'false') {
                    partHtml = `<span class="text-sky-400">${content}</span>`;
                } else {
                    partHtml = `<span class="text-white">${content}</span>`;
                }
                
                return leadingSpaces + partHtml + trailingSpaces;
            });
            html += highlightedParts.join('<span class="text-white">,</span>');
        }
        
        if (closedParen) {
            html += `<span class="text-white">)</span>`;
        }
    }
    
    return html;
};

const focusInput = () => {
    if (terminalInputRef.value) terminalInputRef.value.focus();
};

const handleInputKeydown = (e) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
        if (showSuggestions.value && suggestions.value.length > 0) {
            e.preventDefault();
            const suggestion = suggestions.value[selectedSuggestionIndex.value].text;
            const cursorIndex = terminalInputRef.value.selectionStart;
            const textBeforeCursor = currentInput.value.slice(0, cursorIndex);
            const textAfterCursor = currentInput.value.slice(cursorIndex);

            const paramMatch = textBeforeCursor.match(/^(\w+)\.(\w+)\((.*)$/);

            if (paramMatch) {
                const object = paramMatch[1];
                const method = paramMatch[2];
                const newTextBefore = `${object}.${method}(${suggestion}`;
                currentInput.value = newTextBefore + textAfterCursor;
                nextTick(() => {
                    terminalInputRef.value.setSelectionRange(newTextBefore.length, newTextBefore.length);
                });
            } else {
                const parts = textBeforeCursor.split('.');
                if (parts.length === 1) {
                    if (suggestion === 'clear') {
                        currentInput.value = suggestion;
                    } else {
                        currentInput.value = suggestion + '.' + textAfterCursor;
                    }
                } else if (parts.length === 2) {
                    const object = parts[0];
                    const newTextBefore = `${object}.${suggestion}(`;
                    if (!textAfterCursor.includes(')')) {
                        currentInput.value = newTextBefore + ')' + textAfterCursor;
                        nextTick(() => {
                            terminalInputRef.value.setSelectionRange(newTextBefore.length, newTextBefore.length);
                        });
                    } else {
                        currentInput.value = newTextBefore + textAfterCursor;
                    }
                }
            }
            showSuggestions.value = false;
            return;
        } else if (e.key === 'Enter') {
            e.preventDefault();
            submitCode();
            return;
        }
    } else if (e.key === 'ArrowUp') {
        if (showSuggestions.value) {
            e.preventDefault();
            if (selectedSuggestionIndex.value > 0) {
                selectedSuggestionIndex.value--;
            } else {
                selectedSuggestionIndex.value = suggestions.value.length - 1;
            }
        } else {
            e.preventDefault();
            if (historyIndex.value > 0) {
                historyIndex.value--;
                currentInput.value = commandHistory.value[historyIndex.value];
            }
        }
    } else if (e.key === 'ArrowDown') {
        if (showSuggestions.value) {
            e.preventDefault();
            if (selectedSuggestionIndex.value < suggestions.value.length - 1) {
                selectedSuggestionIndex.value++;
            } else {
                selectedSuggestionIndex.value = 0;
            }
        } else {
            e.preventDefault();
            if (historyIndex.value < commandHistory.value.length - 1) {
                historyIndex.value++;
                currentInput.value = commandHistory.value[historyIndex.value];
            } else {
                historyIndex.value = commandHistory.value.length;
                currentInput.value = '';
            }
        }
    } else if (e.key === '(') {
        e.preventDefault();
        const start = e.target.selectionStart;
        currentInput.value = currentInput.value.slice(0, start) + '()' + currentInput.value.slice(start);
        nextTick(() => {
            e.target.setSelectionRange(start + 1, start + 1);
        });
    }
};

const regexCommand = (command) => {
    const regex = /^(\w+)\.(\w+)\((.*?)\)$/;
    const match = command.trim().match(regex);
    if (!match) return null;
    
    const object = match[1];
    const method = match[2];
    let argsStr = match[3].trim();
    let args = [];
    
    if (argsStr.length > 0) {
        args = argsStr.split(',').map(arg => {
            const trimmed = arg.trim();
            if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || 
                (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
                return trimmed.slice(1, -1);
            }
            if (trimmed === 'true') return true;
            if (trimmed === 'false') return false;
            if (!isNaN(trimmed) && trimmed !== '') return Number(trimmed);
            return trimmed;
        });
    }

    return { object, method, args };
}

const submitCode = async () => {
    if (!currentInput.value.trim()) return;
    
    const cmdStr = currentInput.value.trim();
    
    if (cmdStr === 'clear') {
        histories.value = [];
        currentInput.value = '';
        commandHistory.value.push(cmdStr);
        historyIndex.value = commandHistory.value.length;
        return;
    }

    histories.value.push({ type: 'command', text: cmdStr });
    
    commandHistory.value.push(cmdStr);
    historyIndex.value = commandHistory.value.length;
    
    currentInput.value = '';
    showSuggestions.value = false;

    const cmd = regexCommand(cmdStr);
    
    if (!cmd) {
        histories.value.push({ type: 'error', text: `Lỗi cú pháp: Vui lòng sử dụng định dạng object.method('arg')` });
    } else {
        const { object, method, args } = cmd;
        if (METHODS[object] && METHODS[object][method]) {
            const result = await METHODS[object][method](...args);
            if (result && result.type !== 'success') {
                histories.value.push({ type: result.type, text: result.message });
            }
        } else {
            histories.value.push({ type: 'warning', text: `Không tìm thấy thuộc tính hoặc phương thức: ${object}.${method}` });
        }
    }
    
    await nextTick();
    if (terminalContent.value) {
        terminalContent.value.scrollTop = terminalContent.value.scrollHeight;
    }
};

const codeBlock = ref(null);
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const position = ref({ x: 0, y: 0 });

const startDrag = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.closest('.custom-scrollbar') || e.target.closest('.resize-handle')) return;

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

const startResize = (e) => {
    e.stopPropagation();
    isResizing.value = true;
    document.addEventListener('mousemove', doResize);
    document.addEventListener('mouseup', stopResize);
};

const doResize = (e) => {
    if (!isResizing.value) return;
    const rect = codeBlock.value.getBoundingClientRect();
    let newW = e.clientX - rect.left;
    let newH = e.clientY - rect.top;
    
    if (newW > 500) newW = 500;
    if (newW < 250) newW = 250;
    if (newH > 348) newH = 348;
    if (newH < 174) newH = 174;

    size.value = { w: newW, h: newH };
};

const stopResize = () => {
    isResizing.value = false;
    document.removeEventListener('mousemove', doResize);
    document.removeEventListener('mouseup', stopResize);
};

const handleGlobalKeydown = (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleTerminal();
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleGlobalKeydown);
    position.value = { 
        x: window.innerWidth / 2 - 250, 
        y: window.innerHeight / 2 - 174 
    };
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleGlobalKeydown);
});

const onEnter = (el, done) => {
    const menuX = window.innerWidth / 2 - (size.value.w / 2); 
    const menuY = window.innerHeight - 50;
    
    gsap.fromTo(el, 
        { opacity: 0, scale: 0.1, left: menuX + 'px', top: menuY + 'px' },
        { opacity: 1, scale: 1, left: position.value.x + 'px', top: position.value.y + 'px', duration: 0.5, ease: "back.out(1.2)", onComplete: () => {
            focusInput();
            done();
        }}
    );
};

const onLeave = (el, done) => {
    const menuX = window.innerWidth / 2 - (size.value.w / 2);
    const menuY = window.innerHeight - 50;

    gsap.to(el, { opacity: 0, scale: 0.1, left: menuX + 'px', top: menuY + 'px', duration: 0.4, ease: "power2.in", onComplete: done });
};

const selectSuggestion = (index) => {
    selectedSuggestionIndex.value = index;
    const e = new KeyboardEvent('keydown', { key: 'Enter' });
    handleInputKeydown(e);
};
</script>

<template>
    <Transition @enter="onEnter" @leave="onLeave" :css="false">
        <div 
            v-show="showTerminal"
            ref="codeBlock"
            class="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] fixed flex flex-col overflow-visible font-mono text-sm"
            :style="{ left: position.x + 'px', top: position.y + 'px', width: size.w + 'px', height: size.h + 'px', zIndex: 1000 }"
        >
            <div 
                @mousedown="startDrag"
                :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
                class="h-12 flex-shrink-0 bg-white/5 border-b border-white/10 flex items-center px-4 justify-between select-none"
            >
                <div class="flex space-x-2">
                    <div @click="toggleTerminal" class="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 cursor-pointer shadow-sm transition-colors"></div>
                    <div class="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 cursor-pointer shadow-sm transition-colors"></div>
                    <div class="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 cursor-pointer shadow-sm transition-colors"></div>
                </div>
                <h1 class="text-gray-400 text-xs font-bold tracking-widest flex-grow text-center uppercase mr-8">Terminal</h1>
                <button @click="submitCode" class="flex items-center gap-1.5 text-xs bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 rounded-md font-bold transition-colors shadow-lg cursor-pointer select-none">
                    <Icon icon="material-symbols:play-arrow-rounded" class="w-4 h-4"/>
                    Run
                </button>
            </div>

            <div class="flex-grow flex flex-col p-4 relative min-h-0" @click="focusInput">
                <!-- Terminal Output History -->
                <div ref="terminalContent" class="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-2 pb-2" @scroll="updatePopupPosition">
                    <div v-for="(line, index) in histories" :key="index" class="break-all flex flex-col">
                        <div v-if="line.type === 'command'" class="flex items-start">
                            <span class="text-sky-400 font-bold mr-2 whitespace-nowrap">@portfolio &gt;</span>
                            <span class="text-gray-100 break-all" v-html="highlightCommand(line.text)"></span>
                        </div>
                        <div v-else class="pl-2">
                            <span v-if="line.type === 'error'" class="text-red-500">{{ line.text }}</span>
                            <span v-if="line.type === 'warning'" class="text-yellow-400">{{ line.text }}</span>
                            <span v-if="line.type === 'info'" class="text-gray-400">{{ line.text }}</span>
                        </div>
                    </div>

                    <!-- Active Input Line -->
                    <div ref="inputLineRef" class="flex items-center mt-1 relative flex-shrink-0">
                        <span class="text-sky-400 font-bold mr-2 whitespace-nowrap">@portfolio &gt;</span>
                        <div class="relative flex-grow flex items-center h-[20px] overflow-hidden">
                            <!-- Ghost Placeholder -->
                            <div 
                                v-if="!currentInput" 
                                class="absolute left-0 top-0 w-full h-full pointer-events-none text-gray-600 font-mono text-sm flex items-center"
                            >Type command here...</div>

                            <!-- Ghost Highlighter -->
                            <div 
                                ref="ghostDivRef"
                                class="absolute left-0 top-0 w-full h-full pointer-events-none font-mono text-sm flex items-center whitespace-pre overflow-hidden text-transparent"
                            ><span v-html="highlightCommand(currentInput)"></span></div>

                            <!-- Real Input -->
                            <input 
                                ref="terminalInputRef"
                                id="terminal-input"
                                type="text" 
                                v-model="currentInput" 
                                @keydown="handleInputKeydown"
                                @scroll="handleInputScroll"
                                class="absolute left-0 top-0 w-full h-full bg-transparent border-none outline-none text-transparent caret-white font-mono text-sm z-10"
                                autocomplete="off"
                                spellcheck="false"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- IntelliSense Popup (Outside scroll area) -->
            <div v-if="showSuggestions" :style="popupStyle" class="absolute bg-[#1e1e1e]/90 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl overflow-hidden z-[1001] min-w-[200px]">
                <div 
                    v-for="(suggestion, idx) in suggestions" 
                    :key="idx"
                    @mousedown.prevent="selectSuggestion(idx)"
                    class="px-3 py-1.5 cursor-pointer flex flex-col gap-0.5 border-b border-white/5 last:border-0 hover:bg-sky-500/80 transition-colors"
                    :class="{ 'bg-sky-500/80': idx === selectedSuggestionIndex }"
                >
                    <div class="flex items-center gap-2 text-[13px] font-semibold text-white">
                        <Icon icon="mdi:function" class="w-3.5 h-3.5 opacity-70" />
                        {{ suggestion.text }}
                    </div>
                    <div class="text-[11px] text-gray-400 leading-tight pl-5" :class="{ 'text-sky-100': idx === selectedSuggestionIndex }">
                        {{ suggestion.description }}
                    </div>
                </div>
            </div>

            <!-- Resize Handle -->
            <div 
                class="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize resize-handle flex items-end justify-end p-1"
                @mousedown="startResize"
            >
                <div class="w-2 h-2 border-r-2 border-b-2 border-white/30 rounded-br-sm"></div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
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
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active{
    -webkit-box-shadow: 0 0 0 30px transparent inset !important;
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: white !important;
}
</style>