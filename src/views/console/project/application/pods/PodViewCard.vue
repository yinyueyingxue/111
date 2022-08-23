<template>
  <div>
    <el-row type="flex" class="row-bg" v-for="(item, index) in podslist" :key="index">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-card class="box-card" shadow="never">
              <div slot="header" class="service">
                <span> {{ item.deploy }} </span>|
                <span> {{ item.name }} </span>
                <el-button style="float: right; padding: 3px 0" type="text">
                  <!-- <span class="scalability">扩缩容</span> -->
                  <el-button type="primary" plain @click="handleScalability(item)" class="scalability">扩缩容</el-button>
                  <!-- <span class="scalability"  >  </span> -->
                  <!-- <span class="" @click="handleStop" > 停止 </span> -->
                  <el-button type="warning" @click="handleStop(item)" class="stop">停止运行</el-button>
                  <!-- <el-button type="primary">扩缩容</el-button> -->
                  <!-- <el-button type="primary" @click="handleStop">停止</el-button> -->
                </el-button>
              </div>
              <el-row>
                <el-col :span="8" v-for="pod in item.podList" :key="pod.id" :offset="0">
                  <el-card class="card">
                    <el-row :gutter="24">
                      <el-col :span="24">
                        <div class="service size">
                          <span>{{ pod.id }}</span>
                          <el-dropdown trigger="click" class="icon-more">
                            <span class="el-dropdown-link"> 操作<i class="el-icon-arrow-down el-icon--right"></i> </span>
                            <el-dropdown-menu slot="dropdown">
                              <b-dropdown-item @click="openLogs(pod)">
                                <feather-icon icon="FileTextIcon" />
                                <span class="size">查看日志</span>
                              </b-dropdown-item>
                              <b-dropdown-item @click="rebuildPod(pod)">
                                <feather-icon icon="RepeatIcon" />
                                <span class="size">重建</span>
                              </b-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </div>
                        <div class="gridContent size top">
                          <span>cpu {{ pod.capacityCpu }}</span> - <span>内存{{ pod.capacityMemory }}</span>
                        </div>
                        <div class="gridContent size bottom">
                          <span>创建时间: </span>
                          <span>{{ pod.createTime }}</span>
                        </div>
                        <div class="gridContent">
                          <b-avatar v-b-tooltip.hover :title="pod.status" :variant="getPodVariant(pod.status)" size="15" class="b-avatar-custom">
                            <!-- <feather-icon size="20" :icon="getPodIcon(pod.status)" /> -->
                            <el-button :type="getPodIcon(pod.status)" round></el-button>
                          </b-avatar>
                          <span class="size"> {{ title }}</span>
                          <span class="icon-more size">{{ pod.hostIp }}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-row>
    <!-- 扩缩容 -->
    <!-- <scalability-Dialog ref="dialogRef" /> -->
    <el-dialog :visible="visible" title="扩缩节点" :before-close="closeDialog" :close-on-click-modal="false" width="35%">
      <el-alert title="扩缩容相当于增加或者减少当前服务的实例数量,最少为1个实例,请依照实际需求进行该操作" show-icon class="blue" />
      <span>节点数：</span><el-input-number v-model="num" :min="1"></el-input-number>
      <el-button type="primary" class="but" :loading="loading" @click="handleSubmit">确认</el-button>
    </el-dialog>
    <!-- 停止 -->
    <el-dialog :visible="visibles" title="停止容器" :before-close="closeDialogs" :close-on-click-modal="false" width="35%">
      <el-alert title="停止服务操作将会关闭运行中的所有服务实例，且对外服务中断" type="warning" show-icon />
      <el-alert title="停止服务后，可以通过扩缩容重新启动服务，在版本未更新时无需进行流水线执行" show-icon class="blue" />
      <span class="icon"> 确定要停止运行此服务({{ container }})?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogs">取 消</el-button>
        <el-button type="primary" @click="innerVisible = true">确定</el-button>
      </span>
      <el-dialog width="30%" title="提示" :visible.sync="innerVisible" :before-close="handleStops" append-to-body>
        <el-alert title='您确认要停止运行？如确认停止,请输入"我确认"' type="warning" show-icon />
        <el-input v-model.trim="input" placeholder="请输入" class="input"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleStops()">取 消</el-button>
          <el-button type="primary" @click="handleSubmits" :loading="loading">确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <!-- <stop-Dialog ref="stopRef" /> -->
  </div>
  <!-- <b-card
      no-body
      class="pod-card"
  >
    <b-card-header>
      <b-card-title>
        <b-link class="text-body text-body-heading">
          {{ pod.id }}
        </b-link>
      </b-card-title>
      <b-card-title>
        <b-avatar
            v-b-tooltip.hover :title=pod.status
            :variant=getPodVariant(pod.status)
            size="20"
        >
          <feather-icon
              size="20"
              :icon=getPodIcon(pod.status)
          />
        </b-avatar>
        <b-dropdown variant="link" toggle-class="text-decoration-none" no-caret>
          <template v-slot:button-content>
            <feather-icon icon="MoreVerticalIcon" size="16" class="text-body align-middle mr-25"/>
          </template>
          <b-dropdown-item @click="openLogs(pod)">
            <feather-icon icon="FileTextIcon" class="mr-50"/>
            <span>查看日志</span>
          </b-dropdown-item>
          <b-dropdown-item @click="rebuildPod(pod)">
            <feather-icon icon="RepeatIcon" class="mr-50"/>
            <span>重建</span>
          </b-dropdown-item>
        </b-dropdown>
      </b-card-title>
    </b-card-header>
    <b-card-body class="d-flex"> -->
  <!-- left content  -->
  <!-- <b-col md="12" class="d-flex flex-column align-items-start">
        <b-row>
          <b-col>
            <small class="text-body mr-50">所属服务</small>
            <small class="text-body font-weight-bolder">{{ pod.service }}</small>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <small class="text-body mr-50">宿主机IP</small>
            <small class="text-body">{{ pod.hostIp }}</small>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <small class="text-body mr-50">镜像名称</small>
            <small class="text-body">{{ pod.osImage }}</small>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <small class="text-body mr-50">C&#12288P&#12288U</small>
            <small class="text-body">{{ pod.capacityCpu }}</small>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <small class="text-body mr-50">内&#12288&#12288存</small>
            <small class="text-body">{{ pod.capacityMemory }}</small>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <small class="text-body mr-50">创建时间</small>
            <small class="text-body">{{ pod.createTime }}</small>
          </b-col>
        </b-row>
      </b-col>
    </b-card-body>
  </b-card> -->
