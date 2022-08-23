<template>
	<div align="center">
		<div v-if="loading">
			<b-card  no-body>
				<div class="m-2">
					<!-- Table Top -->
					<b-row>
						<b-col cols="12" md="8" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
							<b-button variant="primary" @click="showSelectModel()">
								<i class="el-icon-plus" />
								新增API
							</b-button>
						</b-col>
						<!-- Search -->
						<b-col cols="12" md="4">
							<div class="d-flex align-items-center justify-content-end">
								<b-form-input v-model="searchTerm" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" class="d-inline-block mr-1" placeholder="Search..." />
								<b-button v-ripple.400="'rgba(113, 102, 240, 0.15)'" variant="outline-primary" class="btn-icon" @click="refreshForm">
									<feather-icon icon="RefreshCwIcon" />
								</b-button>
							</div>
						</b-col>
					</b-row>
				</div>


				<vue-good-table 
					v-loading="bodyLoading" 
					:columns="columns" 
					:rows="rows" 
					style-class="vgt-table striped" 
					:search-options="{ enabled: true, externalQuery: searchTerm }" 
					:pagination-options="{ enabled: true, perPage: pageLength }">
					<template slot="table-row" slot-scope="props">
						<span v-if="props.column.field === 'option'">
							<!-- <div> -->
								<feather-icon style="cursor: pointer;" :id="`EditIcon-${props.row.id}`" icon="EditIcon" size="16" class="mx-1" @click="showEditModal(2,props.row)" v-b-tooltip.hover title="编辑" />
								<feather-icon style="cursor: pointer;" v-if="$store.state.myRequest.superAdmin" :id="`Des-${props.row.id}`"  icon="FileTextIcon" size="16" class="mx-1" @click="showDesModal(props.row)" v-b-tooltip.hover title="描述" />
								<feather-icon style="cursor: pointer;" :id="`TrashIcon-${props.row.id}`" icon="TrashIcon" size="16" class="mx-1" @click="deleteDataSource(props.row.id)" v-b-tooltip.hover title="删除" />
							<!-- </div> -->
						</span>

						<span v-if="props.column.field === 'category'">
							<b-badge :variant="props.row.category =='service' ? 'light-warning' : 'light-success' ">
								{{props.row.category == "service" ? "外部服务" : "数据库" }}
							</b-badge>
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
									<span class="text-nowrap">共 {{ props.total }} 条，每页显示</span>
									<b-form-select v-model="pageLength" :options="[5, 10, 20, 50]" class="mx-1" @input="(value) => props.perPageChanged({ currentPerPage: value })" />
									<span class="text-nowrap"> 条 </span>
								</div>
								<div>
									<b-pagination 
										:value="1" 
										:total-rows="props.total" 
										:per-page="pageLength" 
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

				<!--form-->
				<div>
					<b-modal id="modal-multi-1" size="lg" title="接入类型" hide-footer no-close-on-backdrop no-close-on-es>
						<div class="demo-inline-spacing" style="display:block;" align="center">
							<b-button v-ripple.400="'rgba(113, 102, 240, 0.15)'" variant="outline-primary" v-b-modal.modal-multi-2>
								<feather-icon icon="HomeIcon" class="mr-50" />
								<span class="align-middle">数据接口</span>
							</b-button>
							<b-button variant="gradient-danger" v-b-modal.modal-multi-3>
								<feather-icon icon="HeartIcon" class="mr-50" />
								<span class="align-middle">外部接口</span>
							</b-button>

						</div>
					</b-modal>

					<!-- modal -->
					<b-modal id="modal-multi-2" size="lg" hide-footer  no-close-on-backdrop no-close-on-es title="数据接口">
						<validation-observer ref="dataRules">
							<b-form>
								<b-tabs pills align="left" style="padding:20px;text-align: left;">
									<b-tab active title="基础信息">
										<b-row>
											<b-col cols="12">
												<b-form-group label="视图ID" label-for="dataSourceId">
													<validation-provider #default="{ errors }" name="dataSourceId" rules="required">
														<b-input-group class="input-group-merge">
															<b-form-input v-model="form.id" :readonly="dataSourceIdReadOnly" :state="errors.length > 0 ? false : null" placeholder="" />
														</b-input-group>
													</validation-provider>
												</b-form-group>
											</b-col>
											<!-- mobile -->
											<b-col cols="12">
												<b-form-group label="名称" label-for="dataSourceName">
													<validation-provider #default="{ errors }" name="dataSourceName" rules="required">
														<b-input-group class="input-group-merge">
															<b-form-input v-model="form.name" :state="errors.length > 0 ? false : null" placeholder="" />
														</b-input-group>
													</validation-provider>
												</b-form-group>
											</b-col>
											<b-col cols="12">
												<b-form-group label="执行" label-for="dataSourceType">
													<validation-provider #default="{ errors }" name="dataSourceType" rules="required">
														<b-form-select v-model="form.sqlType" :options="crudOptions" value-field="value" :state="errors.length > 0 ? false : null" text-field="label" />
													</validation-provider>
												</b-form-group>
											</b-col>
											<b-col cols="12">
												<b-form-group label="数据源" label-for="connStrSource">
													<validation-provider #default="{ errors }" name="connStrSource" rules="required">
														<b-form-select v-model="form.dataSourceId" :options="dataOptions" value-field="value" :state="errors.length > 0 ? false : null" text-field="label" />
													</validation-provider>
												</b-form-group>
											</b-col>
											<b-col cols="12">
												<b-form-group label="视图SQL" label-for="connStr">
													<validation-provider #default="{ errors }" name="connStr" rules="required">
														<b-input-group class="input-group-merge">
															<b-form-textarea v-model="form.viewBody" style="height: 12.5rem;" :state="errors.length > 0 ? false : null" />
														</b-input-group>
													</validation-provider>
												</b-form-group>
											</b-col>

											<b-col cols="12">
												<b-form-group label="描述" label-for="desci">
													<b-form-input v-model="form.desci" placeholder="" autocomplete="off" />
												</b-form-group>
											</b-col>
										</b-row>
									</b-tab>
									<b-tab title="高级">
										<b-row>
											<b-col md="12">
												<b-form-group label="是否分页">
													<el-switch style="height: 100%" v-model="isPage" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0"></el-switch>
												</b-form-group>
											</b-col>
											<b-col md="12" v-if="isPage == '1'">
												<b-form-group label="查询总数SQL" label-for="connStr">
													<validation-provider #default="{ errors }" name="connStr">
														<b-input-group class="input-group-merge">
															<b-form-textarea v-model="form.countSql" style="height: 12.5rem;" :state="errors.length > 0 ? false : null" />
														</b-input-group>
													</validation-provider>
												</b-form-group>
											</b-col>
											<b-col md="12">
												<b-form-group label="替换规则JSON" label-for="connStr">
													<validation-provider #default="{ errors }" name="connStr">
														<b-input-group class="input-group-merge">
															<b-form-textarea v-model="form.replaceRuleJson"  style="height: 12.5rem;" :state="errors.length > 0 ? false : null" />
														</b-input-group>
													</validation-provider>
												</b-form-group>
											</b-col>
										</b-row>
									</b-tab>
								</b-tabs>
								<!-- reset and submit -->
								<b-row>
									<b-col cols="12">
										<b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" size="sm" class="mr-1" @click.prevent="editSaveService('db')">提交</b-button>
										<b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="button" variant="outline-secondary" size="sm" @click="closeEditModal">取消</b-button>
									</b-col>
								</b-row>
							</b-form>
						</validation-observer>
					</b-modal>


					<!-- modal -->
					<b-modal id="modal-multi-3" title="外部接口" size="lg"  hide-footer no-close-on-backdrop no-close-on-es>
						<validation-observer ref="dataRules">
							<b-form>
								<b-tabs pills align="left" style="padding:20px;text-align: left;">
									<b-tab active title="基础信息">
										<b-row>
											<b-col cols="12">
												<b-form-group label="视图ID" label-for="dataSourceId">
													<validation-provider #default="{ errors }" name="dataSourceId" rules="required">
														<b-input-group class="input-group-merge">
															<b-form-input v-model="form.id" :readonly="dataSourceIdReadOnly" :state="errors.length > 0 ? false : null" placeholder="" />
														</b-input-group>
													</validation-provider>
												</b-form-group>
											</b-col>
											<!-- mobile -->
											<b-col cols="12">
												<b-form-group label="名称" label-for="dataSourceName">
													<validation-provider #default="{ errors }" name="dataSourceName" rules="required">
														<b-input-group class="input-group-merge">
															<b-form-input v-model="form.name" :state="errors.length > 0 ? false : null" placeholder="" />
														</b-input-group>
													</validation-provider>
												</b-form-group>
											</b-col>
											<b-col cols="12">
												<b-form-group label="描述" label-for="desci">
													<b-form-input v-model="form.desci" placeholder="" autocomplete="off" />
												</b-form-group>
											</b-col>

											<b-col cols="12">
												<b-form-group label="来源服务" label-for="connStrSource">
													<validation-provider #default="{ errors }" name="connStrSource" rules="required">
														<b-form-select v-model="form.dataSourceId" :options="serviceOptions" value-field="value" :state="errors.length > 0 ? false : null" text-field="label" />
													</validation-provider>
												</b-form-group>
											</b-col>
										</b-row>
									</b-tab>
									<b-tab title="请求内容">
										<b-row>
											<b-col cols="12">
												<b-form-group label="请求地址" label-for="desci">
													<b-form-input v-model="form.viewBody" placeholder="" autocomplete="off" />
												</b-form-group>
											</b-col>
											<b-col cols="12">
												<b-form-group label="请求类型" label-for="dataSourceType">
													<validation-provider #default="{ errors }" name="dataSourceType" rules="required">
														<b-form-select v-model="form.sqlType" :options="requestOptions" value-field="value" :state="errors.length > 0 ? false : null" text-field="value" />
													</validation-provider>
												</b-form-group>
											</b-col>

											<b-col cols="12">
												<b-form-group label="请求JSON" label-for="connStr">
													<validation-provider #default="{ errors }" name="connStr">
														<b-input-group class="input-group-merge">
															<b-form-textarea v-model="form.replaceRuleJson" style="height: 12.5rem;" :state="errors.length > 0 ? false : null" />
														</b-input-group>
													</validation-provider>
												</b-form-group>
											</b-col>
										</b-row>
									</b-tab>
								</b-tabs>
								<!-- reset and submit -->
								<b-row>
									<b-col cols="12">
										<b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" size="sm" class="mr-1" @click.prevent="editSaveService('service')">提交</b-button>
										<b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="button" variant="outline-secondary" size="sm" @click="closeEditModal">取消</b-button>
									</b-col>
								</b-row>
							</b-form>
						</validation-observer>
					</b-modal>
				</div>
				<!-- table -->
			</b-card>
		</div>
		<b-modal id="modal-multi-4" title="详细信息"  size="lg" hide-footer no-close-on-backdrop no-close-on-es>
			<ApiForm  style="text-align: left;" :formData="formData" />
		</b-modal>
	</div>
