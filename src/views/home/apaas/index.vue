<template>
	<div style="padding-top:60px;position: relative;bottom: 30px;">
		<div  class="icon-card" style="margin: 10px;" >
			<b-row style="padding-left: 60px;padding-right: 80px;padding-top: 20px;">
				<b-col md="8">
					<b-card-body style="margin-top: 10vh;">
						<b-card-text>
							<div>
								<div style="font-size: 24px;line-height: calc(20px);">
									<p>共享&nbsp;&nbsp;·&nbsp;&nbsp;集成&nbsp;&nbsp;·&nbsp;&nbsp;高效</p>
									<h1 style="color: #5e5873; font-size: 36px; line-height: 48px;">
										<strong style="font-weight: 450;">开箱即用的应用开发组件</strong>
									</h1>
									<h3 style="color: #5e5873; font-size: 18px; line-height: 28px;">
										组织整合、集成优化公共资源，提供共享共用的基础服务，减少重复投入、提高资源利用效率。
									</h3>
								</div>
							</div>
						</b-card-text>
					</b-card-body>
				</b-col>
        		<b-col md="1"></b-col>
				<b-col md="3">
					<b-card-img :src="require('@/assets/images/logo/model.gif')" class="rounded-0"></b-card-img>
				</b-col>
			</b-row>
			<hr>
		</div>

		<div style="margin: 10px;" class="apaasModule">
			<!-- <b-row class="mb-3" style="margin: 10px;">
				<b-col md="3" style="padding: 15px">
					<b-card no-body class="overflow-hidden cardborder" @click="toHelp('19400278d4af78311e635ad2b60908d6439feee2610230efca4155e68f6187b3bccbb0dd70028e16eb33c3e58c9af140')">
						<b-row no-gutters>
							<b-col md="6">
								<b-card-body title="数据总线">
									<b-card-text>提供面开发,弹性可视的数据接口服务</b-card-text>
								</b-card-body>
							</b-col>
							<b-col md="6">
								<b-card-img :src="require('@/assets/images/flags/dataline.png')" class="rounded-0"></b-card-img>
							</b-col>
						</b-row>
					</b-card>
				</b-col>
				<b-col md="3" style="padding: 15px">
					<b-card no-body class="overflow-hidden cardborder" @click="toHelp('19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e68d3b383e34b07ad44')">
						<b-row no-gutters>
							<b-col md="6">
								<b-card-body title="应用访问统计服务">
									<b-card-text>
										服务访问统计,
										每一次访问有迹可循
									</b-card-text>
								</b-card-body>
							</b-col>
							<b-col md="6">
								<b-card-img :src="require('@/assets/images/flags/total.png')" class="rounded-0"></b-card-img>
							</b-col>
						</b-row>
					</b-card>
				</b-col>
				<b-col md="3" style="padding: 15px">
					<b-card no-body class="overflow-hidden cardborder" @click="toHelp('19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e681d1cc7eb4d6fc4b1')">
						<b-row no-gutters>
							<b-col md="6">
								<b-card-body title="高密数据服务">
									<b-card-text>提供高密数据加密服务，保证数据安全,防篡改</b-card-text>
								</b-card-body>
							</b-col>
							<b-col md="6">
								<b-card-img :src="require('@/assets/images/flags/secret.png')" class="rounded-0"></b-card-img>
							</b-col>
						</b-row>
					</b-card>
				</b-col>
				<b-col md="3" style="padding: 15px">
					<b-card no-body class="overflow-hidden cardborder" @click="toHelp('19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e68342115b286b8d687')">
						<b-row no-gutters>
							<b-col md="6">
								<b-card-body title="消息中心">
									<b-card-text>消息信息模板化,统一化处理,信息标准化管理</b-card-text>
								</b-card-body>
							</b-col>
							<b-col md="6">
								<b-card-img :src="require('@/assets/images/flags/code.png')" class="rounded-0"></b-card-img>
							</b-col>
						</b-row>
					</b-card>
				</b-col>

				<b-col md="3" style="padding: 15px">
					<b-card no-body class="overflow-hidden cardborder" @click="toHelp('19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e68ab4c918dd55f8cb0')">
						<b-row no-gutters>
							<b-col md="6">
								<b-card-body title="分布式调度中心">
									<b-card-text style="color: #6e6b7b;">集中管理定时任务，自动化调度,可视化管理</b-card-text>
								</b-card-body>
							</b-col>
							<b-col md="6">
								<b-card-img :src="require('@/assets/images/flags/dcs.png')" class="rounded-0"></b-card-img>
							</b-col>
						</b-row>
					</b-card>
				</b-col>
				<b-col md="3" style="padding: 15px">
					<b-card no-body class="overflow-hidden cardborder" @click="toHelp('')">
						<b-row no-gutters>
							<b-col md="6">
								<b-card-body title="配置中心">
									<b-card-text>集中配置管理，动态修改配置，助您快速搭建服务应用</b-card-text>
								</b-card-body>
							</b-col>
							<b-col md="6">
								<b-card-img :src="require('@/assets/images/flags/settings.png')" class="rounded-0"></b-card-img>
							</b-col>
						</b-row>
					</b-card>
				</b-col>
			</b-row> -->
			<div class="moduleBody">
                <!-- <div style="display: flex; flex-wrap: wrap;">
                    <div 
						v-for="(moduleItem, index) in moduleData" 
						:key="moduleItem.id"
                        @click="toHelp(moduleItem.helpUrl)"
                        class="employee-task d-flex justify-content-between align-items-center moduleBodyItem"
					>
                        <b-media no-body>
                            <b-media-aside class="mr-75">
                                <b-avatar :variant="moduleItem.color" size="60" style="font-size:3rem;"  >
                                    <e-icon :icon-name="moduleItem.avatar" />
                                </b-avatar>
                            </b-media-aside>

                            <b-media-body class="my-auto">
                                <h5 style="font-weight: bold; margin-bottom: 10px; text-align: left">{{
                                    moduleItem.userFullName }}</h5>
                                <small>{{ moduleItem.designation }}</small>
                            </b-media-body>
                        </b-media>

                        <div class="d-flex align-items-center">
                            <small class="text-muted">使用次数：</small>
                            <small class="text-muted mr-75">{{ moduleItem.duration }}</small>

                            <vue-apex-charts type="radialBar" height="30" width="30" :options="chartData[index].options" :series="chartData[index].series" />
                        </div>
                    </div>
                </div> -->
				<b-row no-gutters>
                    <b-col md="6" v-for="moduleItem in moduleData" :key="moduleItem.id">
                        <div
                            @click="toHelp(moduleItem.helpUrl)"
                            class="employee-task d-flex justify-content-between align-items-center moduleBodyItem">
                            <b-media no-body>
                                <b-media-aside class="mr-75">
                                    <b-avatar :variant="moduleItem.color" size="60" style="font-size:3rem;"  >
                                        <e-icon :icon-name="moduleItem.avatar" />
                                    </b-avatar>
                                <!-- <b-avatar variant="light-success" size="84" :src="moduleItem.avatar"/> -->
                                </b-media-aside>

                                <b-media-body class="my-auto">
                                    <h5 style="font-weight: bold; margin-bottom: 10px; text-align: left">{{
                                        moduleItem.userFullName }}</h5>
                                    <small>{{ moduleItem.designation }}</small>
                                </b-media-body>
                            </b-media>

                            <div class="d-flex align-items-center" style="margin-left: 10px">
                                <small class="text-muted">{{ moduleNumData[moduleItem.id] ? moduleNumData[moduleItem.id].desc : '' }}</small>
                                <small class="text-muted mr-75">{{ moduleNumData[moduleItem.id] ? moduleNumData[moduleItem.id].count : 0}}</small>

                                <!-- <vue-apex-charts type="radialBar" height="30" width="30" :options="moduleItem.options" :series="moduleItem.series" slot=""/> -->
                            </div>
                        </div>
                    </b-col>
                </b-row>
			</div>
		</div>
	</div>
