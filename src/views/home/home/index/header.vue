<template>
    <div>
        <div class="horizontal-layout horizontal-menu navbar-floating footer-static">
            <b-navbar
                    class="header-navbar navbar-shadow align-items-center navbar-brand-center navbar-fixed navbar-expand"
                    style="padding:0.5rem;height: 60px;">
                <div class="navbar-header d-xl-block " style="left: calc(1%);">
                    <ul class="nav navbar-nav">
                        <li class="nav-item">
                            <b-link class="navbar-brand" to="/">
								<span class="brand-logo">
									<b-img :src="appLogoImage" alt="logo"/>
								</span>
                            </b-link>
                        </li>
                        <li class="nav-item b-nav-dropdown dropdown">
                            <b-link class="navbar-brand" to="/">
                                <h2 class="brand-text mb-0" style="color: #fff;"
                                    :class="{'tabActive': this.$route.path.indexOf('/index') === 0}">首页</h2>
                            </b-link>
                        </li>

                        <li class="nav-item">
                            <b-link class="navbar-brand" to="/apaas">
                                <h2 class="brand-text mb-0" style="color: #fff;"
                                    :class="{'tabActive': this.$route.path.indexOf('/apaas') === 0}">组件集市</h2>
                            </b-link>
                        </li>
                        <li class="nav-item">
                            <b-link class="navbar-brand" to="/api">
                                <h2 class="brand-text mb-0" style="color: #fff;"
                                    :class="{'tabActive': this.$route.path.indexOf('/api') === 0}">API集市</h2>
                            </b-link>
                        </li>
                        <li class="nav-item">
                            <b-nav-item-dropdown
                                    toggle-class="d-flex align-items-center dropdown-user-link"
                                    class="dropdown-user"
                            style="margin-right: 1rem">
                                <template #button-content>
                                    <h2  class="developClass">应用开发</h2>
                                </template>
                                <b-dropdown-item link-class="d-flex align-items-center"  target="_blank" href="http://dev.eos.h3c.com/">

                                    <span>开发指导和规范</span>
                                </b-dropdown-item>
                                <b-dropdown-item link-class="d-flex align-items-center"  target="_blank" href="http://cli.eos.h3c.com/">

                                    <span>脚手架选配</span>
                                </b-dropdown-item>
                              <b-dropdown-item link-class="d-flex align-items-center" disabled target="_blank" >

                                <span>前端APM</span>
                              </b-dropdown-item>
                              <b-dropdown-item link-class="d-flex align-items-center" disabled target="_blank" >

                                <span>原型设计</span>
                              </b-dropdown-item>
                              <b-dropdown-item link-class="d-flex align-items-center" disabled target="_blank" >

                                <span>数据库设计</span>
                              </b-dropdown-item>
                              <b-dropdown-item link-class="d-flex align-items-center" disabled target="_blank" >

                                <span>低代码平台</span>
                              </b-dropdown-item>
                              <b-dropdown-item link-class="d-flex align-items-center" disabled target="_blank" >

                                <span>开发及测试辅助</span>
                              </b-dropdown-item>
                            </b-nav-item-dropdown>
                        </li>
                        <li class="nav-item">
                            <b-link class="navbar-brand" to="/help">
                                <h2 class="brand-text mb-0" style="color: #fff;"
                                    :class="{'tabActive': this.$route.path.indexOf('help') >= 0}">帮助</h2>
                            </b-link>
                        </li>


                    </ul>
                </div>
                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav class="ml-auto">
                        <!-- 搜索 -->
                        <!-- <b-nav-form >
                            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                        </b-nav-form> -->
                        <b-nav-item to="/workplace">
                            <div class="d-sm-flex d-none user-nav">
                                <feather-icon size="21" color="#fff" icon="MonitorIcon" class="mr-50"/>
                                <p class="user-name font-weight-bolder mb-0" style="color: #fff;">控制台</p>
                            </div>
                        </b-nav-item>
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
        </div>
    </div>
</template>

<script>
    import {
        $themeConfig
    } from '@themeConfig'

    export default {
        components: {},
        setup() {
            // App Name
            const {appName, appLogoImage} = $themeConfig.app
            return {
                appName,
                appLogoImage,
            }
        },
        data() {
            return {
                showDoc: 2
            }
        }
    }
</script>

<style lang="scss">
    @import "~@core/scss/base/themes/bordered-layout.scss";


    .navbar-brand {
        margin-right: 1rem !important;
    }

    nav {
        background: #1F7199;
    }

    .header-navbar.navbar-shadow {
        box-shadow: 0 4px 24px 0 rgb(34 41 47 / 0%);
    }

    .horizontal-menu .header-navbar.navbar-brand-center .navbar-header .navbar-brand .brand-text {
        padding-left: 0rem !important;
        font-weight: 0 !important;
    }

    .horizontal-menu .header-navbar.navbar-brand-center .navbar-header .navbar-brand .brand-text:hover {
        border-bottom: 2px solid #fff;
    }

    .tabActive {
        border-bottom: 2px solid #fff;
    }
    .developClass {
        font-size:1.45rem;
        margin-top: -2px;
        color: rgb(255, 255, 255);
        letter-spacing: 0.01rem;
        font-weight:300 !important;
        margin: -5px;
    }

</style>
