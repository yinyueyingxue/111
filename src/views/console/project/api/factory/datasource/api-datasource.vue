<template>
  <b-card no-body>
    <div class="m-2">
      <!-- Table Top -->
      <b-row>
        <b-col cols="12" md="8" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
          <b-button variant="primary" @click="showEditModal(1)">
            <i class="el-icon-plus"/>
            新增数据源
          </b-button>
        </b-col>
        <!-- Search -->
        <b-col cols="12" md="4">
          <div class="d-flex align-items-center justify-content-end">
            <b-form-input v-model="searchTerm" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" class="d-inline-block mr-1" placeholder="Search..."/>
            <b-button v-ripple.400="'rgba(113, 102, 240, 0.15)'" variant="outline-primary" class="btn-icon" @click="refreshForm">
              <feather-icon icon="RefreshCwIcon"/>
            </b-button>
          </div>
        </b-col>
      </b-row>
    </div>
    <!--form-->
    <div>
      <b-modal 
        id="dataSourceForm" 
        centered 
        :title="operateType === 1 ? '新增数据源' : '修改数据源'" 
        hide-footer
        no-close-on-backdrop
        no-close-on-es 
        modal-class="modal-primary" 
        size="lg"
      >
        <validation-observer ref="serviceRules">
          <b-form>
            <b-row>
              <b-col cols="6">
                <b-form-group label="数据源ID" label-for="dataSourceId">
                  <validation-provider #default="{ errors }" name="dataSourceId" rules="required">
                    <b-input-group class="input-group-merge">
                      <b-form-input id="dataSourceId" v-model="form.id" :readonly="dataSourceIdReadOnly" :state="errors.length > 0 ? false : null" placeholder=""/>
                    </b-input-group>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- mobile -->
              <b-col cols="6">
                <b-form-group label="数据源名称" label-for="dataSourceName">
                  <validation-provider #default="{ errors }" name="dataSourceName" rules="required">
                    <b-input-group class="input-group-merge">
                      <b-form-input id="dataSourceName" v-model="form.name" :state="errors.length > 0 ? false : null" placeholder=""/>
                    </b-input-group>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col cols="6">
                <b-form-group label="数据类型" label-for="dataSourceCategory">
                  <validation-provider #default="{ errors }" name="dataSourceCategory" rules="required">
                    <b-form-select 
                      id="dataSourceCategory" 
                      v-model="category" 
                      :options="categoryOptions" 
                      value-field="value" 
                      :state="errors.length > 0 ? false : null" 
                      text-field="label"
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col cols="6">
                <b-form-group v-if="form.category === 'service'" label="配置方式" label-for="connStrSource">
                  <validation-provider #default="{ errors }" name="connStrSource" rules="required">
                    <b-form-select 
                      id="connStrSource" 
                      v-model="form.connStrSource" 
                      :options="[{label: '手动配置', value: 'user-input'}]"
                      value-field="value" 
                      :state="errors.length > 0 ? false : null" 
                      text-field="label" 
                    />
                  </validation-provider>
                </b-form-group>
                <b-form-group v-else label="配置方式" label-for="connStrSource">
                  <validation-provider #default="{ errors }" name="connStrSource" rules="required">
                    <b-form-select 
                      id="connStrSource" 
                      v-model="form.connStrSource" 
                      :options="connStrSourceOptions"
                      value-field="value" 
                      :state="errors.length > 0 ? false : null" 
                      text-field="label" 
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="连接串" label-for="connStr">
                  <validation-provider #default="{ errors }" name="connStr" rules="required">
                    <b-input-group class="input-group-merge">
                      <b-form-textarea 
                        v-if="form.category === 'service'" 
                        id="connStr" 
                        v-model="form.connStr" 
                        :state="errors.length > 0 ? false : null"
                        placeholder="请以 http:// 或 https:// 开头" 
                      />
                      <b-form-textarea v-else id="connStr" v-model="form.connStr" :state="errors.length > 0 ? false : null"/>
                    </b-input-group>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col v-if="form.category === 'service'" cols="6">
                <b-form-group label="认证方式" label-for="authType">
                  <validation-provider #default="{ errors }" name="authType" rules="required">
                    <b-form-select 
                      id="authType" 
                      v-model="authType" 
                      :options="authTypeOptions"
                      value-field="value" 
                      :state="errors.length > 0 ? false : null" 
                      text-field="label"
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col v-if="form.authType === 1 || form.authType === 2" cols="6">
                <b-form-group label="传参方式" label-for="authRequestType">
                  <validation-provider #default="{ errors }" name="authRequestType" rules="required">
                    <b-form-select 
                      id="authRequestType" 
                      v-model="form.authRequestType" 
                      :options="authRequestTypeOptions"
                      value-field="value" 
                      :state="errors.length > 0 ? false : null" 
                      text-field="label"
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col v-if="form.category !== 'service' || form.authType === 1" cols="6">
                <b-form-group label="用户名" label-for="userName">
                  <validation-provider #default="{ errors }" name="userName" rules="required">
                    <b-form-input id="userName" v-model="form.userName" placeholder="" :state="errors.length > 0 ? false : null" autocomplete="off"/>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col v-if="form.category !== 'service' || form.authType === 1" cols="6">
                <b-form-group label="密码" label-for="password">
                  <validation-provider #default="{ errors }" name="password" rules="required">
                    <b-form-input 
                      id="password" 
                      type="password" 
                      v-model="form.password" placeholder=""
                      :state="errors.length > 0 ? false : null" 
                      autocomplete="off"
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col v-if="form.authType === 2 || form.authType === 3" cols="12">
                <b-form-group label="参数" label-for="authParam">
                  <validation-provider #default="{ errors }" name="authParam" rules="required">
                    <b-input-group class="input-group-merge">
                      <b-form-textarea id="authParam" v-model="form.authParam" :state="errors.length > 0 ? false : null" placeholder="请以json格式输入授权参数" />
                    </b-input-group>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col v-if="form.authType === 1" cols="12">
                <b-form-group label="授权地址" label-for="authRequestUrl">
                  <validation-provider #default="{ errors }" name="authRequestUrl" rules="required">
                    <b-form-input id="authRequestUrl" v-model="form.authRequestUrl" placeholder="" :state="errors.length > 0 ? false : null" autocomplete="off"/>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col v-if="form.authType === 1" cols="12">
                <b-form-group label="参数规则(用户名/密码默认字段为userName/password，可通过以下规则替换)" label-for="authParam">
                  <validation-provider #default="{ errors }" name="authParam" rules="required">
                    <b-input-group class="input-group-merge">
                      <b-form-textarea id="authParam" v-model="paramRule" :state="errors.length > 0 ? false : null"/>
                    </b-input-group>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col v-if="form.authType === 1" cols="12">
                <b-form-group label="替换规则" label-for="authReplaceRules">
                  <validation-provider #default="{ errors }" name="authReplaceRules" rules="required">
                    <b-input-group class="input-group-merge">
                      <b-form-textarea id="authReplaceRules" v-model="form.authReplaceRules" :state="errors.length > 0 ? false : null" placeholder="请以json格式输入替换规则"/>
                    </b-input-group>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col v-if="form.authType === 1" cols="12">
                <b-form-group label="描述" label-for="desci">
                  <b-form-input id="desci" v-model="form.desci" placeholder="" autocomplete="off"/>
                </b-form-group>
              </b-col>
              <b-col v-else cols="12">
                <b-form-group label="描述" label-for="desci">
                  <b-form-input id="desci" v-model="form.desci" placeholder="" autocomplete="off"/>
                </b-form-group>
              </b-col>
              <!-- reset and submit -->
              <b-col cols="12">
                <b-button 
                  v-if="dataSources.includes(form.category)" 
                  v-ripple.400="'rgba(186, 191, 199, 0.15)'" 
                  type="button" 
                  variant="primary" 
                  size="sm"
                  @click="testConnection(form)"
                >测试连接</b-button>
                <b-button 
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'" 
                  type="submit" 
                  variant="primary" 
                  size="sm" 
                  style="float: right; margin-right: 0 !important;"
                  class="mr-1" 
                  @click.prevent="editSaveService"
                >提交</b-button>
                <b-button 
                  v-ripple.400="'rgba(186, 191, 199, 0.15)'" 
                  type="button" 
                  variant="outline-secondary" 
                  size="sm" style="float: right; margin-right: 10px"
                  @click="closeEditModal"
                >取消</b-button>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </b-modal>
    </div>
    <!-- table -->
    <vue-good-table 
      v-loading="bodyLoading" 
      :columns="columns" 
      :rows="rows" 
      style-class="vgt-table striped" 
      :search-options="{ enabled: true, externalQuery: searchTerm }" 
      :pagination-options="{ enabled: true, perPage: pageLength }"
    >
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field === 'option'">
          <feather-icon style="cursor: pointer;" :id="`EditIcon-${props.row.id}`" icon="EditIcon" size="16" class="mx-1" @click="showEditModal(2,props.row)" v-b-tooltip.hover title="编辑"/>
          <feather-icon style="cursor: pointer;" :id="`TrashIcon-${props.row.id}`" icon="TrashIcon" size="16" class="mx-1" @click="deleteDataSource(props.row.id)" v-b-tooltip.hover title="删除"/>
        </span>
        <span v-else>{{ props.formattedRow[props.column.field] }}</span>
      </template>
      <!-- pagination -->
      <template slot="pagination-bottom" slot-scope="props">
        <div class="mx-2 mb-2">
          <div class="d-flex justify-content-between flex-wrap">
            <div class="d-flex align-items-center mb-0 mt-1">
              <span class="text-nowrap">共 {{ props.total }} 条，每页显示</span>
              <b-form-select v-model="pageLength" :options="[5, 10, 20, 50]" class="mx-1" @input="(value) => props.perPageChanged({ currentPerPage: value })" />
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
                @input="(value) => props.pageChanged({ currentPage: value })"
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
import {$themeConfig} from "@themeConfig"
import {VueGoodTable} from "vue-good-table"
import store from "@/store"
import "vue-good-table/dist/vue-good-table.css"
import Ripple from "vue-ripple-directive"
import {required} from "@validations"
import {ValidationObserver, ValidationProvider} from "vee-validate"
import {Loading} from "element-ui";

