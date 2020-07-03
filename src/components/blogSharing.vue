<template>
    <div class="blogSharing">
        <Button type="primary" style="margin: 20px 0" @click="addShow = true">新增</Button>
        <Table stripe border :columns="columnsData" :data="blogData" >
            <template slot-scope="{ row, index }" slot="coverImage">
                <img :src="row.coverImage" width="100">
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="error" @click="delBlog(row)">删除</Button>
            </template>
        </Table>
        <Drawer
            title="新增"
            v-model="addShow"
            width="1000"
            :mask-closable="false"
        >
            <Form :model="form" ref="formValidate" :rules="ruleValidate" :label-width="100" style="margin-bottom: 30px; width: 50%">
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
                <FormItem prop="type" label="分类">
                    <Select v-model="form.type" size="large">
                        <Option
                            v-for="item in classifyList"
                            :key="item.id"
                            :value="item.id"
                        >{{item.name}}</Option>
                    </Select>
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
                        :action='uploadHttp'
                        :on-success="uploadSuccess"
                        :before-upload="beforeUpload"
                        accept=".png,.jpg,.jpeg,.gif"
                        :max-size="102400"
                    >
                        <Button icon="ios-cloud-upload-outline">上传封面图</Button>
                    </Upload>
                </FormItem>
                <FormItem label="音乐">
                    <Upload
                        ref="upload2"
                        :action='uploadHttp'
                        :on-success="uploadSuccess2"
                        :before-upload="beforeUpload2"
                        accept=".mp3,.wave,.wma"
                    >
                        <Button icon="ios-cloud-upload-outline">上传音乐</Button>
                    </Upload>
                </FormItem>
            </Form>
            <div id="editor"></div>
            <br>
            <Button
                @click="submit('formValidate')"
                type="primary"
                class="right"
            >提交</Button>
        </Drawer>
        
        <!-- <Modal
            v-model="submitShow"
            title="提交博客"
            @on-ok="addBlog"
        >
            <p>是否提交博客</p>
        </Modal> -->
    </div>
</template>

<script>
import E from 'wangeditor'
export default {
    name: 'BlogSharing',
    data() {
        return {
            http: 'https://www.hibifsqm.com',
            // http: 'http://localhost:3020',
            uploadHttp: 'https://www.hibifsqm.com/blog/upload',
            columnsData: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '作者',
                    key: 'author'
                },
                {
                    title: '标题',
                    key: 'title'
                },
                {
                    title: '日期',
                    key: 'date'
                },
                {
                    title: '封面图',
                    slot: 'coverImage'
                },
                {
                    title: '操作',
                    slot: 'action'
                }
            ],
            blogData: [],
            editor2: null,
            form: {
                title: '',
                author: '',
                date: '',
                date2: '',
                countTags: [],
                type: '',
                coverImage: '',
                audio: ''
            },
            inputVisible: false,
            inputValue: '',
            uploadList: [],
            uploadList2: [],
            classifyList: [],
            ruleValidate: {
                date: [{ required: true, message: '日期不能为空', trigger: 'blur' }],
                title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
                author: [{ required: true, message: '作者不能为空', trigger: 'blur' }],
                type: [{ required: true, message: '分类不能为空', trigger: 'blur' }]
            },
            submitShow: false,
            addShow: false
        }
    },
    mounted() {
        this.uploadList = this.$refs.upload.fileList;
        this.uploadList2 = this.$refs.upload2.fileList;
        this.editor2 = new E('#editor');
        // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！
        // editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        // editor.customConfig.uploadImgServer = '/upload'  // 上传图片到服务器
        this.editor2.customConfig = {
            uploadFileName: 'file',
            uploadImgServer: `${this.http}/blog/upload`,
            // uploadImgMaxSize : 3 * 1024 * 1024 , // 将图片大小限制为 3M
            // uploadImgMaxLength : 1 , // 限制一次最多上传 1 张图片
        }
        // 监听上传的各个阶段
        this.toListenUp(this.editor2);
        this.editor2.create();
        // 获取博客分类
        this.getBlogType();
        this.getList();
    },
    methods: {
        getList() {
            const url = `${this.http}/blog/list`;
            fetch(url).then(response => response.json())
                .then(res => {
                    this.blogData = res.data;
                })
        },
        delBlog(row) {
            this.$Modal.confirm({
                title: '删除博客',
                content: '<p>是否删除博客</p>',
                onOk: () => {
                    const url = `${this.http}/blog/delBlog`;
                    fetch(url, {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: row.id
                        })
                        }).then(response => response.json())
                        .then(res => {
                            if (res.code == 200) {
                                this.$Message.success('删除成功');
                                this.getList()
                            } else {
                                this.$Message.error(res.data)
                            }
                        })
                },
                onCancel: () => {
                    
                }
            });
        },
        getBlogType() {
            // 获取博客类型
          const url = `${this.http}/blog/getBlogType`;
          fetch(url).then(response => response.json())
            .then(res => {
                this.classifyList = res.data;
            })
        },
        submit(name) {
            this.$refs[name].validate((valid) => {
                const {
                    title,
                    author,
                    countTags,
                    date,
                    type,
                    audio,
                    coverImage
                } = this.form;
                // 获取文本内容 - 读取html
                const html = this.removeWordXml(this.editor2.txt.html());
                const url = `${this.http}/blog`;
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
                        type: type,
                        audio: audio,
                        coverImage: coverImage
                    })
                };
                fetch(url, options).then(res => {
                    console.log(res);
                    this.$Message.success('添加成功');
                    // location.reload();
                }).catch(err => {
                    console.log(err);
                })
            })
        },
        removeWordXml(text){
            var html = text;
            html = html.replace(/<\/?SPAN ?YES[^>]*>/gi, "");//  Remove  all  SPAN  tags
            // html = html.replace(/<(\w[^>]*)  class=([^|>]*)([^>]*)/gi, "<$1$3");  //  Remove  Class  attributes
            // html = html.replace(/<(\w[^>]*)  style="([^"]*)"([^>]*)/gi, "<$1$3");  //  Remove  Style  attributes
            html = html.replace(/<(\w[^>]*)  lang=([^|>]*)([^>]*)/gi, "<$1$3");//  Remove  Lang  attributes
            html = html.replace(/<\\?\?xml[^>]*>/gi, "");//  Remove  XML  elements  and  declarations
            html = html.replace(/<\/?\w+:[^>]*>/gi, "");//  Remove  Tags  with  XML  namespace  declarations:  <o:p></o:p>
            html = html.replace(/&nbsp;/, "");//  Replace  the  &nbsp;
            html = html.replace(/\n(\n)*( )*(\n)*\n/gi, '\n');
            //  Transform  <P>  to  <DIV>
            // var  re  =  new  RegExp("(<P)([^>]*>.*?)(<//P>)","gi")  ;            //  Different  because  of  a  IE  5.0  error
            //        html = html.replace(re, "<div$2</div>");
            return html;
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
            this.form.coverImage = 'https://www.hibifsqm.com/' + res.data.path.replace('/var/www/fsnode/static/', '')
        },
        beforeUpload2() {
            const check = this.uploadList2.length < 1;
            if (!check) {
                this.$Notice.warning({
                    title: '只能上传一首'
                });
            }
            return check;
        },
        uploadSuccess2(res, file, fileList) {
            // 音乐的url
            this.form.audio = 'https://www.hibifsqm.com/' + res.data.path.replace('/var/www/fsnode/static/', '')
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
                    var url = 'https://www.hibifsqm.com/' + result.data.path.replace('/var/www/fsnode/static/', '')
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