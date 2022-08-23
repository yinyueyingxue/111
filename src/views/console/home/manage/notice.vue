<template>
	
	<b-card no-body>
	    <div class="m-2">
	        <!-- Table Top -->
	        <b-row>
	            <b-col cols="12" md="8" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
	                <b-button variant="primary" @click="showEditModal(1)">
	                    <i class="el-icon-plus"/>
	                    新建公告
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
							@click="refreshForm"
	                    >
	                        <feather-icon icon="RefreshCwIcon"/>
	                    </b-button>
	                </div>
	            </b-col>
	        </b-row>
	    </div>
	    <!--form-->
	    <div>
	        <b-modal 
				id="serviceForm" 
				centered 
				:title="operateType===1 ?'新增公告':'修改公告'"
	            hide-footer 
				no-close-on-backdrop 
				no-close-on-es
	            modal-class="modal-primary"
			>
	            <validation-observer ref="serviceRules">
	                <b-form>
	                    <b-row>
	                        <b-col cols="12">
	                            <b-form-group label="公告标题" label-for="noticeTitle">
	                                <validation-provider #default="{ errors }" name="noticeTitle" rules="required">
	                                  <b-form-input id="id" v-model="form.id" hidden/>
										<b-input-group class="input-group-merge">
	                                        <b-form-input id="noticeTitle" v-model="form.noticeTitle" :readonly="serviceIdReadOnly" />
	                                    </b-input-group>
	                                    <!-- <small class="text-danger">{{ errors[0] }}</small>-->
	                                </validation-provider>
	                            </b-form-group>
	                        </b-col>
	                        <!-- mobile -->
	                        <b-col cols="12">
	                            <b-form-group label="公告内容" label-for="content">
	                                <validation-provider #default="{ errors }" name="content" rules="required">
	                                    <b-input-group class="input-group-merge">
	                                        <b-form-textarea id="noticeContent" v-model="form.noticeContent"/>
	                                    </b-input-group>
	                                </validation-provider>
	                            </b-form-group>
	                        </b-col>
	                       	<!-- <b-col cols="12">
	                            <b-form-group label="公告类型" label-for="serviceType">
	                                <b-form-select id="serviceType" v-model="form.type" :options="typeOptions" value-field="value" text-field="label"/>
	                            </b-form-group>
	                        </b-col> -->
	                        <b-col cols="12" >
	                            <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" size="sm" class="mr-1" @click.prevent="editSaveService">
	                                提交
	                            </b-button>
	                            <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="button" variant="outline-secondary" size="sm" @click="closeEditModal">
	                                取消
	                            </b-button>
	                        </b-col>
	                    </b-row>
	                </b-form>
	            </validation-observer>
	        </b-modal>
	    </div>
	    <!-- table -->
	    <vue-good-table 
			:columns="columns" 
			:rows="rows" 
			style-class="vgt-table striped" 
			:pagination-options="{ enabled: true, perPage:pageLength }">
	        <template slot="table-row" slot-scope="props">				
	            <span v-if="props.column.field === 'action'">
					<feather-icon
						:id="`configIcon-${props.row.id}`"
						icon="EditIcon"
						size="16"
						class="mx-1"
						@click="showEditModal(2,props.row)"
					/>
					<feather-icon
						:id="`configIcon-${props.row.id}`"
						icon="TrashIcon"
						size="16"
						class="mx-1"
						@click="deleteService(props)"
					/>					
				</span>
	            <span v-else>{{ props.formattedRow[props.column.field] }}</span>
	        </template>
	        <!-- pagination -->
	        <template slot="pagination-bottom" slot-scope="props">
	            <div class="mx-2 mb-2">
	                <div class="d-flex justify-content-between flex-wrap">
	                    <div class="d-flex align-items-center mb-0 mt-1">
						<span class="text-nowrap ">共 {{ props.total }} 条，每页显示</span>
	                        <b-form-select v-model="pageLength" :options="['5', '10','20','50']" class="mx-1" @input="(value)=>props.perPageChanged({currentPerPage:value})" />
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
	            loading: false,	       	       	          	   	          
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
						label: 'id',
						field: 'id',
						sortable: false
	                }, {
	                    label: '标题',
	                    field: 'noticeTitle',
	                    sortable: false
	                }, {
	                    label: '最后修改人',
	                    field: 'noticeUser',
	                    sortable: false
	                }, {
	                    label: '上线状态',
	                    field: 'noticeStatus',
	                    sortable: false
	                }, {
	                    label: '操作',
	                    field: 'action',
	                    sortable: false
	                },
	            ],
	            rows: [],
	            form: {},       
	        }
	    },
	
	    computed: {
	        statusVariant(workStatus) {
	            const statusColor = {
	                1: 'light-primary',
	                2: 'light-warning',
	                3: 'light-success',
	                null: 'light-primary',
	            }
	            if (workStatus !== -null) {
	                return workStatus => statusColor[workStatus]
	            }
	        },
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
	        this.getNoticeList()
	    },
	    methods: {
	        getNoticeList() {
	            const that = this
	            const _data = {
	                //curl: `${$themeConfig.app.projectHttpUrl}/notice/page/list`,	
					curl: `${$themeConfig.app.projectHttpUrl}/notice/page/list`,			  
	                // page: 1,
	                // size: 20,
	            }
	            that.$store.dispatch('httpGet', _data).then(res => {
	                that.rows = res.data.records
	                // that.total = res.data.total
	            })
	        },

	        parseWorkStatus(status) {
	            switch (status) {
	                case 1:
	                    return '未上线'
	                case 2:
	                    return '试运行'
	                case 3:
	                    return '已转产'
	                default:
	                    return '未上线'
	            }
	        },
	       
	        closeEditModal() {
	            this.$bvModal.hide('serviceForm')
	        },

	        showEditModal(operateType, rowData) {
	            this.operateType = operateType
	            if (operateType === 2) {
	                this.serviceIdReadOnly = true
	                this.form = {
	                    id: rowData.id,
	                    noticeTitle: rowData.noticeTitle,
	                    noticeContent: rowData.noticeContent
	                }
	            } else {
	                this.serviceIdReadOnly = false
	                this.form = {}
	            }
	            this.$bvModal.show('serviceForm')
	        },

	        editSaveService() {
				const that = this
				if (this.operateType === 1) {
					// 新增
					this.form.curl = `${$themeConfig.app.projectHttpUrl}/notice/addOrUpdate`
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
				} else {
					// 修改
					this.form.curl = `${$themeConfig.app.projectHttpUrl}/notice/addOrUpdate`
					this.$store.dispatch('httpPost', this.form).then(res => {
						if (res.flag) {
							that.$bvModal.hide('serviceForm')
							that.refreshForm()
							that.$bvToast.toast('修改成功', {
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
				}
	        },
	        deleteService(props) {
	            const that = this
	            this.$confirm('确认删除', '提示', {
	                confirmButtonText: '确定',
	                cancelButtonText: '取消',
	                type: 'warning',
	            }).then(async () => {
	                const _data = {
	                    curl: `${$themeConfig.app.projectHttpUrl}/notice/delete`,
						id: props.row.id
	                }
	                this.$store.dispatch('httpDelete', _data).then(res => {
	                    if (res.flag) {
	                        that.getNoticeList()
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
	        refreshForm() {
	            this.reload()
	        }
	    }
	}
</script>

<style>
	.modal .modal-header .close {
	    transform: translate(0px,0px) !important;
	    box-shadow: 0 5px 20px 0 rgb(255 255 255 / 10%) !important;
	    background: transparent !important;
	}
</style>
