<template>
    <iframe id="mainIframe" v-bind:src="iframeUrl" width="100%" style="margin-top: 10px;" ></iframe>
</template>

<script>
  export default {
    name: "model",
    data() {
      return {
        iframeUrl: this.$route.params.url+'?token='+this.$store.state.myRequest.jwtToken+'&appId='+  this.$store.state.myRequest.projectId
      }
    },
    mounted() {
      this.$nextTick(function () {
		  if(this.$route.params.url == undefined ){
			  this.$router.replace({
				  path:"/apaas/index"
			  })
			  return
		  }
          document.getElementById('mainIframe').style.height = (document.body.clientHeight - 120) + "px"

      })
    },

}
</script>
<style lang="scss" scoped>

  iframe {
      border-width: 0px;
      border-style: inset;
      border-color: initial;
      border-image: initial;
  }

</style>
