<template>
	<b-card no-body>
    <div class="m-2">
      <b-row>
        <b-col cols="12" md="8" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
          <b-button variant="primary" @click="addRole()">
            <i class="el-icon-plus"/>
            新增角色
          </b-button>
        </b-col>
      </b-row>
    </div>

    <vue-good-table v-loading="bodyLoading" :columns="columns" :rows="tableData" style-class="vgt-table striped"  :pagination-options="{
      enabled: true,
      perPage: pageSize,
    }">
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field === 'option'">
          <feather-icon style="cursor: pointer;" :id="`EditIcon-${props.row.id}`" icon="EditIcon" size="16" class="mx-1"
            @click="handleEdit(props.row)" v-b-tooltip.hover title="编辑" />
          <feather-icon style="cursor: pointer;" :id="`TrashIcon-${props.row.id}`" icon="GitPullRequestIcon" size="16" class="mx-1"
            @click="handleSplace(props.row)" v-b-tooltip.hover title="分配资源" />
          <feather-icon style="cursor: pointer;"  :id="`TrashIcon-${props.row.id}`" icon="TrashIcon" size="16" class="mx-1"
            @click="handleDelete(props.row)" v-b-tooltip.hover title="删除" />
        </span>
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
      <!-- pagination -->
      <template slot="pagination-bottom" slot-scope="props">
        <div class="mx-2 mb-2">
          <div class="d-flex justify-content-between flex-wrap">
            <div class="d-flex align-items-center mb-0 mt-1">
              <span class="text-nowrap">
                共 {{ props.total }} 条，每页显示
              </span>
              <b-form-select v-model="pageSize" :options="[5, 10, 20, 50]" class="mx-1" @input="
            (value) => props.perPageChanged({ currentPerPage: value })
          " />
              <span class="text-nowrap"> 条 </span>
            </div>
            <div>
              <b-pagination :value="1" :total-rows="props.total" :per-page="pageSize" first-number
                last-number align="right" prev-class="prev-item" next-class="next-item"
                class="mt-1 mb-0" @input="(value) => props.pageChanged({ currentPage: value })">
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

		<el-dialog title="角色资源" @close='closeDialog' :close-on-click-modal="false" :visible.sync="dialogVisibleSplace" width="50%">
			<span>
				<el-form style="width: 100%">
					<el-form-item label="id" style="display:none">
						<el-input v-model="roleId" placeholder="id"></el-input>
					</el-form-item>

					<el-form-item label="资源" :label-width="formLabelWidth" style="text-align: left;">
						<el-card shadow="never">
							<el-tree :data="sources" show-checkbox node-key="id" :props="defaultProps" ref="tree" :default-checked-keys="defaltSources">
							</el-tree>
						</el-card>

					</el-form-item>

					<el-form-item label="服务" :label-width="formLabelWidth" style="text-align: left;">
						<el-select v-model="roleServices" multiple placeholder="请选择">

							<el-option key="0" label="全部服务" value="0">


							</el-option>
							<el-option v-for="item in services" :key="item.account" :label="item.name" :value="item.account">
							</el-option>
						</el-select>
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

