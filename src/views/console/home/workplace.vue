<template>
    <div style="padding-top:60px">
        <b-jumbotron style="background:#fff;margin:10px;padding:2rem">
            <b-row>
                <b-col md="1" style="text-align:center;align-items: center;">
                    <!--  style="display: flex; height: 100%; align-items: center;"  rounded="circle"    -->
                    <b-img 
                        :src="'data:image/png;base64,' + $store.state.myRequest.userInfo.remark" 
                        v-bind="mainProps"
                        rounded="circle"
                        center style="align-items: center;height: 100%;width: 100%;"
                    />
                    <!--  style="bottom: 50%; display: inline-flex; top: 50%; align-items: center;"  -->
                </b-col>
                <b-col md="6">
                    <h2 class="md:text-lg text-md" style="display: flex; height: 100%; align-items: center;">
                        您好, {{ $store.state.myRequest.userInfo.name }}, 开始您一天的工作吧！
                    </h2>
                </b-col>
                <b-col v-if="!unauthorizedUser">
                    <b-row cols="4" style="text-align:center;height: 100%;align-items: center;">
                        <b-col>
                            <h3 style="margin-top: 10px">租户</h3>
                            <p style="color: #1E90F3; margin-bottom: 10px">{{ this.userAuthTotal.project }}</p>
                        </b-col>
                        <b-col>
                            <h3 style="margin-top: 10px">服务</h3>
                            <p style="color: #1E90F3; margin-bottom: 10px">{{ this.userAuthTotal.service }}</p>
                        </b-col>
                        <b-col>
                            <h3 style="margin-top: 10px">告警</h3>
                            <p style="color: #f3691e; margin-bottom: 10px">{{ this.userAuthTotal.warnMsg }}</p>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-jumbotron>

        <div style="margin: 10px;">
            <b-row>
                <b-col>
                    <b-card bg-variant="white">
                        <el-empty description="暂无应用" v-if="unauthorizedUser"></el-empty>
                        <b-row v-else>
                            <b-col cols="4" style="margin: 10px;text-align: left; display: flex">
                                <div style="display: inline; margin-top: 0; margin-right: 20px;">租户</div>
                                <div class="lesseeSelect" style="flex: 1;display: inline;" v-if="$store.state.myRequest.superAdmin">
                                    <el-select v-model="project" size="small" filterable clearable style="width: 270px">
                                        <el-option v-for="(item, index) in projects" :key="index" :value="item.id" :label="item.id + ' ' + item.name"></el-option>
                                    </el-select>
                                </div>
                            </b-col>
                            <b-col style="text-align:right;margin: 10px;">
                                <div class="icon-wrapper icon">
                                    <feather-icon v-if="$store.state.myRequest.superAdmin" size="24" icon="PlusIcon" @click="showEditModal(1)"/>
                                </div>
                            </b-col>
                        </b-row>
                        <div style="margin: 10px;" align="center">
                            <b-row class="mb-3 match-height">
                                <b-col xl="4" md="6" sm="6" v-for="(item, index) in projects" :key="index" v-show="project === item.id || project === ''">
                                    <b-link @click="toProject(item)">
                                        <project-card-vertical
                                            class="project-card"
                                            :color="index%2===0 ? 'success' : 'warning'"
                                            :icon="item.icon ? item.icon : ''"
                                            :project-id="item.id"
                                            :project-name="item.name"
                                            :defender="item.defender"
                                            :defenderName="item.defenderName"
                                            :create-time="item.createTime"
                                            :update-time="item.updateTime"
                                            :projectForm="item"
                                            :super-admin="$store.state.myRequest.superAdmin"
                                            :service-count="allNamespaceData[item.id] ? allNamespaceData[item.id].serviceCount : 0"
                                            :pod-count="allNamespaceData[item.id] ? allNamespaceData[item.id].podCount : 0"
                                        />
                                    </b-link>
                                </b-col>
                            </b-row>
                        </div>
                    </b-card>
                </b-col>
            </b-row>
        </div>

        <!--form-->
        <div>
            <b-modal 
                id="projectForm" 
                centered 
                :title="operateType===1 ?'新增租户':'修改租户'" 
                size="lg"
                hide-footer 
                no-close-on-backdrop 
                no-close-on-es
                modal-class="modal-primary"
            >
                <validation-observer ref="projectRules">
                    <b-form>
                        <b-row>
                            <b-col md="6">
                                <b-form-group label="租户ID" label-for="projectId">
                                    <validation-provider #default="{ errors }" name="projectId" rules="required">
                                        <b-input-group class="input-group-merge">
                                            <b-form-input 
                                                id="projectId" 
                                                v-model="form.id"
                                                :readonly="operateType===2"
                                                :state="errors.length > 0 ? false:null"
                                                placeholder="租户英文简称,只能使用小写字母或数字,连接符号使用-"
                                            />
                                        </b-input-group>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
							<b-col md="6">
							    <b-form-group label="CMDB应用编号" label-for="cmdbAppNo">
							        <el-select v-model="form.cmdbAppNo" placeholder="请选择(必选)" filterable :filter-method="cmdbLimit"  style="width: 100%">
							            <el-option
							                v-for="item in cmdbApps"
							                :key="item.appName"
							                :label="item.appName"
							                :value="item.appNo"
							            >
										<span style="float: left">{{ item.appName }}</span>
										<span style="float: right; color: #8492a6; font-size: 13px">{{ item.appShort }}</span>
							            </el-option>
							        </el-select>
							    </b-form-group>
							</b-col>
                            <b-col md="6">
                                <b-form-group label="租户名称" label-for="projectName">
                                    <validation-provider #default="{ errors }" name="projectName" rules="required">
                                        <b-input-group class="input-group-merge">
                                            <b-form-input id="projectName" v-model="form.name" :state="errors.length > 0 ? false:null" placeholder="租户中文名称"/>
                                        </b-input-group>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <b-form-group label="租户类型" label-for="projectType">
                                    <el-select v-model="form.projectTypeId" placeholder="请选择(必选)" style="width: 100%">
                                        <el-option
                                            v-for="item in typeOptions"
                                            :key="item.label"
                                            :label="item.label"
                                            :value="item.value"
                                        >
										
                                        </el-option>
                                    </el-select>
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <b-form-group label="负责人" label-for="defender">
                                    <el-select 
                                        v-model="form.defender" 
                                        placeholder="请输入姓名/域账号/工号 搜索" 
                                        clearable
                                        filterable
                                        reserve-keyword 
                                        remote 
                                        :remote-method="selectDefender" 
                                        :loading="loading"
                                        @change="changeDefender"
                                        style="width: 100%"
                                    >
                                        <el-option v-for="item in defenderOptions" :key="item.value" :label="item.label" :value="item.value"/>
                                    </el-select>
                                </b-form-group>
                            </b-col>
                            <b-col hidden="true">
                                <b-form-group>
                                    <el-input v-model="form.defenderName"></el-input>
                                </b-form-group>
                            </b-col>
                            <b-col md="12">
                                <b-form-group label="高级功能" label-for="projectName">
                                    <el-switch 
                                        style="height: 100%"
                                        v-model="moreOptions"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        active-value="1"
                                        inactive-value="0"
                                    ></el-switch>
                                </b-form-group>
                            </b-col>
                            <b-col md="6" v-if="moreOptions === '1'">
                                <b-form-group label="CPU" label-for="cpuNum">
                                    <b-input-group class="input-group-merge">
                                        <b-form-input id="cpuNum" v-model="form.cpu" v-number-only placeholder="CPU核数" autocomplete="off" />
                                    </b-input-group>
                                </b-form-group>
                            </b-col>
                            <b-col md="6" v-if="moreOptions === '1'">
                                <b-form-group label="内存" label-for="memory">
                                    <b-input-group class="input-group-merge">
                                        <b-form-input id="memory" v-model="form.memory" v-number-only placeholder="内存大小(GB)" autocomplete="off" />
                                    </b-input-group>
                                </b-form-group>
                            </b-col>
                            <b-col md="6" v-if="moreOptions === '1'">
                                <b-form-group label="存储" label-for="volume">
                                    <b-input-group class="input-group-merge">
                                        <b-form-input id="volume" v-model="form.volume" v-number-only placeholder="磁盘大小(GB)" autocomplete="off" />
                                    </b-input-group>
                                </b-form-group>
                            </b-col>
                            <b-col md="6" v-if="moreOptions === '1'">
                                <b-form-group label="资源" label-for="resource">
                                    <el-select v-model="form.resources" placeholder="共享/独占" style="width: 100%">
                                        <el-option
                                            v-for="item in resourceOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </b-form-group>
                            </b-col>
                            <b-col md="6" v-if="moreOptions === '1'">
                                <b-form-group label="描述" label-for="desci">
                                    <b-input-group class="input-group-merge">
                                        <b-form-input id="desci" v-model="form.desci" placeholder="描述"/>
                                    </b-input-group>
                                </b-form-group>
                            </b-col>
                            <b-col md="6" v-if="moreOptions === '1'">
                                <b-form-group label="aPaas应用id" label-for="paasApplicationId">
                                    <b-input-group class="input-group-merge">
                                        <b-form-input 
                                            id="paasApplicationId" 
                                            v-model="form.apaasApplicationId"
                                            v-number-and-lowercase-only
                                            :readonly=apaasReadonly
                                            placeholder="应用id,小写英文和数字组成"
                                        />
                                    </b-input-group>
                                </b-form-group>
                            </b-col>
                            <b-col md="6" v-if="moreOptions === '1'">
                                <b-form-group label="租户图标" label-for="projectIcon">
                                    <el-select v-model="form.icon" placeholder="请选择icon" style="width: 100%">
                                        <el-option
                                            v-for="item in iconOptions"
                                            :key="item.label"
                                            :label="item.label"
                                            :value="item.label"
                                        >
                                            <feather-icon size="24" :icon="item.label" style="height:32px;float: left"/>
                                            <span> &nbsp;&nbsp; {{ item.label }}</span>
                                        </el-option>
                                    </el-select>
                                </b-form-group>
                            </b-col>
                            <!-- reset and submit -->
                            <b-col cols="12">
                                <b-button type="submit" variant="primary" size="sm" class="mr-1" @click.prevent="saveProject">提交</b-button>
                                <b-button type="button" variant="outline-secondary" size="sm" @click="closeEditModal">取消</b-button>
                            </b-col>
                        </b-row>
                    </b-form>
                </validation-observer>
            </b-modal>
        </div>
    </div>
