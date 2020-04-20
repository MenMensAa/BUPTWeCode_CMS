<template>
    <div class="nav-bar">
        <el-menu :default-active="activeIndex" mode="horizontal" :router="true" v-if="hasToken">
            <el-menu-item index="/">
                <template slot="title">
                    <i class="el-icon-house"></i>
                    <span>首页</span>
                </template>
            </el-menu-item>
            <el-menu-item index="/manage">
                <template slot="title">
                    <i class="el-icon-coin"></i>
                    <span>管理</span>
                </template>
            </el-menu-item>
            <el-menu-item index="/block">
                <template slot="title">
                    <i class="el-icon-circle-close"></i>
                    <span>小黑屋</span>
                </template>
            </el-menu-item>
            <el-menu-item index="/about">
                <template slot="title">
                    <i class="el-icon-paperclip"></i>
                    <span>关于</span>
                </template>
            </el-menu-item>
            <el-submenu index="/me">
                <template slot="title">
                    <i class="el-icon-user"></i>
                    <span>{{userName}}</span>
                </template>
                <el-menu-item index="/profile">
                    <template slot="title">
                        <i class="el-icon-user"></i>
                        <span>我的资料</span>
                    </template>
                </el-menu-item>
                <el-menu-item @click="signOutBtnHandler">
                    <template slot="title">
                        <i class="el-icon-switch-button"></i>
                        <span>注销</span>
                    </template>
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: 'NavBar',
        data() {
            return {
                activeIndex: '/'
            }
        },
        methods: {
            signOutBtnHandler() {
                this.$confirm('是否登出当前账户？', '提示', {
                    confirmButtonText: 'GKD',
                    cancelButtonText: '我手滑了',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch({
                        type: 'clearAuth'
                    }).then(() => {
                        this.$router.push({ path: '/login' })
                        this.$message({
                            type: 'success',
                            message: '注销成功'
                        })
                    }).catch(err => {
                        if (this.$store.getters.debug) {
                            console.log('navBar signOutBtnHandler', err)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '原谅你手滑一次'
                    })
                })
                
            }
        },
        computed: {
            hasToken() {
                return this.$store.getters.hasToken
            },
            userName() {
                const userInfo = this.$store.getters.userInfo
                return userInfo.display_name || userInfo.username || "没有名字"
            }
        }
    }
</script>

<style scoped lang="less">
.el-menu {
    .el-menu-item {
        padding: 0 45px;
        margin: 0 5px;
    }
    .el-submenu {
        float: right;
    }
}
</style>
