<template>
  <div>
    <div class="horizontal-layout horizontal-menu navbar-floating footer-static">
      <b-navbar class="header-navbar navbar-shadow align-items-center navbar-brand-center navbar-fixed navbar-expand project-header-bg">
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
                <h2 class="brand-text mb-0" style="color: #fff;">首页</h2>
              </b-link>
            </li>
            <li class="nav-item b-nav-dropdown dropdown">
              <b-link class="navbar-brand" to="/workplace">
                <h2 class="brand-text mb-0" style="color: #fff;" :class="{'tabActive': this.$route.path.indexOf('/workplace') === 0}">工作台</h2>
              </b-link>
            </li>
            <li class="nav-item" v-if="this.$store.state.myRequest.superAdmin" >
              <b-link class="navbar-brand"  @click="toPage('/manage','1443119914595987456')">
                <h2 class="brand-text mb-0" style="color: #fff;" :class="{'tabActive': this.$route.path.indexOf('/manage') === 0}">管理</h2>
              </b-link>
            </li>
            <li class="nav-item">
              <b-link class="navbar-brand" to="/console/help">
                <h2 class="brand-text mb-0" style="color: #fff;" :class="{'tabActive': this.$route.path.indexOf('help') >= 0}">帮助</h2>
              </b-link>
            </li>
          </ul>
        </div>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item>
              <b-nav-item-dropdown right toggle-class="d-flex align-items-center dropdown-user-link" class="dropdown-user">
                <template #button-content>
                  <b-avatar size="40" :src="'data:image/png;base64,'+$store.state.myRequest.userInfo.remark" variant="light-primary"></b-avatar>
				          <span style="margin: 10px;color: #F0FFFF;"> {{$store.state.myRequest.userInfo.name}} </span>
                </template>
                <b-dropdown-item link-class="d-flex align-items-center" @click="logout()">
                  <feather-icon size="16" icon="LogOutIcon" class="mr-50" />
                  <span>注销</span>
                </b-dropdown-item>
              </b-nav-item-dropdown>
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
  </div>
</template>

<script>
import { $themeConfig } from '@themeConfig'
import { urlHttp } from '@/utils/constant'
export default {
  components: {},
  setup() {
    // App Name
    const { appName, appLogoImage } = $themeConfig.app
    return {
      appName,
      appLogoImage,
    }
  },
  mounted() {
  	 this.judgeSuperAdmin()
  },
  // created() {
  //     this.judgeSuperAdmin()
  // },
  methods: {
    logout() {
      this.$store.commit('getToken', '')
      this.$store.commit('getJwtToken', '')
      let that = this
      let _data = {
        curl: $themeConfig.app.apaasHttpUrl + '/Api/ssoLogout',
        url: urlHttp
      }
      that.$store.dispatch('httpPost', _data).then(function (res) {
        window.location.href = res.message
      })
    },

	judgeSuperAdmin() {
    let that = this
    let _data = {
      curl: $themeConfig.app.projectHttpUrl + '/project/judgeSuperAdmin'
    }
    that.$store.dispatch('httpGet', _data).then(function (res) {
      if (res.flag) {
        that.$store.commit('getSuperAdmin',  res.data)
      } else {
        that.$store.commit('getSuperAdmin',  false)
      }
    })
	},

    toPage(rout, modalId) {
      this.$store.commit('modalId', modalId)
      this.$router.replace({
        path: rout
      })
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
    background: #1E90F3;
  }

  .horizontal-menu .header-navbar.navbar-brand-center .navbar-header .navbar-brand .brand-text {
    padding-left: 0 !important;
    font-weight: 300 !important;
  }

  .horizontal-menu .header-navbar.navbar-brand-center .navbar-header .navbar-brand .brand-text:hover {
    border-bottom: 2px solid #fff;
  }

  .tabActive {
    border-bottom: 2px solid #fff;
  }
</style>
