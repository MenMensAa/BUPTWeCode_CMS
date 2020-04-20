<template>
    <div class="profile">
        <el-row>
            <el-col :span="12" :offset="6">
                <el-card class="container">
                    <el-form ref="profileForm" :model="profileFormData" label-width="80px" :rules="rules">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="用户名">
                                    <el-input :placeholder="userInfo.username" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <div class="input-desc"> * 用户名是您登陆的唯一凭据，无法修改</div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="当前权限">
                                    <el-input :placeholder="permission" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <div class="input-desc"> * 修改权限请联系相关管理员</div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="创建时间">
                                    <el-input :placeholder="created" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <div class="input-desc"> * 当前账户创建的时间</div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="昵称" prop="display_name">
                                    <el-input v-model="profileFormData.display_name" placeholder="昵称长度必须小于等于8个字符"
                                              type="text" maxlength="8" show-word-limit></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <div class="input-desc"> * 起一个好听的昵称用于标示你自己吧</div>
                            </el-col>
                        </el-row>
                        
                        <el-form-item label="简介" prop="desc">
                            <el-input v-model="profileFormData.desc" placeholder="来一句话说明你是谁吧~"
                                      type="textarea" maxlength="100" show-word-limit
                                      :autosize="{ minRows: 3 }"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="formButtonHandler" :loading="buttonLoading">确认修改</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { stampFormatter } from '@/common/utils.js'
    import { codes } from '@/common/cnst.js'
    
    export default {
        name: 'Profile',
        mounted() {
            this.profileFormData.display_name = this.userInfo.display_name
            this.profileFormData.desc = this.userInfo.desc
        },
        data() {
            var checkDisplayName = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error("昵称不能为空"))
                }
                if (value.length > 8) {
                    return callback(new Error("昵称长度不得大于 8"))
                }
                this.$store.dispatch({
                    type: 'updateUserInfo',
                    profileFormData: this.profileFormData
                }).then(res => {
                    return callback()
                }).catch(err => {
                    return callback(new Error(res.message))
                    // this.$alert('网络超时，请稍后尝试登陆', '提示', {
                    //     confirmButtonText: 'Fuck!',
                    // })
                })
            }
            return {
                rules: {
                    display_name: [
                        { validator: checkDisplayName, trigger: 'none' },
                    ],
                    desc: [
                        { min: 0, max: 100, message: "简介长度不得长于 100" }
                    ]
                },
                profileFormData: {
                    display_name: "",
                    desc: "",
                },
                buttonLoading: false
            }
        },
        methods: {
            formButtonHandler() {
                this.buttonLoading = true
                this.$refs.profileForm.validate((valid) => {
                    if (valid) {
                        this.$alert('个人资料设置成功!', '提示', {
                            confirmButtonText: '哦(冷漠)',
                        })
                    }
                    this.buttonLoading = false
                })
            }
        },
        computed: {
            userInfo() {
                return this.$store.getters.userInfo
            },
            permission() {
                return this.$store.getters.permission
            },
            created() {
                return stampFormatter(this.userInfo.created, "Y年m月d日 H时i分s秒")
            }
        }
    }
</script>

<style scoped lang="less">
.container {
    margin-top: 50px;
    padding-top: 20px;
    .input-desc {
        height: 40px;
        padding-left: 10px;
        font-size: 12px;
        line-height: 40px;
    }
}
</style>
