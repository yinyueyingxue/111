<template>
	<b-card no-body>
		<div class="m-2">
			<!-- Table Top -->
			<b-row>
				<b-col cols="12" md="8" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
					<b-button variant="primary" @click="handleRoleAdd()">
						<i class="el-icon-plus"/>
						新增角色
					</b-button>
				</b-col>
				<!-- Search -->
				<b-col cols="12" md="4">
					<div class="d-flex align-items-center justify-content-end">
						<b-form-input v-model="searchTerm" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" class="d-inline-block mr-1" placeholder="Search..."/>
						<b-button variant="outline-primary" class="btn-icon" @click="refreshForm">
							<feather-icon icon="RefreshCwIcon"/>
						</b-button>
					</div>
				</b-col>
			</b-row>
		</div>

		<vue-good-table 
			v-loading="bodyLoading" 
			:columns="columns" 
			:rows="tableData" 
			style-class="vgt-table striped" 
			:search-options="{ enabled: true, externalQuery: searchTerm }" 
			:pagination-options="{ enabled: true, perPage: pageSize }">
			<template slot="table-row" slot-scope="props">
				<span v-if="props.column.field === 'option'">
					<feather-icon style="cursor: pointer;" :id="`EditIcon-${props.row.id}`" icon="EditIcon" size="16" class="mx-1" @click="handleEdit(props.row)" v-b-tooltip.hover title="编辑" />
					<feather-icon style="cursor: pointer;" :id="`TrashIcon-${props.row.id}`" icon="GitPullRequestIcon" size="16" class="mx-1" @click="handleSplace(props.row)" v-b-tooltip.hover title="分配资源" />
					<feather-icon style="cursor: pointer;" :id="`TrashIcon-${props.row.id}`" icon="TrashIcon" size="16" class="mx-1" @click="handleDelete(props.row)" v-b-tooltip.hover title="删除" />
				</span>
				<span v-else>{{ props.formattedRow[props.column.field] }}</span>
			</template>
			<!-- pagination -->
			<template slot="pagination-bottom" slot-scope="props">
				<div class="mx-2 mb-2">
					<div class="d-flex justify-content-between flex-wrap">
						<div class="d-flex align-items-center mb-0 mt-1">
							<span class="text-nowrap">共 {{ props.total }} 条，每页显示</span>
							<b-form-select v-model="pageSize" :options="[5, 10, 20, 50]" class="mx-1" @input="(value) => props.perPageChanged({ currentPerPage: value })" />
							<span class="text-nowrap"> 条 </span>
						</div>
						<div>
							<b-pagination 
								:value="1" 
								:total-rows="props.total" 
								:per-page="pageSize" 
								first-number
								last-number 
								align="right" 
								prev-class="prev-item" 
								next-class="next-item"
								class="mt-1 mb-0"
								@input="(value) => props.pageChanged({ currentPage: value })"
							>
								<template #prev-text>
									<feather-icon icon="ChevronLeftIcon" size="18" />
								</template>
								<template #next-text>
									<feather-icon icon="ChevronRightIcon" size="18" />
								</template>
							</b-pagination>
						</div>
					</div>
				</div>
			</template>
			</vue-good-table>


		<el-dialog title="角色信息" :close-on-click-modal="false" :visible.sync="dialogVisible" width="30%">
			<span>
				<el-form>
					<el-form-item label="id" style="display:none">
						<el-input v-model="form.id" placeholder="id"></el-input>
					</el-form-item>
					<el-form-item label="编码:">
						<el-input v-model="form.roleCode" placeholder="编码"></el-input>
					</el-form-item>
					<el-form-item label="名称:">
						<el-input v-model="form.name" placeholder="名称"></el-input>
					</el-form-item>

					<el-form-item label="描述:">
						<el-input type="textarea" v-model="form.remark" placeholder="描述"></el-input>
					</el-form-item>
				</el-form>

			</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveRole">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog title="角色资源" @close='closeDialog' :close-on-click-modal="false" :visible.sync="dialogVisibleSplace"
			  >
			<span>
				<el-form>

					<el-input v-model="roleId" hidden placeholder="id"></el-input>

					<el-form-item style="height:30rem" label="接口" >

						<el-cascader-panel placeholder="接口" v-model="bindApis"

						 size ="medium"
						 :options="apis"
							:props="{ multiple: true}" collapse-tags filterable>
						</el-cascader-panel>

					</el-form-item>
				</el-form>

			</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisibleSplace = false">取 消</el-button>
				<el-button type="primary" @click="assignRole">确 定</el-button>
			</span>
		</el-dialog>
	</b-card>
</template>

