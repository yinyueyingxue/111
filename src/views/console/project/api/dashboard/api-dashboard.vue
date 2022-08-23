<template>
  <section id="dashboard-ecommerce">
    <b-row class="match-height">
      <b-col cols="6">
        <b-card
            v-if="releasedItems"
            no-body
            class="card-statistics"
        >
          <b-card-header>
            <b-card-title>我发布的</b-card-title>
            <b-card-text class="font-small-2 mr-25 mb-0">
              接口数
            </b-card-text>
          </b-card-header>
          <b-card-body class="statistics-body">
            <b-row>
              <b-col
                  v-for="item in releasedItems"
                  :key="item.icon"
                  xl="4"
                  sm="6"
                  :class="item.customClass"
              >
                <b-media no-body>
                  <b-media-aside

                      class="mr-2"
                  >
                    <b-avatar
                        size="48"
                        :variant="item.color"
                    >
                      <feather-icon
                          size="24"
                          :icon="item.icon"
                      />
                    </b-avatar>
                  </b-media-aside>
                  <b-media-body class="my-auto">
                    <h4 class="font-weight-bolder mb-0">
                      {{ item.title }}
                    </h4>
                    <b-card-text class="font-small-3 mb-0">
                      {{ item.subtitle }}
                    </b-card-text>
                  </b-media-body>
                </b-media>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="6">
        <b-card
            v-if="usedItems"
            no-body
            class="card-statistics"
        >
          <b-card-header>
            <b-card-title>我使用的</b-card-title>
            <b-card-text class="font-small-2 mr-25 mb-0">
              接口数
            </b-card-text>
          </b-card-header>
          <b-card-body class="statistics-body">
            <b-row>
              <b-col
                  v-for="item in usedItems"
                  :key="item.icon"
                  xl="4"
                  sm="6"
                  :class="item.customClass"
              >
                <b-media no-body>
                  <b-media-aside

                      class="mr-2"
                  >
                    <b-avatar
                        size="48"
                        :variant="item.color"
                    >
                      <feather-icon
                          size="24"
                          :icon="item.icon"
                      />
                    </b-avatar>
                  </b-media-aside>
                  <b-media-body class="my-auto">
                    <h4 class="font-weight-bolder mb-0">
                      {{ item.title }}
                    </h4>
                    <b-card-text class="font-small-3 mb-0">
                      {{ item.subtitle }}
                    </b-card-text>
                  </b-media-body>
                </b-media>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-form-group>
          <el-select v-model="type" style="width: 100%">
            <el-option
                v-for="item in typeOptions"
                :key="item.label"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row class="match-height">
      <b-col cols="6">
        <b-card
            v-if="goalOverviewData"
            no-body
        >
          <b-card-header>
            <h4 class="mb-0">
              我发布的
            </h4>
            <b-card-text class="font-small-2 mr-25 mb-0">
              24小时接口可用性
            </b-card-text>
          </b-card-header>


          <!-- apex chart -->
          <vue-apex-charts
              type="radialBar"
              height="200"
              class="my-2"
              :options="goalOverviewRadialBar"
              :series="goalOverviewData.series"
          />
          <b-row class="text-center mx-0">
            <b-col
                cols="6"
                class="border-top border-right d-flex align-items-between flex-column py-1"
            >
              <b-card-text class="text-muted mb-0">
                调用成功
              </b-card-text>
              <h3 class="font-weight-bolder mb-0">
                {{ goalOverviewData.completed }}
              </h3>
            </b-col>

            <b-col
                cols="6"
                class="border-top d-flex align-items-between flex-column py-1"
            >
              <b-card-text class="text-muted mb-0">
                调用失败
              </b-card-text>
              <h3 class="font-weight-bolder mb-0">
                {{ goalOverviewData.inProgress }}
              </h3>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col cols="6">
        <b-card
            v-if="goalOverviewData"
            no-body
        >
          <b-card-header>
            <h4 class="mb-0">
              我使用的
            </h4>
            <b-card-text class="font-small-2 mr-25 mb-0">
              24小时接口可用性
            </b-card-text>
          </b-card-header>

          <!-- apex chart -->
          <vue-apex-charts
              type="radialBar"
              height="200"
              class="my-2"
              :options="usedGoalOverviewRadialBar"
              :series="usedGoalOverviewData.series"
          />
          <b-row class="text-center mx-0">
            <b-col
                cols="6"
                class="border-top border-right d-flex align-items-between flex-column py-1"
            >
              <b-card-text class="text-muted mb-0">
                调用成功
              </b-card-text>
              <h3 class="font-weight-bolder mb-0">
                {{ usedGoalOverviewData.completed }}
              </h3>
            </b-col>

            <b-col
                cols="6"
                class="border-top d-flex align-items-between flex-column py-1"
            >
              <b-card-text class="text-muted mb-0">
                调用失败
              </b-card-text>
              <h3 class="font-weight-bolder mb-0">
                {{ usedGoalOverviewData.inProgress }}
              </h3>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="match-height">
      <b-col cols="6">
        <b-card no-body class="card-statistics">
          <b-card-header>
            <b-card-title>我发布的</b-card-title>
            <b-card-text class="font-small-2 mr-25 mb-0">
              24小时接口访问量top5
            </b-card-text>
          </b-card-header>
          <b-card-body>
            <div v-for="(item, index) in releasedTopFiveList" :key="index" class="progress-wrapper">
              <b-card-text class="mb-0" style="padding-top: 12px">
                {{ item.requestUrl }} &nbsp; {{ item.count }}次
              </b-card-text>
              <b-progress :value="item.count" :max="releasedMaxProgress"/>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="6">
        <b-card no-body class="card-statistics">
          <b-card-header>
            <b-card-title>我使用的</b-card-title>
            <b-card-text class="font-small-2 mr-25 mb-0">
              24小时接口访问量top5
            </b-card-text>
          </b-card-header>
          <b-card-body>
            <div v-for="(item, index) in usedTopFiveList" :key="index" class="progress-wrapper">
              <b-card-text class="mb-0" style="padding-top: 12px">
                {{ item.requestUrl }} &nbsp; {{ item.count }}次
              </b-card-text>
              <b-progress :value="item.count" :max="usedMaxProgress"/>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <b-card>
      <e-charts style="height: 350px; width: 100%" ref="line" autoresize :options="statisticOption"
                :init-options="{devicePixelRatio: 2}"/>
    </b-card>
  </section>
