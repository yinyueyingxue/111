<template>
    <div class="module" style="background-color: #fff;padding: 25px 10px;margin: 10px;">
        <b-row>
            <!-- image top -->
            <b-col md="6" xl="3">
                <b-link :href="nacosUrl" target="_blank">
                    <b-card
                        :img-src="require('@/assets/images/eosModule/nacos.jpg')"
                        img-top
                        img-alt="card img"
                        img-height="160"
                        img-width="80"
                        class="mb-3"
                        style="background-color:#f1f2f6"
                    >
                        <div class="d-flex justify-content-between align-items-center">
                            <strong class="text-body mr-50">配置中心</strong>
                        </div>
                    </b-card>
                </b-link>
            </b-col>
            <b-col md="6" xl="3">
                <b-link :href="nexusUrl" target="_blank">
                    <b-card
                        :img-src="require('@/assets/images/eosModule/nexus.jpg')"
                        img-top
                        img-alt="card img"
                        img-height="160"
                        img-width="80"
                        class="mb-3"
                        style="background-color:#f1f2f6"
                    >
                        <div class="d-flex justify-content-between align-items-center">
                            <strong class="text-body mr-50">私有仓库</strong>
                        </div>
                    </b-card>
                </b-link>
            </b-col>
            <b-col md="6" xl="3">
                <b-link :href="jenkinsUrl" target="_blank">
                    <b-card
                        :img-src="require('@/assets/images/eosModule/jenkins.jpg')"
                        img-top
                        img-alt="card img"
                        img-height="160"
                        img-width="80"
                        class="mb-3"
                        style="background-color:#f1f2f6"
                    >
                        <div class="d-flex justify-content-between align-items-center">
                            <strong class="text-body mr-50">持续集成工具</strong>
                        </div>
                    </b-card>
                </b-link>
            </b-col>
            <b-col md="6" xl="3">
                <b-link :href="rabbitMqUrl" target="_blank">
                    <b-card
                        :img-src="require('@/assets/images/eosModule/rabbitmq.jpg')"
                        img-top
                        img-alt="card img"
                        img-height="160"
                        img-width="80"
                        class="mb-3"
                        style="background-color:#f1f2f6"
                    >
                        <div class="d-flex justify-content-between align-items-center">
                            <strong class="text-body mr-50">消息中间件</strong>
                        </div>
                    </b-card>
                </b-link>
            </b-col>
            <b-col md="6" xl="3">
                <b-link :href="kibanaUrl" target="_blank">
                    <b-card
                        :img-src="require('@/assets/images/eosModule/kibana.jpg')"
                        img-top
                        img-alt="card img"
                        img-height="160"
                        img-width="80"
                        class="mb-3"
                        style="background-color:#f1f2f6"
                    >
                        <div class="d-flex justify-content-between align-items-center">
                            <strong class="text-body mr-50">数据分析可视化平台</strong>
                        </div>
                    </b-card>
                </b-link>
            </b-col>
            <b-col md="6" xl="3">
                <b-link :href="skywalkingUrl" target="_blank">
                    <b-card
                        :img-src="require('@/assets/images/eosModule/skywalking.jpg')"
                        img-top
                        img-alt="card img"
                        img-height="160"
                        img-width="80"
                        class="mb-3"
                        style="background-color:#f1f2f6"
                    >
                        <div class="d-flex justify-content-between align-items-center">
                            <strong class="text-body mr-50">链路追踪平台</strong>
                        </div>
                    </b-card>
                </b-link>
            </b-col>
            <b-col xl="3">
                <b-link :href="confluenceUrl" target="_blank">
                    <b-card
                        :img-src="require('@/assets/images/eosModule/confluence.png')"
                        img-top
                        img-alt="card img"
                        img-height="160"
                        img-width="80"
                        class="mb-3"
                        style="background-color:#f1f2f6"
                    >
                        <div class="d-flex justify-content-between align-items-center">
                            <strong class="text-body mr-50">协同工作平台</strong>
                        </div>
                    </b-card>
                </b-link>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import { $themeConfig } from '@themeConfig'
    import Ripple from 'vue-ripple-directive'
    import {BLink} from 'bootstrap-vue'

    export default {
        inject: ['reload'],
        components: {
            BLink
        },
        directives: {
            Ripple,
        },
        data() {
            return {
                loading: false,
                dir: false,
                nacosUrl: $themeConfig.app.nacosUrl,
                nexusUrl: $themeConfig.app.nexusUrl,
                jenkinsUrl: $themeConfig.app.jenkinsUrl,
                rabbitMqUrl: $themeConfig.app.rabbitMqUrl,
                kibanaUrl: $themeConfig.app.kibanaUrl,
                skywalkingUrl: $themeConfig.app.skywalkingUrl,
                confluenceUrl: $themeConfig.app.confluenceUrl

            }
        },

        computed: {},
        created() {},
        methods: {
            refreshForm() {
                this.reload()
            },
        },
    }
</script>

<style>
    .modal .modal-header .close {
        transform: translate(0px, 0px) !important;
        box-shadow: 0 5px 20px 0 rgb(255 255 255 / 10%) !important;
        background: transparent !important;
    }
</style>
