<template>
    <el-container>
        <el-header class="header">
            <div class="header_wrap">
                <h3 class="title">
                    研究生论文评审系统
                    <span>Postgraduate Thesis Review System</span>
                </h3>
                <div class="login_info">
                    <span>当前用户：</span>
                    <span>欧阳娜娜</span>
                    <a class="quit_btn" href="javascript:;">退出登录</a>
                </div>
            </div>
        </el-header>
        <el-main class="main">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-card class="box-card person-info">
                        <div class="line1">
                            <span class="name">欧阳娜娜</span>
                            <span>(120103123123)</span>
                        </div>
                        <div class="shool">同济大学.哲学学院.伦理学</div>
                        <div class="line2">
                            <span class="name">工程(硕士、博士)</span>
                            <span class="gang">|</span>
                            <span>15930943456</span>
                        </div>
                        <div class="person_btn">
                            <el-button type="primary" size="small" plain>编辑个人资料</el-button>
                            <el-button type="primary" size="small" plain>修改密码</el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card class="box-card box-card-notices">
                        <h3>
                            <span class="bor"></span> 
                            <span>专家评审费</span>
                        </h3>
                        <div class="con">
                            <div class="item">
                                <span>已结算（元）</span>
                                <strong>100</strong>
                            </div>
                            <div class="item">
                                <span>未结算（元）</span>
                                <strong>100</strong>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card class="box-card box-card-pingyue">
                        <h3>
                            <span class="bor"></span>
                            <span>评阅流程</span>
                        </h3>
                        <div class="con">
                            <div class="item">
                                <span>
                                    <svg-icon class="ic" icon-class="tiqu" />
                                    <b>提取论文</b>
                                </span>
                                <el-input size="mini" placeholder="请输入提取码" v-model="ticode">
                                    <el-button @click="handleTiqu" slot="append" size="mini" type="primary">提取</el-button>
                                </el-input>
                            </div>
                            <div class="item">
                                <span>
                                    <svg-icon class="ic" icon-class="py" />评论论文
                                </span>
                                <b>
                                    <em>未评阅</em>
                                    <strong>35</strong>篇
                                </b>
                            </div>
                            <div class="item">
                                <span>
                                    <svg-icon class="ic" icon-class="history" />评论历史
                                </span>
                                <b>
                                    <em>已评阅</em>
                                    <strong>35</strong>篇
                                </b>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <br />
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-card class="box-card liucheng">
                        <h3>待评阅论文</h3>
                        <el-tabs type="card" @tab-click="tabClick">
                            <el-tab-pane label="全部">
                                <item v-for="(it,i) in list" :listItem.sync="it" :key="i" />
                            </el-tab-pane>
                            <el-tab-pane label="未评阅">
                                <item v-for="(it,i) in list" :listItem.sync="it" :key="i" />
                            </el-tab-pane>
                            <el-tab-pane label="已暂存">
                                <item v-for="(it,i) in list" :listItem.sync="it" :key="i" />
                            </el-tab-pane>
                            <el-tab-pane label="评论历史">
                                <item v-for="(it,i) in list" :listItem.sync="it" :key="i" />
                            </el-tab-pane>
                        </el-tabs>
                        <div class="tab_pager">
                        <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>
       
        <tiqu :visibleStatus.sync="showTiquCode" :ticode="ticode" />
    </el-container>
</template>

<script>
import "@/assets/less/home.less";
import tiqu from "@/components/items/tiqu.vue";
import {shuffle} from "@/util";
import item from "@/components/items/item.vue";

export default {
    components: {
        tiqu,
        item
    },
    data() {
        return {
            ticode: "",
            showTiquCode: false,
            pingyueStatus: false,
            activeStep: 0,
            dialogVisible: false,
            list: [
                {status:1},
                {status:2},
                {status:1},
                {status:3},
                {status:2},
                {status:2},
                {status:2},
            ]
        };
    },
    methods: {
        tabClick(tab) {
            // copy 一份
            this.list = JSON.parse(JSON.stringify(shuffle(this.list)));
        },
        handleTiqu() {
            if (!this.ticode) {
                this.$message.error("请输入提取码");
            } else {
                this.showTiquCode = true; 
            }
        },
        
    }
};
</script>

<style lang="less">
</style>
