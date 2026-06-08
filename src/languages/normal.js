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
                await router.push('/timeline');
                return { type: 'success', message: 'Đã chuyển đến phần tiếp theo (Timeline).' };
            } else if (path === '/timeline') {
                await router.push('/experience');
                return { type: 'success', message: 'Đã chuyển đến phần tiếp theo (Experience).' };
            }
            return { type: 'warning', message: 'Không còn trang tiếp theo.' };
        },
        previous: async (...args) => {
            if (args.length > 0) return { type: 'warning', message: 'Lệnh này không nhận tham số.' };
            const path = router.currentRoute.value.path;
            if (path === '/timeline') {
                await router.push('/');
                return { type: 'success', message: 'Đã quay lại phần trước (Overview).' };
            } else if (path === '/experience') {
                await router.push('/timeline');
                return { type: 'success', message: 'Đã quay lại phần trước (Timeline).' };
            }
            return { type: 'warning', message: 'Không có trang trước đó.' };
        }
    },
    game: {
        help: () => {
            return [
                {
                    command: 'autoGacha',
                    description: 'Tự động quay Gacha cho đến khi hết thẻ.',
                    usage: [
                        { arg: "true", description: 'Bật tự động quay.' },
                        { arg: "false", description: 'Tắt tự động quay.' }
                    ]
                },
                {
                    command: 'gacha',
                    description: 'Thực hiện 1 lần quay Gacha.',
                    usage: [{ arg: "", description: 'Quay Gacha.' }]
                },
                {
                    command: 'unlockGacha',
                    description: 'Mở khoá 1 thẻ Gacha theo ID.',
                    usage: [{ arg: "1", description: 'Mở khoá thẻ số 1.' }]
                },
                {
                    command: 'unlockAllGacha',
                    description: 'Mở khoá tất cả thẻ Gacha.',
                    usage: [{ arg: "", description: 'Mở khoá toàn bộ.' }]
                },
                {
                    command: 'resetGacha',
                    description: 'Đóng lại tất cả thẻ Gacha.',
                    usage: [{ arg: "", description: 'Reset toàn bộ.' }]
                }
            ];
        },
        autoGacha: (bool, ...rest) => {
            if (router.currentRoute.value.path !== '/experience') return { type: 'error', message: 'Lệnh chỉ khả dụng ở trang Experience (Kinh nghiệm).' };
            if (rest.length > 0 || typeof bool !== 'boolean') return { type: 'warning', message: 'Tham số phải là boolean (true/false).' };
            if (window.gameActions) {
                window.gameActions.autoGacha(bool);
                return { type: 'success', message: bool ? 'Đã bật Auto Gacha.' : 'Đã tắt Auto Gacha.' };
            }
            return { type: 'error', message: 'Game actions chưa được khởi tạo.' };
        },
        gacha: (...args) => {
            if (router.currentRoute.value.path !== '/experience') return { type: 'error', message: 'Lệnh chỉ khả dụng ở trang Experience (Kinh nghiệm).' };
            if (args.length > 0) return { type: 'warning', message: 'Lệnh không nhận tham số.' };
            if (window.gameActions) {
                if (window.gameActions.isAutoGachaMode()) return { type: 'warning', message: 'Hệ thống đang Auto Gacha. Vui lòng tắt (game.autoGacha(false)) trước khi sử dụng lệnh này.' };
                window.gameActions.gacha();
                return { type: 'success', message: 'Đang thực hiện Gacha...' };
            }
            return { type: 'error', message: 'Game actions chưa được khởi tạo.' };
        },
        unlockGacha: (num, ...rest) => {
            if (router.currentRoute.value.path !== '/experience') return { type: 'error', message: 'Lệnh chỉ khả dụng ở trang Experience (Kinh nghiệm).' };
            if (rest.length > 0 || typeof num !== 'number') return { type: 'warning', message: 'Tham số phải là một số (number).' };
            if (window.gameActions) {
                if (window.gameActions.isAutoGachaMode()) return { type: 'warning', message: 'Hệ thống đang Auto Gacha. Vui lòng tắt (game.autoGacha(false)) trước khi sử dụng lệnh này.' };
                window.gameActions.unlockGacha(num);
                return { type: 'success', message: `Đã mở khoá thẻ #${num}.` };
            }
            return { type: 'error', message: 'Game actions chưa được khởi tạo.' };
        },
        unlockAllGacha: (...args) => {
            if (router.currentRoute.value.path !== '/experience') return { type: 'error', message: 'Lệnh chỉ khả dụng ở trang Experience (Kinh nghiệm).' };
            if (args.length > 0) return { type: 'warning', message: 'Lệnh không nhận tham số.' };
            if (window.gameActions) {
                if (window.gameActions.isAutoGachaMode()) return { type: 'warning', message: 'Hệ thống đang Auto Gacha. Vui lòng tắt (game.autoGacha(false)) trước khi sử dụng lệnh này.' };
                window.gameActions.unlockAllGacha();
                return { type: 'success', message: 'Đã mở khoá tất cả các thẻ.' };
            }
            return { type: 'error', message: 'Game actions chưa được khởi tạo.' };
        },
        resetGacha: (...args) => {
            if (router.currentRoute.value.path !== '/experience') return { type: 'error', message: 'Lệnh chỉ khả dụng ở trang Experience (Kinh nghiệm).' };
            if (args.length > 0) return { type: 'warning', message: 'Lệnh không nhận tham số.' };
            if (window.gameActions) {
                if (window.gameActions.isAutoGachaMode()) return { type: 'warning', message: 'Hệ thống đang Auto Gacha. Vui lòng tắt (game.autoGacha(false)) trước khi sử dụng lệnh này.' };
                window.gameActions.resetGacha();
                return { type: 'success', message: 'Đã reset lại tất cả thẻ Gacha.' };
            }
            return { type: 'error', message: 'Game actions chưa được khởi tạo.' };
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