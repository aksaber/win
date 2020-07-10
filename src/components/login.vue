<template>
    <div class="login">
        <Form :model="form" :label-width="80" class="login-container">
            <h3>Hibi风水奇门工作坊博客管理后台</h3>
            <FormItem prop="account" label="登录账号">
                <Input v-model="form.account" />
            </FormItem>
            <FormItem prop="password" label="登录密码">
                <Input type="password" password v-model="form.password" />
            </FormItem>
            <Button type="primary" @click="goLogin">登录</Button>
        </Form>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
    name: 'Login',
    data() {
        return {
            form: {
                account: 'admin',
                password: '123456'
            },
            http: 'https://www.hibifsqm.com',
            // http: 'http://localhost:3020',
        }
    },
    methods: {
        goLogin() {
            const url = `${this.http}/blog/login`;
            Cookies.set('hasLogin', '1');
                        this.$router.push('/');
                        return
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
                        Cookies.set('hasLogin', '1');
                        this.$router.push('/');
                    } else {
                        this.$Message.error(res.data);
                    }
                }).catch(err => { console.log(err) })
        },
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
}
</style>