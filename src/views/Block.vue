<template>
    <div>
        <el-tabs type="border-card">
            <el-tab-pane label="删帖恢复" :disabled="hasPermission(permission.POSTER)">
                <block-article></block-article>
            </el-tab-pane>
            <el-tab-pane label="小黑屋" :disabled="hasPermission(permission.FRONTUSER)">
                <block-front-user></block-front-user>
            </el-tab-pane>
            <el-tab-pane label="举报信息"  :disabled="hasPermission(permission.FRONTUSER)">
                举报信息
            </el-tab-pane>
            <el-tab-pane label="用户反馈" :disabled="hasPermission(permission.FRONTUSER)">
                <block-feedback></block-feedback>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import { permission } from '@/common/cnst.js'
    import Article from '@/components/block/Article.vue'
    import FrontUser from '@/components/block/FrontUser.vue'
    import Feedback from '@/components/block/Feedback.vue'
    
    export default {
        name: 'Manage',
        components: {
            'block-article': Article,
            'block-front-user': FrontUser,
            "block-feedback": Feedback
        },
        data() {
            return {
                permission: permission
            }
        },
        methods: {
            hasPermission(perm) {
                return !(perm == (this.$store.getters.permission & perm))
            }
        }
    }
</script>

<style scoped lang="less">
.el-tabs {
    margin-top: 10px;
}
</style>
