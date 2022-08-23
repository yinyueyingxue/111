<template>
  <div class="marquee">
    <div class="marquee_title">
      <div class="icon-wrapper">
        <feather-icon size="12" icon="Volume2Icon"/>
      </div>
    </div>

    <div class="marquee_box" @mousemove="mousemoveAnimate()" @mouseout="mouseoutAnimate()">
      <ul class="marquee_list" :class="{ marquee_top: animate }">
        <li v-for="item in marqueeList" :key="item.id">
          <span @click="clickNew(item)">{{ item.noticeTitle }}</span>
          <!-- <b-button type="text" v-ripple.400="'rgba(113, 102, 240, 0.15)'" v-b-modal.modal-primary variant="outline-primary">Primary</b-button> -->
        </li>
      </ul>
    </div>
    <!-- <div class="marquee_box_popup">
      <div class="marquee_box_popup_title">
        EOS3.0上线
        <span class="marquee_box_popup_close">X</span>
      </div>
      <div class="marquee_box_popup_content">EOS3.0上线EOS3.0上线EOS3.0上线EOS3.0上线EOS3.0上线EOS3.0上线EOS3.0上线EOS3.0上线EOS3.0上线EOS3.0上线EOS3.0上线EOS3.0上线EOS3.0上线EOS3.0上线EOS3.0上线EOS3.0上线</div>
    </div> -->
    <b-modal
      :visible="isShow"
      id="modal-dark"
      modal-class="modal-dark"
      :title="modalData.noticeTitle"
      hide-footer
      centered
      @hidden="modalHidden"
    >
      <b-card-text>
        {{modalData.noticeContent}}
      </b-card-text>
    </b-modal>
  </div>
</template>

<script>
import { BModal } from 'bootstrap-vue'

export default {
	components: {
    BModal,
  },
	props: {
		newsData: {
			type: Array,
			default: null,
		},
	},
	watch: {
		newsData: {
			handler(newVal, oldVal) {
				this.marqueeList = newVal
				this.newNum = 0
			},
			deep: true,
		}
	},
  data() {
    return {
      marqueeList: this.newsData,
      newNum: 0,
      animate: false,

      picker: null,
      isMousemoveTrue: false, // 是否移入
      isMouseoutTrue: false, // 是否移出
      isShow: false,
      modalData: {}
    }
  },
  mounted() {
    this.picker = setInterval(() => {
      this.animate = true;
      this.marqueeList.push(this.marqueeList[0]);
      this.marqueeList.shift();
      this.animate = false;
    }, 3000)
    this.$once('hook:beforeDestroy', function () {
      clearInterval(this.picker);
    })
  },
  methods: {
    // 鼠标移入
    mousemoveAnimate() {
      if(this.isShow || this.isMousemoveTrue) {
        return
      }
      clearInterval(this.picker);
      this.isMousemoveTrue = true
      this.isMouseoutTrue = false
    },

    // 鼠标移出
    mouseoutAnimate() {
      if(this.isShow || this.isMouseoutTrue) {
        return
      }
      this.isMouseoutTrue = true
      this.isMousemoveTrue = false
      this.picker = setInterval(() => {
        this.animate = true;
        this.marqueeList.push(this.marqueeList[0]);
        this.marqueeList.shift();
        this.animate = false;
      }, 3000)
      this.$once('hook:beforeDestroy', function () {
        clearInterval(this.picker);
      })
    },

    // 鼠标点击
    clickNew(item) {
      this.modalData = item
      this.isShow = true
      this.isMousemoveTrue = true
      this.isMouseoutTrue = false
      clearInterval(this.picker)
    },

    // 弹框隐藏
    modalHidden() {
      this.isShow = false
      this.isMouseoutTrue = true
      this.isMousemoveTrue = false
      this.picker = setInterval(() => {
        this.animate = true;
        this.marqueeList.push(this.marqueeList[0]);
        this.marqueeList.shift();
        this.animate = false;
      }, 3000)
      this.$once('hook:beforeDestroy', function () {
        clearInterval(this.picker);
      })
    }
  },
}
</script>

<style>
  .marquee {
    width: 100%;
    height: 50px;
    align-items: center;
    color: #3A3A3A;
    background-color: #c0c4cc26;
    display: flex;
    box-sizing: border-box;
    position: relative;
  }

  .marquee_title {
    padding: 0 30px;
    /* padding-top: 5px; */
    height: 30px;
    font-size: 14px;
    border-right: 1px solid #d8d8d8;
    align-items: center;
  }

  .marquee_box {
    display: block;
    position: relative;
    width: 60%;
    height: 30px;
    overflow: hidden;
  }

  .marquee_list {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }

  .marquee_top {
    transition: all 0.5s;
    margin-top: -30px
  }

  .marquee_list li {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    padding-left: 20px;
    position: relative;
  }

  .marquee_list li span {
    padding: 0 2px;
    cursor: pointer;
  }
  .marquee .marquee_box_popup {
    position: absolute;
    right: 50%;
    transform: translateX(50%);
    bottom: 110%;
    min-width: 400px;
    min-height: 200px;
    max-width: 500px;
    padding: 10px 20px;
    border-radius: 10px;
    background-color: #fff;
    border: 1px solid #eee;
    /* box-shadow: 0px 10px 5px #eee; */
    z-index: 10;
  }

  .marquee .marquee_box_popup_title {
    font-weight: bold;
    position: relative;
    height: 30px;
    line-height: 30px;
  }
  .marquee_box_popup_close {
    position: absolute;
    top: 0;
    right: -10px;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    border: 1px solid #c0c4cc;
    border-radius: 50%;
    color: #c0c4cc;
    font-weight: normal;
    cursor: pointer;
  }
  .marquee .marquee_box_popup_content {
    text-align: left;
    line-height: 28px;
    margin-top: 10px;
  }

  .red {
    color: #FF0101;
  }

  ul, li {
    margin: 0;
    padding: 0;
    /* display: flex; */
    box-sizing: border-box;
  }

  .modal .modal-header .close {
    transform: translate(0px, 0px) !important;
    box-shadow: 0 5px 20px 0 rgb(255 255 255 / 10%) !important;
    background: transparent !important;
  }
</style>
