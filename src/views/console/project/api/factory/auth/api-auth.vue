<template>
	<b-card no-body>
	    <div class="m-2">
	        <!-- Table Top -->
	        <b-row>
	            <b-col cols="12" md="8" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
	                <b-button variant="primary" @click="showEditModal(1)">
	                    <i class="el-icon-plus"/>
	                    新增权限
	                </b-button>
	            </b-col>
	            <b-col cols="12" md="4">
	                <div class="d-flex align-items-center justify-content-end">
	                    <b-form-input
							v-model="searchTerm"
							:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
							class="d-inline-block mr-1"
							placeholder="Search..."
	                    />
	                    <b-button
							v-ripple.400="'rgba(113, 102, 240, 0.15)'"
							variant="outline-primary"
							class="btn-icon"
							@click="searchForm"
	                    >
	                        <feather-icon icon="SearchIcon"/>
	                    </b-button>
	                </div>
	            </b-col>
	        </b-row>
	    </div>
	    <!--form-->
	    <div>
	        <b-modal 
				id="serviceForm" 
				centered title="新增权限"
				hide-footer 
				no-close-on-backdrop 
				no-close-on-es
				modal-class="modal-primary"
			>
	            <validation-observer ref="serviceRules">
	                <b-form>
	                    <b-row>
	                       <b-col cols="12">
								<b-form-group label="账号" label-for="defender">
									<el-select v-model="selectItem" placeholder="请输入应用或服务账号 搜索" clearable filterable
										reserve-keyword 
										remote 
										:remote-method="selectAccount"
										value-key="account"
										:loading="loading1"
										style="width: 100%"
									>
										<el-option v-for="item in accountOptions" :key="item.account" :label="item.account" :value="item" />
									</el-select>
								</b-form-group>
	                        </b-col>
	                     
	                        <b-col cols="12">
								<b-form-group label="viewId" label-for="defender">
									<el-select 
										v-model="form.viewId" 
										placeholder="请输入VIEWID 搜索" 
										clearable 
										filterable
										reserve-keyword 
										remote 
										:remote-method="selectViews" 
										:loading="loading2"
										style="width: 100%"
									>
										<el-option v-for="item in viewOptions" :key="item.id" :label="item.name" :value="item.id" />
									</el-select>
								</b-form-group>
	                        </b-col>
	                        <b-col cols="12">
								<b-form-group label="状态" label-for="resource">
									<el-select v-model="form.statusCode" placeholder="启用/禁用" style="width: 100%">
										<el-option label="启用" value="1"></el-option>
										<el-option label="禁止" value="0"></el-option>
									</el-select>
								</b-form-group>
	                        </b-col>     
	                        <b-col cols="12" >
	                            <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" size="sm" class="mr-1" @click.prevent="editSaveService">提交</b-button>
	                            <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="button" variant="outline-secondary" size="sm" @click="closeEditModal">取消</b-button>
	                        </b-col>
	                    </b-row>
	                </b-form>
	            </validation-observer>
	        </b-modal>
	    </div>
	    <!-- table -->
	    <vue-good-table 
			v-loading="bodyLoading" 
			:columns="columns" 
			:rows="rows" 
			style-class="vgt-table striped" 
			@on-page-change="onPageChange"
			@on-per-page-change="onPerPageChange"
			:pagination-options="{ enabled: true, perPage:pageLength }"
		>
	        <template slot="table-row" slot-scope="props">				
	            <span v-if="props.column.field === 'action'">	                    
					<feather-icon
						:id="`configIcon-${props.row.id}`"
						icon="TrashIcon"
						size="16"
						class="mx-1"
						style="cursor: pointer;"
						v-b-tooltip.hover
						title="删除"
						@click="deleteService(props)"
					/>
				</span>
				<span v-if="props.column.field === 'statusCode'">
					<b-badge :variant="statusVariant(props.row.workStatus)">{{ parseWorkStatus(props.row.workStatus) }}</b-badge>				
				</span>
				
	            <span v-else>{{ props.formattedRow[props.column.field] }}</span>
	        </template>
	        <!-- pagination -->
	        <template slot="pagination-bottom" slot-scope="props">
	            <div class="mx-2 mb-2">
	                <div class="d-flex justify-content-between flex-wrap">
	                    <div class="d-flex align-items-center mb-0 mt-1">
						<span class="text-nowrap">共 {{ total }} 条，每页显示</span>
	                        <b-form-select v-model="pageLength" :options="['5', '10','20','50']" class="mx-1" @input="(value)=>props.perPageChanged({currentPerPage:value})"/>
	                        <span class="text-nowrap"> 条 </span>
	                    </div>
	                    <div>
	                        <b-pagination 
								:value="1" 
								:total-rows="total" 
								:per-page="pageLength" 
								first-number
	                            last-number 
								align="right" 
								prev-class="prev-item" 
								next-class="next-item"
	                            class="mt-1 mb-0"
	                            @input="(value)=>props.pageChanged({currentPage:value})"
							>
	                            <template #prev-text>
	                                <feather-icon icon="ChevronLeftIcon" size="18"/>
	                            </template>
	                            <template #next-text>
	                                <feather-icon icon="ChevronRightIcon" size="18"/>
	                            </template>
	                        </b-pagination>
	                    </div>
	                </div>
	            </div>
	        </template>
	    </vue-good-table>
	</b-card>
