<template>
  <b-card no-body>
    <div class="m-2">
      <!-- Table Top -->
      <b-row>
        <b-col md="8">
          <b-button variant="primary" @click="showEditModal(1)">
            <i class="el-icon-plus"/>
            新建
          </b-button>
        </b-col>
        <!-- Search -->
        <b-col md="4">
          <div class="d-flex align-items-center justify-content-end">
            <b-form-input v-model="searchTerm" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" class="d-inline-block mr-1" placeholder="Search..." />
            <b-button v-ripple.400="'rgba(113, 102, 240, 0.15)'" variant="outline-primary" class="btn-icon" @click="refreshForm">
              <feather-icon icon="RefreshCwIcon"/>
            </b-button>
          </div>
        </b-col>
      </b-row>
    </div>
    <!-- Table Top End -->
    <!-- table -->
    <vue-good-table
        style-class="vgt-table striped"
        :columns="columns"
        :rows="userList"
        :rtl="direction"
        @on-page-change="onPageChange"
        @on-per-page-change="onPerPageChange"
        :sort-options="{ enabled: true }"
        :pagination-options="{ enabled: true, setCurrentPage: currentPage }"
    >
      <template slot="table-row" slot-scope="props">
				<span v-if="props.column.field === 'status'">
					<b-badge :variant="statusVariant(props.row.status)">
						{{ parseStatus(props.row.status) }}
					</b-badge>
				</span>
        <span v-else-if="props.column.field === 'action'">
          <feather-icon
              :id="`configIcon-${props.row.id}`"
              icon="EditIcon"
              size="16"
              class="mx-1"
              @click="showEditModal(2,props.row)"
              v-b-tooltip.hover title="编辑"
          />
          <feather-icon
              :id="`logIcon-${props.row.id}`"
              icon="TrashIcon"
              size="16"
              class="mx-1"
              @click="deleteAccount(props)"
              v-b-tooltip.hover title="删除"
          />
        </span>
      </template>
      <!-- pagination -->
      <template slot="pagination-bottom" slot-scope="props">
        <div class="mx-2 mb-2">
          <div class="d-flex justify-content-between flex-wrap">
            <div class="d-flex align-items-center mb-0 mt-1">
              <span v-on:total="total" class="text-nowrap ">共 {{ total }} 条，每页显示</span>
              <b-form-select
                v-model="pageLength"
                :options="[5, 10, 20, 50]"
                class="mx-1"
                @input="(value)=>props.perPageChanged({currentPerPage:value})"
              />
              <span class="text-nowrap">条 </span>
            </div>
            <div>
              <b-pagination
                  :value="1"
                  :total-rows="total"
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
                  <feather-icon icon="ChevronLeftIcon" size="18" />
                </template>
                <template #next-text>
                  <feather-icon icon="ChevronRightIcon" size="18" />
                </template>
              </b-pagination>
            </div>
          </div>
        </div>
      </template>
    </vue-good-table>
    <!-- table end -->

    <!--form-->
    <div>
      <b-modal 
        id="appAccountForm" 
        centered 
        :title="operateType===1 ?'新增应用账号':'修改应用账号'"
        hide-footer 
        no-close-on-backdrop 
        no-close-on-es
        modal-class="modal-primary"
      >
        <validation-observer ref="appAccountRules">
          <b-form>
            <b-row>
              <b-col cols="12">
                <b-form-group label="应用账号" label-for="account">
                  <validation-provider #default="{ errors }" name="account" rules="required">
                    <b-input-group class="input-group-merge">
                      <b-form-input 
                        id="account" 
                        v-model="formdata.account"
                        :readonly="accountReadOnly"
                        :state="errors.length > 0 ? false:null"
                        placeholder="应用账号,建议使用小写字母或数字,连接符号使用_"
                      />
                    </b-input-group>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="账号名称" label-for="name">
                  <validation-provider #default="{ errors }" name="name" rules="required">
                    <b-input-group class="input-group-merge">
                      <b-form-input id="name" v-model="formdata.name" :state="errors.length > 0 ? false:null" placeholder="应用账号中文名称" />
                    </b-input-group>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="所属应用" label-for="projectId">
                  <el-select
                      v-model="formdata.projectId"
                      placeholder="请选择所属应用"
                      clearable
                      filterable
                      style="width: 100%"
                  >
                    <el-option v-for="item in projectList" :key="item.id" :label="item.id" :value="item.id" />
                  </el-select>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="状态" label-for="status">
                  <b-form-select id="status" v-model="formdata.status" :options="statusOptions" value-field="value" text-field="label" />
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="责任人" label-for="defender">
                  <el-select 
                    v-model="formdata.defender" 
                    placeholder="账号责任人" 
                    clearable 
                    filterable
                    reserve-keyword 
                    remote 
                    :remote-method="selectDefender" 
                    :loading="loading"
                    style="width: 100%"
                  >
                    <el-option v-for="item in defenderOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="描述" label-for="desci">
                  <b-input-group class="input-group-merge">
                    <b-form-textarea id="desci" v-model="formdata.desci"/>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <!-- reset and submit -->
              <b-col cols="12">
                <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" size="sm" class="mr-1" @click.prevent="editSaveAccount">
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
    <!-- form end -->
  </b-card>
