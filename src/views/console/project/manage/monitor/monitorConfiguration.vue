<template>
  <b-card
      no-body
  >
    <div class="m-2">
      <!-- Table Top -->
      <b-row>
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
            新建配置
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
    <!--form-->
    <div>
      <b-modal id="configForm" centered :title="operateType===1 ?'新增配置':'修改配置'"
               hide-footer no-close-on-backdrop no-close-on-es
               modal-class="modal-primary"
      >
        <validation-observer ref="monitorConfigRules">
          <b-form>
            <b-row>
              <b-col cols="12">
                <b-form-group
                    label="服务"
                    label-for="service"
                >
                  <validation-provider
                      #default="{ errors }"
                      name="service"
                      rules="required"
                  >
                    <b-form-select
                        id="service"
                        v-model="form.serviceName"
                        :options="serviceOptions"
                        :state="errors.length > 0 ? false:null"
                        :disabled="serviceDisabled"
                        value-field="id" text-field="id"
                    ></b-form-select>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col cols="12">
                <b-form-group
                    label="负责人"
                    label-for="defender"
                >
                  <el-select
                      id="defender"
                      v-model="form.userId" placeholder="负责人" clearable filterable
                      reserve-keyword remote :remote-method="(val)=>selectUser(val,1)"
                      :loading="loading"
                      style="width: 100%"
                  >
                    <el-option v-for="item in userIdOptions" :key="item.value"
                               :label="item.label"
                               :value="item.value"
                    />
                  </el-select>
                  <b-tooltip target="defender" placement="topright">
                    输入关键词进行搜索
                  </b-tooltip>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group
                    label="抄送人"
                    label-for="defender"
                >
                  <el-select
                      id="cc"
                      multiple
                      v-model="form.copyUserIds" placeholder="抄送人" clearable filterable
                      collapse-tags
                      reserve-keyword remote :remote-method="(val)=>selectUser(val,2)"
                      :loading="loading"
                      style="width: 100%"
                  >
                    <el-option v-for="item in copyUserIdOptions" :key="item.value"
                               :label="item.label"
                               :value="item.value"
                    />
                  </el-select>
                  <b-tooltip target="cc" placement="topright">
                    输入关键词进行搜索
                  </b-tooltip>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group
                    label="是否启用告警"
                    label-for="enableAlarm"
                >
                  <el-select
                      id="enableAlarm"
                      v-model="form.enableAlarm"
                      style="width: 100%"
                  >
                    <el-option v-for="item in enableAlarmOptions" :key="item.value"
                               :label="item.label"
                               :value="item.value"
                    />
                  </el-select>
                </b-form-group>
              </b-col>
              <!-- reset and submit -->
              <b-col cols="12">
                <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary"
                          size="sm" class="mr-1" @click.prevent="editSaveConfig"
                >
                  提交
                </b-button>
                <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="button"
                          variant="outline-secondary" size="sm" @click="closeEditModal"
                >
                  取消
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </b-modal>
    </div>
    <!-- table -->
    <vue-good-table v-loading="bodyLoading" :columns="columns" :rows="rows" style-class="vgt-table striped" :search-options="{
        enabled: true,
        externalQuery: searchTerm }" :pagination-options="{
        enabled: true,
        perPage:pageLength
      }"
    >
      <template slot="table-row" slot-scope="props">
                <span v-if="props.column.field === 'enableAlarm'">
                         <b-badge
                             pill
                             :variant="props.row.enableAlarm===1?'light-success':'light-danger'"
                         >
                        {{ props.row.enableAlarm === 1 ? '启用' : '关闭' }}
                        </b-badge>
                </span>
        <span v-else-if="props.column.field==='action'">
                    <feather-icon
                        :id="`editIcon-${props.row.id}`"
                        icon="EditIcon"
                        size="16"
                        class="mx-1"
                        @click="showEditModal(2,props.row)"
                        v-b-tooltip.hover title="编辑"
                    />
                    <feather-icon
                        :id="`trashIcon-${props.row.id}`"
                        icon="Trash2Icon"
                        size="16"
                        class="mx-1"
                        @click="deleteConfig(props)"
                        v-b-tooltip.hover title="删除"
                    />

