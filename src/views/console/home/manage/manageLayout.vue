<template>
  <div>
    <el-container style="padding-top:60px;">
      <el-aside align="center" style="padding-top:10px;position: fixed;width: 13.25rem;">
        <div class="vertical-layout vertical-menu-modern menu-expanded navbar-floating footer-static">
          <VerticalNavMenu 
            :items="navMenuItems" 
            :is-vertical-menu-active="isVerticalMenuActive" 
            :toggle-vertical-menu-active="toggleVerticalMenuActive"
          ></VerticalNavMenu>
        </div>
      </el-aside>
      <el-main position="relative" style="margin-left: 12.25rem">
        <router-view v-if="isRouterAlive"/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { $themeConfig } from '@themeConfig'
import VerticalNavMenu from '@core/layouts/layout-vertical/components/vertical-nav-menu/VerticalNavMenu.vue'
import { onUnmounted } from '@vue/composition-api'
import useAppConfig from '@core/app-config/useAppConfig'
import useVerticalLayout from '@core/layouts/layout-vertical/useVerticalLayout'

export default {
  provide() {
    return {
      reload: this.reload
    }
  },
  components: {
    VerticalNavMenu,
  },
  data() {
    return {
      isRouterAlive: true,
      navMenuItems: [],
    }
  },
  computed: {
    modelChange() {
      return this.$store.state.myRequest.modalId
    },
    projectChange() {
      return this.$store.state.myRequest.projectId
    }
  },
  watch: {
    modelChange: function (newValue, oldValue) {
      this.reload()
      this.getUserProject()
    },
    projectChange: function (newValue, oldValue) {
      this.reload()
      this.getUserProject()
    },
  },
  created() {
    this.getUserProject()
  },

  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    getUserProject() {
      let that = this

      let _data = {
        curl: $themeConfig.app.projectHttpUrl + '/project/getAccountNsSource',
        projectId: this.$store.state.myRequest.projectId,
        type: 0,
        pid: this.$store.state.myRequest.modalId
      }
      that.$store.dispatch('httpGet', _data).then(function (res) {
        that.navMenuItems = res.data.list
      })
    },
    handleNodeClick(data) {
      console.log('aaaa')
    }
  },

  setup() {
    const {
      routerTransition,
      navbarBackgroundColor,
      navbarType,
      footerType,
      isNavMenuHidden,
    } = useAppConfig()

    const {
      isVerticalMenuActive,
      toggleVerticalMenuActive,
      isVerticalMenuCollapsed,
      layoutClasses,
      overlayClasses,
      resizeHandler,
      navbarTypeClass,
      footerTypeClass,
    } = useVerticalLayout(navbarType, footerType)

    // Resize handler
    resizeHandler()
    window.addEventListener('resize', resizeHandler)
    onUnmounted(() => {
      window.removeEventListener('resize', resizeHandler)
    })

    return {
      isVerticalMenuActive,
      toggleVerticalMenuActive,
      isVerticalMenuCollapsed,
      overlayClasses,
      layoutClasses,
      navbarTypeClass,
      footerTypeClass,

      // App Config
      routerTransition,
      navbarBackgroundColor,
      isNavMenuHidden,
    }
  },

}
</script>

<style>
  .main-menu.menu-light .navigation {
    background: #fff00000;
  }

  .main-menu.menu-light {
    background: #fff00000;
  }

  .main-menu.menu-fixed {
    position: unset !important;
  }

  ul,
  li {
    display: block;
  }

  .main-menu.menu-shadow {
    box-shadow: 0 0 15px 0 rgb(34 41 47 / 2%);
  }
</style>

