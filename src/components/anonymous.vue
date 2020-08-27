<template>
    <div class="anonymous">
        <Table stripe border :columns="columnsData" :data="anoData" v-if="screenW > 768">
            <template slot-scope="{ row, index }" slot="hasUpdate">
                <Tag color="red" v-if="row.hasUpdate == '0'">新</Tag>
                <Tag color="default" v-if="row.hasUpdate == '1'">已更新</Tag>
            </template>
            <template slot-scope="{ row, index }" slot="payOrder">
                <img :src="row.payOrder" width="100">
            </template>
            <template slot-scope="{ row, index }" slot="question">
                <div class="ellispsis" :title="row.question">{{row.question}}</div>
            </template>
            <template slot-scope="{ row, index }" slot="requestion">
                <div class="ellispsis" :title="row.requestion">{{row.requestion}}</div>
            </template>
            <template slot-scope="{ row, index }" slot="answer">
                <div class="ellispsis" :title="row.answer">{{row.answer}}</div>
            </template>
            <template slot-scope="{ row, index }" slot="paipanImage">
                <img :src="row.paipanImage" width="100">
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="warning" @click="answer(row)">解答</Button>
                <Button type="error" @click="del(row.id)">删除</Button>
            </template>
        </Table>

        <Table stripe border :columns="columnsMobileData" :data="anoData" v-if="screenW <= 768">
            <template slot-scope="{ row, index }" slot="hasUpdate">
                <Tag color="red" v-if="row.hasUpdate == '0'">新</Tag>
                <Tag color="default" v-if="row.hasUpdate == '1'">已更新</Tag>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="warning" @click="answer(row)">解答</Button>
                <Button type="error" @click="del(row.id)">删除</Button>
            </template>
        </Table>

        <div v-if="screenW > 768">
            <Drawer
                title="解答"
                v-model="modalShow"
                width="1000"
                :mask-closable="false"
            >
                <Form :model="form" :label-width="85">
                    <FormItem label="订单号">
                        <span>{{form.orders}}</span>
                    </FormItem>
                    <FormItem label="支付凭证">
                        <img :src="form.payOrder" @click="handleView(form.payOrder)" width="300" style="cursor: pointer">
                    </FormItem>
                    <FormItem label="占卜问题">
                        <span>{{form.question}}</span>
                    </FormItem>
                    <FormItem label="再次提问">
                        <span>{{form.requestion}}</span>
                    </FormItem>
                    <FormItem label="解答">
                        <Input type="textarea" v-model="form.answer" rows="10"></Input>
                    </FormItem>
                    <FormItem label="九宫八卦图">
                        <Upload
                            ref="upload"
                            :action='uploadHttp'
                            :on-success="uploadSuccess"
                            :before-upload="beforeUpload"
                            accept=".png,.jpg,.jpeg,.gif"
                            :show-upload-list="false"
                            :max-size="102400"
                        >
                            <Button icon="ios-cloud-upload-outline">上传九宫八卦图</Button>
                        </Upload>
                        <img :src="form.paipanImage" style="margin-top: 20px">
                    </FormItem>
                </Form>
                <Button type="primary" style="float: right" @click="editAnonymous">解答</Button>
                <Button type="success" style="float: right; margin-right: 20px" @click="updateStatus">更新解答</Button>
            </Drawer>
        </div>
        <div v-else>
            <Modal
                title="解答"
                v-model="modalShow"
                width="80%"
                :closable="false"
                :loading="loading"
            >
                <Form :model="form" :label-width="85">
                    <FormItem label="订单号">
                        <span>{{form.orders}}</span>
                    </FormItem>
                    <FormItem label="支付凭证">
                        <img :src="form.payOrder" @click="handleView(form.payOrder)" width="100%" style="cursor: pointer">
                    </FormItem>
                    <FormItem label="占卜问题">
                        <span>{{form.question}}</span>
                    </FormItem>
                    <FormItem label="再次提问">
                        <span>{{form.requestion}}</span>
                    </FormItem>
                    <FormItem label="解答">
                        <Input type="textarea" v-model="form.answer" rows="10"></Input>
                    </FormItem>
                    <FormItem label="九宫八卦图">
                        <Upload
                            ref="upload"
                            :action='uploadHttp'
                            :on-success="uploadSuccess"
                            :before-upload="beforeUpload"
                            accept=".png,.jpg,.jpeg,.gif"
                            :show-upload-list="false"
                            :max-size="102400"
                        >
                            <Button icon="ios-cloud-upload-outline">上传九宫八卦图</Button>
                        </Upload>
                        <img :src="form.paipanImage" style="margin-top: 20px; width: 100%">
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="error" @click="modalShow = false">关闭</Button>
                    <Button type="success" @click="updateStatus">更新解答</Button>
                    <Button type="primary" @click="editAnonymous">解答</Button>
                </div>
            </Modal>
        </div>

        <!--预览大图-->
        <Modal title="查看大图" v-model="visibleImg" width="60%">
            <div style="text-align: center">
                <img :src="imgUrl" style="max-width: 100%">
            </div>
        </Modal>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
    name: 'Anonymous',
    data() {
        return {
            screenW: document.body.clientWidth,
            http: 'https://www.hibifsqm.com',
            // http: 'http://localhost:3020',
            uploadHttp: 'https://www.hibifsqm.com/blog/upload',
            anoData: [],
            columnsData: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '查看状态',
                    slot: 'hasUpdate',
                    width: 120,
                },
                {
                    title: '订单号',
                    key: 'orders',
                    minWidth: 180
                },
                {
                    title: '支付凭证',
                    slot: 'payOrder',
                    minWidth: 100
                },
                {
                    title: '占卜问题',
                    slot: 'question',
                    width: 300
                },
                {
                    title: '时间',
                    key: 'time',
                    minWidth: 180
                },
                {
                    title: '再次提问',
                    slot: 'requestion',
                    minWidth: 180
                },
                {
                    title: '解答',
                    slot: 'answer',
                    width: 300
                },
                {
                    title: '九宫八卦图',
                    slot: 'paipanImage',
                    width: 120
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 180
                }
            ],
            columnsMobileData: [
                {
                    title: '查看状态',
                    slot: 'hasUpdate',
                },
                {
                    title: '操作',
                    slot: 'action'
                }
            ],
            form: {
                id: '',
                orders: '',
                payOrder: '',
                question: '',
                paipanImage: '',
                answer: '',
                requestion: '',
            },
            modalShow: false,
            visibleImg: false,
            imgUrl: '',
            loading: true
        }
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            const url = `${this.http}/blog/getAnonymous`;
            fetch(url).then(response => response.json())
                .then(res => {
                    this.anoData = res.data;
                })
        },
        answer(row) {
            this.form.id = row.id;
            this.form.orders = row.orders;
            this.form.payOrder = row.payOrder;
            this.form.question = row.question;
            this.form.answer = row.answer;
            this.form.time = row.time;
            this.form.paipanImage = row.paipanImage;
            this.form.requestion = row.requestion;
            this.modalShow = true;
        },
        del(id) {
            this.$Modal.confirm({
                title: '删除订单',
                content: '<p>是否删除该订单</p>',
                onOk: () => {
                    const url = `${this.http}/blog/updateAnonymous`;
                    fetch(url, {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': Cookies.get('token')
                        },
                        body: JSON.stringify({ id: id, status: 1 })
                        }).then(response => response.json())
                        .then(res => {
                            if (res.code == 200) {
                                this.$Message.success('删除成功');
                                this.getList()
                            } else {
                                this.$Message.error(res.data);
                            }
                        })
                },
                onCancel: () => {
                    
                }
            });
        },
        handleView(url) {
            this.imgUrl = url;
            this.visibleImg = true;
        },
        editAnonymous() {
            const url = `${this.http}/blog/updateAnonymous`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('token')
                },
                body: JSON.stringify(this.form)
            }).then(response => response.json())
                .then(res => {
                    if (res.code == 200) {
                        this.$Message.success('已解答，请更新解答，以便用户查询');
                        this.getList();
                    } else {
                        this.$Message.error(res.data);
                        console.log(res.data)
                    }
                })
        },
        beforeUpload() {},
        uploadSuccess(res, file, fileList) {
            // 获取上传的logo
            this.form.paipanImage = 'https://www.hibifsqm.com/' + res.data.path.replace('/var/www/fsnode/static/', '')
        },
        updateStatus() {
            // 更新
            const url = `${this.http}/blog/updateAnswer`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('token')
                },
                body: JSON.stringify({id: this.form.id})
            }).then(response => response.json())
                .then(res => {
                    if (res.code == 200) {
                        this.$Message.success('已更新解答');
                        this.getList();
                        this.modalShow = false;
                    } else {
                        this.$Message.error(res.data);
                    }
                })
        }
    }
}
</script>

<style lang="scss">
.anonymous {
    margin-top: 50px;
    .ellispsis {
        overflow: hidden;    
        text-overflow:ellipsis;    
        white-space: nowrap;
        max-width: 200px;
    }
}
</style>