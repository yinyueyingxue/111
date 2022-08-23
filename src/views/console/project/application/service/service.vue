<template>
  <b-card no-body>
    <div class="m-2">
      <!-- Table Top -->
      <b-row>
        <b-col cols="12" md="8" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
          <b-button variant="primary" @click="showEditModal(1)">
            <i class="el-icon-plus"/>
            新建服务
          </b-button>
        </b-col>

        <!-- Search -->
        <b-col cols="12" md="4">
          <div class="d-flex align-items-center justify-content-end">
            <b-form-input v-model="searchTerm" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                          class="d-inline-block mr-1" placeholder="Search..."/>
            <b-button v-ripple.400="'rgba(113, 102, 240, 0.15)'" variant="outline-primary" class="btn-icon"
                      @click="refreshForm">
              <feather-icon icon="RefreshCwIcon"/>
            </b-button>
          </div>
        </b-col>

      </b-row>
    </div>
    <!--form-->
    <div>
      <b-modal id="serviceForm" centered :title="operateType===1 ?'新增服务':'修改服务'" hide-footer no-close-on-backdrop
               no-close-on-es modal-class="modal-primary">
        <validation-observer ref="serviceRules">
          <b-form>
            <b-row>
              <b-col cols="12">
                <b-form-group label="服务ID" label-for="serviceId">
                  <validation-provider #default="{ errors }" name="serviceId" rules="required">
                    <b-input-group class="input-group-merge">
                      <b-form-input id="serviceId" v-model="form.id" :disabled="serviceIdReadOnly"
                                    :state="errors.length > 0 ? false:null"
                                    placeholder="服务英文简称,只能使用小写字母或数字,连接符号使用-"/>
                    </b-input-group>
                    <!-- <small class="text-danger">{{ errors[0] }}</small>-->
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- mobile -->
              <b-col cols="12">
                <b-form-group label="服务名称" label-for="serviceName">
                  <validation-provider #default="{ errors }" name="serviceName" rules="required">
                    <b-input-group class="input-group-merge">
                      <b-form-input id="serviceName" v-model="form.name"
                                    :state="errors.length > 0 ? false:null" placeholder="服务中文名称"/>
                    </b-input-group>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="服务类型" label-for="serviceType">
                  <b-form-select id="serviceType" v-model="form.type" :options="typeOptions"
                                 :disabled="typeDisabled" value-field="value" text-field="label"/>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="服务状态" label-for="serviceStatus">
                  <b-form-select id="serviceStauts" v-model="form.workStatus" :options="statusOptions" :disabled="form.workStatus===3"
                                 value-field="value" text-field="label"/>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="服务负责人" label-for="defender">
                  <el-select v-model="form.defender" placeholder="服务负责人" clearable filterable
                             reserve-keyword remote :remote-method="selectDefender" :loading="loading"
                             @change="changeDefender"
                             style="width: 100%">
                    <el-option v-for="item in defenderOptions" :key="item.value" :label="item.label"
                               :value="item.value"/>
                  </el-select>
                </b-form-group>
              </b-col>
              <b-col hidden>
                <b-form-group label="负责人">
                  <el-input v-model="form.defenderName"></el-input>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="服务描述" label-for="desci">
                  <b-input-group class="input-group-merge">
                    <b-form-textarea id="desci" v-model="form.desci"/>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <!-- reset and submit -->
              <b-col cols="12">
                <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary"
                          size="sm" class="mr-1" @click.prevent="editSaveService">提交
                </b-button>
                <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="button"
                          variant="outline-secondary" size="sm" @click="closeEditModal">取消
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </b-modal>
    </div>
    <!-- table -->
    <div class="serviceTableHeight">
      <vue-good-table
          v-loading="bodyLoading"
          :columns="columns"
          :rows="rows"
          style-class="vgt-table striped"
          :search-options="{
					enabled: true,
					externalQuery: searchTerm
				}"
          :pagination-options="{
					enabled: true,
					perPage:pageLength
				}"
          @on-row-click="rowClicked"
      >
        <template slot="table-row" slot-scope="props">
					<span v-if="props.column.field === 'workStatus'">
						<b-badge :variant="statusVariant(props.row.workStatus)">{{
                parseWorkStatus(props.row.workStatus)
              }}</b-badge>
					</span>
          <span v-else-if="props.column.field==='defender'">
                       {{ props.row.defenderName === null ? '' : props.row.defenderName }}  {{ props.row.defender }}
                    </span>
          <span v-else-if="props.column.field === 'type'">
						<b-badge pill :variant="typeVariant(props.row.type)">{{ parseType(props.row.type) }}</b-badge>
					</span>

          <span v-else-if="props.column.field === 'action'">
                        <!-- SlidersIcon  CheckSquareIcon PackageIcon-->
						<feather-icon
                :id="`configIcon-${props.row.id}`"
                icon="SettingsIcon"
                size="16"
                style="cursor: pointer;"
                class="mx-1"
                @click.stop="showConfigModal(props)"
                v-b-tooltip.hover title="配置管理"
            />
            <!-- FileTextIcon -->
						<feather-icon
                :id="`logIcon-${props.row.id}`"
                icon="FileTextIcon"
                size="16"
                style="cursor: pointer;"
                class="mx-1"
                @click.stop="openLogs(props.row.id,props.row.id)"
                v-b-tooltip.hover title="查看日志"
            />
						<span>
							<b-dropdown variant="link" toggle-class="text-decoration-none" no-caret>
								<template v-slot:button-content>
									<feather-icon icon="MoreVerticalIcon" size="16"
                                class="text-body align-middle mr-25"/>
								</template>
                <!-- <b-dropdown-item @click="showConfigModal(props)">-->
								<b-dropdown-item @click.stop="showEditModal(2,props.row)">
									<feather-icon icon="EditIcon" class="mr-50"/>
									<span>编辑</span>
								</b-dropdown-item>
								<b-dropdown-item @click.stop="deleteService(props)">
									<feather-icon icon="TrashIcon" class="mr-50"/>
									<span>删除</span>
								</b-dropdown-item>
                <!-- DatabaseIcon -->
								<b-dropdown-item @click.stop="registRun(props.row)">
									<feather-icon icon="GlobeIcon" class="mr-50"/>
									<span>注册执行器</span>
								</b-dropdown-item>
							</b-dropdown>
						</span>
					</span>
          <span v-else>{{ props.formattedRow[props.column.field] }}</span>
        </template>
        <!-- pagination -->
        <template slot="pagination-bottom" slot-scope="props">
          <div class="mx-2 mb-2">
            <div class="d-flex justify-content-between flex-wrap">
              <div class="d-flex align-items-center mb-0 mt-1">
								<span class="text-nowrap ">
									共 {{ props.total }} 条，每页显示
								</span>
                <b-form-select
                    v-model="pageLength"
                    :options="['5', '10','20','50']"
                    class="mx-1"
                    @input="(value)=>props.perPageChanged({currentPerPage:value})"
                />
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
    </div>

    <!-- 配置sidebar -->
    <b-sidebar
        id="sidebar-right"
        v-model="configSidebarActive"
        sidebar-class="sidebar-lg"
        bg-variant="white"
        title="配置管理"
        right
        backdrop
        shadow
        width="40%"
    >
      <b-form class="p-2" @submit.prevent="showConfigModalBpm">
        <!-- Title -->
        <b-form-group>
          <b-form-textarea id="serviceConfig" v-model="configContent" rows="30" autofocus/>
        </b-form-group>
        <!-- Form Actions -->
        <div class="d-flex mt-2">
          <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="primary" class="mr-2" type="submit">
            保存
          </b-button>
        </div>
      </b-form>
    </b-sidebar>
    <b-sidebar
        id="log-sidebar"
        v-model="logSidebarActive"
        sidebar-class="sidebar-lg"
        bg-variant="white"
        right
        backdrop
        title="日志管理"
        shadow
        width="80%"
    >
      <b-form class="p-2">
        <!-- Title -->
        <b-form-group>
          <b-form-textarea id="serviceConfig" v-model="configContent" rows="30" autofocus/>
        </b-form-group>
        <!-- Form Actions -->
      </b-form>
    </b-sidebar>

    <div>
      <b-modal id="bpmModel" centered title="bpm电子流变更审批" hide-footer no-close-on-backdrop no-close-on-es
               modal-class="modal-primary">
        <b-form>
          <b-row>
            <b-col cols="12">
              <b-form-group label="变更单号" label-for="bpmId">
                <b-input-group class="input-group-merge">
                  <b-form-input v-model="bpmId"/>
                </b-input-group>
              </b-form-group>

            </b-col>
            <!-- reset and submit -->
            <b-col cols="12">
              <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  type="submit"
                  variant="primary"
                  size="sm"
                  class="mr-1"
                  @click.prevent="checkBpm(bpmId)"
              >确认
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </b-modal>
    </div>
  </b-card>
