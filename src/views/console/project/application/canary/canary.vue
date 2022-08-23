<template>
    <div>
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
                        <b-button
                                variant="primary"
                                @click="showEditModal(1)"
                        >
                            <i class="el-icon-plus"/>
                            新建灰度策略
                        </b-button>
                    </b-col>
                    <!-- Search -->
                    <b-col
                            cols="12"
                            md="4"
                    >
                        <div class="d-flex align-items-center justify-content-end">
                            <b-form-input
                                    v-model="searchTerm"
                                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                    class="d-inline-block mr-1"
                                    placeholder="Search..."
                            />
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
            <!--     modal       -->
            <div>
                <b-modal id="canaryTaskModal" ref="canaryTaskModal" centered
                         :title="operateType===1?'新增灰度策略':'修改灰度策略'"
                         hide-footer no-close-on-backdrop no-close-on-es size="lg"
                         modal-class="modal-primary">
                    <validation-observer ref="canaryRules">
                        <b-form>
                            <b-row>
                                <b-col
                                        cols="12"
                                        class="mb-2"
                                >
                                    <small class="text-body">
                                        基础信息<br>
                                    </small>
                                    <small class="text-muted">
                                        1.灰度策略设置前提,保证已有两条不同版本并且正常运行的流水线,支持后端及vue服务<br>
                                        2.策略生效后,后端服务将默认使用主版本流水线的发布路由,前端服务将默认使用主版本域名<br>
                                        3.灰度策略生效期间,请勿发布流水线,否则灰度策略将失效
                                    </small>
                                </b-col>
                                <b-col md="6">
                                    <b-form-group label="策略名称" label-for="canaryTaskName">
                                        <validation-provider
                                                #default="{ errors }"
                                                name="canaryTaskName"
                                                rules="required"
                                        >
                                            <b-input-group class="input-group-merge">
                                                <b-form-input id="canaryTaskName"
                                                              v-model="form.name"
                                                              :state="errors.length > 0 ? false:null"/>
                                            </b-input-group>
                                        </validation-provider>
                                    </b-form-group>
                                </b-col>
                                <b-col md="6">
                                    <b-form-group label="服务" label-for="canaryTaskService">
                                        <el-select id="canaryTaskService" v-model="form.service"
                                                   filterable
                                                   clearable
                                                   :disabled="pipelineDisable"
                                                   placeholder="请选择所属服务" style="width: 100%">
                                            <el-option
                                                    v-for="item in serviceList"
                                                    :key="item.id"
                                                    :label="item.id"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </b-form-group>
                                </b-col>
                                <b-col md="12">
                                    <b-form-group label="主版本流水线" label-for="canaryTaskMainPipeline">
                                        <el-select id="canaryTaskMainPipeline" v-model="form.mainPipeline"
                                                   filterable
                                                   clearable
                                                   :disabled="pipelineDisable"
                                                   @focus="getPipelineList()"
                                                   placeholder="请选择主版本流水线" style="width: 100%">
                                            <el-option
                                                    v-for="item in pipelineList"
                                                    :key="item.name"
                                                    :label="item.name"
                                                    :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </b-form-group>
                                </b-col>
                                <el-divider></el-divider>
                                <b-col
                                        cols="12"
                                        class="mb-2"
                                >
                                    <small class="text-body">
                                        灰度策略规则描述<br>
                                    </small>
                                    <small class="text-muted">
                                        {{form.ruleType===1?'基于流量比例下发：流量根据配置的比例随机访问到主版本或者灰度版本上':'基于请求内容下发：根据请求内容配置规则,只有请求内容满足特定条件的流量会切分到灰度版本上，以下规则之间为与关系'}}
                                    </small>
                                </b-col>
                                <b-col md="3">
                                    <b-form-group label-for="canaryTaskCookie">
                                        <b-form-radio
                                                v-model="form.ruleType"
                                                :value=2
                                                class="custom-control-success"
                                        >
                                            按请求内容下发
                                        </b-form-radio>
                                    </b-form-group>
                                </b-col>
                                <b-col md="3">
                                    <b-form-group label-for="canaryTaskCookie">
                                        <b-form-radio
                                                v-model="form.ruleType"
                                                :value=1
                                                class="custom-control-success"
                                        >
                                            按流量比例下发
                                        </b-form-radio>
                                    </b-form-group>
                                </b-col>

                                <b-col md="12">
                                    <b-form-group label="灰度版本流水线" label-for="canaryTaskCanaryPipeline">
                                        <el-select id="canaryTaskCanaryPipeline" v-model="form.canaryPipeline"
                                                   filterable
                                                   clearable
                                                   :disabled="pipelineDisable"
                                                   @focus="getPipelineList()"
                                                   placeholder="请选择灰度版本流水线" style="width: 100%">
                                            <el-option
                                                    v-for="item in pipelineList"
                                                    :key="item.name"
                                                    :label="item.name"
                                                    :value="item.name">
                                            </el-option>
                                        </el-select>

                                    </b-form-group>
                                </b-col>
                                <b-col md="12">
                                    <b-form-group label="主版本服务流量比例" v-if="form.ruleType===1">
                                        <el-slider v-model="form.mainTraffic" @change="changeTraffic(1)"></el-slider>
                                    </b-form-group>
                                </b-col>
                                <b-col md="12">
                                    <b-form-group label="灰度版本服务流量比例" v-if="form.ruleType===1">
                                        <el-slider v-model="form.canaryTraffic" @change="changeTraffic(2)"></el-slider>
                                    </b-form-group>
                                </b-col>
                                <b-col md="3">
                                    <b-form-group label="Cookie" v-if="form.ruleType===2">
                                        <b-form-select
                                                v-model="form.cookieMatch"
                                                :options="matchOptions"
                                                value-field="value" text-field="label"
                                        >
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col md="9">
                                    <b-form-group label="　" v-if="form.ruleType===2">
                                        <b-input-group class="input-group-merge">
                                            <b-form-input
                                                    v-model="form.cookieValue"
                                                    :placeholder="form.cookieMatch===2?'请输入正则表达式':'请输入Cookie值'"
                                            />
                                        </b-input-group>
                                    </b-form-group>
                                </b-col>
                                <b-col md="3">
                                    <b-form-group label="IP" v-if="form.ruleType===2">
                                        <b-form-select
                                                v-model="form.ipMatch"
                                                :options="matchOptions"
                                                value-field="value" text-field="label"
                                        >
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col md="9">
                                    <b-form-group label="　" v-if="form.ruleType===2">
                                        <b-input-group class="input-group-merge">
                                            <b-form-input v-model="form.ipValue"
                                                          :placeholder="form.ipMatch===2?'请输入正则表达式':'请输入IP'"
                                            />
                                        </b-input-group>
                                    </b-form-group>
                                </b-col>
                                <b-col md="3">
                                    <b-form-group label="User-Agent" v-if="form.ruleType===2">
                                        <b-form-select
                                                v-model="form.uaMatch"
                                                :options="matchOptions"
                                                value-field="value" text-field="label"
                                        >
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col md="9">
                                    <b-form-group label="　" v-if="form.ruleType===2">
                                        <b-input-group class="input-group-merge">
                                            <b-form-input v-model="form.uaValue"
                                                          :placeholder="form.uaMatch===2?'请输入正则表达式':'请输入User-Agent值'"
                                            />
                                        </b-input-group>
                                    </b-form-group>
                                </b-col>
                                <b-col md="3">
                                    <b-form-group label="自定义Header" v-if="form.ruleType===2">
                                        <b-form-select
                                                v-model="form.headerMatch"
                                                :options="matchOptions"
                                                value-field="value" text-field="label"
                                        >
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col md="3">
                                    <b-form-group label="　" v-if="form.ruleType===2">
                                        <b-input-group class="input-group-merge">
                                            <b-form-input id="canaryTaskHeaderKey"
                                                          v-model="form.headerKey"
                                                          placeholder="请输入请求头key"
                                            />
                                        </b-input-group>
                                    </b-form-group>
                                </b-col>
                                <b-col md="6">
                                    <b-form-group label="　" v-if="form.ruleType===2">
                                        <b-input-group class="input-group-merge">
                                            <b-form-input id="canaryTaskHeaderValue"
                                                          v-model="form.headerValue"
                                                          :placeholder="form.headerMatch===2?'请输入正则表达式':'请输入自定义请求头value'"
                                            />
                                        </b-input-group>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="12">
                                    <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary"
                                              size="sm" class="mr-1" @click.prevent="saveEditCanaryTask">
                                        提交
                                    </b-button>
                                    <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="button"
                                              variant="outline-secondary" size="sm" @click="closeEditModal">
                                        取消
                                    </b-button>
                                </b-col>
                            </b-row>
                        </b-form>
                    </validation-observer>
                </b-modal>
            </div>
            <!-- table-->
            <div>
                <vue-good-table v-loading="bodyLoading" :columns="columns" :rows="rows" styleClass="vgt-table striped"
                                :search-options="{
		  enabled: true,
		  externalQuery: searchTerm }" :pagination-options="{
		  enabled: true,
		  perPage:pageLength
		}"
                >
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field === 'mainPipeline'">
						主版本流水线：　{{ props.row.mainPipeline }}<br>
						灰度版本流水线：{{ props.row.canaryPipeline }}
				        </span>
                        <span v-else-if="props.column.field === 'ruleType'">
                               <el-progress type="circle" v-b-tooltip title="灰度服务流量比例"
                                            :percentage="props.row.canaryTraffic" color="#2ecc71" width="50"
                                            v-if="props.row.ruleType===1"></el-progress>
                               <div v-if="props.row.ruleType===2">
                                   <span v-if="props.row.ipValue!==null && props.row.ipValue !=='' ">
                                         Ip{{props.row.ipMatch===1?'完全匹配':'正则匹配'}}：{{props.row.ipValue}}<br>
                                   </span>
                                     <span v-if="props.row.cookieValue!==null && props.row.cookieValue !=='' ">
                                         Cookie{{props.row.cookieMatch===1?'完全匹配':'正则匹配'}}：{{props.row.cookieValue}}<br>
                                   </span>
                                     <span v-if="props.row.headerValue!==null && props.row.headerValue !=='' ">
                                         Header{{props.row.headerMatch===1?'完全匹配':'正则匹配'}}：{{props.row.headerValue}}<br>
                                   </span>
                                       <span v-if="props.row.uaValue!==null && props.row.uaValue !=='' ">
                                         User-Agent{{props.row.uaMatch===1?'完全匹配':'正则匹配'}}：{{props.row.uaValue}}<br>
                                   </span>
                               </div>
				        </span>
                        <span v-else-if="props.column.field==='taskStatus'">
                            <div v-if="props.row.taskStatus=== 0">
                                <i :id="`lineIcon-${props.row.id}`" class="fa fa-circle text-danger">
                                        <b-tooltip :target="`lineIcon-${props.row.id}`" placement="left">
                                             未生效
                                               </b-tooltip>
                                </i>
                            </div>
                            <div v-else-if="props.row.taskStatus===1">
                                <i :id="`lineIcon-${props.row.id}`" class="fa fa-circle text-success">
                                        <b-tooltip :target="`lineIcon-${props.row.id}`" placement="left">
                                              已生效
                                               </b-tooltip>
                                </i>
                            </div>

                        </span>
                        <span v-else-if="props.column.field==='action'">
                               <feather-icon
                                       v-if="props.row.taskStatus===0"
                                       :id="`PlayIcon-${props.row.id}`"
                                       icon="PlayIcon"
                                       size="16"
                                       style="cursor: pointer;"
                                       class="mx-1"
                                       @click="updateCanaryTask(1,props.row.id)"
                                       v-b-tooltip.hover title="启动"
                               />
                               <feather-icon
                                       v-if="props.row.taskStatus===1"
                                       :id="`PauseIcon-${props.row.id}`"
                                       icon="PauseIcon"
                                       size="16"
                                       style="cursor: pointer;"
                                       class="mx-1"
                                       @click="updateCanaryTask(0,props.row.id)"
                                       v-b-tooltip.hover title="停止"
                               />
                                     <feather-icon
                                             :id="`editIcon-${props.row.id}`"
                                             icon="EditIcon"
                                             size="16"
                                             style="cursor: pointer;"
                                             class="mx-1"
                                             @click="showEditModal(2,props.row)"
                                             v-b-tooltip.hover title="编辑"
                                     />
                                       <feather-icon
                                               :id="`deleteIcon-${props.row.id}`"
                                               icon="TrashIcon"
                                               size="16"
                                               style="cursor: pointer;"
                                               class="mx-1"
                                               @click="deleteCanaryTask(props.row.id)"
                                               v-b-tooltip.hover title="删除"
                                       />
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