<script>
	import {
		$themeConfig
	} from '@themeConfig'
	import {
		VueGoodTable
	} from "vue-good-table"
	import store from "@/store"
	import "vue-good-table/dist/vue-good-table.css"

	export default {
    inject: ["reload"],
		components: {
			VueGoodTable
		},
		data() {
			return {
				bodyLoading: false,
        		searchTerm: '',
				pageSize: 10,
				currentPage: 1,
				bindApis: [],
				roleId: 0,
				apis: [],
				services: [],
				dialogVisible: false,
				dialogMemVisible: false,
				dialogVisibleSplace: false,
				form: {},
				columns: [
          			{
						label: "id",
						field: "id",
						sortable: false
					},
					{
						label: "角色编码",
						field: "roleCode",
						sortable: false
					},
					{
						label: "角色名",
						field: "name",
						sortable: false
					},
				    {
				    	label: "描述",
				    	field: "remark",
				    	sortable: false
				    },

					{
						label: "操作",
						field: "option",
						sortable: false
					}
				],

				tableData: [],
				roleServices: [],
			};
		},
		created() {
			this.getRoleList()
      		this.getRoleSource();
		},

		methods: {

			closeDialog() {
				this.roleServices = []
				this.bindApis = []
			},

			handleSplace(item) {
				const that = this;

				that.roleServices = []
				that.bindApis = []
				let _data = {
					curl: $themeConfig.app.userHttpUrl + '/project/role/sources',
					projectId: this.$store.state.myRequest.projectId,
					id: item.id
				}

				that.$store.dispatch('httpPost', _data).then(function(res) {

					let tmpApis = res.data.apis

					tmpApis.forEach(function(item) {
						that.bindApis.push([item.serviceId, item.id])
					})
					that.roleId = item.id
					that.dialogVisibleSplace = true

				})
			},

			getRoleSource() {

				const that = this;

				let _data = {
					curl: $themeConfig.app.userHttpUrl + '/project/permessionList',
					projectId: this.$store.state.myRequest.projectId,
				}

				that.$store.dispatch('httpPost', _data).then(function(res) {
					that.apis = that.toApiTree(res.data.apis)

				})

			},
			toApiTree(data) {
				var map = {}
				var listKey = []
				data.forEach(function(item) {
					if (map[item.serviceId] == null) {
						listKey.push(item.serviceId)
						map[item.serviceId] = {
							value: item.serviceId,
							label: item.serviceId,
							children: [{
								value: item.id,
								label: `${item.pattern}--${item.method}`
							}]
						}

					} else {
						map[item.serviceId].children.push({
							value: item.id,
							label: `${item.pattern}--${item.method}`
						})
					}

				});
				var listApi = []
				listKey.forEach(function(val) {
					listApi.push(map[val])
				})
				return listApi
			},

			addRole() {
				this.form = {};
				this.dialogVisible = true;
			},

			handleRoleAdd() {
				this.form = {};
				this.dialogVisible = true;
			},
			getRoleList() {
				const that = this;
				that.bodyLoading = true
				let _data = {
					curl: $themeConfig.app.userHttpUrl + '/project/rolelist',
					//curl: 'http://localhost:8020/project/rolelist',
					projectId: this.$store.state.myRequest.projectId,
					type: 1
				}

				that.$store.dispatch('httpPost', _data).then(function(res) {
					that.tableData = res.data;
					that.bodyLoading = false
				})
			},
			assignRole() {
				const that = this;

				const apis = []
				that.bindApis.forEach(function(item) {
					apis.push(item[1])
				})
				let _data = {
					curl: $themeConfig.app.userHttpUrl + '/project/role/source',
					projectId: this.$store.state.myRequest.projectId,
					sourceIds: [],
					apiSources: apis,
					roleId: this.roleId
				}

				that.$store.dispatch('httpPost', _data).then(function(res) {
					that.dialogVisibleSplace = false
					that.bindApis = []
					that.getRoleList()

				})
			},
			saveRole() {

				const that = this;

				that.form["type"] = 1
				that.form["projectId"] = this.$store.state.myRequest.projectId
				that.form["curl"] = $themeConfig.app.userHttpUrl + '/project/role/add'
				that.$store.dispatch('httpPost', that.form).then(function(res) {
					that.dialogVisible = false;
					that.getRoleList();

				})

			},
			saveMem() {
				const data = this.totrandata;

				roleAddMembers(this.rolerId, data).then((resp) => {
					this.dialogMemVisible = false;
					this.$message.success("关联成员成功");
				});

			},
			handleDelete(item) {
				const that = this;
				this.$confirm("确认删除 ", "提示", {
				  confirmButtonText: "确定",
				  cancelButtonText: "取消",
				  type: "warning"
				}).then(async () => {
				let _data = {
					curl: $themeConfig.app.userHttpUrl + '/project/role/delete',
					projectId: this.$store.state.myRequest.projectId,
					id: item.id
				}


				that.$store.dispatch('httpPost', _data).then(function(res) {
					that.dialogVisible = false;
					that.getRoleList();

				})
				})
			},
			handleEdit(item) {
				this.form = {
					id: item.id,
					name: item.name,
					roleCode: item.roleCode,
					type: item.type,
					remark: item.remark,
				};
				this.dialogVisible = true;
			},

			handleSizeChange(val) {
				this.pageSize = val;
			},
			handleCurrentChange(val) {
				this.currentPage = val;
			},


			handleRelation(row) {
				this.rolerId = row.id;
				// this.value
				this.trandata = [];
				this.totrandata = [];

				this.memberList.forEach((item, index) => {
					this.trandata.push({
						label: item.user.username,
						key: item.user.id,
					});
				});

				roleMembers(row.id).then((resp) => {

					resp.payload.forEach((item, index) => {
						this.totrandata.push(
							item.user.id
						);
					});

					this.dialogMemVisible = true;
				});
			},
      refreshForm() {
        this.reload()
      }
		}
	};
</script>

<style>

	.el-cascader-menu{
	  width: 50%;

	}
	.el-row {
		margin-bottom: 10px;
	}

   .el-cascader-menu__wrap {
    height: 30rem;
    }
	.el-col {
		border: 1px solid transparent;
	}
</style>