</template>

<script>
	import { $themeConfig } from "@themeConfig"
	import { VueGoodTable } from "vue-good-table"
	import store from "@/store"
	import "vue-good-table/dist/vue-good-table.css"
	import Ripple from "vue-ripple-directive"
	import ApiForm from "./api-des-form.vue"
	import { required } from "@validations"
	import {
		ValidationProvider,
		ValidationObserver
	} from "vee-validate"

	export default {
		inject: ["reload"],
		components: {
			ValidationObserver,
			ValidationProvider,
			VueGoodTable,
			ApiForm
		},
		directives: {
			Ripple
		},
		data() {
			return {
				bodyLoading: false,
				dataSourceIdReadOnly: false,
				required,
				projectId: this.$store.state.myRequest.projectId,
				pageLength: 10,
				formData: {},
				page: 1,
				total: 0,
				loading: true,
				dir: false,
				isPage: 0,
				columns: [{
						label: "视图ID",
						field: "id",
						sortable: false
					},
					{
						label: "视图名称",
						field: "name",
						sortable: false
					},
					{
						label: "数据源",
						field: "dataSourceId",
						sortable: false
					},
					{
						label: "类别",
						field: "category",
						sortable: false
					},
					{
						label: "描述",
						field: "desci",
						sortable: false
					},

					{
						label: "操作",
						field: "option",
						sortable: false
					}
				],
				operateType: 1,
				crudOptions: [{
						label: '查询',
						value: 'select'
					},
					{
						label: '增改',
						value: 'update'
					},
					{
						label: '删除',
						value: 'delete'
					}

				],
				requestOptions: [{
						value: 'GET'
					},
					{
						value: 'POST'
					}
				],
				dataOptions: [],
				serviceOptions: [],
				rows: [],
				projectList: [],
				searchTerm: '',
				form: {
					id: '',
					name: '',
					projectId: this.$store.state.myRequest.projectId,
					paging: 0,
					remark: '',
					replaceRuleJson: '',
					sqlType: '',
					statusCode: '',
					updateTime: '',
					desci: '',
					dataSourceId: '',
					countSql: '',
					viewBody: ''
				}
			}
		},

		computed: {
			direction() {
				if (store.state.appConfig.isRTL) {
					// eslint-disable-next-line vue/no-side-effects-in-computed-properties
					this.dir = true;
					return this.dir;
				}
				// eslint-disable-next-line vue/no-side-effects-in-computed-properties
				this.dir = false;
				return this.dir;
			},
		},
		created() {
			this.getDataSourceList()
			this.getDataApiList()
		},
		methods: {
			getDataApiList() {
				let that = this
				let _data = {
					curl: `${$themeConfig.app.projectHttpUrl}/convertlab`,
					projectId: this.projectId,
					path: '/datasource/ids',
					category: 'db'
				}
				that.$store.dispatch("httpPost", _data).then(function(res) {
					that.dataOptions = res.data
				})

				let data1 = {
					curl: `${$themeConfig.app.projectHttpUrl}/convertlab`,
					projectId: this.projectId,
					path: '/datasource/ids',
					category: 'service'
				}

				that.$store.dispatch("httpPost", data1).then(function(res) {
					// debugger
					that.serviceOptions = res.data
				})

			},

			getDataSourceList() {
				this.bodyLoading = true
				const _data = {
					curl: `${$themeConfig.app.projectHttpUrl}/convertlab`,
					projectId: this.projectId,
					path: '/view/search'
				}
				this.$store.dispatch("httpGet", _data).then((res) => {
					this.rows = res.data == null ?  [] : res.data ;
					this.bodyLoading = false
				})
			},
			closeEditModal() {
				this.$bvModal.hide("modal-multi-1")
				this.$bvModal.hide("modal-multi-2")
				this.$bvModal.hide("modal-multi-3")
			},

			showDesModal(row){
				this.formData = row
				this.$bvModal.show("modal-multi-4")
			},
			showSelectModel() {
				this.operateType = 1
				this.$bvModal.show("modal-multi-1")
				this.dataSourceIdReadOnly = false
				this.isPage = 0
				this.form = {
					projectId: this.projectId
				}
			},
			showEditModal(operateType, rowData) {
				this.operateType = operateType;

				this.form = {
					id: rowData.id,
					name: rowData.name,
					projectId: this.projectId,
					paging: 0,
					countSql: rowData.countSql,
					remark: rowData.remark,
					replaceRuleJson: rowData.replaceRuleJson,
					sqlType: rowData.sqlType,
					statusCode: rowData.statusCode,
					updateTime: rowData.updateTime,
					desci: rowData.desci,
					dataSourceId: rowData.dataSourceId,
					viewBody: rowData.viewBody
				}
				this.dataSourceIdReadOnly = true
				if (rowData.paging) {
					this.isPage = 1
				}
				if (rowData.category == 'service') {
					this.$bvModal.show("modal-multi-3")
				} else {
					this.$bvModal.show("modal-multi-2")
				}

			},
			editSaveService(type) {
				this.$refs.dataRules.validate().then((success) => {
					if (success) {
						if (this.operateType === 1) {
							// 新增
							this.form.curl = `${$themeConfig.app.projectHttpUrl}/convertlab`
							this.form.path = '/view/add'
							this.form.category = type
							this.form.paging = this.isPage
							this.$store.dispatch("httpPost", this.form).then((res) => {
								if (res.flag) {
									this.$bvModal.hide("modal-multi-2")
									this.$bvModal.hide("modal-multi-3")
									this.$bvModal.hide("modal-multi-1")
									this.getDataSourceList();
									this.$bvToast.toast("添加成功", {
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
						} else {
							// 修改
							this.form.curl = `${$themeConfig.app.projectHttpUrl}/convertlab`
							this.form.path = '/view/update'
							this.form.paging = this.isPage
							this.$store.dispatch("httpPost", this.form).then((res) => {
								if (res.flag) {
									this.$bvModal.hide("modal-multi-2")
									this.$bvModal.hide("modal-multi-3")
									this.$bvModal.hide("modal-multi-1")
									this.getDataSourceList()
									this.$bvToast.toast("修改成功", {
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
						}
					}
				})
			},
			deleteDataSource(props) {
				this.$confirm("确认删除 " + props, "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(async () => {
					const _data = {
						curl: `${$themeConfig.app.projectHttpUrl}/convertlab`,
						id: props,
						projectId: this.projectId,
						path: '/view/delete'
					}
					this.$store.dispatch("httpPost", _data).then((res) => {
						if (res.flag) {
							this.getDataSourceList();
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
				}).catch(() => {})
			},
			refreshForm() {
				this.reload()
			}
		}
	}
</script>

<style>
	.vgt-left-align {
		vertical-align: revert !important;
		color: #606266;
	}

	.modal .modal-header .close {
		transform: translate(0px, 0px) !important;
		box-shadow: 0 5px 20px 0 rgb(255 255 255 / 10%) !important;
		background: transparent !important;
	}
</style>