</template>
<script>
    import 'font-awesome/css/font-awesome.min.css'
    import 'vue-good-table/dist/vue-good-table.css'
    import 'vue-form-wizard/dist/vue-form-wizard.min.css'
    import {FormWizard, TabContent} from 'vue-form-wizard'
    import {VueGoodTable} from 'vue-good-table'
    import {$themeConfig} from '@themeConfig'
    import Ripple from "vue-ripple-directive";
    import {Select, Switch, Slider, Progress} from 'element-ui'
    import {required} from '@validations'
    import {ValidationProvider, ValidationObserver} from 'vee-validate'
    import {
        BCard,
        BSidebar,
        BPopover,
        BRow,
        BCol,
        BInputGroup,
        BInputGroupPrepend,
        BButton,
        BForm,
        BFormGroup,
        BFormInput,
        BAvatar,
        BBadge,
        BPagination,
        BDropdown,
        BDropdownItem,
        ModalPlugin
    } from 'bootstrap-vue'

    export default {
        inject: ['reload'],
        components: {
            Progress,
            Slider,
            'ElSwitch': Switch,
            BCard,
            BPopover,
            BRow,
            BCol,
            BInputGroup,
            BInputGroupPrepend,
            BButton,
            BForm,
            BFormGroup,
            BFormInput,
            BAvatar,
            BBadge,
            BPagination,
            BDropdown,
            BDropdownItem,
            ModalPlugin,
            VueGoodTable,
            Select,
            FormWizard,
            TabContent,
            ValidationProvider,
            ValidationObserver,
            BSidebar
        },
        directives: {
            Ripple,
        },
        data() {
            return {
                bodyLoading: false, // 页面加载状态
                pipelineDisable: false,
                serviceList: [],
                pipelineList: [],
                searchTerm: '',
                operateType: 1,
                rows: [],
                pageLength: 10,
                page: 1,
                total: 0,
                form: {
                    id: '',
                    name: '',
                    service: '',
                    projectId: '',
                    mainPipeline: '',
                    canaryPipeline: '',
                    ipMatch: 1,
                    ipValue: '',
                    cookieMatch: 1,
                    cookieValue: '',
                    headerMatch: 1,
                    headerKey: '',
                    headerValue: '',
                    uaMatch: 1,
                    uaValue: '',
                    ruleType: 2,
                    mainTraffic: 100,
                    canaryTraffic: 0,
                },
                columns: [
                    {
                        label: '名称',
                        field: 'name',
                        sortable: false,
                        thClass: 'columnClass',
                    },
                    {
                        label: '主流水线',
                        field: 'mainPipeline',
                        sortable: false,
                    },
                    {
                        label: '灰度规则',
                        field: 'ruleType',
                        sortable: false,
                    },
                    {
                        label: '创建时间',
                        field: 'createTime',
                        sortable: false
                    },
                    {
                        label: '策略状态',
                        field: 'taskStatus'
                    },
                    {
                        label: '操作',
                        field: 'action',
                        sortable: false
                    }
                ],
                matchOptions: [
                    {
                        value: 1,
                        label: '完全匹配'
                    },
                    {
                        value: 2,
                        label: '正则匹配'
                    },
                ],
            }
        },
        created() {
            this.getCanaryList()
        },
        methods: {
            changeCanaryTask(value, id) {
                this.$confirm('是否修改灰度策略状态?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.getCanaryList()
                    this.updateCanaryTask(value, id)
                }).catch(() => {
                    this.getCanaryList()
                });
            },
            updateCanaryTask(value, id) {
                const msg = value === 1 ? '启动前请确保流水线运行正常,如确认启动,请耐心等待,1-2分钟后策略将生效' : '是否停止灰度策略'
                const that = this
                this.$confirm(`${msg}`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const _data = {
                        curl: `${$themeConfig.app.projectHttpUrl}/canary/updateTaskStatus`,
                        id: id,
                        taskStatus: value
                    }
                    this.$store.dispatch('httpPutParam', _data).then(res => {
                        if (res.flag) {
                            that.$bvModal.hide('canaryTaskModal')
                            that.getCanaryList()
                            if (value === 1) {
                                that.$bvToast.toast('请等待1-2分钟,灰度规则生效中...', {
                                    title: '操作提示',
                                    toaster: 'b-toaster-top-center',
                                    solid: true,
                                    variant: 'success',
                                    autoHideDelay: 2000,
                                })
                            } else {
                                that.$bvToast.toast('关闭灰度规则成功', {
                                    title: '操作提示',
                                    toaster: 'b-toaster-top-center',
                                    solid: true,
                                    variant: 'success',
                                    autoHideDelay: 2000,
                                })
                            }


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
                })

            },
            changeTraffic(type) {
                if (type === 1) {
                    this.form.canaryTraffic = 100 - this.form.mainTraffic
                } else if (type === 2) {
                    this.form.mainTraffic = 100 - this.form.canaryTraffic
                }

            },
            getCanaryList() {
                const that = this
                that.bodyLoading = true
                const _data = {
                    curl: `${$themeConfig.app.projectHttpUrl}/canary/list?projectId=` + this.$store.state.myRequest.projectId,
                }
                that.$store.dispatch('httpGet', _data)
                    .then(res => {
                        if (res.flag) {
                            that.rows = res.data
                            that.bodyLoading = false
                        } else {
                            that.bodyLoading = false
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
            showEditModal(operateType, rowData) {
                this.operateType = operateType
                this.getserviceList()
                this.getPipelineList()
                this.$bvModal.show('canaryTaskModal')
                if (operateType === 2) {
                    this.pipelineDisable = true
                    this.form = {
                        id: rowData.id,
                        name: rowData.name,
                        service: rowData.service,
                        projectId: rowData.projectId,
                        mainPipeline: rowData.mainPipeline,
                        canaryPipeline: rowData.canaryPipeline,
                        ipMatch: rowData.ipMatch,
                        ipValue: rowData.ipValue,
                        cookieMatch: rowData.cookieMatch,
                        cookieValue: rowData.cookieValue,
                        headerMatch: rowData.headerMatch,
                        headerKey: rowData.headerKey,
                        headerValue: rowData.headerValue,
                        uaMatch: rowData.uaMatch,
                        uaValue: rowData.uaValue,
                        ruleType: rowData.ruleType,
                        mainTraffic: rowData.mainTraffic,
                        canaryTraffic: rowData.canaryTraffic
                    }
                } else {
                    this.pipelineDisable = false
                    this.form = {
                        id: '',
                        name: '',
                        service: '',
                        projectId: this.$store.state.myRequest.projectId,
                        mainPipeline: '',
                        canaryPipeline: '',
                        ipMatch: 1,
                        ipValue: '',
                        cookieMatch: 1,
                        cookieValue: '',
                        headerMatch: 1,
                        headerKey: '',
                        headerValue: '',
                        uaMatch: 1,
                        uaValue: '',
                        ruleType: 2,
                        mainTraffic: 100,
                        canaryTraffic: 0,
                    }
                }
            },
            closeEditModal() {
                this.$bvModal.hide('canaryTaskModal')
            },
            saveEditCanaryTask() {
                this.$refs.canaryRules.validate().then(success => {
                    if (success) {
                        const that = this
                        if (this.operateType === 1) {
                            // 新增
                            this.form.curl = `${$themeConfig.app.projectHttpUrl}/canary/add`
                            this.$store.dispatch('httpPost', this.form).then(res => {
                                if (res.flag) {
                                    that.$bvModal.hide('canaryTaskModal')
                                    that.getCanaryList()
                                    that.$bvToast.toast('添加成功', {
                                        title: '操作提示',
                                        toaster: 'b-toaster-top-center',
                                        solid: true,
                                        variant: 'success',
                                        autoHideDelay: 2000,
                                    })
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
                        } else {
                            // 修改
                            this.form.curl = `${$themeConfig.app.projectHttpUrl}/canary/update`
                            this.$store.dispatch('httpPut', this.form).then(res => {
                                if (res.flag) {
                                    that.$bvModal.hide('canaryTaskModal')
                                    that.getCanaryList()
                                    that.$bvToast.toast('修改成功', {
                                        title: '操作提示',
                                        toaster: 'b-toaster-top-center',
                                        solid: true,
                                        variant: 'success',
                                        autoHideDelay: 2000,
                                    })
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
                })
            },
            deleteCanaryTask(id) {
                const that = this
                this.$prompt('您确认要删除吗?如确认删除，请输入"我确认"', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    inputPattern: /^\u6211\u786e\u8ba4$/,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    inputErrorMessage: '输入不正确'
                }).then(async () => {
                    const _data = {
                        curl: `${$themeConfig.app.projectHttpUrl}/canary/remove/${id}`,
                    }
                    this.$store.dispatch('httpDelete', _data).then(res => {
                        if (res.flag) {
                            that.getCanaryList()
                            that.$bvToast.toast('删除成功', {
                                title: '操作提示',
                                toaster: 'b-toaster-top-center',
                                solid: true,
                                variant: 'success',
                                autoHideDelay: 2000,
                            })
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
                })
            },
            getserviceList() {
                const that = this
                const _data = {
                    curl: `${$themeConfig.app.projectHttpUrl}/service?project=` + this.$store.state.myRequest.projectId,
                }
                that.$store.dispatch('httpGet', _data)
                    .then(res => {
                        if (res.flag) {
                            that.serviceList = res.data
                        } else {
                            that.serviceList = []
                        }
                    })
            },
            getPipelineList() {
                const that = this
                const _data = {
                    curl: `${$themeConfig.app.projectHttpUrl}/canary/pipeline?service=` + this.form.service,
                }
                that.$store.dispatch('httpGet', _data)
                    .then(res => {
                        if (res.flag) {
                            that.pipelineList = res.data
                        } else {
                            that.pipelineList = []
                        }
                    })
            },
        }
    }
</script>
<style lang="scss">
    .modal .modal-header .close {
        transform: translate(0px, 0px) !important;
        box-shadow: 0 5px 20px 0 rgb(255 255 255 / 10%) !important;
        background: transparent !important;
    }

    /*.columnClass{*/
    /*    vertical-align: center;*/
    /*}*/
</style>
