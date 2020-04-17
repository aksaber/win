<template>
    <div class="home">
        <Header></Header>
        <Layout>
            <Sider width="256" hide-trigger :style="{background: '#191a23', 'min-height': 'calc(100vh - 64px)'}">
                <Menu theme="dark" width="auto" open-names="1">
                    <Submenu name="1">
                        <template slot="title">
                            <Icon type="ios-navigate"></Icon>
                            系统管理
                        </template>
                        <MenuItem name="1-1" to="/blogSharing">博文分享</MenuItem>
                        <MenuItem name="1-2" to="/course">课程通知</MenuItem>
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
}
</style>