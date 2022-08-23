<template>
  <b-card
      no-body
  >
    <div class="m-2 logSearchForm">
      <!--            <el-form ref="form" :model="form" label-width="80px" @submit.native.prevent>-->
      <el-row>
        <el-col :span="24" style="margin-bottom: 5px">
          <span style="margin-right: 10px">账　　号</span>
          <el-input size="small" v-model="form.userId" autocomplete="off" @keyup.enter.native="getLogList"
                    style="width: 15%"/>
          <span class="searchLabel">请求地址</span>
          <el-input size="small" v-model="form.requestUrl" autocomplete="off"
                    @keyup.enter.native="getLogList"
                    style="width: 30%"/>
          <span class="searchLabel">服务Id</span>
          <el-input size="small" v-model="form.serviceId" autocomplete="off"
                    @keyup.enter.native="getLogList"
                    style="width: 15%"/>
          <span style="margin-right: 10px">请求状态</span>
          <el-select size="small" v-model="form.statusCode" clearable @change="getLogList"
                     style="width: 15%"
          >
            <el-option label="全部" value=""/>
            <el-option label="成功" value="0"/>
            <el-option label="失败" value="1"/>
          </el-select>
        </el-col>
        <el-col :span="24">
          <span style=" margin-right: 10px">请求日期</span>
          <el-date-picker
              style="width: 30%"
              v-model="form.searchTime"
              type="datetimerange"
              size="small"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
          </el-date-picker>
          <el-button size="small" type="primary" @click="getLogList"
                     style="margin-left: 10px;margin-right: 10px">查询
          </el-button>
        </el-col>
      </el-row>
      <!--            </el-form>-->
    </div>
    <div>
      <b-modal
          id="exception-msg"
          modal-class="modal-danger"
          hide-footer
          centered
          title="异常信息"
      >
        <b-card-text>
          {{ exceptionMsg }}
        </b-card-text>
      </b-modal>
    </div>
    <!-- table -->
    <vue-good-table v-loading="bodyLoading" :columns="columns" :rows="rows" style-class="vgt-table striped"
                    style='table-layout:fixed;'
                    :pagination-options="{
        enabled: true,
        perPage:50
      }"
                    @on-row-click="onRowClick"
    >
      <template slot="table-row" slot-scope="props">
                <span v-if="props.column.field === 'executeTime'">
						{{ props.row.executeTime }}ms
				</span>
        <span v-else-if="props.column.field ==='userId'">
                    账　号：{{ props.row.userId }}<br>
                    服务Id：{{ props.row.serviceId }}
                </span>
        <span v-else-if="props.column.field ==='statusCode'">
          <b-badge pill :id="`log-flag-${props.row.id}`" :variant="props.row.statusCode===0?'success':'danger'">
					 {{ props.row.statusCode === 0 ? '成功' : '失败' }}
					</b-badge>
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
							共 {{ total }} 条，每页显示
						</span>
              <b-form-select v-model="pageLength" :options="[5,10,20,50]" class="mx-1"
                             @input="pageSizeChanged(pageLength)"
              />
              <span class="text-nowrap"> 条 </span>
            </div>
            <div>
              <b-pagination :value="1" :total-rows="total" :per-page="pageLength" first-number
                            last-number align="right" prev-class="prev-item" next-class="next-item"
                            class="mt-1 mb-0"
                            @input="(value)=>pageChanged({currentPage:value})"
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
  BBadge,
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
  Select,
  Input,
  FormItem,
  Form
} from 'element-ui'

export default {
  inject: ['reload'],
  components: {
    BBadge,
    BCard,
    VueGoodTable,
    Select,
    Input,
    FormItem,
    Form
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      bodyLoading: false,
      projectId: this.$store.state.myRequest.projectId,
      pageLength: 10,
      page: 1,
      total: 0,
      dir: false,
      exceptionMsg: '',
      columns: [
        {
          label: '账号信息',
          field: 'userId',
          sortable: false
        },
        {
          label: 'IP',
          field: 'clientIP',
          sortable: false
        },
        {
          label: '请求时间',
          field: 'requestTime',
          sortable: false
        },
        {
          label: '请求地址',
          field: 'requestUrl',
          sortable: false
        },
        {
          label: '执行时间',
          field: 'executeTime',
          sortable: false
        },
        {
          label: '请求状态',
          field: 'statusCode',
          sortable: false
        },
      ],
      rows: [],
      searchTerm: '',
      form: {
        userId: '',
        requestUrl: '',
        serviceId: '',
        flag: '',
        type: '',
        searchTime: '',
        statusCode: ''
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },

  computed: {
    direction() {
      if (store.state.appConfig.isRTL) {
        this.dir = true
        return this.dir
      }
      this.dir = false
      return this.dir
    },
    typeVariant(val) {
      if (val === 0) {
        return 'success'
      } else {
        return 'danger'
      }
    },
  },
  created() {
    this.getLogList()
  },
  methods: {
    parseIp(ip) {
      return ip.substring(0, ip.indexOf(':'))
    },
    pageSizeChanged(val) {
      this.pageLength = val
      this.getLogList()
    },
    pageChanged(val) {
      // debugger
      this.page = val.currentPage
      this.getLogList()
    },
    getLogList() {
      const that = this
      that.bodyLoading = true
      let searchTimeParam = '';
      if (that.form.searchTime !== '' && that.form.searchTime !== null) {
        searchTimeParam = that.form.searchTime.toString()
      }
      const _data = {
        curl: `${$themeConfig.app.logHttpUrl}/ipaas/factory/log`,
        page: that.page,
        size: that.pageLength,
        provideProjectId: that.projectId,
        userId: that.form.userId,
        requestUrl: that.form.requestUrl,
        serviceId: that.form.serviceId,
        statusCode: that.form.statusCode,
        searchTime: searchTimeParam
      }
      that.$store.dispatch('httpGet', _data).then(res => {
        if (res.flag) {
          that.rows = res.data.records
          that.total = res.data.total
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
    parseType(type) {
      switch (type) {
        case 1:
          return '普通日志'
        case 2:
          return '数据总线日志'
        case 3:
          return 'API代理日志'
        default:
          return '普通日志'
      }
    },
    refreshForm() {
      this.reload()
    },
    onRowClick(data) {
      if (data.row.statusCode !==0) {
        this.exceptionMsg = data.row.exceptionMsg
        this.$bvModal.show('exception-msg')
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

.logSearchForm .searchLabel {
  margin-left: 10px;
  margin-right: 10px
}

</style>

