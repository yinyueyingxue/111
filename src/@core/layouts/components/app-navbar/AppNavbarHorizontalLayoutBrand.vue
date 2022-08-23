<template>
  <div class="navbar-header d-xl-block d-none" style="left: calc(5%);">
    <ul class="nav navbar-nav">
      <li class="nav-item" >
        <b-link
          class="navbar-brand"
          to="/"
        >
          <span class="brand-logo">
            <b-img
              :src="appLogoImage"
              alt="logo"
            />
          </span>
          <h2 class="brand-text mb-0">
            {{ appName }}
          </h2>
        </b-link>
      </li>
	  
	  <li class="nav-item" >   
	   <!--  <div
	       class="header-navbar  navbar-horizontal"
	     > -->
	       <horizontal-nav-menu />
	    <!-- </div> -->
	  
	  </li>
    </ul>
	<!-- 
	<ul class="nav navbar-nav">
	  
	  <li class="nav-item" >   
	     
	       <horizontal-nav-menu />
	  </li>
	</ul> -->
  </div>
  
</template>

<script>
import { BLink, BImg } from 'bootstrap-vue'
import { $themeConfig } from '@themeConfig'
import HorizontalNavMenu from '@core/layouts/layout-horizontal/components/horizontal-nav-menu/HorizontalNavMenu.vue'
export default {
  components: {
    BLink,
    BImg,
	HorizontalNavMenu,
  },
  setup() {
    // App Name
    const { appName, appLogoImage } = $themeConfig.app
    return {
      appName,
      appLogoImage,
    }
  },
}
</script>

<style>

</style>
