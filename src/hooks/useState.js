import { ref, onMounted, watch } from "vue";

const showSupport = ref(false);
const showRules = ref(false);

const useState = () => {
    const setShowSupport = (value) => {
        showSupport.value = value;
    };

    const setShowRules = (value) => {
        showRules.value = value;
    };
    return {
        showSupport,
        setShowSupport,
        showRules,
        setShowRules
    };
};

export {
    useState,
};