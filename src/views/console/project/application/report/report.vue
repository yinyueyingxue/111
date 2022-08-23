<template>
  <b-card no-body>
    <div class="m-2">
      <!-- Search -->
      <b-col
          cols="12"
          md="4"
          style="float: right;"
      >
        <div class="d-flex align-items-center justify-content-end">
          <b-form-input
              v-model="searchTerm"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              class="d-inline-block mr-1"
              placeholder="请输入周数..."
          />
          <b-button
              variant="outline-primary"
              class="btn-icon"
              @click="refreshForm"
          >
            <feather-icon icon="RefreshCwIcon"/>
          </b-button>
        </div>
      </b-col>
    </div>
    <!-- table -->
    <vue-good-table
        v-loading="bodyLoading"
        style-class="vgt-table striped"
        :columns="columns"
        :rows="rows"
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
      <template
          slot="table-row"
          slot-scope="props"
      >
        <!-- Column: Action -->
        <span v-if="props.column.field === 'detail'">
          <span>
            <b-button
                variant="outline-primary"
                size="sm"
                @click="showDetail(props.row)"
            >
              查看详情
            </b-button>
          </span>
        </span>

        <!-- Column: Common -->
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
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
              <span v-on:total="totalElements" class="text-nowrap ">
                共 {{totalElements}} 条，每页显示
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
                  :total-rows="totalElements"
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
  </b-card>
</template>

<script>
import { VueGoodTable } from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'
import store from '@/store/index'

import { $themeConfig } from '@themeConfig'

export default {
  inject: ['reload'],
  components: {
    VueGoodTable
  },
  data() {
    return {
      bodyLoading: false, // 页面加载状态
      projectId: this.$store.state.myRequest.projectId,
      isRouterAlive: true,
      pageLength: 10,
      currentPage: 1,
      pageChange: true,
      dir: false,
      columns: [
        {
          label: '周数',
          field: 'weekNum',
          hidden: false,
          sortable: false,
          sortFn: this.numSortFn
        },
        {
          label: '服务数',
          field: 'serviceCount',
          hidden: false,
          sortable: false,
          sortFn: this.numSortFn
        },
        {
          label: '实例数',
          field: 'podCount',
          hidden: false,
          sortable: false,
          sortFn: this.numSortFn
        },
        {
          label: '开始时间',
          field: 'startDate',
          hidden: false,
          sortable: false,
          sortFn: this.dateSortFn
        },
        {
          label: '结束时间',
          field: 'endDate',
          hidden: false,
          sortable: false,
          sortFn: this.dateSortFn
        },
        {
          label: '详情',
          field: 'detail',
          hidden: false,
          sortable: false
        }
      ],
      rows: [],
      totalElements: 0,
      searchTerm: ''
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
    }
  },
  created() {
    this.getReportList(this.currentPage, this.pageLength)
  },
  methods: {
    getReportList(currentPage, pageSize, weekNum) {
      let that = this
      that.bodyLoading = true
      let _data = {
        curl: $themeConfig.app.projectHttpUrl + '/operationReport/list',
        projectId: that.projectId
      }
      _data["page"] = currentPage
      _data["size"] = pageSize
      if (weekNum) {
        _data["weekNum"] = weekNum
      }
      that.$store.dispatch('httpGet', _data).then(function (res) {
        that.rows = res.data.content
        that.totalElements = res.data.totalElements
        that.bodyLoading = false
      })
    },
    onPageChange(param) {
      // currentPerPage改变时，如果不在第一页，currentPage也会变化，此时onPerPageChange与onPageChange都会执行
      // 加上判断避免不在第一页时，更改currentPerPage导致查询两次
      if (param.currentPage === 1 && !this.pageChange) {
        this.pageChange = true
        return
      }
      this.getReportList(param.currentPage, param.currentPerPage, this.searchTerm)
    },
    onPerPageChange(param) {
      this.pageChange = false
      this.getReportList(param.currentPage, param.currentPerPage, this.searchTerm)
    },
    numSortFn(x, y) {
      return parseInt(x) - parseInt(y)
    },
    dateSortFn(x, y) {
      return new Date(x) - new Date(y)
    },
    showDetail(val) {
      this.$router.push({
        path: "/project/report/detail",
		query:{
			projectId: this.$store.state.myRequest.projectId,
			id: val.id 
		}
      })
    },
    refreshForm() {
      this.reload()
    }
  },
  watch: {
    searchTerm(val) {
      this.getReportList(1, this.pageLength, val)
    }
  }
}
</script>
