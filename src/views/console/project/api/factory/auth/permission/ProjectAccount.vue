<template>
	<b-card no-body >
		<div class="m-2">
		<!-- Table Top -->
		<b-row>
			<b-col cols="12" md="8" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
			<b-button variant="primary" @click="handleAdd()">
				<i class="el-icon-plus"/>
				新增用户
			</b-button>
			</b-col>
			<!-- Search -->
			<b-col cols="12" md="4">
			<div class="d-flex align-items-center justify-content-end">
				<b-form-input v-model="search" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
							class="d-inline-block mr-1" placeholder="Search..."/>
				<b-button variant="outline-primary" class="btn-icon"
						@click="refreshForm">
				<feather-icon icon="RefreshCwIcon"/>
				</b-button>
			</div>
			</b-col>
		</b-row>
		</div>

		<vue-good-table 
			v-loading="bodyLoading" 
			:columns="columns" 
			:rows="userList" 
			style-class="vgt-table striped" 
			:search-options="{ enabled: true, externalQuery: search }" 
			:pagination-options="{ enabled: true, perPage: pageSize }"
		>
			<template slot="table-row" slot-scope="props">
				<span v-if="props.column.field === 'option'">
					<feather-icon style="cursor: pointer;" :id="`EditIcon-${props.row.id}`" icon="EditIcon" size="16" class="mx-1" @click="handleEdit(props.$index, props.row)" v-b-tooltip.hover title="编辑" />
					<feather-icon style="cursor: pointer;" :id="`TrashIcon-${props.row.id}`" icon="TrashIcon" size="16" class="mx-1" @click="handleDelete(props.$index, props.row)" v-b-tooltip.hover title="删除" />
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

		<el-dialog @close='closeDialog' :title=" addFlag == 0 ? '新增用户' : '修改用户'" :visible.sync="dialogFormVisible" width="500px">
			<el-form ref="form" :model="form"  style="width: 100%">
				<el-form-item label="用户账号:" :label-width="formLabelWidth" >
					<el-select
						v-model="form.account"
						filterable
						remote
						class="mySelect"
						reserve-keyword
						:disabled = "addFlag == 1"
						placeholder="请输入关键词"
						:remote-method="remoteMethod"
						:loading="loading"
					>
						<el-option v-for="item in options" :key="item.account" :label="item.account" :value="item.account"></el-option>
					</el-select>

					<!-- <el-input v-model="form.account" autocomplete="off"></el-input> -->
				</el-form-item>

				<el-form-item label="服务角色:" :label-width="formLabelWidth" style="text-align: left;">
					<el-select class="mySelect" v-model="selectRole" multiple collapse-tags placeholder="请选择角色">
						<el-option v-for="item in projectRoleList" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleSave">确 定</el-button>
			</div>
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
	import Ripple from "vue-ripple-directive"
	export default {
        inject:['reload'],
		components: {
			VueGoodTable
		},
		data() {
			return {
				bodyLoading: false,
				pageSize: 10,
				currentPage: 1,
				userList: [],
				roleList: [],
				addFlag: 0,
				loading: false,
				options: [],
				projectRoleList: [],
				selectValue: [],
				selectRole:  [],
				form: {
					account: "",
				},
				loginForm:{
					username:"",
					password:""
				},
				projectId: "",
				accountForm: {
					account: "",
				},
				columns: [{
						label: "账号",
						field: "account",
						sortable: false
					},
					{
						label: "权限",
						field: "name",
						sortable: false
					},
					{
						label: "操作",
						field: "option",
						sortable: false
					}
				],
				dialogAccountFormVisible: false,
				dialogTableVisible: false,
				dialogFormVisible: false,
				formLabelWidth: "80px",
				token: "",
				selectCitys: {},
				isshow: false,
				dynamicTags: [],
				inputVisible: false,
				inputValue: "",
				addUsers: [],
				search: ''
			};
		},

		watch: {
			orgpermission: {
				deep: true,
				handler: function() {
					this.roleorgpermission = this.orgpermission
				},
			},
		},

		created() {

			this.projectId = this.$store.state.myRequest.projectId
			this.getUserList(), this.getRoleList();
		},

		methods: {
			remoteMethod(query) {
				const that = this
				if (query !== '') {
					that.loading = true;
					setTimeout(() => {
					that.loading = false;
					let _data = {
						curl: $themeConfig.app.userHttpUrl + '/authority/search',
						page: 1,
						size: 10,
						account:query
					}
					that.$store.dispatch('httpGet', _data).then(function(res) {
							that.options = res.data.rows;
					})

					}, 200);
				} else {
					that.options = [];
				}
			},


			validationForm() {
				this.$refs.loginForm.reset();
				// console.log(this.$refs.username.)
			},


			handleSizeChange(val) {
				this.pageSize = val;
			},
			handleCurrentChange(val) {
				this.currentPage = val;
			},
			showInput() {
				this.inputVisible = true;
				this.$nextTick((_) => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleClick(item) {
				this.inputValue = item;
				this.handleInputConfirm();

			},

			getRoleList() {
				const that = this;

			    let  _data = {
					curl: $themeConfig.app.userHttpUrl + '/project/roleSelectlist',
					projectId: that.projectId,
				}

				that.$store.dispatch('httpPost', _data).then(function(res) {
					that.projectRoleList = res.data;
				})
			},

			getUserList() {
				const that = this;
				that.bodyLoading = true
				let _data = {
			        curl: $themeConfig.app.userHttpUrl + '/project/userlist',
					//curl: 'http://localhost:8020/project/userlist',
					projectId: that.projectId,

				}

				that.$store.dispatch('httpPost', _data).then(function(res) {
					that.userList = res.data;
					that.bodyLoading = false
				})

			},

			handleAdd() {
			    this.addFlag = 0
				this.dialogFormVisible = true
				// this.dialogAccountFormVisible = true
				// this.addUsers = []
				// this.selectCitys = []
				// this.dynamicTags = []
				// this.inputVisible = false;
				// this.inputValue = "";
			},

			handleEdit(index, row) {
				this.form = row;
				this.addFlag = 1

				const that = this
				this.form = row;
				that.selectRole = []
				let _data = {
					curl: $themeConfig.app.userHttpUrl + '/project/account/roles',
					projectId: that.projectId,
					account: row.account
				}
				that.$store.dispatch('httpPost', _data).then(function(res) {
					 let roleList = res.data
					 roleList.forEach(function(item){
						that.selectRole.push(item.id)

					 })
				})

				this.dialogFormVisible = true;
			},
			handleSave() {
				const that = this;
				let _data = {
					curl: $themeConfig.app.userHttpUrl + '/project/assign/account/role',
					projectId: that.projectId,
					account: that.form.account,
					roleIds: that.selectRole,
				}
				that.$store.dispatch('httpPost', _data).then(function(res) {
					that.dialogFormVisible = false;
					that.getUserList();
				})

			},
            refreshForm() {
				this.reload()
			},
			handleDelete(index, row) {
				this.$confirm("确认删除", "提示", {
				  confirmButtonText: "确定",
				  cancelButtonText: "取消",
				  type: "warning"
				}).then(async () => {
				  const _data = {
				    curl:  $themeConfig.app.userHttpUrl + '/project/user/delete',
					account: row.account,
				    projectId: this.projectId
				   
				  }
				  this.$store.dispatch("httpPost", _data).then((res) => {
				    if (res.flag) {
				      this.getUserList();
				      this.$bvToast.toast("删除成功", {
				        title: "操作提示",
				        toaster: 'b-toaster-top-center',
				        solid: true,
				        variant: "success",
				        autoHideDelay: 2000
				      })
				    } else {
				      this.$bvToast.toast(res.message, {
				        title: "操作提示",
				        toaster: 'b-toaster-top-center',
				        solid: true,
				        variant: "danger",
				        autoHideDelay: 2000
				      })
				    }
				  })
				}).catch(() => {
				})
			},
			closeDialog() {
				this.selectRole = []
				this.form = {}
				this.dialogFormVisible = false
			},
		},
	};
</script>

<style>
	.el-tag+.el-tag {
		margin-left: 10px;
	}

	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}

   .modal .modal-header .close {
    transform: translate(0px, 0px);
}

	.input-new-tag {
		width: 120px;
		margin-left: 10px;
		vertical-align: bottom;
	}

	.el-card,
	.el-row {
		margin-bottom: 10px;
		margin-top: 20px;
	}

	.el-col {
		border: 1px solid transparent;
	}
  .mySelect {
    display: block;
}
	.binding :hover {
		cursor: pointer;
	}
</style>
