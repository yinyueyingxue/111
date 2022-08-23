<template>

	<b-card
	        no-body>
	    <div class="m-2">
	        <!-- Table Top -->
          <b-col
                  cols="12"
                  md="4"
                  style="float:right;"
          >
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

	    </div>
	    <!-- table -->
	    <vue-good-table v-loading="bodyLoading" :columns="columns" :rows="rows" style-class="vgt-table striped"
		@on-page-change="onPageChange"
		@on-per-page-change="onPerPageChange"

		:pagination-options="{
	    enabled: true,
	    perPage:pageLength

	  }">
	        <template slot="table-row" slot-scope="props">
	            <span v-if="props.column.field === 'action'">
	                   <feather-icon
	                           :id="`configIcon-${props.row.id}`"
	                           icon="TrashIcon"
	                           size="16"
	                           class="mx-1"
	                          @click="deleteService(props)"
	                   />
				</span>
				<span v-if="props.column.field === 'statusCode'">
				      <b-badge :variant="statusVariant(props.row.workStatus)">
				      	{{ parseWorkStatus(props.row.workStatus) }}
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
						<span class="text-nowrap ">
							共 {{ total }} 条，每页显示
						</span>
	                        <b-form-select v-model="pageLength" :options="['5', '10','20','50']" class="mx-1"
	                                       @input="(value)=>props.perPageChanged({currentPerPage:value})"/>
	                        <span class="text-nowrap"> 条 </span>
	                    </div>
	                    <div>
	                        <b-pagination :value="1" :total-rows="total" :per-page="pageLength" first-number
	                                      last-number align="right" prev-class="prev-item" next-class="next-item"
	                                      class="mt-1 mb-0"
	                                      @input="(value)=>props.pageChanged({currentPage:value})">
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
	import {
	    $themeConfig,
	} from '@themeConfig'
	import {
	    VueGoodTable
	} from 'vue-good-table'
	import Ripple from 'vue-ripple-directive'
	import {
	    Message,
	    Popover,
	    Select
	} from 'element-ui'
	import {
	    required
	} from '@validations'
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


	                // {
	                //     label: '操作',
	                //     field: 'action',
	                //     sortable: false
	                // },
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
				  curl: `${$themeConfig.app.apiHttpUrl}/authority/account/search`,
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
					path: '/authority/search',
					toProject: this.$store.state.myRequest.projectId,
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
