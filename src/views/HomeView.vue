<script setup>
import CodeBlock from '../components/CodeBlock.vue';
import SupportBlock from '../components/SupportBlock.vue';
import Tag from '../components/Tag.vue';

//icons
import { Icon } from '@iconify/vue';

</script>


<template>
    <CodeBlock class="hidden"/>
    <SupportBlock/>
    <div class="flex flex-row h-screen overflow-x-hidden">
        <div id="first" class="w-full shrink-0 bg-black/90">
            <div class="grid grid-cols-2 min-h-screen">
                <div class="col-span-1 px-6 py-8">
                    <h1 class="text-8xl font-bold tracking-widest
                    text-gray-200 pb-4"
                    >Hi There!</h1>
                    <p class="text-3xl text-gray-300 border-b border-gray-300 pb-4 mb-4">Welcome to my portfolio!</p>
                    <div class="grid grid-cols-4 border border-gray-300 p-4 py-6 rounded-md">
                        <div class="col-span-1">
                            <img src="/cv.svg" alt="">
                        </div>
                        <div class="col-span-3 text-gray-300 px-4">
                            <h3>Full name: <span class="border px-4 py-1 rounded-md bg-sky-500">Vo Minh Hieu</span></h3>
                            <h3>Profession: <span class="border px-4 py-1 rounded-md bg-emerald-500">Software Engineer</span></h3>
                            <h3>Location: <span class="border px-4 py-1 rounded-md bg-purple-500">Can Tho City, Vietnam</span></h3>
                            <p class="mt-6">Description: I'm graduated from <span class="text-green-500">Can Tho University</span> with a degree in <span class="text-orange-500">Software Engineering</span>.</p>
                        </div>
                    </div>
                    <!-- list of programing -->
                    <div class="my-2">
                        <h3 class="text-gray-300 my-2">Languages:</h3>
                        <ul>
                            <li>
                                <Tag label="JavaScript" color="yellow"/>
                                <Tag label="CSS" color="sky"/>
                                <Tag label="HTML" color="orange"/>
                                <Tag label="Python" color="emerald"/>
                                <Tag label="C++" color="purple"/>
                            </li>
                        </ul>
                        <h3 class="text-gray-300 my-2">Technologies:    </h3>
                        <ul>
                            <li>
                                <Tag label="Git" color="orange"/>
                                <Tag label="MongoDB" color="emerald"/>
                                <Tag label="Postman" color="orange"/>
                                <Tag label="Vite" color="purple"/>
                                <Tag label="Vercel" color="slate"/>
                                <Tag label="Cloudflare" color="orange"/>
                            </li>
                        </ul>
                    </div>
                    <div class="grid grid-cols-4 mt-16 text-gray-300">
                        <div class="col-span-1 flex flex-col items-center">
                            <h3 class="text-2xl font-extrabold">4,5</h3>
                            <p class="text-sm">Years of Study</p>
                        </div>
                        <div class="col-span-3 flex items-center border-l border-gray-300 pl-2">
                            <button class="bg-orange-600 px-16 py-2 rounded-lg shadow-[0_4px_0] shadow-orange-600/50
                            cursor-pointer active:shadow-[0_2px_0] active:translate-y-1">
                                Download CV
                            </button>
                        </div>
                    </div>
                </div>
                <!-- bên phải -->
                <div class="col-span-1 flex justify-center">
                    <div class="flex flex-1 items-center bg-orange-500 rounded-l-full">
                        <div class="flex flex-1 flex-col items-center space-y-6">
                            <h3 class="text-5xl font-extrabold uppercase text-white">Next step!</h3>
                            <p class="text-white">Continue your journey</p>
                            <a href="#second" class="bg-emerald-500/90 cursor-pointer backdrop-blur-lg border-2 border-white shadow-[0_2px_0] shadow-white px-12 rounded-full
                            active:shadow-[0_0_0] active:translate-y-1 flex items-center space-x-4 py-2 transition-all duration-150 hover:bg-emerald-500/100">
                                <Icon class="text-white" icon="material-symbols:line-end-arrow-rounded" width="64" height="64" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="second" class="w-full shrink-0 bg-green-600/40 flex justify-center items-center">
            <h1 class="text-4xl uppercase font-semibold text-gray-600 tracking-wider">Phần hai</h1>
        </div>
        <div id="third" class="w-full shrink-0 bg-sky-600/40 flex justify-center items-center">
            <h1 class="text-4xl uppercase font-semibold text-gray-600 tracking-wider">Phần ba</h1>
        </div>
        <div id="last" class="w-full shrink-0 bg-slate-800/20 flex justify-center items-center">
            <h1 class="text-4xl uppercase font-semibold text-gray-600 tracking-wider">Phần cuối</h1>
        </div>
    </div>
</template>


<style scoped>

</style>