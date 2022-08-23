<template>
    <b-card no-body>
        <div style="margin: 15px;">
            <el-row>
                <el-col :span="24">
                  <!--  <el-input v-model="searchTerm"
                              class="d-inline-block mr-1"
                    />-->
                    <el-input v-model="searchTerm"  placeholder="服务/告警类型" style="width: 20%"/>
                    <span class="searchMargin">级别</span>
                    <el-select v-model="alarmLevel" placeholder="请选择">
                        <el-option label="全部" value="">
                        </el-option>
                        <el-option label="低危" value="0">

                        </el-option>
                        <el-option label="中危" value="1">

                        </el-option>
                        <el-option label="高危" value="2">

                        </el-option>
                    </el-select>
                    <span class="searchMargin">处理状态</span>
                    <el-select v-model="status" placeholder="请选择">
                        <el-option value="" label="全部">
                        </el-option>

                        <el-option label="待处理" value="0">

                        </el-option>
                        <el-option label="已处理" value="1">

                        </el-option>
                        <el-option label="忽略" value="2">

                        </el-option>
                    </el-select>
                    <el-button  class="searchMargin" type="primary" icon="el-icon-search" circle @click="searchClick()"></el-button>
                </el-col>

            </el-row>
        </div>

        <!-- table -->
        <vue-good-table v-loading="bodyLoading" :columns="columns" :rows="rows" :rtl="direction" style-class="vgt-table striped"
                        @on-page-change="onPageChange"
                        @on-per-page-change="onPerPageChange" :sort-options="{
        enabled: true
        }" :pagination-options="{
        enabled: true,
        setCurrentPage: currentPage
      }">
            <template slot="table-row" slot-scope="props">
                <!-- Column: Action -->

                <span v-if="props.column.field === 'status'">
					<span>
					<b-badge :variant="statusColor[props.row.status]">
						{{statusLevel[props.row.status]}}
					 </b-badge>
					</span>
				</span>
				
				<span v-else-if="props.column.field === 'id'">
					<b-link   @click="showMsg(props.row)">
						{{props.row.id}}
					</b-link>
				</span>
				
                <span v-else-if="props.column.field === 'alarmLevel'">
					<span>
					<b-badge :variant="alarmColor[props.row.alarmLevel]">
					{{alarm[props.row.alarmLevel]}}
					 </b-badge>
					</span>
				</span>


                <span v-else-if="props.column.field === 'action'">
					<span>
						<el-select @change="updateAction($event,props.row)" :ref="`select${props.row.id}`"
                                   :value="props.row.status"
                                   :id="'select'+props.row.id" placeholder="请选择">
							<el-option label="待处理" :value="0" :disabled="true">
							</el-option>

							<el-option label="已处理" :value="1">
							</el-option>

							<el-option label="忽略" :value="2">
							</el-option>

						</el-select>
					</span>
				</span>

                <!-- Column: Common -->
                <span v-else>
					{{ props.formattedRow[props.column.field] }}
				</span>
            </template>

            <!-- pagination -->
            <template slot="pagination-bottom" slot-scope="props">
                <div class="mx-2 mb-2">
                    <div class="d-flex justify-content-between flex-wrap">
                        <div class="d-flex align-items-center mb-0 mt-1">
						<span v-on:total="totalElements" class="text-nowrap ">
							共 {{totalElements}} 条，每页显示
						</span>
                            <b-form-select v-model="pageLength" :options="[5, 10, 20, 50]" class="mx-1"
                                           @input="(value)=>props.perPageChanged({currentPerPage:value})"/>
                            <span class="text-nowrap">条 </span>
                        </div>
                        <div>
                            <b-pagination :value="1" :total-rows="totalElements" :per-page="pageLength" first-number
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
		<div>
		    <b-modal
		            id="exception-msg"
		            modal-class="modal-danger"
		            hide-footer
		            centered
		            title="告警信息"
		    >
				<b-card-title>
				  触发条件:  {{errorRow.ruleName}}
				</b-card-title>
			<br/>
		        <b-card-text>
		            {{errorRow.alarmMessage}}
		        </b-card-text>
		    </b-modal>
		</div>
    </b-card>
</template>

