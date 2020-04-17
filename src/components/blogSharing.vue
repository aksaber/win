<template>
    <div class="blogSharing">
        <br>
        <h1>博文分享</h1>
        <br>
        <div id="editor"></div>
        <br>
        <Button @click="submit">提交</Button>
    </div>
</template>

<script>
import E from 'wangeditor'
export default {
    name: 'BlogSharing',
    data() {
        return {
            editor2: null
        }
    },
    mounted() {
        this.editor2 = new E('#editor');
        // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！
        // editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        // editor.customConfig.uploadImgServer = '/upload'  // 上传图片到服务器
        // this.editor2.customConfig.uploadImgShowBase64 = true
        this.editor2.customConfig.uploadImgServer = '/upload'
        this.editor2.create();
    },
    methods: {
        submit() {
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
                    p1: '1',
                    p2: '2',
                    p3: '3',
                    p4: html
                })
            };
            fetch(url, options).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        }
    }
}
</script>

<style lang="scss">
.blogSharing {}
</style>