<template>
	<e-charts ref="line" autoresize :options="option" theme="theme-color" auto-resize :init-options="{devicePixelRatio: 2}" />
</template>

<script>
	import ECharts from 'vue-echarts'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/chart/bar'
	import theme from '@core/components/charts/echart/theme.json'

	ECharts.registerTheme('theme-color', theme)
	export default {
		components: {
			ECharts,
		},
		props: {
			series: {
				type: Array,
				default: null,
			},
			timeData: {
				type: Array,
				default: null,
			},
		},

watch: {

  	series: {
  	      handler(newVal, oldVal) {
  	        this.option.xAxis[0].data = this.timeData
			this.option.series[0].data = this.series
			this.$refs["line"].mergeOptions(this.option,true)
  	      },
  	      deep: true ,
		  }
  },

		data() {
			return {
				option: {
					title: {
						textStyle: {
							color: "#3e5569"
						}
					},
					color: ['#3398DB'],
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						data: this.timeData,
						axisTick: {
							alignWithLabel: true
						},
						// axisLabel: {
						// 	formatter: function(value) {
						// 		return dateFormat("MM-dd\nhh:mm", new Date(value.replace(new RegExp(/-/gm), "/")))
						// 	}
						// }

					}],
					yAxis: [{
						type: 'value'
					}],
					series: [{
						name: 'SLA',
						type: 'bar',
						barWidth: '60%',
						data: this.series,
						itemStyle: {
							color: function(p) {

								return p.data < 100 ? "#c23531" : "#3398DB"
							},
						}
					}]
				},
			}
		},
		methods: {
			dataAvg(v, flag) {

				// var dataCount = v.length
				const count = 0;
				const res = 0;
				v.forEach(function(e) {
					res = res + e;
					count++;
				})

				const r = keepTwoDecimalFull(count !== 0 ? res / count : 0);
				if (flag) {
					return r;
				} else {
					return r >= 100 ? 100 : r;
				}

			},

		},
	}
</script>

<style lang="scss">

</style>