</span>
        <span v-else>
					{{ props.formattedRow[props.column.field] }}
				</span>
      </template>
      <!-- pagination -->
      <template slot="pagination-bottom" slot-scope="props">
        <div class="mx-2 mb-2">
          <div class="d-flex justify-content-between flex-wrap">
            <div class="d-flex align-items-center mb-0 mt-1">
						<span class="text-nowrap ">
							共 {{ props.total }} 条，每页显示
						</span>
              <b-form-select v-model="pageLength" :options="['5', '10','20','50']" class="mx-1"
                             @input="(value)=>props.perPageChanged({currentPerPage:value})"
              />
              <span class="text-nowrap"> 条 </span>
            </div>
            <div>
              <b-pagination :value="1" :total-rows="props.total" :per-page="pageLength" first-number
                            last-number align="right" prev-class="prev-item" next-class="next-item"
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
      bodyLoading: false,
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
      serviceDisabled: false,
      columns: [
        {
          label: '服务',
          field: 'serviceName',
          sortable: false
        },
        {
          label: '负责人',
          field: 'userId',
          sortable: false
        },
        {
          label: '抄送人',
          field: 'copyUserIds',
          sortable: false
        },
        {
          label: '告警',
          field: 'enableAlarm',
          sortable: false
        },
        {
          label: '操作',
          field: 'action',
          sortable: false
        }
      ],
      rows: [],
      searchTerm: '',
      form: {
        serviceName: '',
        userId: '',
        copyUserIds: '',
        projectId: this.$store.state.myRequest.projectId,
        enableAlarm: 1,
      },
      enableAlarmOptions: [{
        value: 1,
        label: '启用'
      },
        {
          value: 0,
          label: '关闭'
        },
      ],
      serviceOptions: [],
      userIdOptions: [],
      copyUserIdOptions: [],
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
    this.getMonitorConfigList()
  },
  methods: {
    getMonitorConfigList() {
      const that = this
      that.bodyLoading = true
      const _data = {
        curl: `${$themeConfig.app.monitorHttpUrl}/tbMonitorConfig/listMonitorConfig`,
        project: that.projectId,
        /*      offset: 1,
              limit: 10*/
      }
      that.$store.dispatch('httpGet', _data).then(res => {
        that.rows = res.data
        // that.total = res.data.total
        that.bodyLoading = false
      })
    },
    getServiceList() {
      const that = this
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/service`,
        project: this.projectId,
      }
      that.$store.dispatch('httpGet', _data)
          .then(res => {
            if (res.flag) {
              that.serviceOptions = res.data
            } else {
              that.serviceOptions = []
            }
          })
    },
    closeEditModal() {
      this.$bvModal.hide('configForm')
    },
    showEditModal(operateType, rowData) {
      this.getServiceList()
      this.operateType = operateType
      if (operateType === 2) {
        this.serviceDisabled = true
        let copyUserList = []
        let copyUserId = rowData.copyUserIds
        if (copyUserId !== '' && copyUserId !== null) {
          copyUserList = copyUserId.split(',')
        }
        this.form = {
          serviceName: rowData.serviceName,
          userId: rowData.userId,
          copyUserIds: copyUserList,
          enableAlarm: rowData.enableAlarm,
          projectId: this.$store.state.myRequest.projectId
        }
      } else {
        this.serviceDisabled = false
        this.form = {
          serviceName: '',
          userId: '',
          copyUserIds: '',
          enableAlarm: 0,
          projectId: this.$store.state.myRequest.projectId
        }
      }
      this.$bvModal.show('configForm')
    },
    changeAlarm(value, row) {
      console.log(value)
      console.log(row)
    },
    editSaveConfig() {
      this.$refs.monitorConfigRules.validate()
          .then(success => {
            if (success) {
              const that = this
              let copyUserIdList = this.form.copyUserIds
              this.form.copyUserIds = ''
              let copyUser = ''
              for (let i = 0; i < copyUserIdList.length; i++) {
                if (i === copyUserIdList.length - 1) {
                  copyUser = copyUser + copyUserIdList[i]
                } else {
                  copyUser = copyUser + copyUserIdList[i] + ','
                }
              }
              this.form.copyUserIds = copyUser
              if (this.operateType === 1) {
                // 新增
                this.form.curl = `${$themeConfig.app.monitorHttpUrl}/tbMonitorConfig/addMonitorConfig`
                this.$store.dispatch('httpPost', this.form)
                    .then(res => {
                      if (res.flag) {
                        that.$bvModal.hide('configForm')
                        that.getMonitorConfigList()
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
                this.form.curl = `${$themeConfig.app.monitorHttpUrl}/tbMonitorConfig/updateMonitorConfig`
                this.$store.dispatch('httpPut', this.form)
                    .then(res => {
                      if (res.flag) {
                        that.$bvModal.hide('configForm')
                        that.getMonitorConfigList()
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
    deleteConfig(props) {
      const that = this
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(async () => {
                const _data = {
                  curl: `${$themeConfig.app.monitorHttpUrl}/tbMonitorConfig/` + this.projectId + `/${props.row.serviceName}`,
                }
                this.$store.dispatch('httpDelete', _data)
                    .then(res => {
                      if (res.flag) {
                        that.getMonitorConfigList()
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
          )
    },
    selectUser(query, type) {
      const that = this
      if (query !== '') {
        that.loading = true
        setTimeout(() => {
          that.loading = false
          if (type === 1) {
            this.getUserIdList(query)
          } else {
            this.getCopyUserIdList(query)
          }
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
      this.$store.dispatch('httpGet', _data)
          .then(res => {
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
    getCopyUserIdList(query) {
      const that = this
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/project/getAllUserByAssociated`,
        param: query,
        page: 1,
        size: 10,
      }
      this.$store.dispatch('httpGet', _data)
          .then(res => {
            if (res.flag || res.data.rows.size !== 0) {
              that.copyUserIdOptions = []
              const userList = res.data.rows
              for (const item of userList) {
                const data = {
                  value: item.domain_account,
                  label: `${item.real_name} ${item.domain_account}`,
                }
                that.copyUserIdOptions.push(data)
              }
            } else {
              that.copyUserIdOptions = []
            }
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

</style>
