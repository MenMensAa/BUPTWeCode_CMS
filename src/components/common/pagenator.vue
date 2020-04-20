<template>
    <el-pagination
          @current-change="pageChangeHandler"
          :current-page.sync="currentPage"
          :page-size="size"
          layout="prev, pager, next, jumper"
          :total="this.total"
          :small="small"
          :background="background">
    </el-pagination>
</template>

<script>
    export default {
        name: "Pagenator",
        props: {
            size: Number,
            dataName: String,
            background: {
                type: Boolean,
                default() {
                    return false
                }
            },
            small: {
                type: Boolean,
                default() {
                    return false
                }
            },
            dynamic: {
                type: Boolean,
                default() {
                    return true
                }
            }
        },
        data() {
            return {
                total: 0,
                currentPage: 1,
                queryFunction: null,
                queryString: {},
                currentData: [],
                datas: {},
            }
        },
        methods: {
            initPagenator(func, queryString) {
                this.queryFunction = func
                this.queryString = queryString
                this.queryData()
            },
            pageChangeHandler() {
                if (this.dynamic) {
                    this.queryData()
                } else {
                    if (!!!this.datas[this.currentPage]) {
                        this.queryData()
                    } else {
                        this.emitData()
                    }
                }
            },
            queryData() {
                this.queryFunction(this.axiosData).then(res => {
                    this.total = res.data.total
                    // console.log(res)
                    if (this.dynamic) {
                        this.currentData = res.data[this.dataName]
                    } else {
                        this.$set(this.datas, this.currentPage, res.data[this.dataName])
                    }
                    this.emitData()
                }).catch(err => {
                    if (this.$store.getters.debug) {
                        console.log("pagenator", err)
                    }
                })
            },
            commitData() {
                if (this.dynamic) {
                    this.queryData()
                }
            },
            deleteData() {
                if (this.dynamic) {
                    if (this.currentData.length <= 1) {
                        this.refreshData()
                    } else {
                        this.commitData()
                    }
                }
            },
            refreshData() {
                this.currentPage = 1
                this.queryData()
            },
            emitData() {
                if (this.dynamic) {
                    this.$emit("pageChange", this.currentData, this.currentPage)
                } else {
                    this.$emit("pageChange", this.datas[this.currentPage], this.currentPage)
                }
            }
        },
        computed: {
            axiosData() {
                return {
                    limit: this.size,
                    offset: this.size * (this.currentPage - 1),
                    ...this.queryString
                }
            },
        },
    }
</script>

<style>
.el-pagination {
    margin-top: 20px;
    text-align: center;
}
</style>
