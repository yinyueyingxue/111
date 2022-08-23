<template>
	<div>
		<b-card style="margin: 20px;">
			<h2>完整示例代码分享:</h2>
			<div>
				<b-table striped hover :items="items1" :fields="fields1"></b-table>
			</div>
			<br />
			<h2>常见问题:</h2>
			<div>
				<b-table striped hover :items="items2" :fields="fields2">
					<template #cell(describe)="data">
						<a :href="`${data.value.toLowerCase()}`">{{ data.value }}</a>
					</template>
				</b-table>
			</div>
		</b-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				fields1: [{
					key: 'language',
					label: '语言'
				}, {
					key: 'title',
					label: '标题'
				}, {
					key: 'author',
					label: '提供者'
				}, {
					key: 'create_date',
					label: '时间'
				}],
				items1: [{
					language: 'PHP',
					title: '基于PHP调用百度接口',
					author: 'eos社区',
					create_date: '2021-08-23',
				}, {
					language: 'Golang',
					title: '基于GO调用百度接口',
					author: 'eos社区',
					create_date: '2021-08-23',
				}, {
					language: 'Java',
					title: '基于Java调用百度接口',
					author: 'eos社区',
					create_date: '2021-08-23',
				}, {
					language: 'python',
					title: '基于python调用百度接口',
					author: 'eos社区',
					create_date: '2021-08-23',
				}],
				fields2: [{
					key: 'content',
					label: '内容'
				}, {
					key: 'describe',
					label: '详细',
				}],
				items2: [{
					content: '常见问题',
					describe: 'http://www.baidu.com'
				}],
			}
		}
	}
</script>

<style></style>
