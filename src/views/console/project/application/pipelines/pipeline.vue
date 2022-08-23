<template>
  <div>
    <!-- Table Top -->
    <div class="m-2">
      <b-row>
        <!-- Per Page -->
        <b-col cols="12" md="6" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
          <div style="margin-right: 10px">
            <b-button-group size="sm">
              <b-button variant="primary" @click="showEditModal(1)"><i class="el-icon-plus"/>新建流水线</b-button>
            </b-button-group>
          </div>
        </b-col>
        <!-- Search -->
        <b-col cols="12" md="6">
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
    <!-- list -->
    <b-row class="blog-list-wrapper">
      <b-col
          v-for="pipeline in pipelineList"
          :key="pipeline.img"
          md="12"
      >
        <pipeline-card
            class="pipeline-card"
            icon="CloudIcon"
            color="primary"
            :pipeline-id=pipeline.id
            :pipeline-name=pipeline.name
            :pipeline-type=pipeline.type
            :service=pipeline.service
            :defender=pipeline.defender
            :configId=pipeline.appId
            :latest-job=pipeline.latestJob
            :create-time=pipeline.createTime
            :update-time=pipeline.updateTime
        />
      </b-col>
    </b-row>
    <!--/ list -->
    <!-- pagination -->
    <b-col cols="12">
      <div class="my-2">
        <b-pagination
            v-model="currentPage"
            align="center"
            :total-rows="rows"
            first-number
            last-number
            prev-class="prev-item"
            next-class="next-item"
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
    </b-col>
    <!--/ pagination -->
  </div>
</template>

<script>
import { $themeConfig } from '@themeConfig'
import PipelineCard from '@/views/console/project/application/pipelines/PipelineCard'

export default {
  name: 'pipeline',
  components: {
    PipelineCard,
  },
  data() {
    return {
      search_query: '',
      pipelineList: [],
      blogSidebar: {},
      currentPage: 1,
      perPage: 1,
      rows: 140,
      projectId: this.$store.state.myRequest.projectId,
    }
  },
  created() {
    this.getPipelineList()
  },
  methods: {
    getPipelineList() {
      const that = this
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/pipeline/` + this.projectId,
        page: 1,
        size: 20,
      }
      that.$store.dispatch('httpGet', _data)
          .then(res => {
            if (res.flag) {
              that.pipelineList = res.data.records
              that.total = res.data.total
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
    },
  }
}
</script>

<style lang="scss">
@import 'src/@core/scss/vue/pages/page-blog.scss';
</style>
