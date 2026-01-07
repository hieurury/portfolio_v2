<script setup>
    import {
        defineProps,
        ref,
        onMounted,
        watch,
        defineEmits
    } from 'vue';

    const props = defineProps({
        fullName: {
            type: String,
            default: 'Vo Minh Hieu'
        },
        profession: {
            type: String,
            default: 'Software Engineer'
        },
        location: {
            type: String,
            default: 'Can Tho City, Vietnam'
        },
        description: {
            type: String,
            default: `I'm graduated from <span class="text-emerald-500">Can Tho University</span> with a degree in <span class="text-red-500">Software Engineering</span>.`
        }
    });

    const emit = defineEmits(['done']);

    const fullNameRef = ref({
        data: null,
        done: false
    })
    const fullNameStyle = ref(null);


    const professionRef = ref({
        data: null,
        done: false
    })
    const professionStyle = ref(null);


    const locationRef = ref({
        data: null,
        done: false
    })
    const locationStyle = ref(null);


    const descriptionRef = ref({
        data: null,
        done: false
    })

    onMounted(() => {
        //chạy fullnam trước
        animateText(fullNameRef, props.fullName, 100);
    })

    //lắng nghe hoàn thành từng giai đoạn để viết tiếp các nội dung
    watch(() => fullNameRef.value.done, (isDone) => {
        if(isDone){
            makeStyle(fullNameStyle, 'heading-animate');
            animateText(professionRef, props.profession, 100);
        }
    });
    watch(() => professionRef.value.done, (isDone) => {
        if(isDone){
            makeStyle(professionStyle, 'profession-animate');
            animateText(locationRef, props.location, 100);
        }
    });
    watch(() => locationRef.value.done, (isDone) => {
        if(isDone){
            makeStyle(locationStyle, 'location-animate');
            animateText(descriptionRef, props.description, 30, true);
        }
    });

    //chạy chữ
    const animateText = (propRef, text, intervalTime = 50, isDone) => {
        propRef.value = {
            data: '',
            done: false
        };
        const chars = text.split('');
        const interval = setInterval(() => {
            if(chars.length === 0){
                propRef.value.done = true;
                clearInterval(interval);
                if(isDone) emit('done');
                return;
            }
            propRef.value.data += chars.shift();
        }, intervalTime);
    }
    //tô màu
    const makeStyle = (refStyle, animate) => {
        refStyle.value.classList.add(animate);
    }
</script>

<template>
    <div class="card-animate grid grid-cols-4 bg-white/10 border border-gray-300 lg:p-4 p-1 py-6 my-4 rounded-md
    lg:text-md text-sm">
        <div class="lg:col-span-1 hidden lg:flex justify-center items-center">
            <img src="/cv.svg" alt="">
        </div>
        <div class="lg:col-span-3 col-span-4 text-gray-300 px-4">
            <h3>Full name: <span ref="fullNameStyle">{{ fullNameRef.data }}</span></h3>
            <h3>Profession: <span ref="professionStyle" >{{ professionRef.data }}</span></h3>
            <h3>Location: <span ref="locationStyle">{{ locationRef.data }}</span></h3>
            <p class="mt-6">Description: 
                <span v-html="descriptionRef.data"></span>
            </p>
        </div>
    </div>
</template>

<style scoped>
/* css */
.card-animate {
    background: linear-gradient(to right, #fff1, #fff1) no-repeat;
    background-size: 0% 100%; 
    animation: cardBgDraw 0.9s ease-out forwards;
    border-radius: 6px;
    transition: all 0.3s ease-in-out;
}

.heading-animate {
    background: linear-gradient(to right, #10b981, #10b981) no-repeat;
    background-size: 0% 100%; 
    animation: fullNameBgDraw 0.5s ease-out forwards;
    padding: 4px 16px;
    border-radius: 6px;
    transition: all 0.3s ease-in-out;
}

.profession-animate {
    background: linear-gradient(to right, #cf5605, #cf5605) no-repeat;
    background-size: 0% 100%; 
    animation: professionBgDraw 0.5s ease-out forwards;
    padding: 4px 16px;
    border-radius: 6px;
    transition: all 0.3s ease-in-out;
}
.location-animate {
    background: linear-gradient(to right, #2563eb, #2563eb) no-repeat;
    background-size: 0% 100%; 
    animation: locationBgDraw 0.5s ease-out forwards;
    padding: 4px 16px;
    border-radius: 6px;
    transition: all 0.3s ease-in-out;
}
@keyframes cardBgDraw {
    0% {
        background-size: 0% 100%;
        width: 0%;
    }
    80% {
        background-size: 100% 100%;
        width: 100%;
    }
    100% {
        background-size: 100% 100%;
        width: 100%;
        border: 1px solid #d1d5db;
    }
}

@keyframes fullNameBgDraw {
    0% {
        background-size: 0% 100%;
    }
    80% {
        background-size: 100% 100%;
    }
    100% {
        background-size: 100% 100%;
        border: 1px solid #0a583e;
    }
}
@keyframes professionBgDraw {
    0% {
        background-size: 0% 100%;
    }
    80% {
        background-size: 100% 100%;
    }
    100% {
        background-size: 100% 100%;
        border: 1px solid #75360c;
    }
}
@keyframes locationBgDraw {
    0% {
        background-size: 0% 100%;
    }
    80% {
        background-size: 100% 100%;
    }
    100% {
        background-size: 100% 100%;
        border: 1px solid #1e40af;
    }
}
</style>