<template>
    <div class="home">
        <Header></Header>
        <Layout>
            <Sider width="256" hide-trigger :style="{background: '#191a23', 'min-height': 'calc(100vh - 64px)'}">
                <Menu theme="dark" width="auto" open-names="1">
                    <Submenu name="1">
                        <template slot="title">
                            <Icon type="ios-navigate"></Icon>
                            <span style="color: #f6ca9d">系统管理</span>
                        </template>
                        <MenuItem name="1-1" to="/blogSharing" style="color: #f6ca9d">博文分享</MenuItem>
                        <MenuItem name="1-2" to="/course" style="color: #f6ca9d">课程通知</MenuItem>
                    </Submenu>
                </Menu>
            </Sider>
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
    components: { Header }
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
}
</style>