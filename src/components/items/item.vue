<template>
    <div>
    <div class="item" :class="itemClass">
        <div class="one">
            <svg-icon class="biao" :icon-class="iconClass"></svg-icon>
            <span>{{ font }}</span>
        </div>
        <div class="two">
            <div class="time">
                <span>2019-10-20前完成</span>
                <em>（剩余30天）</em>
            </div>
            <h4 class="title">关于计算机教改方案的研究与建设方案之我见</h4>
            <div class="label">
                <span>计算机</span>
                <span>软件工程</span>
                <span>学数学为</span>
                <span>全日制</span>
                <span>提取时间：2019-10-12</span>
            </div>
        </div>
        <div class="three">
            <el-button type="primary" @click="handlePingyue" plain>立即评审</el-button>
        </div>
    </div>
    <pingyue :visibleStatus.sync="pingyueStatus" />
    </div>
</template>

<script>
import pingyue from "@/components/items/pingyue.vue";
export default {
    components: {
        pingyue
    },
    props: ["listItem"],
    data() {
        return {
            pingyueStatus: false,
            iconClass: "",
            font: "",
            item: null,
        };
    },
    methods: {
        handlePingyue() {
            this.pingyueStatus = true;
        }
    },
    computed: {
        itemClass() {
            switch (this.listItem.status) {
                case 1:
                    this.font = "未评阅";
                    this.iconClass = "nodone";
                    return "nodone";
                    break;
                case 2:
                    this.font = "暂存";
                    this.iconClass = "zancun";
                    return "zancun";
                    break;
                case 3:
                    this.font = "评阅历史";
                    this.iconClass = "ls";
                    return "done";
                    break;
                default:
                    break;
            }
        }
    }
};
</script>