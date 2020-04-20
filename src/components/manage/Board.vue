<template>
    <div class="manage-board">
        <el-button class="add-board" type="primary" plain @click="addBoardHandler">添加板块</el-button>
        
        <el-table border :data="boardList" :height="620">
            <el-table-column type="index" :index="indexMethod" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="板块名称" width="200"></el-table-column>
            <el-table-column prop="desc" label="板块描述"></el-table-column>
            <el-table-column label="板块头像" width="80">
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
            <el-table-column prop="articles" label="帖子数量" width="80"></el-table-column>
            <el-table-column prop="created" label="创建时间" width="130">
                <template slot-scope="scope">
                    {{ scope.row.created | timeFormatter }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="small" @click="editBoardHandler(scope.row, scope.$index)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteBoardHandler(scope.row, scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <my-pagenator ref="pagenator" :size="size" :background="true"
                      dataName="boards" @pageChange="pageChangeHandler"></my-pagenator>
        
        <el-dialog :title="formTitle" :visible.sync="formVisible" :before-close="beforeCloseHandler">
            <el-form :model="formData" label-width="80px" ref="form" :rules="rules">
                <el-form-item label="板块名称" required prop="name">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="板块描述" required prop="desc">
                    <el-input v-model="formData.desc"></el-input>
                </el-form-item>
                <el-form-item label="板块头像" required prop="avatar">
                    <el-input v-model="formData.avatar"></el-input>
                    <image-uploader :imageUrl.sync="formData.avatar"></image-uploader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-popover
                    placement="bottom"
                    width="200"
                    v-model="popVisible"
                    trigger="manual">
                    <p style="color: red; text-align: center; margin-bottom: 10px;"><i class="el-icon-info">警告</i></p>
                    <p style="text-align: center; margin-bottom: 10px;">退出后将无法保存当前修改</p>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="popVisible = false">手滑了</el-button>
                        <el-button type="primary" size="mini" @click="popVisible = false;formVisible = false">确定</el-button>
                    </div>
                        <el-button slot="reference" size="small" style="margin-right: 10px;" @click="popVisible = !popVisible">取消</el-button>
                </el-popover>
                <el-button type="primary" @click="CommitHandler" size="small">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { get_board_board, post_board_board } from '@/network/functions.js'
    import { stampFormatter } from '@/common/utils.js'
    
    export default {
        name: 'Board',
        updated() {
            if (!this.inited) {
                this.$refs.pagenator.initPagenator(get_board_board, {})
                this.inited = true
            }
        },
        data() {
            return {
                boardList: [],
                formData: {
                    board_id: 0,
                    name: "",
                    desc: "",
                    avatar: "",
                    status: 1
                },
                formVisible: false,
                popVisible: false,
                formTitle: "",
                activeBoardIndex: 0,
                rules: {
                    name: [{ required: true, message: "请输入板块名称", trigger: 'blur' }],
                    desc: [{ required: true, message: "请输入板块描述", trigger: 'blur' }],
                    avatar: [{ required: true, message: "请上传板块头像", trigger: "blur" }]
                },
                curPage: 1,
                size: 10,
                inited: false
            }
        },
        methods: {
            beforeCloseHandler() {
                this.popVisible = !this.popVisible
            },
            pageChangeHandler(val, page) {
                this.boardList = val
                this.curPage = page
            },
            indexMethod(index) {
                return (this.curPage - 1) * this.size + index + 1
            },
            addBoardHandler() {
                this.formData = {
                    board_id: 0,
                    name: "",
                    desc: "",
                    avatar: "",
                    status: 1
                }
                this.formTitle = "添加板块"
                this.formVisible = true
            },
            editBoardHandler(row, index) {
                this.formData = {
                    board_id: row.board_id,
                    name: row.name,
                    desc: row.desc,
                    avatar: row.avatar,
                    status: 1
                }
                this.activeBoardIndex = index
                this.formTitle = "编辑板块"
                this.formVisible = true
            },
            CommitHandler() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.formVisible = false
                        // console.log(this.formData)
                        post_board_board(this.formData).then(res => {
                            let board = this.formData
                            if (this.formTitle == "编辑板块") {
                                this.$set(this.boardList, this.activeBoardIndex, board)
                            } else {
                                this.boardList.push(board)
                            }
                            this.$message({
                                type: 'success',
                                message: '板块提交成功'
                            })
                            this.$refs.pagenator.commitData()
                        }).catch(err => {
                            this.$message.error("发生错误: " + err.message)
                            if (this.$store.getters.debug) {
                                console.log("board CommitHandler", err)
                            }
                        })
                    } else {
                        return false
                    }
                })
            },
            deleteBoardHandler(row, index) {
                this.activeBoardIndex = index
                this.$confirm('是否将该板块移至小黑屋?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    post_board_board({
                        board_id: row.board_id,
                        name: row.name,
                        desc: row.desc,
                        avatar: row.avatar,
                        status: 0
                    }).then(res => {
                        this.boardList.splice(this.activeBoardIndex, 1)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.$refs.pagenator.deleteData()
                    }).catch(err => {
                        this.$message.error("发生错误: " + res.message)
                        if (this.$store.getters.debug) {
                            console.log("board deleteBoardHandler", err)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
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
.add-board {
    margin-bottom: 10px;
}
.popconfirm-button {
    margin-right: 10px;
}
</style>
