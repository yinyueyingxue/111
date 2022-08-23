<template>

	<div>
		<el-container style="padding-top:60px;">
			<el-aside align="center" style="padding-top:10px;position: fixed;width: 13.25rem;">
				<div class="vertical-layout vertical-menu-modern menu-expanded navbar-floating footer-static">
					<VerticalNavMenu :items="navMenuItems" :is-vertical-menu-active="isVerticalMenuActive"
					 :toggle-vertical-menu-active="toggleVerticalMenuActive">
					</VerticalNavMenu>
				</div>
			</el-aside>
			<el-main position="relative" style="margin-left: 12.25rem">
				<router-view v-if="isRouterAlive" />
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
							// that.$router.replace({
							// 	name: tmpItem.route
							// 	})
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
