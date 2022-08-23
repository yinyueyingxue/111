<template>
    <div>
        <b-card>
            <b-card-header>
                <div class="d-flex align-items-center">
                   <span class="go-back mr-1">
                             <b-link
                                     :to="{ name: 'pipeline'}"
                                     class="font-weight-bold"
                             >
                                  <feather-icon
                                          :icon="$store.state.appConfig.isRTL ? 'ChevronRightIcon' : 'ChevronLeftIcon'"
                                          size="20"
                                          class="align-bottom"
                                  />
                          </b-link>

        </span>
                    <b-card-title class="ml-25">
                        <strong> {{name}} </strong>
                    </b-card-title>
                </div>
            </b-card-header>
            <b-card-body>
                <app-timeline>
                    <app-timeline-item icon="InfoIcon" variant="secondary" :fillBorder=true>
                        <div class="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">
                            <h4><strong>基础信息</strong></h4>
                            <!--                            <small class="timeline-item-time text-nowrap text-muted ml-1">12 min ago</small>-->
                        </div>
                        <!--                        <p>Invoices have been paid to the company.</p>-->
                        <b-media no-body>
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    id: {{id}}
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body>
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    服务: {{service}}
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body>
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    负责人: {{defender}}
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body>
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    描述: {{desci}}
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body>
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    创建时间: {{createTime}}
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body>
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    修改时间: {{updateTime}}
                                </h5>
                            </b-media-body>
                        </b-media>

                    </app-timeline-item>
                    <app-timeline-item icon="TwitchIcon" variant="success" :fillBorder=true>
                        <div class="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">
                            <h4><strong>代码相关信息</strong></h4>
                            <!--                            <small class="timeline-item-time text-nowrap text-muted ml-1">45 min ago</small>-->
                        </div>
                        <b-media no-body v-if="codeSource===1">
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    代码地址: {{codeUrl}}
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body v-if="codeSource===1">
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    分支: {{branch}}
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body v-if="codeSource===1">
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    版本: {{version}}
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body v-if="codeSource===1">
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    配置: {{appId}}
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body v-if="codeSource===2">
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    镜像地址: {{mirrorAddress}}
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body v-if="codeSource===1 && type===2 ">
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0" v-if="enableSonarTest===1">
                                    代码质量检查: <span class="bullet bullet-sm mr-1 bullet-success"></span>
                                </h5>
                                <h5 class="media-body mb-0" v-else>
                                    代码质量检查: <span class="bullet bullet-sm mr-1 bullet-danger"></span>
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body v-if="codeSource===1 && type===2">
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0" v-if="enableUnitTest===1">
                                    单元测试检查: <span class="bullet bullet-sm mr-1 bullet-success"></span>
                                </h5>
                                <h5 class="media-body mb-0" v-else>
                                    单元测试检查: <span class="bullet bullet-sm mr-1 bullet-danger"></span>
                                </h5>
                            </b-media-body>
                        </b-media>
                    </app-timeline-item>

                    <app-timeline-item icon="CommandIcon" variant="primary" :fillBorder=true>
                        <div class="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">
                            <h4><strong>部署相关信息</strong></h4>
                        </div>
                        <b-media no-body>
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    节点数: {{replicas}}
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body>
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    发布环境: {{kongType}}
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body>
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    域名: {{domain}}
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body v-if="type===2">
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    发布路由: {{route}}
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body v-if="type===2">
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    健康检查接口: {{healthyApi}}
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body v-if="type===2">
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    pod标签: {{label}}
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body v-if="type===2">
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0" v-if="enableSkyWalkingAgent===1">
                                    链路追踪监控: <span class="bullet bullet-sm mr-1 bullet-success"></span>
                                </h5>
                                <h5 class="media-body mb-0" v-else>
                                    链路追踪监控: <span class="bullet bullet-sm mr-1 bullet-danger"></span>
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body v-if="type===2">
                            <b-media-aside>
                                <h5>环境变量:</h5>
                            </b-media-aside>
                            <b-media-body>
                                <h5 v-for="(item, index) in envList" :key="index + item.name">
                                    {{item.name+':'+item.value}}
                                </h5>
                            </b-media-body>
                        </b-media>
                    </app-timeline-item>

                </app-timeline>

            </b-card-body>

        </b-card>
    </div>
</template>
<script>
    import {
        BCard,
    } from 'bootstrap-vue'
    import {$themeConfig} from '@themeConfig'
    import store from '@/store'
    import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
    import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'

    export default {
        components: {
            BCard,
            AppTimeline,
            AppTimelineItem,
        },
        data() {
            return {
                projectId: this.$store.state.myRequest.projectId,
                id: '',
                name: '',
                service: '',
                codeSource: '',
                codeUrl: '',
                branch: '',
                version: '',
                appId: '',
                mirrorAddress: '',
                replicas: '',
                cpu: '',
                memory: '',
                volume: '',
                kongType: '',
                label: '',
                healthyApi: '',
                enableUnitTest: '',
                enableSonarTest: '',
                enableSkyWalkingAgent: '',
                domain: '',
                route: '',
                envList: [],
                defender: '',
                desci: '',
                createTime: '',
                updateTime: '',
                type: '',
                sessionClearFlag: true
            }
        },
        beforeRouteLeave(to, from, next) {
            if (to.path === '/project/pipeline') {
                this.sessionClearFlag = false
            }
            next()
        },
        destroyed() {
            if (this.sessionClearFlag) {
                sessionStorage.removeItem("pipelineList")
                sessionStorage.removeItem("pipelineSearchTerm")
            }
        },
        created() {
            this.getPipelineDeatil()
        },
        methods: {
            getPipelineDeatil() {
                const that = this
                const pipelineId = this.$route.query.id
                const data = {
                    curl: `${$themeConfig.app.projectHttpUrl}/pipeline/` + this.projectId + '/' + pipelineId,
                }
                that.$store.dispatch('httpGet', data)
                    .then(res => {
                        if (res.flag) {
                            const data = res.data
                            that.id = data.id
                            that.name = data.name
                            that.service = data.service
                            that.codeSource = data.codeSource
                            that.codeUrl = data.codeUrl
                            that.branch = data.branch
                            that.version = data.version
                            that.appId = data.appId
                            that.mirrorAddress = data.mirrorAddress
                            that.replicas = data.replicas
                            that.cpu = data.cpu
                            that.memory = data.memory
                            that.volume = data.volume
                            that.kongType = data.kongType
                            that.label = data.label
                            that.healthyApi = data.healthyApi
                            that.enableUnitTest = data.enableUnitTest
                            that.enableSonarTest = data.enableSonarTest
                            that.enableSkyWalkingAgent = data.enableSkyWalkingAgent
                            that.route = data.route
                            that.defender = data.defender
                            that.desci = data.desci
                            that.createTime = data.createTime
                            that.updateTime = data.updateTime
                            that.type = data.type
                            that.domain = data.domain
                            that.envList = data.envList
                        } else {
                            that.$bvToast.toast(res.message, {
                                title: '操作提示',
                                toaster: 'b-toaster-top-center',
                                solid: true,
                                variant: 'danger',
                                autoHideDelay: 2000,
                            })
                        }
                    })
            }
        }
    }
</script>
<style>
</style>