</template>
<script>
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import { BCard, BCardBody, BAvatar } from 'bootstrap-vue'
// import scalabilityDialog from './scalabilityDialog.vue'
// import stopDialog from './StopDialog.vue'
import { $themeConfig } from '@themeConfig'

export default {
  name: 'PodViewCard',
  components: {
    BCard,
    BCardBody,
    BAvatar,
    BCardActions,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'primary',
    },
    podslist: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      title: null,
      num: null,
      visible: false, //扩容
      pods: null,
      projectId: this.$store.state.myRequest.projectId,
      loading: false,
      container: null,
      innerVisible: false,
      input: '',
      visibles: false, //停止
    }
  },

  methods: {
    rebuildPod(pod) {
      let that = this
      this.$prompt('您确认要重建吗?如确认重建，请输入"我确认"', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        inputPattern: /^\u6211\u786e\u8ba4$/,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        inputErrorMessage: '输入不正确',
      }).then(async () => {
        const _data = {
          curl: `${$themeConfig.app.projectHttpUrl}/pod/` + this.projectId + '/' + pod.id,
        }
        this.$store.dispatch('httpDelete', _data).then((res) => {
          if (res.flag) {
            that.$bvToast.toast('重建中...', {
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
      // console.log(pod);
      // this.$parent.rebuildPod(pod.id)
    },
    openLogs(pod) {
      this.$parent.openLogs(pod.id, pod.service)
    },
    getPodIcon(status) {
      if (status === 'running' || status === null) {
        return (this.title = '运行中'), 'success'
      } else if (status === 'PodInitializing') {
        return (this.title = '创建中'), 'warning'
      } else {
        return (this.title = '失败'), 'danger'
      }
    },
    getPodVariant(status) {
      if (status === 'running' || status === null) {
        return 'success '
      } else if (status === 'ContainerCreating') {
        return 'secondary'
      } else {
        return 'danger'
      }
    },
    gradientToColor(color) {
      const gradientToColors = {
        primary: '#A9A2F6',
        success: '#55DD92',
        warning: '#ffc085',
        danger: '#F97794',
        info: '#59E0F0',
        secondary: '#B4B9BF',
        light: '#D0D4DB',
        dark: '#919191',
      }
      return gradientToColors[color]
    },
    //扩缩容
    handleSubmit() {
      let that = this
      this.loading = true
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/pipeline/updateDeployByDeploy/` + `${this.pods}` + `/ ` + `${that.num}`,
      }
      this.$store.dispatch('httpPut', _data).then((res) => {
        // if (res.code !== 20214) {
        //   that.$message.warning(res.message)
        // } else {
        //   that.$message.success(res.message)
        // }
      })

      setTimeout(() => {
        this.closeDialog()
        this.loading = false
        this.$emit('getPodList')
      }, 3000)
      // this.$emit('getPodList')
    },
    closeDialog() {
      this.visible = false
    },
    handleScalability(index) {
      console.log(index)
      this.visible = true
      if (index != null) {
        this.pods = index.deploy
        this.num = index.podList == null ? 1 : index.podList.length
      }
      // this.$refs.dialogRef.openDialog()
      // console.log(123);
    },
    //停止
    handleStop(pod) {
      this.visibles = true
      this.container = pod.deploy
      // this.$refs.stopRef.openDialog(pod)
    },
    //停止的关闭
    closeDialogs() {
      this.visibles = false
    },
    handleStops() {
      this.innerVisible = false
      this.input = ''
    },
    //确认
    handleSubmits() {
      this.loading = true
      if (this.input == '我确认') {
        const _data = {
          curl: `${$themeConfig.app.projectHttpUrl}/pipeline/updateDeployByDeploy/` + `${this.container}` + `/0`,
        }
        this.$store.dispatch('httpPut', _data)
        setTimeout(() => {
          this.closeDialogs()
          this.innerVisible = false
          this.input = ''
          this.loading = false
          this.$emit('handleStop')
        }, 3000)
      } else {
        this.$message.warning("如需停止,请输入'我确认'")
      }
    },
  },
}
</script>
<style scoped>
/* .pod-card {
  border: 1px solid #d8dbdb;
} */

.box-card {
  width: 1670px;
  /* margin-bottom: 50px; */
  /* background-color: #ebeef5; */
  background-color: #409eff1a;
}

.el-col {
  border-radius: 4px;
}
.el-card {
  padding: 0;
  margin: 5px;
  /* background-color:#409eff38; */
}
.grid-content {
  border-radius: 4px;
  min-height: 56px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
  /* background-color: #409eff1a; */
}
/* .el-icon-more {
  -webkit-transform: rotate(90deg);
} */
.card {
  width: 530px;
  /* background-color: #409eff1a ; */
}

.hostIp {
  padding-top: 45px;
  margin-left: 65px;
}
.icon-more {
  float: right;
}
.size {
  font-size: 12px;
  height: 20px;
}
.gridContent {
  margin-top: 5px;
}
/* .grid {
  padding-top: 0px;
} */
.service {
  font-weight: bold;
}

.el-dropdown-link {
  color: #76b0ff;
}
.el-popper {
  padding: 0;
}
::v-deep .el-alert__closebtn {
  display: none;
}
.blue {
  background-color: #d5e7ff;
  margin-bottom: 10px;
}
::v-deep .el-input-number {
  width: 550px;
  margin-bottom: 10px;
}
.but {
  margin-left: 540px;
}
.scalability {
  background-color: #409eff;
  color: #fff;
  /* margin-right: 10px; */
  padding: 7px;
  border-radius: 3px;
}
.stop {
  padding: 7px;
  border-radius: 3px;
}
.top {
  margin-top: 12px;
}
.bottom {
  margin-bottom: 15px;
}
.blue {
  background-color: #d5e7ff;
  margin-top: 10px;
  margin-bottom: 10px;
}
.icon {
  font-weight: bold;
}
::v-deep .el-dialog__footer {
  text-align: center;
}
.input {
  margin-top: 10px;
}
::v-deep .el-alert__closebtn {
  display: none;
}
</style>
