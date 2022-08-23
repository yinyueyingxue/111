<template>
	<div>
		<b-card style="margin: 20px;">
			<h2>接口状态码</h2>
			<div>
				<b-table striped hover :items="items1" :fields="fields1"></b-table>
			</div>
			<br/>
			<h2>系统级状态码</h2>
			<div>
				<b-table striped hover :items="items2" :fields="fields2"></b-table>
			</div>
		</b-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				fields1: [{
					key: 'status',
					label: '状态码'
				}, {
					key: 'describe',
					label: '描述'
				}],
				items1: [{
					status: 10200,
					describe: '获取信息成功',
				}, {
					status: 10204,
					describe: '获取信息失败',
				}, {
					status: 10205,
					describe: '获取信息错误',
				}],
				fields2: [{
					key: 'status',
					label: '状态码'
				}, {
					key: 'describe',
					label: '描述'
				}],
				items2: [{
					status: 20400,
					describe: '请求接口失败',
			
				}, {
					status: 20500,
					describe: '请求超时',
					
				}, {
					status: 20200,
					describe: '请求成功',
				
				}],
			}
		},
	}
</script>

<style>
	
</style>
