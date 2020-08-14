<template>
    <div class="bannerConfig">
        <Tabs>
            <TabPane label="首页轮播图配置">
                <Button type="primary" @click="modalBanner = true" style="margin-bottom: 10px">新增</Button>
                <Table stripe border :columns="column" :data="tableData">
                    <template slot-scope="{ row }" slot="image">
                        <img :src="row.image" width="200" height="112" />
                    </template>
                    <template slot-scope="{ row }" slot="url">
                        <a :href="row.url" target="_blank">{{row.url}}</a>
                    </template>
                    <template slot-scope="{ row }" slot="action">
                        <Button type="warning" @click="edit(row)">编辑</Button>
                        <Button type="error" @click="delBanner(row.id)">删除</Button>
                    </template>
                </Table>

                <Modal
                    v-model="modalBanner"
                    :title="isUpdate ? '修改' : '新增'"
                    :loading="loading1"
                    @on-ok="addBanner"
                >
                    <Form :model="addForm" :rules="ruleInline" ref="formInline" :label-width="80">
                        <FormItem prop="image" label="轮播图">
                            <Upload
                                multiple
                                type="drag"
                                :action="action"
                                :on-success="uploadSuccess"
                                :before-upload="beforeUpload"
                                :show-upload-list="false"
                                accept=".png,.jpg,.jpeg,.gif"
                            >
                                <div style="padding: 20px 0">
                                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                    <p>点击或拖拽文件上传</p>
                                </div>
                            </Upload>
                        </FormItem>
                        <FormItem label="预览图" style="text-align: center">
                            <img :src="addForm.image" width="100" >
                        </FormItem>
                        <FormItem prop="url" label="跳转链接">
                            <Input v-model="addForm.url" placeholder="跳转链接" />
                        </FormItem>
                        <FormItem prop="sort" label="排序">
                            <InputNumber v-model="addForm.sort" placeholder="排序" style="width: 100%" />
                        </FormItem>
                    </Form>
                </Modal>
            </TabPane>
            <TabPane label="导航栏配置">
                <Table :columns="column2" :data="headerData">
                    <template slot-scope="{ row }" slot="url">
                        <a :href="row.url" target="_blank">{{row.url}}</a>
                    </template>
                    <template slot-scope="{ row }" slot="action">
                        <Button type="warning" @click="editHeader(row)">修改链接</Button>
                    </template>
                </Table>

                <Modal
                    v-model="modalHeader"
                    title="修改链接"
                    :loading="loading1"
                    @on-ok="updateHeader"
                >
                    <Form :model="addForm2" :label-width="80">
                        <FormItem label="导航栏" style="text-align: center">
                            <Input v-model="addForm2.header" disabled />
                        </FormItem>
                        <FormItem prop="url" label="跳转链接">
                            <Input v-model="addForm2.url" placeholder="跳转链接" />
                        </FormItem>
                    </Form>
                </Modal>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
    name: 'BannnerConfig',
    data() {
        return {
            http: 'https://www.hibifsqm.com',
            // http: 'http://localhost:3020',
            action: 'https://www.hibifsqm.com/blog/upload',
            column: [{
                type: 'index',
                width: 60,
                align: 'center'
            }, {
                title: '图片',
                slot: 'image',
                align: 'center'
            }, {
                title: '跳转链接',
                slot: 'url',
                align: 'center'
            }, {
                title: '排序',
                key: 'sort',
                align: 'center',
                sortable: true
            }, {
                title: '操作',
                slot: 'action',
                width: 180,
                align: 'center'
            }],
            tableData: [],
            modalBanner: false,
            loading1: true,
            addForm: {
                id: '',
                image: '',
                url: '',
                sort: ''
            },
            isUpdate: false,
            ruleInline: {
                image: [{ required: true, message: '图片不能为空' }],
                sort: [{ required: true, message: '排序不能为空' }],
            },
            column2: [{
                title: '导航栏',
                key: 'header'
            }, {
                title: '跳转链接',
                slot: 'url'
            }, {
                title: '操作',
                slot: 'action',
                width: 120
            }],
            headerData: [],
            modalHeader: false,
            addForm2: {
                id: '',
                header: '',
                url: ''
            }
        }
    },
    mounted() {
        this.getList();
        this.getHeader();
    },
    methods: {
        getList() {
            const url = `${this.http}/blog/getBanner`;
            fetch(url).then(response => response.json())
            .then(res => {
                if (res.code == 200) {
                    this.tableData = res.data;
                    this.isUpdate = false;
                }
            })
        },
        edit(row) {
            this.isUpdate = true;
            this.addForm.id = row.id;
            this.addForm.image = row.image;
            this.addForm.url = row.url;
            this.addForm.sort = row.sort;
            this.modalBanner = true;
        },
        addBanner() {
            this.$refs['formInline'].validate((valid) => {
                this.loading1 = true;
                if (valid) {
                    if (this.isUpdate) {
                        const url = `${this.http}/blog/updateBanner`;
                        fetch(url, {
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Cookies.get('token')
                            },
                            body: JSON.stringify(this.addForm)
                        }).then(response => response.json())
                        .then(res => {
                            this.loading1 = false;
                            if (res.code == 200) {
                                this.$Message.success('修改成功');
                                this.getList();
                                this.modalBanner = false;
                            } else {
                                this.$Message.error(res.data);
                                setTimeout(() => {
                                    this.loading1 = false;
                                    this.$nextTick(() => {
                                        this.loading1 = true
                                    })
                                }, 100)
                            }
                        })
                    } else {
                        const url = `${this.http}/blog/addBanner`;
                        fetch(url, {
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Cookies.get('token')
                            },
                            body: JSON.stringify(this.addForm)
                        }).then(response => response.json())
                        .then(res => {
                            this.loading1 = false;
                            if (res.code == 200) {
                                this.$Message.success('添加成功');
                                this.getList();
                                this.modalBanner = false;
                            } else {
                                this.$Message.error(res.data);
                                setTimeout(() => {
                                    this.loading1 = false;
                                    this.$nextTick(() => {
                                        this.loading1 = true
                                    })
                                }, 100)
                            }
                        })
                    }
                } else {
                    setTimeout(() => {
                        this.loading1 = false;
                        this.$nextTick(() => {
                            this.loading1 = true
                        })
                    }, 100)
                }
            })
        },
        delBanner(id) {
            this.$Modal.confirm({
                title: '删除banner图',
                content: '<p>是否删除banner图</p>',
                onOk: () => {
                    const url = `${this.http}/blog/delBanner`;
                    fetch(url, {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': Cookies.get('token')
                        },
                        body: JSON.stringify({
                            id: id
                        })
                        }).then(response => response.json())
                        .then(res => {
                            if (res.code == 200) {
                                this.$Message.success('删除成功');
                                this.getList()
                            } else {
                                this.$Message.error(res.data);
                                console.log(res.data)
                            }
                        })
                },
                onCancel: () => {
                    
                }
            });
        },
        getHeader() {
            const url = `${this.http}/blog/getHeader`;
            fetch(url).then(response => response.json())
            .then(res => {
                if (res.code == 200) {
                    this.headerData = res.data;
                }
            })
        },
        editHeader(row) {
            this.addForm2.id = row.id;
            this.addForm2.header = row.header;
            this.addForm2.url = row.url;
            this.modalHeader = true;
        },
        updateHeader() {
            const url = `${this.http}/blog/updateHeader`;
            fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('token')
                },
                body: JSON.stringify(this.addForm2)
            }).then(response => response.json())
            .then(res => {
                this.loading1 = false;
                if (res.code == 200) {
                    this.$Message.success('修改成功');
                    this.getHeader();
                    this.modalHeader = false;
                } else {
                    this.$Message.error(res.data);
                    setTimeout(() => {
                        this.loading1 = false;
                        this.$nextTick(() => {
                            this.loading1 = true
                        })
                    }, 100)
                }
            })
        },
        beforeUpload() {

        },
        uploadSuccess(res, file, fileList) {
            // 获取上传的logo
            this.addForm.image = 'https://www.hibifsqm.com/' + res.data.path.replace('/var/www/fsnode/static/', '')
        },
    }
}
</script>

<style lang="scss">
.bannerConfig {
    padding: 15px;
}
</style>