<template>
    <div class="blogSharing">
        <br>
        <h1>博文分享</h1>
        <br>
        <Form :model="form" ref="formInline" :label-width="100" style="margin-bottom: 30px; width: 50%">
            <FormItem prop="date" label="日期">
                <DatePicker
                    type="date"
                    size="large"
                    v-model="form.date2"
                    format="yyyy-MM-dd"
                    placeholder="选择日期"
                    @on-change="changeDate"
                    style="width: 200px; z-index: 999"
                ></DatePicker>
            </FormItem>
            <FormItem prop="title" label="博文标题">
                <Input v-model="form.title" placeholder="博文标题" size="large" />
            </FormItem>
            <FormItem prop="author" label="作者">
                <Input v-model="form.author" placeholder="作者" size="large" />
            </FormItem>
            <FormItem prop="abstract" label="概要">
                <Input v-model="form.abstract" placeholder="概要" size="large" />
            </FormItem>
            <FormItem prop="tag" label="标签">
                <Tag
                    v-for="item in form.countTags"
                    :key="item"
                    :name="item"
                    closable
                    @on-close="handleClose"
                >{{item}}</Tag>
                <Input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur.native.capture="handleInputConfirm"
                />
                <Button
                    size="small"
                    type="dashed"
                    icon="md-add"
                    @click="showInput"
                    style="font-size: 12px"
                >添加标签</Button>
            </FormItem>
            <FormItem prop="coverImage" label="封面图">
                <Upload
                    ref="upload"
                    action="http://localhost:3000/upload"
                    :on-success="uploadSuccess"
                    :before-upload="beforeUpload"
                    :max-size="102400"
                >
                    <Button icon="ios-cloud-upload-outline">上传封面图</Button>
                </Upload>
            </FormItem>
        </Form>
        <div id="editor"></div>
        <br>
        <Button
            @click="submit"
            type="primary"
            class="right"
        >提交</Button>
    </div>
</template>

<script>
import E from 'wangeditor'
export default {
    name: 'BlogSharing',
    data() {
        return {
            editor2: null,
            form: {
                title: '',
                author: '',
                date: '',
                date2: '',
                countTags: [],
                content: '',
                abstract: '',
                coverImage: ''
            },
            inputVisible: false,
            inputValue: '',
            uploadList: []
        }
    },
    mounted() {
        this.uploadList = this.$refs.upload.fileList;
        this.editor2 = new E('#editor');
        // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！
        // editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        // editor.customConfig.uploadImgServer = '/upload'  // 上传图片到服务器
        this.editor2.customConfig = {
            uploadFileName: 'file',
            uploadImgServer: 'http://localhost:3000/upload',
            // uploadImgMaxSize : 3 * 1024 * 1024 , // 将图片大小限制为 3M
            // uploadImgMaxLength : 1 , // 限制一次最多上传 1 张图片
        }
        // 监听上传的各个阶段
        this.toListenUp(this.editor2);
        this.editor2.create();
    },
    methods: {
        submit() {
            const {
                title,
                author,
                countTags,
                content,
                date,
                abstract,
                coverImage
            } = this.form;
            // 获取文本内容 - 读取html
            const html = this.editor2.txt.html();
            const url = 'http://localhost:3000/blog';
            const options = {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'application/x-www-form-urlencoded' 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    author: author,
                    date: date,
                    content: html,
                    tag: countTags,
                    abstract: abstract,
                    coverImage: coverImage
                })
            };
            fetch(url, options).then(res => {
                console.log(res);
                this.$Message.success('添加成功');
            }).catch(err => {
                console.log(err);
            })
        },
        handleClose(tag) {
            this.form.countTags.splice(this.form.countTags.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            })
        },
        handleInputConfirm() {
            if (this.inputValue) {
                this.form.countTags.push(this.inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        changeDate(date) {
            this.form.date = date;
        },
        beforeUpload() {
            const check = this.uploadList.length < 1;
            if (!check) {
                this.$Notice.warning({
                    title: '只能上传一张'
                });
            }
            return check;
        },
        uploadSuccess(res, file, fileList) {
            // 获取上传的logo
            this.form.coverImage = res.data.path;
        },
        toListenUp(editor) {
            let _this = this;
            editor.customConfig.uploadImgHooks = {
                before: function (xhr, editor, files) {
                    // 图片上传之前触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
                    
                    // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
                    // return {
                    //     prevent: true,
                    //     msg: '放弃上传'
                    // }
                },
                success: function (xhr, editor, result) {
                    // 图片上传并返回结果，图片插入成功之后触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                    // debugger
                    console.log(result, 'success')
                },
                fail: function (xhr, editor, result) {
                    // 图片上传并返回结果，但图片插入错误时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                    // debugger
                },
                error: function (xhr, editor) {
                    // 图片上传出错时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                    // debugger
                },
                customInsert: function (insertImg, result, editor) {
                    // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                    // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

                    // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                    var url = result.data.path;
                    // url = 'https://pic4.zhimg.com/80/v2-c44f7a9703f925a14b569047562bc7b2_720w.jpg'
                    insertImg(url)

                    // result 必须是一个 JSON 格式字符串！！！否则报错
                }
            }
        },
    }
}
</script>

<style lang="scss">
.blogSharing {
    .input-new-tag {
        width: 80px;
        margin-left: 0px;
    }
    #editor {
         margin: 100px 50px 50px;
    }
}
</style>