<template>
    <div>
        <el-table border :data="feedbacks" :height="620">
            <el-table-column type="index" :index="indexMethod" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="反馈者" width="200">
                <template slot-scope="scope">
                    {{scope.row.user.username}}
                </template>
            </el-table-column>
            <el-table-column label="用户id" width="220">
                <template slot-scope="scope">
                    {{scope.row.user.user_id}}
                </template>
            </el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column label="用户头像" width="80">
                <template slot-scope="scope">
                    <el-popover
                      placement="top"
                      width="150"
                      trigger="click">
                      <el-row type="flex" justify="center">
                          <el-col :span="12">
                              <el-image :src="scope.row.user.avatar" fit="fill"></el-image>
                          </el-col>
                      </el-row>
                      <el-button slot="reference" size="small">查看</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="反馈内容" width="80">
                <template slot-scope="scope">
                    <el-popover
                      placement="top"
                      width="150"
                      trigger="click">
                      {{scope.row.content}}
                      <el-button slot="reference" size="small">查看</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="created" label="创建时间" width="130">
                <template slot-scope="scope">
                    {{ scope.row.created | timeFormatter }}
                </template>
            </el-table-column>
            <el-table-column label="状态" width="95">
                <template slot-scope="scope">
                    {{ scope.row.status | statusFormatter }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="95">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-plus" size="small" 
                                @click="replyFeedback(scope.row)">回复</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <my-pagenator ref="pagenator" :size="size" :background="true"
                      dataName="feedbacks" @pageChange="pageChangeHandler"></my-pagenator>
    </div>
</template>

<script>
import { get_feedback, post_feedback } from '@/network/functions.js'
import { stampFormatter } from '@/common/utils.js'
import Pagenator from '@/components/common/pagenator.vue'

export default {
    name: "FrontUser",
    updated() {
        if (!this.inited) {
            this.$refs.pagenator.initPagenator(get_feedback, {})
            this.inited = true
        }
    },
    data() {
        return {
            inited: false,
            size: 10,
            curPage: 0,

            feedbacks: [],
            replyForm: {
                feedback_id: "",
                content: ""
            }
        }
    },
    methods: {
        pageChangeHandler(val, page) {
            this.feedbacks = val
            this.curPage = page
        },
        indexMethod(index) {
            return (this.curPage - 1) * this.size + index + 1
        },
        replyFeedback(feedback) {
            this.replyForm.feedback_id = feedback.feedback_id
            this.$prompt('请输入回复内容', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^\w+$/,
                inputErrorMessage: '内容不能为空'
            }).then(({ value }) => {
                this.replyForm.content = value
                post_feedback(this.replyForm).then(() => {
                    this.$message({
                        message: '回复成功',
                        type: 'success'
                    });
                    this.$refs.pagenator.commitData()
                }).catch(err => {
                    this.$message.error(err.message);
                })
            }).catch(() => {});
        },
    },
    filters: {
        timeFormatter(value) {
            return stampFormatter(value, "Y年m月d日")
        },
        statusFormatter(value) {
            return value == 0 ? "已处理":"未处理"
        }
    }
}
</script>

<style>

</style>