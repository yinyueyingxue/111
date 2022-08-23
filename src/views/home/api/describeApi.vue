<template>
  <div style="padding-bottom: 3rem;">
    <div style="padding-top:60px;">
      <b-jumbotron style="margin: 20px;">
        <b-row align-v="start">
          <b-col md="1" align="center">
            <!-- <b-avatar class="mb-3" variant="light-primary" size="50"> -->
            <b-avatar variant="light-primary" size="60">
              <feather-icon size="50" :icon="apiDetail.icon" />
            </b-avatar>
          </b-col>
          <b-col>
            <h1>{{ apiDetail.apiName }}</h1>
            <p>{{ myDescribe.describe }}</p>
            <!-- <hr class="my-4"> -->
          </b-col>
          <b-col style="text-align: right;">
            <p>累计使用：{{ apiDetail.usedCount }}</p>
          </b-col>
        </b-row>
      </b-jumbotron>
    </div>
    <div style="margin: 20px;" align="center">
      <b-tabs pills align="left" style="text-align: left;background-color: #FFF;padding: 10px;" v-model="activeName">
        <b-tab title="API接口"></b-tab>
        <b-tab title="状态码"></b-tab>
      </b-tabs>
    </div>

    <!-- <Apitem v-if="activeName == 2  "></Apitem> -->
    <Api v-if="activeName == 0" :apiDes="apiDetail"></Api>
    <Status v-if="activeName == 1"></Status>
  </div>
</template>

<script>
import Apitem from './component/template.vue'
import Api from './component/api.vue'
import Status from './component/status.vue'
import { $themeConfig } from '@themeConfig'

export default {
  data() {
    return {
      activeName: 0,
      apiDetail: {},
      myDescribe: '',
    }
  },
  components: {
    Apitem,
    Api,
    Status,
  },
  mounted() {
    this.showViewDetail()
  },
  methods: {
    showViewDetail() {
      let _data = {
        curl: $themeConfig.app.httpUrl + '/api-manage/v1.0/view/showViewById',
        id: this.$route.query.apiId
      }
      this.$store.dispatch('httpGet', _data).then((res) => {
        if (res.flag) {
          this.apiDetail = res.data
          this.myDescribe = res.data.wiki != null ? eval('(' + res.data.wiki + ')') : {}
        } else {
          this.$bvToast.toast(res.message, {
            title: '获取信息失败',
            toaster: 'b-toaster-top-center',
            solid: true,
            variant: 'danger',
            autoHideDelay: 2000
          })
        }
      })
    },
  }
}
</script>

<style>
  .nav-pills .nav-link {
    font-size: 1.5rem;
  }

  .nav-pills {
    margin-bottom: 0rem;
  }
</style>
