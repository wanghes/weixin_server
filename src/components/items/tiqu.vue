<template>
    <div>
        <el-dialog title="提取论文" :visible.sync="visibleStatus" :before-close="handleClose">
            <div>
                <el-input size="small" v-model="ticode" readonly>
                    <el-button @click="handleFetch" slot="append" size="small" type="primary">获取论文信息</el-button>
                </el-input>
                <el-card shadow="never" class="box-card box-card-info">
                    <div slot="header" class="clearfix">
                        <span>论文信息</span>
                    </div>
                    <div class="box">
                        <div class="item clearfix">
                            <label>论文题目</label>
                            <span>大兴建筑功能多项目管理实施</span>
                        </div>
                        <div class="item clearfix">
                            <label>论文题目</label>
                            <span>大兴建筑功能多项目管理实施</span>
                        </div>
                        <div class="item clearfix">
                            <label>论文题目</label>
                            <span>大兴建筑功能多项目管理实施</span>
                        </div>
                        <div class="item clearfix">
                            <label>论文题目</label>
                            <span>大兴建筑功能多项目管理实施</span>
                        </div>
                        <div class="item clearfix">
                            <label>论文题目</label>
                            <span>大兴建筑功能多项目管理实施</span>
                        </div>
                    </div>
                </el-card>
                <div class="tiqu_btn">
                    <svg-icon icon-class="tiqu"></svg-icon>
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
            alert(12);
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

.box-card-info {
    margin-top: 15px;
    .el-card__header {
        padding: 10px;
        span {
            float: left;
        }
    }
    .box{
        .item{
             margin-bottom: 5px;
            *{
                float: left;
            }
            label{
                font-weight: bold;
                &::after{
                    content: "：";
                }
            }
        }
    }
}
.tiqu_btn{
    margin: 15px auto;
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 10px;
    transition: all .3s linear;
    cursor: pointer;
    width: 80px;
    &:hover{
        background: #409EFF;
        border: 1px solid #409EFF;
        color:#fff;
    }
}
</style>