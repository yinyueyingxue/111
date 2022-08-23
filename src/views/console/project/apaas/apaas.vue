<template>
    <div>
		<div style="background-color: #FFF;border-radius: 4px;border: 1rem solid #EBEEF5;" >
		<h5  style="padding-top:15px;padding-left: 20px; font-weight: bold">已开通</h5 >
		<el-row style="padding-left: 30px" >
		  <el-col :span="24">
	      <div style="min-height: 20rem;" v-if="applyList.length > 0">
		  <el-row    >

		    <el-col :span="2" v-for="(item, index) in applyList" :key="index"  >
				<router-link
				  :to="{ name: 'apaasMod', params:{ url: item.url} }"    >
			
		      <el-card  class="box-card" shadow="hover"    >
		        <div align="center">
					<div style="width: 100%;">
					<b-avatar :variant="item.color" size="60" style="font-size:3rem;"  >
						 <e-icon :icon-name="item.icon" @click="toRouter({ name: 'apaasMod', params:{ url: item.url} })" />
					</b-avatar>
					</div>
					 <div>{{item.name}}</div>
		        </div>
		      </el-card>
			  </router-link>
		    </el-col>

		  </el-row>

		  </div></el-col>
		</el-row>
		<div v-if=" applyList.length == 0" >
			 <el-empty description="没有数据" :image-size="100" ></el-empty>
		</div>
		</div>
		<div style="background-color: #FFF;border-radius: 4px;border-radius: 4px;border: 1rem solid #EBEEF5;"   >
		<h5  style="padding-top:15px;padding-left: 20px; font-weight: bold">未开通</h5>
		<div style="min-height: 20rem;"  v-if="unApplyList.length > 0" >
		<el-row  style="padding-left: 30px"  >
			<el-col :span="2" v-for="(item, index) in unApplyList" :key="index" >
				<router-link :to="{ name:  (item.approveStatus == 1 ?  'modelApply' : 'modelApplyStatus'), params: item }">
			  <el-card  class="box-card" shadow="hover" @click.stop>
			    <div align="center">
					<div style="width: 100%;">
					<b-avatar :variant="item.color" size="60" style="font-size:3rem;">

						 <e-icon :icon-name="item.icon" @click="toRouter({ name:  (item.approveStatus == 1 ?  'modelApply' : 'modelApplyStatus'), params: item })"  />

					</b-avatar>
					</div>
					 <div>{{item.name}}  <span v-if="item.approveStatus==2" style="color:#E6A23C;padding-right: 3px;">审批中</span></div>
			    </div>
			  </el-card>
				</router-link>
			</el-col>
		</el-row>
		</div >
		<div v-if=" unApplyList.length ==  0 ">
			 <el-empty description="没有更多了" :image-size="100" ></el-empty>
		</div>
		</div>

       <!-- <b-embed type="iframe" style="top: -0.85rem" aspect="16by9" :src="this.apaasUrl"/> -->
    </div>
</template>

<script>
    import {$themeConfig} from '@themeConfig'
    import {BLink} from 'bootstrap-vue'
	import {EIcon} from 'e-icon-picker';
    export default {
        name: 'apaas',
        components: {
            BLink,
			EIcon
        },
        data() {
            return {
                apaasProjectId: '',
                apaasUrl: $themeConfig.app.apaasDomain,
				applyList:[],
				unApplyList: []
            }
        },
	 updated() {
		
			let iList = document.getElementsByTagName("i")
			 
			// iList.forEach(item => {
			// 	item.addEventListener("click",(e)=>{
			// 		e.preventDefault()
			// 		//e.stopPropagation()
			// 	},{
			// 		capture: true
			// 	})
			// }) 	
		   
		},
        created() {
            this.getProject()
		
		
		// 	document.getElementsByTagName("i")[0].addEventListener("click",(e)=>{
		// 		e.stopPropagation()
		// 	},{
		// 		capture: true
		// 	})
        },
        methods: {
			toRouter(item) {
			   this.$router.push(item)
			},
            getProject() {
                const that = this
                const _data = {
                    curl: `${$themeConfig.app.apaasApiHttpUrl}/apaas/project`,
                    projectId: this.$store.state.myRequest.projectId,
                }
                that.$store.dispatch('httpGet', _data)
                    .then(res => {
                        if (res.flag && res.data !== null) {

                            that.applyList = res.data.paasList
							that.unApplyList = res.data.unPaasList
                        }
                    })
            },
        }
    }

</script>

<style scoped>
	.el-card{
		border: 0rem solid #EBEEF5 !important;
		margin: 1px;
	}

	.el-empty__image {
	    width: 6.333333rem !important;
	}

</style>
<style lang="css" scoped>
@import '~e-icon-picker/lib/index.css';
@import '~font-awesome/css/font-awesome.min.css';
@import '~element-ui/lib/theme-chalk/icon.css';
</style>
