<template>
    <div class="manage">
        <el-tabs type="border-card">
            <el-tab-pane label="评论管理" :disabled="hasPermission(permission.COMMENTER)">
                评论管理
            </el-tab-pane>
            <el-tab-pane label="帖子管理" :disabled="hasPermission(permission.POSTER)">
                帖子管理
            </el-tab-pane>
            <el-tab-pane label="前端用户管理" :disabled="hasPermission(permission.FRONTUSER)">
                前端用户管理
            </el-tab-pane>
            <el-tab-pane label="板块管理" :disabled="hasPermission(permission.BOADER)">
                <manage-board></manage-board>
            </el-tab-pane>
            <el-tab-pane label="运营管理"  :disabled="hasPermission(permission.CMSUSER)">
                <manage-operator></manage-operator>
            </el-tab-pane>
            <el-tab-pane label="CMS用户管理" :disabled="hasPermission(permission.ROOTER)">
                CMS用户管理
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import { permission } from '@/common/cnst.js'
    import Board from '@/components/manage/Board.vue'
    import Operator from '@/components/manage/Operator.vue'
    
    export default {
        name: 'Manage',
        components: {
            'manage-board': Board,
            'manage-operator': Operator
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
