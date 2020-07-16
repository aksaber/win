<template>
    <div class="login">
        <Form :model="form" :label-width="80" class="login-container">
            <h3>Hibi风水奇门工作坊博客管理后台</h3>
            <FormItem prop="account" label="登录账号">
                <Input v-model="form.account" placeholder="登录账号" />
            </FormItem>
            <FormItem prop="password" label="登录密码">
                <Input type="password" password v-model="form.password" placeholder="登录密码" />
            </FormItem>
            <div class="modifyPsd" @click="modalShow = true">修改密码</div>
            <Button type="primary" @click="goLogin">登录</Button>
        </Form>

        <Modal
            v-model="modalShow"
            title="修改密码"
            :loading="closeModal"
            @on-ok="updatePsd"
        >
            <Form :model="form2" :label-width="80" :rules="ruleValidate" ref="refForm">
                <FormItem prop="account" label="登录账号">
                    <Input v-model="form2.account" />
                </FormItem>
                <FormItem prop="password" label="原密码">
                    <Input type="password" password v-model="form2.password" />
                </FormItem>
                <FormItem prop="newpassword" label="新密码">
                    <Input type="password" password v-model="form2.newpassword" />
                </FormItem>
                <FormItem prop="repassword" label="确认密码">
                    <Input type="password" password v-model="form2.repassword" />
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
    name: 'Login',
    data() {
        return {
            form: {
                account: '',
                password: ''
            },
            form2: {
                account: '',
                password: '',
                newpassword: '',
                repassword: ''
            },
            http: 'https://www.hibifsqm.com',
            // http: 'http://localhost:3020',
            modalShow: false,
            ruleValidate: {
                account: [{ required: true, message: '账号不能为空' }],
                password: [{ required: true, message: '原密码不能为空', }],
                newpassword: [{ required: true, message: '新密码不能为空', }],
                repassword: [{ required: true, message: '确认密码不能为空', }]
            },
            closeModal: true,
        }
    },
    methods: {
        goLogin() {
            const url = `${this.http}/blog/login`;
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    account: this.form.account,
                    password: this.form.password
                })
            }).then(response => response.json())
                .then(res => {
                    if (res.code == 200) {
                        Cookies.set('token', res.data);
                        this.$router.push('/');
                    } else {
                        this.$Message.error(res.data);
                    }
                }).catch(err => { console.log(err) })
        },
        updatePsd() {
            this.$refs['refForm'].validate((valid) => {
                if (valid) {
                    const {
                        account,
                        password,
                        newpassword,
                        repassword
                    } = this.form2;
                    if (newpassword !== repassword) {
                        this.$Message.error('两次密码不一致');
                        return;
                    }
                    const url = `${this.http}/blog/updatePsd`;
                    fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            account: account,
                            password: password,
                            newpassword: newpassword
                        })
                    }).then(response => response.json())
                        .then(res => {
                            if (res.code == 200) {
                                this.$Message.success('密码修改成功');
                                this.modalShow = false;
                                this.form2.account = '';
                                this.form2.password = '';
                                this.form2.newpassword = '';
                                this.form2.repassword = '';
                                this.showModal = false;
                            } else {
                                this.$Message.error(res.data);
                                setTimeout(() => {
                                    this.closeModal = false;
                                    this.$nextTick(() => {
                                        this.closeModal = true
                                    })
                                }, 100)
                            }
                        }).catch(err => { console.log(err) })
                } else {
                    setTimeout(() => {
                        this.closeModal = false;
                        this.$nextTick(() => {
                            this.closeModal = true
                        })
                    }, 100)
                }
            })
        }
    }
}
</script>

<style lang="scss">
.login {
    height: 100vh;
    background: #bcd7c4;
    .login-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -70%);
        width: 420px;
        box-sizing: border-box;
        padding: 35px 35px 40px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        border-radius: 5px;
        text-align: center;
        h3 {
            margin: 0 auto 40px auto;
            color: #505458;
        }
        button {
            width: 80%;
        }
    }
    .modifyPsd {
        text-align: right;
        margin-bottom: 17px;
        cursor: pointer;
        font-size: 12px;
        color: cadetblue
    }
}
</style>