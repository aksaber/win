<template>
    <div class="home">
        <Header></Header>
        <Layout>
            <Sider width="256" :style="{background: '#191a23', 'min-height': 'calc(100vh - 64px)'}" v-show="isShow">
                <Menu theme="dark" width="auto" open-names="1" @on-select="selectMenu">
                    <Submenu name="1">
                        <template slot="title">
                            <Icon type="ios-navigate"></Icon>
                            <span style="color: #f6ca9d">系统管理</span>
                        </template>
                        <MenuItem name="1-1" to="/blogSharing" style="color: #f6ca9d">博文分享管理</MenuItem>
                        <MenuItem name="1-2" to="/course" style="color: #f6ca9d">博文分类管理</MenuItem>
                        <MenuItem name="1-3" to="/bannerConfig" style="color: #f6ca9d">首页管理</MenuItem>
                        <MenuItem name="1-4" to="/anonymous" style="color: #f6ca9d">匿名占卜管理</MenuItem>
                    </Submenu>
                </Menu>
            </Sider>
            <Icon type="md-menu" class="iconDown" @click="coll" v-show="screenW <= 768" />
            <Layout :style="{padding: '0 24px 24px'}">
                <router-view></router-view>
            </Layout>
        </Layout>
    </div>
</template>

<script>
import Header from './Header'
export default {
    name: 'Home',
    components: { Header },
    data() {
        return {
            screenW: document.body.clientWidth,
            isShow: document.body.clientWidth > 768 ? true : false,
        }
    },
    mounted() {
        
    },
    methods: {
        coll() {
            this.isShow = !this.isShow;
        },
        selectMenu() {
            if (document.body.clientWidth <= 768) {
                this.isShow = false;
            }
        }
    }
}
</script>

<style lang="scss">
@import '../assets/common.css';
.home {
    .ivu-menu-dark {
        background: #191a23;
    }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title {
        background: #191a23;
    }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened {
        background: #101117;
    }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title:hover {
        background: #191a23;
    }
    .ivu-icon {
        color: #f6ca9d;
    }
    .iconDown {
        font-size: 25px;
        position: absolute;
        top: 17px;
        left: 10px;
    }
}
</style>