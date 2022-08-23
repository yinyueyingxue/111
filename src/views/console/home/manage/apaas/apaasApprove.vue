<template>
    <b-card no-body>
        <div class="m-2 apaasApprove">
            <!-- Table Top -->
            <el-row>
                <el-col :span="24" style="margin-bottom: 5px">
                    <span style="margin-right: 10px">应用</span>
                    <el-select v-model="form.projectId" clearable filterable @change="getApproveList" style="width: 150px">
                        <el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <span style="margin-left:10px;margin-right: 10px">组件</span>
                    <el-select v-model="form.apaasId" clearable filterable @change="getApproveList" style="width: 150px">
                        <el-option v-for="item in apaasList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <el-button size="small" type="primary" @click="getApproveList" style="margin-left: 10px;margin-right: 10px">查询</el-button>
                </el-col>
            </el-row>


        </div>
        <!-- table -->
        <vue-good-table 
            :columns="columns" 
            :rows="rows" 
            style-class="vgt-table striped" 
            :search-options="{ enabled: true, externalQuery: searchTerm }" 
            :pagination-options="{ enabled: true, perPage:pageLength }"
        >
            <template slot="table-row" slot-scope="props">
                <span v-if="props.column.field === 'icon'">
                    <e-icon :icon-name="props.row.icon"></e-icon>
                </span>
                <span v-else-if="props.column.field === 'status'">
                    <b-badge v-if="props.row.status===3" pill variant="light-success">审批通过</b-badge>
                    <el-button type="success" v-if="props.row.status===2" size="mini" icon="el-icon-check" circle @click="approve(3,props.row)"></el-button>
                    <el-button type="danger" v-if="props.row.status===2" size="mini" icon="el-icon-close" circle @click="approve(4,props.row)"></el-button>
                </span>
                <span v-else-if="props.column.field === 'showFlag'">
                    <span>
						<el-select 
                            @change="updateApprove($event,props.row,1)" 
                            :ref="`select${props.row.id}`"
                            :value="props.row.showFlag"
                            :id="'select'+props.row.id"
                            size="small"
                        >
							<el-option label="隐藏" :value="0"/>
							<el-option label="显示" :value="1"/>
						</el-select>
					</span>
                </span>
                <span v-else>{{ props.formattedRow[props.column.field] }}</span>
            </template>
            <!-- pagination -->
            <template slot="pagination-bottom" slot-scope="props">
                <div class="mx-2 mb-2">
                    <div class="d-flex justify-content-between flex-wrap">
                        <div class="d-flex align-items-center mb-0 mt-1">
						<span class="text-nowrap">共 {{ props.total }} 条，每页显示</span>
                            <b-form-select v-model="pageLength" :options="['5', '10','20','50']" class="mx-1" @input="(value)=>props.perPageChanged({currentPerPage:value})" />
                            <span class="text-nowrap"> 条 </span>
                        </div>
                        <div>
                            <b-pagination 
                                :value="1" 
                                :total-rows="props.total" 
                                :per-page="pageLength" 
                                first-number
                                last-number 
                                align="right" 
                                prev-class="prev-item" 
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
    </b-card>
</template>

