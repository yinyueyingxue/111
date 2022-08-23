<template>
  <b-card no-body>
    <div class="m-2">
      <!-- Table Top -->
      <b-row>
        <!-- Per Page -->
        <b-col cols="12" md="8" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
          <b-button variant="primary" @click="showEditModal(1)">
            <i class="el-icon-plus"/>新建流水线
          </b-button>
        </b-col>

        <!-- Search -->
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
          id="pipelineForm"
          centered
          :title="operateType===1 ?'新增流水线':'修改流水线'"
          size="lg"
          hide-footer
          no-close-on-backdrop
          no-close-on-es
          modal-class="modal-primary"
          @hidden="reloadForm"
          ref="pipelineFormRef"
      >
        <form-wizard
            color="#2289f1"
            :title="null"
            :subtitle="null"
            shape="tab"
            finish-button-text="提交"
            back-button-text="上一步"
            next-button-text="下一步"
            @on-complete="saveEditPipeline(operateType)"
        >
          <!-- ci details tab -->
          <tab-content title="编译配置" :before-change="validationCI">
            <validation-observer ref="CIRules" tag="form">
              <b-row>
                <b-col cols="12" class="mb-2">
                  <small class="text-muted">
                    基础配置
                  </small>
                </b-col>
                <b-col md="12">
                  <b-form-group label="服务" label-for="service">
                    <validation-provider #default="{ errors }" name="service" rules="required">
                      <!-- <b-form-select
                              id="service"
                              v-model="form.service"
                              :disabled="serviceDisabled"
                              :options="serviceOptions"
                              :state="errors.length > 0 ? false:null"
                              @change="changeService"
                              value-field="id"
                              text-field="id"
                      > -->
                      <b-form-select
                          id="service"
                          v-model="form.service"
                          :disabled="serviceDisabled"
                          :state="errors.length > 0 ? false:null"
                          @change="changeService"
                          value-field="id"
                      >
                        <b-form-select-option v-for="serviceItem in serviceOptions" :key="serviceItem.id"
                                              :value="serviceItem.id">{{ serviceItem.id + ' ' + serviceItem.name }}
                        </b-form-select-option>
                      </b-form-select>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="12">
                  <b-form-group label="模式" label-for="codeSource">
                    <b-form-select
                        id="codeSource"
                        @change="changeCodeSource"
                        v-model="form.codeSource"
                        :options="codeSourceOptions"
                        value-field="value"
                        text-field="label"
                    ></b-form-select>
                  </b-form-group>
                </b-col>
                <b-col cols="12" class="mb-2">
                  <small class="text-muted">
                    代码相关配置
                  </small>
                </b-col>
                <b-col md="12">
                  <b-form-group label="镜像地址" label-for="mirrorAddress" v-if="form.codeSource===2">
                    <validation-provider #default="{ errors }" name="mirrorAddress"
                                         rules="required">
                      <b-form-input
                          id="mirrorAddress"
                          v-model="form.mirrorAddress"
                          :state="errors.length > 0 ? false:null"
                          placeholder="请填写镜像地址"
                      />
                      <b-tooltip target="mirrorAddress" placement="topright">
                        请输入完整的镜像地址,目前仅支持eos平台的nexus仓库
                      </b-tooltip>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="12">
                  <b-form-group label="模板" label-for="template" v-if="form.codeSource===1">
                    <el-cascader
                        aria-required="true"
                        id="template"
                        v-model="templateArray"
                        @change="changeDomain"
                        :disabled="templateDisabled"
                        :options="templateOptions"
                        :props="{ expandTrigger: 'hover' }"
                        style="width: 100%"
                        placeholder="请选择开发语言模板"
                    ></el-cascader>
                    <b-tooltip target="template" placement="topright">
                      根据服务开发语言及sdk版本选择对应的模板
                    </b-tooltip>
                  </b-form-group>
                </b-col>
                <b-col md="12">
                  <b-form-group label="代码地址" label-for="codeUrl" v-if="form.codeSource===1">
                    <validation-provider #default="{ errors }" name="codeUrl" rules="required">
                      <b-form-input
                          id="codeUrl"
                          v-model="form.codeUrl"
                          :state="errors.length > 0 ? false:null"
                          placeholder="请填写代码仓库地址"
                      />
                      <b-tooltip target="codeUrl" placement="topright">
                        git仓库地址,http://oauth2:{accesstoken}@10.63.32.225/eos-demos/demoTest.git,需要生成accesstoken配置在代码地址前面
                        svn填写完整的仓库地址,并联系管理员配置svn仓库的账密信息
                      </b-tooltip>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="分支/标签" label-for="branch" v-if="form.codeSource===1">
                    <validation-provider #default="{ errors }" name="branch" rules="required">
                      <b-form-input
                          id="branch"
                          v-model="form.branch"
                          :state="errors.length > 0 ? false:null"
                          placeholder="请输入代码分支或标签"
                      />
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="版本" label-for="version" v-if="form.codeSource===1">
                    <validation-provider #default="{ errors }" name="version" rules="required">
                      <b-form-input
                          id="version"
                          v-model="form.version"
                          :disabled="serviceDisabled"
                          :state="errors.length > 0 ? false:null"
                          placeholder="请输入版本号,建议使用v1/v2/v3..."
                      />
                      <b-tooltip target="version" placement="topright">
                        代码打包后的版本号,推荐使用v1/v2/v3...形式
                      </b-tooltip>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="12">
                  <b-form-group label="默认目录" label-for="defaultFolder"
                                v-if="templateArray.length > 0 && templateArray[0]==='html'&&templateArray[1]!=='template-eos-git-web-pod'">
                    <b-form-input id="defaultFolder1" v-model="form.defaultFolder"
                                  placeholder="请填写默认目录,例如/test"/>
                    <b-tooltip target="defaultFolder1" placement="topright">
                      请填写存放静态页面的目录名称,例如/test
                    </b-tooltip>
                  </b-form-group>
                  <b-form-group label="启动目录" label-for="defaultFolder"
                                v-if="templateArray.length > 0 && templateArray[0]==='donetcore'">
                    <b-form-input id="defaultFolder2" v-model="form.defaultFolder"
                                  placeholder="请填写启动目录,例如test/"/>
                    <b-tooltip target="defaultFolder2" placement="topright">
                      请填写donetcore项目启动目录,例如test/
                    </b-tooltip>
                  </b-form-group>
                  <b-form-group label="启动目录" label-for="defaultFolder"
                                v-if="form.codeSource === 1 &&templateArray.length > 0 && templateArray[0]==='java'">
                    <b-form-input id="defaultFolder3" v-model="form.defaultFolder"
                                  placeholder="多模块项目,请填写启动目录,例如/test"/>
                    <b-tooltip target="defaultFolder3" placement="topright">
                      多模块项目,请填写启动目录,例如/test
                    </b-tooltip>
                  </b-form-group>
                </b-col>
                <b-col cols="12" class="mb-2"
                       v-if="form.codeSource===1 && (templateArray.length >0 && (templateArray[0]==='java' || templateArray[0]==='donetcore'))">
                  <small class="text-muted">检查配置</small>
                </b-col>
                <b-col md="6">
                  <b-form-group label="质量检查" label-for="enableSonarTest"
                                v-if="form.codeSource===1 && (templateArray.length >0 && (templateArray[0]==='java' || templateArray[0]==='donetcore'))">
                    <b-form-checkbox
                        v-model="form.enableSonarTest"
                        :value=1
                        :unchecked-value=0
                        class="custom-control-success"
                        name="enableSonarTest"
                        switch
                    />
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="单元测试" label-for="enableUnitTest"
                                v-if="form.codeSource===1 && (templateArray.length >0 && (templateArray[0]==='java' || templateArray[0]==='donetcore'))">
                    <b-form-checkbox
                        v-model="form.enableUnitTest"
                        :value=1
                        :unchecked-value=0
                        class="custom-control-success"
                        name="enableUnitTest"
                        switch
                    />
                  </b-form-group>
                </b-col>
                <b-col md="12">
                  <b-form-group label="单元测试目录" label-for="unitTestFolder"
                                v-if="form.codeSource===1 && (templateArray[0]==='donetcore' && form.enableUnitTest===1)">
                    <b-form-input id="unitTestFolder" v-model="form.unitTestFolder"
                                  placeholder="netcore服务请填写单元测试目录路径,以/结尾"/>
                  </b-form-group>
                </b-col>
              </b-row>
            </validation-observer>
          </tab-content>

          <!-- cd details tab -->
          <tab-content title="部署配置" :before-change="validationCD">
            <validation-observer ref="CDRules" tag="form">
              <b-row>
                <b-col cols="12" class="mb-2">
                  <small class="text-muted">资源配置</small>
                </b-col>
                <b-col md="6">
                  <b-form-group label="节点数" label-for="replicas">
                    <b-form-input id="replicas" type="number" v-model="form.replicas"/>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="cpu" label-for="cpu">
                    <b-input-group append="Core">
                      <b-form-input id="cpu" v-model="form.cpu" type="number"/>
                    </b-input-group>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="内存" label-for="memory">
                    <b-input-group append="Gib">
                      <b-form-input id="memory" v-model="form.memory" type="number"/>
                    </b-input-group>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="存储" label-for="volume">
                    <b-input-group append="Gib">
                      <b-form-input id="volume" v-model="form.volume" type="number"/>
                    </b-input-group>
                  </b-form-group>
                </b-col>

                <b-col cols="12" class="mb-2">
                  <small class="text-muted">部署环境配置</small>
                </b-col>
                <b-col md="6">
                  <b-form-group label="所属集群" label-for="cluster">

                                        <validation-provider #default="{ errors }" name="cluster" rules="required">
                                            <b-form-select
                                                    id="cluster"
                                                    v-model="form.cluster"
                                                    :options="clusterOptions"
                                                    :state="errors.length > 0 ? false:null"
                                                    value-field="clusterId"
                                                    text-field="clusterName"
                                            ></b-form-select>
                                        </validation-provider>
                                    </b-form-group>
                                </b-col>
                                <b-col md="6">
                                    <b-form-group label="发布网关" label-for="kongType">
                                        <validation-provider #default="{ errors }" name="kongType" rules="required">
                                            <b-form-select
                                                    id="kongType"
                                                    v-model="form.kongType"
                                                    :options="kongTypeOptions"
                                                    :state="errors.length > 0 ? false:null"
                                                    value-field="kongCode"
                                                    text-field="kongName"
                                            ></b-form-select>
                                        </validation-provider>
                                    </b-form-group>
                                </b-col>
                                <b-col md="6">
                                    <b-form-group label="网关IP" label-for="kongIP">
                                        <small id="kongIP" class="text-muted">{{kongIP}}</small>
                                    </b-form-group>
                                </b-col>
                                <b-col md="6">
                                    <b-form-group label="部署节点标签" label-for="label">
                                        <b-form-input
                                                v-model="form.label"
                                                placeholder="服务部署节点标签,无特殊需求不用填写"
                                        >
                                        </b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="12" class="mb-2"
                                       v-if="templateArray.length>0 && (templateArray[0]!=='vue'&& templateArray[0]!=='html')">
                                    <small class="text-muted">监控配置</small>
                                </b-col>
                                <b-col md="6">
                                    <b-form-group label="健康检查接口配置" label-for="healthyApi"
                                                  v-if="templateArray.length>0 && (templateArray[0]!=='vue'&& templateArray[0] !=='html')">
                                        <b-form-input v-model="form.healthyApi" id="healthyApi">
                                        </b-form-input>
                                        <b-tooltip target="healthyApi" placement="topright">
                                            默认健康检查接口为/healthy,如有自定义需求请先自行填写
                                        </b-tooltip>
                                    </b-form-group>
                                </b-col>
                                <b-col md="6">
                                    <b-form-group label="链路追踪监控" label-for="enableSkyWalkingAgent"
                                                  v-if="templateArray.length>0 && (templateArray[0]!=='vue'&&templateArray[0]!=='html')">
                                        <b-form-checkbox
                                                v-model="form.enableSkyWalkingAgent"
                                                value="1"
                                                unchecked-value="0"
                                                class="custom-control-success"
                                                name="enableSkyWalkingAgent"
                                                switch
                                        />
                                    </b-form-group>
                                </b-col>
                                <b-col cols="12" class="mb-2">
                                    <small class="text-muted">发布配置</small>
                                </b-col>
                                <b-col md="6">
                                    <b-form-group label="域名" label-for="domain"
                                                  v-if="form.codeSource===2||templateArray[0]!=='html'||templateArray[1]==='template-eos-git-web-pod'">

										<!-- 	<validation-provider #default="{ errors }" name="domain"   rules="positive|required">
											    <b-form-select
											            id="cluster"
														placeholder="请选择(必选)"
														filterable
											            v-model="form.domain"
											            :options="cmdbDns"
											            :state="errors.length > 0 ? false:null"
											            value-field="name"
											            text-field="name"
											    ></b-form-select>
											</validation-provider> -->
							<!--
                                       <validation-provider #default="{ errors }" name="domain"
                                                             rules="positive|required">
										     <b-form-select
										             id="kongType"
										             v-model="form.domain"
										             :options="cmdbDns"
										             :state="errors.length > 0 ? false:null"
										             value-field="name"
										             text-field="name"
													 filterable
										     ></b-form-select> -->


											  <el-autocomplete
											       class="inline-input"
											       v-model="form.domain"
												   value-key="name"
												   style="width: 100%"
											       :fetch-suggestions="queryDnsSearch"
											       placeholder="请选择(必选)"
											     ></el-autocomplete>
										   <!-- <el-select v-model="form.domain" placeholder="请选择(必选)" filterable  style="width: 100%">
										        <el-option
										            v-for="item in cmdbDns"
										            :key="item.name.substring(0,item.name.length-1)"
										            :label="item.name.substring(0,item.name.length-1)"
										            :value="item.name.substring(0,item.name.length-1)"
										        >
										        </el-option>
										    </el-select>   -->
                                        <!-- </validation-provider>  -->
                                    </b-form-group>
                                </b-col>
                                <b-col md="6">
                                    <b-form-group label="发布路由" label-for="route"
                                                  v-if="(form.codeSource === 2 && serviceType === 2) || (form.codeSource === 1 &&templateArray[0] === 'java') || templateArray[0] === 'donetcore'">
                                        <validation-provider #default="{ errors }" name="route" rules="required">
                                            <b-form-input
                                                    v-model="form.route"
                                                    id="route"
                                                    placeholder="请填写后端服务的发布路由"
                                                    :state="errors.length > 0 ? false:null"
                                            >
                                            </b-form-input>
                                        </validation-provider>
                                    </b-form-group>
                                </b-col>
                                <b-col md="6">
                                    <b-form-group label="端口号" label-for="port"
                                                  v-if="form.codeSource===2||templateArray[0]==='java'||templateArray[0]==='donetcore'">
                                        <b-form-input
                                                v-model="form.port"
                                                id="port"
                                                placeholder="请填写后端服务的端口号,默认8020"
                                        >
                                        </b-form-input>
                                        <b-tooltip target="port" placement="topright">
                                            请填写后端服务的端口号,默认8020
                                        </b-tooltip>
                                    </b-form-group>
                                </b-col>
                                <b-col md="12">
                                    <b-form-group label="yaml模板" label-for="yamlTemplateId">
                                        <b-form-select
                                                id="yamlTemplateId"
                                                v-model="form.yamlTemplateId"
                                                :options="yamlTemplateOptions"
                                                value-field="id"
                                                text-field="name"
                                        ></b-form-select>
                                        <b-tooltip target="yamlTemplateId" placement="topright">
                                            无特殊部署需求,不需要选择yaml模板
                                        </b-tooltip>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </validation-observer>
                    </tab-content>

          <tab-content title="环境变量">
            <b-row>
              <b-col md="5" class="envClass">
                <h5>变量名称</h5>
              </b-col>
              <b-col md="5" class="envClass">
                <h5>变量值</h5>
              </b-col>
              <b-col md="2" class="envClass">
                <b-button size="sm" @click="repeatAgain" v-ripple.400="'rgba(40, 199, 111, 0.15)'"
                          variant="flat-success">
                  <feather-icon icon="PlusIcon"/>
                </b-button>
              </b-col>
              <b-col md="12">
                <b-row v-for="(item, index) in items" :id="item.id" :key="item.id" ref="row">

                  <!-- Item Name -->
                  <b-col md="5">
                    <b-form-group>
                      <b-form-input id="envName" placeholder="变量名称"
                                    v-model="form.envKeyList[index]"/>
                    </b-form-group>
                  </b-col>
                  <b-col md="5">
                    <b-form-group>
                      <b-form-input id="envValue" v-model="form.envValueList[index]"
                                    placeholder="变量值"/>
                    </b-form-group>
                  </b-col>
                  <!-- Remove Button -->
                  <b-col md="2" style="text-align: center;">
                    <b-button
                        size="sm"
                        @click="removeItem(index)"
                        v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                        variant="flat-danger"
                    >
                      <feather-icon icon="MinusIcon" class="mr-25"/>
                    </b-button>
                  </b-col>
                  <b-col cols="12">
                    <hr>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </tab-content>

          <!-- info details tab  -->
          <tab-content title="流水线信息" :before-change="validationPipelineInfo">
            <validation-observer ref="pipelineInfoRules" tag="form">
              <b-row>
                <b-col cols="12" class="mb-2">
                  <!-- <h5 class="mb-0">流水线信息</h5> -->
                  <small class="text-muted">流水线相关描述信息</small>
                </b-col>
                <b-col md="12">
                  <b-form-group label="负责人" label-for="defender">
                    <el-select
                        id="defender"
                        v-model="form.defender"
                        placeholder="流水线负责人"
                        clearable
                        filterable
                        reserve-keyword
                        remote
                        @change="changeDefender"
                        :remote-method="selectDefender"
                        :loading="loading"
                        style="width: 100%"
                    >
                      <el-option v-for="item in defenderOptions" :key="item.value"
                                 :label="item.label" :value="item.value"/>
                    </el-select>
                    <b-tooltip target="defender" placement="topright">输入关键词进行搜索</b-tooltip>
                  </b-form-group>
                </b-col>
                <b-col hidden>
                  <b-form-group label="负责人">
                    <el-input v-model="form.defenderName"></el-input>
                  </b-form-group>
                </b-col>
                <b-col md="12">
                  <b-form-group label="描述" label-for="desci">
                    <b-form-textarea id="desci" v-model="form.desci" rows="3"/>
                  </b-form-group>
                </b-col>
              </b-row>
            </validation-observer>
          </tab-content>
        </form-wizard>
        <!-- </b-sidebar> -->
      </b-modal>
    </div>
    <div>
      <b-modal id="imagePublishModal" centered title="从历史镜像发布" hide-footer no-close-on-backdrop no-close-on-es
               modal-class="modal-primary">
        <b-form>
          <b-row>
            <b-col cols="12">
              <b-form-group label="镜像版本号" label-for="imageVersion">
                <b-input-group class="input-group-merge">
                  <b-form-select
                      id="imageVersion"
                      v-model="imageVersionSelect"
                      :options="imageVersionOptions"
                      value-field="value"
                      text-field="label"
                  ></b-form-select>
                </b-input-group>
              </b-form-group>
            </b-col>
            <!-- reset and submit -->
            <b-col cols="12">
              <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  type="submit"
                  variant="primary"
                  size="sm"
                  class="mr-1"
                  @click.prevent="runPipeline(selectPipeline.id,imageVersionSelect.pipeline,imageVersionSelect.imageVersion,bpmId)"
              >确认
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </b-modal>
    </div>
    <div>
      <b-modal id="deployModal" centered title="扩缩节点" hide-footer no-close-on-backdrop no-close-on-es
               modal-class="modal-primary">
        <b-form>
          <b-row>
            <b-col cols="12">
              <b-form-group label="节点数">
                <b-input-group class="input-group-merge">
                  <b-form-spinbutton id="demo-sb" v-model="form.replicas" min="1"
                                     max="10"></b-form-spinbutton>
                </b-input-group>
              </b-form-group>
            </b-col>
            <!-- reset and submit -->
            <b-col cols="12">
              <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  type="submit"
                  variant="primary"
                  size="sm"
                  class="mr-1"
                  @click.prevent="updateDeploy(selectPipeline.id)"
              >确认
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </b-modal>
    </div>
    <div>
      <b-modal id="bpmModel" centered title="bpm电子流变更审批" hide-footer no-close-on-backdrop no-close-on-es
               modal-class="modal-primary">
        <b-form>
          <b-row>
            <b-col cols="12">
              <b-form-group label="变更单号" label-for="bpmId">
                <b-input-group class="input-group-merge">
                  <b-form-input v-model="bpmId"/>
                </b-input-group>
                <b-form-input hidden="true" v-model="bpmType"/>
                <b-form-input hidden="true" v-model="selectRowData"/>
              </b-form-group>

            </b-col>
            <!-- reset and submit -->
            <b-col cols="12">
              <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  type="submit"
                  variant="primary"
                  size="sm"
                  class="mr-1"
                  @click.prevent="checkBpm(bpmId,bpmType)"
              >确认
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </b-modal>
    </div>
    <!-- table -->
    <div class="tableHeight">
      <vue-good-table
          v-loading="bodyLoading"
          :columns="columns"
          :rows="rows"
          styleClass="vgt-table striped"
          :search-options="{ enabled: true, externalQuery: searchTerm }"
          :pagination-options="{ enabled: true, perPage:pageLength }"
          @on-row-click="rowClicked"
      >
        <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field==='name'" @click.stop="toPath(props.row.id)" style="color: #409efe;"
                          class="topipelineDetails">
                          <!-- <b-link :to="{ path: '/project/pipeline/details?id='+props.row.id}" class="font-weight-bold">
                              {{ props.row.name }}
                          </b-link> -->
                           {{ props.row.name }}
                    </span>
          <span v-else-if="props.column.field==='type'">
                        <b-badge pill :variant="props.row.type===1?'success':'primary'">
                            {{ props.row.type === 1 ? '前端流水线' : '后端流水线' }}
                        </b-badge>
                    </span>
          <span v-else-if="props.column.field==='defender'">
                       {{ props.row.defenderName === null ? '' : props.row.defenderName }}  {{ props.row.defender }}
                    </span>
          <span v-else-if="props.column.field==='codeSource'">
                        <b-badge :variant="props.row.codeSource===1?'light-secondary':'light-warning'">
                            {{ props.row.codeSource === 1 ? '代码仓库' : '镜像地址' }}
                        </b-badge>
                    </span>
          <span v-else-if="props.column.field === 'action'">
                         <feather-icon
                             :id="`runPipelineIcon-${props.row.id}`"
                             icon="PlayIcon"
                             size="16"
                             class="mx-1"
                             style="cursor: pointer;"
                             @click.stop="runPipelineBpm(props.row.id,props.row.name,'',props.row.workStatus)"
                             v-b-tooltip.hover title="执行"
                         />
            <!--                             @click.stop="runPipeline(props.row.id,props.row.name,'',props.row.workStatus)"-->
                        <feather-icon
                            :id="`historyIcon-${props.row.id}`"
                            icon="ClockIcon"
                            size="16"
                            class="mx-1"
                            style="cursor: pointer;"
                            @click.stop="showHistory(props.row)"
                            v-b-tooltip.hover title="发布历史"
                        />
                        <span>
                            <b-dropdown variant="link" toggle-class="text-decoration-none" no-caret>
                                <template v-slot:button-content>
                                    <feather-icon icon="MoreVerticalIcon" size="16"
                                                  class="text-body align-middle mr-25"/>
                                </template>
                                <b-dropdown-item @click.stop="showEditModal(2,props.row)">
                                    <feather-icon icon="EditIcon" class="mr-50"/>
                                    <span>编辑</span>
                                </b-dropdown-item>
                                    <b-dropdown-item @click.stop="deletePipeline(props.row)">
                                    <feather-icon icon="TrashIcon" class="mr-50"/>
                                    <span>删除</span>
                                </b-dropdown-item>
                                    <!-- <b-dropdown-item @click.stop="showDeployBpm(props.row)">
                                    <feather-icon icon="CompassIcon" class="mr-50"/>
                                    <span>扩缩节点</span>
                                </b-dropdown-item> -->
                                <b-dropdown-item @click.stop="showHisPipelineBpm(props.row)">
                                    <feather-icon icon="PlayCircleIcon" class="mr-50"/>
                                    <span>从历史镜像执行</span>
                                </b-dropdown-item>
                            </b-dropdown>
                        </span>
				     </span>
          <span v-else>
					{{ props.formattedRow[props.column.field] }}
				</span>
        </template>
        <template slot="pagination-bottom" slot-scope="props">
          <div class="mx-2 mb-2">
            <div class="d-flex justify-content-between flex-wrap">
              <div class="d-flex align-items-center mb-0 mt-1">
                <span class="text-nowrap ">共 {{ props.total }} 条，每页显示</span>
                <b-form-select v-model="pageLength" :options="['5', '10','20','50']" class="mx-1"
                               @input="(value)=>props.perPageChanged({currentPerPage:value})"/>
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
    </div>
  </b-card>