export default {
  inject: ["reload"],
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
      bodyLoading: false,
      convertlabUrl: `${$themeConfig.app.projectHttpUrl}/convertlab`,
      dataSourceIdReadOnly: false,
      required,
      projectId: this.$store.state.myRequest.projectId,
      pageLength: 10,
      page: 1,
      total: 0,
      dir: false,
      editMode: false,
      authType: '',
      dataSources: ["mysql", "oracle", "sqlserver", "vertica"],
      paramRule: '{"userName":"username", "password":"password"}',
      columns: [
        {
          label: "数据源ID",
          field: "id",
          sortable: false
        },
        {
          label: "数据源名称",
          field: "name",
          sortable: false
        },
        {
          label: "数据类型",
          field: "category",
          sortable: false
        },
        {
          label: "配置方式",
          field: "connStrSource",
          sortable: false
        },
        {
          label: "描述",
          field: "desci",
          sortable: false
        },
        {
          label: "操作",
          field: "option",
          sortable: false
        }
      ],
      operateType: 1,
      categoryOptions: [
        {
          label: 'vertica',
          value: 'vertica'
        },
        {
          label: 'oracle',
          value: 'oracle'
        },
        {
          label: 'sqlserver',
          value: 'sqlserver'
        },
        {
          label: 'mysql',
          value: 'mysql'
        },
        {
          label: 'service',
          value: 'service'
        }
      ],
      connStrSourceOptions: [
        {
          label: '手动配置',
          value: 'user-input'
        },
        {
          label: '配置中心',
          value: 'config-registry'
        }
      ],
      authTypeOptions: [
        {
          label: '免认证',
          value: 0
        },
        {
          label: '账号密码',
          value: 1
        },
        {
          label: '其他',
          value: 2
        }
      ],
      authRequestTypeOptions: [
        {
          label: '请求头',
          value: 0
        },
        {
          label: '请求参数',
          value: 1
        }
      ],
      rows: [],
      projectList: [],
      searchTerm: '',
      category:'',
      form: {
        id: '',
        name: '',
        projectId: this.$store.state.myRequest.projectId,
        category: '',
        connStrSource: '',
        connStr: '',
        path: '',
        userName: '',
        password: '',
        desci: '',
        authType: null,
        authParam: null,
        authRequestType: null,
        authRequestUrl: null,
        authReplaceRules: null
      }
    }
  },
  watch: {
    category() {
      if (this.editMode) {
        this.editMode = false
        return
      }
      this.form.category = this.category
      this.form.authType = null
      if (this.category === 'service') {
        this.form.connStrSource = 'user-input'
      }
    },
    authType() {
      this.form.authType = this.authType
      if (this.authType === 0 || this.authType === 2) {
        this.form.authParam = null
      }
    }
  },
  computed: {
    direction() {
      if (store.state.appConfig.isRTL) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.dir = true;
        return this.dir;
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.dir = false;
      return this.dir;
    },
  },
  created() {
    this.getDataSourceList()
  },
  methods: {
    getDataSourceList() {
      this.bodyLoading = true
      const _data = {
        curl: this.convertlabUrl,
        projectId: this.projectId,
        path: '/datasource/search'
      }
      this.$store.dispatch("httpGet", _data).then((res) => {
        this.rows = res.data;
        this.bodyLoading = false
      })
    },
    closeEditModal() {
      this.$bvModal.hide("dataSourceForm")
    },
    showEditModal(operateType, rowData) {
      this.operateType = operateType
      if (operateType === 2) {
        this.dataSourceIdReadOnly = true
        this.editMode = true
        this.form = {
          projectId: this.projectId,
          id: rowData.id,
          name: rowData.name,
          category: rowData.category,
          connStr: rowData.connStr,
          connStrSource: rowData.connStrSource,
          path: '/datasource/update',
          userName: rowData.userName,
          password: rowData.password,
          desci: rowData.desci,
          authType: rowData.authType,
          authParam: rowData.authParam,
          authRequestUrl: rowData.authRequestUrl,
          authRequestType: rowData.authRequestType,
          authReplaceRules: rowData.authReplaceRules
        }
        this.category = this.form.category
        this.authType = this.form.authType
      } else {
        this.dataSourceIdReadOnly = false
        this.category = ''
        this.authType = null
        this.form = {
          id: '',
          name: '',
          projectId: this.projectId,
          category: '',
          connStrSource: '',
          connStr: '',
          path: '',
          userName: '',
          password: '',
          desci: '',
          authType: null,
          authParam: null,
          authRequestType: null,
          authRequestUrl: null,
          authReplaceRules: null
        }
      }
      this.$bvModal.show("dataSourceForm")
    },
    editSaveService() {
      let loadingInstance = Loading.service({
        text: '正在提交...'
      })
      this.$refs.serviceRules.validate().then((success) => {
        this.$nextTick(() => {
          loadingInstance.close()
        })
        if (success) {
          if (this.operateType === 1) {
            // 新增
            this.form.curl = this.convertlabUrl
            this.form.path = '/datasource/add'
            if (this.form.authType === 1) {
              this.form.authParam = this.paramRule
            }
            this.$store.dispatch("httpPost", this.form).then((res) => {
              if (res.flag && res.message === "添加成功") {
                this.$bvModal.hide("dataSourceForm")
                this.getDataSourceList();
                this.$bvToast.toast("添加成功", {
                  title: "操作提示",
                  toaster: 'b-toaster-top-center',
                  solid: true,
                  variant: "success",
                  autoHideDelay: 2000
                })
              } else {
                this.$bvToast.toast(res.message, {
                  title: "操作提示",
                  toaster: 'b-toaster-top-center',
                  solid: true,
                  variant: "danger",
                  autoHideDelay: 2000
                })
              }
            })
          } else {
            // 修改
            this.form.curl = this.convertlabUrl
            if (this.form.authType === 1) {
              this.form.authParam = this.paramRule
            }
            this.$store.dispatch("httpPost", this.form).then((res) => {
              if (res.flag) {
                this.$bvModal.hide("dataSourceForm")
                this.getDataSourceList()
                this.$bvToast.toast("修改成功", {
                  title: "操作提示",
                  toaster: 'b-toaster-top-center',
                  solid: true,
                  variant: "success",
                  autoHideDelay: 2000
                })
              } else {
                this.$bvToast.toast(res.message, {
                  title: "操作提示",
                  toaster: 'b-toaster-top-center',
                  solid: true,
                  variant: "danger",
                  autoHideDelay: 2000
                })
              }
            })
          }
        }
      })
    },
    deleteDataSource(props) {
      this.$confirm("确认删除 " + props, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const _data = {
          curl: this.convertlabUrl,
          id: props,
          projectId: this.projectId,
          path: '/datasource/delete'
        }
        this.$store.dispatch("httpPost", _data).then((res) => {
          if (res.flag) {
            this.getDataSourceList();
            this.$bvToast.toast("删除成功", {
              title: "操作提示",
              toaster: 'b-toaster-top-center',
              solid: true,
              variant: "success",
              autoHideDelay: 2000
            })
          } else {
            this.$bvToast.toast(res.message, {
              title: "操作提示",
              toaster: 'b-toaster-top-center',
              solid: true,
              variant: "danger",
              autoHideDelay: 2000
            })
          }
        })
      }).catch(() => {
      })
    },
    refreshForm() {
      this.reload()
    },
    testConnection(form) {
      let loadingInstance = Loading.service({
        text: '正在测试连接...'
      })
      let _data = {
        curl: $themeConfig.app.orgbaseinfoUrl + '/db/connect',
        jdbcUrl: form.connStr,
        username: form.userName,
        password: form.password
      }
      this.$store.dispatch('httpPost', _data).then(res => {
        this.$nextTick(() => {
          loadingInstance.close()
        })
        if (res.flag) {
          this.$bvToast.toast("连接成功", {
            title: "操作提示",
            toaster: 'b-toaster-top-center',
            solid: true,
            variant: "success",
            autoHideDelay: 2000
          })
        } else {
          this.$bvToast.toast(res.message, {
            title: "连接失败",
            toaster: 'b-toaster-top-center',
            solid: true,
            variant: "danger",
            autoHideDelay: 2000
          })
        }
      }).catch(e => {
        this.$nextTick(() => {
          loadingInstance.close()
        })
        this.$bvToast.toast(e.msg.error + '', {
          title: "异常",
          toaster: 'b-toaster-top-center',
          solid: true,
          variant: "danger",
          autoHideDelay: 2000
        })
      })
    }
  }
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