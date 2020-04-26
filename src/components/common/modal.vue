<template>
    <el-dialog :title="modalTitle" width="50%" :visible.sync="modalShow" class="container">
        <div>用户信息</div>
        <ul class="userInfo">
            <li>用户头像：<el-avatar size="small" :src="user.avatar"></el-avatar></li>
            <li>昵称：{{user.username}}</li>
            <li>小尾巴：{{user.signature}}</li>
            <li>性别：{{user.gender == '0' ? '男':'女' }}</li>
            <li>注册时间：{{user.created | timeFormatter}}</li>
            <li>id：{{user.user_id}}</li>
            <li>账号状态：{{user.status | userFormatter}}</li>
        </ul>
        <div>详情</div>
        <ul class="itemInfo">
            <li v-if="!!item.title">文章标题：{{item.title}}</li>
            <li>发布内容：{{item.content}}</li>
            <li>发布时间：{{item.created | timeFormatter}}</li>
            <li>id：{{item.item_id}}</li>
            <li>状态：{{item.status | itemFormatter}}</li>
            <li v-if="item.images.length > 0">文章图片</li>
        </ul>

        <span slot="footer">
            <el-button type="danger" @click="changeItemStatus('item')">
                {{item.status | statusFormatter}}{{categoryFormatter(item_data.category)}}
            </el-button>
            <el-button type="danger" @click="changeItemStatus('user')">
                {{user.status | statusFormatter}}用户
            </el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { get_common_query, get_common_put } from '@/network/functions.js'
    import { stampFormatter } from '@/common/utils.js'
    
    export default {
        name: "Modal",
        data() {
            return {
                modalShow: false,
                modalTitle: "提示",
                user: {
                    username: "",
                    avatar: "",
                    gender: 0,
                    signature: "",
                    user_id: "",
                    created: 0,
                    status: 0
                },
                item: {
                    item_id: "",
                    title: "",
                    content: "",
                    images: [],
                    status: 0,
                    created: 0
                },
                item_data: {
                    category: 0,
                    item_id: ""
                }
            }
        },
        methods: {
            showModal(item_data) {
                this.item_data = item_data
                this.modalTitle = this.categoryFormatter(item_data.category) + "信息"
                get_common_query(item_data).then(res => {
                    this.user = res.data.user
                    this.item = res.data.item
                    this.modalShow = true
                }).catch(err => {
                    this.$message.error(err.message)
                })
            },
            changeItemStatus(itemName) {
                let item_data = {}
                if (itemName == "user") {
                    item_data.item_id = this.user.user_id
                    item_data.category = "user"
                } else {
                    item_data.item_id = this.item.item_id
                    item_data.category = this.item_data.category
                }
                get_common_put(item_data).then(() => {
                    if (itemName == "user") {
                        this.user.status = 1 - this.user.status
                    } else {
                        this.item.status = 1 - this.item.status
                    }
                    this.$message({
                        type: "success",
                        message: "操作成功"
                    })
                }).catch(err => {
                    this.$message.error(err.message)
                })
            },
            categoryFormatter(value) {
                let res = ""
                switch (value) {
                    case "user":
                        res = "用户"
                        break
                    case "article":
                        res = "文章"
                        break
                    case "comment":
                        res = "评论"
                        break
                    case "sub_comment":
                        res = "楼中楼"
                        break
                    default:
                        res = "未知"
                }
                return res
            }
        },
        filters: {
            timeFormatter(value) {
                return stampFormatter(value, "Y年m月d日")
            },
            userFormatter(value) {
                return value == 0 ? "封禁中":"正常"
            },
            itemFormatter(value) {
                return value == 0 ? "已删除":"正常"
            },
            statusFormatter(value) {
                return value == 0 ? "解封":"封禁"
            }
        }
    }
</script>

<style lang="less" scoped>
.container {
    ul > li {
        margin-top: 10px;
    }
}
</style>