<template>
  <div style="padding-top:3.375rem">
    <div>
      <div style="height:18.75rem">
        <b-img :src="require('@/assets/images/background/bg-1.jpg')" fluid-grow alt="Responsive image" style=" z-index:-1;position: absolute;height: 18.75rem;" />
        <b-jumbotron style="text-align: center;background-color: #ededed00;top:-100px" align="center">
          <h1 style="color: #fff;">H3C API</h1>
          <div align="center">
            <b-input-group style="width: 50%;">
              <b-form-input placeholder="搜索API" v-model="searchValue" @keyup.enter="getSearchApi()"/>
              <b-input-group-prepend is-text>
                <feather-icon icon="SearchIcon" @click="getSearchApi()"/>
              </b-input-group-prepend>
            </b-input-group>
          </div>
        </b-jumbotron>
      </div>
    </div>

    <div style="background-color: #fff; margin: 10px;" align="left">
      <b-row style="width: 70%;padding: 10px;">
        <b-col md="2" style="text-align: right;margin-top: 5px;">
          <h3 style="color: #000000;">分类:</h3>
        </b-col>
        <b-col md="10">
          <b-tabs>
            <b-tab title="全部" @click="getTab('')"></b-tab>
            <b-tab v-for="(item, index) in types" :key="index" :title="item.name" @click="getTab(item.id)"></b-tab>
          </b-tabs>
        </b-col>
      </b-row>

      <b-row style="width: 70%; padding: 10px;">
        <b-col md="2" style="text-align: right;margin-top: 5px;">
          <h3 style="color: #000000;">标签:</h3>
        </b-col>
        <b-col md="10">
          <b-tabs>
            <b-tab title="全部" @click="getTab1('')"></b-tab>
            <b-tab v-for="(item, index) in labels" :key="index" :title="item.name" @click="getTab1(item.id)"></b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </div>
    <hr class="my-1">
    <div style="background-color: #fff;padding-top:15px;margin: 10px;" align="center">
      <b-row cols-lg="4" cols-sm="3" class="mb-3 match-height" style="margin: 10px;">
          <b-col v-for="(item, index) in apis" :key="index" style="padding: 15px">
            <b-link @click="toApi(item.viewId)">
              <ApiCard class="api-card" :api="item" :type="getTypeById(item.typeId)"></ApiCard>
            </b-link>
          </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { $themeConfig } from '@themeConfig'
import ApiCard from '@/views/home/component/ApiCard.vue'

export default {
  components: {
    ApiCard
  },
  data() {
    return {
      searchValue: '',
      labelSelect: '',
      typeSelect: '',
      labels: [],
      types: [],
      apis: [],
    }
  },

  watch: {
    labelSelect: {
      handler(newVal, oldVal) {
        this.getSearchApi()
      }
    },
    typeSelect: {
      handler(newVal, oldVal) {
        this.getSearchApi()
      }
    },
  },

  created() {
    this.getSearchApi()
    this.getLables()
    this.getTypes()
  },
  methods: {
    getApis() {
      let that = this
      let _data = {
        curl: $themeConfig.app.httpUrl + '/api-manage/v1.0/api/getAll'
      }
      that.$store.dispatch('httpGet', _data).then(function (res) {
        that.apis = res.data
      })
    },

    getLables() {
      let that = this
      let _data = {
        curl: $themeConfig.app.httpUrl + '/api-manage/v1.0/label/getAll'
      }
      that.$store.dispatch('httpGet', _data).then(function (res) {
        that.labels = res.data
      })
    },
    getTypes() {
      let that = this
      let _data = {
        curl: $themeConfig.app.httpUrl + '/api-manage/v1.0/type/getAll'
      }
      that.$store.dispatch('httpGet', _data).then(function (res) {
        that.types = res.data
      })
    },
    getTypeById(typeId) {
      for (let type of this.types) {
        if (type.id === typeId) {
          return type.name
        }
      }
    },
    getSearchApi() {
      let that = this
      let _data = {
        typeId: that.typeSelect,
        labelId: that.labelSelect,
        query: that.searchValue,
        curl: $themeConfig.app.httpUrl + '/api-manage/v1.0/api/search'
      }
      that.$store.dispatch('httpGet', _data).then(function (res) {
        that.apis = res.data
      })
    },
    getTab(index) {
      this.typeSelect = index
    },
    getTab1(index) {
      this.labelSelect = index
    },
    toApi(viewId) {
      this.$router.push({
        path: '/api/describe?apiId=' + viewId
      })
    },
  }
}
</script>

<style>
  .nav-tabs .nav-link:after {
    left: 0;
    background: 0 !important;
  }

  .api-card {
    margin: 5px;
    border: 1px solid #ffffff;
  }

  .api-card:hover {
    margin: 5px;
    border: 1px solid #7289fa;
    background-color: #eef1f6;
    box-shadow: gainsboro;
  }
</style>
