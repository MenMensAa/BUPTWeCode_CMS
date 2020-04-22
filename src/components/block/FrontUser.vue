<template>
    <div>
        <el-button class="add-board" type="primary" plain @click="addBlockUser">解封用户</el-button>
        
        <el-table border :data="users" :height="620">
            <el-table-column type="index" :index="indexMethod" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="username" label="用户名称" width="200"></el-table-column>
            <el-table-column prop="uid" label="用户id" width="220"></el-table-column>
            <el-table-column prop="signature" label="小尾巴"></el-table-column>
            <el-table-column label="用户头像" width="80">
                <template slot-scope="scope">
                    <el-popover
                      placement="top"
                      width="150"
                      trigger="click">
                      <el-row type="flex" justify="center">
                          <el-col :span="12">
                              <el-image :src="scope.row.avatar" fit="fill"></el-image>
                          </el-col>
                      </el-row>
                      <el-button slot="reference" size="small">查看</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="created" label="创建时间" width="130">
                <template slot-scope="scope">
                    {{ scope.row.created | timeFormatter }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="95">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-delete" size="small" @click="blockUserHandler(scope.row, scope.$index)">解封</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <my-pagenator ref="pagenator" :size="size" :background="true"
                      dataName="users" @pageChange="pageChangeHandler"></my-pagenator>
    </div>
</template>

<script>
import { get_front_user, post_front_user } from '@/network/functions.js'
import { stampFormatter } from '@/common/utils.js'
import Pagenator from '@/components/common/pagenator.vue'

export default {
    name: "FrontUser",
    updated() {
        if (!this.inited) {
            this.$refs.pagenator.initPagenator(get_front_user, { status: 0 })
            this.inited = true
        }
    },
    data() {
        return {
            inited: false,
            size: 10,
            curPage: 0,

            users: []
        }
    },
    methods: {
        pageChangeHandler(val, page) {
            this.users = val
            this.curPage = page
        },
        indexMethod(index) {
            return (this.curPage - 1) * this.size + index + 1
        },
        addBlockUser() {
            this.$prompt('请输入用户id', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[0-9a-zA-Z]{22}$/,
                inputErrorMessage: '用户id格式不正确'
            }).then(({ value }) => {
                post_front_user({
                    mode: "sub",
                    uid: value
                }).then(() => {
                    this.$message({
                        message: '解封用户成功',
                        type: 'success'
                    });
                    this.$refs.pagenator.commitData()
                }).catch(err => {
                    this.$message.error(err.message);
                })
            }).catch(() => {});
        },
        blockUserHandler(item) {
            this.$confirm('是否解封该用户？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                post_front_user({
                    uid: item.uid,
                    mode: "sub"
                }).then(() => {
                    this.$message({
                        message: '解封用户成功',
                        type: 'success'
                    });
                    this.$refs.pagenator.commitData()
                }).catch(err => {
                    this.$message.error(err.message);
                })
            }).catch(() => {})
        }
    },
    filters: {
        timeFormatter(value) {
            return stampFormatter(value, "Y年m月d日")
        },
    }
}
</script>

<style>

</style>