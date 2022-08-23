<template>
	<div class="ssoLogin" />
</template>
<script>
	import { urlHttp } from '@/utils/constant'
	import { $themeConfig } from '@themeConfig'
	import md5 from 'blueimp-md5'
	import Identicon from 'identicon.js'
	import store from '../store/index'
	export default {
		name: 'SsoLogin',
		data() {
			return {
				urlHttp: urlHttp
			}
		},
		mounted() {
			if (this.$route.query.ResponseTicket == null || this.$route.query.ResponseTicket == undefined) {
				this.ssoLogin()
			} else {
				this.getToken()
			}
		},
		methods: {
			ssoLogin() {
				const that = this
				const domain = window.location.host
				that.$store.dispatch('httpGet', {
					"curl": $themeConfig.app.apaasHttpUrl + "/eos_common/ssoLoginUrl",
					"RequestUrl": urlHttp
				}).then(function(res) {
					if (res.flag) {
						window.location.href = res.ssoLoginUrl
					} else {
						that.$message({
							message: res.message,
							type: 'warning'
						})
					}
				}, function(err) {
					console.log('err', err.message)
				})
			},
			
			hash(str) {
				var hash = 5381;
				var i = str.length;
				while (i) {
					hash = (hash * 33) ^ str.charCodeAt(--i);
				}
				return hash >>> 0;
			},
			getToken() {
				console.log('获取token')
				const urlToken = window.location.search
				var oGetVars = {}
				// var resToken
				const that = this
				if (urlToken.length > 1) {
					for (var aItKey, nKeyId = 0, aCouples = urlToken.substr(1).split('&'); nKeyId < aCouples.length; nKeyId++) {
						aItKey = aCouples[nKeyId].split('=')
						oGetVars[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : ''
					}
				}
				console.log(oGetVars, 'ticket')
				if (oGetVars.ResponseTicket == '' || oGetVars.ResponseTicket == undefined) {
					this.$store.commit('getToken', '')
					window.location.reload()
				} else {
					// 如果ssoPath 是ssoLogin 的话就跳到首页
					that.$store.commit('getToken', oGetVars.ResponseTicket)
					let _data = {
						curl: $themeConfig.app.userHttpUrl + '/account/token',
						ticket: oGetVars.ResponseTicket
					}
					that.$store.dispatch('httpGet', _data).then(function(res) {
						if (res.flag) {			
							const md5Str = md5(res.data.info.account)
							
							console.log(md5Str)
							const data = new  Identicon(md5Str, 420).toString();
							 res.data.info.remark=data
							that.$store.commit('getJwtToken', res.data.token)
							that.$store.commit('getUserInfo', res.data.info)
						} else {
							that.$message({
								message: res.message,
								type: 'warning'
							})
						}
					}, function(err) {
						console.log('err', err.message)
					})

					if (that.$store.state.myRequest.ssoPath == '' || that.$store.state.myRequest.ssoPath == undefined) {
						that.$router.push({
							path: "/workplace"
						})
					} else {
						// if (that.$store.state.Login.token401 == true) {
						that.$router.push({
							path: that.$store.state.myRequest.ssoPath
						})
						// } else {
						//   that.$store.commit('getToken401', false)
						//   store.commit('getLoginFlag', false)
						//   store.commit('getTokenFlag', true) // 直接输入sso地址 用到
						//   that.$router.push({
						//     path: that.$store.state.Login.ssoPath
						//   })
						// }
					}
				}
			},
			// getLoginInfo() {
			//   const that = this
			//   that.$store.dispatch('ssoLogin', {
			//     'responseTicket': that.$store.state.Login.token,
			//     'url': that.urlHttp
			//   }).then(function(res) {
			//     if (res.flag) {
			//       that.getUserInfo()
			//     } else {
			//       that.$message({
			//         message: res.message,
			//         type: 'warning'
			//       })
			//     }
			//   }, function(err) {
			//     console.record('err', err.message)
			//   })
			// },
			// getUserInfo() {
			//   const that = this
			//   that.$store.commit('getUserInfo', '')
			//   that.$store.dispatch('httpPost', {
			//     'curl': '/user/getUserRoles',
			//     'data':{}
			//   }).then(function(res) {
			//       that.$store.commit('authAddApp', res ? false : true)
			//   }, function(err) {
			//     console.record('err', err.msg)
			//   })

			//   that.$store.dispatch('loginUserInfoGet', {}).then(function(res) {
			//     const _resUserInfo = {
			//       'domainAccount': res.domainAccount,
			//       'realName': res.realName
			//     }
			//     that.$store.commit('getUserInfo', _resUserInfo)
			//     that.getResMenuList()
			//   }, function(err) {
			//     console.record('err', err.msg)
			//   })
			// },
		}
	}
</script>
<style lang="scss" scoped></style>
