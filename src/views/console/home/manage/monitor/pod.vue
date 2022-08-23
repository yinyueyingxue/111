<template>
  <div class="row" style="height: 87vh">
	<div style="margin: 15px;">
	    <el-row>
	        <el-col :span="24">
	            <span style="margin-right: 10px;">所属集群</span>
	            <el-select v-model="clusterId" placeholder="请选择">	              
	                <el-option v-for="item in clusterOptions" :key="item.clusterId" :label="item.clusterId" :value="item.clusterId"></el-option>
	            </el-select>		
	        </el-col>
	    </el-row>
	</div>
    <iframe id="grafana" style="border: 0" :src="srcUrl" width="100%" height="100%" allowfullscreen/>
  </div>
</template>

<script>
import { $themeConfig } from '@themeConfig'
export default {
	name: 'pod',
	data() {
		return {
			srcUrl: '',
			grafanaMap: '',
			clusterOptions:[],
			clusterId: '',
		}
	},
	created() {
		this.getClusterOptions();
	},
  	watch:{
		clusterId: function(newValue, oldValue) { 	    
			this.getUrl()
		}
  	},
	methods: {
		
		getClusterOptions() {
			const _data = {
				curl: `${$themeConfig.app.projectHttpUrl}/cluster/list`,
			}
			this.$store.dispatch('httpGet', _data).then(res => {
				if (res.flag) {
					this.clusterOptions = res.data	
					if (this.clusterOptions.length > 0) {
						this.grafanaMap = new Map()
						this.clusterId = this.clusterOptions[0].clusterId
						for (const index in this.clusterOptions) {
							this.grafanaMap.set(this.clusterOptions[index].clusterId, this.clusterOptions[index].extension.grafana.container)
						}
					}
					this.getUrl()
				} else {
					this.clusterOptions = []
				}
			})
		},
		
		getUrl() {
			const that = this
			that.srcUrl = that.grafanaMap.get(that.clusterId)
			// that.srcUrl = $themeConfig.app.grafanaHttpUrl + "/d/SpSQKcpMz/k8s-dashboard?refresh=10s&orgId=1&kiosk";
		}
	}
}
</script>

<style scoped>

</style>
