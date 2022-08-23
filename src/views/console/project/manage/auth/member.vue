<template>
	<b-card no-body>
    <div class="m-2">
      <!-- Table Top -->
      <b-row>
        <b-col cols="12" md="8" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
          <b-button variant="primary" @click="handleAdd()">
            <i class="el-icon-plus"/>
            添加成员
          </b-button>
        </b-col>
         <!--Search-->
        <!--<b-col cols="12" md="4">-->
        <!--  <div class="d-flex align-items-center justify-content-end">-->
        <!--    <b-form-input v-model="search" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"-->
        <!--                  class="d-inline-block mr-1" placeholder="Search..."/>-->
        <!--    <b-button variant="outline-primary" class="btn-icon"-->
        <!--              @click="refreshForm">-->
        <!--      <feather-icon icon="RefreshCwIcon"/>-->
        <!--    </b-button>-->
        <!--  </div>-->
        <!--</b-col>-->
      </b-row>
    </div>

    <vue-good-table v-loading="bodyLoading" :columns="columns" :rows="userList" style-class="vgt-table striped"
    :pagination-options="{
      enabled: true,
      perPage: pageSize,
    }">
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field === 'option'">
          <feather-icon style="cursor: pointer;" :id="`EditIcon-${props.row.id}`" icon="EditIcon" size="16" class="mx-1"
            @click="handleEdit(props.$index,props.row)" v-b-tooltip.hover title="编辑" />

          <feather-icon style="cursor: pointer;" :id="`TrashIcon-${props.row.id}`" icon="TrashIcon" size="16" class="mx-1"
            @click="handleDelete(props.$index,props.row)" v-b-tooltip.hover title="删除" />
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

		<div>
			<el-dialog @close='closeDialog' title="用户信息" :visible.sync="dialogFormVisible" width="500px">
				<el-form ref="form" :model="form"  style="width: 100%">
					<el-form-item label="用户账号:" :label-width="formLabelWidth" >
						<el-input v-model="form.account" autocomplete="off"></el-input>
					</el-form-item>

					<el-form-item label="租户角色:" :label-width="formLabelWidth" style="text-align: left;">
						<el-select v-model="selectValue" multiple collapse-tags placeholder="请选择角色">
							<el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
						</el-select>
					</el-form-item>

					<!-- <el-form-item label="服务角色:" :label-width="formLabelWidth" style="text-align: left;">
						<el-select v-model="selectRole" multiple collapse-tags placeholder="请选择角色">
							<el-option v-for="item in projectRoleList" :key="item.id" :label="item.name" :value="item.id" />
						</el-select>
					</el-form-item> -->
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="handleSave">确 定</el-button>
				</div>
			</el-dialog>




			<el-dialog @close='closeDialog' title="新增用户" :visible.sync="dialogAccountFormVisible" width="500px">


				<el-form ref="accountForm" :model="accountForm" style="width: 10px;">
					<el-form-item label="用户账号:" :label-width="formLabelWidth" style="width: 300px;">
						<!-- <el-input v-model="form.account" autocomplete="off"></el-input> -->



						<el-tag :key="tag.account" v-for="tag in dynamicTags" :value="tag" closable :disable-transitions="false" @close="handleClose(tag)">
							{{tag.account }}

						</el-tag>
						<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small">
						</el-input>
						<el-button v-else class="button-new-tag" size="small" @click="showInput">+添加人员</el-button>

						<div class="binding" data-title="绑定账号">
							<div v-show="isshow">
								<p v-for="item ,index in selectCitys" :key="index" :value="item">
									<i class="el-icon-circle-plus-outline" @click="handleClick(item)">{{item.account}}
									</i>
								</p>
							</div>
						</div>

					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogAccountFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="handleSaveUser">确 定</el-button>
				</div>
			</el-dialog>

		</div>
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
		components: {
			VueGoodTable
		},
    	inject:['reload'],
		data() {
			return {
				bodyLoading: false,
				userList: [],
				roleList: [],
				pageSize: 10,
				currentPage: 1,
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
				addUsers: []
			};
		},

		watch: {
			orgpermission: {
				deep: true,
				handler: function() {
					//debugger
					this.roleorgpermission = this.orgpermission;
					//console.log(this.orgpermission);
				},
			},
			inputValue: function(val, oldVal) {
				if (val.length == 0) {
					this.isshow = false;
				} else {
					this.isshow = true;
					var citys = [];

					const that = this;


					let _data = {
						curl: $themeConfig.app.userHttpUrl + '/authority/search',
						page: 1,
						size: 10,
						type: 3,
						account:val
					}
					that.$store.dispatch('httpGet', _data).then(function(res) {
						citys = res.data.rows;
						that.selectCitys = citys;
					})
				}
			},
		},

		created() {

			this.projectId = this.$store.state.myRequest.projectId
			this.getUserList(), this.getRoleList();
		},

		methods: {


			validationForm() {
				this.$refs.loginForm.reset();
			     // console.log(this.$refs.username.)
			    },

			handleInputConfirm() {
				let inputValue = this.inputValue;
				if (inputValue && this.addUsers.indexOf(inputValue.account) < 0) {
					this.dynamicTags.push(inputValue);
					this.addUsers.push(inputValue.account)

					this.inputVisible = false;
					this.inputValue = "";
				} else {
					alert("请勿重复添加!")
					this.inputVisible = false;
					this.inputValue = "";
				}

			},
			showInput() {
				this.inputVisible = true;
				this.$nextTick((_) => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleSaveUser() {
				const that = this

				let _data = {
					curl: $themeConfig.app.userHttpUrl + '/namespace/addNsUser',
					projectId: that.projectId,
					accounts: that.addUsers
				}
				that.$store.dispatch('httpPost', _data).then(function(res) {
					if (res.flag) {
						that.dialogAccountFormVisible = false;
						that.getUserList()
					}
				})
			},

			handleClick(item) {
				this.inputValue = item;
				this.handleInputConfirm();

			},
			handleClose(tag) {
				this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
				this.addUsers.splice(this.addUsers.indexOf(tag.account), 1);
			},
			getRoleList() {
				const that = this;
				let _data = {
					curl: $themeConfig.app.userHttpUrl + '/namespace/rolelist',
					projectId: that.projectId,
				}

				that.$store.dispatch('httpPost', _data).then(function(res) {
					that.roleList = res.data;
				})


			     _data = {
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
					curl: $themeConfig.app.userHttpUrl + '/namespace/userlist',
					projectId: that.projectId,

				}

				that.$store.dispatch('httpPost', _data).then(function(res) {
					that.userList = res.data;
					that.bodyLoading = false
				})
			},

			handleAdd() {
				this.dialogAccountFormVisible = true;
				this.addUsers = []
				this.selectCitys = []
				this.dynamicTags = []
				this.inputVisible = false;
				this.inputValue = "";
			},

			handleEdit(index, row) {
				const that = this
				this.form = row;
				that.selectRole = []
				let selectStr = [];
				selectStr = row.roleIds == null ? [] : row.roleIds.split(",");
				this.selectValue = selectStr.map((item) => {
					return +item;
				});

				// let _data = {
				// 	curl: $themeConfig.app.userHttpUrl + '/project/account/roles',
				// 	projectId: that.projectId,
				// 	account: row.account
				// }
				// that.$store.dispatch('httpPost', _data).then(function(res) {
				// 	 let roleList = res.data
				// 	 roleList.forEach(function(item){
				// 		that.selectRole.push(item.id)

				// 	 })
				// })

				this.dialogFormVisible = true;
			},
			handleSave() {
				const that = this;
				let _data = {
					curl: $themeConfig.app.userHttpUrl + '/namespace/account/role',
					projectId: that.projectId,
					account: that.form.account,
					roleIds: that.selectValue,
					// type: 1,
					// serviceRoleIds: that.selectRole
				}
				that.$store.dispatch('httpPost', _data).then(function(res) {
					that.dialogFormVisible = false;
					that.getUserList();
				})

			},

			handleDelete(index, row) {
				const that = this;

				this.$confirm("确认删除", "提示", {
				  confirmButtonText: "确定",
				  cancelButtonText: "取消",
				  type: "warning"
				}).then(async () => {
				let _data = {
					curl: $themeConfig.app.userHttpUrl + '/namespace/delAccount',
					projectId: that.projectId,
					account: row.account,
					roleIds: that.selectValue
				}
				that.$store.dispatch('httpPost', _data).then(function(res) {
					that.dialogFormVisible = false;
					that.getUserList();
				})
				 })

			},
			closeDialog() {
				this.selectValue = []
				this.form = {}
				this.dialogFormVisible = false
			},
      refreshForm() {
        this.reload()
      }
		},
	};
</script>

<style scoped>
	.el-tag+.el-tag {
		margin-left: 10px;
	}

	.el-select{
		display: block !important;
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

	.binding :hover {
		cursor: pointer;
	}
</style>
