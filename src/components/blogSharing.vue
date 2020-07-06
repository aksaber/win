<template>
    <div class="blogSharing">
        <Button type="primary" style="margin: 20px 0" @click="addBlog">新增</Button>
        <Table stripe border :columns="columnsData" :data="blogData" >
            <template slot-scope="{ row, index }" slot="coverImage">
                <img :src="row.coverImage" width="100">
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="warning" @click="updateBlog(row)">编辑</Button>
                <Button type="error" @click="delBlog(row)">删除</Button>
            </template>
        </Table>
        <Page
            :total="total"
            :current="page"
            @on-change="changePage"
            style="margin-top: 20px"
        />
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
                        v-model="form.date"
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
                        :show-upload-list="false"
                        :max-size="102400"
                    >
                        <Button icon="ios-cloud-upload-outline">上传封面图</Button>
                    </Upload>
                    <img :src="form.coverImage" width="100" style="margin-top: 20px">
                </FormItem>
                <FormItem label="音乐">
                    <Upload
                        ref="upload2"
                        :action='uploadHttp'
                        :on-success="uploadSuccess2"
                        :before-upload="beforeUpload2"
                        :show-upload-list="false"
                        accept=".mp3,.wave,.wma"
                    >
                        <Button icon="ios-cloud-upload-outline">上传音乐</Button>
                    </Upload>
                    <a :href="form.audio" target="_blank">{{form.audio}}</a>
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
            total: 10,
            page: 1,
            blogData: [],
            editor2: null,
            form: {
                id: null,
                title: '',
                author: '',
                date: '',
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
                type: [{ type: 'number', required: true, message: '分类不能为空', trigger: 'change' }]
            },
            submitShow: false,
            addShow: false,
            isUpdate: false
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

        // 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
        this.editor2.customConfig.emotions = [
            {
                // tab 的标题
                title: '默认',
                // type -> 'emoji' / 'image'
                type: 'image',
                // content -> 数组
                content: [
                    {
                        alt: '[微笑]',
                        src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e3/2018new_weixioa02_org.png'
                    },
                    {
                        alt: '[馋嘴]',
                        src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fa/2018new_chanzui_org.png'
                    },
                    {
                        alt: '[挖鼻]',
                        src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9a/2018new_wabi_thumb.png'
                    }
                ]
            },
            {
                // tab 的标题
                title: 'emoji',
                // type -> 'emoji' / 'image'
                type: 'emoji',
                // content -> 数组
                content: ['😀', '😃', '😄', '😁', '😆']
            }
        ]

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
        addBlog() {
            this.form.id = null;
            this.form.title = '';
            this.form.author = '';
            this.form.date = '';
            this.form.countTags = [];
            this.form.type = '';
            this.form.coverImage = '';
            this.form.audio = '';
            this.editor2.txt.clear();
            this.isUpdate = false;
            this.addShow = true;
        },
        updateBlog(row) {
            this.form.id = row.id;
            this.form.title = row.title;
            this.form.author = row.author;
            this.form.date = row.date;
            this.form.countTags = row.tag;
            this.form.type = row.type;
            this.form.coverImage = row.coverImage;
            this.form.audio = row.audio;
            this.isUpdate = true;
            this.addShow = true;
            this.editor2.txt.html(row.content);
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
                if (valid) {
                    const {
                        id,
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
                    const options = {
                        method: 'POST',
                        headers: {
                            // 'Content-Type': 'application/x-www-form-urlencoded' 
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: id,
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
                    if (!this.isUpdate) {
                        // 新增
                        const url = `${this.http}/blog`;
                        fetch(url, options).then(response => response.json())
                            .then(res => {
                                if (res.code == 200) {
                                    this.$Message.success('添加成功');
                                    this.addShow = false;
                                    this.getList();
                                } else {
                                    this.$Message.error(res.data);
                                }
                                // location.reload();
                            }).catch(err => {
                                console.log(err);
                            })
                    } else {
                        const url = `${this.http}/blog/updateBlog`;
                        fetch(url, options).then(response => response.json())
                            .then(res => {
                                if (res.code == 200) {
                                    this.$Message.success('修改成功');
                                    this.addShow = false;
                                    this.getList();
                                } else {
                                    this.$Message.error(res.data);
                                }
                            }).catch(err => {
                                console.log(err);
                            })
                    }
                } else {

                }
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
            this.$nextTick(() => {
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
            // const check = this.uploadList.length < 1;
            // if (!check) {
            //     this.$Notice.warning({
            //         title: '只能上传一张'
            //     });
            // }
            // return check;
        },
        uploadSuccess(res, file, fileList) {
            // 获取上传的logo
            this.form.coverImage = 'https://www.hibifsqm.com/' + res.data.path.replace('/var/www/fsnode/static/', '')
        },
        beforeUpload2() {
            // const check = this.uploadList2.length < 1;
            // if (!check) {
            //     this.$Notice.warning({
            //         title: '只能上传一首'
            //     });
            // }
            // return check;
        },
        uploadSuccess2(res, file, fileList) {
            // 音乐的url
            this.form.audio = 'https://www.hibifsqm.com/' + res.data.path.replace('/var/www/fsnode/static/', '')
        },
        changePage(size) {
            console.log(size)
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
                    console.log(result, 'success')
                },
                fail: function (xhr, editor, result) {
                    // 图片上传并返回结果，但图片插入错误时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                },
                error: function (xhr, editor) {
                    // 图片上传出错时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
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