<script>
    import Vue from 'vue'
    import {EIconPicker} from 'e-icon-picker';
    import {EIcon} from 'e-icon-picker';
    import {
        BCard,
        BPopover,
        BRow,
        BCol,
        BForm,
        BFormGroup,
        BAvatar,
        BBadge,
        BPagination,
        BDropdown,
        BDropdownItem,
        ModalPlugin,
    } from 'bootstrap-vue'
    import { $themeConfig } from '@themeConfig'
    import { VueGoodTable } from 'vue-good-table'
    import store from '@/store'
    import 'vue-good-table/dist/vue-good-table.css'
    import Ripple from 'vue-ripple-directive'
    import { required } from '@validations'
    import {
        ValidationProvider,
        ValidationObserver
    } from 'vee-validate'
    import {
        Message,
        Popover,
        Select
    } from 'element-ui'

    export default {
        inject: ['reload'],
        components: {
            Vue,
            EIconPicker,
            EIcon,
            BCard,
            Select,
            BPopover,
            ValidationObserver,
            ValidationProvider,
            Popover,
            Message,
            ModalPlugin,
            BRow,
            BCol,
            BFormGroup,
            BForm,
            VueGoodTable,
            BAvatar,
            BBadge,
            BPagination,
            BDropdown,
            BDropdownItem,
        },
        directives: {
            Ripple,
        },
        data() {
            return {
                loading: false,
                visible: false,
                // 1=新增 2=修改
                operateType: 1,
                required,
                projectId: this.$store.state.myRequest.projectId,
                pageLength: 10,
                page: 1,
                total: 0,
                dir: false,
                projectList: [],
                apaasList: [],
                form: {
                    projectId: '',
                    apaasId: ''
                },
                columns: [
                    {
                        label: '应用',
                        field: 'projectName',
                        sortable: false
                    }, {
                        label: '组件',
                        field: 'apaasName',
                        sortable: false
                    }, {
                        label: '申请人',
                        field: 'applyUser',
                        sortable: false
                    }, {
                        label: '申请原因',
                        field: 'applyReason',
                        sortable: false
                    }, {
                        label: '组件审批人',
                        field: 'approveUser',
                        sortable: false
                    }, {
                        label: '申请时间',
                        field: 'applyTime',
                        sortable: false
                    }, {
                        label: '审批时间',
                        field: 'approveTime',
                        sortable: false
                    }, {
                        label: '组件显示',
                        field: 'showFlag',
                        sortable: false

                    }, {
                        label: '审批操作',
                        field: 'status',
                        sortable: false
                    }
                ],
                rows: [],
                searchTerm: '',
                statusOptions: [
                    {
                        value: 1,
                        label: '有效'
                    }, {
                        value: 0,
                        label: '无效'
                    },
                ],
            }
        },

        computed: {
            direction() {
                if (store.state.appConfig.isRTL) {
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.dir = true
                    return this.dir
                }
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.dir = false
                return this.dir
            },
        },
        created() {
            this.getApproveList()
            this.getProjectList()
            this.getApassList()
        },
        methods: {
            approve(status, data) {
                if (status === 4) {
                    this.$prompt('请输入拒绝理由', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        closeOnClickModal: false,
                        closeOnPressEscape: false,
                    }).then(({value}) => {
                        Vue.set(data, 'rejectReason', value)
                        this.updateApprove(status, data, 2)
                    } )
                } else if (status === 3) {
                    this.$confirm('请确认审批通过组件申请', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        this.updateApprove(status, data, 2)
                    })
                }
            },
            getApproveList() {
                const that = this
                const _data = {
                    curl: `${$themeConfig.app.apaasApiHttpUrl}/approve/admin/list`,
                    projectId: this.form.projectId,
                    apaasId: this.form.apaasId
                }
                that.$store.dispatch('httpGet', _data).then(res => {
                    that.rows = res.data
                })
            },
            updateApprove(status, data, type) {
                const that = this
                let _data = {}
                if (type === 1) {
                    _data = {
                        curl: `${$themeConfig.app.apaasApiHttpUrl}/approve/update`,
                        id: data.id,
                        showFlag: status,
                    }
                } else {
                    data.status = status
                    _data = data
                    Vue.set(_data, 'curl', `${$themeConfig.app.apaasApiHttpUrl}/approve/update`)
                }
                that.$store.dispatch('httpPost', _data).then(res => {
                    if (res.flag) {
                        // that.$bvModal.hide('apaasForm')
                        that.getApproveList()
                        that.$bvToast.toast(res.message, {
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
            },
            getProjectList() {
                const that = this
                const _data = {
                    curl: `${$themeConfig.app.apaasApiHttpUrl}/approve/projectList`,
                }
                that.$store.dispatch('httpGet', _data).then(res => {
                    that.projectList = res.data
                })
            },
            getApassList() {
                const that = this
                const _data = {
                    curl: `${$themeConfig.app.apaasApiHttpUrl}/apaas/list`
                }
                that.$store.dispatch('httpGet', _data).then(res => {
                    that.apaasList = res.data
                })
            },
            refreshForm() {
                this.reload()
            },
        },
    }
</script>
<style>
    .vgt-left-align {
        vertical-align: revert !important;
        color: #606266;
    }

    .modal .modal-header .close {
        transform: translate(0px, 0px) !important;
        box-shadow: 0 5px 20px 0 rgb(255 255 255 / 10%) !important;
        background: transparent !important;
    }

    .apaasApprove .searchLabel {
        margin-left: 10px;
        margin-right: 10px
    }

</style>
<style lang="css" scoped>
    @import '~e-icon-picker/lib/index.css';
    @import '~font-awesome/css/font-awesome.min.css';
    @import '~element-ui/lib/theme-chalk/icon.css';
</style>
