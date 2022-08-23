<template>
    <div>
        <b-card no-body>
            <div class="m-2">
                <!-- Table Top -->
                <b-row>
                    <!-- Per Page -->
                    <b-col
                            cols="12"
                            md="8"
                            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
                    >
                        <b-button
                                variant="primary"
                                @click="showEditModal(1)"
                        >
                            <i class="el-icon-plus"/>
                            新建yaml模板
                        </b-button>
                    </b-col>
                    <!-- Search -->
                    <b-col
                            cols="12"
                            md="4"
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
                                    @click="refreshForm"
                            >
                                <feather-icon icon="RefreshCwIcon"/>
                            </b-button>
                        </div>
                    </b-col>
                </b-row>
            </div>
            <!--     modal       -->
            <div>
                <b-modal id="yamlTemplateModal" ref="yamlTemplateModal" centered
                         :title="operateType===1?'新增yaml模板':'修改yaml模板'"
                         hide-footer no-close-on-backdrop no-close-on-es size="lg"
                         @shown="refreshYaml"
                         modal-class="modal-primary">
                    <validation-observer ref="yamlRules">
                        <b-form>
                            <b-row>
                                <b-col md="6">
                                    <b-form-group label="名称" label-for="yamlTemplateName">
                                        <validation-provider
                                                #default="{ errors }"
                                                name="yamlTemplateName"
                                                rules="required"
                                        >
                                            <b-input-group class="input-group-merge">
                                                <b-form-input id="yamlTemplateName"
                                                              v-model="form.name"
                                                              placeholder="yaml模板名称"
                                                              :state="errors.length > 0 ? false:null"/>
                                            </b-input-group>
                                        </validation-provider>
                                    </b-form-group>
                                </b-col>
                                <b-col md="6">
                                    <b-form-group label="code" label-for="yamlTemplateCode">
                                        <b-input-group class="input-group-merge">
                                            <b-form-input id="yamlTemplateCode" v-model="form.code"
                                                          placeholder="yaml模板code"/>
                                        </b-input-group>
                                    </b-form-group>
                                </b-col>
                                <b-col md="12">
                                    <b-form-group label="所属应用" label-for="yamlTemplateProject">
                                        <el-select id="yamlTemplateProject" v-model="form.projectId"
                                                   filterable
                                                   clearable
                                                   placeholder="请选择所属应用" style="width: 100%">
                                            <el-option
                                                    v-for="item in projectList"
                                                    :key="item.id"
                                                    :label="item.id"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </b-form-group>
                                </b-col>
                                <b-col md="12">
                                    <b-form-group label="yaml配置" label-for="yamlTemplateContent">
                                        <codemirror id="yamlCode" ref="yamlCode" v-model="form.content"
                                                    :options="cmOptions"></codemirror>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="12">
                                    <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary"
                                              size="sm" class="mr-1" @click.prevent="saveEditYamlTemplate">
                                        提交
                                    </b-button>
                                    <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="button"
                                              variant="outline-secondary" size="sm" @click="closeEditModal">
                                        取消
                                    </b-button>
                                </b-col>
                            </b-row>
                        </b-form>
                    </validation-observer>
                </b-modal>

            </div>

            <!--            查看yaml modal-->
            <div>

                <b-sidebar id="sidebar-right" v-model="yamlSidebarActive" sidebar-class="sidebar-lg" bg-variant="white"
                           title="yaml配置内容" right backdrop shadow width="40%">
                    <b-form class="p-2">
                        <!-- Title -->
                        <b-form-group>
                            <b-row>
                                <b-col md="12">
                                    <codemirror id="yamlContent" ref="yamlContent" v-model="form.content"
                                                :options="cmOptions"></codemirror>
                                </b-col>
                            </b-row>
                        </b-form-group>
                        <!-- Form Actions -->
                    </b-form>
                </b-sidebar>
            </div>
            <!-- table-->
            <div>
                <vue-good-table v-loading="bodyLoading" :columns="columns" :rows="rows" styleClass="vgt-table striped"
                                :search-options="{
		  enabled: true,
		  externalQuery: searchTerm }" :pagination-options="{
		  enabled: true,
		  perPage:pageLength
		}"
                >
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field==='action'">
                                     <feather-icon
                                             :id="`editIcon-${props.row.id}`"
                                             icon="EditIcon"
                                             size="16"
                                             style="cursor: pointer;"
                                             class="mx-1"
                                             @click="showEditModal(2,props.row)"
                                             v-b-tooltip.hover title="编辑"
                                     />
                                       <feather-icon
                                               :id="`deleteIcon-${props.row.id}`"
                                               icon="TrashIcon"
                                               size="16"
                                               style="cursor: pointer;"
                                               class="mx-1"
                                               @click="deletePipeline(props.row.id)"
                                               v-b-tooltip.hover title="删除"
                                       />
                                               <feather-icon
                                                       :id="`viewIcon-${props.row.id}`"
                                                       icon="EyeIcon"
                                                       size="16"
                                                       style="cursor: pointer;"
                                                       class="mx-1"
                                                       @click="showYaml(props.row)"
                                                       v-b-tooltip.hover title="查看yaml"
                                               />
                        </span>
                        <span>
					       {{ props.formattedRow[props.column.field] }}
				        </span>
                    </template>
                    <template slot="pagination-bottom" slot-scope="props">
                        <div class="mx-2 mb-2">
                            <div class="d-flex justify-content-between flex-wrap">
                                <div class="d-flex align-items-center mb-0 mt-1">
						<span class="text-nowrap ">
							共 {{ props.total }} 条，每页显示
						</span>
                                    <b-form-select v-model="pageLength" :options="['5', '10', '20','50']" class="mx-1"
                                                   @input="(value)=>props.perPageChanged({currentPerPage:value})"
                                    />
                                    <span class="text-nowrap"> 条 </span>
                                </div>
                                <div>
                                    <b-pagination :value="1" :total-rows="props.total" :per-page="pageLength"
                                                  first-number
                                                  last-number align="right" prev-class="prev-item"
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
            </div>
        </b-card>
    </div>

