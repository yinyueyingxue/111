<template>
  <b-card no-body>
    <div class="m-2">
      <!-- Table Top -->
      <b-row>
        <b-col md="8">
          <b-button variant="primary" @click="showEditModal(1)">
            <i class="el-icon-plus"/>
            新增集群
          </b-button>
        </b-col>
      </b-row>
    </div>
    <div>
      <b-modal 
        id="clusterForm" 
        centered 
        :title="operateType === 1 ? '新增集群' : '编辑集群'" 
        hide-footer
        no-close-on-backdrop
        no-close-on-es 
        modal-class="modal-primary" 
        size="xl"
        @hidden="resetTableData"
      >
        <validation-observer ref="serviceRules">
          <b-form>
            <b-row>
              <b-col cols="6">
                <b-form-group label="集群ID" label-for="clusterId">
                  <b-input-group class="input-group-merge">
                    <b-form-input id="clusterId" v-model="form.clusterId" :readonly="clusterIdReadOnly" placeholder=""/>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <!-- mobile -->
              <b-col cols="6">
                <b-form-group label="集群名称" label-for="clusterName">
                  <b-input-group class="input-group-merge">
                    <b-form-input id="clusterName" v-model="form.clusterName" placeholder=""/>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="负责人" label-for="defender">
                  <el-select 
                    v-model="form.defender" 
                    placeholder="请输入姓名/域账号/工号 搜索" 
                    clearable
                    filterable
                    reserve-keyword 
                    remote 
                    :remote-method="selectDefender" 
                    :loading="loading"
                    style="width: 100%">
                    <el-option v-for="item in defenderOptions" :key="item.value" :label="item.label" :value="item.value"/>
                  </el-select>
                </b-form-group>
              </b-col>
              <b-col cols="6">
                <b-form-group label="集群配置" label-for="fimeStream">
                  <b-input-group class="input-group-merge">
                    <el-upload
                      class="upload-demo"
                      ref="upload"
                      :action="uploadUrl"
                      :data="uploadData"
                      :on-error="uploadError"
                      :on-success="uploadSuccess"
                      :headers="uploadHeaders"
                      :auto-upload="false">
                      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="K8S Token" label-for="k8sToken">
                  <b-input-group class="input-group-merge">
                    <b-form-textarea id="k8sToken" v-model="form.k8sToken" placeholder="" />
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="标签(多个逗号隔开)" label-for="k8sToken">
                  <b-input-group class="input-group-merge">
                    <b-form-input id="k8sToken" v-model="form.labels" placeholder="" />
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col cols="2">
                <span class="col-kong">网关编码</span>
                <b-input-group class="input-group-merge" style="height: 0 !important;">
                  <b-form-input id="clusterName" v-model="form.kongList[0].kongCode" placeholder="" />
                </b-input-group>
              </b-col>
              <b-col cols="3">
                <span class="col-kong">网关名称</span>
                <b-input-group class="input-group-merge">
                  <b-form-input id="clusterName" v-model="form.kongList[0].kongName" placeholder="" />
                </b-input-group>
              </b-col>
              <b-col cols="3">
                <span class="col-kong">网关IP</span>
                <b-input-group class="input-group-merge">
                  <b-form-input id="clusterName" v-model="form.kongList[0].kongIp" placeholder="" />
                </b-input-group>
              </b-col>
              <b-col cols="3">
                <span class="col-kong">网关域名</span>
                <b-input-group class="input-group-merge">
                  <b-form-input id="clusterName" v-model="form.kongList[0].kongDomain" placeholder="" />
                </b-input-group>
              </b-col>
              <b-col cols="1">
                <b-button size="sm" @click="addItem" v-ripple.400="'rgba(40, 199, 111, 0.15)'" variant="flat-success">
                  <feather-icon icon="PlusIcon" class="mr-25" />
                </b-button>
              </b-col>
              <b-col cols="12">
                <b-row
                  v-for="(item, index) in form.kongList.slice(1)"
                  :id="item.kongCode"
                  :key="item.kongCode"
                  ref="row"
                  style="padding-top: 10px"
                >
                  <b-col cols="2" class="col-another">
                    <b-input-group class="input-group-merge">
                      <b-form-input id="clusterName" v-model="item.kongCode" placeholder="" />
                    </b-input-group>
                  </b-col>
                  <b-col cols="3" class="col-another">
                    <b-input-group class="input-group-merge">
                      <b-form-input id="clusterName" v-model="item.kongName" placeholder="" />
                    </b-input-group>
                  </b-col>
                  <b-col cols="3" class="col-another">
                    <b-input-group class="input-group-merge">
                      <b-form-input id="clusterName" v-model="item.kongIp" placeholder="" />
                    </b-input-group>
                  </b-col>
                  <b-col cols="3" class="col-another">
                    <b-input-group class="input-group-merge">
                      <b-form-input id="clusterName" v-model="item.kongDomain" placeholder="" />
                    </b-input-group>
                  </b-col>
                  <b-col cols="1" class="col-another">
                    <b-button
                      v-if="kongListLength - 2 === index"
                      size="sm"
                      @click="removeItem(index)"
                      v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                      variant="flat-danger"
                    >
                      <feather-icon icon="MinusIcon" class="mr-25" />
                    </b-button>
                  </b-col>
                </b-row>
              </b-col>
              <b-col cols="12" style="margin-top: 16px">
                <b-form-group label="Grafana服务监控地址" label-for="clusterId">
                  <b-input-group class="input-group-merge">
                    <b-form-input id="clusterId" v-model="form.extension.grafana.server" placeholder="" />
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="Grafana容器监控地址" label-for="clusterId">
                  <b-input-group class="input-group-merge">
                    <b-form-input id="clusterId" v-model="form.extension.grafana.container" placeholder="" />
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col cols="4">
                <b-form-group label="XXL-JOB域名" label-for="clusterId">
                  <b-input-group class="input-group-merge">
                    <b-form-input id="clusterId" v-model="form.extension.xxlJob.domain" placeholder="" />
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col cols="4">
                <b-form-group label="XXL-JOB用户名" label-for="clusterId">
                  <b-input-group class="input-group-merge">
                    <b-form-input id="clusterId" v-model="form.extension.xxlJob.username" placeholder="" />
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col cols="4">
                <b-form-group label="XXL-JOB密码" label-for="clusterId">
                  <b-input-group class="input-group-merge">
                    <b-form-input id="clusterId" type="password" v-model="form.extension.xxlJob.password" placeholder="" />
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="Skywalking地址" label-for="clusterId">
                  <b-input-group class="input-group-merge">
                    <b-form-input id="clusterId" v-model="form.extension.skywalking.url" placeholder="" />
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
                  style="float: right; margin-right: 0 !important;"
                  class="mr-1" 
                  @click.prevent="editSaveCluster"
                >提交</b-button>
                <b-button 
                  v-ripple.400="'rgba(186, 191, 199, 0.15)'" 
                  type="button" 
                  variant="outline-secondary" 
                  size="sm"
                  style="float: right; margin-right: 10px"
                  @click="closeEditModal"
                >取消</b-button>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </b-modal>
    </div>
    <vxe-table ref="xTable" border :expand-config="{accordion: true}" :data="tableData">
      <vxe-column type="seq" width="60"></vxe-column>
      <vxe-column type="expand" title="集群ID">
        <template #default="{ row }">
          <span>{{ row.clusterId }}</span>
        </template>
        <template #content="{ row, rowIndex }">
          <div class="expand-wrapper" style="padding: 10px 60px">
            <vxe-table border :data="tableData[rowIndex].kongList">
              <vxe-column field="kongCode" title="网关编码"></vxe-column>
              <vxe-column field="kongName" title="网关名称"></vxe-column>
              <vxe-column field="kongIp" title="网关IP"></vxe-column>
              <vxe-column field="kongDomain" title="网关域名"></vxe-column>
            </vxe-table>
          </div>
        </template>
      </vxe-column>
      <vxe-column field="clusterName" title="集群名称"></vxe-column>
      <vxe-column field="defender" title="负责人"></vxe-column>
      <vxe-column field="createTime" title="创建时间"></vxe-column>
      <vxe-column field="updateTime" title="更新时间"></vxe-column>
      <vxe-column field="operation" title="操作">
        <template #default="{ row }">
          <feather-icon icon="EditIcon" size="16" class="mx-1" @click="showEditModal(2, row)" v-b-tooltip.hover title="编辑" style="cursor:pointer" />
          <feather-icon icon="FileTextIcon" size="16" class="mx-1" @click="showFileContent(row)" v-b-tooltip.hover title="查看配置" style="cursor:pointer" />
        </template>
      </vxe-column>
    </vxe-table>
    <div>
      <b-sidebar id="sidebar-right" v-model="yamlSidebarActive" sidebar-class="sidebar-lg" bg-variant="white" title="集群配置内容" right backdrop shadow width="40%">
        <b-form class="p-2">
          <b-form-group>
            <b-row>
              <b-col cols="12">
                <codemirror id="yamlContent" ref="yamlContent" v-model="content" :options="cmOptions"></codemirror>
              </b-col>
            </b-row>
          </b-form-group>
        </b-form>
      </b-sidebar>
    </div>
  </b-card>
