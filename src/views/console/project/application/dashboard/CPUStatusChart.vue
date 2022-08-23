<template>
  <e-charts
    ref="line"
    autoresize
    :options="option"
	  manualUpdate
    theme="theme-color"
    auto-resize
    :init-options="{devicePixelRatio: 2}"
  />
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/line'
import theme from '@core/components/charts/echart/theme.json'

ECharts.registerTheme('theme-color', theme)

export default {
  components: {
    ECharts,
  },
  props: {
    optionData: {
      type: Object,
      default: null,
    },
  },

  watch: {
  	optionData: {
      handler(newVal, oldVal) {
        this.option.xAxis[0].data = this.optionData.xAxisData
        this.option.series = this.optionData.series
        this.$refs["line"].mergeOptions(this.option,true)
      },
      deep: true,
    }
  },
  data() {
    return {
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          left: '0',
        },
        grid: {
          width: '95%',
          left: '40px',
          right: '4%',
          containLabel: false,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.optionData.xAxisData,
          },
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: { show: false },
          },
        ],
        series: this.optionData.series,
      },
    }
  },
}
</script>