</template>
<script>
    import 'vue-form-wizard/dist/vue-form-wizard.min.css'
    import {FormWizard, TabContent} from 'vue-form-wizard'
    import {codemirror} from 'vue-codemirror'
    import 'codemirror/mode/yaml/yaml.js'
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/theme/darcula.css'
    import {
        BCard,
        BSidebar,
    } from 'bootstrap-vue'
    import 'vue-good-table/dist/vue-good-table.css'
    import {VueGoodTable} from 'vue-good-table'
    import {$themeConfig} from '@themeConfig'
    import Ripple from "vue-ripple-directive";
    import {Select} from 'element-ui'
    import {required} from '@validations'
    import {ValidationProvider, ValidationObserver} from 'vee-validate'

    export default {
        inject: ['reload'],
        components: {
            codemirror,
            BCard,
            VueGoodTable,
            Select,
            FormWizard,
            TabContent,
            ValidationProvider,
            ValidationObserver,
            BSidebar
        },
        directives: {
            Ripple,
        },
        data() {
            return {
                bodyLoading: false, // 页面加载状态
                showYamlModal: false,
                yamlSidebarActive: false,
                yamlReadOnly: false,
                projectList: [],
                cmOptions: {
                    // tabSize: 4,
                    mode: 'yaml',
                    theme: 'darcula',
                    lineNumbers: true,
                    line: true,
                    lineWrapping: true,
                    indentUnit: 2,
                    readOnly: this.yamlReadOnly
                    // autofocus: true,
                    // autoRefresh: true
                    // readOnly:true
                },
                searchTerm: '',
                operateType: 1,
                rows: [],
                pageLength: 10,
                page: 1,
                total: 0,
                form: {
                    id: '',
                    name: '',
                    code: '',
                    projectId: '',
                    content: ''
                },
                columns: [
                    {
                        label: '名称',
                        field: 'name',
                        sortable: false
                    },
                    {
                        label: 'code',
                        field: 'code',
                        sortable: false
                    },
                    {
                        label: '应用',
                        field: 'projectId',
                        sortable: false
                    },

                    {
                        label: '创建人',
                        field: 'createUser',
                        sortable: false
                    },
                    {
                        label: '创建时间',
                        field: 'createDate',
                        sortable: false
                    },
                    {
                        label: '操作',
                        field: 'action',
                        sortable: false
                    }

                ],
            }
        },
        created() {
            this.getYamlTemplateList()
        },
        methods: {
            getYamlTemplateList() {
                const that = this
                that.bodyLoading = true
                const _data = {
                    curl: `${$themeConfig.app.projectHttpUrl}/yaml?projectId=` + this.$store.state.myRequest.projectId,
                }
                that.$store.dispatch('httpGet', _data).then(res => {
                    if (res.flag) {
                        that.rows = res.data
                        that.bodyLoading = false
                    } else {
                        that.bodyLoading = false
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
            refreshForm() {
                this.reload()
            },
            showYaml(rowData) {
                this.form.content=''
                this.yamlSidebarActive = true
                this.yamlReadOnly = true
                this.$bvModal.show('yamlContentModal')
                this.form.content = rowData.content
            },
            showEditModal(operateType, rowData) {
                this.yamlReadOnly = false
                this.operateType = operateType
                this.getProjectList()
                this.$bvModal.show('yamlTemplateModal')
                if (operateType === 2) {
                    this.form = {
                        id: rowData.id,
                        name: rowData.name,
                        code: rowData.code,
                        projectId: rowData.projectId,
                        content: rowData.content
                    }
                } else {
                    this.form = {
                        id: '',
                        name: '',
                        code: '',
                        projectId: '',
                        content: ''
                    }
                }
            },
            closeEditModal() {
                this.$bvModal.hide('yamlTemplateModal')
            },
            refreshYaml() {
                this.$refs.yamlCode.refresh();
            },
            saveEditYamlTemplate() {
                this.$refs.yamlRules.validate().then(success => {
                    if (success) {
                        const that = this
                        if (this.operateType === 1) {
                            // 新增
                            this.form.curl = `${$themeConfig.app.projectHttpUrl}/yaml/add`
                            this.$store.dispatch('httpPost', this.form).then(res => {
                                if (res.flag) {
                                    that.$bvModal.hide('yamlTemplateModal')
                                    that.getYamlTemplateList()
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
                            this.form.curl = `${$themeConfig.app.projectHttpUrl}/yaml/update`
                            this.$store.dispatch('httpPut', this.form).then(res => {
                                if (res.flag) {
                                    that.$bvModal.hide('yamlTemplateModal')
                                    that.getYamlTemplateList()
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
                    }
                })
            },
            deletePipeline(id) {
                const that = this
                this.$prompt('您确认要删除吗?如确认删除，请输入"我确认"', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    inputPattern: /^\u6211\u786e\u8ba4$/,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    inputErrorMessage: '输入不正确'
                }).then(async () => {
                    const _data = {
                        curl: `${$themeConfig.app.projectHttpUrl}/yaml/delete/${id}`,
                    }
                    this.$store.dispatch('httpDelete', _data).then(res => {
                        if (res.flag) {
                            that.getYamlTemplateList()
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
            getProjectList() {
                const that = this
                const _data = {
                    curl: `${$themeConfig.app.projectHttpUrl}/project`,
                }
                that.$store.dispatch('httpGet', _data)
                    .then(res => {
                        if (res.flag) {
                            that.projectList = res.data
                        } else {
                            that.projectList = []
                        }
                    })
            },
            validationBase() {
                return new Promise((resolve, reject) => {
                    this.$refs.baseRules.validate()
                        .then(success => {
                            if (success) {
                                resolve(true)
                            } else {
                                reject()
                            }
                        })
                })
            },
        }
    }
</script>
<style lang="scss">
    .modal .modal-header .close {
        transform: translate(0px, 0px) !important;
        box-shadow: 0 5px 20px 0 rgb(255 255 255 / 10%) !important;
        background: transparent !important;
    }

    #yamlCode {
        .CodeMirror {
            overscroll-y: scroll !important;
            height: 400px !important;
        }
    }

    #yamlContent {
        .CodeMirror {
            overscroll-y: scroll !important;
            height: 10% !important;
        }
    }
</style>
