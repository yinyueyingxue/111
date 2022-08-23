 
<template>
  <!-- Tabs with card integration -->
<div align="center">
<b-form  >
  <b-tabs v-model="tabIndex">
    <b-tab title="详细信息">
     <b-row>
     	<b-col cols="12">
			<b-input-group class="input-group-merge">
				<b-form-textarea v-model="wikiForm.describe"/>
			</b-input-group>
     	</b-col >    	  
     </b-row>
    </b-tab>
    <b-tab title="入参" >
    <b-row>
		    <b-col
		            md="3"
		            class="envClass"
		    >
		        <h5>入参名</h5>
		    </b-col>
		    <b-col
		            md="2"
		            class="envClass"
		    >
		        <h5>入参类型</h5>
		    </b-col>
			<b-col
			        md="2"
			        class="envClass"
			>
			    <h5>必填</h5>
			</b-col>
			<b-col
			        md="3"
			        class="envClass"
			>
			    <h5>备注</h5>
			</b-col>
		    <b-col
		            md="2"
		            class="envClass"
		    >
		        <b-button
		                size="sm"
		                @click="addItem(1)"
		              
		                variant="flat-success"
		        >
		            <feather-icon
		                    icon="PlusIcon"
		            />
		        </b-button>
		    </b-col>
		    <b-col md="12">
		        <b-row ref="row" v-for="(item, index) in items" :key="index + item.name">
					<b-col md="3">
					    <b-form-group>
					        <b-form-input
					              
					                placeholder="入参名"
					                v-model="item.name"
					        />
					    </b-form-group>
					</b-col>
		            <b-col md="2">
		                <b-form-group>
		                    <b-form-input
		                          
		                            placeholder="入参类型"
		                            v-model="item.type"
		                    />
		                </b-form-group>
		            </b-col>
					<b-col md="2">
					    <b-form-group>
					        <b-form-input					               
					                v-model="item.flag"
					                placeholder="是/否"
					        />
					    </b-form-group>
					</b-col>
		            <b-col md="3">
		                <b-form-group>
		                    <b-form-input
		                           
		                            v-model="item.remark"
		                            placeholder="备注"
		                    />
		                </b-form-group>
		            </b-col>
		            <!-- Remove Button -->
		            <b-col
		                    md="2"
		                   
		            >
		                <b-button
		                        size="sm"
		                        @click="removeItem(index,1)"
		                        variant="flat-danger"
		                >
		                <feather-icon icon="MinusIcon" class="mr-25"/>
		                </b-button>
		            </b-col>		   
		        </b-row>
		    </b-col>
		</b-row>
   	

    </b-tab>
	
	
	<b-tab
	   title="出参"      
	 >
	<b-row>
			    <b-col
			            md="3"
			           
			    >
			        <h5>出参名</h5>
			    </b-col>
			    <b-col
			            md="3"
			          
			    >
			        <h5>出参类型</h5>
			    </b-col>
				<b-col
				        md="3"
				      
				>
				    <h5>备注</h5>
				</b-col>
			    <b-col
			            md="2"
			            class="envClass"
			    >
			        <b-button
			                size="sm"
			                @click="addItem(0)"
			            
			                variant="flat-success"
			        >
			            <feather-icon
			                    icon="PlusIcon"
			            />
			        </b-button>
			    </b-col>
			    <b-col md="12">
			        <b-row
			                v-for="(item, index) in outItems"
			                :id="item.id"
			                :key="item.id"
			                ref="row"
			        >
			
			            <!-- Item Name -->
						<b-col md="3">
						    <b-form-group>
						        <b-form-input
						                
						                placeholder="出参名"
						                v-model="item.name"
						        />
						    </b-form-group>
						</b-col>
			            <b-col md="3">
			                <b-form-group>
			                    <b-form-input
			                            placeholder="出参类型"
			                            v-model="item.type"
			                    />
			                </b-form-group>
			            </b-col>
			            <b-col md="3">
			                <b-form-group>
			                    <b-form-input			                         
			                            v-model="item.remark"
			                            placeholder="备注"
			                    />
			                </b-form-group>
			            </b-col>
			            <!-- Remove Button -->
			            <b-col md="2" >
			                <b-button
			                        size="sm"
			                        @click="removeItem(index,0)"
			                   
			                        variant="flat-danger"
			                >
			                    <feather-icon
			                            icon="MinusIcon"
			                            class="mr-25"
			                    />
			                </b-button>
			            </b-col>
			           
			        </b-row>
			    </b-col>
			</b-row>
	 </b-tab>
	
   <!-- <b-tab title="">
     
    </b-tab> -->
  </b-tabs>
</b-form>
  <!-- Control buttons-->
  <div class="text-center">
    <b-button-group class="mt-1">
      <b-button
        variant="outline-primary"
        @click="updateApiDes()"
      >
        提交
      </b-button>
    </b-button-group>
  </div>
  </div>
</template>

<script>
import {
		$themeConfig
} from "@themeConfig"
export default {
  data: () => ({
    tabIndex: 0,
	items: [],
	wikiForm: {},
	outItems:[]
  }),
  props:{
	  formData: {
	      type: Object,
	      default: {}
	  } 
  },
  mounted() {
  	 if(this.formData.wiki != '' &&  this.formData.wiki != 'undefine' &&  this.formData.wiki != null ){
	 
		this.wikiForm = JSON.parse(this.formData.wiki)
		if(this.wikiForm.items != ''){
			this.items = this.wikiForm.items
		}		
		if(this.wikiForm.outItems != ''){
			this.outItems = this.wikiForm.outItems
		}		
	 }
  },
  methods: {
	  addItem(type ){
		let data = {
			name:'',
			type: '',
			remark:''					
		}
		if(type === 1){
		  this.items.push(data)
		}else{
		  this.outItems.push(data)
		}
	  },
	  updateApiDes(){
		this.wikiForm.items = this.items
		this.wikiForm.outItems = this.outItems
		let _data = {
			curl: $themeConfig.app.httpUrl + '/api-manage/v1.0/view/updateViewWiki',
			//curl: 'http://localhost:8020/view/updateViewWiki',
			wiki : JSON.stringify(this.wikiForm),
			id : this.formData.id
		}
		this.$store.dispatch("httpPost",_data).then((res) => {
			if (res.flag) {
				this.$parent.$bvModal.hide("modal-multi-4")
				this.$parent.$parent.$parent.getDataSourceList()
				this.$parent.$parent.$parent.$bvToast.toast("修改成功", {
				    title: '操作提示',
				  toaster: 'b-toaster-top-center',
				  solid: true,
				    variant: 'success',
				    autoHideDelay: 2000,
				})
				
				
			} else {
				this.$parent.$parent.$parent.$bvToast.toast(res.message, {
					title: "操作提示",
          toaster: 'b-toaster-top-center',
          solid: true,
					variant: "danger",
					autoHideDelay: 2000
				})
			}
		})
	  },
	  removeItem(index,type){
		if(type === 1){
		  this.items.splice(index,1)
		} else {
		  this.outItems.splice(index,1)
		}
	  },
  }
}
</script>
