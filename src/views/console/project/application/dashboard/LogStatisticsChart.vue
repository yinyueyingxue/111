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
				type: Object,
				default: null,
			},
		},

		watch: {

			optionData: {
				handler(newVal, oldVal) {
					this.option.xAxis[0].data = newVal.xAxisData
					this.option.series.data = newVal.series
					this.$refs["line"].mergeOptions(this.option, true)
				},
				deep: true,
			}
		},
		data() {
			return {
				option: {
					// Make gradient line here
					visualMap: [{
						show: true,
						type: 'continuous',
						min: 0,
						max: 400,
					}],
					grid: {
						width: '80%',
						left: '60px',
						top: '10px',
						show: false,
					},
					tooltip: {
						trigger: 'axis',
					},
					xAxis: [{
						boundaryGap: false,
						data: this.optionData.xAxisData,
					}],
					yAxis: {
						type: 'value',
						splitLine: {
							show: false
						},
					},
					series: {
						type: 'line',
						showSymbol: false,
						data: this.optionData.series,
					},
				},
			}
		},
	}
</script>

<style>
	.echarts {
		width: 100% !important;
	}
</style>
