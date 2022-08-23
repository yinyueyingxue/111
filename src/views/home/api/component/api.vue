<template>
  <div>
    <b-card style="margin: 20px;">
      <b-media>
        <template v-slot:aside>
          <h2>接口信息</h2>
        </template>
      </b-media>
      <b-media>
        <template v-slot:aside>
          <h4>接口地址:</h4>
        </template>
        {{ acitveApi.httpUrl }}
      </b-media>
      <b-media>
        <template v-slot:aside>
          <h4>请求协议:</h4>
        </template>
        {{ acitveApi.httpType }}
      </b-media>
      <b-media>
        <template v-slot:aside>
          <h4>请求方式:</h4>
        </template>
        {{ acitveApi.requestType }}
      </b-media>
      <b-media>
        <template v-slot:aside>
          <h4>请求格式:</h4>
        </template>
        {{ acitveApi.contentType }}
      </b-media>
      <b-media>
        <template v-slot:aside>
          <h4>返回格式:</h4>
        </template>
        {{ acitveApi.returnType }}
      </b-media>
      <!-- <b-media>
        <template v-slot:aside>
          <h4>请求示例:</h4>
        </template>
        {{acitveApi.requestDemo}}
      </b-media> -->

      <!-- <b-media>
        <template v-slot:aside>
          <b-button variant="info" @click="showApi()">测试API</b-button>
        </template>

      </b-media> -->
    </b-card>
    <b-card style="margin: 20px;">
      <h2>请求参数</h2>
      <div>
        <b-table striped hover :items="items1" :fields="fields1"></b-table>
      </div>
      <br/>
      <h2>返回参数</h2>
      <div>
        <b-table striped hover :items="items2" :fields="fields2"></b-table>
      </div>
    </b-card>

    <!-- <b-card style="margin: 20px;">
      <h2>返回结果示例</h2>
      <b-jumbotron style="margin: 20px;">
        <p>
          {{text}}
        </p>
      </b-jumbotron>
    </b-card> -->
  </div>
</template>

<script>
import { $themeConfig } from '@themeConfig'

export default {
  props: {
    apiDes: {
      type: Object,
      default: {}
    }
  },
  watch: {
    apiDes: {
      handler(newVal, oldVal) {
        this.acitveApi.httpUrl = $themeConfig.app.httpUrl + '/orgbaseinfo/v1.0/' + (this.apiDes.category == 'service' ? 'apis' : 'views') + '/' + this.apiDes.id

        this.items1 = eval('(' + this.apiDes.wiki + ')').items

        this.items2 = eval('(' + this.apiDes.wiki + ')').outItems
      },
      deep: true,
    }
  },

  data() {
    return {
      acitveApi: {
        httpUrl: 'https://www.baidu.com',
        httpType: 'http、https',
        requestType: 'POST',
        contentType: 'application/json',
        returnType: 'JSON',
        requestDemo: 'https://www.baidu.com?aaa=bb&cc=ddd',
      },

      text: '{"applicationId":"appdemo", "userId": "rys3303"}',
      fields1: [{
        key: 'name',
        label: '参数名'
      }, {
        key: 'type',
        label: '类型'
      }, {
        key: 'flag',
        label: '必填'
      }, {
        key: 'remark',
        label: '说明'
      }],
      items1: [],
      fields2: [{
        key: 'name',
        label: '参数名'
      }, {
        key: 'type',
        label: '类型'
      }, {
        key: 'remark',
        label: '说明'
      }],
      items2: [],
    }
  },
  mounted() {
    this.acitveApi.httpUrl = $themeConfig.app.httpUrl + '/orgbaseinfo/v1.0/' + (this.apiDes.category == 'service' ? 'apis' : 'views') + '/' + this.apiDes.id

    this.items1 = eval('(' + this.apiDes.wiki + ')').items

    this.items2 = eval('(' + this.apiDes.wiki + ')').outItems
  },
  methods: {
    showApi() {
      this.$bvToast.toast('测试结果成功!', {
        title: '请求成功',
        variant: 'success',
        toaster: 'b-toaster-top-center',
        solid: true,
        timeOut: 0
      })
    }
  }
}
</script>

<style>

</style>
