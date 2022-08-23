<template>
  <div class="container-fluid">
    <div class="row" style="height: 87vh">
	<div style="margin: 15px;">
	    <el-row>
	        <el-col :span="24">
	            <span style="margin-right: 10px;">所属集群</span>
	            <el-select v-model="clusterId" placeholder="请选择">	              
	                <el-option v-for="item in clusterOptions" :key="item.clusterId" :label="item.clusterId" :value="item.clusterId">
	                </el-option>
	            </el-select>		
	        </el-col>
	
	    </el-row>
	</div>
      <iframe id="XXL-JOB" style="border: 0" :src="src" width="100%" height="100%"></iframe>
    </div>
  </div>
</template>

<script>
import {$themeConfig} from '@themeConfig'

export default {
  name: "manage",
  data() {
    return {
      src: '',
      projectId: this.$store.state.myRequest.projectId,
	  xxlJobMap: '',
	  clusterOptions:[],
	  clusterId: '',
    }
  },
  created() {
    this.getClusterOptions()
  },
  watch:{
	  clusterId: function(newValue, oldValue) {
		this.$store.commit('getClusterHeader', newValue)
	  	this.getXxlJobAuthToken()
	  }
  },
  methods: {
	getClusterOptions() {
	    const _data = {
	        curl: `${$themeConfig.app.projectHttpUrl}/cluster/list`,
	    }
	    this.$store.dispatch('httpGet', _data)
	        .then(res => {
	            if (res.flag) {
	                this.clusterOptions = res.data	
					if (this.clusterOptions.length > 0) {
					    this.xxlJobMap = new Map()
						this.clusterId = this.clusterOptions[0].clusterId
					    for (const index in this.clusterOptions) {							
					        this.xxlJobMap.set(this.clusterOptions[index].clusterId, this.clusterOptions[index].extension.xxlJob.domain)
					    }
					}
					this.getXxlJobAuthToken()
	            } else {
	                this.clusterOptions = []
	            }
	        })
	},
	  
    getXxlJobAuthToken() {
      let _data = {
        curl: $themeConfig.app.projectHttpUrl + '/job/authToken/' + this.projectId + '?access=' + this.$store.state.myRequest.jwtToken,
        url: 'jobinfo',
		clusterId: this.clusterId
      }
      this.$store.dispatch('httpPost', _data).then(res => {
        if (res.code === 20216) {
          this.src = 'https://'+ this.xxlJobMap.get(this.clusterId)+ '/auth?authToken=' + res.data + '&type=1'
          console.log("src: \n" + this.src)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>