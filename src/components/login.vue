<template>
    <div class="container">
        <div class="login-page">
            <h1 class="login_logo">
                <i class="el-icon-share"></i>
                <span>研究生论文评审系统</span>
            </h1>
            <h2 class="login_title">
                <span @click="loginTab(1)" :class="big">身份证号登录</span>
                <span @click="loginTab(2)" :class="big2">短信登录</span>
            </h2>

            <el-form ref="form" :model="form" label-width="0" v-if="tab==1">
                <el-form-item label prop="username">
                    <el-input v-model="form.username" placeholder="身份证号">
                        <el-button slot="prepend" icon="el-icon-user-solid"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label>
                    <el-input v-model="form.password" type="password" placeholder="请输入密码">
                        <el-button slot="prepend" icon="el-icon-s-release"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item class="vcode" label>
                    <el-input v-model="form.ycode" placeholder="请输入验证码">
                        <el-button slot="prepend" icon="el-icon-picture"></el-button>
                        <img :src="img" slot="append" />
                    </el-input>
                </el-form-item>
                <el-button class="cross" type="primary" icon="el-icon-user-solid" @click="login">登 录</el-button>
            </el-form>

            <el-form ref="form" :model="form" label-width="0" v-if="tab==2">
                <el-form-item label prop="username">
                    <el-input v-model="form.username" placeholder="手机号">
                        <el-button slot="prepend" icon="el-icon-phone"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label>
                    <el-input v-model="form.ycode" placeholder="请输入短信验证码">
                        <el-button slot="prepend" icon="el-icon-picture"></el-button>
                    </el-input>
                </el-form-item>
                <el-button class="cross" type="primary" icon="el-icon-user-solid" @click="login">登 录</el-button>
            </el-form>
        </div>
    </div>
</template>
<script>
var img = require("@/assets/ya.jpg");

export default {
    data() {
        return {
            img,
            tab: 1,
            form: {
                username: "",
                password: "",
                ycode: ""
            }
        };
    },
    methods: {
        login() {},
        loginTab(idx) {
            if (idx == 1) {
                this.tab = 1;
            } else {
                this.tab = 2;
            }
        }
    },
    computed: {
        big() {
            if (this.tab == 1) {
                return "normal big";
            } else {
                return "normal";
            }
        },
        big2() {
            if (this.tab == 2) {
                return "normal big";
            } else {
                return "normal";
            }
        }
    }
};
</script>
<style lang="less">
.container {
    margin-top: 100px;
    width: 100%;
    height: 100%;
    background: #f5f8fa;
}
.login_logo {
    position: absolute;
    height: 50px;
    line-height: 50px;
    background: #409eff;
    color: #fff;
    width: 100%;
    font-size: 22px;
    text-align: left;
    text-indent: 0.3em;
    top: 0;
    left: 0;
}
.vcode {
    .el-input-group__append {
        background: none;
        border: none;
        padding-right: 110px;
        padding-left: 0;
        position: relative;
        img {
            width: 110px;
            height: 40px;
            position: absolute;
            left: 0;
            top: 0;
        }
    }
}
.login_title {
    padding-bottom: 15px;
    text-align: left;
    .normal {
        font-size: 14px;
        color: cornflowerblue;
        &:first-child {
            margin-right: 20px;
        }
        &.big {
            color: #333;
            font-size: 20px;
        }
    }
}
.login-page {
    position: relative;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-radius: 0;
    margin: auto;
    width: 350px;
    height: 300px;
    padding: 65px 55px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
</style>