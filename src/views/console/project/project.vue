<template>

	<div  >
	<Header/>
	<router-view />
	<AppFooter/>
	</div>
</template>

<script>
import AppFooter from '@core/layouts/components/AppFooter.vue'
import Header from './header.vue'
export default {
	components: {
		AppFooter,
		Header,
  },
}
</script>

<style>
.project-header-bg{
  background: #2289f1!important;
}
</style>