</template>

<script>
import {$themeConfig} from "@themeConfig"
import store from "@/store"
import {codemirror} from 'vue-codemirror'
import 'codemirror/mode/yaml/yaml.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/darcula.css'
import {Loading} from 'element-ui'
import {ValidationObserver, ValidationProvider} from "vee-validate"
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    codemirror
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      uploadUrl: $themeConfig.app.projectHttpUrl + '/cluster/upload',
      uploadHeaders: {Authorization: 'Bearer ' + store.state.myRequest.jwtToken},
      uploadData: null,
      clusters: [],
      pageLength: 10,
      currentPage: 1,
      pageChange: true,
      dir: false,
      originTableData: [],
      tableData: [],
      rows: [],
      content: null,
      dialogVisible: false,
      yamlSidebarActive: false,
      cmOptions: {
        // tabSize: 4,
        mode: 'yaml',
        theme: 'darcula',
        lineNumbers: true,
        line: true,
        lineWrapping: true,
        indentUnit: 2,
        readOnly: this.yamlReadOnly
        // autofocus: true,
        // autoRefresh: true
        // readOnly:true
      },
      form: {
        clusterId: null,
        clusterName: null,
        defender: null,
        k8sToken: null,
        labels: null,
        kongList: [{
          kongIp: '',
          kongCode: '',
          kongName: '',
          kongDomain: ''
        }],
        extension: {
          grafana: {
            server: '',
            container: ''
          },
          xxlJob: {
            domain: '',
            username: '',
            password: ''
          },
          skywalking: {
            url: ''
          }
        }
      },
      index: 0,
      operateType: 1,
      clusterIdReadOnly: false,
      defenderOptions: [],
      loading: false,
      kongListLength: 0,
      fileContentObj: {}
    }
  },
  watch: {
    'form.kongList'() {
      if (!this.form.kongList) this.addItem()
      this.kongListLength = this.form.kongList.length
    },
    'form.clusterId'() {
      this.uploadData = {
        clusterId: this.form.clusterId
      }
    }
  },
  methods: {
    resetForm() {
      this.form = {
        clusterId: null,
        clusterName: null,
        defender: null,
        k8sToken: null,
        labels: null,
        kongList: [{
          kongIp: '',
          kongCode: '',
          kongName: '',
          kongDomain: ''
        }],
        extension: {
          grafana: {
            server: '',
            container: ''
          },
          xxlJob: {
            domain: '',
            username:  '',
            password: ''
          },
          skywalking: {
            url: ''
          }
        }
      }
    },
    addItem() {
      let kong = {
        kongCode: '',
        kongName: '',
        kongIp: '',
        kongDomain: ''
      }
      if (!this.form.kongList) this.form.kongList = []
      this.form.kongList.push(kong)
    },
    removeItem(index) {
      this.form.kongList.pop()
    },
    listClusters() {
      let _data = {
        curl: $themeConfig.app.projectHttpUrl + '/cluster/list'
      }
      this.$store.dispatch('httpGet', _data).then(res => {
        if (res.flag) {
          this.originTableData = JSON.parse(JSON.stringify(res.data))
          this.tableData = res.data
          this.totalElements = res.data.length
        }
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    uploadError() {
      this.$bvToast.toast("文件上传失败，可使用编辑重新上传", {
        title: "操作提示",
        toaster: 'b-toaster-top-center',
        solid: true,
        variant: "danger",
        autoHideDelay: 2000
      })
    },
    uploadSuccess(response) {
      if (!response.flag) {
        this.$bvToast.toast("文件上传失败，可使用编辑重新上传", {
          title: "操作提示",
          toaster: 'b-toaster-top-center',
          solid: true,
          variant: "danger",
          autoHideDelay: 2000
        })
      }
      this.getFilesContent()
    },
    showFileContent(row) {
      if (this.fileContentObj.hasOwnProperty(row.clusterId)) {
        this.content = this.fileContentObj[row.clusterId]
      } else {
        this.content = ''
      }
      this.yamlSidebarActive = true
      this.yamlReadOnly = true
      this.$bvModal.show('yamlContentModal')
    },
    closeEditModal() {
      this.resetTableData()
      this.$bvModal.hide("clusterForm")
    },
    showEditModal(operateType, rowData) {
      this.operateType = operateType
      if (operateType === 2) {
        this.clusterIdReadOnly = true
        this.editMode = true
        this.form.clusterId = rowData.clusterId
        this.form.clusterName = rowData.clusterName
        this.form.defender = rowData.defender
        this.form.k8sToken = rowData.k8sToken
        this.form.labels = rowData.labels
        if (rowData.kongList !== null && rowData.kongList.length > 0) {
          this.form.kongList = JSON.parse(JSON.stringify(rowData.kongList))
        }
        this.form.extension = rowData.extension
      } else {
        this.clusterIdReadOnly = false
        this.category = ''
        this.authType = null
        this.resetForm()
      }
      this.$bvModal.show("clusterForm")
    },
    editSaveCluster() {
      let loadingInstance = Loading.service({
        text: '正在提交...'
      })
      this.form.kongList = this.form.kongList.filter(e => e.kongCode && e.kongIp)
      if (this.form.kongList.length === 0) {
        this.form.kongList = null
      }
      if (this.operateType === 1) {
        // 新增
        this.form.curl = $themeConfig.app.projectHttpUrl + '/cluster/add'
        this.$store.dispatch("httpPost", this.form).then((res) => {
          this.$nextTick(() => {
            loadingInstance.close()
          })
          if (res.flag && res.message === "添加成功") {
            this.submitUpload()
            this.$bvModal.hide("clusterForm")
            this.listClusters()
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
        }).catch(e => {
          this.$bvToast.toast(e.msg, {
            title: "操作提示",
            toaster: 'b-toaster-top-center',
            solid: true,
            variant: "danger",
            autoHideDelay: 2000
          })
          this.$nextTick(() => {
            loadingInstance.close()
          })
        })
      } else {
        // 修改
        this.form.curl = $themeConfig.app.projectHttpUrl + '/cluster/update'
        this.$store.dispatch("httpPut", this.form).then((res) => {
          // 关闭loading
          this.$nextTick(() => {
            loadingInstance.close()
          })
          if (res.flag) {
            this.submitUpload()
            this.$bvModal.hide("clusterForm")
            this.listClusters()
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
        }).catch(e => {
          let errorMsg = e.msg
          this.$bvToast.toast(errorMsg + '', {
            title: "操作提示",
            toaster: 'b-toaster-top-center',
            solid: true,
            variant: "danger",
            autoHideDelay: 2000
          })
          this.$nextTick(() => {
            loadingInstance.close()
          })
        })
      }
    },
    getFilesContent() {
      let _data = {
        curl: $themeConfig.app.projectHttpUrl + '/cluster/getFilesContent'
      }
      this.$store.dispatch('httpGet', _data).then(res => {
        if (res.flag) {
          this.fileContentObj = res.data
        }
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
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/project/getAllUserByAssociated`,
        param: query,
        page: 1,
        size: 10,
      }
      this.$store.dispatch('httpGet', _data).then(res => {
        if (res.flag || res.data.rows.size !== 0) {
          this.defenderOptions = []
          const userList = res.data.rows
          for (const item of userList) {
            const data = {
              value: item.domain_account,
              label: `${item.real_name} ${item.domain_account}`
            }
            this.defenderOptions.push(data)
          }
        } else {
          this.defenderOptions = []
        }
      })
    },
    resetTableData() {
      this.tableData = JSON.parse(JSON.stringify(this.originTableData))
      this.resetForm()
    },
    clearContent() {
      this.content = null
    }
  },
  created() {
    this.listClusters()
    this.getFilesContent()
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
    }
  }
}
</script>

<style lang="scss">
  .vgt-left-align {
    vertical-align: revert !important;
    color: #606266;
  }

  #yamlCode {
    .CodeMirror {
      overscroll-y: scroll !important;
      height: 400px !important;
    }
  }

  #yamlContent {
    .CodeMirror {
      overscroll-y: scroll !important;
      height: 10% !important;
    }
  }

  .modal {
    .modal-header {
      .close {
        transform: translate(0px, 0px) !important;
        box-shadow: 0 5px 20px 0 rgb(255 255 255 / 10%) !important;
        background: transparent !important;
      }
    }

    .modal-content {
      margin: 0 auto;
      width: 65rem;
      border: none;
      overflow: visible;
      box-shadow: 0 0.3125rem 1.25rem 0 rgb(34 41 47 / 10%);
    }
  }

  .col-1 {
    padding: 0;
  }

  .col-kong {
    font-size: 0.857rem !important;
    margin-bottom: 0.2857rem !important;
    display: block !important;
  }

  .el-button--primary {
    height: 35px;
  }
</style>