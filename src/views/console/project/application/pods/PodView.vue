<template>
  <div>
    <!-- search input -->
    <div style="margin: 15px">
      <el-row>
        <el-col :span="24">
          <span style="margin-right: 10px">所属集群</span>
          <el-select v-model="cluster" placeholder="请选择">
            <el-option v-for="item in clusterOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-input v-model="searchTerm" placeholder="搜索" @keyup.native.enter="getPodList" style="width: 20%; margin-left: 0.625rem" />
          <el-button class="searchMargin" type="primary" icon="el-icon-search" circle @click="getPodList" style="margin-left: 0.625rem"></el-button>
        </el-col>
      </el-row>
    </div>

    <div v-if="loading">
      <div style="text-align: center" v-if="bodyLoading">
        <b-spinner variant="primary" label="Spinning"></b-spinner>
      </div>

      <b-row class="blog-list-wrapper match-height">
        <b-col>
          <pod-view-card :podslist="filteredPodList" icon="CloudIcon" color="primary" @getPodList="getPod()" @handleStop="getPodStop()"></pod-view-card>
          <!-- <pod-view-card :pod="pod" icon="CloudIcon" color="primary" ></pod-view-card> -->
        </b-col>
      </b-row>
    </div>
    <div v-if="!loading">
      <el-empty description="该租户暂无实例化服务"></el-empty>
    </div>
  </div>
</template>

<script>
import { $themeConfig } from '@themeConfig'
import PodViewCard from '@/views/console/project/application/pods/PodViewCard'

export default {
  name: 'PodView',
  components: { PodViewCard },
  data() {
    return {
      bodyLoading: false, // 页面加载状态
      search_query: '',
      loading: true,
      podList: [],
      clusterOptions: [],
      cluster: '',
      filteredPodList: [],
      searchTerm: '',
      currentPage: 1,
      perPage: 1,
      rows: 140,
      projectId: this.$store.state.myRequest.projectId,
    }
  },
  watch: {
    cluster: function (newValue, oldValue) {
      this.$store.commit('getClusterHeader', newValue)
    },
  },
  created() {
    if (this.$route.params.searchTerm) {
      this.searchTerm = this.$route.params.searchTerm
    }
    this.getClusterOptions()
    this.getPodList()
  },
  methods: {
    getPodStop() {
      this.$message.warning('正在停止运行')
      setTimeout(() => {
        this.getPodList()
      }, 8000)
    },
    getPod() {
      setTimeout(() => {
        this.getPodList()
      }, 1000)
    },
    getClusterOptions() {
      const that = this
      that.bodyLoading = true
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/cluster/getClusterIds`,
      }
      that.$store.dispatch('httpGet', _data).then((res) => {
        if (res.flag) {
          that.clusterOptions = res.data
          that.cluster = res.data[0]
        } else {
          that.clusterOptions = []
        }
      })
    },
    // rebuildPod(podId) {
    //   let that = this
    //   this.$prompt('您确认要重建吗?如确认重建，请输入"我确认"', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //     inputPattern: /^\u6211\u786e\u8ba4$/,
    //     closeOnClickModal: false,
    //     closeOnPressEscape: false,
    //     inputErrorMessage: '输入不正确',
    //   }).then(async () => {
    //     const _data = {
    //       curl: `${$themeConfig.app.projectHttpUrl}/pod/` + this.projectId + '/' + podId,
    //     }
    //     this.$store.dispatch('httpDelete', _data).then((res) => {
    //       if (res.flag) {
    //         that.getPodList()
    //         that.$bvToast.toast('重建中...', {
    //           title: '操作提示',
    //           toaster: 'b-toaster-top-center',
    //           solid: true,
    //           variant: 'success',
    //           autoHideDelay: 2000,
    //         })
    //       } else {
    //         that.$bvToast.toast(res.message, {
    //           title: '操作提示',
    //           toaster: 'b-toaster-top-center',
    //           solid: true,
    //           variant: 'danger',
    //           autoHideDelay: 2000,
    //         })
    //       }
    //     })
    //   })
    // },

    openLogs(podId, service) {
      window.open('/project/logs?podId=' + podId + '&projectId=' + this.$store.state.myRequest.projectId + '&service=' + service)
    },
    // 获取列表数据
    getPodList() {
      let that = this
      that.bodyLoading = true
      let _data = {
        curl: $themeConfig.app.projectHttpUrl + '/pod/deploy',
        project: that.$store.state.myRequest.projectId,
        search: that.searchTerm,
      }
      this.$store.dispatch('httpGet', _data).then((res) => {
        // console.log(res)
        that.podList = res.data
        that.filteredPodList = res.data
        that.loading = !(that.podList == null || that.podList.length === 0)
        that.bodyLoading = false
      })
    },
    refreshPod() {
      this.searchTerm = ''
      this.filteredPodList = this.podList
    },
    filterPod() {
      this.searchTerm = this.searchTerm.trim()
      this.filteredPodList = this.podList.filter((data) => {
        return data.id.includes(this.searchTerm)
      })
    },
  },
}
</script>

<style scoped></style>
