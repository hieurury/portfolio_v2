import { ref, onMounted, watch } from "vue";

const showSupport = ref(false);
const showRules = ref(false);
const isAutoPlay = ref(false);
const showTerminal = ref(false);

const useState = () => {
    const setShowSupport = (value) => {
        showSupport.value = value;
    };

    const setShowRules = (value) => {
        showRules.value = value;
    };

    const toggleAutoPlay = () => {
        isAutoPlay.value = !isAutoPlay.value;
    };

    const toggleTerminal = () => {
        showTerminal.value = !showTerminal.value;
    };

    return {
        showSupport,
        setShowSupport,
        showRules,
        setShowRules,
        isAutoPlay,
        toggleAutoPlay,
        showTerminal,
        toggleTerminal
    };
};

export {
    useState,
};