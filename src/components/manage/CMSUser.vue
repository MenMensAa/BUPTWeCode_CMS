<template>
    <div>
        <el-table border :data="users" :height="620">
            <el-table-column type="index" :index="indexMethod" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="username" label="用户名" width="200"></el-table-column>
            <el-table-column prop="display_name" label="昵称" width="220"></el-table-column>
            <el-table-column prop="desc" label="小尾巴"></el-table-column>
            <el-table-column label="创建时间" width="130">
                <template slot-scope="scope">
                    {{ scope.row.created | timeFormatter }}
                </template>
            </el-table-column>
            <el-table-column label="权限角色" width="140">
                <template slot-scope="scope">
                    {{ scope.row.role | roleFormatter }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="small" :disabled="scope.row.role == 'DEVELOPER'"
                               @click="changeUserRole(scope.row, scope.$index)">修改权限</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <my-pagenator ref="pagenator" :size="size" :background="true"
                      dataName="users" @pageChange="pageChangeHandler"></my-pagenator>
        
        <el-dialog title="收货地址" :visible.sync="dialogVisible">
            <el-form>
                <el-form-item label="权限角色">
                    <el-select v-model="dialogForm.role" placeholder="请选择权限角色">
                        <el-option label="游客" value="VISITOR"></el-option>
                        <el-option label="运营" value="OPERATOR"></el-option>
                        <el-option label="管理员" value="ADMIN"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="commitBtnClick">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { get_cms_user, post_cms_user } from '@/network/functions.js'
    import { stampFormatter } from '@/common/utils.js'
    import Pagenator from '@/components/common/pagenator.vue'

    export default {
        name: "FrontUser",
        updated() {
            if (!this.inited) {
                this.$refs.pagenator.initPagenator(get_cms_user, {})
                this.inited = true
            }
        },
        data() {
            return {
                inited: false,
                dialogVisible: false,
                size: 10,
                curPage: 0,

                dialogForm: {
                    uid: "",
                    role: "VISITOR"
                },

                users: [],
                selectUserIndex: 0
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
            changeUserRole(item, index) {
                this.dialogForm = {
                    uid: item.uid,
                    role: item.role
                }
                this.selectUserIndex = index
                this.dialogVisible = true
            },
            commitBtnClick() {
                this.dialogVisible = false
                if (this.users[this.selectUserIndex].role != this.dialogForm.role) {
                    post_cms_user(this.dialogForm).then(() => {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.users[this.selectUserIndex].role = this.dialogForm.role
                    }).catch(err => {
                        this.$message.error(err.message)
                    })
                } else {
                    this.$message({
                        message: '未修改'
                    })
                }
            }
        },
        filters: {
            timeFormatter(value) {
                return stampFormatter(value, "Y年m月d日")
            },
            roleFormatter(value) {
                let res = "游客"
                switch (value) {
                    case "VISITOR":
                        res = "游客"
                        break
                    case "OPERATOR":
                        res = "运营"
                        break
                    case "ADMIN":
                        res = "管理员"
                        break
                    case "DEVELOPER":
                        res = "开发者"
                        break
                    default:
                        res = "游客"
                }
                return res
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