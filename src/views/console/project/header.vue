<template>
	<div>
		<div class="horizontal-layout horizontal-menu navbar-floating footer-static">
			<b-navbar class="header-navbar navbar-shadow align-items-center navbar-brand-center navbar-fixed navbar-expand project-header-bg">

				<div class="navbar-header d-xl-block " style="left: calc(1%);">

					<ul class="nav navbar-nav">
						<li class="nav-item">
							<b-link class="navbar-brand" to="/">
								<span class="brand-logo">
									<b-img :src="appLogoImage" alt="logo" />
								</span>
							</b-link>
						</li>
						<li class="nav-item">
							<b-link class="navbar-brand" @click="toPage('dashboard','1435833682391838720')">
								<h2 class="brand-text mb-0" style="color: #fff;" :class="{'tabActive': this.$route.path.indexOf('/project') === 0}">
									应用
								</h2>
							</b-link>
						</li>
						<li class="nav-item" >
							<b-link class="navbar-brand" to="/apaasLayout">
								<h2 class="brand-text mb-0" style="color: #fff;" :class="{'tabActive': this.$route.path.indexOf('/apaas') === 0}">
									aPaas
								</h2>
							</b-link>
						</li>
						<li class="nav-item">
							<b-link class="navbar-brand" @click="toPage('apiDashboard','1438037449338105856')">
								<h2 class="brand-text mb-0" style="color: #fff;" :class="{'tabActive': this.$route.path.indexOf('/api') === 0}">
									iPaas
								</h2>
							</b-link>
						</li>
						<li class="nav-item">
							<b-link class="navbar-brand" @click="toPage('tenantuser','1435865341375918080')">
								<h2 class="brand-text mb-0" style="color: #fff;" :class="{'tabActive': this.$route.path.indexOf('/manage') === 0}">
									管理
								</h2>
							</b-link>
						</li>
					</ul>
				</div>

				<b-collapse id="nav-collapse" is-nav >
					<b-navbar-nav class="ml-auto align-items-center" >

						<!-- <b-nav-item style="color: #fff;">
							<el-select class="headerSelect" v-model="selected.id" placeholder="请选择" filterable style="width: 270px;background: transparent !important;">
								<el-option v-for="(item, index) in option" :key="index" :value="item.id" :label="item.id + ' ' + item.name" />
							</el-select>
						</b-nav-item> -->

						<b-nav-item style="color: #fff;">
							<b-dropdown :text="projectId" variant="flat-secondary"  style="height: 100%;align-items: center;">
								<b-form-group style="width: 290px; padding: 0 10px; margin-bottom: 0px">
									<!-- <v-select v-model="selected" label="id" :options="option">
										<template #option="{ id, name }">
											<span>{{ id }} {{ name }}</span>
										</template>
										<template #selected-option="{ id, name }">
											<span>{{ id }} {{ name }}</span>
										</template>
									</v-select> -->
									<el-select v-model="projectId" placeholder="请选择" filterable style="width: 270px;background: transparent !important;">
										<el-option v-for="(item, index) in option" :key="index" :value="item.id" :label="item.id + ' ' + item.name" />
									</el-select>
								</b-form-group>
							</b-dropdown>
						</b-nav-item>

						<b-nav-item to="/workplace" >
							<div class="icon-wrapper align-items-center"  >
								<feather-icon color="#fff" icon="HomeIcon" size="21" />
							</div>
						</b-nav-item>

						<b-nav-item  @click="toPage('warnmsg','1435833682391838720')" >
							<div class="icon-wrapper align-items-center"  >
								<feather-icon :badge="errorSize" badge-classes="bg-danger" color="#fff" icon="BellIcon" size="21" />
							</div>
						</b-nav-item>

						<b-nav-item>
							<b-nav-item-dropdown right toggle-class="d-flex align-items-center dropdown-user-link" class="dropdown-user">
								<template #button-content>
									<b-avatar size="40" :src="'data:image/png;base64,'+$store.state.myRequest.userInfo.remark" variant="light-primary"></b-avatar>
									<span style="margin: 10px;color: #F0FFFF;">{{$store.state.myRequest.userInfo.name}}</span>
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
	import vSelect from 'vue-select'

	export default {
		data() {
			return {
				slide: 0,
				sliding: null,
				errorSize: 0,
				selected: {},
				activeProject: "",
				option: [],
				cmdbMap: new Map(),
				projectId: '',
				appNo:'',
			}
		},
		components: {
			vSelect
		},

		watch: {
			selected: function(newValue, oldValue) {
				this.$store.commit('getProjectId', newValue.id)
				this.alarmLogCount()
			},
			projectId: function(newValue, oldValue) {
				this.$store.commit('getProjectId', newValue)
				this.appNo = this.cmdbMap.get(newValue)
				this.alarmLogCount()
			},
			appNo: function(newValue, oldValue) {
				this.$store.commit('cmdbAppNo', newValue)
			}
		},

	  	created() {
		    this.getUserProject()
		},
		methods: {
			getUserProject() {
				let that = this
				let _data = {
					curl: $themeConfig.app.projectHttpUrl + '/project'
				}
				that.$store.dispatch('httpGet', _data).then(function(res) {
					that.option = res.data
					for (const index in that.option) {
					    that.cmdbMap.set(that.option[index].id, that.option[index].cmdbAppNo)
					}
				
					if(that.$store.state.myRequest.projectId == undefined || that.$store.state.myRequest.projectId == ''  ){
						that.$store.commit('getProjectId', that.option[0].id)
						// that.selected = {
						// 	id: that.option[0].id,
						// 	name: that.option[0].name
						// }
						that.projectId = that.option[0].id
						that.appNo = that.option[0].cmdbAppNo
					}else{
						// for (let index = 0; index < that.option.length; index++) {
						// 	if(that.option[index].id === that.$store.state.myRequest.projectId) {
						// 		that.selected = {
						// 			id: that.option[index].id,
						// 			name: that.option[index].name
						// 		}
						// 		return
						// 	}
						// }
						that.projectId = that.$store.state.myRequest.projectId
						that.appNo = that.$store.state.myRequest.appNo
						// that.selected = {
						// 	id: that.$store.state.myRequest.projectId
						// }
					}

					that.activeProject = that.$store.state.myRequest.projectId
				})
			},

			alarmLogCount() {
				let that = this
				let _data = {
					curl:  $themeConfig.app.monitorHttpUrl+'/tbMonitorLog/alarmLogCount/'+this.$store.state.myRequest.projectId
				}
				that.$store.dispatch('httpGet', _data).then(function(res) {
					let count = res.data;
					if (typeof count === 'number' && !isNaN(count)) {
					    if (count >= 99) {
					        count = '99+'
					    }
					   that.errorSize = count
					}
				})
			},

			toPage(rout, modalId) {
				this.$router.push({
					name: rout
				})
				this.$store.commit('modalId', modalId)
			},

			logout(){
				this.$store.commit('getToken', '')
				this.$store.commit('getJwtToken', '')
			    let that = this
			    let _data = {
			    	curl: $themeConfig.app.apaasHttpUrl + '/Api/ssoLogout',
					url: urlHttp
			    }
			    that.$store.dispatch('httpPost', _data).then(function(res) {
			    	 window.location.href = res.message
			    })
			}
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

<style lang="scss">
	@import "~@core/scss/base/themes/bordered-layout.scss";
	@import '~@core/scss/vue/libs/vue-select.scss';

	.navbar-brand {
		margin-right: 1rem !important;
	}

	nav {
		background: #1F7199;
	}

	.btn-flat-secondary {
		color: #fff;
	}

	.header-navbar.navbar-shadow {
		box-shadow: 0 4px 24px 0 rgb(34 41 47 / 0%);
	}

	.btn-flat-secondary:active,
	.btn-flat-secondary.active,
	.btn-flat-secondary:focus {
		color: #FFF;
	}

	.dropdown-toggle::after {

	    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-down'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") !important;
	}


	.btn-flat-secondary:hover {
		color: #FFF !important;
	}

	.horizontal-menu .header-navbar.navbar-brand-center .navbar-header .navbar-brand .brand-text {
		padding-left: 0rem !important;
		font-weight: 300 !important;
	}

	.horizontal-menu .header-navbar.navbar-brand-center .navbar-header .navbar-brand .brand-text:hover {
		border-bottom: 2px solid #fff;
	}

  	.tabActive {
		border-bottom: 2px solid #fff;
	}
	.headerSelect .el-input__inner {
		background-color: #2289f1;
		color: #fff;
		border-color: #2289f1;
		border: 0;
		text-align: right;
	}
	.headerSelect .el-input .el-input__icon {
		color: #fff;
	}
</style>
<style scoped>
.popper__arrow {
	right: 0
}
</style>