</template>

<script>
    import { $themeConfig } from '@themeConfig'
    import ProjectCardVertical from './component/card/ProjectCardVertical'
    import {
        ValidationProvider,
        ValidationObserver
    } from 'vee-validate'
    import { required } from '@validations'
    import vSelect from 'vue-select'
    import {Loading} from 'element-ui'
    let cmdbOption = ''
    export default {
        components: {
            ProjectCardVertical,
            ValidationProvider,
            ValidationObserver,
            vSelect
        },
        data: () => ({
            unauthorizedUser: false,
            iconOptions: [
                {label: 'BoxIcon'},
                {label: 'SlackIcon'},
                {label: 'WindIcon'},
                {label: 'ServerIcon'},
                {label: 'CompassIcon'},
                {label: 'ArchiveIcon'},
                {label: 'ChromeIcon'},
                {label: 'FigmaIcon'},
                {label: 'HeartIcon'},
                {label: 'GithubIcon'}
            ],
            userAuthTotal: {},
            mainProps: {
                blank: false,
                blankColor: '#777',
                width: 80,
                height: 80,
                class: 'm1',
            },
            required,
            apaasReadonly: false,
            projectIdReadOnly: false,
            defenderOptions: [],
            defenderObj: {},
            moreOptions: '0',
            superAdmin: false,
            // 1=新增 2=修改
            operateType: 1,
            project: '',
			cmdbApps:[],
            form: {
                id: '',
                name: '',
                cpu: '',
                mail: '',
                memory: '',
                volume: '',
                projectTypeId: '',
				cmdbAppNo:'',
                type: '',
                defender: '',
                defenderName: '',
                resources: null,
                enableApaas: 0,
                apaasApplicationId: '',
                desci: '',
                icon: ''
            },
            loading: false,
            selected: {title: 'Square'},
            typeOptions: [
                {
                    label: '1级应用',
                    value: '1'
                }, {
                    label: '2级应用',
                    value: '2'
                }, {
                    label: '3级应用',
                    value: '3'
                }, {
                    label: '4级应用',
                    value: '4'
                }
            ],
            typeValue: '',
            resourceOptions: [
                {
                    value: false,
                    label: '共享',
                }, {
                    value: true,
                    label: '独占'
                }
            ],
            resourceValue: '',
            projects: [],
            allNamespaceData: {},
            siteTraffic: {
                series: [{
                    name: 'Traffic Rate',
                    data: [150, 200, 125, 225, 200, 250],
                }],
            }
        }),

        created() {
            // this.superAdmin = this.$store.state.myRequest.superAdmin
            // console.log(this.superAdmin)
            this.getUserProject()
            this.getAllNamespaceData()
            this.getUserAuth()
			this.getCmdbApps()
        },
        methods: {
            changeDefender(value) {
                for (var i of this.defenderOptions) {
                    if (i.value === value) {
                        this.form.defenderName = i.name
                    }
                }
            },
            getUserProject() {
                let _data = {
                    curl: $themeConfig.app.projectHttpUrl + '/project'
                }
                this.$store.dispatch('httpGet', _data).then(res => {
                    this.projects = res.data
                    if (res.code === 202061) {
                        this.unauthorizedUser = true
                    }
                })
            },
			getCmdbApps() {
			    let _data = {
			        curl: $themeConfig.app.projectHttpUrl + '/cmdb/apps'
			    }
			    this.$store.dispatch('httpGet', _data).then(res => {
			        cmdbOption = res.data
					this.cmdbApps = cmdbOption.slice(0,10)
			    })
			},

           cmdbLimit(query){
			   if(query=== ''){
				   this.cmdbApps = cmdbOption.slice(0,10)
			   }else{
				   let result = []
				   cmdbOption.forEach(e=>{
					   if(result.length >= 10 ){
						   return
					   }
					   if(e.appShort.indexOf(query) != -1 || e.appName.indexOf(query) != -1){
						   result.push(e)
					   }
				   })
				   this.cmdbApps = result
			   }
		   },

            // 获取服务数量和实例数量
            getAllNamespaceData() {
                let _data = {
                    curl: $themeConfig.app.projectHttpUrl + '/project/allNamespaceData'
                }
                this.$store.dispatch('httpGet', _data).then(res => {
                    this.allNamespaceData = res.data.data
                })
            },
            toProject(item) {
                this.$store.commit('getProjectId', item.id)
				this.$store.commit('cmdbAppNo', item.cmdbAppNo)
                this.$store.commit('modalId', '1435833682391838720')
                this.$router.push({
                    path: '/project'
                })
            },
            closeEditModal() {
                this.$bvModal.hide('projectForm')
            },
            showEditModal(operateType, projectData) {
                this.moreOptions = '0'
                this.operateType = operateType
                if (operateType == 1) {
                    this.apaasReadonly = false
                    this.form = {
                        id: '',
                        name: '',
                        cpu: '',
                        mail: '',
                        memory: '',
                        volume: '',
                        projectTypeId: '',
                        type: '',
                        defender: '',
						cmdbAppNo: '',
                        resources: null,
                        enableApaas: 0,
                        apaasApplicationId: '',
                        desci: '',
                        icon: ''
                    }
                } else {
                    if (projectData.apaasApplicationId !== null && projectData.apaasApplicationId !== '') {
                        this.apaasReadonly = true
                    }
                    this.form = {
                        id: projectData.id,
                        name: projectData.name,
                        cpu: projectData.cpu,
                        mail: projectData.mail,
                        memory: projectData.memory,
                        volume: projectData.volume,
                        projectTypeId: projectData.projectTypeId,
                        type: projectData.type,
                        defender: projectData.defender,
                        resources: projectData.resoureces,
                        enableApaas: projectData.enableApaas,
                        apaasApplicationId: projectData.apaasApplicationId,
                        desci: projectData.desci,
						cmdbAppNo: projectData.cmdbAppNo,
                        icon: projectData.icon
                    }
                }
                this.$bvModal.show('projectForm')
            },
            selectDefender(query) {
                const that = this
                if (query !== '') {
                    that.loading = true
                    setTimeout(() => {
                        that.loading = false
                        this.getDefenderList(query)
                    }, 300)
                } else {
                    that.defenderOptions = []
                }
            },
            getDefenderList(query) {
                const that = this
                const _data = {
                    curl: `${$themeConfig.app.projectHttpUrl}/project/getAllUserByAssociated`,
                    param: query,
                    page: 1,
                    size: 10,
                }
                this.$store.dispatch('httpGet', _data).then(res => {
                    if (res.flag || res.data.rows.size !== 0) {
                        that.defenderOptions = []
                        const userList = res.data.rows
                        for (const item of userList) {
                            const data = {
                                value: item.domain_account,
                                label: `${item.real_name} ${item.domain_account}`,
                                name: item.real_name
                            }
                            that.defenderObj[item.domain_account] = item.email
                            that.defenderOptions.push(data)
                        }
                    } else {
                        that.defenderOptions = []
                    }
                })
            },
            saveProject() {
                if (this.form.icon === '') {
                    this.form.mail = this.defenderObj[this.form.defender]
                    let index = Math.floor(Math.random() * this.iconOptions.length)
                    this.form.icon = this.iconOptions[index].label
                }
                if (this.form.apaasApplicationId) {
                    this.form.enableApaas = 1
                }
                console.log(this.form)
                this.$refs.projectRules.validate().then(success => {
                    if (success) {
                        let idPattern = /([A-Z!#$% &'()*,:;{|}~^_`\/\. "])/
                        if (idPattern.test(this.form.id)) {
                            this.$message.error("租户ID格式校验错误,请勿使用大写字母和\"-\"以外的特殊字符")
                            return
                        }
                        if (!this.form.projectTypeId) {
                            this.$message.error("租户类型不能为空")
                            return
                        }
                        if (!this.form.defender) {
                            this.$message.error('负责人不能为空')
                            return
                        }
                        if (this.operateType === 1) {
                            this.createProject()
                        } else {
                            this.updateProject()
                        }
                        this.closeEditModal()
                    }
                })
            },
            getUserAuth() {
                const that = this
                const _data = {
                    curl: `${$themeConfig.app.projectHttpUrl}/project/userAuthTotal`
                }
                this.$store.dispatch('httpGet', _data).then(res => {
                    if (res.flag) {
                        that.userAuthTotal = res.data
                    }
                })
            },
            createProject() {
                this.form.curl = `${$themeConfig.app.projectHttpUrl}/project`
                let loadingInstance = Loading.service({
                    text: '正在提交...'
                })
                this.$store.dispatch('httpPost', this.form).then(res => {
                    this.$nextTick(() => {
                        loadingInstance.close()
                    })
                    if (res.flag) {
                        this.getUserProject()
                        this.$bvToast.toast('添加成功', {
                            title: '操作提示',
                            toaster: 'b-toaster-top-center',
                            solid: true,
                            variant: 'success',
                            autoHideDelay: 2000
                        })
                    } else {
                        this.$bvToast.toast(res.message, {
                            title: '操作提示',
                            toaster: 'b-toaster-top-center',
                            solid: true,
                            variant: 'danger',
                            autoHideDelay: 2000
                        })
                    }
                })
            },
            updateProject() {
                this.form.curl = `${$themeConfig.app.projectHttpUrl}/project/` + this.form.id
                let loadingInstance = Loading.service({
                    text: '正在提交...'
                })
                this.$store.dispatch('httpPut', this.form).then(res => {
                    this.$nextTick(() => {
                        loadingInstance.close()
                    })
                    if (res.flag) {
                        this.getUserProject()
                        this.$bvToast.toast('修改成功', {
                            title: '操作提示',
                            toaster: 'b-toaster-top-center',
                            solid: true,
                            variant: 'success',
                            autoHideDelay: 2000,
                        })
                    } else {
                        this.$bvToast.toast(res.message, {
                            title: '操作提示',
                            toaster: 'b-toaster-top-center',
                            solid: true,
                            variant: 'danger',
                            autoHideDelay: 2000,
                        })
                    }
                })
            },
            removeProject(projectId) {
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
                        curl: `${$themeConfig.app.projectHttpUrl}/project/` + projectId,
                    }
                    this.$store.dispatch('httpDelete', _data).then(res => {
                        if (res.flag) {
                            that.getUserProject()
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
            }
        },
        directives: {
            // v-number-only
            numberOnly: {
                bind: function (el) {
                    el.handler = function () {
                        el.value = el.value.replace(/\D+/, '')
                    }
                    el.addEventListener("input", el.handler)
                },
                unbind: function (el) {
                    el.removeEventListener("input", el.handler)
                }
            },
            // v-number-and-lowercase-only
            numberAndLowercaseOnly: {
                bind: function (el) {
                    el.handler = function () {
                        el.value = el.value.replace(/[^a-z0-9]+$/, '')
                    }
                    el.addEventListener("input", el.handler)
                },
                unbind: function (el) {
                    el.removeEventListener("input", el.handler)
                }
            }
        }
    }
</script>

<style lang="scss">
    @import '~@core/scss/vue/libs/vue-select.scss';

    .icon-wrapper.icon {
        .feather:hover {
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background-color: #e6e9ea;
        }
    }

    .project-card {
        margin: 5px;
        border: 1px solid #d8dbdb;
    }

    .project-card:hover {
        margin: 5px;
        border: 1px solid #7289fa;
        background-color: #eef1f6;
        font-weight: bold;
    }

    .vgt-left-align {
        vertical-align: revert !important;
        color: #606266;
    }

    .modal .modal-header .close {
        transform: translate(0px, 0px) !important;
        box-shadow: 0 5px 20px 0 rgb(255 255 255 / 10%) !important;
        background: transparent !important;
    }

    // .lesseeSelect .el-select {
    //     // display: block;
    //     // min-width: 200px;
    //     width: 270px;
    // }
</style>
