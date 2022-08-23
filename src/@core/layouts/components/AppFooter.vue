<template>



  <div class="clearfix mb-0" style="background-color:#FFF;position: fixed;bottom: 0px;
    width: 100%;line-height: 2rem;" align="center">
    <span  style=" background-color:#FFF;width: 100%;" class="d-block d-md-inline-block mt-25">
       © 2019 - {{ new Date().getFullYear() }}
      <b-link
          class="ml-25"
          href="https://eos.h3c.com"
          target="_blank"
      > <span class="d-none d-sm-inline-block">新华三集团 信息技术部---AI及中台方案部</span></b-link>
    </span>
  </div>

</template>
<script>
import { BLink } from 'bootstrap-vue'

export default {
  components: {
    BLink,
  },
}
</script>