</template>

<script>
	import { $themeConfig } from '@themeConfig'
	import { VueGoodTable } from 'vue-good-table'
	import Ripple from 'vue-ripple-directive'
	import {
	    Message,
	    Popover,
	    Select
	} from 'element-ui'
	import { required } from '@validations'
	import {
	    ValidationProvider,
	    ValidationObserver
	} from 'vee-validate'
	export default {
	    inject: ['reload'],
	    components: {   
	        Select,           
	        ValidationObserver,
	        ValidationProvider,
	        Popover,
	        Message,	                
	        VueGoodTable,	      
	    },
	    directives: {
	        Ripple,
	    },
	    data() {
	        return {
				bodyLoading: false,
				accountOptions:[],
				viewOptions: [],
	            loading1: false,
				selectItem: {},
				loading2: false,											  
	            visible: false,
	            // 1=新增 2=修改
	            operateType: 1,
	            required,
	            pageLength: 10,
	            page: 1,
	            total: 0,
				searchTerm:'',
	            dir: false,
	            columns: [
	                {
	                label: 'ID',
	                field: 'id',
	                sortable: false
	                },
	                {
	                    label: '用户',
	                    field: 'account',
	                    sortable: false
	                },
	                {
	                    label: '视图',
	                    field: 'viewId',
	                    sortable: false
	                },
	            
	                {
	                    label: '状态',
	                    field: 'statusCode',
	                    sortable: false
	                },
	             
	            
	                {
	                    label: '操作',
	                    field: 'action',
	                    sortable: false
	                },
	            ],
	            rows: [],
	            form: {	               
	            },
	            	           
	        }
	    },
	
	    computed: {
	        typeVariant(type) {
	            const typeColor = {
	                1: 'info',
	                2: 'secondary',
	                null: 'secondary',
	            }
	            if (type !== null) {
	                return type => typeColor[type]
	            }
	        },
	        direction() {
	            if (store.state.appConfig.isRTL) {	              
	                this.dir = true
	                return this.dir
	            }	       
	            this.dir = false
	            return this.dir
	        },
	    },
	    created() {
	        this.getApiAuthList()
	    },
	    methods: {
			statusVariant(workStatus) {
			    const statusColor = {
			        1: 'light-success',
			        0: 'light-warning',	                
			        null: 'light-success',
			    }
			   
			     workStatus = 1
			     return  statusColor[workStatus]
			    
			},
			onPageChange(param) {
			  // currentPerPage改变时，如果不在第一页，currentPage也会变化，此时onPerPageChange与onPageChange都会执行
			  // 加上判断避免不在第一页时，更改currentPerPage导致查询两次
			  if (param.currentPage === 1 && !this.pageChange) {
			    this.pageChange = true
			    return
			  }
			  this.page = param.currentPage
			  this.getApiAuthList()
			},
			onPerPageChange(param) {
			  this.pageChange = false
			  this.page = param.currentPage
			  this.getApiAuthList()
			},
			selectAccount(query){
				const that = this
				if (query !== '') {
				  that.loading1 = true
				  setTimeout(() => {
				    that.loading1 = false
				    this.getAccountList(query)
				  }, 300)
				} else {
				  that.accountOptions = []
				}
			},
			selectViews(query){
				const that = this
				if (query !== '') {
				  that.loading2 = true
				  setTimeout(() => {
				    that.loading2 = false
				    this.getViewsList(query)
				  }, 300)
				} else {
				  that.viewOptions = []
				}
			},
			getAccountList(query){
				const that = this
				const _data = {
				  curl: `${$themeConfig.app.httpUrl}/convertlab/v1.0/authority/account/search`,
				  account: query				 
				}
				this.$store.dispatch('httpGet', _data).then(res => {
				  if (res.flag || res.data.rows.size !== 0) {
				    that.accountOptions = res.data.rows
				  } else {
				    that.accountOptions = []
				  }
				})
			},
			getViewsList(query){
				const that = this
				const _data = {
				  curl: `${$themeConfig.app.projectHttpUrl}/convertlab`,
				  path: '/view/search',
				  id: query,
				  projectId:this.$store.state.myRequest.projectId,
				  
				}
				this.$store.dispatch('httpGet', _data).then(res => {
				  if (res.flag || res.data.rows.size !== 0) {				  
				    that.viewOptions = res.data				    
				  } else {
				    that.viewOptions = []
				  }
				})
			},
			parseWorkStatus(status) {
			    switch (status) {
			        case 0:
			            return '禁用'
			        case 1:
			            return '启用'			       
			        default:
			            return '启用'
			    }
			},
	        getApiAuthList() {
	            const that = this
				that.bodyLoading = true
	            const _data = {	               
					curl: `${$themeConfig.app.projectHttpUrl}/convertlab`,			  
	                projectId: this.$store.state.myRequest.projectId,
					path: '/authority/search',
					desci: this.searchTerm,
					page: this.page,
					size: this.pageLength
	            }
	            that.$store.dispatch('httpGet', _data).then(res => {
	                that.rows = res.data.rows
	                that.total = res.data.total
					that.bodyLoading = false
	            })
	        },
	        
	       
	        closeEditModal() {
	            this.$bvModal.hide('serviceForm')
	        },
	        showEditModal(operateType, rowData) {
	            this.operateType = operateType
	            if (operateType === 2) {
	              
	            } else {
	                this.serviceIdReadOnly = false
	                this.form = {	                
	                }
					this.selectItem = {}
	            }
	            this.$bvModal.show('serviceForm')
	        },
	        editSaveService() {
				const that = this                
				// 新增
				this.form.curl = `${$themeConfig.app.projectHttpUrl}/convertlab`
				this.form.path = 'authority/add'
				this.form.account = this.selectItem.account
				this.form.toProject = this.selectItem.projectId
				this.form.projectId = this.$store.state.myRequest.projectId
				//this.form.curl = `http://localhost:8021/notice/addOrUpdate`
				this.$store.dispatch('httpPost', this.form).then(res => {
					if (res.flag) {
						that.$bvModal.hide('serviceForm')
						that.refreshForm()
						that.$bvToast.toast('添加成功', {
							title: '操作提示',
							toaster: 'b-toaster-top-center',
							solid: true,
							variant: 'success',
							autoHideDelay: 2000,
						})
					} else {
						that.$bvToast.toast(res.message, {
							title: '操作提示',
							toaster: 'b-toaster-top-center',
							solid: true,
							variant: 'danger',
							autoHideDelay: 2000,
						})
					}
				})
	        },
	        deleteService(props) {
	            const that = this
	            this.$confirm('确认删除', '提示', {
	                confirmButtonText: '确定',
	                cancelButtonText: '取消',
	                type: 'warning',
	            }).then(async () => {
	                const _data = {
	                    curl: `${$themeConfig.app.projectHttpUrl}/convertlab`,
						id: props.row.id,
						path:'authority/delete',
						projectId: this.$store.state.myRequest.projectId
	                }
	                this.$store.dispatch('httpPost', _data).then(res => {
	                    if (res.flag) {
	                        that.getApiAuthList()
	                        that.$bvToast.toast('删除成功', {
	                            title: '操作提示',
                              toaster: 'b-toaster-top-center',
                              solid: true,
	                            variant: 'success',
	                            autoHideDelay: 2000,
	                        })
	                    } else {
	                        that.$bvToast.toast(res.message, {
	                            title: '操作提示',
                              toaster: 'b-toaster-top-center',
                              solid: true,
	                            variant: 'danger',
	                            autoHideDelay: 2000,
	                        })
	                    }
	                })
	            })
	        },
			searchForm(){
				this.page = 1
				this.getApiAuthList()	
			},													  
	        refreshForm() {
	            this.reload()
	        },
	    },
	}
</script>

<style>
	.modal .modal-header .close {
	    transform: translate(0px,0px) !important;
	    box-shadow: 0 5px 20px 0 rgb(255 255 255 / 10%) !important;
	    background: transparent !important;
	}
</style>
