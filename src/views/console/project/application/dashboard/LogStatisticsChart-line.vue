<template>
	<e-charts ref="line" autoresize :options="option" theme="theme-color" auto-resize :init-options="{devicePixelRatio: 2}" />
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
				type: Array,
				default: null,
			},

			xdata: {
				type: Array,
				default: null,
			},
		},
		watch: {

			xdata: {
				handler(newVal, oldVal) {
					this.option.xAxis.data = newVal
					this.option.series = this.optionData
					this.$refs["line"].mergeOptions(this.option, true)
				},
				deep: true,
			}
		},

		data() {
			return {
				option: {
					visualMap: [{
						show: true,
						type: 'continuous',
						min: 0,
						max: 400,
					}],
					tooltip: {
						trigger: 'axis'
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
					color: ['#5470c6',  '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc','#91cc75'],
					xAxis: {
						type: 'category',
						// boundaryGap: false,
						data: this.xdata,
						// axisLabel: {
						// 	formatter: function(value) {
            //
						// 		let dt = new Date(parseInt(value))
						// 		return dt.getHours() + ":" + dt.getMinutes()
						// 	}
						// }
					},
					yAxis: {
						type: 'value'
					},
					series: this.optionData
				}
			}
		},
	}
</script>

<style>
	.echarts {
		width: 100% !important;
	}
</style>
