<template>
    <div>
        <el-table border :data="reports" :height="620">
            <el-table-column type="index" :index="indexMethod" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="反馈者" width="200">
                <template slot-scope="scope">
                    {{scope.row.reporter.username}}
                </template>
            </el-table-column>
            <el-table-column label="用户id" width="220">
                <template slot-scope="scope">
                    {{scope.row.reporter.uid}}
                </template>
            </el-table-column>
            <el-table-column label="举报类型" width="95">
                <template slot-scope="scope">
                    {{ scope.row.category | categoryFormatter }}
                </template>
            </el-table-column>
            <el-table-column prop="reason" label="举报理由"></el-table-column>
            <el-table-column label="用户头像" width="80">
                <template slot-scope="scope">
                    <el-popover
                      placement="top"
                      width="150"
                      trigger="click">
                      <el-row type="flex" justify="center">
                          <el-col :span="12">
                              <el-image :src="scope.row.reporter.avatar" fit="fill"></el-image>
                          </el-col>
                      </el-row>
                      <el-button slot="reference" size="small">查看</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="反馈内容" width="80">
                <template slot-scope="scope">
                    <el-button slot="reference" size="small" @click="viewReport(scope.row)">查看</el-button>
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
                    <el-button type="primary" size="small" 
                                @click="replyFeedback(scope.row)">{{scope.row.status == 0  ? '已标记':'未标记'}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <my-pagenator ref="pagenator" :size="size" :background="true"
                      dataName="reports" @pageChange="pageChangeHandler"></my-pagenator>
    </div>
</template>

<script>
    import { get_report, post_report } from '@/network/functions.js'
    import { stampFormatter } from '@/common/utils.js'
    import Pagenator from '@/components/common/pagenator.vue'

    export default {
        name: "Report",
        updated() {
            if (!this.inited) {
                this.$refs.pagenator.initPagenator(get_report, {})
                this.inited = true
            }
        },
        data() {
            return {
                inited: false,
                size: 10,
                curPage: 0,

                reports: [],
                replyForm: {
                    report_id: "",
                    content: ""
                },
            }
        },
        methods: {
            pageChangeHandler(val, page) {
                this.reports = val
                this.curPage = page
            },
            indexMethod(index) {
                return (this.curPage - 1) * this.size + index + 1
            },
            viewReport(item) {
                let item_data = {
                    item_id: item.link_id,
                    category: item.category
                }
                this.$emit("modal", item_data)
            },
            replyFeedback(report) {
                post_report({
                    report_id: report.report_id
                }).then(() => {
                    this.$message({
                        type: "success",
                        message: "标记成功"
                    })
                    report.status = 0
                }).catch(err => {
                    this.$message.error(err.message)
                })
            },
        },
        filters: {
            timeFormatter(value) {
                return stampFormatter(value, "Y年m月d日")
            },
            statusFormatter(value) {
                return value == 0 ? "已处理":"未处理"
            },
            categoryFormatter(value) {
                let res = "";
                switch (value) {
                    case "user":
                        res = "用户举报"
                        break
                    case "article":
                        res = "帖子举报"
                        break
                    case "comment":
                        res = "评论举报"
                        break
                    case "sub_comment":
                        res = "楼中楼举报"
                        break
                    default:
                        res = "未知"
                }
                return res
            }
        }
    }
</script>

<style>

</style>