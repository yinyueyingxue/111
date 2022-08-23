<template>
    <div align="center">
        <div style="padding-top:6rem;background-color: #1E90F3;">
            <b-carousel
                id="carousel-1"
                :interval="4000"
                controls
                indicators
                style="text-shadow: 1px 1px 2px #333;background: #1E90F3;"
            >
                <b-carousel-slide
                    :img-src="require('@/assets/images/background/background-image.png')"
                    style="text-align: left;"
                >
                    <b-jumbotron style="text-align: left;background-color: #ededed00;top:-7rem">
                        <h1 class="display-3">云原生时代 你准备好了吗</h1>
                        <h2 class="display-5">多语言支持 动态扩容
                            <br/>
                            打造一站式的微服务开发与运营体验
                        </h2>
                        <b-button variant="info" href="#" @click="() => { this.$router.push({path: '/help'})}">马上了解
                        </b-button>
                    </b-jumbotron>
                </b-carousel-slide>
            </b-carousel>
        </div>

        <News :newsData="noticeList"/>

        <div style="margin: 10px;background-color: #FFF; width: 75%;" align="center">
            <h1 align="center" style="padding-top:15px; font-weight: bold">一站式服务部署平台</h1>
            <b-jumbotron style="background-color: #fff;">
                <b-tabs pills align="right" style="padding:20px; text-align: left;">
                    <b-tab active title="标准化流程" style="margin-top: 20px">
                        <b-row align-v="start">
                            <b-col md="4" align-self="center" style="margin: 0 50px">
                                <img :src="require('@/assets/images/flags/reason-1.png')" width="100%"/>
                            </b-col>
                            <b-col>
                                <h4 style="font-weight: bold">主流工具链、可视化流水线</h4>
                                <br>
                                <p><span class="bullet bullet-sm mr-1 bullet-primary"></span>支持Gitlab、SVN等主流代码管理工具</p>
                                <p><span class="bullet bullet-sm mr-1 bullet-primary"></span>提供可视化交付流水线管理</p>
                                <p><span class="bullet bullet-sm mr-1 bullet-primary"></span>深度整合研发工具链，一站式微服务体验，降低接入成本
                                </p>
                                <p><span class="bullet bullet-sm mr-1 bullet-primary"></span>提供统计分析模型，支持效率度量与持续改进</p>
                            </b-col>
                        </b-row>
                    </b-tab>
                    <b-tab title="高可用容器" style="margin-top: 20px">
                        <b-row align-v="start">
                            <b-col md="4" align-self="center" style="margin: 0 50px">
                                <img :src="require('@/assets/images/flags/reason-2.png')" width="100%"/>
                            </b-col>
                            <b-col>
                                <h4 style="font-weight: bold">滚动升级与回退、蓝绿发布不停产</h4>
                                <br>
                                <p><span class="bullet bullet-sm mr-1 bullet-primary"></span>采用滚动升级的方式对应用进行升级，支持蓝绿发布不停产
                                </p>
                                <p><span class="bullet bullet-sm mr-1 bullet-primary"></span>在线快速对服务节点扩容，提升高可用及负载能力</p>
                                <p><span class="bullet bullet-sm mr-1 bullet-primary"></span>基于容器标准化，无需关注服务器环境</p>
                            </b-col>
                        </b-row>
                    </b-tab>
                    <b-tab title="可视化运营" style="margin-top: 20px">
                        <b-row align-v="start">
                            <b-col md="4" align-self="center" style="margin: 0 50px">
                                <img :src="require('@/assets/images/flags/reason-2-1.png')" width="100%"/>
                            </b-col>
                            <b-col>
                                <h4 style="font-weight: bold">服务运营指标可视化</h4>
                                <br>
                                <p><span class="bullet bullet-sm mr-1 bullet-primary"></span>系统日志在线分析</p>
                                <p><span class="bullet bullet-sm mr-1 bullet-primary"></span>系统节点状态、流量、CPU、内存、SLA、慢请求可视化
                                </p>
                                <p><span class="bullet bullet-sm mr-1 bullet-primary"></span>APM集成，主动监控告警</p>
                            </b-col>
                        </b-row>
                    </b-tab>
                </b-tabs>
            </b-jumbotron>
        </div>

        <div style="margin: 10px; width: 75%; background-color: #fff;" align="center" class="mb-3">
            <!-- <h1 align="center" style="padding:25px 10px; font-weight: bold">开箱即用的组件</h1>
            <b-row style="width: 100%; text-align: left;">
              <b-col md="4" style="padding: 15px">
                <b-card no-body class="overflow-hidden cardborder" @click="toHelp('19400278d4af78311e635ad2b60908d6439feee2610230efca4155e68f6187b3bccbb0dd70028e16eb33c3e58c9af140')">
                  <b-row no-gutters>
                    <b-col md="6">
                      <b-card-img-lazy :src="require('@/assets/images/flags/dataline.png')" class="rounded-0"></b-card-img-lazy>
                    </b-col>
                    <b-col md="6" class="flexImg">
                      <b-card-body title="数据总线">
                        <b-card-text style="color: #6e6b7b;">
                          提供面开发,弹性可视的数据接口服务
                        </b-card-text>
                      </b-card-body>
                    </b-col>
                  </b-row>

                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <b-card-img-lazy :src="require('@/assets/images/flags/dataline.png')" class="rounded-0 imgWidth"></b-card-img-lazy>
                  </div>
                  <b-card-body title="数据总线" style="text-align: center">
                    <b-card-text style="color: #6e6b7b;">
                      提供面开发,弹性可视的数据接口服务
                    </b-card-text>
                  </b-card-body>
                </b-card>
              </b-col>
              <b-col md="4" style="padding: 15px">
                <b-card no-body class="overflow-hidden cardborder" @click="toHelp('19400278d4af78319288f0a0bfa8055ec5ec40903f0fe1dc6ef4f7aca4a4486cde366563f0ec5506596f4f55140ca99b319c00dd2f1dddaf2c5ff247279001e1')">
                  <b-row no-gutters>
                    <b-col md="6">
                      <b-card-img-lazy :src="require('@/assets/images/flags/total.png')" class="rounded-0"></b-card-img-lazy>
                    </b-col>
                    <b-col md="6" class="flexImg">
                      <b-card-body title="应用访问统计">
                        <b-card-text style="color: #6e6b7b;">
                          服务访问统计,
                          每一次访问有迹可循
                        </b-card-text>
                      </b-card-body>
                    </b-col>
                  </b-row>

                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <b-card-img-lazy :src="require('@/assets/images/flags/total.png')" class="rounded-0 imgWidth"></b-card-img-lazy>
                  </div>
                  <b-card-body title="应用访问统计" style="text-align: center">
                    <b-card-text style="color: #6e6b7b;">
                      服务访问统计,
                      每一次访问有迹可循
                    </b-card-text>
                  </b-card-body>
                </b-card>
              </b-col>
              <b-col md="4" style="padding: 15px">
                <b-card no-body class="overflow-hidden cardborder" @click="toHelp('19400278d4af78319288f0a0bfa8055ec5ec40903f0fe1dc6ef4f7aca4a4486cde366563f0ec5506596f4f55140ca99b319c00dd2f1dddaf64d3df1d5c098d97')">
                  <b-row no-gutters>
                    <b-col md="6">
                      <b-card-img-lazy :src="require('@/assets/images/flags/secret.png')" class="rounded-0"></b-card-img-lazy>
                    </b-col>
                    <b-col md="6" class="flexImg">
                      <b-card-body title="高密数据服务">
                        <b-card-text style="color: #6e6b7b;">
                          提供高密数据加密服务，保证数据安全,防篡改
                        </b-card-text>
                      </b-card-body>
                    </b-col>
                  </b-row>

                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <b-card-img-lazy :src="require('@/assets/images/flags/secret.png')" class="rounded-0 imgWidth"></b-card-img-lazy>
                  </div>
                  <b-card-body title="高密数据服务" style="text-align: center">
                    <b-card-text style="color: #6e6b7b;">
                      提供高密数据加密服务，保证数据安全,防篡改
                    </b-card-text>
                  </b-card-body>
                </b-card>
              </b-col>
              <b-col md="4" style="padding: 15px">
                <b-card no-body class="overflow-hidden cardborder" @click="toHelp('19400278d4af78319288f0a0bfa8055ec5ec40903f0fe1dc6ef4f7aca4a4486cde366563f0ec5506596f4f55140ca99b319c00dd2f1dddaf4226a7f7dbff5b47')">
                  <b-row no-gutters>
                    <b-col md="6">
                      <b-card-img-lazy :src="require('@/assets/images/flags/code.png')" class="rounded-0"></b-card-img-lazy>
                    </b-col>
                    <b-col md="6" class="flexImg">
                      <b-card-body title="消息中心">
                        <b-card-text style="color: #6e6b7b;">
                           消息信息模板化,统一化处理,信息标准化管理
                        </b-card-text>
                      </b-card-body>
                    </b-col>
                  </b-row>

                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <b-card-img-lazy :src="require('@/assets/images/flags/code.png')" class="rounded-0 imgWidth"></b-card-img-lazy>
                  </div>
                  <b-card-body title="消息中心" style="text-align: center">
                    <b-card-text style="color: #6e6b7b;">
                      消息信息模板化,统一化处理,信息标准化管理
                    </b-card-text>
                  </b-card-body>
                </b-card>
              </b-col>

              <b-col md="4" style="padding: 15px">
                <b-card no-body class="overflow-hidden cardborder" @click="toHelp('19400278d4af78319288f0a0bfa8055ec5ec40903f0fe1dc6ef4f7aca4a4486cde366563f0ec5506596f4f55140ca99b319c00dd2f1dddaf5daec6a8ee664ed6')">
                  <b-row no-gutters>
                    <b-col md="6">
                      <b-card-img-lazy :src="require('@/assets/images/flags/dcs.png')" class="rounded-0"></b-card-img-lazy>
                    </b-col>
                    <b-col md="6" class="flexImg">
                      <b-card-body title="分布式调度中心">
                        <b-card-text style="color: #6e6b7b;">
                          集中管理定时任务，自动化调度,可视化管理
                        </b-card-text>
                      </b-card-body>
                    </b-col>
                  </b-row>

                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <b-card-img-lazy :src="require('@/assets/images/flags/dcs.png')" class="rounded-0 imgWidth"></b-card-img-lazy>
                  </div>
                  <b-card-body title="分布式调度中心" style="text-align: center">
                    <b-card-text style="color: #6e6b7b;">
                      集中管理定时任务，自动化调度,可视化管理
                    </b-card-text>
                  </b-card-body>
                </b-card>
              </b-col>
              <b-col md="4" style="padding: 15px">
                <b-card no-body class="overflow-hidden cardborder" @click="toHelp('')">
                  <b-row no-gutters>
                    <b-col md="6">
                      <b-card-img-lazy :src="require('@/assets/images/flags/settings.png')" class="rounded-0"></b-card-img-lazy>
                    </b-col>
                    <b-col md="6" class="flexImg">
                      <b-card-body title="配置中心">
                        <b-card-text style="color: #6e6b7b;">
                          集中配置管理，动态修改配置，助您快速搭建服务应用
                        </b-card-text>
                      </b-card-body>
                    </b-col>
                  </b-row>

                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <b-card-img-lazy :src="require('@/assets/images/flags/settings.png')" class="rounded-0 imgWidth"></b-card-img-lazy>
                  </div>
                  <b-card-body title="配置中心" style="text-align: center">
                    <b-card-text style="color: #6e6b7b;">
                      集中配置管理，动态修改配置，助您快速搭建服务应用
                    </b-card-text>
                  </b-card-body>
                </b-card>
              </b-col>
            </b-row> -->

            <!-- <b-card no-body class="card-employee-task">
              <b-card-header>
                <b-card-title>开箱即用的组件</b-card-title>
                <feather-icon icon="MoreVerticalIcon" size="18" class="cursor-pointer" />
              </b-card-header>
              <b-card-body>
                <div style="display: flex; flex-wrap: wrap;">
                  <div v-for="(moduleItem, index) in moduleData" :key="moduleItem.id" style="width: 50%; padding: 0 10px" class="employee-task d-flex justify-content-between align-items-center">
                    <b-media no-body>
                      <b-media-aside class="mr-75">
                        <b-avatar rounded size="84" :src="moduleItem.avatar" />
                      </b-media-aside>

                      <b-media-body class="my-auto">
                        <h6 style="font-weight: bold; margin-bottom: 10px; text-align: left">{{ moduleItem.userFullName }}</h6>
                        <small>{{ moduleItem.designation }}</small>
                      </b-media-body>
                    </b-media>

                    <div class="d-flex align-items-center">
                      <small class="text-muted mr-75">{{ moduleItem.duration }}</small>
                      <vue-apex-charts type="radialBar" height="30" width="30" :options="chartData[index].options" :series="chartData[index].series" />
                    </div>
                  </div>
                </div>

              </b-card-body>
            </b-card> -->
        </div>

        <div style="margin: 10px; width: 75%; background-color: #fff; padding: 20px 10px;" align="center" class="mb-3">
            <div class="moduleTop">
                <h1>开箱即用的组件</h1>
                <!-- <feather-icon icon="MoreVerticalIcon" size="18" class="cursor-pointer" /> -->
            </div>

            <b-row no-gutters>
                <b-col md="6">

                </b-col>
            </b-row>
            <div class="moduleBody">
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

                                <!-- <vue-apex-charts type="radialBar" height="30" width="30" :options="moduleItem.options" :series="moduleItem.series === NaN ? moduleItem.series : [0]" slot=""/> -->
                            </div>
                        </div>
                    </b-col>
                </b-row>
                <!-- <div style="display: flex; flex-wrap: wrap;">
                    <div v-for="(moduleItem, index) in moduleData" :key="moduleItem.id"
                         @click="toHelp(moduleItem.helpUrl)"
                         class="employee-task d-flex justify-content-between align-items-center moduleBodyItem">
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

                            <vue-apex-charts type="radialBar" height="30" width="30" :options="chartData[index].options" :series="chartData[index].series" slot=""/>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>

        <div style="background-color: #fff;padding: 25px 10px;margin: 10px; width: 75%;" v-loading="apiLoading">
            <h1 align="center" style="padding-top:15px; font-weight: bold">丰富实用的API集市</h1>
            <b-row cols-lg="3" cols-sm="3" class="mb-3 match-height" style="margin: 40px 10px">
                <b-col v-for="(item, index) in topApis" :key="index">
                    <b-link @click="toApi(item.viewId)">
                        <ApiCard class="api-card" :api="item"></ApiCard>
                    </b-link>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
    import News from './news.vue'
    import store from '@/store'
    import ApiCard from '@/views/home/component/ApiCard.vue'
    import {EIcon} from 'e-icon-picker';
    import VueApexCharts from 'vue-apexcharts'
    import { $themeConfig } from '@themeConfig'

    export default {
        data() {
            return {
                topApis: [],
                noticeList: [],
                apiLoading: false,

                moduleData: [
                    {
                        id: 'api',
                        color:'danger',
                        avatar: 'el-icon-help',
                        userFullName: '数据总线',
                        designation: '提供面开发,弹性可视的数据接口服务',
                        duration: '0',
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
                        avatar: 'el-icon-s-marketing',
                        userFullName: '应用访问统计',
                        designation: '服务访问统计,每一次访问有迹可循',
                        duration: '0',
                        helpUrl: '19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e68d3b383e34b07ad44',

                    }, {
                        id: 'encry',
                        color:'secondary',
                        avatar: 'el-icon-lock',
                        userFullName: '数据安全服务',
                        designation: '提供高密数据加密服务，保证数据安全,防篡改',
                        duration: '0',
                        helpUrl: '19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e681d1cc7eb4d6fc4b1',

                    }, {
                        id: 'msg',
                        color:'success',
                        avatar: 'el-icon-chat-dot-square',
                        userFullName: '消息中心',
                        designation: '消息信息模板化,统一化处理,信息标准化管理',
                        duration: '0',
                        helpUrl: '19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e68342115b286b8d687',
                    }, {
                        id: 'xxl',
                        color:'warning',
                        // avatar: require('@/assets/images/flags/dcs.png'),
                        avatar: 'el-icon-set-up',
                        userFullName: '分布式调度中心',
                        designation: '集中管理定时任务，自动化调度,可视化管理',
                        duration: '0',
                        helpUrl: '19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e68ab4c918dd55f8cb0',
                    }, {
                        id: 'nacos',
                        color:'primary',
                        // avatar: require('@/assets/images/flags/settings.png'),
                        avatar: 'el-icon-setting',
                        userFullName: '配置中心',
                        designation: '集中配置管理，动态修改配置，助您快速搭建服务应用',
                        duration: '0',
                        helpUrl: '19400278d4af78311e635ad2b60908d6439feee2610230ef8e3ccc5c9e5a428933d0a1e566172a43fe40d496b49a4e68ca57c50443855ce8',
                    }
                ],
                moduleNumData: {}
            }
        },
        components: {
            News,
            ApiCard,
            VueApexCharts,
            EIcon
        },
        created() {
            this.getApiTop()
            this.getNoticeTop()
            this.getModuleData()
        },
        setup() {
            // App Name
            const {httpUrl} = $themeConfig.app
            return {
                httpUrl
            }
        },
        methods: {
            getApiTop() {
                let that = this
                that.apiLoading = true
                let _data = {
                    curl: $themeConfig.app.httpUrl + '/api-manage/v1.0/api/getTop?number=5'
                }
                that.$store.dispatch('httpGet', _data).then(function (res) {
                    that.topApis = res.data
                    that.apiLoading = false
                })
            },
            getNoticeTop() {
                let that = this
                let _data = {
                    curl: `${$themeConfig.app.projectHttpUrl}/notice/top`
                }
                that.$store.dispatch('httpGet', _data).then(function (res) {
                    that.noticeList = res.data
                })
            },
            toHelp(helpPath) {
                this.$router.push({
                    path: '/help',
                    query: {
                        'path': helpPath
                    }
                })
            },
            toApi(viewId) {
                this.$router.push({
                    path: '/api/describe?apiId=' + viewId
                })
            },

            getModuleData() {
                let that = this
                let _data = {
                    curl: $themeConfig.app.projectHttpUrl + '/project/componentData'
                }
                that.$store.dispatch('httpGet', _data).then(function (res) {
                    that.moduleNumData = res.data
                               })
            }
        },
    }