</template>

<script>
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
  BIcon,
  BIconArrowUp,
  BIconArrowDown,
  ModalPlugin,
} from 'bootstrap-vue'
import {
  $themeConfig,
} from '@themeConfig'
import {
  VueGoodTable
} from 'vue-good-table'
import store from '@/store'
import 'vue-good-table/dist/vue-good-table.css'
import Ripple from 'vue-ripple-directive'
import {
  required
} from '@validations'
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
    BCard,
    Select,
    BSidebar,
    BPopover,
    ValidationObserver,
    ValidationProvider,
    Popover,
    Message,
    ModalPlugin,
    BRow,
    BCol,
    BInputGroup,
    BFormGroup,
    BInputGroupPrepend,
    BButton,
    BFormInput,
    BForm,
    BIcon,
    BIconArrowUp,
    BIconArrowDown,
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
      selectRowData: '',
      bpmId: '',
      bodyLoading: false, // 页面加载状态
      typeDisabled: false,
      logTypeSelected: '',
      loading: false,
      defenderOptions: [],
      currentConfigId: '',
      currentWorkStatus: '',
      logSidebarActive: false,
      configSidebarActive: false,
      configContent: '',
      serviceIdReadOnly: false,
      visible: false,
      // 1=新增 2=修改
      operateType: 1,
      required,
      projectId: this.$store.state.myRequest.projectId,
      pageLength: 10,
      page: 1,
      total: 0,
      dir: false,
      columns: [
        {
          label: 'id',
          field: 'id',
          sortable: false
        },
        {
          label: '名称',
          field: 'name',
          sortable: false
        },
        {
          label: '负责人',
          field: 'defender',
          sortable: false
        },
        {
          label: '配置Id',
          field: 'configId',
          sortable: false
        },
        {
          label: '上线状态',
          field: 'workStatus',
          sortable: false
        },
        {
          label: '服务类型',
          field: 'type',
          sortable: false
        },
        {
          label: '操作',
          field: 'action',
          sortable: false
        },
      ],
      rows: [],
      projectList: [],
      searchTerm: '',
      form: {
        id: '',
        name: '',
        project: this.$store.state.myRequest.projectId,
        type: '1',
        workStatus: '1',
        defender: '',
        defenderName: '',
        desci: '',
      },
      typeOptions: [{
        value: 1,
        label: '前端服务'
      },
        {
          value: 2,
          label: '后端服务'
        },
      ],
      statusOptions: [{
        value: 1,
        label: '未上线'
      },
        {
          value: 2,
          label: '试运行'
        },
        {
          value: 3,
          label: '已转产'
        },
      ],
      logTypeOptions: [{
        value: '',
        label: '全部类型'
      },
        {
          value: '1',
          label: 'DEBUG'
        },
        {
          value: '2',
          label: 'INFO'
        },
        {
          value: '3',
          label: 'WARM'
        },
        {
          value: '4',
          label: 'ERROR'
        },
      ],
    }
  },

  computed: {
    statusVariant(workStatus) {
      const statusColor = {
        1: 'light-primary',
        2: 'light-warning',
        3: 'light-success',
        null: 'light-primary',
      }
      if (workStatus !== -null) {
        return workStatus => statusColor[workStatus]
      }
    },
    typeVariant(type) {
      const typeColor = {
        1: 'info',
        2: 'secondary',
        null: 'secondary',
      }
      if (type !== null) {
        return type => typeColor[type]
      }
    },
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
    this.getServiceList()
  },
  methods: {
    changeDefender(value) {
      for (var i of this.defenderOptions) {
        if (i.value === value) {
          this.form.defenderName = i.name
        }
      }
    },
    getServiceList() {
      const that = this
      that.bodyLoading = true
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/service`,
        project: that.projectId,
        // page: 1,
        // size: 20,
      }
      that.$store.dispatch('httpGet', _data).then(res => {
        that.rows = res.data
        // setTimeout(() => {
        that.bodyLoading = false
        // }, 500)
        // that.total = res.data.total
      })
    },
    parseWorkStatus(status) {
      switch (status) {
        case 1:
          return '未上线'
        case 2:
          return '试运行'
        case 3:
          return '已转产'
        default:
          return '未上线'
      }
    },
    parseType(type) {
      switch (type) {
        case 1:
          return '前端服务'
        case 2:
          return '后端服务'
        default:
          return '后端服务'
      }
    },
    closeEditModal() {
      this.$bvModal.hide('serviceForm')
    },
    showEditModal(operateType, rowData) {
      this.operateType = operateType
      if (operateType === 2) {
        this.typeDisabled = true
        this.serviceIdReadOnly = true
        this.form = {
          project: this.projectId,
          id: rowData.id,
          name: rowData.name,
          defender: rowData.defender,
          type: rowData.type,
          workStatus: rowData.workStatus,
          desci: rowData.desci,
        }
      } else {
        this.typeDisabled = false
        this.serviceIdReadOnly = false
        this.form = {
          id: '',
          name: '',
          project: this.$store.state.myRequest.projectId,
          type: '1',
          workStatus: '1',
          defender: '',
          desci: '',
        }
      }
      this.$bvModal.show('serviceForm')
    },

    openLogs(podId, service) {
      window.open('/project/logs?podId=' + podId + '&projectId=&service=' + service)
    },
    editSaveService() {
      this.$refs.serviceRules.validate().then(success => {
        if (success) {
          const that = this
          if (this.operateType === 1) {
            // 新增
            this.form.curl = `${$themeConfig.app.projectHttpUrl}/service`
            this.$store.dispatch('httpPost', this.form)
                .then(res => {
                  if (res.flag) {
                    that.$bvModal.hide('serviceForm')
                    that.getServiceList()
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
            this.form.curl = `${$themeConfig.app.projectHttpUrl}/service`
            this.$store.dispatch('httpPut', this.form)
                .then(res => {
                  if (res.flag) {
                    that.$bvModal.hide('serviceForm')
                    that.getServiceList()
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
    deleteService(props) {
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
              curl: `${$themeConfig.app.projectHttpUrl}/service/${props.row.id}`,
            }
            this.$store.dispatch('httpDelete', _data).then(res => {
              if (res.flag) {
                that.getServiceList()
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
          }
      );
    },
    checkBpm(bpmId) {
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/pipeline/checkBpm/` + bpmId,
      }
      this.$store.dispatch('httpGet', _data).then(res => {
        // 成功
        if (res.flag) {
          if (res.data.pass) {
            this.$bvModal.hide('bpmModel')
            //更新配置
            this.updateConfig()
          } else {
            this.$bvToast.toast(res.data.msg, {
              title: '操作提示',
              toaster: 'b-toaster-top-center',
              solid: true,
              variant: 'danger',
              autoHideDelay: 2000,
            })
          }
        } else {
          // 失败
          this.$bvToast.toast(res.data, {
            title: '操作提示',
            toaster: 'b-toaster-top-center',
            solid: true,
            variant: 'danger',
            autoHideDelay: 2000,
          })
        }
      })
    },

    showConfigModalBpm() {
      if (this.currentWorkStatus === 3) {
        this.bpmId = ''
        this.$bvModal.show('bpmModel')
      } else {
        this.updateConfig()
      }
    },
    showConfigModal(props) {
      let type = props.row.type
      if (type === 2) {
        this.configContent = ''
        this.configSidebarActive = true
        this.getServiceConfig(props)
      }
    },
    showLogModal(props) {
      this.logSidebarActive = true
    },
    getServiceConfig(props) {
      const that = this
      that.currentWorkStatus = props.row.workStatus
      that.currentConfigId = props.row.configId
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/service/config/${props.row.configId}`
      }
      this.$store.dispatch('httpGet', _data).then(res => {
        if (res.flag) {
          that.configContent = res.data[0].text
        } else {
          that.configContent = ''
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
    updateConfig() {
      const that = this
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/service/editConfigText/${this.currentConfigId}`,
        configText: this.configContent,
        format: 'properties',
        bpmId: this.bpmId,
      }
      this.$store.dispatch('httpPut', _data).then(res => {
        if (res.flag) {
          that.$bvToast.toast('修改成功', {
            title: '操作提示',
            toaster: 'b-toaster-top-center',
            solid: true,
            variant: 'success',
            autoHideDelay: 2000,
          })
          that.getServiceList()
          that.configSidebarActive = false
        } else {
          that.$bvToast.toast(res.message, {
            title: '操作提示',
            toaster: 'b-toaster-top-center',
            solid: true,
            variant: 'danger',
            autoHideDelay: 2000,
          })
        }
        this.bpmId=''
      })
    },
    selectDefender(query) {
      const that = this
      if (query !== '') {
        that.loading = true
        setTimeout(() => {
          that.loading = false
          this.getDefenderList(query)
        }, 300)
      } else {
        that.defenderOptions = []
      }
    },
    registRun(row) {
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/service/addServerExecutor`,
        serverId: row.id
      }
      this.$store.dispatch('httpGet', _data).then(res => {
        if (res.flag) {
          this.getServiceList()
          const result = eval('(' + res.data + ')')

          if (result.code == 300) {
            this.$bvToast.toast('已有执行器', {
              title: '操作提示',
              toaster: 'b-toaster-top-center ',
              solid: true,
              variant: 'success',
              autoHideDelay: 2000,
            })
          } else {
            this.$bvToast.toast('添加成功', {
              title: '操作提示',
              toaster: 'b-toaster-top-center ',
              solid: true,
              variant: 'success',
              autoHideDelay: 2000,
            })

          }

        } else {
          this.$bvToast.toast("添加失败", {
            title: '操作提示',
            toaster: 'b-toaster-top-center',
            solid: true,
            variant: 'danger',
            autoHideDelay: 2000,
          })
        }
      })
    },
    getDefenderList(query) {
      const that = this
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/project/getAllUserByAssociated`,
        param: query,
        page: 1,
        size: 10,
      }
      this.$store.dispatch('httpGet', _data).then(res => {
        if (res.flag || res.data.rows.size !== 0) {
          that.defenderOptions = []
          const userList = res.data.rows
          for (const item of userList) {
            const data = {
              value: `${item.domain_account}`,
              label: `${item.real_name} ${item.domain_account}`,
              name: `${item.real_name}`
            }
            that.defenderOptions.push(data)
          }
        } else {
          that.defenderOptions = []
        }
      })
    },
    refreshForm() {
      this.reload()
    },

    // 点击单行
    rowClicked(item) {
      // 判断是否有选中的值，有的话代表复制，没有的话代表点击
      const sel = this.getSelected();
      if (sel) {
        return;
      }
      this.$router.push({
        name: 'pipeline',
        params: {
          serviceId: item.row.id
        }
      })
    },

    // 判断是否有选中的值
    getSelected() {
      if (window.getSelection) {
        return window.getSelection().toString();
      } else if (document.getSelection) {
        return document.getSelection().toString();
      } else {
        var selection = document.selection && document.selection.createRange();
        if (selection.text) {
          return selection.text.toString();
        }
        return "";
      }
    }
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

.serviceTableHeight .vgt-responsive {
  width: 100%;
  overflow-x: auto;
  position: relative;
  min-height: 160px;
}

.serviceTableHeight .dropdown-item {
  display: flex;
  align-items: center;
}
</style>