</template>

<script>
import 'vue-good-table/dist/vue-good-table.css'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import {FormWizard, TabContent} from 'vue-form-wizard'
import {heightTransition} from '@core/mixins/ui/transition'
import {
  BCard,
  BSidebar,
  BPopover,
  BRow,
  BCol,
  BInputGroup,
  BInputGroupPrepend,
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BAvatar,
  BBadge,
  BPagination,
  BDropdown,
  BDropdownItem,
  ModalPlugin
} from 'bootstrap-vue'
import {
  $themeConfig
} from '@themeConfig'
import {
  VueGoodTable
} from 'vue-good-table'
import store from '@/store'
import Ripple from 'vue-ripple-directive'
import {required} from '@validations'
import {ValidationProvider, ValidationObserver, extend} from 'vee-validate'
import {Message, Popover, Select, Cascader, Popconfirm} from 'element-ui'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import {Loading} from "element-ui"
// 自定义校验规则
// 域名校验规则
extend('positive', {
  validate(value) {
    var reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/
    return reg.test(value)
  },
  // 字符串占位符, 占位符内容由ValidationProvider组件name参数提供
  message: '域名格式不正确'
});
export default {
  name: 'pipeline',
  inject: ['reload'],
  mixins: [heightTransition],
  components: {
    BCard,
    Popconfirm,
    Cascader,
    FormWizard,
    TabContent,
    Select,
    BSidebar,
    BPopover,
    ValidationObserver,
    ValidationProvider,
    Popover,
    Message,
    ModalPlugin,
    BRow,
    BCol,
    BInputGroup,
    BFormGroup,
    BInputGroupPrepend,
    BButton,
    BFormInput,
    BForm,
    VueGoodTable,
    BAvatar,
    BBadge,
    BPagination,
    BDropdown,
    BDropdownItem,
    ToastificationContent,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      bodyLoading: false, // 页面加载状态
      serviceMap: '',
      kongIP: '',
      cmdbDns: [],
      kongIPMap: new Map(),
      kongDomainMap: new Map(),
      clusterKongMap: null,
      clusterLabelsMap: null,
      //	kongType: '',
      templateDisabled: false,
      serviceDisabled: false,
      selectPipeline: '',
      imageVersionList: [],
      imageVersionSelect: null,
      items: [{
        id: 1,
        selected: 'male',
        selected1: 'designer',
        prevHeight: 0,
      }],
      nextTodoId: 2,
      pipelineSidebarActive: false,
      defenderOptions: [],
      loading: false,
      visible: false,
      // 1=新增 2=修改
      operateType: 1,
      required,
      projectId: this.$store.state.myRequest.projectId,
      pageLength: 10,
      page: 1,
      callBackFlag: false,
      total: 0,
      dir: false,
      columns: [
        {
          label: '流水线',
          field: 'name',
          sortable: false
        },
        {
          label: '服务',
          field: 'service',
          sortable: false
        },
        {
          label: '最近执行时间',
          field: 'lastRunTime',
          sortable: false
        },
        {
          label: '负责人',
          field: 'defender',
          sortable: false
        },
        /*        {
                    label: '配置',
                    field: 'appId',
                    sortable: false
                },*/
        {
          label: '来源',
          field: 'codeSource',
          sortable: false
        },
        {
          label: '类型',
          field: 'type',
          sortable: false
        },
        {
          label: '操作',
          field: 'action',
          sortable: false
        },
      ],
      rows: [],
      rowType: 1,
      searchTerm: '',
      serviceOptions: [],
      yamlTemplateOptions: [],
      templateArray: [],
      search: '',
      form: {
        id: '',
        name: '',
        template: '',
        codeUrl: '',
        branch: '',
        version: 'v1',
        yamlTemplateId: '',
        service: '',
        namespace: '',
        defaultFolder: '',
        unitTestFolder: '',
        jdkVersion: '',
        codeSource: 1,
        mirrorAddress: '',
        enableSonarTest: 0,
        enableUnitTest: 0,
        enableSkyWalkingAgent: '0',
        defender: '',
        defenderName: '',
        desci: '',
        envVariable: '',
        domain: '',
        route: '',
        port: 8020,
        label: '',
        cluster: '',
        replicas: 1,
        cpu: '',
        memory: '',
        volume: '',
        kongType: null,
        envList: [],
        healthyApi: '/healthy',
        envKeyList: [],
        envValueList: [],
        bpmId: ''
      },
      bpmId: '',
      bpmType: '',
      selectRowData: '',
      templateOptions: [{
        value: 'java',
        label: 'java',
        disabled: false,
        children: [{
          value: 'template-eos-git-springboot',
          label: 'git-springboot',
          children: [{
            value: 'openjdk8',
            label: 'openjdk8'
          }, {
            value: 'openjdk11',
            label: 'openjdk11'
          }]
        },
          {
            value: 'template-eos-svn-springboot',
            label: 'svn-springboot',
            children: [{
              value: 'openjdk8',
              label: 'openjdk8'
            }, {
              value: 'openjdk11',
              label: 'openjdk11'
            }]
          }]
      },
        {
          value: 'donetcore',
          label: 'dotnetcore',
          disabled: false,
          children: [
            {
              value: 'template-eos-git-dotnetcore',
              label: 'git-dotnetcore',
              children: [{
                value: 'dotnetsdk3.1',
                label: 'dotnetsdk3.1'
              }]
            },
            {
              value: 'template-eos-svn-dotnetcore',
              label: 'svn-netcore',
              children: [{
                value: 'dotnetsdk3.1',
                label: 'dotnetsdk3.1'
              }]
            }
          ]
        },
        {
          value: 'vue',
          label: 'vue/react',
          disabled: false,
          children: [{
            value: 'template-eos-git-web-vue',
            label: 'git-vue/react'
          }]
        },
        {
          value: 'html',
          label: 'html',
          disabled: false,
          children: [
            {
              value: 'template-eos-git-web',
              label: 'git-web',
            },
            {
              value: 'template-eos-svn-web',
              label: 'svn-web',
            },
            {
              value: 'template-eos-git-web-rd-public',
              label: 'git-web-rd-public'
            },
            {
              value: 'template-eos-git-web-pod',
              label: 'git-web-pod'
            },

          ]

        }],
      versionOptions: [
        {
          value: 'v1',
          label: 'v1'
        },
        {
          value: 'v2',
          label: 'v2'
        },
        {
          value: 'v3',
          label: 'v3'
        }
      ],
      replicasOptions: [
        {
          value: 1,
          label: 1
        },
        {
          value: 2,
          label: 2
        },
        {
          value: 3,
          label: 3
        },
        {
          value: 4,
          label: 4
        },
        {
          value: 5,
          label: 5
        }
      ],
      bpm: {
        id: '',
        name: '',
        imageVersion: ''
      },
      clusterOptions: [],
      kongTypeOptions: [],
      labelOptions: [],
      codeSourceOptions: [
        {
          value: 1,
          label: '源代码模式'
        },
        {
          value: 2,
          label: '镜像模式'
        }
      ],
      imageVersionOptions: [],
      sessionClearFlag: true,

      // 用于镜像模式是否展示 路由选项 和 端口默认值
      // 1: 显示路由选项，端口默认值为8020, 2: 隐藏路由选项，端口默认值为80
      serviceType: 1, // 服务类型  1:后端 / 2:前端
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
  watch: {
    'form.cluster': function (newValue, oldValue) {
      this.kongTypeOptions = this.clusterKongMap.get(newValue)
      for (const index in this.kongTypeOptions) {
        this.kongIPMap.set(this.kongTypeOptions[index].kongCode, this.kongTypeOptions[index].kongIp)
        this.kongDomainMap.set(this.kongTypeOptions[index].kongCode, this.kongTypeOptions[index].kongDomain)
      }
      /*    if (this.callBackFlag) {
              this.callBackFlag = false
              // this.form.kongType = this.kongType
          } else {*/
      // this.form.kongType = ''
      this.form.kongType = this.kongTypeOptions && this.kongTypeOptions.length > 0 ? this.kongTypeOptions[0].kongCode : ''
      this.kongIP = this.kongIPMap.get(this.form.kongType)
      this.getCmdbDnsList(this.kongIP)
      this.form.label = ''
      // }
      let labels = this.clusterLabelsMap.get(newValue)
      if (labels) {
        this.labelOptions = labels.split(',').map(e => e.trim())
      }
    },
    'form.kongType': function (newValue, oldValue) {
      this.kongIP = this.kongIPMap.get(newValue + '')

      if (this.rowType === 2 && this.operateType === 1) {
        this.getCmdbDnsList(this.kongIP)
        this.form.domain = this.kongDomainMap.get(newValue)
      }
    }
  },
  mounted() {
    this.initTrHeight()
  },
  beforeRouteEnter(to, from, next) {
    if (from.path !== '/project/pipeline/details' && from.path !== '/project/pipeline/build') {
      sessionStorage.removeItem("pipelineList")
      sessionStorage.removeItem("pipelineSearchTerm")
    }
    next()
  },
  // 添加本地缓存
  beforeRouteLeave(to, from, next) {
    if (to.path === '/project/pipeline/details' || to.path === '/project/pipeline/build') {
      this.sessionClearFlag = false
      sessionStorage.setItem("pipelineList", JSON.stringify(this.rows))
      sessionStorage.setItem("pipelineSearchTerm", this.searchTerm)
    } else {
      this.sessionClearFlag = true
    }
    next()
  },
  created() {

    // 设置缓存清除标志
    this.sessionClearFlag = true
    // 从缓存中拿数据
    if (sessionStorage.getItem("pipelineSearchTerm")) this.searchTerm = sessionStorage.getItem("pipelineSearchTerm")
    if (sessionStorage.getItem("pipelineList")) {
      this.rows = JSON.parse(sessionStorage.getItem("pipelineList"))
    } else {
      this.getPipelineList()
    }
    // 获取其他数据
    this.getYamlTemplate()
    this.getServiceList()

    this.getClusterOptions()
    window.addEventListener('resize', this.initTrHeight)
  },
  destroyed() {
    if (this.sessionClearFlag) {
      this.clearSessionStorage()
    }
    window.removeEventListener('resize', this.initTrHeight)
  },
  methods: {
    queryDnsSearch(queryString, cb){
      const restaurants = this.cmdbDns;
      let results = queryString ? restaurants.filter(this.createDnsFilter(queryString)) : restaurants;
      results.forEach(e => e.name = e.name.substring(0,e.name.length-1))
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createDnsFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    changeDefender(value) {
      for (var i of this.defenderOptions) {
        if (i.value === value) {
          this.form.defenderName = i.name
        }
      }
    },
    getCmdbDnsList(kong) {
      const that = this
      if (kong === '' || this.$store.state.myRequest.appNo === null) {
        this.cmdbDns = []
        return
      }
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/cmdb/dns/list`,
        appNo: this.$store.state.myRequest.appNo,
        gateway: [kong]
      }
      that.$store.dispatch('httpPost', _data).then(res => {
        if (res.flag) {
          that.cmdbDns = res.data
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
    reloadForm() {
      this.templateOptions.forEach(item => {
        item.disabled = false
      })
      this.templateArray = []
      this.form = {
        id: '',
        name: '',
        template: '',
        codeUrl: '',
        branch: '',
        version: 'v1',
        yamlTemplateId: '',
        service: '',
        namespace: '',
        defaultFolder: '',
        unitTestFolder: '',
        jdkVersion: '',
        codeSource: 1,
        mirrorAddress: '',
        enableSonarTest: 0,
        enableUnitTest: 0,
        enableSkyWalkingAgent: '0',
        defender: '',
        desci: '',
        envVariable: '',
        domain: '',
        route: '',
        label: '',
        cluster: this.clusterOptions[0].clusterId,
        replicas: 1,
        cpu: '',
        memory: '',
        volume: '',
        kongType: this.clusterOptions[0].kongList.length > 0 ? this.clusterOptions[0].kongList[0].kongCode : null,
        envList: [],
        healthyApi: '/healthy',
        envKeyList: [],
        envValueList: []
      }
    },
    repeatAgain() {
      this.items.push({
        id: this.nextTodoId += this.nextTodoId,
      })

      this.$nextTick(() => {
        this.trAddHeight(this.$refs.row[0].offsetHeight)
      })
    },
    getClusterOptions() {
      const that = this
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/cluster/list`,
      }
      that.$store.dispatch('httpGet', _data).then(res => {
        if (res.flag) {
          that.clusterOptions = res.data
          if (that.clusterOptions.length > 0) {
            that.form.cluster = that.clusterOptions[0].clusterId
            that.clusterKongMap = new Map()
            that.clusterLabelsMap = new Map()
            for (const index in that.clusterOptions) {
              that.clusterKongMap.set(that.clusterOptions[index].clusterId, that.clusterOptions[index].kongList)
              that.clusterLabelsMap.set(that.clusterOptions[index].clusterId, that.clusterOptions[index].labels)
            }
          }
        } else {
          that.clusterOptions = []
        }
      })
    },

    removeItem(index) {
      this.items.splice(index, 1)
      this.form.envKeyList.splice(index, 1)
      this.form.envValueList.splice(index, 1)
      this.trTrimHeight(this.$refs.row[0].offsetHeight)
    },
    initTrHeight() {
      this.trSetHeight(null)
      // this.$nextTick(() => {
      //     this.trSetHeight(this.$refs.form.scrollHeight)
      // })
    },

    // 调用接口板获取列表
    getPipelineList() {
      if (this.$route.params.serviceId) {
        this.search = this.$route.params.serviceId
      }
      const that = this
      that.bodyLoading = true
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/pipeline/` + this.projectId,
        service: this.search
      }
      that.$store.dispatch('httpGet', _data).then(res => {
        if (res.flag) {
          that.rows = res.data
          that.bodyLoading = false
          // that.total = res.data.total
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
    // 点击单行
    rowClicked(item) {
      // 判断是否有选中的值，有的话代表复制，没有的话代表点击
      const sel = this.getSelected();
      if (sel) {
        return;
      }

      this.$router.push({
        name: 'pod',
        params: {
          searchTerm: item.row.service
        }
      })
    },
    // 判断是否有选中的值
    getSelected() {
      if (window.getSelection) {
        return window.getSelection().toString();
      } else if (document.getSelection) {
        return document.getSelection().toString();
      } else {
        var selection = document.selection && document.selection.createRange();
        if (selection.text) {
          return selection.text.toString();
        }
        return "";
      }
    },
    toPath(id) {
      this.$router.push({
        path: '/project/pipeline/details?id=' + id
      })
    },
    getServiceList() {
      const that = this
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/service`,
        project: this.projectId,
      }
      that.$store.dispatch('httpGet', _data)
          .then(res => {
            if (res.flag) {
              that.serviceOptions = res.data
              if (that.serviceOptions.length > 0) {
                that.serviceMap = new Map()
                for (const index in that.serviceOptions) {
                  that.serviceMap.set(that.serviceOptions[index].id, that.serviceOptions[index].type)
                }
              }
            } else {
              that.serviceOptions = []
            }
          })
    },
    getYamlTemplate() {
      const that = this
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/yaml`,
        projectId: this.projectId,
      }
      that.$store.dispatch('httpGet', _data)
          .then(res => {
            if (res.flag) {
              that.yamlTemplateOptions = res.data
            } else {
              that.yamlTemplateOptions = []
            }
          })

    },
    showEditModal(operateType, rowData) {
      let that = this
      that.operateType = operateType
      if (operateType === 2) {
        that.serviceDisabled = true
        that.templateDisabled = true
        that.callBackFlag = true
        this.form = {
          id: rowData.id,
          name: rowData.name,
          template: rowData.template,
          codeUrl: rowData.codeUrl,
          branch: rowData.branch,
          version: rowData.version,
          yamlTemplateId: rowData.yamlTemplateId,
          service: rowData.service,
          namespace: rowData.namespace,
          defaultFolder: rowData.defaultFolder,
          unitTestFolder: rowData.unitTestFolder,
          jdkVersion: rowData.jdkVersion,
          codeSource: rowData.codeSource,
          mirrorAddress: rowData.mirrorAddress,
          enableSonarTest: rowData.enableSonarTest,
          enableUnitTest: rowData.enableUnitTest,
          enableSkyWalkingAgent: rowData.enableSkyWalkingAgent,
          defender: rowData.defender,
          desci: rowData.desci,
          envVariable: rowData.envVariable,
          domain: rowData.domain,
          route: rowData.route,
          cluster: rowData.cluster,
          label: rowData.label,
          replicas: rowData.replicas,
          cpu: rowData.cpu,
          memory: rowData.memory,
          volume: rowData.volume,
          kongType: rowData.kongType,
          envList: rowData.envList,
          healthyApi: rowData.healthyApi,
          port: rowData.port
        }
        this.serviceType = this.serviceMap.get(rowData.service)
        if (that.form.envList.length > 0) {
          that.form.envList.forEach((item, index) => {
            if (index > 0) {
              this.repeatAgain()
            }
          }, this);
        }
        //that.kongType = '1'
        that.form.envKeyList = rowData.envKeyList
        that.form.envValueList = rowData.envValueList

        if (rowData.template.indexOf('springboot') !== -1) {
          this.templateArray.push('java');
          this.templateArray.push(rowData.template)
          if (rowData.jdkVersion !== '') {
            this.templateArray.push(rowData.jdkVersion)
          }
        } else if (rowData.template.indexOf('dotnetcore') !== -1) {
          this.templateArray.push('donetcore');
          this.templateArray.push(rowData.template)
          if (rowData.jdkVersion !== '') {
            this.templateArray.push(rowData.jdkVersion)
          }
        } else if (rowData.template.indexOf('web-vue') !== -1) {
          this.templateArray.push('vue');
          this.templateArray.push(rowData.template)
        } else {
          this.templateArray.push('html');
          this.templateArray.push(rowData.template)
        }
      } else {
        //新增
        that.serviceDisabled = false
        that.templateDisabled = false
      }
      this.$bvModal.show('pipelineForm')
    },
    saveEditPipeline(type) {
      let loadingInstance = Loading.service({
        text: '正在提交...'
      })
      let that = this
      if (type === 1) {
        //新增
        that.form.template = that.templateArray[1]
        if (that.templateArray.length > 2) {
          that.form.jdkVersion = that.templateArray[2]
        }

        // 新增
        that.form.curl = `${$themeConfig.app.projectHttpUrl}/pipeline/` + this.projectId + '/' + this.form.service
        this.$store.dispatch('httpPost', that.form).then(res => {
          this.$nextTick(() => {
            loadingInstance.close()
          })
          if (res.flag) {
            that.$bvModal.hide('pipelineForm')
            that.getPipelineList()
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
        }).catch(e => {
          this.$nextTick(() => {
            loadingInstance.close()
          })
          that.$bvToast.toast(e.msg.message, {
            title: '操作提示',
            toaster: 'b-toaster-top-center',
            solid: true,
            variant: 'danger',
            autoHideDelay: 2000,
          })
        })
      } else {
        //更新
        that.form.curl = `${$themeConfig.app.projectHttpUrl}/pipeline/` + this.projectId + '/' + this.form.id
        this.$store.dispatch('httpPut', that.form).then(res => {
          this.$nextTick(() => {
            loadingInstance.close()
          })
          if (res.flag) {
            that.$bvModal.hide('pipelineForm')
            that.getPipelineList()
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
        }).catch(e => {
          this.$nextTick(() => {
            loadingInstance.close()
          })
          that.$bvToast.toast(e.msg.message, {
            title: '操作提示',
            toaster: 'b-toaster-top-center',
            solid: true,
            variant: 'danger',
            autoHideDelay: 2000,
          })
        })
      }
    },
    validationCI() {
      return new Promise((resolve, reject) => {
        this.$refs.CIRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationCD() {
      return new Promise((resolve, reject) => {
            this.$refs.CDRules.validate().then(success => {
              if (success) {
                const that = this
                console.log(that.templateArray)
                if (that.templateArray.length > 0 && (that.templateArray[0] === 'java' || that.templateArray[0] === 'donetcore')) {
                  if (this.operateType == 1) {
                    const _data = {
                      curl: `${$themeConfig.app.projectHttpUrl}/pipeline/checkRoute`,
                      route: this.form.route,
                      domain: this.form.domain
                    }
                    this.$store.dispatch('httpPost', _data).then(res => {
                      if (res.data) {
                        resolve(true)
                      } else {
                        this.$bvToast.toast('路由已存在,请修改路由', {
                          title: '操作提示',
                          toaster: 'b-toaster-top-center',
                          solid: true,
                          variant: 'danger',
                          autoHideDelay: 2000,
                        })
                        reject()
                      }
                    })
                  } else {
                    const _data = {
                      curl: `${$themeConfig.app.projectHttpUrl}/pipeline/checkRoute`,
                      id: this.form.id,
                      route: this.form.route,
                      domain: this.form.domain
                    }
                    this.$store.dispatch('httpPost', _data).then(res => {
                      if (res.data) {
                        resolve(true)
                      } else {
                        this.$bvToast.toast('路由已存在,请修改路由', {
                          title: '操作提示',
                          toaster: 'b-toaster-top-center',
                          solid: true,
                          variant: 'danger',
                          autoHideDelay: 2000,
                        })
                        reject()
                      }
                    })
                  }
                } else {
                  resolve(true)
                }
              } else {
                reject()
              }
            })
          }
      )
    },
    validationPipelineInfo() {
      return new Promise((resolve, reject) => {
        this.$refs.pipelineInfoRules.validate()
            .then(success => {
              if (success) {
                resolve(true)
              } else {
                reject()
              }
            })
      })
    }
    ,
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
    }
    ,
    getDefenderList(query) {
      const that = this
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/project/getAllUserByAssociated`,
        param: query,
        page: 1,
        size: 10,
      }
      this.$store.dispatch('httpGet', _data)
          .then(res => {
            if (res.flag || res.data.rows.size !== 0) {
              that.defenderOptions = []
              const userList = res.data.rows
              for (const item of userList) {
                const data = {
                  value: `${item.domain_account}`,
                  label: `${item.real_name} ${item.domain_account}`,
                  name: `${item.real_name}`
                }
                that.defenderOptions.push(data)
              }
            } else {
              that.defenderOptions = []
            }
          })
    }
    ,
    refreshForm() {
      this.clearSessionStorage()
      this.reload()
    }
    ,
    clearSessionStorage() {
      sessionStorage.removeItem("pipelineList")
      sessionStorage.removeItem("pipelineSearchTerm")
    }
    ,

    checkBpm(bpmId, type) {
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/pipeline/checkBpm/` + bpmId,
      }
      this.$store.dispatch('httpGet', _data).then(res => {
        // 成功
        if (res.flag) {
          if (res.data.pass) {
            this.$bvModal.hide('bpmModel')
            if (type === 1) {
              this.runPipeline(this.bpm.id, this.bpm.name, this.bpm.imageVersion, bpmId)
            } else if (type === 2) {
              this.showHisPipeline(this.selectRowData)
            } else if (type === 3) {
              this.showDeploy(this.selectRowData)
            }
          } else {
            this.$bvToast.toast(res.data.msg, {
              title: '操作提示',
              toaster: 'b-toaster-top-center',
              solid: true,
              variant: 'danger',
              autoHideDelay: 2000,
            })
          }
        } else {
          // 失败
          this.$bvToast.toast(res.data, {
            title: '操作提示',
            toaster: 'b-toaster-top-center',
            solid: true,
            variant: 'danger',
            autoHideDelay: 2000,
          })
        }
      })
    },
    runPipelineBpm(id, name, imageVersion, workStatus) {
      if (workStatus === "3") {
        this.bpmId = ''
        this.bpmType = 1
        this.bpm.id = id
        this.bpm.name = name
        this.bpm.imageVersion = imageVersion
        this.$bvModal.show('bpmModel')
      } else {
        this.runPipeline(id, name, imageVersion,'')
      }
    },
    runPipeline(id, name, imageVersion, bpmId) {
      this.$bvModal.hide('imagePublishModal')

      const h = this.$createElement;
      const that = this

      // 定义一个字段来存储接口调取的结果（成为true,失败为false），从而判断点击确定后是调整页面还是弹出错误提示
      let isToPath = false
      // 存储错误时的提示语
      let resMessage = null

      this.$msgbox({
        title: '提示',
        type: 'warning',
        message: h('p', null, [
          h('span', null, '执行流水线将覆盖之前的版本，请谨慎操作! '),
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            // 点击确定后的操作
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            // const that = this
            const _data = {
              curl: `${$themeConfig.app.projectHttpUrl}/pipeline/${this.projectId}/${id}/build?imageVersion=` + imageVersion + '&bpmId=' + bpmId,
            }
            this.$store.dispatch('httpPost', _data).then(res => {
              // 成功
              if (res.flag) {
                isToPath = true
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              } else {
                // 失败
                isToPath = false
                resMessage = res.message
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }
            })
          } else {
            // 点击取消或关闭进这里
            done();
            setTimeout(() => {
              instance.confirmButtonLoading = false;
            }, 300);
          }
        }
      }).then(action => {
        // 确定进这里判断
        if (isToPath) {
          //跳转发布历史页面
          that.$router.push({
            path: "/project/pipeline/build?pipeline=" + name,
            // params: {'pipeline': rowData.name}
          })
        } else {
          that.$bvToast.toast(resMessage, {
            title: '操作提示',
            toaster: 'b-toaster-top-center',
            solid: true,
            variant: 'danger',
            autoHideDelay: 2000,
          })
        }
      }).catch(err => {
      })
    }
    ,
    updateDeploy(id) {
      const that = this
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/pipeline/updateDeploy/` + id + `/` + this.form.replicas+'?bpmId='+this.bpmId
      }
      this.$store.dispatch('httpPut', _data).then(res => {
        if (res.flag) {
          that.$bvModal.hide('deployModal')
          that.getPipelineList()
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
    ,
    showDeploy(rowData) {
      this.form.replicas = rowData.replicas
      this.$store.commit('getClusterHeader', rowData.cluster)
      this.$bvModal.show('deployModal')
      this.selectPipeline = rowData
    }
    ,
    showDeployBpm(rowData) {
      if (rowData.workStatus === '3') {
        this.bpmId = ''
        this.bpmType = 3
        this.selectRowData = rowData
        this.$bvModal.show('bpmModel')
      } else {
        this.showDeploy(rowData)
      }
    },
    showHisPipelineBpm(rowData) {
      if (rowData.workStatus === '3') {
        this.bpmId = ''
        this.bpmType = 2
        this.selectRowData = rowData
        this.$bvModal.show('bpmModel')
      } else {
        this.showHisPipeline(rowData)
      }
    },
    showHisPipeline(rowData) {
      const that = this
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/build`,
        pipeline: rowData.name,
      }
      that.$store.dispatch('httpGet', _data)
          .then(res => {
            if (res.flag) {
              that.imageVersionOptions = []
              that.imageVersionList = res.data
              let successList = []
              for (let index in that.imageVersionList) {
                if (that.imageVersionList[index].result === 'SUCCESS') {
                  successList.push(that.imageVersionList[index])
                }
              }
              if (successList.length > 0) {
                for (let index in successList) {
                  if (index < 5) {
                    that.imageVersionOptions.push({
                      value: successList[index],
                      label: successList[index].imageVersion
                    })
                  }
                }
              }
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
      this.$bvModal.show('imagePublishModal')
      this.selectPipeline = rowData
    }
    ,
    showHistory(rowData) {
      this.$router.push({
        path: "/project/pipeline/build?pipeline=" + rowData.name,
        // params: {'pipeline': rowData.name}
      })
    }
    ,
    deletePipeline(rowData) {
      const that = this
      this.$prompt('您确认要删除吗?删除流水线将删除对应实例,如确认删除，请输入"我确认"', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        inputPattern: /^\u6211\u786e\u8ba4$/,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        inputErrorMessage: '输入不正确'
      }).then(async () => {
        const _data = {
          curl: `${$themeConfig.app.projectHttpUrl}/pipeline/${this.projectId}/${rowData.id}`,
        }
        this.$store.dispatch('httpDelete', _data)
            .then(res => {
              if (res.flag) {
                that.getPipelineList()
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
    ,
    changeDomain(templateValue) {
      if ('java' === templateValue[0] || 'donetcore' === templateValue[0]) {
        const envUrl = $themeConfig.app.httpUrl
        if (envUrl.indexOf('.eos.') !== -1) {
          this.form.domain = 'api.eos.h3c.com'
        } else {
          this.form.domain = 'api.eos-ts.h3c.com'
        }
        this.rowType = 2
      } else {
        this.form.domain = ''
      }
    }
    ,
    changeService(value) {
      this.templateOptions.forEach(item => {
        item.disabled = false
      })
      const type = this.serviceMap.get(value)
      this.serviceType = type
      if (type === 1) {
        this.form.port = 80
        this.templateOptions.forEach(item => {
          if (item.value === 'java' || item.value === 'donetcore') {
            item.disabled = true
          }
        })
      } else if (type === 2) {
        this.form.port = 8020
        this.templateOptions.forEach(item => {
          if (item.value === 'vue' || item.value === 'html') {
            item.disabled = true
          }
        })
      }
    }
    ,
    changeCodeSource(value) {
      if (value === 2 && this.serviceType === 2) {
        const envUrl = $themeConfig.app.httpUrl
        if (envUrl.indexOf('.eos.') !== -1) {
          this.form.domain = 'api.eos.h3c.com'
        } else {
          this.form.domain = 'api.eos-ts.h3c.com'
        }
      } else if (value === 2 && this.serviceType === 1) {
        this.form.domain = ''
      }
    }
  }
}
</script>
<style lang="scss">
.vgt-left-align {
  vertical-align: revert !important;
  color: #606266;
}

.repeater-form {
  overflow: hidden;
  transition: .35s height;
}

.envClass {
  text-align: center;
  padding-bottom: 10px;
}

.pipelineTip {
  width: 300px;
}

.modal .modal-header .close {
  transform: translate(0px, 0px) !important;
  box-shadow: 0 5px 20px 0 rgb(255 255 255 / 10%) !important;
  background: transparent !important;
}

.tableHeight .vgt-responsive {
  width: 100%;
  overflow-x: auto;
  position: relative;
  min-height: 200px;
}

.topipelineDetails {
  // display: block;
  color: #409efe;
  height: 100%;
}
</style>
