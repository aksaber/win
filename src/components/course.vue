<template>
    <div class="Course">
        <br>
        <h1>课程通知</h1>
        <br>
        <h2 class="center">前端展示轮播图</h2>
        <br>
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div
                    class="swiper-slide"
                    v-for="item in coverImage"
                    :key="item.uid"
                >
                    <img :src="item.url" style="width: 100%; height: 300px" />
                </div>
            </div>
        </div>
        <Upload
            ref="upload"
            action="http://localhost:3000/upload"
            :on-success="uploadSuccess"
            :show-upload-list="false"
            :on-remove="uploadRemove"
            :max-size="102400"
            :format="['jpg','jpeg','png']"
        >
            <Button icon="ios-cloud-upload-outline">上传封面图</Button>
        </Upload>
        <div class="flex" style="margin-top: 10px">
            <div v-for="item in coverImage" style="margin-right: 10px; position: relative">
                <img
                    :src="item.url"
                    style="width: 300px; height: 300px"
                />
                <Icon
                    type="ios-close"
                    style="position: absolute; right: 5px; top: 5px; font-size: 32px; cursor: pointer"
                    @click="delBanner(item)"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'
import 'swiper/js/swiper.min.js'
export default {
    name: 'Course',
    data() {
        return {
            coverImage: [],
            swiper: null
        }
    },
    mounted() {
        this.swiper = new Swiper('.swiper-container', {
            autoplay: true,
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:true,//修改swiper的父元素时，自动初始化swiper
        });
        this.getBanner();
        let a = this.encodeToGb2312('拆补局');
        console.log(a);
    },
    methods: {
        encodeToGb2312(str) { 
            var strOut=""; 
            var z='{0}';
            for(var i = 0; i < str.length; i++){ 
                var c = str.charAt(i); 
                var code = str.charCodeAt(i); 
                if(c==" ") strOut +="+"; 
                    else if(code >= 19968 && code <= 40869){ 
                    var index = code - 19968; 
                    strOut += "%" + z.substr(index*4,2) + "%" + z.substr(index*4+2,2); 
                } 
                else{ 
                    strOut += "%" + str.charCodeAt(i).toString(16); 
                } 
            } 
            return strOut; 
        },
        uploadSuccess(res, file, fileList) {
            // 获取上传的logo
            const obj = {
                uid: file.uid,
                url: res.data.path
            }
            this.coverImage.push(obj);
            this.addBanner(obj);
        },
        uploadRemove(file, fileList) {
            this.coverImage.splice(this.coverImage.indexOf(file.uid), 1)
            console.log(this.coverImage);
        },
        getBanner() {
            const url = 'http://localhost:3000/banner/get'
            fetch(url).then(response => response.json())
                .then(res => {
                    this.coverImage = res.data;
                    console.log(this.coverImage);
                    this.swiper.init();
                })
        },
        addBanner(item) {
            const url = 'http://localhost:3000/banner/add';
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: item.uid,
                    url: item.url
                })
            }
            fetch(url, options).then(res => {
                this.$Message.success('添加成功');
            }).catch(err => {
                console.log(err);
            })
        },
        delBanner(item) {
            const url = 'http://localhost:3000/banner/del';
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: item.uid
                })
            }
            fetch(url, options).then(res => {
                this.$Message.success('删除成功');
                this.getBanner();
            }).catch(err => {
                console.log(err);
            })
        }
    }
}
</script>

<style lang="scss">
.Course {}
</style>