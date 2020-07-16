<template>
    <div class="Course">
        <div style="margin-top: 20px">
            <Input v-model="type" placeholder="分类" style="width: 250px"></Input>
            <Button type="success" @click="add">新增分类</Button>
        </div>
        <Table stripe border :columns="columnsData" :data="blogType" style="margin-top: 50px">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="error" @click="delBlogType(row)">删除</Button>
            </template>
        </Table>
        <Page
            :total="total"
            :current="page"
            @on-change="changePage"
            style="margin-top: 20px"
        />
    </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
    name: 'Course',
    data() {
        return {
            coverImage: [],
            swiper: null,
            type: '',
            total: 10,
            page: 1,
            blogType: [],
            columnsData: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '分类名',
                    key: 'name'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 200
                }
            ],
            http: 'https://www.hibifsqm.com',
            // http: 'http://localhost:3020',
        }
    },
    mounted() {
        // 获取博客分类列表
        this.getBlogType();
    },
    methods: {
        add() {
            const url = `${this.http}/blog/addBlogType`;
            fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('token')
                },
                body: JSON.stringify({
                    type: this.type
                })
            }).then(response => response.json())
                .then(res => {
                    if (res.code == 200) {
                        this.$Message.success('添加成功');
                        this.getBlogType();
                    } else {
                        this.$Message.error(res.data);
                    }
                })
        },
        getBlogType() {
            // 获取博客类型
            const url = `${this.http}/blog/getBlogType`;
            fetch(url).then(response => response.json())
                .then(res => {
                    this.blogType = res.data;
            })
        },
        delBlogType(row) {
            this.$Modal.confirm({
                title: '删除分类',
                content: '<p>是否删除博客分类</p>',
                onOk: () => {
                    const url = `${this.http}/blog/delBlogType`;
                    fetch(url, {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': Cookies.get('token')
                        },
                        body: JSON.stringify({
                            id: row.id
                        })
                        }).then(response => response.json())
                        .then(res => {
                            if (res.code == 200) {
                                this.$Message.success('删除成功');
                                this.getBlogType()
                            } else {
                                this.$Message.error(res.data)
                            }
                        })
                },
                onCancel: () => {
                    
                }
            });
        },
        changePage(size) {
            console.log(size)
        },
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
            const url = 'https://localhost:3000/banner/get'
            fetch(url).then(response => response.json())
                .then(res => {
                    this.coverImage = res.data;
                    console.log(this.coverImage);
                    this.swiper.init();
                })
        },
        addBanner(item) {
            const url = 'https://localhost:3000/banner/add';
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
            const url = 'https://localhost:3000/banner/del';
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