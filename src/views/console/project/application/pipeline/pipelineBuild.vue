<template>
    <div v-if="!loading">
        <b-card no-body>
            <div class="m-2">
                <!-- Table Top -->
                <b-row>
                    <!-- Per Page -->
                    <b-col
                        cols="12"
                        md="8"
                        class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
                    >
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
                        <span>
                            <strong> 流水线：{{ this.$route.query.pipeline }}</strong>
                        </span>
                    </b-col>
                    <!-- Search -->
                    <b-col
                            cols="12"
                            md="4"
                    >
                        <div class="d-flex align-items-center justify-content-end">
                            <b-form-select
                                    class="d-inline-block mr-1"
                                    style="width: 200px"
                                    id="buildResult"
                                    v-model="search"
                                    :options="buildResultOptions"
                                    value-field="value" text-field="label"
                                    @change="getBuildList()"
                            ></b-form-select>
                            <b-button
                                    v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                                    variant="outline-primary"
                                    class="btn-icon"
                                    @click="refreshForm"
                            >
                                <feather-icon icon="RefreshCwIcon"/>
                            </b-button>
                        </div>
                    </b-col>
                </b-row>
            </div>
            <div>
                <vue-good-table v-loading="bodyLoading" :columns="columns" :rows="rows" styleClass="vgt-table striped"
                                :search-options="{
		  enabled: true,
		  externalQuery: searchTerm }"
                                :pagination-options="{
		  enabled: true,
		  perPage:pageLength
		}"
                >
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field==='result'">
                            <div v-if="props.row.building===null && props.row.result===null">
                                <i :id="`lineIcon-${props.row.id}`" class="fa fa-circle text-secondary">
                                        <b-tooltip :target="`lineIcon-${props.row.id}`" placement="left">
                                                   排队中
                                               </b-tooltip>
                                </i>
                                <a style="color: #2980b9" @click="toBuildLog(props.row.id)"> 日志</a>
                            </div>
                                <div v-else-if="props.row.building!==null && props.row.result==='SUCCESS'">
                                <i :id="`successIcon-${props.row.id}`" class="fa fa-circle text-success">
                                    <b-tooltip :target="`successIcon-${props.row.id}`" placement="left">
                                                   成功
                                               </b-tooltip>
                                </i>
                                <a style="color: #2980b9" @click="toBuildLog(props.row.id)"> 日志</a>
                            </div>
                                <div v-else-if="props.row.building!==null && props.row.result==='FAILURE'">
                                <i :id="`failIcon-${props.row.id}`" class="fa fa-circle text-danger">
                                      <b-tooltip :target="`failIcon-${props.row.id}`" placement="left">
                                                   失败
                                               </b-tooltip>
                                </i>
                                <a style="color: #2980b9" @click="toBuildLog(props.row.id)"> 日志</a>
                            </div>
                             <div v-else>
                                <i :id="`processIcon-${props.row.id}`" class="fa fa-circle text-warning">
                                     <b-tooltip :target="`processIcon-${props.row.id}`" placement="left">
                                                   执行中
                                               </b-tooltip>
                                </i>
                                <a style="color: #2980b9" @click="toBuildLog(props.row.id)"> 日志</a>
                            </div>
                        </span>
                        <span v-else-if="props.column.field==='duration'">
                           {{ formatterDuration(props.row.duration) }}
                        </span>
                        <span v-else>
					{{ props.formattedRow[props.column.field] }}
				        </span>
                    </template>
                    <template slot="pagination-bottom" slot-scope="props">
                        <div class="mx-2 mb-2">
                            <div class="d-flex justify-content-between flex-wrap">
                                <div class="d-flex align-items-center mb-0 mt-1">
						<span class="text-nowrap ">
							共 {{ props.total }} 条，每页显示
						</span>
                                    <b-form-select v-model="pageLength" :options="['5', '10', '20','50']" class="mx-1"
                                                   @input="(value)=>props.perPageChanged({currentPerPage:value})"
                                    />
                                    <span class="text-nowrap"> 条 </span>
                                </div>
                                <div>
                                    <b-pagination :value="1" :total-rows="props.total" :per-page="pageLength"
                                                  first-number
                                                  last-number align="right" prev-class="prev-item"
                                                  next-class="next-item"
                                                  class="mt-1 mb-0"
                                                  @input="(value)=>props.pageChanged({currentPage:value})"
                                    >
                                        <template #prev-text>
                                            <feather-icon icon="ChevronLeftIcon" size="18"/>
                                        </template>
                                        <template #next-text>
                                            <feather-icon icon="ChevronRightIcon" size="18"/>
                                        </template>
                                    </b-pagination>
                                </div>
                            </div>
                        </div>
                    </template>
                </vue-good-table>
            </div>
        </b-card>

    </div>
    <div v-else-if="loading" style="background-color: #00000000;overflow-y: hidden;" align="right">

        <div align="right" style="overflow-y: hidden;">
            <feather-icon icon="XIcon" style="margin-right: 10px;text-align: right;" @click="closeCard"/>
            <iframe style="border: 0; height: 81vh" :src="iframeUrl" width="100%"></iframe>
            <!--<b-embed type="iframe" :src="iframeUrl" style="overflow-y: hidden; height: 600px" />-->
        </div>
    </div>
