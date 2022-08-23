<template>
  <layout-horizontal>

    <router-view />
    <template #navbar="{ toggleVerticalMenuActive }">
      <app-navbar-horizontal-layout-brand />
      <navbar :toggle-vertical-menu-active="toggleVerticalMenuActive" />
    </template>
  </layout-horizontal>
  
</template>

<script>
import LayoutHorizontal from '@core/layouts/layout-horizontal/LayoutHorizontal.vue'
// import AppCustomizer from '@core/layouts/components/app-customizer/AppCustomizer.vue'
// import { $themeConfig } from '@themeConfig'

// import AppFooter from '@core/layouts/components/AppFooter.vue'
import AppNavbarHorizontalLayoutBrand from '@core/layouts/components/app-navbar/AppNavbarHorizontalLayoutBrand.vue'
import Navbar from '../components/Navbar.vue'

export default {
  components: {
    LayoutHorizontal,
    // AppCustomizer,
    Navbar,
    AppNavbarHorizontalLayoutBrand,
  },
  data() {
    return {
      // showCustomizer: $themeConfig.layout.customizer,
    }
  },
}
</script>
