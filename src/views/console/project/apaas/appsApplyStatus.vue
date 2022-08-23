<template>
    <div>
        <b-card>
            <b-card-header>
                <div class="d-flex align-items-center">
                   <span class="go-back mr-1">
                             <b-link
                                     :to="{ name: 'apaasIndex'}"
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
                        <strong> {{this.$route.params.name}}审批流程 </strong>
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
                                    组件名称: {{this.$route.params.name}}
                                </h5>
                            </b-media-body>
                        </b-media>
                        <b-media no-body>
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    组件描述: {{this.$route.params.detailDesc}}
                                </h5>
                            </b-media-body>
                        </b-media>

                    </app-timeline-item>
                    <app-timeline-item icon="TwitchIcon" variant="success" :fillBorder=true>
                        <div class="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">
                            <h4><strong>申请人信息</strong></h4>
                            <!--                            <small class="timeline-item-time text-nowrap text-muted ml-1">45 min ago</small>-->
                        </div>
						<b-media no-body >
						    <b-media-body class="my-auto">
						        <h5 class="media-body mb-0">
						            申请人: {{approveData.applyUser}}
						        </h5>
						    </b-media-body>
						</b-media>
                        <b-media no-body >
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    申请应用: {{approveData.projectId}}
                                </h5>
                            </b-media-body>
                        </b-media>
						<b-media no-body >
						    <b-media-body class="my-auto">
						        <h5 class="media-body mb-0">
						            申请时间: {{approveData.applyTime}}
						        </h5>
						    </b-media-body>
						</b-media>
						<b-media no-body >
								<b-media-body class="my-auto">
									 <h5 class="media-body mb-0">
									申请原因: {{approveData.applyReason}}
								</h5>
							 </b-media-body>
						</b-media>
                    </app-timeline-item>

                    <app-timeline-item icon="CommandIcon" variant="primary" :fillBorder=true>
                        <div class="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">
                            <h4><strong>审核人信息</strong></h4>
                        </div>
                        <b-media no-body>
                            <b-media-body class="my-auto">
                                <h5 class="media-body mb-0">
                                    域账号信息: {{this.$route.params.defender}}
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
                approveData: {},
            }
        },
        created() {
            this.getApproveDeatil()
        },
        methods: {
            getApproveDeatil() {
                const that = this
                const approveId = this.$route.params.approveId
                const data = {
                    curl: `${$themeConfig.app.apaasApiHttpUrl}/approve/` + approveId,
                }
                that.$store.dispatch('httpGet', data)
                    .then(res => {
                        if (res.flag) {
                            that.approveData = res.data

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
