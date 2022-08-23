<template>
    <b-card no-body>
        <div class="m-2">
            <!-- Table Top -->
            <b-row>
                <b-col cols="12" md="8" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
                    <b-button variant="primary" @click="showEditModal(1)">
                        <i class="el-icon-plus"/>
                        新建组件
                    </b-button>
                </b-col>

                <!-- Search -->
                <b-col cols="12" md="4">
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
        <!--form-->
        <div>
            <b-modal 
                id="apaasForm" 
                centered 
                :title="operateType===1 ?'新增组件':'修改组件'" 
                size="lg"
                hide-footer 
                no-close-on-backdrop 
                no-close-on-es
                modal-class="modal-primary"
            >
                <validation-observer ref="apaasRules">
                    <b-form>
                        <b-row>
                            <b-col cols="12">
                                <b-form-group label="名称" label-for="name">
                                    <validation-provider #default="{ errors }" name="name" rules="required">
                                        <b-form-input v-model="form.name" :state="errors.length > 0 ? false:null"></b-form-input>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                            <b-col cols="12">
                                <b-form-group label="副标题">
                                    <b-form-input v-model="form.subDesc"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col cols="12">
                                <b-form-group label="描述">
                                    <b-form-textarea v-model="form.detailDesc" rows="2"/>
                                </b-form-group>
                            </b-col>
                            <b-col cols="12">
                                <b-form-group label="排序">
                                    <b-form-spinbutton v-model="form.sort" min="1" max="50" />
                                </b-form-group>
                            </b-col>
                            <b-col cols="12">
                                <b-form-group label="用户端链接">
                                    <b-form-input v-model="form.url" />
                                </b-form-group>
                            </b-col>
                            <b-col cols="12">
                                <b-form-group label="管理端链接">
                                    <b-form-input v-model="form.manageUrl" />
                                </b-form-group>
                            </b-col>
                            <b-col cols="6">
                                <b-form-group label="组件颜色" label-for="icon">
                                    <el-select 
                                        ref="iconColor" 
                                        v-model="form.color" 
                                        placeholder="请选择图标颜色风格"
                                        style="width: 100%"
                                        @change="chageTextColor($event,'iconColor')"
                                    >
                                        <el-option 
                                            v-for="item in colorList" 
                                            :key="item.value" 
                                            :label="item.value"
                                            :value="item.value"
                                            v-html="'<span style=color:'+item.color+'>'+item.value+'</span>'" 
                                        />
                                    </el-select>
                                </b-form-group>
                            </b-col>
                            <b-col cols="6">
                                <b-form-group label="组件图标" label-for="icon">
                                    <e-icon-picker v-model="form.icon" :options="iconOptions" placement="bottom" />
                                </b-form-group>
                            </b-col>
                            <b-col cols="6">
                                <b-form-group label="权限关联" label-for="icon">
                                    <el-select v-model="form.sourceId" placeholder="请选择权限资源" style="width: 100%">
                                        <el-option v-for="item in sourceList" :key="item.id" :label="item.sourceName" :value="item.id" />
                                    </el-select>
                                </b-form-group>
                            </b-col>
                            <b-col cols="6">
                                <b-form-group label="状态" label-for="status">
                                    <el-select id="enableAlarm" v-model="form.status" style="width: 100%">
                                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
                                    </el-select>
                                </b-form-group>
                            </b-col>
                            <b-col cols="12">
                                <b-form-group label="负责人" label-for="defender">
                                    <el-select
                                        id="defender"
                                        v-model="form.defender" 
                                        placeholder="负责人" 
                                        clearable 
                                        filterable
                                        reserve-keyword 
                                        remote 
                                        :remote-method="(val)=>selectUser(val,1)"
                                        :loading="loading"
                                        style="width: 100%"
                                    >
                                        <el-option v-for="item in userIdOptions" :key="item.value" :label="item.label" :value="item.value" />
                                    </el-select>
                                    <b-tooltip target="defender" placement="topright">输入关键词进行搜索</b-tooltip>
                                </b-form-group>
                            </b-col>
                            <!-- reset and submit -->
                            <b-col cols="12">
                                <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" size="sm" class="mr-1" @click.prevent="editSaveApaas">
                                    提交
                                </b-button>
                                <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="button" variant="outline-secondary" size="sm" @click="closeEditModal">
                                    取消
                                </b-button>
                            </b-col>
                        </b-row>
                    </b-form>
                </validation-observer>
            </b-modal>
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
                    <b-avatar :variant="`light-${props.row.color}`">
                        <e-icon :icon-name="props.row.icon"/>
                    </b-avatar>
                </span>
                <span v-else-if="props.column.field === 'status'">
                    <b-badge pill :variant="props.row.status===1?'light-success':'light-danger'">{{ props.row.status === 1 ? '有效' : '无效' }}</b-badge>
                </span>
                <span v-else-if="props.column.field==='action'">
                    <feather-icon
                        :id="`SlidersIcon-${props.row.id}`"
                        icon="SettingsIcon"
                        size="16"
                        class="mx-1"
                        style="cursor: pointer"
                        @click="toRouter({ name: 'manageIframe', params:{ url: props.row.manageUrl,appId: props.row.id} })"
                        v-b-tooltip.hover title="管理"
                    />
                    <feather-icon
                        :id="`editIcon-${props.row.id}`"
                        icon="EditIcon"
                        size="16"
                        class="mx-1"
                        style="cursor: pointer"
                        @click="showEditModal(2,props.row)"
                        v-b-tooltip.hover title="编辑"
                    />
                    <feather-icon
                        :id="`trashIcon-${props.row.id}`"
                        icon="Trash2Icon"
                        size="16"
                        class="mx-1"
                        style="cursor: pointer"
                        @click="deleteApaas(props)"
                        v-b-tooltip.hover title="删除"
                    />
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
        Select,
        ColorPicker
    } from 'element-ui'

    export default {
        inject: ['reload'],
        components: {
            ColorPicker,
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
                sourceList: [],
                pageLength: 10,
                page: 1,
                total: 0,
                dir: false,
                columns: [
                    {
                        label: '名称',
                        field: 'name',
                        sortable: false
                    }, {
                        label: '排序',
                        field: 'sort',
                        sortable: false
                    }, {
                        label: '副标题',
                        field: 'subDesc',
                        sortable: false
                    }, {
                        label: '描述',
                        field: 'detailDesc',
                        sortable: false
                    }, {
                        label: '负责人',
                        field: 'defender',
                        sortable: false
                    }, {
                        label: '图标',
                        field: 'icon',
                        sortable: false
                    }, {
                        label: '状态',
                        field: 'status',
                        sortable: false
                    }, {
                        label: '操作',
                        field: 'action',
                        sortable: false
                    }
                ],
                rows: [],
                searchTerm: '',
                form: {
                    name: '',
                    subDesc: '',
                    detailDesc: '',
                    color: '',
                    icon: '',
                    url: '',
                    manageUrl: '',
                    status: 1,
                    defender: '',
                    sort: '',
                    sourceId: ''
                },
                iconOptions: {FontAwesome: false, ElementUI: true, addIconList: [], removeIconList: []},
                statusOptions: [
                    {
                        value: 1,
                        label: '有效'
                    }, {
                        value: 0,
                        label: '无效'
                    },
                ],
                colorList: [
                    {
                        value: 'primary',
                        color: '#7367ef',
                    }, {
                        value: 'secondary',
                        color: '#82858a',
                    }, {
                        value: 'success',
                        color: '#27c672',
                    }, {
                        value: 'danger',
                        color: '#ea5455',
                    }, {
                        value: 'warning',
                        color: '#fe9f43',
                    }, {
                        value: 'info',
                        color: '#00cfe8',
                    },
                ],
                userIdOptions: [],
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
            this.getApassList()
        },
        methods: {
            toRouter(item) {
                if (item.params.url === '' || item.params.url === null) {
                    return
                }
                // this.$router.push(item)
                window.open(item.params.url + '?appId=' + item.params.appId + '&token=' + this.$store.state.myRequest.jwtToken)
            },
            getApassList() {
                const that = this
                const _data = {
                    curl: `${$themeConfig.app.apaasApiHttpUrl}/apaas/list`
                }
                that.$store.dispatch('httpGet', _data).then(res => {
                    that.rows = res.data
                })
            },
            closeEditModal() {
                this.$bvModal.hide('apaasForm')
            },
            getSourceList() {
                const that = this
                const _data = {
                    curl: `${$themeConfig.app.apaasApiHttpUrl}/apaas/sourceList`
                }
                that.$store.dispatch('httpGet', _data).then(res => {
                    that.sourceList = res.data
                })
            },
            showEditModal(operateType, rowData) {
                this.getSourceList();
                this.operateType = operateType
                if (operateType === 2) {
                    this.form = {
                        id: rowData.id,
                        name: rowData.name,
                        subDesc: rowData.subDesc,
                        detailDesc: rowData.detailDesc,
                        icon: rowData.icon,
                        url: rowData.url,
                        manageUrl: rowData.manageUrl,
                        color: rowData.color,
                        status: rowData.status,
                        defender: rowData.defender,
                        sort: rowData.sort,
                        sourceId: rowData.sourceId
                    }
                } else {
                    this.form = {
                        name: '',
                        subDesc: '',
                        detailDesc: '',
                        color: '',
                        icon: '',
                        status: 1,
                        sort: 1,
                        defender: '',
                        sourceId: ''
                    }
                }
                this.$bvModal.show('apaasForm')
            },
            editSaveApaas() {
                this.$refs.apaasRules.validate().then(success => {
                    if (success) {
                        const that = this
                        if (this.operateType === 1) {
                            // 新增
                            this.form.curl = `${$themeConfig.app.apaasApiHttpUrl}/apaas/add`
                            this.$store.dispatch('httpPost', this.form).then(res => {
                                if (res.flag) {
                                    that.$bvModal.hide('apaasForm')
                                    that.getApassList()
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
                            this.form.curl = `${$themeConfig.app.apaasApiHttpUrl}/apaas/update`
                            this.$store.dispatch('httpPut', this.form).then(res => {
                                if (res.flag) {
                                    that.$bvModal.hide('apaasForm')
                                    that.getApassList()
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
            deleteApaas(props) {
                const that = this
                this.$confirm('确认删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    const _data = {
                        curl: `${$themeConfig.app.apaasApiHttpUrl}/apaas/remove/` + `/${props.row.id}`,
                    }
                    this.$store.dispatch('httpDelete', _data).then(res => {
                        if (res.flag) {
                            that.getApassList()
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
            selectUser(query, type) {
                const that = this
                if (query !== '') {
                    that.loading = true
                    setTimeout(() => {
                        that.loading = false
                        if (type === 1) {
                            this.getUserIdList(query)
                        } else { }
                    }, 300)
                } else {
                    that.defenderOptions = []
                }
            },
            getUserIdList(query) {
                const that = this
                const _data = {
                    curl: `${$themeConfig.app.projectHttpUrl}/project/getAllUserByAssociated`,
                    param: query,
                    page: 1,
                    size: 10,
                }
                this.$store.dispatch('httpGet', _data).then(res => {
                    if (res.flag || res.data.rows.size !== 0) {
                        that.userIdOptions = []
                        const userList = res.data.rows
                        for (const item of userList) {
                            const data = {
                                value: item.domain_account,
                                label: `${item.real_name} ${item.domain_account}`,
                            }
                            that.userIdOptions.push(data)
                        }
                    } else {
                        that.userIdOptions = []
                    }
                })
            },
            chageTextColor($event, selectedRef) {
                const color = this.getColor($event)
                // 改变下拉框颜色值
                this.$refs[selectedRef].$el.children[0].children[0].style.color = '' + color + ''
            },
            getColor(value) {
                for (const i in this.colorList) {
                    if (this.colorList[i].value === value) {
                        return this.colorList[i].color
                    }
                }
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

</style>
<style lang="css" scoped>
    @import '~e-icon-picker/lib/index.css';
    @import '~font-awesome/css/font-awesome.min.css';
    @import '~element-ui/lib/theme-chalk/icon.css';
</style>
