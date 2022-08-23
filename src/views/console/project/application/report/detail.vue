<template>
  <section>
    <div class="icon-wrapper back-icon">
      <feather-icon size="24" icon="ArrowLeftIcon" @click="$router.go(-1)"/>
    </div>
    <div class="title">第{{ projectData.weekNum }}周运营报告详情</div>
    <b-card>
      <b-form-group>
        <v-select v-model="selected" label="title" :options="projectData.podList" />
      </b-form-group>
      <b-row class="row1">
        <b-col><b>节点数量：</b>&#12288;{{ podData.podCount }}</b-col>
      </b-row>
      <b-row class="row1">
        <b-col><b>周&#12288;&#12288;数：</b>&#12288;{{ projectData.weekNum }}</b-col>
      </b-row>
      <b-row class="row1">
        <b-col><b>记录时间：</b>&#12288;{{ projectData.startDate }} - {{ projectData.endDate }}</b-col>
      </b-row>
      <b-row class="row1">
        <b-col><b>镜像名称：</b>&#12288;{{ podData.imageName }}</b-col>
      </b-row>
    </b-card>

    <b-card>
      <b-col>
        <b-row>
          <b-col md="4">
            <h4 style="text-align: center">发布统计</h4>
            <e-charts style="height: 250px; width: 100%" ref="pie" autoresize :options="releaseOption" :init-options="{devicePixelRatio: 2}" />
          </b-col>
          <b-col md="4">
            <h4 style="text-align: center">告警统计</h4>
            <e-charts style="height: 250px; width: 100%" ref="pie" autoresize :options="alarmOption" :init-options="{devicePixelRatio: 2}" />
          </b-col>
          <b-col md="4">
            <h4 style="text-align: center">运营指标</h4>
            <e-charts style="height: 250px; width: 100%" ref="pie" autoresize :options="scoreOption" :init-options="{devicePixelRatio: 2}" />
          </b-col>
        </b-row>
      </b-col>
    </b-card>

    <b-card>
      <h4>服务指标</h4>
      <b-row>
        <b-col md="4">
          <e-charts style="height: 350px; width: 100%" ref="line" autoresize :options="requestOption" :init-options="{devicePixelRatio: 2}" theme="theme-color" />
        </b-col>
        <b-col md="4">
          <e-charts style="height: 350px; width: 100%" ref="bar" autoresize :options="slaOption" :init-options="{devicePixelRatio: 2}" theme="theme-color" />
        </b-col>
        <b-col md="4">
          <e-charts style="height: 350px; width: 100%" ref="line" autoresize :options="cpmOption" :init-options="{devicePixelRatio: 2}" theme="theme-color" />
        </b-col>
      </b-row>
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
import theme from '@core/components/charts/echart/theme.json'
ECharts.registerTheme('theme-color', theme)
import { $themeConfig } from '@themeConfig'

