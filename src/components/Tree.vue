<script setup>
import {
    defineProps,
    ref,
    h
} from "vue";


const props = defineProps({
    options: {
        type: Array,
        required: true
    }
});

console.log(    props.options);

//chổ này dùng để lưu mấy cái list đã mở rộng
const expandedNodes = ref(new Set())

//để bật tắt cái list -> có rồi thì tắt còn chưa có thì bật
//mấy đứa nào được đưa dô expandedNodes thì sẽ bật đấy
const toggleNode = (nodeLabel) => {
    if (expandedNodes.value.has(nodeLabel)) {
        expandedNodes.value.delete(nodeLabel);
    } else {
        expandedNodes.value.add(nodeLabel);
    }
    console.log(expandedNodes.value);
}

//kiểm tra xem node cha đó có đang được bật không
const hasParentNode = (nodeLabel) => {
    return expandedNodes.value.has(nodeLabel);
}

//để render mấy cái nhánh cây từ cấp 2 trở đi
const renderTreeLv = (data, parentLabel) => {
    //đảm nhiệm node cha chứa các phần nội dung bên trong
    //chứa 1 thẻ div làm nút và một ul giống nó để chứa nội dung tiếp theo
    const parentNode = ref(null);
    //node con dùng để render nội dung tiếp theo bằng phương pháp đệ quy
    const childNode = ref(null);
    if(!data.isLeaf) { //kiểm tra xem có là lá ko để biết mà render tiếp
        childNode.value = data.children.map(child => {
            return h('li', {
                class: 'list-toggle'
            }, [
                h('div', {
                    class: `${child.isLeaf ? 'toggle-item bg-slate-700 p-1 border border-gray-300' : 'toggle-item'}`, // các toggle item này sẽ đảm nhiệm việc bật tắt content
                    onClick: () => {
                        if(child.children) {
                            toggleNode(child.label);
                        }
                    }
                }, h(
                    'i',
                    {//nếu là lá thì hiện hình command còn không thì hiện mũi tên
                        class: `me-2 ml-2 fa-solid ${child.isLeaf ? 'fa-code text-blue-500' : (hasParentNode(child.label) ? 'fa-caret-down' : 'fa-caret-right')}`
                    }
                ),child.label),
                renderTreeLv(child, child.label) //đệ quy thêm nhánh
            ]);
        });
    }
    parentNode.value = h('ul', {
        class: `toggle-content pl-4 ${hasParentNode(parentLabel) ? 'block' : 'hidden'}`, //content thì dùng để chứa phần nhánh cấp dưới nữa
        key: parentLabel,
    }, childNode.value ? childNode.value : null); //nếu không có nodecon thì nó là lá rồi, dừng

    return parentNode.value;
}


//dùng để render cây từ gốc
//việc tách ra để hạn chế logic của các command không phân cấp thêm
const renderTree = (data) => {
    //lọc qua dữ liệu vào để render từng đối tượng
    const tree = data.map(item => {
        return h('li', {
            class: 'list-toggle'
        }, [
            h('div', {
                class: 'toggle-item font-semibold text-gray-100 text-lg mb-1',
                onClick: () => {
                    if(item.children) {
                        toggleNode(item.label);
                    }
                }
            }, h(
                'i',
                {//nếu là lá thì hiện hình command còn không thì hiện mũi tên
                    class: `me-2 fa-solid ${item.isLeaf ? 'fa-code' : (hasParentNode(item.label) ? 'fa-caret-down' : 'fa-caret-right')}`
                }
            ), item.label),
            renderTreeLv(item, item.label) //render nhánh thứ 2 của nó
        ]);
    });
    return h('ul', {
        class: 'container'
    }, tree);
}
</script>


<template>
    <div>
        <component :is="renderTree(props.options)"></component>
    </div>
</template>


<style scoped>

</style>