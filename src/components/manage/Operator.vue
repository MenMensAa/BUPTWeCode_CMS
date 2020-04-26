<template>
    <div>
        <el-button class="add-board" type="primary" plain @click="addOperatorHandler">添加运营</el-button>
        
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
            <el-table-column prop="status" label="账号状态" width="80">
                <template slot-scope="scope">
                    {{ scope.row.status | statusFormatter }}
                </template>
            </el-table-column>
            <el-table-column prop="created" label="创建时间" width="130">
                <template slot-scope="scope">
                    {{ scope.row.created | timeFormatter }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="95">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteOperator(scope.row, scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <my-pagenator ref="pagenator" :size="size" :background="true"
                      dataName="users" @pageChange="pageChangeHandler"></my-pagenator>
    </div>
</template>

<script>
    import { get_operator, post_operator } from '@/network/functions.js'
    import { stampFormatter } from '@/common/utils.js'
    import Pagenator from '@/components/common/pagenator.vue'

    export default {
        name: "Operator",
        updated() {
            if (!this.inited) {
                this.$refs.pagenator.initPagenator(get_operator, {})
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
            addOperatorHandler() {
                this.$prompt('请输入用户id', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[0-9a-zA-Z]{22}$/,
                    inputErrorMessage: '用户id格式不正确'
                }).then(({ value }) => {
                    post_operator({
                        mode: "add",
                        uid: value
                    }).then(() => {
                        this.$message({
                            message: '添加用户成功',
                            type: 'success'
                        });
                        this.$refs.pagenator.commitData()
                    }).catch(err => {
                        this.$message.error(err.message);
                    })
                }).catch(() => {});
            },
            deleteOperator(item) {
                this.$confirm('是否删除该用户的管理权限？', '提示', {
                        confirmButtonText: '干他',
                        cancelButtonText: '我手滑了',
                        type: 'warning'
                    }).then(() => {
                        post_operator({
                            uid: item.uid,
                            mode: "sub"
                        }).then(() => {
                            this.$message({
                                message: '删除成功',
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
            statusFormatter(value) {
                return value == 1 ? '正常':'封禁中'
            }
        }
    }
</script>

<style>
.add-board {
    margin-bottom: 10px;
}
.popconfirm-button {
    margin-right: 10px;
}
</style>