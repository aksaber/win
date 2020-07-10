<template>
    <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
            <!-- <img class="layout-img" src="https://file.iviewui.com/admin-pro-dist/img/logo-dark.ab519d9f.png"> -->
            <div class="left" style="color: #cccdcf; font-size: 18px">Hibi风水奇门工作坊博客管理后台</div>
            <div class="layout-nav">
                <span style="color: #f6ca9d; cursor: pointer" class="right" @click="logout">
                    退出
                </span>
            </div>
        </Menu>
    </Header>
</template>

<script>
import Cookies from 'js-cookie'
export default {
    name: 'Headers',
    methods: {
        logout() {
            Cookies.remove('hasLogin');
            this.$router.push('/login');
        },
    }
}
</script>

<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-img {
    float: left;
    width: 200px;
    height: 50px;
    margin-left: -35px;
    margin-top: 8px;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
.ivu-layout-header {
    background: #191a23;
}
</style>