export default {
  components: {
    "e-charts": ECharts,
    "v-select": vSelect
  },
  data() {
    return {
      id: this.$route.query.id,
      projectId: this.$route.query.projectId,
      dateArray: [],
      projectData: {
        podList: [],
        weekNum: 0,
        startDate: '',
        endDate: ''
      },
      podData: {
        score: 0,
        podCount: '',
        slaDataList: [],
        throughputDataList: [],
        requestDataList: [],
        dateAbscissaList: [],
        imageName: '',
        requestTotalCount: 0,
        releaseTotalCount: 0,
        releaseSucCount: 0,
        releaseFailCount: 0,
        lowWarmCount: 0,
        midWarmCount: 0,
        highWarmCount: 0
      },
      selected: {
        title: ''
      }
    }
  },
  created() {
    if (sessionStorage.getItem("prevProjectId") && sessionStorage.getItem("prevProjectId") !== this.projectId) {
      console.log(sessionStorage.getItem("prevProjectId")+ " ==> " + this.projectId)
      this.$router.go(-1)
    }
	console.log(this.projectId);
	if(this.projectId  !== undefined){
		this.$store.commit('getProjectId', this.projectId)
	}else{
		this.$router.push({
			name: "404"
		})
		return
	}
    sessionStorage.setItem("prevProjectId", this.projectId)
    this.getProjectData()
  },
  methods: {
    getProjectData() {
      let _data = {
        curl: $themeConfig.app.httpUrl + '/project/v1.0/operationReport/projectData',
        id: this.id,
        _: new Date().valueOf()
      }
      this.$store.dispatch('httpGet', _data).then((res) => {
        if (res.code !== 20216) {
          this.$message.error(res.message)
          return
        }
        this.projectData = res.data
        if (res.data.podList.length > 0) {
          this.projectData.podList = res.data.podList
          this.getPodData(res.data.podList[0])
          this.selected.title = res.data.podList[0]
        } else {
          this.selected.title = '暂无数据'
        }
      })
    },
    getPodData(val) {
      let _data = {
        curl: $themeConfig.app.projectHttpUrl + '/operationReport/podData',
        id: this.id,
        _: new Date().valueOf(),
        pod: val
      }
      this.$store.dispatch('httpGet', _data).then((res) => {
        if (res.code !== 20216) {
          this.$message.error(res.message)
          return
        }
        this.podData = res.data
        this.dateArray = []
        let dateAbscissaList = res.data.dateAbscissaList
        if (!dateAbscissaList) {
          let start = this.projectData.startDate.split(' ')[0]
          let end = this.projectData.endDate.split(' ')[0]
          dateAbscissaList = this.getDateArray(start, end)
        }
        for (let i = 0; i < dateAbscissaList.length; i++) {
          let _date = dateAbscissaList[i].split('-')
          this.dateArray.push(_date[1] + '-' + _date[2])
        }
      })
    },
    getDateArray(start, end) {
      let date_all = [], i = 0
      let startTime = this.getDate(start)
      let endTime = this.getDate(end)
      while ((endTime.getTime() - startTime.getTime()) >= 0) {
        let year = startTime.getFullYear()
        let month = (startTime.getMonth() + 1).toString().length === 1 ? "0" + (startTime.getMonth() + 1).toString() : (startTime.getMonth() + 1).toString()
        let day = startTime.getDate().toString().length === 1 ? "0" + startTime.getDate() : startTime.getDate()
        date_all[i] = year + "-" + month + "-" + day
        startTime.setDate(startTime.getDate() + 1)
        i += 1
      }
      return date_all
    },
    getDate(dateStr) {
      let temp = dateStr.split("-")
      return new Date(temp[0], temp[1] - 1, temp[2])
    },
    dataAvg(v, flag) {
      let count = 0;
      let res = 0;
      v.forEach(function (e) {
        res = res + e;
        count++;
      })
      let r = this.keepTwoDecimalFull(count !== 0 ? res / count : 0);
      if (flag) {
        return r;
      } else {
        return r >= 100 ? 100 : r;
      }
    },
    keepTwoDecimalFull(num) {
      let result = parseFloat(num);
      if (isNaN(result)) {
        // alert('传递参数错误，请检查！');
        return false;
      }
      result = Math.round(num * 100) / 100;
      let s_x = result.toString();
      let pos_decimal = s_x.indexOf('.');
      if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
      }
      while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
      }
      return s_x;
    },
    valueChange(v, flag) {
      let res = [];
      if (v !== null && v !== undefined) {
        v.forEach(function (e) {
          res.push(flag ? e / 100 : e);
        })
      }
      return res;
    }
  },
  computed: {
    releaseOption() {
      return {
        title: {
          text: this.podData.releaseTotalCount + '',
          textStyle: {
            color: 'rgba(41,128,185)',
            fontSize: 25,
            fontWeight: '400',
          },
          subtext: "发布次数",
          itemGap: -5,
          left: 'center',
          top: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '发布次数',
            type: 'pie',
            radius: ['60%', '70%'],
            data: [
              {value: this.podData.releaseSucCount, name: '发布成功', itemStyle: {color: '#27ae60'}},
              {value: this.podData.releaseFailCount, name: '发布失败', itemStyle: {color: '#c0392b'}}
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    },
    alarmOption() {
      return {
        title: {
          text: (this.podData.lowWarmCount + this.podData.midWarmCount + this.podData.highWarmCount) + '',
          textStyle: {
            color: 'rgba(41,128,185)',
            fontSize: 25,
            fontWeight: '400',
          },
          subtext: "告警数",
          itemGap: -5,
          left: 'center',
          top: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '告警次数',
            type: 'pie',
            radius: ['60%', '70%'],
            data: [
              {value: this.podData.highWarmCount, name: '高危', itemStyle: {color: '#c0392b'}},
              {value: this.podData.midWarmCount, name: '中危', itemStyle: {color: '#d35400'}},
              {value: this.podData.lowWarmCount, name: '低危', itemStyle: {color: '#f39c12'}}
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    },
    scoreOption() {
      return {
        title: {
          text: this.podData.score + '',
          textStyle: {
            color: 'rgba(41,128,185)',
            fontSize: 25,
            fontWeight: '400',
          },
          subtext: "运营分数",
          itemGap: -5,
          left: 'center',
          top: 'center'
        },
        series: [
          {
            type: 'pie',
            radius: ['60%', '70%'],
            labelLine: {
              show: false
            },
            data: [{
              value: 100, itemStyle: {color: this.podData.score >= 80 ? '#27ae60' : this.podData.score >= 60 ? '#f39c12' : '#c0392b'}
            }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    },
    requestOption() {
      return {
        title: {
          text: "一周请求总数",
          left: "center",
          textStyle: {
            color: "#3e5569"
          },
          subtext: this.podData.requestTotalCount + '',
          subtextStyle: {
            color: "rgba(52,152,219)"
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.dateArray,
          boundaryGap: false,
          axisLine: {
            "show": true
          },
        },
        yAxis: {
          type: 'value',
          show: this.podData.requestTotalCount !== 0
        },
        series: [{
          data: this.podData.requestDataList,
          type: 'line',
          areaStyle: {
            normal: {
              color: '#5c67e6' //改变区域颜色
            }
          },
          itemStyle: {
            normal: {
              color: '#5c67e6', //改变折线点的颜色
              lineStyle: {
                color: '#5c67e6' //改变折线颜色
              }
            }
          },
          symbol: 'none',
          smooth: true
        }]
        // series: [{
        //   data: this.podData.requestDataList,
        //   type: 'line',
        //   smooth: true
        // }]
      }
    },
    slaOption() {
      let slaArray = this.valueChange(this.podData.slaDataList, true)
      return {
        title: {
          text: "服务平均可用性(SLA)",
          left: "center",
          textStyle: {
            color: "#3e5569"
          },
          subtext: this.dataAvg(slaArray) + "%",
          subtextStyle: {
            color: "rgba(52,152,219)"
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.dateArray
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: slaArray,
          type: 'bar',
          itemStyle: {
            color: function (p) {
              return p.data === 100 ? "#3398DB" : p.data < 95 ? "#c0392b" : "#e67e22"
            }
          }
        }]
      }
    },
    cpmOption() {
      let cpmArray = this.valueChange(this.podData.throughputDataList)
      return {
        title: {
          text: "服务每分钟平均吞吐量(CPM)",
          left: "center",
          textStyle: {
            color: "#3e5569"
          },
          subtext: this.dataAvg(cpmArray) + '',
          subtextStyle: {
            color: "rgba(52,152,219)"
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.dateArray
        },
        yAxis: {
          type: 'value',
          show: true
        },
        series: [{
          data: cpmArray,
          type: 'line',
          smooth: true
        }]
      }
    }
  },
  watch: {
    selected: function (val) {
      this.getPodData(val)
    },
    projectId: function (val, oldVal) {
      console.log(val, oldVal)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (sessionStorage.getItem("prevProjectId")) {
      sessionStorage.removeItem("prevProjectId")
    }
    next()
  }
}
</script>

<style lang="scss">
//@import '@core/scss/vue/libs/vue-select.scss';

.icon-wrapper.back-icon {
  float: left;
  .feather {
    margin-top: 5px;
    height: 28px;
    width: 28px;
  }
  .feather:hover {
    height: 28px;
    width: 28px;
    border-radius: 50%;
    background-color: #e6e9ea;
  }
}

.title {
  text-align: center;
  font-size: 25px;
  padding-bottom: 12px;
}

.row1 {
  line-height: 26px;
}

</style>
