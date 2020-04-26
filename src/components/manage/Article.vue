<template>
    <div>
        <el-button class="add-board" type="danger" plain @click="addDeleteArticle">封禁帖子</el-button>
        
        <el-table border :data="articles" :height="620">
            <el-table-column type="index" :index="indexMethod" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="title" label="帖子标题"></el-table-column>
            <el-table-column prop="article_id" label="文章id" width="220"></el-table-column>
            <el-table-column label="内容" width="80">
                <template slot-scope="scope">
                    <el-popover
                      placement="top"
                      width="150"
                      trigger="click">
                      <span>{{scope.row.content}}</span>
                      <el-button slot="reference" size="small">查看</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="所属板块" width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.board.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="作者" width="120">
                <template slot-scope="scope">
                    <el-popover
                      placement="top"
                      width="150"
                      trigger="hover">
                      <el-row type="flex" justify="center">
                          <el-col :span="12">
                              <el-image :src="scope.row.author.avatar" fit="fill"></el-image>
                              <!-- <el-avatar :src="scope.row.author.avatar"></el-avatar> -->
                          </el-col>
                      </el-row>
                      <el-button slot="reference" size="small">{{scope.row.author.username}}</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="created" label="创建时间" width="130">
                <template slot-scope="scope">
                    {{ scope.row.created | timeFormatter }}
                </template>
            </el-table-column>
            <el-table-column prop="views" label="浏览量" width="80"></el-table-column>
            <el-table-column prop="likes" label="点赞量" width="80"></el-table-column>
            <el-table-column prop="comments" label="评论数" width="80"></el-table-column>
            <el-table-column label="操作" width="95">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteArticleHandler(scope.row, scope.$index)">封禁</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <my-pagenator ref="pagenator" :size="size" :background="true"
                      dataName="articles" @pageChange="pageChangeHandler"></my-pagenator>
    </div>
</template>

<script>
    import { get_article, post_article } from '@/network/functions.js'
    import { stampFormatter } from '@/common/utils.js'
    import Pagenator from '@/components/common/pagenator.vue'

    export default {
        name: "Article",
        updated() {
            if (!this.inited) {
                this.$refs.pagenator.initPagenator(get_article, {})
                this.inited = true
            }
        },
        data() {
            return {
                inited: false,
                size: 10,
                curPage: 0,

                articles: []
            }
        },
        methods: {
            pageChangeHandler(val, page) {
                this.articles = val
                this.curPage = page
            },
            indexMethod(index) {
                return (this.curPage - 1) * this.size + index + 1
            },
            addDeleteArticle() {
                this.$prompt('请输入文章id', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[0-9a-zA-Z]{22}$/,
                    inputErrorMessage: '文章id格式不正确'
                }).then(({ value }) => {
                    post_article({
                        mode: "add",
                        article_id: value
                    }).then(() => {
                        this.$message({
                            message: '删除帖子成功，请到小黑屋中查看',
                            type: 'success'
                        });
                        this.$refs.pagenator.commitData()
                    }).catch(err => {
                        this.$message.error(err.message);
                    })
                }).catch(() => {});
            },
            deleteArticleHandler(item) {
                this.$confirm('是否删除该帖子？', '提示', {
                    confirmButtonText: '干他',
                    cancelButtonText: '我手滑了',
                    type: 'warning'
                }).then(() => {
                    post_article({
                        article_id: item.article_id,
                        mode: "add"
                    }).then(() => {
                        this.$message({
                            message: '删除帖子成功，请到小黑屋中查看',
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
.add-board {
    margin-bottom: 10px;
}
.popconfirm-button {
    margin-right: 10px;
}
</style>