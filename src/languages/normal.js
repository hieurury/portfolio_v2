import {
    useState
} from "../hooks/useState";
const {
    setShowSupport
} = useState();
import {
    useRouter
} from "vue-router";

import router from "../routes/index.js";

const METHODS = {
    system: {
        support: (bool) => {
            console.log(bool);
            setShowSupport(bool);
            return {
                type: 'success',
                message: bool ? 'Đã hiển thị quy tắc.' : 'Đã ẩn quy tắc.'
            }
        }
    },
    currentPage: {
        help: () => {
            const data = [
                {
                    command: 'go',
                    description: 'Cuộn trang đến vị trí được chỉ định.',
                    usage: [
                        {
                            arg: "'first'",
                            description: 'Cuộn đến phần đầu.'
                        },
                        {
                            arg: "'second'",
                            description: 'Cuộn đến phần hai.'
                        },
                        {
                            arg: "'third'",
                            description: 'Cuộn đến phần ba.'
                        },
                        {
                            arg: "'last'",
                            description: 'Cuộn đến phần cuối.'
                        }
                    ]
                }
            ]

            return data;
        },
        go: async (location) => {
            switch(location) {
                case 'first': {
                    const element = document.getElementById('first');
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                    return {
                        type: 'success',
                        message: 'Đã cuộn đến phần đầu.'
                    }
                }
                case 'second': {
                    const element = document.getElementById('second');
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                    return {
                        type: 'success',
                        message: 'Đã cuộn đến phần hai.'
                    }
                }
                case 'third': {
                    const element = document.getElementById('third');
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                    return {
                        type: 'success',
                        message: 'Đã cuộn đến phần ba.'
                    }
                }
                case 'last': {
                    const element = document.getElementById('last');
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                    return {
                        type: 'success',
                        message: 'Đã cuộn đến phần cuối.'
                    }
                }
                default: {
                    return {
                        type: 'error',
                        message: `Vị trí không hợp lệ: ${location}`
                    }
                }
            }
        }
    },
    redirect: {
        help: () => {
            const data = [
                {
                    command: 'profile',
                    description: 'Chuyển hướng đến trang cá nhân.',
                    usage: [
                        {
                            arg: "'github'",
                            description: 'Chuyển hướng đến GitHub.'
                        },
                        {
                            arg: "'ruryLib'",
                            description: 'Chuyển hướng đến RuryLib.'
                        }
                    ]
                },
                {
                    command: 'url',
                    description: 'Mở URL được chỉ định trong tab mới.',
                    usage: [
                        {
                            arg: "'example.com'",
                            description: 'Mở trang example.com.'
                        }
                    ]
                }
            ]
            return data;
        },
        profile: (link) => {
            switch(link) {
                case 'github': {
                    window.open('https://github.com/hieurury');
                    return {
                        type: 'success',
                        message: 'Đã chuyển hướng đến GitHub.'
                    }
                }
                case 'ruryLib': {
                    window.open('https://lib.hieurury.id.vn');
                    return {
                        type: 'success',
                        message: 'Đã chuyển hướng đến GitHub.'
                    }
                }
                default: {
                    return {
                        type: 'error',
                        message: `Liên kết không hợp lệ: ${link}`
                    }
                }
            }
        },
        url: (url) => {
            try {
                window.open(url);
            } catch (error) {
                return {
                    type: 'error',
                    message: `Không thể mở URL: ${url}`
                }
            }
        },
        page: async (pageName) => {
            try {
                
                await router.isReady(); // Đợi router sẵn sàng
                await router.push({ name: pageName });
            } catch (error) {
                return {
                    type: 'error',
                    message: `Không thể chuyển đến trang: ${pageName}`
                }
            }
        }
    }
}


export default METHODS;