</template>

<script>
import { $themeConfig } from '@themeConfig'
import { VueGoodTable } from 'vue-good-table'
import store from '@/store'
import 'vue-good-table/dist/vue-good-table.css'
import Ripple from 'vue-ripple-directive'
import { required } from '@validations'
import { ValidationProvider, ValidationObserver } from 'vee-validate'

export default {
  name: 'application',
  inject: ['reload'],
  components: {
    ValidationObserver,
    ValidationProvider,
    VueGoodTable
  },
  directives: {
    Ripple
  },
  data() {
    return {
      required,
      loading: false,
      defenderOptions: [],
      projectList: [],
      accountReadOnly: false,
      visible: false,
      operateType: 1,      // 1=新增 2=修改
      pageLength: 10,
      currentPage: 1,
      dir: false,
      columns: [
        {
          label: '应用账号',
          field: 'account',
          sortable: false
        }, {
          label: '账号名称',
          field: 'name',
          sortable: false
        }, {
          label: '责任人',
          field: 'defender',
          sortable: false
        }, {
          label: '所属租户',
          field: 'projectId',
          sortable: false
        }, {
          label: '备注',
          field: 'remark',
          sortable: false
        }, {
          label: '创建时间',
          field: 'createTime',
          sortable: false
        }, {
          label: '状态',
          field: 'status',
          sortable: false
        }, {
          label: '操作',
          field: 'action',
          sortable: false
        },
      ],
      total: 0,
      userList: [],
      searchTerm: '',
      formdata: {
        curl: '',
        account: '',
        name: '',
        projectId: '',
        type: '1',
        status: '1',
        defender: '',
        desci: '',
      },
      statusOptions: [
        {
          value: 1,
          label: '正常'
        }, {
          value: 0,
          label: '停用'
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
    statusVariant(status) {
      const statusColor = {
        0: 'light-warning',
        1: 'light-success',
        null: 'light-primary',
      }
      if (status !== -null) {
        return status => statusColor[status]
      }
    },
  },
  created() {
    this.getAppAccountList(this.currentPage, this.pageLength)
  },
  methods: {
    getAppAccountList(page, size, account) {
      let that = this
      let _data = {
        curl: $themeConfig.app.userHttpUrl + '/application/search',
        page: page,
        size: size
      }
      if (account) {
        _data['account'] = account
      }
      that.$store.dispatch('httpGet', _data).then(function (res) {
        that.userList = res.data.rows
        that.total = res.data.total
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
              value: item.domain_account,
              label: `${item.real_name} ${item.domain_account}`,
            }
            that.defenderOptions.push(data)
          }
        } else {
          that.defenderOptions = []
        }
      })
    },
    getProjectList() {
      const that = this
      const _data = {
        curl: $themeConfig.app.projectHttpUrl + '/project',
      }
      that.$store.dispatch('httpGet', _data).then(res => {
        if (res.flag) {
          that.projectList = res.data
        } else {
          that.projectList = []
        }
      })
    },
    parseStatus(status) {
      switch (status) {
        case 0:
          return '停用'
        case 1:
          return '正常'
        default:
          return '正常'
      }
    },
    closeEditModal() {
      this.$bvModal.hide('appAccountForm')
    },
    showEditModal(operateType, rowData) {
      this.operateType = operateType
      this.getProjectList()
      if (operateType === 2) {
        this.accountReadOnly = true
        this.formdata = {
          account: rowData.account,
          name: rowData.name,
          defender: rowData.defender,
          projectId: rowData.projectId,
          status: rowData.status,
          desci: rowData.desci,
        }
      } else {
        this.accountReadOnly = false
        this.formdata = {
          account: '',
          name: '',
          projectId: '',
          status: '1',
          defender: '',
          desci: '',
        }
      }
      this.$bvModal.show('appAccountForm')
    },
    editSaveAccount() {
      this.$refs.appAccountRules.validate().then(success => {
        if (success) {
          const that = this
          if (that.operateType === 1) {
            // 新增
            that.formdata.curl = $themeConfig.app.userHttpUrl + '/application/add'
            that.$store.dispatch('httpPost', that.formdata).then(res => {
              if (res.flag) {
                that.$bvModal.hide('appAccountForm')
                that.getAppAccountList()
                that.$bvToast.toast('添加成功', {
                  title: '操作提示',
                  toaster: 'b-toaster-top-center',
                  solid: true,
                  variant: 'success',
                  autoHideDelay: 2000,
                })
                that.reload()
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
            that.formdata.curl = $themeConfig.app.userHttpUrl + '/application/update'
            that.$store.dispatch('httpPost', that.formdata).then(res => {
              if (res.flag) {
                that.$bvModal.hide('appAccountForm')
                that.getAppAccountList()
                that.$bvToast.toast('修改成功', {
                  title: '操作提示',
                  toaster: 'b-toaster-top-center',
                  solid: true,
                  variant: 'success',
                  autoHideDelay: 2000,
                })
                that.reload()
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
    deleteAccount(props) {
      const that = this
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const _data = {
          curl: $themeConfig.app.userHttpUrl + '/application/delete',
          account: props.row.account
        }
        this.$store.dispatch('httpPost', _data).then(res => {
          if (res.flag) {
            that.getAppAccountList()
            that.$bvToast.toast('删除成功', {
              title: '操作提示',
              toaster: 'b-toaster-top-center',
              solid: true,
              variant: 'success',
              autoHideDelay: 2000,
            })
            that.reload()
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
    onPageChange(param) {
      // currentPerPage改变时，如果不在第一页，currentPage也会变化，此时onPerPageChange与onPageChange都会执行
      // 加上判断避免不在第一页时，更改currentPerPage导致查询两次
      if (param.currentPage === 1 && !this.pageChange) {
        this.pageChange = true
        return
      }
      this.getAppAccountList(param.currentPage, param.currentPerPage, this.searchTerm)
    },
    onPerPageChange(param) {
      this.pageChange = false
      this.getAppAccountList(param.currentPage, param.currentPerPage, this.searchTerm)
    },
    numSortFn(x, y) {
      return parseInt(x) - parseInt(y)
    },
    dateSortFn(x, y) {
      return new Date(x) - new Date(y)
    },
    refreshForm() {
      this.reload()
    }
  },
  watch: {
    searchTerm(val) {
      this.getAppAccountList(1, this.pageLength, val)
    }
  }
}
</script>

<style scoped>
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
