<template>

	<div>
		<el-container >
			<el-main position="relative" style="padding: 1rem 0" >
				<router-view v-if="isRouterAlive" style="margin-top: 4rem" />
			</el-main>
		</el-container>
	</div>
</template>

<script>
	import {
		$themeConfig
	} from '@themeConfig'
	import AppFooter from '@core/layouts/components/AppFooter.vue'
	import VerticalNavMenu from '@core/layouts/layout-vertical/components/vertical-nav-menu/VerticalNavMenu.vue'
	import {
		onUnmounted
	} from '@vue/composition-api'
	import useAppConfig from '@core/app-config/useAppConfig'
	import useVerticalLayout from '@core/layouts/layout-vertical/useVerticalLayout'
	export default {
		provide(){
		    return{
		      reload:this.reload
		    }
		  },
		components: {
			VerticalNavMenu,
		},
		data() {
			return {
				isRouterAlive:true,
				navMenuItems:[],
				updateFlag: false,
				deleteFlag: false
			};
		},
		computed:{
			modalChange(){
				return this.$store.state.myRequest.modalId
			},
			projectChange(){
				return this.$store.state.myRequest.projectId
			}
		},
		watch: {
			modalChange: function(newValue, oldValue) {
				this.reload()
				this.getUserProject(1);
			},
			projectChange: function(newValue, oldValue) {
				this.$router.push({
					path:'/apaas/index'
				})
				this.reload()
				this.getUserProject(0);
			},

		},
		created() {
			this.getUserProject(0);
		},
		methods: {
			reload (){
			       this.isRouterAlive = false
			       this.$nextTick(function(){
			          this.isRouterAlive = true
			       })
			    },
			getUserProject(type) {
				let that = this
				let _data = {
                    curl: $themeConfig.app.projectHttpUrl + '/project/getAccountNsSource',
					projectId: this.$store.state.myRequest.projectId,
					type: 0,
					pid: this.$store.state.myRequest.modalId
				}
				that.$store.dispatch('httpGet', _data).then(function(res) {

					if(res.data && res.data.list.length > 0){
						that.navMenuItems = res.data.list
						if(res.data.routs.indexOf(that.$route.name) != -1){
							return
						}
						if(type == 1){
							let tmpItem = that.getFirstNode(that.navMenuItems[0])
							that.$router.replace({
								name: tmpItem.route
								})
							}
					}else{
						that.navMenuItems = []
						that.$router.push({
							name: "404"
						})
					}
				})
			},
        getFirstNode(item,routerPath){
				if(item.children){
				   return this.getFirstNode(item.children[0])
				}
				return item
			},
		handleNodeClick(data) {
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
