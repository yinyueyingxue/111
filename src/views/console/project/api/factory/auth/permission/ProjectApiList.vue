<template>
    <b-card no-body>
        <div style="margin: 15px;">
            <el-row>
                <el-col :span="24">
                    <span style="margin-right: 10px;">服务</span>

                    <el-select v-model="serviceId" placeholder="请选择">
                        <el-option label="全部" value="">
                        </el-option>
                        <el-option v-for="item in options" :key="item.account" :label="item.name" :value="item.account">
                        </el-option>
                    </el-select>

                    <span class="searchMargin">方法</span>
                    <el-select v-model="method" placeholder="请选择">
                        <el-option value="" label="全部来源">
                        </el-option>
                        <el-option label="POST" value="POST">
                        </el-option>
                        <el-option label="GET" value="GET">
                        </el-option>
                        <el-option label="PUT" value="PUT">
                        </el-option>
                        <el-option label="DELETE" value="DELETE">
                        </el-option>
                    </el-select>
					<span class="searchMargin">路径</span>
					<el-input v-model="pattern"  placeholder="路径" @keyup.enter.native="searchClick" style="width: 20%;margin-left: 0.625rem;"/>
                    <el-button class="searchMargin" type="primary" icon="el-icon-search" circle @click="searchClick()"></el-button>
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
                <span v-if="props.column.field === 'action'">
					<span>
						<el-select @change="updateAction($event,props.row)" :ref="`select${props.row.id}`"
                                   :value="props.row.authority == null ? '' :  props.row.authority+''"
                                   :id="'select'+props.row.id" placeholder="请选择">
							<el-option label="免认证" value="0">
							</el-option>
							<el-option label="免授权" value="1">
							</el-option>
							<el-option label="平台授权" value="2">
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
                bodyLoading: false,
                projectId: this.$store.state.myRequest.projectId,
                pageLength: 10,
                currentPage: 1,
                serviceId: '',
                method: '',
				pattern: '',
                pageChange: true,
                dir: false,
                columns: [{
                    label: '服务ID',
                    field: 'serviceId',
                    hidden: false,
                    sortable: false
                },
                    {
                        label: '请求方法',
                        field: 'method',
                        hidden: false,
                        sortable: false
                    },
                    {
                        label: '路径',
                        field: 'pattern',
                        hidden: false,
                        sortable: false
                    },
                    {
                        label: '权限',
                        field: 'authority',
                        hidden: false,
                        sortable: false
                    },
                    {
                        label: '状态',
                        field: 'status',
                        hidden: false,
                        sortable: false
                    },
                    {
                        label: 'JSON',
                        field: 'requiredRequestBody',
                        hidden: false,
                        sortable: false
                    },
                    {
                        label: '创建时间',
                        field: 'createTime',
                        hidden: false,
                        sortable: false
                    },
                    {
                        label: '更新时间',
                        field: 'updateTime',
                        hidden: false,
                        sortable: false
                    },

                    {
                        label: '授权方式',
                        field: 'action',
                        hidden: false,
                        sortable: false
                    }
                ],
                options: [],
                rows: [],
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
            this.getApiList(this.currentPage, this.pageLength)
            this.getProjectService()
        },
        methods: {
            searchClick() {
                this.getApiList(1, this.pageLength)

            },
            getProjectService() {
                let that = this
                let _data = {
                    curl: $themeConfig.app.userHttpUrl + '/service/search',
                    projectId: that.projectId,
                    authority: 0

                }

                that.$store.dispatch('httpGet', _data).then(function (res) {
                    that.options = res.data
                })
            },

            getApiList(currentPage, pageSize, weekNum) {
                let that = this
                that.bodyLoading = true
                let _data = {
                    curl: $themeConfig.app.userHttpUrl + '/gateway/search',
                    projectId: that.projectId,

                }
                _data["page"] = currentPage
                _data["size"] = pageSize
				this.pageLength = pageSize
				this.currentPage = currentPage
                if (that.serviceId != '') {
                    _data["serviceId"] = that.serviceId
                }
                if (that.method != '') {
                    _data["method"] = that.method
                }
				if (that.pattern != '') {
				    _data["pattern"] = that.pattern
				}
                that.$store.dispatch('httpGet', _data).then(function (res) {
                    that.rows = res.data.rows
                    that.totalElements = res.data.total
                    that.bodyLoading = false
                })
            },
            updateAction(value, row) {
                row.authority = value
                row.curl = $themeConfig.app.userHttpUrl + '/gateway/update'
                this.$store.dispatch('httpPost', row).then(() => {					
                    this.getApiList(this.currentPage, this.pageLength)
                })
            },
            onPageChange(param) {
                // currentPerPage改变时，如果不在第一页，currentPage也会变化，此时onPerPageChange与onPageChange都会执行
                // 加上判断避免不在第一页时，更改currentPerPage导致查询两次
                if (param.currentPage === 1 && !this.pageChange) {
                    this.pageChange = true
                    return
                }
                this.getApiList(param.currentPage, param.currentPerPage, this.searchTerm)
            },
            onPerPageChange(param) {
                this.pageChange = false
                this.getApiList(param.currentPage, param.currentPerPage, this.searchTerm)
            },
        },
        watch: {
            searchTerm(val) {
                this.getApiList(1, this.pageLength, val)
            }
        }
    }
</script>
<style lang="scss">
    .searchMargin {
        margin-left: 10px;
        margin-right: 10px;
    }
</style>
