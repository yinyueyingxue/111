<template>



  <div class="outlayer modelManagementApply">
    <div class="dataBox" >
      <div v-html="remark" v-if="active == 1" align="center">
      </div>

     <!-- <div align="center" v-if="active == 2" >
         <component v-if="load" :is='modelUrl' ref='child'  :data='data' ></component>
      </div> -->
       <div align="center" v-if="active == 2" >
         <el-form  :model="commonForm"  size="small" label-width="160px"
                  label-position="left">
           <el-form-item label="申请原因" prop="reason">
            <el-input v-model="commonForm.reason" type="textarea"  id="reason" placeholder="请输入申请原因"  style="{width: '100%'}">
           </el-input>
           </el-form-item>
         </el-form>
      </div>
	   <div  v-if="active == 3" align="center"> 成功界面 </div>
      <el-steps :active="active" >
        <el-step title="功能介绍"></el-step>
        <el-step title="申请表单"></el-step>
		<el-step title="申请成功"></el-step>
      </el-steps>
       <div align="center">
    <el-button v-if="active == 1" type="primary" style="margin-top: 12px;" @click="next">下一步</el-button>
    <el-radio-button v-if="active == 2" type="primary" style="align-items: center;" >
      <div @click="showEditDialog()">
         申请开通{{this.$route.params.name}}
      </div>
    </el-radio-button>
     </div>
    </div>
  </div>

</template>

<script>
  import showdown from 'showdown'
  import {
    $themeConfig,
  } from '@themeConfig'
  var converter = new showdown.Converter();
  export default {
    name: "modelApply",
    data() {
      return {
        remark:this.$route.params.detailDesc,
        flag: false,
        load: false,
        active: 1,
        commonForm: {
          reason: ''
        },
        modelUrl: null
      }
    },
    components: {

    },
    props: [ 'data'],
    created() {
     // this.getModelRemark()
    },
    mounted() {
       // this.modelUrl = () =>  import('../modeTempalte/'+this.$route.params.dic_code+'.vue')
    },
    methods: {

     getModelRemark() {
        let that = this
       const data = {
         'dicName': this.$route.params.dic_name,
         'appId' : 'afsp'
       }
       const _data = {
         'data': data,
         'curl': '/articals/getArticalByName'
       }
       that.$store.dispatch('httpGet', _data).then(function(res) {
         if(res.flag){
           that.remark =  converter.makeHtml(res.data.content.replaceAll("\n","<br/>"))
         }
       }, function(err) {
         that.$message({
           message: err.message,
           type: 'warning'
         })
       })
      },

      getDimensionTypeList() {
        let that = this
        let _data = {
          "dicCode": that.dic_code,
          "dicType": 'model'
        }
        that.$store.dispatch('getDicByCode', _data).then(function(res){

          if(res.flag) {
            const resData = res.data
            if(resData != null && resData.dicValue != null && resData.dicValue != 'undefined' ){
              that.load = true
            }
          }
          else {
            that.$message({
              message: res.message,
              type: "warning"
            })
            that.load = false
          }

        },function(err){
          that.load = false
        })
      },

      //编辑-弹出窗
      showEditDialog () {

        let that = this

        if(that.load){
          that.$refs['child'].handelConfirm()
          if(!that.$refs['child'].loading ){
               alert("数据校验错误")
               return
           }
        }

        let _data = {
          "projectId" :  this.$store.state.myRequest.projectId,
          "apaasId": this.$route.params.id,
          "applyReason": this.commonForm.reason,
		  "curl": $themeConfig.app.apaasApiHttpUrl+'/approve/apply',
          // "paramJson": that.load ? JSON.stringify(this.$refs['child'].formData) : ''
        }
		const loading = this.$loading({
		      lock: true,
		      text: 'Loading',
		      spinner: 'el-icon-loading',
		      background: 'rgba(0, 0, 0, 0.7)'
		    });

        that.$store.dispatch('httpPost', _data)
                    .then(res => {
          if(res.flag){

			 setTimeout(() => {
			          loading.close();
					  	that.active = 3
			        }, 2000);


            // that.$message({
            //   message: '保存成功',
            //   type: "success",
            //   duration: 500,
            //   onClose: function(){
            //     //that.dialogEditFormVisible = false
            //     //that.getDimensionTypeList()
            //     window.history.back()
            //   }
            // })
          }
          else {
			 setTimeout(() => {
			          loading.close();
			        }, 2000);
            that.$message({
              message: res.message,
              type: "warning"
            })

          }
        }, function (err) {
			 setTimeout(() => {
			          loading.close();
			        }, 2000);
          that.$message({
            message: err.message,
            type: "warning"
          })
        })
      },
       next() {
              this.active++;
              if (this.active > 1){
                this.active = 2
                //this.flag= true
              }
            }
    }
  }
</script>

<style lang="scss" scoped>
  .modelManagementApply {
    .searchForm {
      background: #fff;
      height: 45px;
      float: right;
      margin-top: -75px;
      margin-right: 10px;
      text-align: right;
      .el-input {
        width: 200px;
      }
    }
    .dataBox {
      background: #fff;
      box-shadow: 0 0 6px 2px #ddd;
      padding: 20px 10px;
      margin-top: 25px;
    }
    .errorMsgBox {
      margin: 20px auto;
      padding: 10px;
      padding-top: 0;
      border: 1px solid #e6e6e6;
      p {
        font-weight: 900;
        color: #F56C6C;
      }
      .el-row {
        padding: 10px;
        background: #F56C6C;
        border-radius: 4px;
        color: #fff;
        margin-bottom: 10px;
      }
    }
  }
</style>