</template>

<script>
import {
    BCard,
    BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import {CircleIcon} from 'vue-feather-icons'
import {$themeConfig} from '@themeConfig'
import {
    VueGoodTable
} from 'vue-good-table'
import 'font-awesome/css/font-awesome.min.css'


export default {
    inject: ['reload'],
    components: {
        CircleIcon,
        VueGoodTable,
        BCard,
        BButton,
    },
    directives: {
        Ripple,
    },
    data() {
        return {
            bodyLoading: false, // 页面加载状态
            columns: [
              /*
              {
                label: '任务Id',
                field: 'buildId',
                sortable: false
              },
              {
                label: '流水线',
                field: 'pipeline',
              },
               */
                {
                    label: '镜像版本',
                    field: 'imageVersion',
                    sortable: false
                },
                {
                    label: '执行时间',
                    field: 'createTime',
                    sortable: false
                },
                {
                    label: '执行耗时',
                    field: 'duration',
                    sortable: false
                },
                {
                    label: '执行结果',
                    field: 'result',
                    sortable: false
                },
            ],
            buildResultOptions: [
                {
                    value: '',
                    label: '全部'
                }, {
                    value: 'SUCCESS',
                    label: '成功'
                }, {
                    value: 'FAILURE',
                    label: '失败'
                }, {
                    value: 'ABORTED',
                    label: '取消'
                },
            ],
            projectId: this.$store.state.myRequest.projectId,
            pageLength: 10,
            iframeUrl: '',
            page: 1,
            total: 0,
            dir: false,
            rows: [],
            searchTerm: '',
            id: '',
            pipeline: '',
            buildId: '',
            imageVersion: '',
            createTime: '',
            duration: '',
            building: '',
            result: '',
            search: '',
            loading: false,
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
        this.getBuildList()
    },
    methods: {
        getBuildList() {
            const that = this
            this.bodyLoading = true
            const _data = {
                curl: `${$themeConfig.app.projectHttpUrl}/build`,
                pipeline: this.$route.query.pipeline,
                search: this.search
            }
            that.$store.dispatch('httpGet', _data).then(res => {
                if (res.flag) {
                    that.rows = res.data
                    this.bodyLoading = false
                } else {
                    this.bodyLoading = false
                    that.$bvToast.toast(res.message, {
                        title: '操作提示',
                        toaster: 'b-toaster-top-center',
                        solid: true,
                        variant: 'danger',
                        autoHideDelay: 2000,
                    })
                }
            })
        },
        refreshForm() {
            this.reload()
        },
        closeCard() {
            this.iframeUrl = ''
            this.loading = false
        },
        toBuildLog(id) {
            this.loading = true
            this.iframeUrl = '/pipeline/logs?pipelineId=' + id
            //window.open('/pipeline/logs?pipelineId='+id)
            // that.$router.push({
            //     path: '/pipeline/logs?pipelineId='+id
            // })
        },
        formatterDuration(duration) {
            if (duration !== null) {
                return duration + '秒';
            }
        }
    }
}
</script>
<style>

</style>
