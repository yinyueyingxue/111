<template>
  <b-card no-body>
    <div class="m-2">
      <!-- Search -->
      <b-col md="4" style="float:right;">
        <div class="d-flex align-items-center justify-content-end">
          <b-form-input v-model="searchTerm" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                        class="d-inline-block mr-1" placeholder="Search..."
          />
          <b-button v-ripple.400="'rgba(113, 102, 240, 0.15)'" variant="outline-primary" class="btn-icon"
                    @click="refreshForm"
          >
            <feather-icon icon="RefreshCwIcon"/>
          </b-button>
        </div>
      </b-col>
    </div>
    <!-- Table Top End -->

    <!-- table -->
    <vue-good-table
        v-loading="bodyLoading"
        style-class="vgt-table striped"
        :columns="columns"
        :rows="userList"
        :rtl="direction"
        @on-page-change="onPageChange"
        @on-per-page-change="onPerPageChange"
        :sort-options="{
        enabled: true
        }"
        :pagination-options="{
        enabled: true,
        setCurrentPage: currentPage
      }"
    >
      <template slot="table-row" slot-scope="props">
				<span v-if="props.column.field === 'status'">
					<b-badge :variant="statusVariant(props.row.status)">
						{{ parseStatus(props.row.status) }}
					</b-badge>
				</span>
      </template>
      <!-- pagination -->
      <template
          slot="pagination-bottom"
          slot-scope="props"
      >
        <div class="mx-2 mb-2">
          <div class="d-flex justify-content-between flex-wrap">
            <div class="d-flex align-items-center mb-0 mt-1">
              <span v-on:total="total" class="text-nowrap ">
                共 {{ total }} 条，每页显示
              </span>
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
                  <feather-icon
                      icon="ChevronLeftIcon"
                      size="18"
                  />
                </template>
                <template #next-text>
                  <feather-icon
                      icon="ChevronRightIcon"
                      size="18"
                  />
                </template>
              </b-pagination>
            </div>
          </div>
        </div>
      </template>
    </vue-good-table>
    <!-- table -->

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
  name: 'application-account',
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
      bodyLoading: false,
      required,
      projectId: this.$store.state.myRequest.projectId,
      pageLength: 10,
      currentPage: 1,
      dir: false,
      columns: [
        {
          label: '应用账号',
          field: 'account',
          sortable: false
        },
        {
          label: '账号名称',
          field: 'name',
          sortable: false
        },
        {
          label: '责任人',
          field: 'defender',
          sortable: false
        },
        {
          label: '备注',
          field: 'remark',
          sortable: false
        },
        {
          label: '创建时间',
          field: 'createTime',
          sortable: false
        },
        {
          label: '状态',
          field: 'status',
          sortable: false
        },

      ],
      total: 0,
      userList: [],
      searchTerm: '',
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
    this.getEmployeeList(this.currentPage, this.pageLength)
  },
  methods: {
    getEmployeeList(page, size, account) {
      let that = this
      that.bodyLoading = true
      let _data = {
        curl: $themeConfig.app.userHttpUrl + '/application/search',
        projectId: this.projectId,
        page: page,
        size: size
      }
      if (account) {
        _data['account'] = account
      }
      that.$store.dispatch('httpGet', _data).then(function (res) {
        that.userList = res.data.rows
        that.total = res.data.total
        that.bodyLoading = false
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
    onPageChange(param) {
      // currentPerPage改变时，如果不在第一页，currentPage也会变化，此时onPerPageChange与onPageChange都会执行
      // 加上判断避免不在第一页时，更改currentPerPage导致查询两次
      if (param.currentPage === 1 && !this.pageChange) {
        this.pageChange = true
        return
      }
      this.getEmployeeList(param.currentPage, param.currentPerPage, this.searchTerm)
    },
    onPerPageChange(param) {
      this.pageChange = false
      this.getEmployeeList(param.currentPage, param.currentPerPage, this.searchTerm)
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
      this.getEmployeeList(1, this.pageLength, val)
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
