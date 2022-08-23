<template>
  <div class="container-fluid">
    <div class="row" style="height: 87vh">
      <iframe id="XXL-JOB" style="border: 0" :src="srcUrl" width="100%" height="100%"></iframe>
    </div>
  </div>
</template>

<script>
import { $themeConfig } from '@themeConfig'

export default {
  name: 'skywalking',
  data() {
    return {
      projectId: this.$store.state.myRequest.projectId,
      podList: [],
      serviceList: [],
      srcUrl: '',
    }
  },
  created() {
    this.getPodList()
  },
  methods: {
    getPodList() {
      const that = this
      const _data = {
        curl: `${$themeConfig.app.projectHttpUrl}/pod`,
        project: that.projectId,
      }
      that.$store.dispatch('httpGet', _data)
          .then(res => {
            if (res.flag) {
              that.podList=res.data
              that.podList = that.podList.filter(function (value) {
                    return value.status === "running"
                  })
              that.podList.forEach(function (value) {
                if (that.serviceList.indexOf(value.service) === -1) {
                  that.serviceList.push(value.service)
                }
              })
              that.srcUrl='http://trace.eos.h3c.com/?ids=' + that.serviceList.join(';')
            }
          })
    },
  },

}
</script>

<style scoped>

</style>