</script>

<style>
    .nav-pills .nav-link {
        font-size: 1.5rem;
    }

    .carousel-control-prev-icon, .carousel-control-next-icon {
        display: none !important;

    }

    .img-fluid {
        height: 360px;
    }

    .api-card {
        margin: 5px;
        border: 1px solid #ffffff;
    }

    .api-card:hover {
        margin: 5px;
        border: 1px solid #7289fa;
        background-color: #eef1f6;
        box-shadow: gainsboro;
    }

    .carousel-indicators li {
        display: none;
    }

    .display-3 {
        color: #fff;
    }

    /* .row.no-gutters {

      border: 1px solid #0000FF00;
    }
    .row.no-gutters:hover {

      border: 1px solid #0000FF;
    } */

    /* .cardborder {
    } */

    .card.cardborder:hover {

        border: 1px solid #0000FF;
    }

    .card.cardborder {
        border: 1px solid #0000FF00;
        height: 100%;
    }

    .link-hover:hover {
        color: #FF0099;
    }

    .display-5 {
        color: #fff;
    }

    .cardborder .flexImg {
        display: flex;
        align-items: center;
    }

    .cardborder .imgWidth {
        width: 300px;
    }

    .cardborder .card-title {
        font-weight: bold;
    }

    /* .employee-task .badge-secondary {
      background-color: #fff;
    } */
    .moduleTop {
        /* display: flex;
        justify-content: space-between;
        align-items: center; */
        /* border-bottom: 1px solid #eee; */
        padding-bottom: 20px;
    }

    .moduleTop > h1 {
        font-weight: bold;
    }

    /* .moduleBody {
      padding-top: 20px;
    } */
    .moduleBodyItem {
        /* width: 50%; */
        padding: 10px;
        cursor: pointer;
        border: 1px solid #fff;
    }
    .moduleBodyItem:hover {
        border: 1px solid #7289fa;
        border-radius: 5px;
        background-color: #eef1f6;
    }

    .moduleBodyItem:nth-child(odd) {
        padding-right: 15px;
    }

    .moduleBodyItem:nth-child(even) {
        padding-left: 15px;
    }
</style>
