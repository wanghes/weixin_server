<template>
    <div>
        <el-dialog title="提取完成" :visible.sync="visibleStatus" :before-close="handleClose">
            <div>
                <el-alert type="warning">
                    <span slot>论文【关于计算机教改方案的研究与建设方案之我见】已经提取完成，请继续操作！</span>
                </el-alert>
                <div class="py_btn">
                    <svg-icon icon-class="py"></svg-icon>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleClose">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: ["visibleStatus", "ticode"],
    data() {
        return {};
    },
    updated() {},
    methods: {
        handleClose() {
            this.$emit("update:visibleStatus", false);
        },
        handleFetch() {
            
        }
    }
};
</script>

<style lang="less">
.text {
    font-size: 14px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both;
}

.py_btn {
    margin: 15px auto;
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 10px;
    transition: all 0.3s linear;
    cursor: pointer;
    width: 80px;
    text-align: center;
    &:hover {
        background: #409eff;
        border: 1px solid #409eff;
        color: #fff;
    }
}
</style>