<script>
    import {
        VueGoodTable
    } from 'vue-good-table'
    import 'vue-good-table/dist/vue-good-table.css'
    import store from '@/store'

    import {
        $themeConfig
    } from '@themeConfig'

    export default {
        components: {
            VueGoodTable
        },
        inject: ['reload'],
        data() {
            return {
                bodyLoading: false, // 页面加载状态
                projectId: this.$store.state.myRequest.projectId,
                pageLength: 10,
                currentPage: 1,
                serviceId: '',
                method: '',
                alarmLevel: '',
                searchTerm: '',
                status: '',
                pageChange: true,
                dir: false,
                statusLevel: ['待处理', '已处理', '忽略'],
                statusColor: ['light-warning', 'light-success', 'light-info'],
                alarm: ['低危', '中危', '高危'],
                alarmColor: ['light-info', 'light-warning', 'light-danger'],
                columns: [{
                    label: '编号',
                    field: 'id',
                    hidden: false,
                    sortable: false
                },
                    {
                        label: '日期',
                        field: 'recodeTime',
                        hidden: false,
                        sortable: false
                    },
                    {
                        label: '服务',
                        field: 'scope',
                        hidden: false,
                        sortable: false
                    },
                    {
                        label: '告警类型',
                        field: 'alarmTypeText',
                        hidden: false,
                        sortable: false
                    },
                    {
                        label: '负责人',
                        field: 'principal',
                        hidden: false,
                        sortable: false
                    },
                    {
                        label: '告警级别',
                        field: 'alarmLevel',
                        hidden: false,
                        sortable: false
                    },
                    {
                        label: '处理状态',
                        field: 'status',
                        hidden: false,
                        sortable: false
                    },
                    {
                        label: '操作',
                        field: 'action',
                        hidden: false,
                        sortable: false
                    }
                ],
                options: [],
                rows: [],
				errorRow:{},
                totalElements: 0,
                searchTerm: ''
            }
        },
        computed: {
            direction() {
                if (store.state.appConfig.isRTL) {
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.dir = true
                    return this.dir
                }
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.dir = false
                return this.dir
            }
        },
        created() {
            this.getWarnMsgList(this.currentPage, this.pageLength)

        },
        methods: {
            searchClick() {
                this.getWarnMsgList(1, this.pageLength)

            },


            getWarnMsgList(currentPage, pageSize, weekNum) {
                let that = this
                that.bodyLoading = true
                let _data = {
                    curl: $themeConfig.app.monitorHttpUrl + '/tbMonitorLog/listMonitorLog',
                    project: that.projectId,

                }
                _data["offset"] = currentPage
                _data["limit"] = pageSize
                _data["order"] = 'id'
                if (that.alarmLevel != '') {
                    _data["alarmLevel"] = that.alarmLevel
                }
                if (that.status != '') {
                    _data["status"] = that.status
                }

                if (that.searchTerm != '') {
                    _data["search"] = that.searchTerm
                }
                that.$store.dispatch('httpGet', _data).then(function (res) {
                    that.rows = res.data.rows
                    that.totalElements = res.data.total
                    that.bodyLoading = false
                })
            },
            updateAction(value, row) {
                row.status = value
                row.curl = $themeConfig.app.monitorHttpUrl + '/tbMonitorLog/updateStatus'
                this.$store.dispatch('httpPut', row).then(() => {
                    this.getWarnMsgList(this.currentPage, this.pageLength)
                })
            },
            onPageChange(param) {
                // currentPerPage改变时，如果不在第一页，currentPage也会变化，此时onPerPageChange与onPageChange都会执行
                // 加上判断避免不在第一页时，更改currentPerPage导致查询两次
                if (param.currentPage === 1 && !this.pageChange) {
                    this.pageChange = true
                    return
                }
                this.getWarnMsgList(param.currentPage, param.currentPerPage, this.searchTerm)
            },
            onPerPageChange(param) {
                this.pageChange = false
                this.getWarnMsgList(param.currentPage, param.currentPerPage, this.searchTerm)
            },
			showMsg(row){
				this.errorRow = row
				this.$bvModal.show("exception-msg")
			}
        },
        // watch: {
        // 	searchTerm(val) {
        // 		this.getWarnMsgList(1, this.pageLength, val)
        // 	}
        // }
    }
</script>
<style lang="scss">
     .searchMargin {
        margin-left: 10px;
        margin-right: 10px;
    }
	.modal .modal-header .close {
	  transform: translate(0px, 0px) !important;
	  box-shadow: 0 5px 20px 0 rgb(255 255 255 / 10%) !important;
	  background: transparent !important;
	}
</style>
