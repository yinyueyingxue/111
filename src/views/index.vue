<template>
	<div>
		<Header/>
		<router-view />
		<AppFooter/>
	</div>
</template>

<script>
import AppFooter from '@core/layouts/components/AppFooter.vue'
import Header from './home/home/index/header.vue'
import News from './home/home/index/news.vue'
export default {
	components: {
		AppFooter,
		Header,
		News,
  	},
   data() {
        return {
			slide: 0,
			sliding: null
        }
    },
	methods: {
		onSlideStart(slide) {
			this.sliding = true
		},
		onSlideEnd(slide) {
			this.sliding = false
		}
	}
}
</script>

<style>
	.horizontal-menu .header-navbar.navbar-brand-center .navbar-header .navbar-brand .brand-text {
		padding-left: 0rem !important;
		font-weight: 300 !important;
	}

	.horizontal-menu .header-navbar.navbar-fixed {
		background: #1E90F3;
	}
</style>
