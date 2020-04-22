<template>
    <div>
        <el-tabs type="border-card">
            <el-tab-pane label="帖子管理" :disabled="hasPermission(permission.POSTER)">
                <manage-article></manage-article>
            </el-tab-pane>
            <el-tab-pane label="前端用户管理" :disabled="hasPermission(permission.FRONTUSER)">
                <manage-front-user></manage-front-user>
            </el-tab-pane>
            <el-tab-pane label="板块管理" :disabled="hasPermission(permission.BOADER)">
                <manage-board></manage-board>
            </el-tab-pane>
            <el-tab-pane label="运营管理"  :disabled="hasPermission(permission.CMSUSER)">
                <manage-operator></manage-operator>
            </el-tab-pane>
            <el-tab-pane label="CMS用户管理" :disabled="hasPermission(permission.ROOTER)">
                <manage-cms-user></manage-cms-user>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import { permission } from '@/common/cnst.js'
    import Board from '@/components/manage/Board.vue'
    import Operator from '@/components/manage/Operator.vue'
    import FrontUser from '@/components/manage/FrontUser.vue'
    import Article from '@/components/manage/Article.vue'
    import CMSUser from '@/components/manage/CMSUser.vue'
    
    export default {
        name: 'Manage',
        components: {
            'manage-board': Board,
            'manage-operator': Operator,
            'manage-front-user': FrontUser,
            'manage-article': Article,
            'manage-cms-user': CMSUser
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
