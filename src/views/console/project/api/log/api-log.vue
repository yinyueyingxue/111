<template>
  <div>
    <!-- Table Top -->
    <b-row style="margin-bottom: 12px">
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
              variant="outline-primary"
              class="btn-icon"
              @click="refreshForm"
          >
            <feather-icon icon="RefreshCwIcon"/>
          </b-button>
        </div>
      </b-col>
    </b-row>

    <!-- table -->
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :rtl="direction"
      :sort-options="{
      enabled: true
      }"
      :pagination-options="{
      enabled: true,
      setCurrentPage: currentPage
      }"
      :search-options="{
      enabled: true,
      externalQuery: searchTerm
      }"
    >
      <template
          slot="table-row"
          slot-scope="props"
      >
        <!-- Column: Common -->
        <span>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>

      <!-- pagination -->
      <template
          slot="pagination-bottom"
          slot-scope="props"
      >
        <div class="d-flex justify-content-between flex-wrap">
          <div class="d-flex align-items-center mb-0 mt-1">
            <span v-on:total="totalElements" class="text-nowrap ">
              共{{ totalElements }}条记录，每页显示
            </span>
            <b-form-select
                v-model="pageLength"
                :options="[2, 5, 10, 20, 50]"
                class="mx-1"
                @input="(value)=>props.perPageChanged({currentPerPage:value})"
            />
            <span class="text-nowrap">条记录 </span>
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
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import {VueGoodTable} from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'
import store from '@/store/index'

import {$themeConfig} from '@themeConfig'

export default {
  name: 'api-log',
  components: {
    VueGoodTable
  },
  data() {
    return {
      projectId: this.$store.state.myRequest.projectId,
      pageLength: 10,
      currentPage: 1,
      pageChange: true,
      dir: false,
      formInline: {
        keyword: ''
      },
      columns: [
        {
          label: '租户',
          field: 'projectId',
          hidden: false,
          sortable: true
        },
        {
          label: 'API ID',
          field: 'apiId',
          hidden: false,
          sortable: true,
          sortFn: this.numSortFn
        },
        {
          label: 'API视图ID',
          field: 'viewId',
          hidden: false,
          sortable: true
        },
        {
          label: 'API类型',
          field: 'typeId',
          hidden: false,
          sortable: true,
          sortFn: this.numSortFn
        },
        {
          label: '访问账号',
          field: 'account',
          hidden: false,
          sortable: true
        },
        {
          label: '请求类型',
          field: 'requestType',
          hidden: false,
          sortable: true
        },
        {
          label: '请求IP',
          field: 'requestIp',
          hidden: false,
          sortable: true
        },
        {
          label: '请求时长(ms)',
          field: 'takeTime',
          hidden: false,
          sortable: true,
          sortFn: this.numSortFn
        },
        {
          label: '状态码',
          field: 'code',
          hidden: false,
          sortable: true,
          sortFn: this.numSortFn
        },
        {
          label: '请求时间',
          field: 'requestTime',
          hidden: false,
          sortable: true,
          sortFn: this.dateSortFn
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
    this.getReportList()
  },
  methods: {
    getReportList() {
      let that = this
      let _data = {
        curl: $themeConfig.app.httpUrl + '/ocr-card/v1.0/idCardOcrRecord/list',
        projectId: this.projectId
      }
      that.$store.dispatch('httpGet', _data).then(function (res) {
        that.rows = res.data
        that.totalElements = res.data.length
      })
    },
    numSortFn(x, y) {
      return parseInt(x) - parseInt(y)
    },
    dateSortFn(x, y) {
      return new Date(x) - new Date(y)
    },
    refreshForm() {
      this.searchTerm = ''
      this.getReportList()
    }
  }
}
</script>
