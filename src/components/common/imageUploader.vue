<template>
    <el-upload
        action="https://up-z1.qiniup.com"
        :on-success="successHandler"
        :on-error="errorHandler"
        :before-upload="beforeUploadHandler"
        :data="postData"
        :limit="1"
        :show-file-list="true"
        ref="uploader">
        <!-- <el-button size="small" type="primary">点击上传</el-button> -->
        <el-row class="upload-image">
            <el-col>
                <el-image v-if="!!imageUrl" class="upload-avatar"
                          :src="imageUrl" fit="cover"></el-image>
                <i v-else class="upload-image-icon el-icon-plus"></i>
            </el-col>
        </el-row>
    </el-upload>
</template>

<script>
    import { get_imageUploader } from '@/network/functions.js'
    
    export default {
        name: "imageUploader",
        mounted() {
            this.getNewToken()
        },
        props: {
            imageUrl: String
        },
        data() {
            return {
                postData: {
                    token: "",
                    key: ""
                },
            }
        },
        methods: {
            getNewToken() {
                get_imageUploader().then(res => {
                    this.postData.token = res.data.uptoken
                }).catch(err => {
                    if (this.$store.getters.debug) {
                        console.log(err)
                    }
                })
            },
            successHandler(response, file, fileList) {
                this.$emit("update:imageUrl", 'http://image.buptwecode.com/' + response.key)
                setTimeout(() => {
                    this.$refs.uploader.clearFiles()
                }, 2000)
                
            },
            errorHandler(err, file, fileList) {
                console.log(err)
                this.$message.error("上传图片过程中发生错误，请稍后重试")
                this.getNewToken()
            },
            beforeUploadHandler(file) {
                const isJPG = file.type === 'image/jpeg'
                const isPNG = file.type === 'image/png'
                const isLt10M = file.size / 1024 / 1024 < 10
                if (!isJPG && !isPNG) {
                    this.$message.error('图片格式只能为 JPG 格式或者 PNG 格式')
                    return false
                }
                if (!isLt10M) {
                    this.$message.error('图片大小不能超过 10MB')
                    return false
                }
                // let filename = file.name + Date.parse(new Date())
                // if (isJPG) {
                //     filename += '.jpg'
                // } else if (isPNG) {
                //     filename += '.png'
                // }
                this.postData.key = Date.parse(new Date()) + file.name
                return true
            },
        }
    }
</script>

<style>
.upload-image {
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.upload-image:hover {
    border-color: #409EFF;
}
.upload-image-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
}
.upload-avatar {
    width: 148px;
    height: 148px;
    display: block;
}
</style>