</template>

<script>

import ECharts from 'vue-echarts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import vSelect from 'vue-select'

import VueApexCharts from 'vue-apexcharts'
import {$themeColors} from '@themeConfig'
import {$themeConfig} from '@themeConfig'

const $strokeColor = '#ebe9f1'
const $textHeadingColor = '#5e5873'
const $goalStrokeColor2 = '#51e5a8'

export default {
  name: 'api-dashboard',
  components: {
    VueApexCharts,
    ECharts,
    vSelect
    // flatPickr
  },
  data() {
    return {
      httpUrl: $themeConfig.app.apiHttpUrl,
      projectId: this.$store.state.myRequest.projectId,
      slowList: [],
      // typeList: ['服务接口', '数据总线接口', '外部API服务接口'],
      typeList: [ '数据总线接口', '外部API服务接口'],
      typeOptions: [
        {
          label: '全部接口',
          value: null
        },
       /* {
          label: '服务接口',
          value: 1
        },*/
        {
          label: '总线接口',
          value: 2
        },
        {
          label: '外部接口',
          value: 3
        }
      ],
      type: null,
      usedMaxProgress: 0,
      releasedMaxProgress: 0,
      releasedTopFiveList: [],
      usedTopFiveList: [],
      releasedItems: [
/*        {
          color: "light-danger",
          customClass: "mb-2 mb-sm-0",
          icon: "BoxIcon",
          subtitle: "服务接口",
          title: 0
        },*/
        {
          color: "light-primary",
          customClass: "mb-2 mb-xl-0",
          icon: "SlidersIcon",
          subtitle: "总线接口",
          title: 0
        },
        {
          color: "light-info",
          customClass: "mb-2 mb-xl-0",
          icon: "LinkIcon",
          subtitle: "外部接口",
          title: 0
        }
      ],
      usedItems: [
        /*{
          color: "light-danger",
          customClass: "mb-2 mb-sm-0",
          icon: "BoxIcon",
          subtitle: "服务接口",
          title: 0
        },*/
        {
          color: "light-primary",
          customClass: "mb-2 mb-xl-0",
          icon: "SlidersIcon",
          subtitle: "总线接口",
          title: 0
        },
        {
          color: "light-info",
          customClass: "mb-2 mb-xl-0",
          icon: "LinkIcon",
          subtitle: "外部接口",
          title: 0
        }
      ],
      statisticOption: {
        title: {
          text: '24小时访问量统计'
        },
        tooltip: {
          trigger: 'axis'
        },
        color: ['#5da2e5', '#5cc5ce'],
        legend: {
          data: ['我发布的', '我使用的']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '我发布的',
            type: 'line',
            smooth: true,
            data: []
          },
          {
            name: '我使用的',
            type: 'line',
            smooth: true,
            data: []
          }
        ]
      },
      goalOverviewData: {
        completed: "0",
        inProgress: "0",
        series: [0]
      },
      goalOverviewRadialBar: {
        chart: {
          height: 245,
          type: 'radialBar',
          sparkline: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            blur: 3,
            left: 1,
            top: 1,
            opacity: 0.1,
          },
        },
        colors: [$goalStrokeColor2],
        plotOptions: {
          radialBar: {
            offsetY: -10,
            startAngle: -150,
            endAngle: 150,
            hollow: {
              size: '67%',
            },
            track: {
              background: $strokeColor,
              strokeWidth: '20%',
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                color: $textHeadingColor,
                fontSize: '1.86rem',
                fontWeight: '500',
              },
            },
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: [$themeColors.success],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: 'round',
        },
        grid: {
          padding: {
            bottom: 30,
          },
        },
      },
      usedGoalOverviewData: {
        completed: "0",
        inProgress: "0",
        series: [0]
      },
      usedGoalOverviewRadialBar: {
        chart: {
          height: 245,
          type: 'radialBar',
          sparkline: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            blur: 3,
            left: 1,
            top: 1,
            opacity: 0.1,
          },
        },
        colors: [$goalStrokeColor2],
        plotOptions: {
          radialBar: {
            offsetY: -10,
            startAngle: -150,
            endAngle: 150,
            hollow: {
              size: '67%',
            },
            track: {
              background: $strokeColor,
              strokeWidth: '20%',
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                color: $textHeadingColor,
                fontSize: '1.86rem',
                fontWeight: '500',
              },
            },
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: [$themeColors.success],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: 'round',
        },
        grid: {
          padding: {
            bottom: 30,
          },
        },
      }
    }
  },
  created() {
    this.getApiInfo()
    this.getRequestLogInfo()
  },
  methods: {
    getRequestLogInfo() {
      let _data = {
        curl: this.httpUrl + '/dashboard/statistics',
        projectId: this.projectId
      }
      if (this.type) {
        _data.type = this.type
      }
      this.$store.dispatch('httpGet', _data).then((res) => {
        if (res.flag) {
          let releasedInfo = res.data.released
          let usedInfo = res.data.used
          this.goalOverviewData.completed = releasedInfo.success
          this.goalOverviewData.inProgress = releasedInfo.fail
          let ratio = this.calcSuccessRatio(releasedInfo.success, releasedInfo.fail)
          this.$set(this.goalOverviewData.series, 0, ratio)
          this.usedGoalOverviewData.completed = usedInfo.success
          this.usedGoalOverviewData.inProgress = usedInfo.fail
          ratio = this.calcSuccessRatio(usedInfo.success, usedInfo.fail)
          this.$set(this.usedGoalOverviewData.series, 0, ratio)
          // 24小时访问统计
          this.statisticOption.series[0].data = releasedInfo.countList
          this.statisticOption.series[1].data = usedInfo.countList
          this.statisticOption.xAxis.data = releasedInfo.timeList
          this.releasedTopFiveList = releasedInfo.topFiveList
          this.usedTopFiveList = usedInfo.topFiveList
          if (this.releasedTopFiveList.length > 0) {
            this.releasedMaxProgress = this.releasedTopFiveList[0].count
          }
          if (this.usedTopFiveList.length > 0) {
            this.usedMaxProgress = this.usedTopFiveList[0].count
          }
        }
      });
    },
    getApiInfo() {
      let _data = {
        curl: this.httpUrl + '/dashboard/apiInfo',
        projectId: this.projectId
      }
      if (this.type) {
        _data.type = this.type
      }
      this.$store.dispatch('httpGet', _data).then((res) => {
        if (res.flag) {
          let releasedApiInfo = res.data.released
          let usedApiInfo = res.data.used
          // this.releasedItems[0].title = releasedApiInfo.serviceApiNum
          this.releasedItems[0].title = releasedApiInfo.viewApiNum
          this.releasedItems[1].title = releasedApiInfo.proxyApiNum
          // this.usedItems[0].title = usedApiInfo.serviceApiNum
          this.usedItems[0].title = usedApiInfo.viewApiNum
          this.usedItems[1].title = usedApiInfo.proxyApiNum
        }
      })
    },
    calcSuccessRatio(success, fail) {
      let total = success + fail
      return total === 0 ? 0 : Number(((success / total) * 100).toFixed(2))
    }
  },
  watch: {
    type() {
      this.getApiInfo()
      this.getRequestLogInfo()
    }
  }
}
</script>


<style lang="scss">
@import '~@core/scss/vue/pages/dashboard-ecommerce.scss';
@import '~@core/scss/vue/libs/chart-apex.scss';
</style>