<script >
import {
		$themeConfig
	} from '@themeConfig'
	import {
		VueGoodTable
	} from "vue-good-table"
	import store from "@/store"
	import "vue-good-table/dist/vue-good-table.css"
	export default {
		components: {
			VueGoodTable
		},
		data() {
			return {
				bodyLoading: false,
				columns: [
					/*{
						label: "id",
						field: "id",
						sortable: false
					},*/
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
				pageSize: 10,
				currentPage: 1,
				sources: [],
				roleId: 0,
				apis: [],
				defaltSources: [],
				services: [],
				dialogVisible: false,
				dialogMemVisible: false,
				dialogVisibleSplace: false,
				form: {},
				formLabelWidth: "80px",
				tableData: [],
				roleServices: [],
				defaultProps: {
					children: "children",
					label: "sourceName",
				},
			};
		},
		created() {
			this.getRoleList(), this.getRoleSource();
		},

		methods: {

			closeDialog() {
				this.$refs.tree.setCheckedKeys([])

				this.defaltSources = []
				this.roleServices = []


			},

			handleSplace(item) {
				const that = this;


				that.defaltSources = []
				that.roleServices = []

				let _data = {
					curl: $themeConfig.app.userHttpUrl + '/namespace/roleSoureces',
					projectId: this.$store.state.myRequest.projectId,
					id: item.id
				}

				that.$store.dispatch('httpPost', _data).then(function(res) {
					let tmpSource = that.totree(res.data.sources);
					let tmpApis = res.data.apis;
					let tmpServices = res.data.services;

					for (var i = 0; i < tmpSource.length; i++) {
						that.defaltSources.push(tmpSource[i].id)
					}

					for (var i = 0; i < tmpServices.length; i++) {
						that.roleServices.push(tmpServices[i].account)
					}


					that.roleId = item.id
					that.dialogVisibleSplace = true;

					that.$refs.tree.setCheckedKeys(that.defaltSources)
				})
			},

			getRoleSource() {

				const that = this;

				let _data = {
					curl: $themeConfig.app.userHttpUrl + '/project/role/search',
					projectId: this.$store.state.myRequest.projectId,
				}

				that.$store.dispatch('httpPost', _data).then(function(res) {
					that.sources = that.totree(res.data.sources);
					that.apis = res.data.apis;
					that.services = res.data.services;

				})

			},

			totree(data) {
				var map = {};

				data.forEach(function(item) {
					map[item.id] = item;
				});
				//        console.record(map);
				var val = [];
				data.forEach(function(item) {
					// 以当前遍历项，的pid,去map对象中找到索引的id
					var parent = map[item.parentId];
					//如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
					if (parent) {
						(parent.children || (parent.children = [])).push(item);
					} else {
						//如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
						val.push(item);
					}
				});

				return val;
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
					curl: $themeConfig.app.userHttpUrl + '/namespace/rolelist',
					projectId: this.$store.state.myRequest.projectId,
				}

				that.$store.dispatch('httpPost', _data).then(function(res) {
					that.tableData = res.data;
					that.bodyLoading = false
				})
			},
			assignRole() {
				const that = this;

				let _data = {
					curl: $themeConfig.app.userHttpUrl + '/namespace/role/source',
					projectId: this.$store.state.myRequest.projectId,
					sourceIds: this.$refs.tree.getCheckedKeys(),
					apiSources: [],
					services: this.roleServices,
					roleId: this.roleId
				}

				that.$store.dispatch('httpPost', _data).then(function(res) {
					that.dialogVisibleSplace = false;
					that.$refs.tree.setCheckedKeys([])
					that.getRoleList()

				})
			},
			saveRole() {

				const that = this;


				that.form["projectId"] = this.$store.state.myRequest.projectId
				that.form["curl"] = $themeConfig.app.userHttpUrl + '/namespace/role/add'
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

				// console.record(this.totrandata);
			},
			handleDelete(item) {
				const that = this
				this.$confirm("确认删除", "提示", {
				  confirmButtonText: "确定",
				  cancelButtonText: "取消",
				  type: "warning"
				}).then(async () => {
				let _data = {
					curl: $themeConfig.app.userHttpUrl + '/namespace/role/delete',
					projectId: this.$store.state.myRequest.projectId,
					"roleId": item.id
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
					remark: item.remark,
				};
				this.dialogVisible = true;
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
					//console.record(resp.payload);

					resp.payload.forEach((item, index) => {
						this.totrandata.push(
							//   {
							//   label: item.user.username,
							//   key: item.user.id,
							// }
							item.user.id
						);
					});

					console.log(this.totrandata);
					this.dialogMemVisible = true;
				});
			},
		},
	};
</script>

<style scoped>
	.el-card {
		margin-bottom: 10px;
	}
    .el-select{
		display: block !important;
	}
	.el-row {
		margin-bottom: 10px;
	}

	.el-col {
		border: 1px solid transparent;
	}
</style>