</template>

<script>
import {EIcon} from 'e-icon-picker';
import VueApexCharts from 'vue-apexcharts'
import { $themeConfig } from '@themeConfig'
export default {
	components: {
		VueApexCharts,
        EIcon
	},
	data() {
		return {
			moduleData: [
                {
					id: 'api',
					color:'danger',
					// avatar: require('@/assets/images/flags/dataline.png'),
					avatar: 'el-icon-lock',
					userFullName: '数据总线',
					designation: '提供面开发,弹性可视的数据接口服务',
					duration: '0',
					// http://help.eos.h3c.com/article.html?token=19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e688b9b40bb89ad979c
					helpUrl: '19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e688b9b40bb89ad979c',
					series: [0],
					options: {
						grid: {
							show: false,
							padding: {
								left: -15,
								right: -15,
								top: -12,
								bottom: -15,
							},
						},
						colors: ['#ea5455'],
						plotOptions: {
							radialBar: {
								hollow: {
									size: '22%',
								},
								track: {
									background: '#e9ecef',
								},
								dataLabels: {
									showOn: 'always',
									name: {
										show: false,
									},
									value: {
										show: false,
									},
								},
							},
						},
						stroke: {
							lineCap: 'round',
						},
					},
				}, {
					id: 'app',
					color:'info',
					// avatar: require('@/assets/images/flags/total.png'),
					avatar: 'el-icon-s-marketing',
					userFullName: '应用访问统计',
					designation: '服务访问统计,每一次访问有迹可循',
					duration: '0',
					// http://help.eos.h3c.com/article.html?token=19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e68d3b383e34b07ad44
					helpUrl: '19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e68d3b383e34b07ad44',
					
				}, {
					id: 'encry',
					color:'secondary',
					// avatar: require('@/assets/images/flags/secret.png'),
					avatar: 'el-icon-lock',
					userFullName: '数据安全服务',
					designation: '提供高密数据加密服务，保证数据安全,防篡改',
					duration: '0',
					// http://help.eos.h3c.com/article.html?token=19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e681d1cc7eb4d6fc4b1
					helpUrl: '19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e681d1cc7eb4d6fc4b1',
					
				}, {
					id: 'msg',
					color:'success',
					// avatar: require('@/assets/images/flags/code.png'),
					avatar: 'el-icon-chat-dot-square',
					userFullName: '消息中心',
					designation: '消息信息模板化,统一化处理,信息标准化管理',
					duration: '0',
					// http://help.eos.h3c.com/article.html?token=19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e68342115b286b8d687
					helpUrl: '19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e68342115b286b8d687',
				}, {
					id: 'xxl',
					color:'warning',
					// avatar: require('@/assets/images/flags/dcs.png'),
					avatar: 'el-icon-set-up',
					userFullName: '分布式调度中心',
					designation: '集中管理定时任务，自动化调度,可视化管理',
					duration: '0',
					// http://help.eos.h3c.com/article.html?token=19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e68ab4c918dd55f8cb0
					helpUrl: '19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e68ab4c918dd55f8cb0',
				}, {
					id: 'nacos',
					color:'primary',
					// avatar: require('@/assets/images/flags/settings.png'),
					avatar: 'el-icon-setting',
					userFullName: '配置中心',
					designation: '集中配置管理，动态修改配置，助您快速搭建服务应用',
					duration: '0',
					// http://help.eos.h3c.com/article.html?token=19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e68ca57c50443855ce8
					helpUrl: '19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e68ca57c50443855ce8',
				}
			],
			moduleNumData: {}
		}
	},
	created() {
		this.getModuleData()
	},
	methods: {
		toHelp(helpPath) {
			this.$router.push({
				path: '/help',
				query: {
					'path': helpPath
				}
			})
		},
		getModuleData() {
			let that = this
			let _data = {
				curl: $themeConfig.app.projectHttpUrl + '/project/componentData'
			}
			that.$store.dispatch('httpGet', _data).then(function (res) {
				that.moduleNumData = res.data
				// let bigNum = 0
				// for (const key in res.data) {
				// 	if (Object.hasOwnProperty.call(res.data, key)) {
				// 		bigNum = (res.data[key] ? res.data[key] : 0) > bigNum ? res.data[key] : bigNum
				// 	}
				// }
				// that.moduleData[0].series[0] = (100 / bigNum) * (res.data.apiCount ? res.data.apiCount : 0)
				// that.moduleData[0].duration = (res.data.apiCount ? res.data.apiCount : 0)
				// that.moduleData[1].series[0] = (100 / bigNum) * (res.data.appCount ? res.data.appCount : 0)
				// that.moduleData[1].duration = (res.data.appCount ? res.data.appCount : 0)
				// that.moduleData[2].series[0] = (100 / bigNum) * (res.data.dataCount ? res.data.dataCount : 0)
				// that.moduleData[2].duration = (res.data.dataCount ? res.data.dataCount : 0)
				// that.moduleData[3].series[0] = (100 / bigNum) * (res.data.msgCount ? res.data.msgCount : 0)
				// that.moduleData[3].duration = (res.data.msgCount ? res.data.msgCount : 0)
				// that.moduleData[4].series[0] = (100 / bigNum) * (res.data.xxlCount ? res.data.xxlCount : 0)
				// that.moduleData[4].duration = (res.data.xxlCount ? res.data.xxlCount : 0)
				// that.moduleData[5].series[0] = (100 / bigNum) * (res.data.nacosCount ? res.data.nacosCount : 0)
				// that.moduleData[5].duration = (res.data.nacosCount ? res.data.nacosCount : 0)
			})
		}
	}
}
</script>

<style>
	/* .cardborder{} */
	.card.cardborder:hover {
		border: 1px solid #0000FF;
	}
	
	.card.cardborder {
		border: 1px solid #0000FF00;
		height: 100%;
	}

	/*.card.icon-card.text-center {*/
	/*	border: 1px solid #0000FF00;*/
	/*}*/

	/*.card.icon-card.text-center:hover {*/

	/*	border: 1px solid rgba(34, 41, 47, 0.125);*/
	/*}*/
	.apaasModule .moduleBody {
		background-color: #fff;
		padding: 20px;
	}
	.apaasModule .moduleBodyItem {
        /* width: 50%; */
        padding: 15px;
        cursor: pointer;
        border: 1px solid #fff;
        border-radius: 5px;
    }
    .apaasModule .moduleBodyItem:hover {
        border-color: #7289fa;
        background-color: #eef1f6;
    }

    .apaasModule .moduleBodyItem:nth-child(odd) {
        padding-right: 20px;
    }

    .moduleBodyItem:nth-child(even) {
        padding-left: 20px;
    }
</style>
