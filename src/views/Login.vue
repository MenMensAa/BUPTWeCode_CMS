<template>
    <div class='login'>
        <el-row class="login-top">
            <el-col :span="6" :offset="9" class="center-content">
                <p>登陆到BUPTWeCode管理平台</p>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6" :offset="9">
                <el-form :model="loginFormData" :rules="rules" ref="loginForm">
                    <el-form-item prop="username">
                       <el-row>
                            <el-col :span="22">
                                <el-input placeholder="请输入账号" v-model="loginFormData.username" clearable></el-input>
                           </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-row>
                            <el-col :span="22">
                                <el-input class="inp" placeholder="请输入密码" v-model="loginFormData.password" show-password clearable></el-input>
                            </el-col>
                            <el-col :span="1" :offset="1">
                                <el-button circle plain icon="el-icon-back" native-type="submit"
                                           @click="signInButtonHandler" :loading="buttonLoading"></el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item prop="remenber" class="center-content">
                        <el-checkbox v-model="loginFormData.remember">记住我</el-checkbox>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { codes } from '@/common/cnst.js'
    
    export default {
        name: "Login",
        data() {
            var checkUsername = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请输入用户名"))
                } else {
                    callback()
                }
            }
            var checkPassword = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请输入密码"))
                } else {
                    if (this.loginFormData.username !== "") {
                        this.$store.dispatch({
                            type: 'setAuth',
                            loginFormData: this.loginFormData,
                            rememberMe: this.rememberMe
                        }).then(res => {
                            this.$router.push({name: "home"})
                            callback()
                        }).catch(err => {
                            if (this.$store.getters.debug) {
                                console.log(err)
                            }
                            callback(new Error(err.message))
                        })
                    } else {
                        callback()
                    }
                }
            }
            return {
                loginFormData: {
                    username: '',
                    password: '',
                    remember: false
                },
                rules: {
                    username: [
                        { validator: checkUsername }
                    ],
                    password: [
                        { validator: checkPassword, trigger: 'none' }
                    ]
                },
                rememberMe: false,
                buttonLoading: false,
            }
        },
        methods: {
            signInButtonHandler() {
                this.buttonLoading = true
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.$alert('登陆成功!', '提示', {
                            confirmButtonText: '哦(冷漠)',
                        })
                    }
                    this.buttonLoading = false
                })
            },
        },
    }
</script>

<style scoped>
.center-content {
    text-align: center;
}
.login-top {
    margin-top: 100px;
}
</style>
