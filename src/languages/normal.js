import { useState } from "../hooks/useState";
const { setShowSupport, isAutoPlay, showTerminal } = useState();
import router from "../routes/index.js";

const METHODS = {
    system: {
        help: () => {
            return [
                {
                    command: 'support',
                    description: 'Bật/tắt cửa sổ hỗ trợ.',
                    usage: [
                        {
                            arg: "true",
                            description: 'Mở cửa sổ hỗ trợ.'
                        },
                        {
                            arg: "false",
                            description: 'Đóng cửa sổ hỗ trợ.'
                        }
                    ]
                },
                {
                    command: 'auto',
                    description: 'Bật/tắt chế độ tự động cuộn (Auto Play).',
                    usage: [
                        {
                            arg: "true",
                            description: 'Bật Auto Play.'
                        },
                        {
                            arg: "false",
                            description: 'Tắt Auto Play.'
                        }
                    ]
                },
                {
                    command: 'terminal',
                    description: 'Bật/tắt chế độ dòng lệnh (Terminal).',
                    usage: [
                        {
                            arg: "true",
                            description: 'Mở Terminal.'
                        },
                        {
                            arg: "false",
                            description: 'Đóng Terminal.'
                        }
                    ]
                }
            ];
        },
        support: (bool, ...rest) => {
            if (rest.length > 0 || typeof bool !== 'boolean') return { type: 'warning', message: 'Tham số phải là boolean (true/false).' };
            setShowSupport(bool);
            return {
                type: 'success',
                message: bool ? 'Đã hiển thị quy tắc hỗ trợ.' : 'Đã ẩn quy tắc hỗ trợ.'
            }
        },
        auto: (bool, ...rest) => {
            if (rest.length > 0 || typeof bool !== 'boolean') return { type: 'warning', message: 'Tham số phải là boolean (true/false).' };
            isAutoPlay.value = bool;
            return {
                type: 'success',
                message: bool ? 'Đã bật chế độ tự động cuộn (Auto Play).' : 'Đã tắt chế độ tự động cuộn.'
            }
        },
        terminal: (bool, ...rest) => {
            if (rest.length > 0 || typeof bool !== 'boolean') return { type: 'warning', message: 'Tham số phải là boolean (true/false).' };
            showTerminal.value = bool;
            return {
                type: 'success',
                message: bool ? 'Đã bật Terminal.' : 'Đã ẩn Terminal.'
            }
        }
    },
    page: {
        help: () => {
            const routes = router.getRoutes().filter(r => r.name && r.name !== 'Slides').map(r => r.name);
            return [
                {
                    command: 'go',
                    description: 'Di chuyển đến các trang (route) trong hệ thống.',
                    usage: routes.map(routeName => ({
                        arg: `'${routeName}'`,
                        description: `Chuyển đến route ${routeName}.`
                    }))
                },
                {
                    command: 'next',
                    description: 'Chuyển hướng đến phần tiếp theo.',
                    usage: [
                        { arg: "", description: 'Tiến một bước.' }
                    ]
                },
                {
                    command: 'previous',
                    description: 'Chuyển hướng về phần trước đó.',
                    usage: [
                        { arg: "", description: 'Lùi một bước.' }
                    ]
                }
            ]
        },
        go: async (routeName, ...rest) => {
            if (rest.length > 0 || typeof routeName !== 'string') return { type: 'warning', message: 'Cú pháp sai: Tham số phải là một chuỗi (string) chỉ định tên Route.' };
            
            const routes = router.getRoutes().filter(r => r.name && r.name !== 'Slides').map(r => r.name);
            
            if (routes.includes(routeName)) {
                await router.isReady();
                await router.push({ name: routeName });
                return { type: 'success', message: `Đã chuyển hướng đến: ${routeName}` }
            } else {
                return { type: 'error', message: `Route không tồn tại: ${routeName}. Các route hợp lệ: ${routes.join(', ')}` }
            }
        },
        next: async (...args) => {
            if (args.length > 0) return { type: 'warning', message: 'Lệnh này không nhận tham số.' };
            const path = router.currentRoute.value.path;
            if (path === '/') {
                await router.push('/second');
                return { type: 'success', message: 'Đã chuyển đến phần tiếp theo (SecondSlide).' };
            } else if (path === '/second') {
                await router.push('/third');
                return { type: 'success', message: 'Đã chuyển đến phần tiếp theo (ThirdSlide).' };
            }
            return { type: 'warning', message: 'Không còn trang tiếp theo.' };
        },
        previous: async (...args) => {
            if (args.length > 0) return { type: 'warning', message: 'Lệnh này không nhận tham số.' };
            const path = router.currentRoute.value.path;
            if (path === '/second') {
                await router.push('/');
                return { type: 'success', message: 'Đã quay lại phần trước (FirstSlide).' };
            } else if (path === '/third') {
                await router.push('/second');
                return { type: 'success', message: 'Đã quay lại phần trước (SecondSlide).' };
            }
            return { type: 'warning', message: 'Không có trang trước đó.' };
        }
    },
    redirect: {
        help: () => {
            return [
                {
                    command: 'profile',
                    description: 'Chuyển hướng đến trang cá nhân.',
                    usage: [
                        { arg: "'github'", description: 'Chuyển hướng đến GitHub.' },
                        { arg: "'ruryLib'", description: 'Chuyển hướng đến RuryLib.' }
                    ]
                },
                {
                    command: 'url',
                    description: 'Mở URL được chỉ định trong tab mới.',
                    usage: [
                        { arg: "'https://example.com'", description: 'Mở trang được chỉ định.' }
                    ]
                },
                {
                    command: 'page',
                    description: 'Điều hướng bằng tên Route.',
                    usage: router.getRoutes().filter(r => r.name && r.name !== 'Slides').map(r => ({
                        arg: `'${r.name}'`,
                        description: `Chuyển đến màn hình ${r.name}.`
                    }))
                }
            ]
        },
        profile: (link, ...rest) => {
            if (rest.length > 0 || typeof link !== 'string') return { type: 'warning', message: 'Cú pháp sai: Cần 1 tham số chuỗi (string).' };
            switch(link) {
                case 'github': {
                    window.open('https://github.com/hieurury');
                    return { type: 'success', message: 'Đã chuyển hướng đến GitHub.' }
                }
                case 'ruryLib': {
                    window.open('https://lib.hieurury.id.vn');
                    return { type: 'success', message: 'Đã chuyển hướng đến RuryLib.' }
                }
                default: {
                    return { type: 'warning', message: `Liên kết không hợp lệ: ${link}` }
                }
            }
        },
        url: (url, ...rest) => {
            if (rest.length > 0 || typeof url !== 'string') return { type: 'warning', message: 'Cú pháp sai: Cần 1 tham số chuỗi (string) chỉ định URL.' };
            try {
                window.open(url);
                return { type: 'success', message: `Đang mở: ${url}` }
            } catch (error) {
                return { type: 'error', message: `Không thể mở URL: ${url}` }
            }
        },
        page: async (pageName, ...rest) => {
            if (rest.length > 0 || typeof pageName !== 'string') return { type: 'warning', message: 'Cú pháp sai: Cần 1 tham số chuỗi (string).' };
            try {
                await router.isReady();
                await router.push({ name: pageName });
                return { type: 'success', message: `Đã điều hướng tới Route: ${pageName}` }
            } catch (error) {
                return { type: 'error', message: `Không thể chuyển đến trang: ${pageName}` }
            }
        }
    }
}

export default METHODS;